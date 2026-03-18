import { format, addDays, isSameDay, startOfDay, endOfDay } from 'date-fns'
import { ja } from 'date-fns/locale'
import { useEventStore } from '../store/useEventStore'
import { CalendarEventBlock } from './CalendarEventBlock'

export const CalendarGrid: React.FC = () => {
  const { baseDate } = useCalendarStore()
  const { events, fetchEvents } = useEventStore()

  React.useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const days = Array.from({ length: 7 }, (_, i) => addDays(baseDate, i))
  const hours = Array.from({ length: 24 }, (_, i) => i)

  return (
    <div className="calendar-grid-container">
      {/* Day Headers */}
      <div className="calendar-grid-header">
        <div className="time-gutter-header" />
        {days.map((day) => (
          <div 
            key={day.toISOString()} 
            className={`day-column-header ${isSameDay(day, new Date()) ? 'today' : ''}`}
          >
            <span className="day-name">{format(day, 'E', { locale: ja })}</span>
            <span className="day-number">{format(day, 'd')}</span>
          </div>
        ))}
      </div>

      {/* Grid Body */}
      <div className="calendar-grid-body">
        <div className="time-gutter">
          {hours.map((hour) => (
            <div key={hour} className="time-label">
              {hour}:00
            </div>
          ))}
        </div>
        <div className="days-container">
          {days.map((day) => {
            const dayStart = startOfDay(day)
            const dayEnd = endOfDay(day)
            
            // Filter events that occur on this day
            const dayEvents = events.filter(event => {
              const eventStart = new Date(event.start_time)
              return eventStart >= dayStart && eventStart <= dayEnd
            })

            return (
              <div key={day.toISOString()} className="day-column">
                {hours.map((hour) => (
                  <div key={hour} className="hour-slot" />
                ))}
                {/* Event Blocks Layer */}
                <div className="events-layer">
                  {dayEvents.map(event => (
                    <CalendarEventBlock key={event.id} event={event} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
