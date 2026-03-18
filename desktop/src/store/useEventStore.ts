import { create } from 'zustand'

export interface CalendarEvent {
  id: string
  calendar_id: string
  title: string
  start_time: string // ISO string
  end_time: string   // ISO string
  description?: string
  location?: string
  is_all_day: boolean
  source: 'google' | 'local'
}

interface EventState {
  events: CalendarEvent[]
  isLoading: boolean
  isSyncing: boolean
  fetchEvents: () => Promise<void>
  syncEvents: () => Promise<void>
}

export const useEventStore = create<EventState>((set) => ({
  events: [],
  isLoading: false,
  isSyncing: false,

  fetchEvents: async () => {
    set({ isLoading: true })
    try {
      const events = await window.electronAPI.getEvents()
      set({ events, isLoading: false })
    } catch (error) {
      console.error('Failed to fetch events:', error)
      set({ isLoading: false })
    }
  },

  syncEvents: async () => {
    set({ isSyncing: true })
    try {
      const success = await window.electronAPI.syncCalendar()
      if (success) {
        const events = await window.electronAPI.getEvents()
        set({ events })
      }
    } catch (error) {
      console.error('Failed to sync events:', error)
    } finally {
      set({ isSyncing: false })
    }
  },
}))
