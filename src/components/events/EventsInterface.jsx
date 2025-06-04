'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import CalendarView from './CalendarView'
import EventDialog from './EventDialog'
import ViewSwitcher from './ViewSwitcher'

const mockEvents = [
  {
    id: 1,
    title: 'Team Standup',
    description: 'Daily team synchronization meeting',
    date: '2025-01-15',
    time: '09:00',
    duration: 30,
    type: 'meeting',
    attendees: ['John Doe', 'Jane Smith', 'Mike Wilson'],
    location: 'Conference Room A',
    color: 'blue'
  },
  {
    id: 2,
    title: 'Project Deadline',
    description: 'Q1 Marketing Campaign Launch',
    date: '2025-01-20',
    time: '17:00',
    duration: 0,
    type: 'deadline',
    attendees: ['Marketing Team'],
    location: 'Online',
    color: 'red'
  },
  {
    id: 3,
    title: 'Client Presentation',
    description: 'Quarterly review with ABC Corp',
    date: '2025-01-18',
    time: '14:00',
    duration: 120,
    type: 'meeting',
    attendees: ['Sales Team', 'Project Manager'],
    location: 'Board Room',
    color: 'green'
  },
  {
    id: 4,
    title: 'Training Session',
    description: 'New Employee Onboarding',
    date: '2025-01-22',
    time: '10:00',
    duration: 240,
    type: 'training',
    attendees: ['HR Team', 'New Hires'],
    location: 'Training Room',
    color: 'purple'
  },
  {
    id: 5,
    title: 'Company All-Hands',
    description: 'Monthly company-wide meeting',
    date: '2025-01-25',
    time: '15:00',
    duration: 60,
    type: 'meeting',
    attendees: ['All Staff'],
    location: 'Main Auditorium',
    color: 'orange'
  },
  {
    id: 6,
    title: 'Sprint Planning',
    description: 'Plan next sprint objectives and tasks',
    date: '2025-01-14',
    time: '10:00',
    duration: 120,
    type: 'meeting',
    attendees: ['Dev Team', 'Product Manager'],
    location: 'Conference Room B',
    color: 'blue'
  },
  {
    id: 7,
    title: 'Design Review',
    description: 'Review UI/UX designs for new features',
    date: '2025-01-16',
    time: '15:30',
    duration: 90,
    type: 'meeting',
    attendees: ['Design Team', 'Frontend Developers'],
    location: 'Design Studio',
    color: 'green'
  },
  {
    id: 8,
    title: 'Security Audit',
    description: 'Annual security assessment deadline',
    date: '2025-01-30',
    time: '23:59',
    duration: 0,
    type: 'deadline',
    attendees: ['IT Security Team'],
    location: 'IT Department',
    color: 'red'
  },
  {
    id: 9,
    title: 'Code Review Workshop',
    description: 'Best practices for code review process',
    date: '2025-01-19',
    time: '13:00',
    duration: 180,
    type: 'training',
    attendees: ['All Developers', 'Senior Engineers'],
    location: 'Tech Lab',
    color: 'purple'
  },
  {
    id: 10,
    title: 'Client Demo',
    description: 'Showcase new features to key client',
    date: '2025-01-23',
    time: '16:00',
    duration: 60,
    type: 'meeting',
    attendees: ['Sales Team', 'Technical Lead'],
    location: 'Executive Meeting Room',
    color: 'green'
  }
]

export default function EventsInterface() {
  const [events, setEvents] = useState(mockEvents)
  const [currentView, setCurrentView] = useState('month')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)

  const handleAddEvent = () => {
    setSelectedEvent(null)
    setIsEventDialogOpen(true)
  }

  const handleEditEvent = (event) => {
    setSelectedEvent(event)
    setIsEventDialogOpen(true)
  }

  const handleSaveEvent = (eventData) => {
    if (selectedEvent) {
      // Update existing event
      setEvents(events.map(event => 
        event.id === selectedEvent.id ? { ...eventData, id: selectedEvent.id } : event
      ))
    } else {
      // Add new event
      const newEvent = {
        ...eventData,
        id: Math.max(...events.map(e => e.id)) + 1
      }
      setEvents([...events, newEvent])
    }
    setIsEventDialogOpen(false)
    setSelectedEvent(null)
  }

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId))
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Button and View Switcher */}
      <div className="flex items-center justify-between">
        <ViewSwitcher 
          currentView={currentView}
          onViewChange={setCurrentView}
        />
        <Button onClick={handleAddEvent} className="gap-2">
          <Plus className="h-4 w-4" />
          Add new
        </Button>
      </div>

      {/* Calendar View */}
      <div className="bg-card rounded-lg border p-6">
        <CalendarView 
          events={events}
          currentView={currentView}
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          onEventClick={handleEditEvent}
          onDeleteEvent={handleDeleteEvent}
        />
      </div>

      {/* Event Dialog */}
      <EventDialog 
        open={isEventDialogOpen}
        onOpenChange={setIsEventDialogOpen}
        event={selectedEvent}
        onSave={handleSaveEvent}
      />
    </div>
  )
} 