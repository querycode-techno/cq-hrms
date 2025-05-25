"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Clock, Camera, Upload, Search, Calendar, Filter, Edit, Save, X, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const attendanceRecords = [
  {
    id: 1,
    employee: "John Doe",
    avatar: "",
    date: "2024-01-15",
    checkIn: "09:00 AM",
    checkOut: "06:00 PM",
    totalHours: "9h 0m",
    status: "Present",
    location: "Office"
  },
  {
    id: 2,
    employee: "Sarah Wilson",
    avatar: "",
    date: "2024-01-15",
    checkIn: "08:45 AM",
    checkOut: "05:45 PM",
    totalHours: "9h 0m",
    status: "Present",
    location: "Remote"
  },
  {
    id: 3,
    employee: "Mike Johnson",
    avatar: "",
    date: "2024-01-15",
    checkIn: "-",
    checkOut: "-",
    totalHours: "0h 0m",
    status: "Absent",
    location: "-"
  },
  {
    id: 4,
    employee: "Emily Davis",
    avatar: "",
    date: "2024-01-16",
    checkIn: "09:15 AM",
    checkOut: "06:15 PM",
    totalHours: "9h 0m",
    status: "Present",
    location: "Office"
  },
  {
    id: 5,
    employee: "Alex Chen",
    avatar: "",
    date: "2024-01-16",
    checkIn: "10:00 AM",
    checkOut: "07:00 PM",
    totalHours: "9h 0m",
    status: "Late",
    location: "Office"
  },
  {
    id: 6,
    employee: "John Doe",
    avatar: "",
    date: "2024-02-10",
    checkIn: "09:00 AM",
    checkOut: "06:00 PM",
    totalHours: "9h 0m",
    status: "Present",
    location: "Office"
  },
  {
    id: 7,
    employee: "Sarah Wilson",
    avatar: "",
    date: "2024-02-10",
    checkIn: "08:30 AM",
    checkOut: "05:30 PM",
    totalHours: "9h 0m",
    status: "Present",
    location: "Remote"
  },
  {
    id: 8,
    employee: "Mike Johnson",
    avatar: "",
    date: "2024-02-11",
    checkIn: "09:30 AM",
    checkOut: "06:30 PM",
    totalHours: "9h 0m",
    status: "Late",
    location: "Office"
  },
]

const employees = [
  "All Employees",
  "John Doe",
  "Sarah Wilson",
  "Mike Johnson",
  "Emily Davis",
  "Alex Chen"
]

// Component: Header Section
function HeaderSection({ punchStatus, punchLoading, handlePunch, isPunchDialogOpen, setIsPunchDialogOpen, setPunchAction, isAddAttendanceOpen, setIsAddAttendanceOpen, handleAddAttendance, employees }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-3xl font-bold tracking-tight">Attendance Management</h2>
      <div className="flex items-center space-x-2">
        <Dialog open={isPunchDialogOpen} onOpenChange={setIsPunchDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => setPunchAction("in")} 
              disabled={!punchStatus.canPunchIn || punchLoading}
            >
              {punchLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Clock className="mr-2 h-4 w-4" />
              )}
              Punch In
            </Button>
          </DialogTrigger>
          <PunchDialog 
            isPunchDialogOpen={isPunchDialogOpen}
            setIsPunchDialogOpen={setIsPunchDialogOpen}
            setPunchAction={setPunchAction}
            punchStatus={punchStatus}
            punchLoading={punchLoading}
            handlePunch={handlePunch}
          />
        </Dialog>
        
        <Button 
          variant="outline" 
          onClick={() => {
            setPunchAction("out")
            setIsPunchDialogOpen(true)
          }}
          disabled={!punchStatus.canPunchOut || punchLoading}
        >
          {punchLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Clock className="mr-2 h-4 w-4" />
          )}
          Punch Out
        </Button>

        <Dialog open={isAddAttendanceOpen} onOpenChange={setIsAddAttendanceOpen}>
          <DialogTrigger asChild>
            <Button variant="default">
              <Clock className="mr-2 h-4 w-4" />
              Add Attendance
            </Button>
          </DialogTrigger>
          <AddAttendanceDialog 
            isAddAttendanceOpen={isAddAttendanceOpen}
            setIsAddAttendanceOpen={setIsAddAttendanceOpen}
            handleAddAttendance={handleAddAttendance}
            employees={employees}
          />
        </Dialog>
      </div>
    </div>
  )
}

