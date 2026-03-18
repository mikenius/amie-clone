import { create } from 'zustand'

export interface Task {
  id: string
  title: string
  description?: string
  priority: number
  status: number
  due_date?: string
  duration?: number
  parent_id?: string
  calendar_event_id?: string
  created_at: string
  updated_at: string
}

interface TaskState {
  tasks: Task[]
  isLoading: boolean
  fetchTasks: () => Promise<void>
  addTask: (title: string) => Promise<void>
  toggleTask: (id: string) => Promise<void>
  deleteTask: (id: string) => Promise<void>
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,

  fetchTasks: async () => {
    set({ isLoading: true })
    try {
      const tasks = await window.electronAPI.getTasks()
      set({ tasks, isLoading: false })
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
      set({ isLoading: false })
    }
  },

  addTask: async (title: string) => {
    const newTask = {
      id: crypto.randomUUID(),
      title,
      priority: 2,
      status: 0,
    }
    try {
      const result = await window.electronAPI.createTask(newTask)
      if (result) {
        set((state) => ({ tasks: [result, ...state.tasks] }))
      }
    } catch (error) {
      console.error('Failed to add task:', error)
    }
  },

  toggleTask: async (id: string) => {
    const task = get().tasks.find((t) => t.id === id)
    if (!task) return

    const updatedTask = { ...task, status: task.status === 0 ? 1 : 0 }
    try {
      const success = await window.electronAPI.updateTask(updatedTask)
      if (success) {
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? updatedTask : t)),
        }))
      }
    } catch (error) {
      console.error('Failed to toggle task:', error)
    }
  },

  deleteTask: async (id: string) => {
    try {
      const success = await window.electronAPI.deleteTask(id)
      if (success) {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }))
      }
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  },
}))
