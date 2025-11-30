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
    // Khởi tạo Mermaid một lần
    mermaid.initialize({
      startOnLoad: false,
      theme: "default",
      securityLevel: "loose",
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
      className="min-h-[350px] flex items-center justify-center overflow-auto"
    />
  )
}

