"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Send, Bell, Users, MessageSquare, Calendar, Search, Filter } from "lucide-react"

const notificationHistory = [
  {
    id: 1,
    title: "Monthly Team Meeting",
    message: "Don't forget about our monthly team meeting tomorrow at 2 PM in the conference room.",
    type: "Meeting",
    recipients: "All Employees",
    sentBy: "HR Manager",
    sentAt: "2024-01-15 14:30",
    status: "Delivered",
    readCount: 45,
    totalRecipients: 50
  },
  {
    id: 2,
    title: "System Maintenance Notice",
    message: "The system will be under maintenance this weekend from 6 PM Friday to 8 AM Monday.",
    type: "System",
    recipients: "All Employees",
    sentBy: "IT Admin",
    sentAt: "2024-01-14 10:15",
    status: "Delivered",
    readCount: 48,
    totalRecipients: 50
  },
  {
    id: 3,
    title: "Leave Request Approval",
    message: "Your leave request for Feb 15-17 has been approved. Enjoy your time off!",
    type: "Leave",
    recipients: "John Doe",
    sentBy: "HR Manager",
    sentAt: "2024-01-13 16:45",
    status: "Read",
    readCount: 1,
    totalRecipients: 1
  },
  {
    id: 4,
    title: "New Project Assignment",
    message: "You have been assigned to the Website Redesign project. Please check your dashboard for details.",
    type: "Project",
    recipients: "Engineering Team",
    sentBy: "Project Manager",
    sentAt: "2024-01-12 09:20",
    status: "Delivered",
    readCount: 8,
    totalRecipients: 12
  },
  {
    id: 5,
    title: "Birthday Celebration",
    message: "Join us in celebrating Sarah's birthday today at 4 PM in the break room!",
    type: "Social",
    recipients: "All Employees",
    sentBy: "HR Manager",
    sentAt: "2024-01-11 11:00",
    status: "Delivered",
    readCount: 42,
    totalRecipients: 50
  }
]

const employeeGroups = [
  { id: "all", name: "All Employees", count: 50 },
  { id: "engineering", name: "Engineering Team", count: 12 },
  { id: "hr", name: "HR Department", count: 3 },
  { id: "design", name: "Design Team", count: 5 },
  { id: "management", name: "Management", count: 8 }
]

export default function NotificationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false)
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    type: "General",
    recipients: [],
    schedule: "now"
  })

  const filteredNotifications = notificationHistory.filter(notification =>
    notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notification.message.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status) => {
    const variants = {
      "Delivered": "bg-green-100 text-green-800",
      "Read": "bg-blue-100 text-blue-800",
      "Pending": "bg-yellow-100 text-yellow-800",
      "Failed": "bg-red-100 text-red-800",
    }
    return <Badge variant="secondary" className={variants[status]}>{status}</Badge>
  }

  const getTypeBadge = (type) => {
    const variants = {
      "Meeting": "bg-purple-100 text-purple-800",
      "System": "bg-orange-100 text-orange-800",
      "Leave": "bg-blue-100 text-blue-800",
      "Project": "bg-green-100 text-green-800",
      "Social": "bg-pink-100 text-pink-800",
      "General": "bg-gray-100 text-gray-800",
    }
    return <Badge variant="outline" className={variants[type]}>{type}</Badge>
  }

  const handleRecipientChange = (groupId, checked) => {
    if (checked) {
      setNewNotification({
        ...newNotification,
        recipients: [...newNotification.recipients, groupId]
      })
    } else {
      setNewNotification({
        ...newNotification,
        recipients: newNotification.recipients.filter(id => id !== groupId)
      })
    }
  }

  const handleSendNotification = () => {
    // Handle FCM notification sending logic here
    console.log("Sending notification:", newNotification)
    setIsSendDialogOpen(false)
    setNewNotification({
      title: "",
      message: "",
      type: "General",
      recipients: [],
      schedule: "now"
    })
  }

  const totalNotifications = notificationHistory.length
  const deliveredCount = notificationHistory.filter(n => n.status === "Delivered" || n.status === "Read").length
  const totalReads = notificationHistory.reduce((sum, n) => sum + n.readCount, 0)
  const totalRecipients = notificationHistory.reduce((sum, n) => sum + n.totalRecipients, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
        <Dialog open={isSendDialogOpen} onOpenChange={setIsSendDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Send className="mr-2 h-4 w-4" />
              Send Notification
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Send Push Notification</DialogTitle>
              <DialogDescription>
                Create and send a push notification to selected employee groups via Firebase Cloud Messaging.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={newNotification.title}
                  onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                  className="col-span-3"
                  placeholder="Notification title"
                />
              </div>
              
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="message" className="text-right pt-2">
                  Message
                </Label>
                <Textarea
                  id="message"
                  value={newNotification.message}
                  onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                  className="col-span-3"
                  placeholder="Notification message"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Type</Label>
                <Select value={newNotification.type} onValueChange={(value) => setNewNotification({...newNotification, type: value})}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="Meeting">Meeting</SelectItem>
                    <SelectItem value="System">System</SelectItem>
                    <SelectItem value="Leave">Leave</SelectItem>
                    <SelectItem value="Project">Project</SelectItem>
                    <SelectItem value="Social">Social</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">Recipients</Label>
                <div className="col-span-3 space-y-3">
                  {employeeGroups.map((group) => (
                    <div key={group.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={group.id}
                        checked={newNotification.recipients.includes(group.id)}
                        onCheckedChange={(checked) => handleRecipientChange(group.id, checked)}
                      />
                      <Label htmlFor={group.id} className="flex-1">
                        {group.name} ({group.count} employees)
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Schedule</Label>
                <Select value={newNotification.schedule} onValueChange={(value) => setNewNotification({...newNotification, schedule: value})}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="now">Send Now</SelectItem>
                    <SelectItem value="schedule">Schedule for Later</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsSendDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendNotification}>
                <Send className="mr-2 h-4 w-4" />
                Send Notification
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
            <Bell className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalNotifications}</div>
            <p className="text-xs text-muted-foreground">Notifications sent</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
            <Send className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((deliveredCount / totalNotifications) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">Successfully delivered</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Read Rate</CardTitle>
            <MessageSquare className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((totalReads / totalRecipients) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">Notifications read</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Devices</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">FCM registered devices</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notification History</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Notification</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Sent By</TableHead>
                  <TableHead>Sent At</TableHead>
                  <TableHead>Read Rate</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotifications.map((notification) => (
                  <TableRow key={notification.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{notification.title}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-xs">
                          {notification.message}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getTypeBadge(notification.type)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{notification.recipients}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {notification.sentBy.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{notification.sentBy}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {notification.sentAt}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {notification.readCount}/{notification.totalRecipients}
                        <div className="text-xs text-muted-foreground">
                          {Math.round((notification.readCount / notification.totalRecipients) * 100)}%
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(notification.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 