// Component: Summary Cards Section
function SummaryCardsSection({ summary, loading }) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Present Today</CardTitle>
          <Clock className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              summary.present
            )}
          </div>
          <p className="text-xs text-muted-foreground">80% attendance</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Absent Today</CardTitle>
          <Clock className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              summary.absent
            )}
          </div>
          <p className="text-xs text-muted-foreground">20% absent</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Late Arrivals</CardTitle>
          <Clock className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              summary.late
            )}
          </div>
          <p className="text-xs text-muted-foreground">After 9:00 AM</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Hours</CardTitle>
          <Clock className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              summary.averageHours.toFixed(2) + "h"
            )}
          </div>
          <p className="text-xs text-muted-foreground">This week</p>
        </CardContent>
      </Card>
    </div>
  )
}

// Component: Filters Section
function FiltersSection({ 
  searchTerm, 
  setSearchTerm, 
  selectedDate, 
  setSelectedDate, 
  selectedMonth,
  setSelectedMonth,
  selectedEmployee, 
  setSelectedEmployee,
  clearFilters,
  fetchAttendanceRecords,
  employees
}) {
  const handleFilterChange = () => {
    fetchAttendanceRecords({
      search: searchTerm,
      date: selectedDate,
      month: selectedMonth,
      employee: selectedEmployee !== 'All Employees' && selectedEmployee !== 'all' ? selectedEmployee : null
    })
  }

  return (
    <div className="flex items-center space-x-2 flex-wrap gap-2">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setTimeout(handleFilterChange, 300) // Debounce search
          }}
          className="pl-8"
        />
      </div>
      
      <Select value={selectedEmployee} onValueChange={(value) => {
        setSelectedEmployee(value)
        setTimeout(handleFilterChange, 100)
      }}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select employee" />
        </SelectTrigger>
        <SelectContent>
          {employees.map((employee) => (
            <SelectItem key={employee.id || employee} value={employee.id || employee}>
              {employee.name || employee}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center space-x-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value)
            setSelectedMonth("") // Clear month when date is selected
            setTimeout(handleFilterChange, 100)
          }}
          className="w-auto"
          placeholder="Select date"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <Input
          type="month"
          value={selectedMonth}
          onChange={(e) => {
            setSelectedMonth(e.target.value)
            setSelectedDate("") // Clear date when month is selected
            setTimeout(handleFilterChange, 100)
          }}
          className="w-auto"
          placeholder="Select month"
        />
      </div>
      
      <Button variant="outline" size="sm" onClick={clearFilters}>
        <Filter className="h-4 w-4 mr-2" />
        Clear Filters
      </Button>
    </div>
  )
}

