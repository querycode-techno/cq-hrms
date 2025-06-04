'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Search, Filter } from 'lucide-react'
import NoticeCard from './NoticeCard'
import NoticeDialog from './NoticeDialog'
import NoticeFilters from './NoticeFilters'

const mockNotices = [
  {
    id: 1,
    title: 'Office Holiday Schedule 2025',
    content: 'Please find attached the complete holiday schedule for 2025. The office will be closed on the following dates: New Year\'s Day (Jan 1), Memorial Day (May 26), Independence Day (July 4), Labor Day (Sep 1), Thanksgiving (Nov 27-28), and Christmas (Dec 25).',
    type: 'announcement',
    priority: 'medium',
    author: 'HR Department',
    date: '2025-01-10',
    expiryDate: '2025-12-31',
    isActive: true,
    isPinned: true,
    tags: ['holiday', 'schedule', 'office'],
    views: 145,
    likes: 23
  },
  {
    id: 2,
    title: 'New Security Protocols',
    content: 'Effective immediately, all employees must use two-factor authentication for accessing company systems. Please update your security settings by January 20th. Contact IT support if you need assistance with the setup process.',
    type: 'alert',
    priority: 'high',
    author: 'IT Security',
    date: '2025-01-12',
    expiryDate: '2025-01-25',
    isActive: true,
    isPinned: true,
    tags: ['security', 'IT', 'urgent'],
    views: 89,
    likes: 12
  },
  {
    id: 3,
    title: 'Q4 Performance Reviews Complete',
    content: 'We\'re pleased to announce that Q4 performance reviews have been completed. Individual feedback sessions will be scheduled over the next two weeks. Managers will reach out to team members directly to arrange meetings.',
    type: 'news',
    priority: 'medium',
    author: 'Management',
    date: '2025-01-08',
    expiryDate: '2025-01-30',
    isActive: true,
    isPinned: false,
    tags: ['performance', 'review', 'HR'],
    views: 67,
    likes: 18
  },
  {
    id: 4,
    title: 'Lunch Menu Updates',
    content: 'Our cafeteria has updated the lunch menu with new healthy options. Starting Monday, we\'ll have fresh salad bars, grain bowls, and vegetarian options available daily. Menu details are posted in the break room.',
    type: 'general',
    priority: 'low',
    author: 'Facilities',
    date: '2025-01-09',
    expiryDate: '2025-02-09',
    isActive: true,
    isPinned: false,
    tags: ['cafeteria', 'menu', 'health'],
    views: 34,
    likes: 8
  },
  {
    id: 5,
    title: 'Team Building Event - February 15th',
    content: 'Save the date! We\'re organizing a team building event on February 15th at Central Park. Activities include team challenges, networking lunch, and awards ceremony. RSVP by February 10th through the company portal.',
    type: 'event',
    priority: 'medium',
    author: 'HR Department',
    date: '2025-01-11',
    expiryDate: '2025-02-15',
    isActive: true,
    isPinned: false,
    tags: ['team building', 'event', 'RSVP'],
    views: 92,
    likes: 31
  },
  {
    id: 6,
    title: 'Parking Lot Maintenance',
    content: 'The main parking lot will undergo maintenance from January 20-22. Please use the auxiliary parking area during this period. Shuttles will be available every 15 minutes from the auxiliary lot to the main building.',
    type: 'announcement',
    priority: 'medium',
    author: 'Facilities',
    date: '2025-01-13',
    expiryDate: '2025-01-23',
    isActive: true,
    isPinned: false,
    tags: ['parking', 'maintenance', 'transportation'],
    views: 56,
    likes: 5
  },
  {
    id: 7,
    title: 'Software Upgrade Tonight',
    content: 'Critical system maintenance will occur tonight from 11 PM to 3 AM. Email and internal systems may be temporarily unavailable. Please save your work and log out before 11 PM.',
    type: 'alert',
    priority: 'high',
    author: 'IT Department',
    date: '2025-01-14',
    expiryDate: '2025-01-15',
    isActive: true,
    isPinned: true,
    tags: ['maintenance', 'system', 'downtime'],
    views: 178,
    likes: 7
  },
  {
    id: 8,
    title: 'Welcome New Team Members',
    content: 'Please join us in welcoming Sarah Johnson (Marketing), Michael Chen (Engineering), and Lisa Rodriguez (Sales) to our team. They\'ll be starting next Monday. Introduction meetings are scheduled for Tuesday afternoon.',
    type: 'news',
    priority: 'low',
    author: 'HR Department',
    date: '2025-01-12',
    expiryDate: '2025-01-26',
    isActive: true,
    isPinned: false,
    tags: ['new hire', 'introduction', 'team'],
    views: 43,
    likes: 15
  }
]

