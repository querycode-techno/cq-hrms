'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns'
import EventCard from './EventCard'

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function CalendarView({ events, currentView, currentDate, onDateChange, onEventClick, onDeleteEvent }) {
  const [selectedDate, setSelectedDate] = useState(new Date())

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)

  const navigateMonth = (direction) => {
    const newDate = direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1)
    onDateChange(newDate)
  }

  const getEventsForDate = (date) => {
    return events.filter(event => 
      isSameDay(new Date(event.date), date)
    )
  }

  const renderMonthView = () => {
    const days = []
    let day = calendarStart

    while (day <= calendarEnd) {
      days.push(day)
      day = addDays(day, 1)
    }

    return (
      <div className="space-y-4">
        {/* Calendar Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <h3 className="text-xl font-semibold">
            {format(currentDate, 'MMMM yyyy')}
          </h3>
          <div></div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-px bg-border">
          {weekDays.map(day => (
            <div key={day} className="bg-card p-3 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-px bg-border">
          {days.map((day, index) => {
            const dayEvents = getEventsForDate(day)
            const isCurrentMonth = isSameMonth(day, currentDate)
            const isToday = isSameDay(day, new Date())
            const isSelected = isSameDay(day, selectedDate)

            return (
              <div
                key={index}
                onClick={() => setSelectedDate(day)}
                className={`
                  bg-card p-2 min-h-[120px] cursor-pointer hover:bg-accent transition-colors
                  ${!isCurrentMonth ? 'text-muted-foreground' : ''}
                  ${isToday ? 'bg-accent' : ''}
                  ${isSelected ? 'ring-2 ring-primary' : ''}
                `}
              >
                <div className={`text-sm font-medium mb-1 ${isToday ? 'text-primary' : ''}`}>
                  {format(day, 'd')}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map(event => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onClick={() => onEventClick(event)}
                      onDelete={() => onDeleteEvent(event.id)}
                      compact
                    />
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-muted-foreground">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderListView = () => {
    const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date))
    
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Upcoming Events</h3>
        <div className="space-y-2">
          {sortedEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onClick={() => onEventClick(event)}
              onDelete={() => onDeleteEvent(event.id)}
              detailed
            />
          ))}
        </div>
      </div>
    )
  }

  const renderView = () => {
    switch (currentView) {
      case 'month':
        return renderMonthView()
      case 'week':
        return <div className="text-center py-8 text-muted-foreground">Week view coming soon</div>
      case 'day':
        return <div className="text-center py-8 text-muted-foreground">Day view coming soon</div>
      case 'list':
        return renderListView()
      default:
        return renderMonthView()
    }
  }

  return (
    <div className="w-full">
      {renderView()}
    </div>
  )
} 