import EventsInterface from '@/components/events/EventsInterface'

export default function EventsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Events</h2>
          <p className="text-muted-foreground">
            Manage and view company events, meetings, and important dates
          </p>
        </div>
      </div>
      <EventsInterface />
    </div>
  )
} 