export default function NoticeBoard() {
  const [notices, setNotices] = useState(mockNotices)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [isNoticeDialogOpen, setIsNoticeDialogOpen] = useState(false)
  const [selectedNotice, setSelectedNotice] = useState(null)
  const [showFilters, setShowFilters] = useState(false)

  const handleAddNotice = () => {
    setSelectedNotice(null)
    setIsNoticeDialogOpen(true)
  }

  const handleEditNotice = (notice) => {
    setSelectedNotice(notice)
    setIsNoticeDialogOpen(true)
  }

  const handleSaveNotice = (noticeData) => {
    if (selectedNotice) {
      // Update existing notice
      setNotices(notices.map(notice => 
        notice.id === selectedNotice.id ? { ...noticeData, id: selectedNotice.id } : notice
      ))
    } else {
      // Add new notice
      const newNotice = {
        ...noticeData,
        id: Math.max(...notices.map(n => n.id)) + 1,
        views: 0,
        likes: 0
      }
      setNotices([newNotice, ...notices])
    }
    setIsNoticeDialogOpen(false)
    setSelectedNotice(null)
  }

  const handleDeleteNotice = (noticeId) => {
    setNotices(notices.filter(notice => notice.id !== noticeId))
  }

  const handleTogglePin = (noticeId) => {
    setNotices(notices.map(notice => 
      notice.id === noticeId ? { ...notice, isPinned: !notice.isPinned } : notice
    ))
  }

  const handleLikeNotice = (noticeId) => {
    setNotices(notices.map(notice => 
      notice.id === noticeId ? { ...notice, likes: notice.likes + 1 } : notice
    ))
  }

  // Filter and sort notices
  const filteredNotices = notices
    .filter(notice => {
      const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           notice.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           notice.author.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = selectedType === 'all' || notice.type === selectedType
      const matchesPriority = selectedPriority === 'all' || notice.priority === selectedPriority
      return matchesSearch && matchesType && matchesPriority && notice.isActive
    })
    .sort((a, b) => {
      // Always show pinned notices first
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      
      // Then sort by selected criteria
      switch (sortBy) {
        case 'date':
          return new Date(b.date) - new Date(a.date)
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case 'views':
          return b.views - a.views
        case 'likes':
          return b.likes - a.likes
        default:
          return new Date(b.date) - new Date(a.date)
      }
    })

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          {/* Quick Filters */}
          <div className="flex gap-2">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="announcement">Announcement</SelectItem>
                <SelectItem value="news">News</SelectItem>
                <SelectItem value="alert">Alert</SelectItem>
                <SelectItem value="event">Event</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Latest</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="views">Most Viewed</SelectItem>
                <SelectItem value="likes">Most Liked</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        {/* Add Notice Button */}
        <Button onClick={handleAddNotice} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Notice
        </Button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <NoticeFilters
          selectedPriority={selectedPriority}
          onPriorityChange={setSelectedPriority}
        />
      )}

      {/* Notice Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-lg border">
          <div className="text-2xl font-bold">{filteredNotices.length}</div>
          <div className="text-sm text-muted-foreground">Active Notices</div>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <div className="text-2xl font-bold">{filteredNotices.filter(n => n.isPinned).length}</div>
          <div className="text-sm text-muted-foreground">Pinned</div>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <div className="text-2xl font-bold">{filteredNotices.filter(n => n.priority === 'high').length}</div>
          <div className="text-sm text-muted-foreground">High Priority</div>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <div className="text-2xl font-bold">{filteredNotices.reduce((sum, n) => sum + n.views, 0)}</div>
          <div className="text-sm text-muted-foreground">Total Views</div>
        </div>
      </div>

      {/* Notice Cards */}
      <div className="space-y-4">
        {filteredNotices.length > 0 ? (
          filteredNotices.map(notice => (
            <NoticeCard
              key={notice.id}
              notice={notice}
              onEdit={() => handleEditNotice(notice)}
              onDelete={() => handleDeleteNotice(notice.id)}
              onTogglePin={() => handleTogglePin(notice.id)}
              onLike={() => handleLikeNotice(notice.id)}
            />
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <div className="text-lg font-medium">No notices found</div>
            <div className="text-sm">Try adjusting your search criteria or add a new notice</div>
          </div>
        )}
      </div>

      {/* Notice Dialog */}
      <NoticeDialog 
        open={isNoticeDialogOpen}
        onOpenChange={setIsNoticeDialogOpen}
        notice={selectedNotice}
        onSave={handleSaveNotice}
      />
    </div>
  )
} 