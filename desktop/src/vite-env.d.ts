/// <reference types="vite/client" />

interface Window {
  electronAPI: {
    getVersion: () => Promise<string>
    // Tasks DB
    getTasks: () => Promise<any[]>
    createTask: (task: any) => Promise<any>
    updateTask: (task: any) => Promise<boolean>
    deleteTask: (id: string) => Promise<boolean>
    // Auth
    login: () => Promise<boolean>
    logout: () => Promise<boolean>
    isLoggedIn: () => Promise<boolean>
    // Calendar
    getEvents: () => Promise<any[]>
    syncCalendar: () => Promise<boolean>
  }
}
