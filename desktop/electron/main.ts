import { app, BrowserWindow, ipcMain, nativeTheme } from 'electron'
import { join } from 'path'
import { dbAPI } from './db'
import { authAPI } from './auth'
import { calendarAPI } from './calendar'

let mainWindow: BrowserWindow | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 600,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#0f0f14',
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    show: false,
  })

  // Dark mode always on
  nativeTheme.themeSource = 'dark'

  // Load the app
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(join(__dirname, '../dist/index.html'))
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// IPC handlers
ipcMain.handle('app:version', () => app.getVersion())

// Database handlers (Tasks)
ipcMain.handle('db:getTasks', () => {
  return dbAPI.getTasks()
})

ipcMain.handle('db:createTask', (_, task) => {
  return dbAPI.createTask(task)
})

ipcMain.handle('db:updateTask', (_, task) => {
  return dbAPI.updateTask(task)
})

ipcMain.handle('db:deleteTask', (_, id) => {
  return dbAPI.deleteTask(id)
})

// Auth handlers
ipcMain.handle('auth:login', () => {
  return authAPI.login()
})

ipcMain.handle('auth:logout', () => {
  return authAPI.logout()
})

ipcMain.handle('auth:isLoggedIn', () => {
  return authAPI.isLoggedIn()
})

// Calendar handlers
ipcMain.handle('db:getEvents', () => {
  return dbAPI.getEvents()
})

ipcMain.handle('calendar:syncEvents', async () => {
  if (!authAPI.isLoggedIn()) return false
  
  try {
    const events = await calendarAPI.listEvents()
    dbAPI.upsertEvents(events)
    return true
  } catch (error) {
    console.error('Failed to sync events:', error)
    return false
  }
})

ipcMain.handle('calendar:createFromTask', (_, taskId, startTime, endTime) => {
  return dbAPI.createEventFromTask(taskId, startTime, endTime)
})
