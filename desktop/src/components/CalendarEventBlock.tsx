import React from 'react'
import { differenceInMinutes, startOfDay } from 'date-fns'
import { CalendarEvent } from '../store/useEventStore'

interface CalendarEventBlockProps {
  event: CalendarEvent
}

/**
 * Renders a single event block on the calendar grid.
 * Positions it based on start time and duration.
 */
export const CalendarEventBlock: React.FC<CalendarEventBlockProps> = ({ event }) => {
  const start = new Date(event.start_time)
  const end = new Date(event.end_time)
  
  // Calculate top position (pixels)
  // 1 hour = 60px
  const startOfFocusedDay = startOfDay(start)
  const minutesFromStartOfDay = differenceInMinutes(start, startOfFocusedDay)
  const top = (minutesFromStartOfDay / 60) * 60

  // Calculate height (pixels)
  const durationInMinutes = differenceInMinutes(end, start)
  const height = (durationInMinutes / 60) * 60

  return (
    <div 
      className="calendar-event-block"
      style={{
        top: `${top}px`,
        height: `${height}px`,
      }}
    >
      <div className="event-title">{event.title}</div>
      {height > 30 && <div className="event-time">{event.start_time.split('T')[1].substring(0, 5)}</div>}
    </div>
  )
}
