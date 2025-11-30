import { useEffect, useRef, useState } from "react"
import mermaid from "mermaid"

interface MermaidPreviewProps {
  code: string
}

export function MermaidPreview({ code }: MermaidPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [svgId] = useState(() => `mermaid-${Math.random().toString(36).substr(2, 9)}`)

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

  useEffect(() => {
    if (!code || !containerRef.current) {
      return
    }

    const renderDiagram = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Xóa nội dung cũ
        if (containerRef.current) {
          containerRef.current.innerHTML = ""
        }

        // Render diagram mới
        const { svg } = await mermaid.render(svgId, code)
        
        if (containerRef.current) {
          containerRef.current.innerHTML = svg
          
          // Force SVG dimensions và visibility
          const svgElement = containerRef.current.querySelector('svg')
          if (svgElement) {
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
            
            svgElement.style.width = '100%'
            svgElement.style.minHeight = '300px'
            svgElement.style.height = 'auto'
            svgElement.style.display = 'block'
            svgElement.style.visibility = 'visible'
            
            // Force reflow
            const rect = svgElement.getBoundingClientRect()
            
            console.log('Mermaid SVG rendered:', {
              width: svgElement.style.width,
              height: rect.height,
              viewBox: svgElement.getAttribute('viewBox')
            })
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to render Mermaid diagram"
        setError(errorMessage)
        console.error("Mermaid render error:", err)
      } finally {
        setIsLoading(false)
      }
    }

    renderDiagram()
  }, [code, svgId])

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
      className="mermaid-container min-h-[350px] w-full overflow-auto"
      suppressHydrationWarning
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    />
  )
}

