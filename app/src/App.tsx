import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { MermaidPreview } from "@/components/MermaidPreview"
import { useStore } from "@/store/useStore"
import { invoke } from "@tauri-apps/api/core"
import { Loader2, Copy, Check, Plus, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"

function App() {
  const {
    promptTemplate, setPromptTemplate,
    requirements, setRequirements,
    generatedTasks, setGeneratedTasks,
    generatedArchitecture, setGeneratedArchitecture,
    isLoading, setIsLoading,
    projects, currentProjectId, openaiKey,
    loadAllData, saveOpenAIKey, createProject, selectProject, deleteProject
  } = useStore()
  
  const [copied, setCopied] = useState<string | null>(null)
  const [newProjectName, setNewProjectName] = useState<string>('')
  const [showNewProjectInput, setShowNewProjectInput] = useState(false)

  useEffect(() => {
    const initializeApp = async () => {
      // Try to migrate from localStorage if this is first run
      try {
        const localStorageData = localStorage.getItem('estimation-storage')
        if (localStorageData) {
          const parsed = JSON.parse(localStorageData)
          const state = parsed.state || {}
          
          // Check if we have data to migrate
          if (state.requirements || state.generatedTasks || state.generatedArchitecture || state.promptTemplate) {
            const projectId = await invoke<number>('migrate_localstorage_data', {
              openaiKey: null, // API key was not stored in localStorage
              requirements: state.requirements || null,
              generatedTasks: state.generatedTasks || null,
              generatedArchitecture: state.generatedArchitecture || null,
              promptTemplate: state.promptTemplate || null,
            })
            
            // Clear localStorage after successful migration
            localStorage.removeItem('estimation-storage')
            console.log('Migrated data from localStorage to SQLite')
          }
        }
      } catch (error) {
        console.error('Migration error (this is OK if no previous data):', error)
      }
      
      // Load all data from SQLite
      await loadAllData()
    }
    
    initializeApp()
  }, [loadAllData])

  const handleApiKeyChange = async (key: string) => {
    if (key) {
      try {
        await saveOpenAIKey(key)
      } catch (e) {
        console.error('Error setting API key:', e)
      }
    }
  }

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return
    try {
      const projectId = await createProject(newProjectName.trim())
      await selectProject(projectId)
      setNewProjectName('')
      setShowNewProjectInput(false)
    } catch (e) {
      alert('Error creating project: ' + (e as Error).message)
    }
  }

  const handleSelectProject = async (projectId: number) => {
    try {
      await selectProject(projectId)
    } catch (e) {
      alert('Error selecting project: ' + (e as Error).message)
    }
  }

  const handleDeleteProject = async (projectId: number) => {
    if (!confirm('Bạn có chắc muốn xóa project này?')) return
    try {
      await deleteProject(projectId)
    } catch (e) {
      alert('Error deleting project: ' + (e as Error).message)
    }
  }

  const handleGenerateTasks = async () => {
    if (!openaiKey || !requirements) return
    setIsLoading(true)
    try {
      const result = await invoke<string>('generate_tasks', {
        promptTemplate,
        requirements
      })
      setGeneratedTasks(result)
    } catch (e) {
      alert('Error: ' + (e as Error).message)
    }
    setIsLoading(false)
  }

  const handleGenerateArchitecture = async () => {
    if (!openaiKey || !requirements) return
    setIsLoading(true)
    try {
      const result = await invoke<string>('generate_architecture', {
        requirements
      })
      setGeneratedArchitecture(result)
    } catch (e) {
      alert('Error: ' + (e as Error).message)
    }
    setIsLoading(false)
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const extractMermaidCode = (text: string) => {
    const match = text.match(/```mermaid\n([\s\S]*?)```/)
    return match ? match[1].trim() : text
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Estimation App</h1>
          
          <div className="flex items-center gap-2">
            <select
              value={currentProjectId || ''}
              onChange={(e) => {
                const id = e.target.value ? parseInt(e.target.value) : null
                if (id) handleSelectProject(id)
              }}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="">-- Chọn Project --</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            
            {showNewProjectInput ? (
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Tên project..."
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreateProject()
                    if (e.key === 'Escape') {
                      setShowNewProjectInput(false)
                      setNewProjectName('')
                    }
                  }}
                  className="w-48"
                  autoFocus
                />
                <Button size="sm" onClick={handleCreateProject}>
                  Tạo
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setShowNewProjectInput(false)
                    setNewProjectName('')
                  }}
                >
                  Hủy
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowNewProjectInput(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            )}
            
            {currentProjectId && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDeleteProject(currentProjectId)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">OpenAI API Key</label>
          <Input
            type="password"
            placeholder="sk-..."
            value={openaiKey}
            onChange={(e) => handleApiKeyChange(e.target.value)}
          />
        </div>

        <Tabs defaultValue="requirements" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="template">Prompt Template</TabsTrigger>
            <TabsTrigger value="tasks">Tasks & Estimates</TabsTrigger>
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
          </TabsList>

          <TabsContent value="requirements" className="space-y-4">
            <Textarea
              placeholder="Nhập requirements của dự án..."
              className="min-h-[400px] font-mono text-sm"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
            />
            <div className="flex gap-2">
              <Button onClick={handleGenerateTasks} disabled={isLoading || !openaiKey || !requirements}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Tasks
              </Button>
              <Button variant="outline" onClick={handleGenerateArchitecture} disabled={isLoading || !openaiKey || !requirements}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Architecture
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="template" className="space-y-4">
            <Textarea
              placeholder="Prompt template..."
              className="min-h-[400px] font-mono text-sm"
              value={promptTemplate}
              onChange={(e) => setPromptTemplate(e.target.value)}
            />
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4">
            <div className="relative">
              <Textarea
                readOnly
                placeholder="Generated tasks will appear here..."
                className="min-h-[400px] font-mono text-sm"
                value={generatedTasks}
              />
              {generatedTasks && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(generatedTasks, 'tasks')}
                >
                  {copied === 'tasks' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              )}
            </div>
          </TabsContent>

          <TabsContent value="architecture" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <label className="text-sm font-medium mb-2 block">Mermaid Code</label>
                <Textarea
                  readOnly
                  placeholder="Generated mermaid code will appear here..."
                  className="min-h-[350px] font-mono text-sm"
                  value={generatedArchitecture}
                />
                {generatedArchitecture && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-8 right-2"
                    onClick={() => copyToClipboard(extractMermaidCode(generatedArchitecture), 'arch')}
                  >
                    {copied === 'arch' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                )}
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Preview</label>
                <div className="border rounded-md p-4 min-h-[350px] bg-white overflow-auto">
                  <MermaidPreview code={extractMermaidCode(generatedArchitecture)} />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App
