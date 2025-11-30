import { create } from 'zustand'
import { invoke } from '@tauri-apps/api/core'

export interface Project {
  id: number
  name: string
  created_at: string
  updated_at: string
}

export interface ProjectData {
  id: number
  project_id: number
  requirements: string
  tasks: string
  architecture: string
  prompt_template: string
  updated_at: string
}

interface AppState {
  promptTemplate: string
  requirements: string
  generatedTasks: string
  generatedArchitecture: string
  isLoading: boolean
  projects: Project[]
  currentProjectId: number | null
  openaiKey: string
  setPromptTemplate: (template: string) => void
  setRequirements: (req: string) => void
  setGeneratedTasks: (tasks: string) => void
  setGeneratedArchitecture: (arch: string) => void
  setIsLoading: (loading: boolean) => void
  setProjects: (projects: Project[]) => void
  setCurrentProjectId: (id: number | null) => void
  setOpenaiKey: (key: string) => void
  loadAllData: () => Promise<void>
  saveOpenAIKey: (key: string) => Promise<void>
  createProject: (name: string) => Promise<number>
  selectProject: (id: number) => Promise<void>
  saveProjectData: () => Promise<void>
  deleteProject: (id: number) => Promise<void>
}

const DEFAULT_PROMPT = `# Important Notes

1. **Phạm vi công việc**
   * **Chỉ phát triển Backend API** (không bao gồm frontend).
   * Bao gồm cả **Batch Job implementation**.
   * **Không tính thời gian code review** trong từng task.

2. **Công nghệ**
   * Framework: **NestJS** (Node.js, TypeScript).
   * Thiết kế API theo **RESTful conventions** và **NestJS best practices**.

3. **Cách estimate**
   * **Chỉ tính Backend API development**.
   * **Dùng giờ chính xác** (exact hours), **không dùng khoảng giờ**.
   * 1 ngày làm việc = **7 giờ**.
   * Estimate dựa trên **độ phức tạp thực tế của từng requirement**
   * Estimate chi tiết cho từng endpoint, không gộp chung.

4. **Đối tượng developer**
   * **Junior Engineer** (2 năm kinh nghiệm).

5. **Đầu ra mong muốn**
   * Mỗi task cần:
     * **Mô tả chi tiết API endpoint** (path bằng tiếng Anh, method, RESTful conventions).
     * Liệt kê logic server-side chính.
     * Estimate số **giờ chính xác**.
   * Tạo **section title bằng tiếng Việt**.
   * Có **mục riêng cho Batch Jobs**.`

export const useStore = create<AppState>()((set, get) => ({
  promptTemplate: DEFAULT_PROMPT,
  requirements: '',
  generatedTasks: '',
  generatedArchitecture: '',
  isLoading: false,
  projects: [],
  currentProjectId: null,
  openaiKey: '',
  
  setPromptTemplate: (template) => {
    set({ promptTemplate: template })
    // Auto-save if there's a current project
    const state = get()
    if (state.currentProjectId) {
      state.saveProjectData().catch(console.error)
    }
  },
  
  setRequirements: (req) => {
    set({ requirements: req })
    // Auto-save if there's a current project
    const state = get()
    if (state.currentProjectId) {
      state.saveProjectData().catch(console.error)
    }
  },
  
  setGeneratedTasks: (tasks) => {
    set({ generatedTasks: tasks })
    // Auto-save if there's a current project
    const state = get()
    if (state.currentProjectId) {
      state.saveProjectData().catch(console.error)
    }
  },
  
  setGeneratedArchitecture: (arch) => {
    set({ generatedArchitecture: arch })
    // Auto-save if there's a current project
    const state = get()
    if (state.currentProjectId) {
      state.saveProjectData().catch(console.error)
    }
  },
  
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  setProjects: (projects) => set({ projects }),
  
  setCurrentProjectId: (id) => set({ currentProjectId: id }),
  
  setOpenaiKey: (key) => set({ openaiKey: key }),
  
  loadAllData: async () => {
    try {
      const data = await invoke<any>('load_all_data')
      
      set({
        projects: data.projects || [],
        currentProjectId: data.currentProjectId || null,
        openaiKey: data.openaiKey || '',
        promptTemplate: data.defaultPromptTemplate || DEFAULT_PROMPT,
      })
      
      // Load current project data if exists
      if (data.currentProjectId && data.currentProjectData) {
        set({
          requirements: data.currentProjectData.requirements || '',
          generatedTasks: data.currentProjectData.tasks || '',
          generatedArchitecture: data.currentProjectData.architecture || '',
          promptTemplate: data.currentProjectData.prompt_template || data.defaultPromptTemplate || DEFAULT_PROMPT,
        })
      }
    } catch (error) {
      console.error('Failed to load data:', error)
    }
  },
  
  saveOpenAIKey: async (key: string) => {
    try {
      await invoke('save_openai_key', { key })
      set({ openaiKey: key })
    } catch (error) {
      console.error('Failed to save OpenAI key:', error)
      throw error
    }
  },
  
  createProject: async (name: string) => {
    try {
      const projectId = await invoke<number>('create_project', { name })
      await get().loadAllData() // Reload projects list
      return projectId
    } catch (error) {
      console.error('Failed to create project:', error)
      throw error
    }
  },
  
  selectProject: async (id: number) => {
    try {
      await invoke('set_current_project_id', { projectId: id })
      set({ currentProjectId: id })
      
      // Load project data
      const projectData = await invoke<ProjectData | null>('get_project_data', { projectId: id })
      if (projectData) {
        set({
          requirements: projectData.requirements || '',
          generatedTasks: projectData.tasks || '',
          generatedArchitecture: projectData.architecture || '',
          promptTemplate: projectData.prompt_template || DEFAULT_PROMPT,
        })
      } else {
        // Reset to defaults if no data
        set({
          requirements: '',
          generatedTasks: '',
          generatedArchitecture: '',
          promptTemplate: DEFAULT_PROMPT,
        })
      }
    } catch (error) {
      console.error('Failed to select project:', error)
      throw error
    }
  },
  
  saveProjectData: async () => {
    const state = get()
    if (!state.currentProjectId) return
    
    try {
      await invoke('save_project_data', {
        projectId: state.currentProjectId,
        requirements: state.requirements,
        tasks: state.generatedTasks,
        architecture: state.generatedArchitecture,
        promptTemplate: state.promptTemplate,
      })
    } catch (error) {
      console.error('Failed to save project data:', error)
    }
  },
  
  deleteProject: async (id: number) => {
    try {
      await invoke('delete_project', { projectId: id })
      const state = get()
      if (state.currentProjectId === id) {
        set({ currentProjectId: null })
      }
      await state.loadAllData() // Reload projects list
    } catch (error) {
      console.error('Failed to delete project:', error)
      throw error
    }
  },
}))