// Component: Editable Row
function EditableRow({ record, onSave, getStatusBadge }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    checkIn: record.checkIn,
    checkOut: record.checkOut,
    totalHours: record.totalHours,
    status: record.status,
    location: record.location
  })

  const handleSave = () => {
    onSave(record.id, editData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditData({
      checkIn: record.checkIn,
      checkOut: record.checkOut,
      totalHours: record.totalHours,
      status: record.status,
      location: record.location
    })
    setIsEditing(false)
  }

  // Safely get employee name - handle both API response format and local format
  const getEmployeeName = () => {
    if (typeof record.employee === 'string') {
      return record.employee
    }
    if (record.employee?.name) {
      return record.employee.name
    }
    if (record.employee?.firstName && record.employee?.lastName) {
      return `${record.employee.firstName} ${record.employee.lastName}`
    }
    return 'Unknown Employee'
  }

  const employeeName = getEmployeeName()

  return (
    <TableRow>
      <TableCell className="flex items-center space-x-3">
        <Avatar>
          <AvatarImage src={record.employee?.avatar || record.avatar} />
          <AvatarFallback>
            {employeeName.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <span className="font-medium">{employeeName}</span>
      </TableCell>
      
      <TableCell>
        <span className="text-sm text-muted-foreground">{record.date}</span>
      </TableCell>
      
      <TableCell>
        {isEditing ? (
          <Input
            type="time"
            value={editData.checkIn}
            onChange={(e) => setEditData({ ...editData, checkIn: e.target.value })}
            className="w-24"
          />
        ) : (
          record.checkIn
        )}
      </TableCell>
      
      <TableCell>
        {isEditing ? (
          <Input
            type="time"
            value={editData.checkOut}
            onChange={(e) => setEditData({ ...editData, checkOut: e.target.value })}
            className="w-24"
          />
        ) : (
          record.checkOut
        )}
      </TableCell>
      
      <TableCell>
        {isEditing ? (
          <Input
            value={editData.totalHours}
            onChange={(e) => setEditData({ ...editData, totalHours: e.target.value })}
            className="w-20"
            placeholder="8h 30m"
          />
        ) : (
          record.totalHours
        )}
      </TableCell>
      
      <TableCell>
        {isEditing ? (
          <Select 
            value={editData.status} 
            onValueChange={(value) => setEditData({ ...editData, status: value })}
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Present">Present</SelectItem>
              <SelectItem value="Absent">Absent</SelectItem>
              <SelectItem value="Late">Late</SelectItem>
              <SelectItem value="Early Leave">Early Leave</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          getStatusBadge(record.status)
        )}
      </TableCell>
      
      <TableCell>
        {isEditing ? (
          <Select 
            value={editData.location} 
            onValueChange={(value) => setEditData({ ...editData, location: value })}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Office">Office</SelectItem>
              <SelectItem value="Remote">Remote</SelectItem>
              <SelectItem value="Field">Field</SelectItem>
              <SelectItem value="-">-</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          record.location
        )}
      </TableCell>
      
      <TableCell>
        {isEditing ? (
          <div className="flex items-center space-x-1">
            <Button size="sm" onClick={handleSave} className="h-7 w-7 p-0">
              <Save className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel} className="h-7 w-7 p-0">
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)} className="h-7 w-7 p-0">
            <Edit className="h-3 w-3" />
          </Button>
        )}
      </TableCell>
    </TableRow>
  )
}

// Component: Attendance Table Section
function AttendanceTableSection({ filteredRecords, onSave, getStatusBadge }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Check In</TableHead>
          <TableHead>Check Out</TableHead>
          <TableHead>Total Hours</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredRecords.map((record) => (
          <EditableRow 
            key={record.id} 
            record={record} 
            onSave={onSave} 
            getStatusBadge={getStatusBadge}
          />
        ))}
      </TableBody>
    </Table>
  )
}

