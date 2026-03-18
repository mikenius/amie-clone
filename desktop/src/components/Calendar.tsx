import React from 'react'
import { CalendarHeader } from './CalendarHeader'
import { CalendarGrid } from './CalendarGrid'

export const Calendar: React.FC = () => {
  return (
    <div className="calendar-container">
      <CalendarHeader />
      <div className="calendar-scroll-area">
        <CalendarGrid />
      </div>
    </div>
  )
}
