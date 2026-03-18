import Database from 'better-sqlite3'
import { app } from 'electron'
import { join } from 'path'
import * as fs from 'fs'

const userDataPath = app.getPath('userData')
const dbPath = join(userDataPath, 'amie_clone.db')

// Initialize DB (create file if it doesn't exist)
const db = new Database(dbPath)

// Create tables if they don't exist
function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      priority INTEGER DEFAULT 2,   -- 1: High, 2: Medium, 3: Low
      status INTEGER DEFAULT 0,     -- 0: Todo, 1: Done
      due_date TEXT,
      duration INTEGER,             -- minutes
      parent_id TEXT,
      calendar_event_id TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      calendar_id TEXT NOT NULL,
      title TEXT,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      description TEXT,
      location TEXT,
      is_all_day INTEGER DEFAULT 0,
      source TEXT DEFAULT 'google',
      synced_at TEXT
    );

    CREATE TABLE IF NOT EXISTS emails (
      id TEXT PRIMARY KEY,
      thread_id TEXT,
      subject TEXT,
      sender TEXT,
      snippet TEXT,
      received_at TEXT,
      is_read INTEGER DEFAULT 0,
      task_id TEXT,
      event_id TEXT
    );
  `)
}

initDb()

// Helper functions for IPC
export const dbAPI = {
  // --- Tasks ---
  getTasks: () => {
    return db.prepare('SELECT * FROM tasks ORDER BY created_at DESC').all()
  },
  
  createTask: (task: any) => {
    const stmt = db.prepare(`
      INSERT INTO tasks (id, title, description, priority, status, due_date, duration, parent_id, calendar_event_id, created_at, updated_at)
      VALUES (@id, @title, @description, @priority, @status, @due_date, @duration, @parent_id, @calendar_event_id, @created_at, @updated_at)
    `)
    const result = stmt.run({
      ...task,
      priority: task.priority ?? 2,
      status: task.status ?? 0,
      description: task.description ?? null,
      due_date: task.due_date ?? null,
      duration: task.duration ?? null,
      parent_id: task.parent_id ?? null,
      calendar_event_id: task.calendar_event_id ?? null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    return result.changes > 0 ? task : null
  },

  updateTask: (task: any) => {
    const stmt = db.prepare(`
      UPDATE tasks SET
        title = @title,
        description = @description,
        priority = @priority,
        status = @status,
        due_date = @due_date,
        duration = @duration,
        parent_id = @parent_id,
        calendar_event_id = @calendar_event_id,
        updated_at = @updated_at
      WHERE id = @id
    `)
    const result = stmt.run({
      ...task,
      updated_at: new Date().toISOString(),
    })
    return result.changes > 0
  },

  deleteTask: (id: string) => {
    const result = db.prepare('DELETE FROM tasks WHERE id = ?').run(id)
    return result.changes > 0
  }
}

export default db
