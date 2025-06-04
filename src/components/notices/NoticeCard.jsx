'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { 
  Clock, 
  Pin, 
  PinOff, 
  Heart, 
  Eye, 
  Edit, 
  Trash2, 
  User,
  Calendar,
  AlertTriangle,
  Megaphone,
  Newspaper,
  CalendarDays,
  FileText
} from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'

const noticeTypeConfig = {
  announcement: {
    icon: Megaphone,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    badgeVariant: 'default'
  },
  news: {
    icon: Newspaper,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    badgeVariant: 'secondary'
  },
  alert: {
    icon: AlertTriangle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    badgeVariant: 'destructive'
  },
  event: {
    icon: CalendarDays,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    badgeVariant: 'outline'
  },
  general: {
    icon: FileText,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    badgeVariant: 'outline'
  }
}

const priorityConfig = {
  high: {
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    label: 'High Priority'
  },
  medium: {
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    label: 'Medium Priority'
  },
  low: {
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    label: 'Low Priority'
  }
}

export default function NoticeCard({ notice, onEdit, onDelete, onTogglePin, onLike }) {
  const typeConfig = noticeTypeConfig[notice.type] || noticeTypeConfig.general
  const TypeIcon = typeConfig.icon
  const priorityStyle = priorityConfig[notice.priority]

  const handleEdit = (e) => {
    e.stopPropagation()
    onEdit()
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    onDelete()
  }

  const handleTogglePin = (e) => {
    e.stopPropagation()
    onTogglePin()
  }

  const handleLike = (e) => {
    e.stopPropagation()
    onLike()
  }

  const isExpiringSoon = () => {
    const expiryDate = new Date(notice.expiryDate)
    const threeDaysFromNow = new Date()
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3)
    return expiryDate <= threeDaysFromNow
  }

  return (
    <Card className={`
      transition-all duration-200 hover:shadow-md
      ${notice.isPinned ? 'ring-2 ring-primary ring-opacity-50' : ''}
      ${notice.priority === 'high' ? 'border-red-200' : ''}
    `}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            {/* Notice Type Icon */}
            <div className={`p-2 rounded-lg ${typeConfig.bgColor} ${typeConfig.borderColor} border`}>
              <TypeIcon className={`h-5 w-5 ${typeConfig.color}`} />
            </div>
            
            <div className="flex-1 space-y-2">
              {/* Title and Badges */}
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold leading-tight">{notice.title}</h3>
                <div className="flex items-center space-x-2 ml-4">
                  {notice.isPinned && (
                    <Pin className="h-4 w-4 text-primary" />
                  )}
                  {isExpiringSoon() && (
                    <Badge variant="outline" className="text-orange-600 border-orange-200">
                      <Clock className="h-3 w-3 mr-1" />
                      Expiring Soon
                    </Badge>
                  )}
                </div>
              </div>

              {/* Badges Row */}
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={typeConfig.badgeVariant} className="capitalize">
                  {notice.type}
                </Badge>
                
                <Badge 
                  variant="outline" 
                  className={`${priorityStyle.color} border-current`}
                >
                  {priorityStyle.label}
                </Badge>

                {notice.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Author and Date */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {notice.author}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(notice.date), 'MMM d, yyyy')}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formatDistanceToNow(new Date(notice.date), { addSuffix: true })}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-1 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleTogglePin}
              className={notice.isPinned ? 'text-primary' : 'text-muted-foreground'}
            >
              {notice.isPinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              className="text-muted-foreground hover:text-primary"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Notice Content */}
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {notice.content}
          </p>

          {/* Footer Stats and Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {notice.views} views
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                {notice.likes} likes
              </div>
              {notice.expiryDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Expires {format(new Date(notice.expiryDate), 'MMM d, yyyy')}
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className="text-muted-foreground hover:text-red-500 transition-colors"
            >
              <Heart className="h-4 w-4 mr-1" />
              Like
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 