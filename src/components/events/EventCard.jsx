'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, MapPin, Users, Trash2 } from 'lucide-react'
import { format } from 'date-fns'

const eventTypeColors = {
  meeting: 'bg-blue-500',
  deadline: 'bg-red-500',
  training: 'bg-purple-500',
  event: 'bg-green-500'
}

const eventTypeBadgeColors = {
  meeting: 'default',
  deadline: 'destructive',
  training: 'secondary',
  event: 'outline'
}

export default function EventCard({ event, onClick, onDelete, compact = false, detailed = false }) {
  const handleClick = (e) => {
    e.stopPropagation()
    onClick()
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    onDelete()
  }

  if (compact) {
    return (
      <div
        onClick={handleClick}
        className={`
          p-1 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity
          ${eventTypeColors[event.type] || 'bg-gray-500'} text-white
        `}
      >
        <div className="font-medium truncate">{event.title}</div>
        {event.time && (
          <div className="text-xs opacity-90">{event.time}</div>
        )}
      </div>
    )
  }

  if (detailed) {
    return (
      <div className="border border-border rounded-lg p-4 hover:bg-accent transition-colors cursor-pointer">
        <div className="flex items-start justify-between" onClick={handleClick}>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold">{event.title}</h4>
              <Badge variant={eventTypeBadgeColors[event.type]}>
                {event.type}
              </Badge>
            </div>
            
            {event.description && (
              <p className="text-sm text-muted-foreground">{event.description}</p>
            )}
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {format(new Date(event.date), 'MMM d, yyyy')} at {event.time}
                {event.duration > 0 && ` (${event.duration}min)`}
              </div>
              
              {event.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {event.location}
                </div>
              )}
              
              {event.attendees && event.attendees.length > 0 && (
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {event.attendees.length} attendees
                </div>
              )}
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  // Default card view
  return (
    <div
      onClick={handleClick}
      className="p-3 border border-border rounded-lg hover:bg-accent transition-colors cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h4 className="font-medium">{event.title}</h4>
          <div className="text-sm text-muted-foreground">
            {format(new Date(event.date), 'MMM d')} at {event.time}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
} 