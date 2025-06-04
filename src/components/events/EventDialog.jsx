'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { format } from 'date-fns'

const eventTypes = [
  { value: 'meeting', label: 'Meeting' },
  { value: 'deadline', label: 'Deadline' },
  { value: 'training', label: 'Training' },
  { value: 'event', label: 'Event' }
]

export default function EventDialog({ open, onOpenChange, event, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: '',
    type: 'meeting',
    location: '',
    attendees: ''
  })

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        date: event.date || '',
        time: event.time || '',
        duration: event.duration?.toString() || '',
        type: event.type || 'meeting',
        location: event.location || '',
        attendees: event.attendees?.join(', ') || ''
      })
    } else {
      setFormData({
        title: '',
        description: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        time: '09:00',
        duration: '60',
        type: 'meeting',
        location: '',
        attendees: ''
      })
    }
  }, [event, open])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const eventData = {
      ...formData,
      duration: parseInt(formData.duration) || 0,
      attendees: formData.attendees
        .split(',')
        .map(attendee => attendee.trim())
        .filter(attendee => attendee.length > 0),
      color: getEventTypeColor(formData.type)
    }

    onSave(eventData)
    onOpenChange(false)
  }

  const getEventTypeColor = (type) => {
    const colors = {
      meeting: 'blue',
      deadline: 'red',
      training: 'purple',
      event: 'green'
    }
    return colors[type] || 'blue'
  }

  const handleChange = (field) => (value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {event ? 'Edit Event' : 'Create New Event'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title')(e.target.value)}
                placeholder="Enter event title"
                required
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description')(e.target.value)}
                placeholder="Enter event description"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date')(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleChange('time')(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => handleChange('duration')(e.target.value)}
                placeholder="60"
                min="0"
              />
            </div>

            <div>
              <Label htmlFor="type">Event Type</Label>
              <Select value={formData.type} onValueChange={handleChange('type')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleChange('location')(e.target.value)}
                placeholder="Conference Room A, Online, etc."
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="attendees">Attendees</Label>
              <Input
                id="attendees"
                value={formData.attendees}
                onChange={(e) => handleChange('attendees')(e.target.value)}
                placeholder="John Doe, Jane Smith (comma separated)"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Separate multiple attendees with commas
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {event ? 'Update Event' : 'Create Event'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 