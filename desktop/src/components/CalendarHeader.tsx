import React from 'react'
import { useCalendarStore } from '../store/useCalendarStore'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

export const CalendarHeader: React.FC = () => {
  const { baseDate, prevWeek, nextWeek, today } = useCalendarStore()

  return (
    <div className="calendar-header">
      <div className="calendar-nav">
        <button className="nav-btn no-drag" onClick={prevWeek}>&lt;</button>
        <button className="nav-btn today-btn no-drag" onClick={today}>Today</button>
        <button className="nav-btn no-drag" onClick={nextWeek}>&gt;</button>
      </div>
      <div className="calendar-title">
        {format(baseDate, 'yyyy年 M月', { locale: ja })}
      </div>
      <div className="calendar-view-tabs">
        <button className="view-tab active no-drag">Week</button>
        <button className="view-tab no-drag">Day</button>
        <button className="view-tab no-drag">Month</button>
      </div>
    </div>
  )
}
