import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MermaidPreview } from "@/components/MermaidPreview"
import { useStore } from "@/store/useStore"
import { invoke } from "@tauri-apps/api/core"
import { Loader2, Copy, Check, Plus, Trash2, Edit } from "lucide-react"
import { useState, useEffect } from "react"

function App() {
  const {
    promptTemplate, setPromptTemplate,
    requirements, setRequirements,
    generatedTasks, setGeneratedTasks,
    generatedArchitecture, setGeneratedArchitecture,
    projects, currentProjectId, openaiKey,
    loadAllData, saveOpenAIKey, createProject, selectProject, deleteProject, updateProjectName
  } = useStore()
  
  const [copied, setCopied] = useState<string | null>(null)
  const [newProjectName, setNewProjectName] = useState<string>('')
  const [showNewProjectInput, setShowNewProjectInput] = useState(false)
  const [isEditingKey, setIsEditingKey] = useState(false)
  const [tempKeyValue, setTempKeyValue] = useState<string>('')
  const [loadingButton, setLoadingButton] = useState<'tasks' | 'architecture' | null>(null)
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null)
  const [editingProjectName, setEditingProjectName] = useState<string>('')

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
        setIsEditingKey(false)
      } catch (e) {
        console.error('Error setting API key:', e)
      }
    }
  }

  const handleEditKey = () => {
    setTempKeyValue(openaiKey)
    setIsEditingKey(true)
  }

  const handleSaveKey = async () => {
    if (tempKeyValue) {
      await handleApiKeyChange(tempKeyValue)
    }
  }

  const handleCancelEditKey = () => {
    setTempKeyValue('')
    setIsEditingKey(false)
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

  const handleEditProjectName = (projectId: number) => {
    const project = projects.find(p => p.id === projectId)
    if (project) {
      setEditingProjectId(projectId)
      setEditingProjectName(project.name)
    }
  }

  const handleSaveProjectName = async () => {
    if (!editingProjectId || !editingProjectName.trim()) return
    try {
      await updateProjectName(editingProjectId, editingProjectName.trim())
      setEditingProjectId(null)
      setEditingProjectName('')
    } catch (e) {
      alert('Error updating project name: ' + (e as Error).message)
    }
  }

  const handleCancelEditProjectName = () => {
    setEditingProjectId(null)
    setEditingProjectName('')
  }

  const handleGenerateTasks = async () => {
    if (!openaiKey || !requirements) return
    setLoadingButton('tasks')
    try {
      const result = await invoke<string>('generate_tasks', {
        promptTemplate,
        requirements
      })
      setGeneratedTasks(result)
    } catch (e) {
      alert('Error: ' + (e as Error).message)
    }
    setLoadingButton(null)
  }

  const handleGenerateArchitecture = async () => {
    if (!openaiKey || !requirements) return
    setLoadingButton('architecture')
    try {
      const result = await invoke<string>('generate_architecture', {
        requirements
      })
      setGeneratedArchitecture(result)
    } catch (e) {
      alert('Error: ' + (e as Error).message)
    }
    setLoadingButton(null)
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

  const currentProject = projects.find(p => p.id === currentProjectId)

  return (
    <div className="h-screen flex flex-col bg-background p-4 overflow-hidden">
      <div className="flex-shrink-0 space-y-4">
        <div className="flex items-center justify-between pb-4">
          <h1 className="text-2xl font-bold text-primary">Estimation App</h1>
          
          <div className="flex items-center gap-2">
            {currentProjectId && currentProject ? (
              editingProjectId === currentProjectId ? (
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Tên project..."
                    value={editingProjectName}
                    onChange={(e) => setEditingProjectName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveProjectName()
                      if (e.key === 'Escape') handleCancelEditProjectName()
                    }}
                    className="w-48"
                    autoFocus
                  />
                  <Button size="sm" onClick={handleSaveProjectName}>
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelEditProjectName}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditProjectName(currentProjectId)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Select
                    value={currentProjectId?.toString() || ''}
                    onValueChange={(value) => {
                      const id = value ? parseInt(value) : null
                      if (id) handleSelectProject(id)
                    }}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Chọn project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id.toString()}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )
            ) : (
              <Select
                value={currentProjectId?.toString() || ''}
                onValueChange={(value) => {
                  const id = value ? parseInt(value) : null
                  if (id) handleSelectProject(id)
                }}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="-- Chọn Project --" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
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
          {openaiKey && !isEditingKey ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Key đã được lưu</span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleEditKey}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Input
                type="password"
                placeholder="sk-..."
                value={tempKeyValue}
                onChange={(e) => setTempKeyValue(e.target.value)}
                className="flex-1"
              />
              <Button
                size="sm"
                onClick={handleSaveKey}
                disabled={!tempKeyValue}
              >
                Save
              </Button>
              {isEditingKey && openaiKey && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancelEditKey}
                >
                  Cancel
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <Tabs defaultValue="requirements" className="w-full flex flex-col flex-1 min-h-0">
          <TabsList className="grid w-full grid-cols-4 flex-shrink-0">
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="template">Prompt Template</TabsTrigger>
            <TabsTrigger value="tasks">Tasks & Estimates</TabsTrigger>
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
          </TabsList>

          <TabsContent value="requirements" className="flex flex-col flex-1 min-h-0 space-y-4 mt-4">
            <Textarea
              placeholder="Nhập requirements của dự án..."
              className="flex-1 font-mono text-sm"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
            />
            <div className="flex gap-2 flex-shrink-0">
              <Button onClick={handleGenerateTasks} disabled={loadingButton !== null || !openaiKey || !requirements}>
                {loadingButton === 'tasks' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Tasks
              </Button>
              <Button variant="secondary" onClick={handleGenerateArchitecture} disabled={loadingButton !== null || !openaiKey || !requirements}>
                {loadingButton === 'architecture' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Architecture
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="template" className="flex flex-col flex-1 min-h-0 mt-4">
            <Textarea
              placeholder="Prompt template..."
              className="flex-1 font-mono text-sm"
              value={promptTemplate}
              onChange={(e) => setPromptTemplate(e.target.value)}
            />
          </TabsContent>

          <TabsContent value="tasks" className="flex flex-col flex-1 min-h-0 mt-4">
            <div className="relative flex-1">
              <Textarea
                readOnly
                placeholder="Generated tasks will appear here..."
                className="h-full font-mono text-sm"
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

          <TabsContent value="architecture" className="flex flex-col flex-1 min-h-0 mt-4">
            <div className="grid grid-cols-2 gap-4 h-full">
              <div className="relative flex flex-col">
                <label className="text-sm font-medium mb-2 block flex-shrink-0">Mermaid Code</label>
                <Textarea
                  placeholder="Generated mermaid code will appear here..."
                  className="flex-1 font-mono text-sm overflow-auto"
                  value={generatedArchitecture}
                  onChange={(e) => setGeneratedArchitecture(e.target.value)}
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
              <div className="flex flex-col h-full">
                <label className="text-sm font-medium mb-2 block flex-shrink-0">Preview</label>
                <div className="border rounded-md p-4 flex-1 bg-white overflow-auto h-full min-h-0">
                  <MermaidPreview code={extractMermaidCode(generatedArchitecture)} />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
    </div>
  )
}

export default App
