import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  getVersion: () => ipcRenderer.invoke('app:version'),
  // --- Tasks DB ---
  getTasks: () => ipcRenderer.invoke('db:getTasks'),
  createTask: (task: any) => ipcRenderer.invoke('db:createTask', task),
  updateTask: (task: any) => ipcRenderer.invoke('db:updateTask', task),
  deleteTask: (id: string) => ipcRenderer.invoke('db:deleteTask', id),
  // --- Auth ---
  login: () => ipcRenderer.invoke('auth:login'),
  logout: () => ipcRenderer.invoke('auth:logout'),
  isLoggedIn: () => ipcRenderer.invoke('auth:isLoggedIn'),
  // --- Calendar ---
  getEvents: () => ipcRenderer.invoke('db:getEvents'),
  syncCalendar: () => ipcRenderer.invoke('calendar:syncEvents'),
  createEventFromTask: (taskId: string, start: string, end: string) => 
    ipcRenderer.invoke('calendar:createFromTask', taskId, start, end),
})