// Component: Add Attendance Dialog
function AddAttendanceDialog({ isAddAttendanceOpen, setIsAddAttendanceOpen, handleAddAttendance, employees }) {
  const [formData, setFormData] = useState({
    employee: "",
    date: "",
    checkIn: "",
    checkOut: "",
    status: "Present",
    location: "Office"
  })
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.employee) newErrors.employee = "Employee is required"
    if (!formData.date) newErrors.date = "Date is required"
    if (!formData.checkIn) newErrors.checkIn = "Check In time is required"
    if (formData.status === "Present" && !formData.checkOut) {
      newErrors.checkOut = "Check Out time is required for Present status"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const calculateTotalHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return "0h 0m"
    
    const [inHour, inMin] = checkIn.split(':').map(Number)
    const [outHour, outMin] = checkOut.split(':').map(Number)
    
    const inTime = inHour * 60 + inMin
    const outTime = outHour * 60 + outMin
    
    const diffMin = outTime - inTime
    const hours = Math.floor(diffMin / 60)
    const minutes = diffMin % 60
    
    return `${hours}h ${minutes}m`
  }

  const formatTime12Hour = (time24) => {
    if (!time24) return "-"
    const [hour, minute] = time24.split(':')
    const hour12 = ((hour % 12) || 12)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    return `${hour12}:${minute} ${ampm}`
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    const totalHours = formData.status === "Absent" 
      ? "0h 0m" 
      : calculateTotalHours(formData.checkIn, formData.checkOut)

    // Find the selected employee object
    const selectedEmployee = employees.find(emp => 
      typeof emp === 'object' && emp.id === formData.employee
    )

    const newRecord = {
      employeeId: formData.employee,
      date: formData.date,
      checkIn: formData.status === "Absent" ? "-" : formData.checkIn,
      checkOut: formData.status === "Absent" ? "-" : formData.checkOut,
      status: formData.status,
      location: formData.status === "Absent" ? "-" : formData.location
    }

    handleAddAttendance(newRecord)
    
    // Reset form
    setFormData({
      employee: "",
      date: "",
      checkIn: "",
      checkOut: "",
      status: "Present",
      location: "Office"
    })
    setErrors({})
    setIsAddAttendanceOpen(false)
  }

  const handleCancel = () => {
    setFormData({
      employee: "",
      date: "",
      checkIn: "",
      checkOut: "",
      status: "Present",
      location: "Office"
    })
    setErrors({})
    setIsAddAttendanceOpen(false)
  }

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Add Attendance Record</DialogTitle>
        <DialogDescription>
          Manually add attendance record for an employee.
        </DialogDescription>
      </DialogHeader>
      
      <div className="grid gap-4 py-4">
        {/* Employee Selection */}
        <div className="grid gap-2">
          <Label htmlFor="employee">Employee *</Label>
          <Select 
            value={formData.employee} 
            onValueChange={(value) => setFormData({ ...formData, employee: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select employee" />
            </SelectTrigger>
            <SelectContent>
              {employees.filter(emp => typeof emp === 'object' && emp.id).map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.employee && <span className="text-sm text-red-500">{errors.employee}</span>}
        </div>

        {/* Date */}
        <div className="grid gap-2">
          <Label htmlFor="date">Date *</Label>
          <Input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
          {errors.date && <span className="text-sm text-red-500">{errors.date}</span>}
        </div>

        {/* Status */}
        <div className="grid gap-2">
          <Label htmlFor="status">Status</Label>
          <Select 
            value={formData.status} 
            onValueChange={(value) => setFormData({ ...formData, status: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Present">Present</SelectItem>
              <SelectItem value="Absent">Absent</SelectItem>
              <SelectItem value="Late">Late</SelectItem>
              <SelectItem value="Early Leave">Early Leave</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.status !== "Absent" && (
          <>
            {/* Check In */}
            <div className="grid gap-2">
              <Label htmlFor="checkIn">Check In *</Label>
              <Input
                type="time"
                value={formData.checkIn}
                onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
              />
              {errors.checkIn && <span className="text-sm text-red-500">{errors.checkIn}</span>}
            </div>

            {/* Check Out */}
            <div className="grid gap-2">
              <Label htmlFor="checkOut">Check Out {formData.status === "Present" ? "*" : ""}</Label>
              <Input
                type="time"
                value={formData.checkOut}
                onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
              />
              {errors.checkOut && <span className="text-sm text-red-500">{errors.checkOut}</span>}
            </div>

            {/* Location */}
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Select 
                value={formData.location} 
                onValueChange={(value) => setFormData({ ...formData, location: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Office">Office</SelectItem>
                  <SelectItem value="Remote">Remote</SelectItem>
                  <SelectItem value="Field">Field</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {/* Total Hours Preview */}
        {formData.checkIn && formData.checkOut && formData.status !== "Absent" && (
          <div className="grid gap-2">
            <Label>Total Hours (Preview)</Label>
            <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
              {calculateTotalHours(formData.checkIn, formData.checkOut)}
            </div>
          </div>
        )}
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          Add Attendance
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}

// Component: Punch Dialog
function PunchDialog({ isPunchDialogOpen, setIsPunchDialogOpen, setPunchAction, punchStatus, punchLoading, handlePunch }) {
  const [selectedImage, setSelectedImage] = useState(null)
  const [punchActionState, setPunchActionState] = useState("in")

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedImage(file)
    }
  }

  const handlePunchClick = () => {
    handlePunch(punchActionState, selectedImage)
    setSelectedImage(null)
  }

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>
          {punchActionState === "in" ? "Punch In" : "Punch Out"}
        </DialogTitle>
        <DialogDescription>
          Take a photo or upload an image to record your attendance.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{getCurrentTime()}</div>
          <p className="text-sm text-muted-foreground">Current Time</p>
        </div>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
          <div className="text-center">
            <Camera className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <Button variant="outline" className="mb-2">
                <Camera className="mr-2 h-4 w-4" />
                Take Photo
              </Button>
              <p className="text-sm text-muted-foreground">or</p>
              <Label htmlFor="image-upload" className="cursor-pointer">
                <Button variant="ghost" asChild>
                  <span>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Image
                  </span>
                </Button>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </Label>
            </div>
            {selectedImage && (
              <p className="text-sm text-green-600 mt-2">
                Image selected: {selectedImage.name}
              </p>
            )}
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button 
          type="submit" 
          onClick={handlePunchClick}
          disabled={!selectedImage || punchLoading}
        >
          {punchActionState === "in" ? "Punch In" : "Punch Out"}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}

// Main Component
export default function AttendancePage() {
  const { toast } = useToast()
  
  // State management
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedMonth, setSelectedMonth] = useState("")
  const [selectedEmployee, setSelectedEmployee] = useState("all")
  const [isPunchDialogOpen, setIsPunchDialogOpen] = useState(false)
  const [punchAction, setPunchAction] = useState("in")
  const [isAddAttendanceOpen, setIsAddAttendanceOpen] = useState(false)
  
  // Data state
  const [records, setRecords] = useState([])
  const [employees, setEmployees] = useState([])
  const [summary, setSummary] = useState({
    present: 0,
    absent: 0,
    late: 0,
    earlyLeave: 0,
    attendancePercentage: 0,
    averageHours: 0
  })
  const [punchStatus, setPunchStatus] = useState({
    hasPunchedIn: false,
    hasPunchedOut: false,
    canPunchIn: true,
    canPunchOut: false
  })
  
  // Loading states
  const [loading, setLoading] = useState(true)
  const [summaryLoading, setSummaryLoading] = useState(true)
  const [punchLoading, setPunchLoading] = useState(false)

  // Fetch data on component mount
  useEffect(() => {
    fetchAttendanceRecords()
    fetchEmployees()
    fetchSummary()
    fetchPunchStatus()
  }, [])

  // Fetch attendance records
  const fetchAttendanceRecords = async (filters = {}) => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (filters.search || searchTerm) params.append('search', filters.search || searchTerm)
      if (filters.date || selectedDate) params.append('date', filters.date || selectedDate)
      if (filters.month || selectedMonth) params.append('month', filters.month || selectedMonth)
      if (filters.employee || (selectedEmployee && selectedEmployee !== 'All Employees')) {
        params.append('employeeId', filters.employee || selectedEmployee)
      }
      
      const response = await fetch(`/api/attendance?${params}`)
      const data = await response.json()
      
      if (response.ok) {
        setRecords(data.data || [])
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to fetch attendance records",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error fetching attendance records:', error)
      toast({
        title: "Error",
        description: "Failed to fetch attendance records",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Fetch employees list
  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/admin/employees')
      const data = await response.json()
      
      if (response.ok) {
        const employeeObjects = data.data.map(emp => ({
          id: emp.id,
          name: `${emp.firstName} ${emp.lastName}`,
          value: emp.id
        }))
        
        // Create a clean array structure for employees
        setEmployees([
          { id: 'all', name: 'All Employees', value: 'all' },
          ...employeeObjects
        ])
      }
    } catch (error) {
      console.error('Error fetching employees:', error)
    }
  }

  // Fetch summary statistics
  const fetchSummary = async () => {
    try {
      setSummaryLoading(true)
      const response = await fetch('/api/attendance/summary')
      const data = await response.json()
      
      if (response.ok) {
        setSummary({
          present: data.data.todaysSummary.present,
          absent: data.data.todaysSummary.absent,
          late: data.data.todaysSummary.late,
          earlyLeave: data.data.todaysSummary.earlyLeave,
          attendancePercentage: data.data.todaysSummary.attendancePercentage,
          averageHours: data.data.averageHours
        })
      }
    } catch (error) {
      console.error('Error fetching summary:', error)
    } finally {
      setSummaryLoading(false)
    }
  }

  // Fetch punch status
  const fetchPunchStatus = async () => {
    try {
      const response = await fetch('/api/attendance/punch')
      const data = await response.json()
      
      if (response.ok) {
        setPunchStatus(data.data)
      }
    } catch (error) {
      console.error('Error fetching punch status:', error)
    }
  }

  // Handle punch in/out
  const handlePunch = async (action, image = null) => {
    try {
      setPunchLoading(true)
      
      const response = await fetch('/api/attendance/punch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          image,
          location: {
            type: 'Office',
            name: 'Main Office'
          }
        }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        toast({
          title: "Success",
          description: data.message,
        })
        
        // Refresh data
        fetchPunchStatus()
        fetchAttendanceRecords()
        fetchSummary()
        setIsPunchDialogOpen(false)
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to process punch",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error processing punch:', error)
      toast({
        title: "Error",
        description: "Failed to process punch",
        variant: "destructive"
      })
    } finally {
      setPunchLoading(false)
    }
  }

  // Handle add attendance
  const handleAddAttendance = async (attendanceData) => {
    try {
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeId: attendanceData.employeeId,
          date: attendanceData.date,
          checkIn: attendanceData.checkIn,
          checkOut: attendanceData.checkOut,
          status: attendanceData.status,
          location: {
            type: attendanceData.location || 'Office',
            name: attendanceData.location || 'Main Office'
          },
          modificationReason: 'Manual entry by admin'
        }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Attendance record added successfully",
        })
        
        // Refresh data
        fetchAttendanceRecords()
        fetchSummary()
        setIsAddAttendanceOpen(false)
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to add attendance record",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error adding attendance:', error)
      toast({
        title: "Error",
        description: "Failed to add attendance record",
        variant: "destructive"
      })
    }
  }

  // Handle edit attendance
  const handleEditAttendance = async (id, editData) => {
    try {
      const response = await fetch(`/api/attendance/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          checkIn: editData.checkIn,
          checkOut: editData.checkOut,
          status: editData.status,
          location: {
            type: editData.location || 'Office',
            name: editData.location || 'Main Office'
          },
          modificationReason: 'Updated by admin'
        }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Attendance record updated successfully",
        })
        
        // Update local state
        setRecords(prevRecords => 
          prevRecords.map(record => 
            record.id === id 
              ? { ...record, ...data.data }
              : record
          )
        )
        
        // Refresh summary
        fetchSummary()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update attendance record",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error updating attendance:', error)
      toast({
        title: "Error",
        description: "Failed to update attendance record",
        variant: "destructive"
      })
    }
  }

  // Filter records
  const filteredRecords = records.filter(record => {
    const employeeName = typeof record.employee === 'string' 
      ? record.employee 
      : record.employee?.name || `${record.employee?.firstName || ''} ${record.employee?.lastName || ''}`.trim()
    
    const matchesSearch = employeeName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesEmployee = selectedEmployee === "all" || 
                           record.employee?.id === selectedEmployee ||
                           record.employee?.employeeId === selectedEmployee
    return matchesSearch && matchesEmployee
  })

  // Clear filters
  const clearFilters = () => {
    setSearchTerm("")
    setSelectedDate("")
    setSelectedMonth("")
    setSelectedEmployee("all")
    fetchAttendanceRecords()
  }

  // Get status badge
  const getStatusBadge = (status) => {
    const variants = {
      "Present": "bg-green-100 text-green-800",
      "Absent": "bg-red-100 text-red-800",
      "Late": "bg-yellow-100 text-yellow-800",
      "Early Leave": "bg-orange-100 text-orange-800",
    }
    
    return (
      <Badge variant="secondary" className={variants[status] || ""}>
        {status}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <HeaderSection 
        punchStatus={punchStatus}
        punchLoading={punchLoading}
        handlePunch={handlePunch}
        isPunchDialogOpen={isPunchDialogOpen}
        setIsPunchDialogOpen={setIsPunchDialogOpen}
        setPunchAction={setPunchAction}
        isAddAttendanceOpen={isAddAttendanceOpen}
        setIsAddAttendanceOpen={setIsAddAttendanceOpen}
        handleAddAttendance={handleAddAttendance}
        employees={employees}
      />

      {/* Summary Cards */}
      <SummaryCardsSection summary={summary} loading={summaryLoading} />

      {/* Attendance Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
          <FiltersSection
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            selectedEmployee={selectedEmployee}
            setSelectedEmployee={setSelectedEmployee}
            clearFilters={clearFilters}
            fetchAttendanceRecords={fetchAttendanceRecords}
            employees={employees}
          />
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading attendance records...</span>
            </div>
          ) : (
            <AttendanceTableSection
              filteredRecords={filteredRecords}
              onSave={handleEditAttendance}
              getStatusBadge={getStatusBadge}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
} 