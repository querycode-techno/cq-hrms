'use client'

import { Button } from '@/components/ui/button'

const views = [
  { key: 'month', label: 'Month' },
  { key: 'week', label: 'Week' },
  { key: 'day', label: 'Day' },
  { key: 'list', label: 'List' }
]

export default function ViewSwitcher({ currentView, onViewChange }) {
  return (
    <div className="flex rounded-lg border border-border">
      {views.map((view, index) => (
        <Button
          key={view.key}
          variant={currentView === view.key ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewChange(view.key)}
          className={`
            px-4 py-2 
            ${index === 0 ? 'rounded-l-lg rounded-r-none' : ''}
            ${index === views.length - 1 ? 'rounded-r-lg rounded-l-none' : ''}
            ${index > 0 && index < views.length - 1 ? 'rounded-none' : ''}
            border-0
          `}
        >
          {view.label}
        </Button>
      ))}
    </div>
  )
} 