import { useEffect, useRef, useState, useCallback } from "react"
import mermaid from "mermaid"
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MermaidPreviewProps {
  code: string
}

export function MermaidPreview({ code }: MermaidPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgWrapperRef = useRef<HTMLDivElement>(null)
  const mermaidElementRef = useRef<HTMLPreElement | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const isRenderingRef = useRef(false)
  const renderIdRef = useRef(0)
  
  // Zoom và Pan state
  const [zoomLevel, setZoomLevel] = useState(1.0)
  const [panX, setPanX] = useState(0)
  const [panY, setPanY] = useState(0)
  const [isPanning, setIsPanning] = useState(false)
  const [panStartX, setPanStartX] = useState(0)
  const [panStartY, setPanStartY] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    // Khởi tạo Mermaid một lần với config cho Tauri
    mermaid.initialize({
      startOnLoad: false,
      theme: "default",
      securityLevel: "loose",
      fontFamily: "system-ui, -apple-system, sans-serif",
      suppressErrorRendering: false,
    })
  }, [])

  // Reset zoom và pan khi code thay đổi
  useEffect(() => {
    setZoomLevel(1.0)
    setPanX(0)
    setPanY(0)
  }, [code])

  // IntersectionObserver để detect visibility
  useEffect(() => {
    if (!containerRef.current) return

    let wasVisible = false

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isCurrentlyVisible = entry.isIntersecting && entry.intersectionRatio > 0
          
          setIsVisible((prevVisible) => {
            wasVisible = prevVisible
            return isCurrentlyVisible
          })
          
          // Force re-render khi element trở nên visible từ hidden
          if (isCurrentlyVisible && !wasVisible && code) {
            console.log('Element became visible, triggering re-render')
            // Increment render ID để trigger re-render
            renderIdRef.current += 1
          } else if (!isCurrentlyVisible && wasVisible) {
            console.log('Element became hidden')
          }
        })
      },
      {
        threshold: 0.1, // Trigger khi 10% element visible
        rootMargin: '0px',
      }
    )

    observer.observe(containerRef.current)

    // Initial check - nếu element đã visible ngay từ đầu
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const isInitiallyVisible = rect.width > 0 && rect.height > 0 && 
        rect.top < window.innerHeight && rect.bottom > 0
      if (isInitiallyVisible) {
        setIsVisible(true)
        wasVisible = true
      }
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current)
      }
    }
  }, [code])

  // Zoom handlers
  const handleZoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(prev + 0.2, 5.0))
  }, [])

  const handleZoomOut = useCallback(() => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5))
  }, [])

  const handleResetZoom = useCallback(() => {
    setZoomLevel(1.0)
    setPanX(0)
    setPanY(0)
  }, [])

  // Mouse wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!svgWrapperRef.current) return
    
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    const newZoom = Math.max(0.5, Math.min(5.0, zoomLevel + delta))
    
    if (newZoom !== zoomLevel) {
      // Zoom to point - tính toán pan để zoom tại vị trí con trỏ
      const rect = svgWrapperRef.current.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top
      
      const zoomFactor = newZoom / zoomLevel
      const newPanX = mouseX - (mouseX - panX) * zoomFactor
      const newPanY = mouseY - (mouseY - panY) * zoomFactor
      
      setZoomLevel(newZoom)
      setPanX(newPanX)
      setPanY(newPanY)
    }
  }, [zoomLevel, panX, panY])

  // Pan handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoomLevel <= 1.0) return
    if (e.button !== 0) return // Chỉ handle left mouse button
    
    setIsPanning(true)
    setPanStartX(e.clientX - panX)
    setPanStartY(e.clientY - panY)
    e.preventDefault()
  }, [zoomLevel, panX, panY])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isPanning || zoomLevel <= 1.0) return
    
    setPanX(e.clientX - panStartX)
    setPanY(e.clientY - panStartY)
  }, [isPanning, zoomLevel, panStartX, panStartY])

  const handleMouseUp = useCallback(() => {
    setIsPanning(false)
  }, [])

  // Kiểm tra xem có đang chạy trong Tauri không
  const isTauri = typeof window !== 'undefined' && '__TAURI__' in window

  // Fullscreen handlers với Tauri support
  const handleFullscreen = useCallback(async () => {
    try {
      if (isTauri) {
        // Sử dụng Tauri WebviewWindow API với dynamic import
        try {
          const { WebviewWindow } = await import('@tauri-apps/api/webviewWindow')
          const window = WebviewWindow.getCurrent()
          const currentFullscreen = await window.isFullscreen()
          await window.setFullscreen(!currentFullscreen)
          setIsFullscreen(!currentFullscreen)
        } catch (tauriError) {
          // Trong Tauri, browser Fullscreen API không hoạt động trong WebView
          // Nên không fallback, chỉ log error để debug
          console.error('Tauri window API not available:', tauriError)
        }
      } else {
        // Fallback về browser Fullscreen API
        if (!containerRef.current) return

        const element = containerRef.current
        
        // Kiểm tra fullscreen state với vendor prefixes
        const isFullscreen = !!(
          document.fullscreenElement ||
          (document as any).webkitFullscreenElement ||
          (document as any).mozFullScreenElement ||
          (document as any).msFullscreenElement
        )

        if (!isFullscreen) {
          // Request fullscreen với vendor prefixes
          if (element.requestFullscreen) {
            await element.requestFullscreen()
            setIsFullscreen(true)
          } else if ((element as any).webkitRequestFullscreen) {
            await (element as any).webkitRequestFullscreen()
            setIsFullscreen(true)
          } else if ((element as any).mozRequestFullScreen) {
            await (element as any).mozRequestFullScreen()
            setIsFullscreen(true)
          } else if ((element as any).msRequestFullscreen) {
            await (element as any).msRequestFullscreen()
            setIsFullscreen(true)
          } else {
            // Browser không hỗ trợ Fullscreen API
            // Không log warning vì có thể đang chạy trong Tauri WebView
            // (Trong Tauri WebView, browser Fullscreen API không hoạt động, đó là bình thường)
            return
          }
        } else {
          // Exit fullscreen với vendor prefixes
          if (document.exitFullscreen) {
            await document.exitFullscreen()
          } else if ((document as any).webkitExitFullscreen) {
            await (document as any).webkitExitFullscreen()
          } else if ((document as any).mozCancelFullScreen) {
            await (document as any).mozCancelFullScreen()
          } else if ((document as any).msExitFullscreen) {
            await (document as any).msExitFullscreen()
          }
          setIsFullscreen(false)
        }
      }
    } catch (err) {
      console.error('Error toggling fullscreen:', err)
    }
  }, [isTauri])

  // Listen to fullscreen changes
  useEffect(() => {
    if (isTauri) {
      // Sử dụng Tauri WebviewWindow events với dynamic import
      const setupTauriFullscreen = async () => {
        try {
          const { WebviewWindow } = await import('@tauri-apps/api/webviewWindow')
          const window = WebviewWindow.getCurrent()
          
          // Kiểm tra trạng thái ban đầu
          const fullscreen = await window.isFullscreen()
          setIsFullscreen(fullscreen)

          // Listen to window resize events để detect fullscreen changes
          const unlisten = await window.onResized(async () => {
            const isFs = await window.isFullscreen()
            setIsFullscreen(isFs)
          })

          return unlisten
        } catch (tauriError) {
          // Tauri API không khả dụng - có thể do chưa sẵn sàng hoặc lỗi import
          // Không log warning để tránh noise trong console
          // Fullscreen sẽ không hoạt động trong trường hợp này
          return null
        }
      }

      let cleanup: (() => void) | null = null
      setupTauriFullscreen().then(unlisten => {
        if (unlisten) cleanup = unlisten
      })

      return () => {
        if (cleanup) cleanup()
      }
    } else {
      // Browser Fullscreen API với vendor prefixes
      const handleFullscreenChange = () => {
        const isFullscreen = !!(
          document.fullscreenElement ||
          (document as any).webkitFullscreenElement ||
          (document as any).mozFullScreenElement ||
          (document as any).msFullscreenElement
        )
        setIsFullscreen(isFullscreen)
      }

      document.addEventListener('fullscreenchange', handleFullscreenChange)
      document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.addEventListener('mozfullscreenchange', handleFullscreenChange)
      document.addEventListener('MSFullscreenChange', handleFullscreenChange)
      
      return () => {
        document.removeEventListener('fullscreenchange', handleFullscreenChange)
        document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
        document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
        document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
      }
    }
  }, [isTauri])

  // Mouse move và up listeners cho panning
  useEffect(() => {
    if (isPanning) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isPanning, handleMouseMove, handleMouseUp])

  useEffect(() => {
    if (!code || !containerRef.current) {
      return
    }

    // Chỉ render khi element visible
    if (!isVisible) {
      console.log('Element not visible, skipping render')
      return
    }

    // Tránh multiple concurrent renders
    if (isRenderingRef.current) {
      console.log('Render already in progress, skipping')
      return
    }

    const currentRenderId = ++renderIdRef.current
    let isCancelled = false

    const renderDiagram = async () => {
      isRenderingRef.current = true
      setIsLoading(true)
      setError(null)

      try {
        // Kiểm tra lại visibility trước khi render
        if (!containerRef.current || isCancelled) {
          return
        }

        // Kiểm tra xem render này có còn valid không
        if (currentRenderId !== renderIdRef.current) {
          console.log('Render ID mismatch, cancelling old render')
          return
        }

        // Xóa nội dung cũ trong wrapper
        if (svgWrapperRef.current) {
          svgWrapperRef.current.innerHTML = ""
        }

        // Kiểm tra lại sau khi clear để đảm bảo container vẫn tồn tại
        if (!svgWrapperRef.current || !containerRef.current || isCancelled) {
          return
        }

        // Kiểm tra lại render ID
        if (currentRenderId !== renderIdRef.current) {
          return
        }

        // Tạo element với class mermaid để sử dụng với mermaid.run()
        const mermaidElement = document.createElement('pre')
        mermaidElement.className = 'mermaid'
        mermaidElement.textContent = code
        mermaidElementRef.current = mermaidElement

        if (svgWrapperRef.current) {
          svgWrapperRef.current.appendChild(mermaidElement)

          // Đợi một chút để đảm bảo element đã được append vào DOM
          // Điều này quan trọng cho Tauri WebView
          await new Promise(resolve => setTimeout(resolve, 0))

          if (isCancelled || !svgWrapperRef.current) {
            return
          }

          // Sử dụng mermaid.run() để render diagram
          // mermaid.run() có thể được gọi với nodes cụ thể hoặc không có tham số
          try {
            await mermaid.run({
              nodes: [mermaidElement],
            })
          } catch (runError) {
            // Fallback: thử gọi mermaid.run() không có tham số
            // Đảm bảo element đã được append vào DOM trước
            await mermaid.run()
          }

          if (isCancelled || !svgWrapperRef.current) {
            return
          }

          // Sau khi render, tìm SVG element và đảm bảo nó hiển thị đúng
          // Đợi một chút để SVG được render hoàn toàn
          await new Promise(resolve => setTimeout(resolve, 50))

          if (isCancelled || !svgWrapperRef.current) {
            return
          }

          const svgElement = svgWrapperRef.current.querySelector('svg')
          if (svgElement && svgWrapperRef.current) {
            // Check và fix viewBox nếu null
            let viewBoxAttr = svgElement.getAttribute('viewBox')
            
            if (!viewBoxAttr || viewBoxAttr === 'null') {
              try {
                // Try to get bounding box of SVG content
                const bbox = svgElement.getBBox()
                if (bbox && bbox.width > 0 && bbox.height > 0) {
                  const padding = 20
                  const viewBox = `${bbox.x - padding} ${bbox.y - padding} ${bbox.width + padding * 2} ${bbox.height + padding * 2}`
                  svgElement.setAttribute('viewBox', viewBox)
                  console.log('Set viewBox from bbox:', viewBox)
                } else {
                  // Fallback viewBox
                  svgElement.setAttribute('viewBox', '0 0 1200 800')
                  console.log('Set fallback viewBox: 0 0 1200 800')
                }
              } catch (e) {
                // If getBBox fails, use fallback
                svgElement.setAttribute('viewBox', '0 0 1200 800')
                console.log('getBBox failed, set fallback viewBox:', e)
              }
            }
            
            // Lấy viewBox để đảm bảo SVG có viewBox hợp lệ
            viewBoxAttr = svgElement.getAttribute('viewBox')
            if (viewBoxAttr && viewBoxAttr !== 'null') {
              // Lấy kích thước wrapper
              const wrapperRect = svgWrapperRef.current.getBoundingClientRect()
              const wrapperWidth = wrapperRect.width
              const wrapperHeight = wrapperRect.height
              
              // Set SVG dimensions để fit wrapper ban đầu
              svgElement.style.width = `${wrapperWidth}px`
              svgElement.style.height = `${wrapperHeight}px`
              svgElement.style.display = 'block'
              svgElement.style.visibility = 'visible'
              svgElement.style.opacity = '1'
              
              // Đảm bảo preserveAspectRatio
              svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet')
              
              console.log('Mermaid SVG rendered:', {
                wrapperSize: { width: wrapperWidth, height: wrapperHeight },
                viewBox: viewBoxAttr
              })
            } else {
              // Fallback nếu không có viewBox
              svgElement.style.display = 'block'
              svgElement.style.visibility = 'visible'
              svgElement.style.opacity = '1'
            }
            
            // Force reflow để đảm bảo layout được tính toán
            svgElement.getBoundingClientRect()
          } else {
            console.warn('SVG element not found after mermaid.run()')
          }
        }
      } catch (err) {
        if (!isCancelled && currentRenderId === renderIdRef.current) {
          const errorMessage = err instanceof Error ? err.message : "Failed to render Mermaid diagram"
          setError(errorMessage)
          console.error("Mermaid render error:", err)
        }
      } finally {
        if (currentRenderId === renderIdRef.current) {
          isRenderingRef.current = false
          if (!isCancelled) {
            setIsLoading(false)
          }
        }
      }
    }

    renderDiagram()

    // Cleanup function - chỉ cleanup khi component unmount hoặc code thay đổi
    return () => {
      isCancelled = true
      // Chỉ xóa nội dung nếu đây là render cuối cùng và không đang render
      if (currentRenderId === renderIdRef.current) {
        // Đánh dấu render này đã bị cancel
        // Nhưng không xóa SVG ngay lập tức để tránh race condition
        // SVG sẽ được xóa bởi render mới hoặc khi component unmount
        isRenderingRef.current = false
      }
      mermaidElementRef.current = null
    }
  }, [code, isVisible])

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      // Chỉ cleanup khi component thực sự unmount
      isRenderingRef.current = false
      renderIdRef.current = 0
      if (svgWrapperRef.current) {
        svgWrapperRef.current.innerHTML = ""
      }
      mermaidElementRef.current = null
    }
  }, [])

  if (!code) {
    return (
      <p className="text-muted-foreground text-sm">No architecture generated yet</p>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[350px]">
        <p className="text-muted-foreground text-sm">Rendering diagram...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[350px] p-4">
        <p className="text-red-500 text-sm font-medium mb-2">Error rendering diagram:</p>
        <pre className="text-xs text-red-400 bg-red-50 p-2 rounded overflow-auto">
          {error}
        </pre>
        <p className="mt-4 text-xs text-muted-foreground">
          Copy code và paste vào <a href="https://mermaid.live" target="_blank" className="text-blue-500 underline">mermaid.live</a> để xem diagram
        </p>
      </div>
    )
  }

  return (
    <div 
      ref={containerRef} 
      className={`mermaid-container min-h-[350px] w-full h-full overflow-hidden relative ${isFullscreen ? 'fullscreen' : ''}`}
      suppressHydrationWarning
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      style={{ cursor: isPanning ? 'grabbing' : zoomLevel > 1.0 ? 'grab' : 'default' }}
    >
      <div
        ref={svgWrapperRef}
        className="mermaid-svg-wrapper w-full h-full"
        style={{
          transform: `translate(${panX}px, ${panY}px) scale(${zoomLevel})`,
          transformOrigin: '0 0',
        }}
      />
      
      {/* Zoom Controls */}
      <div className="absolute top-2 right-2 flex flex-col gap-2 z-10 bg-background/80 backdrop-blur-sm rounded-md p-1 border shadow-sm">
        <Button
          size="icon"
          variant="ghost"
          onClick={handleZoomIn}
          disabled={zoomLevel >= 5.0}
          title="Zoom In"
          className="h-8 w-8"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={handleZoomOut}
          disabled={zoomLevel <= 0.5}
          title="Zoom Out"
          className="h-8 w-8"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={handleResetZoom}
          disabled={zoomLevel === 1.0 && panX === 0 && panY === 0}
          title="Reset Zoom"
          className="h-8 w-8"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <div className="h-px bg-border my-1" />
        <Button
          size="icon"
          variant="ghost"
          onClick={handleFullscreen}
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          className="h-8 w-8"
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      {/* Zoom Level Display */}
      <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm rounded-md px-2 py-1 text-xs font-medium border shadow-sm z-10">
        {Math.round(zoomLevel * 100)}%
      </div>
    </div>
  )
}

