'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { format } from 'date-fns'

const noticeTypes = [
  { value: 'announcement', label: 'Announcement' },
  { value: 'news', label: 'News' },
  { value: 'alert', label: 'Alert' },
  { value: 'event', label: 'Event' },
  { value: 'general', label: 'General' }
]

const priorityLevels = [
  { value: 'low', label: 'Low Priority' },
  { value: 'medium', label: 'Medium Priority' },
  { value: 'high', label: 'High Priority' }
]

export default function NoticeDialog({ open, onOpenChange, notice, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'announcement',
    priority: 'medium',
    author: '',
    date: '',
    expiryDate: '',
    isActive: true,
    isPinned: false,
    tags: ''
  })

  useEffect(() => {
    if (notice) {
      setFormData({
        title: notice.title || '',
        content: notice.content || '',
        type: notice.type || 'announcement',
        priority: notice.priority || 'medium',
        author: notice.author || '',
        date: notice.date || '',
        expiryDate: notice.expiryDate || '',
        isActive: notice.isActive !== undefined ? notice.isActive : true,
        isPinned: notice.isPinned || false,
        tags: notice.tags?.join(', ') || ''
      })
    } else {
      // Set defaults for new notice
      const today = format(new Date(), 'yyyy-MM-dd')
      const defaultExpiry = new Date()
      defaultExpiry.setMonth(defaultExpiry.getMonth() + 3)
      
      setFormData({
        title: '',
        content: '',
        type: 'announcement',
        priority: 'medium',
        author: 'Admin', // You can set this from user context
        date: today,
        expiryDate: format(defaultExpiry, 'yyyy-MM-dd'),
        isActive: true,
        isPinned: false,
        tags: ''
      })
    }
  }, [notice, open])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const noticeData = {
      ...formData,
      tags: formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)
    }

    onSave(noticeData)
    onOpenChange(false)
  }

  const handleChange = (field) => (value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSwitchChange = (field) => (checked) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {notice ? 'Edit Notice' : 'Create New Notice'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="md:col-span-2">
              <Label htmlFor="title">Notice Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title')(e.target.value)}
                placeholder="Enter notice title"
                required
              />
            </div>

            {/* Content */}
            <div className="md:col-span-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => handleChange('content')(e.target.value)}
                placeholder="Enter notice content"
                rows={4}
                required
              />
            </div>

            {/* Type and Priority */}
            <div>
              <Label htmlFor="type">Notice Type</Label>
              <Select value={formData.type} onValueChange={handleChange('type')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {noticeTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Priority Level</Label>
              <Select value={formData.priority} onValueChange={handleChange('priority')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorityLevels.map(priority => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Author */}
            <div>
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => handleChange('author')(e.target.value)}
                placeholder="Enter author name"
                required
              />
            </div>

            {/* Date */}
            <div>
              <Label htmlFor="date">Publication Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date')(e.target.value)}
                required
              />
            </div>

            {/* Expiry Date */}
            <div className="md:col-span-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={(e) => handleChange('expiryDate')(e.target.value)}
                required
              />
              <p className="text-sm text-muted-foreground mt-1">
                Notice will be automatically hidden after this date
              </p>
            </div>

            {/* Tags */}
            <div className="md:col-span-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => handleChange('tags')(e.target.value)}
                placeholder="security, important, deadline (comma separated)"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Separate multiple tags with commas
              </p>
            </div>

            {/* Switches */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={handleSwitchChange('isActive')}
                />
                <Label htmlFor="isActive">Active</Label>
                <span className="text-sm text-muted-foreground">
                  (Notice will be visible to users)
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isPinned"
                  checked={formData.isPinned}
                  onCheckedChange={handleSwitchChange('isPinned')}
                />
                <Label htmlFor="isPinned">Pin to Top</Label>
                <span className="text-sm text-muted-foreground">
                  (Notice will appear at the top of the list)
                </span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {notice ? 'Update Notice' : 'Create Notice'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 