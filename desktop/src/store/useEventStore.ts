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
  fetchEvents: () => Promise<void>
}

export const useEventStore = create<EventState>((set) => ({
  events: [],
  isLoading: false,

  fetchEvents: async () => {
    // For now, this is a placeholder. P1-06 will implement actual fetching.
    // We can add some mock local events to test the UI.
    set({ isLoading: true })
    try {
      // In a real scenario, we'd call window.electronAPI.getEvents()
      // For P1-04 verification, we'll return an empty list or mock data
      set({ events: [], isLoading: false })
    } catch (error) {
      console.error('Failed to fetch events:', error)
      set({ isLoading: false })
    }
  },
}))
