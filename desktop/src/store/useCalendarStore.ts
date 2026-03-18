import { create } from 'zustand'
import { startOfWeek, addDays, subDays } from 'date-fns'

interface CalendarState {
  baseDate: Date
  setBaseDate: (date: Date) => void
  nextWeek: () => void
  prevWeek: () => void
  today: () => void
}

export const useCalendarStore = create<CalendarState>((set) => ({
  baseDate: startOfWeek(new Date(), { weekStartsOn: 1 }), // Start on Monday

  setBaseDate: (date: Date) => set({ baseDate: startOfWeek(date, { weekStartsOn: 1 }) }),

  nextWeek: () => set((state) => ({ baseDate: addDays(state.baseDate, 7) })),

  prevWeek: () => set((state) => ({ baseDate: subDays(state.baseDate, 7) })),

  today: () => set({ baseDate: startOfWeek(new Date(), { weekStartsOn: 1 }) }),
}))
