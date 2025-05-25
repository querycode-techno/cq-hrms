"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Building, 
  Users, 
  Clock, 
  Laptop, 
  Shield, 
  CheckCircle,
  XCircle,
  User,
  Globe,
  Heart,
  FileText,
  CreditCard,
  Lock,
  Loader2,
  AlertCircle,
  Edit
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { usePermissions } from '@/hooks/usePermissions'
import PermissionWrapper from '@/components/auth/PermissionWrapper'

// Mock data for attendance, leave, salary, and documents
const attendanceRecords = [
  { date: "2024-01-15", checkIn: "09:00", checkOut: "18:00", hours: "9h", status: "Present" },
  { date: "2024-01-14", checkIn: "09:15", checkOut: "18:30", hours: "9h 15m", status: "Present" },
  { date: "2024-01-13", checkIn: "08:45", checkOut: "17:45", hours: "9h", status: "Present" },
  { date: "2024-01-12", checkIn: "-", checkOut: "-", hours: "0h", status: "Absent" },
  { date: "2024-01-11", checkIn: "09:00", checkOut: "18:00", hours: "9h", status: "Present" },
]

const leaveHistory = [
  { id: 1, type: "Annual Leave", startDate: "2024-01-20", endDate: "2024-01-22", days: 3, status: "Approved" },
  { id: 2, type: "Sick Leave", startDate: "2024-01-12", endDate: "2024-01-12", days: 1, status: "Approved" },
  { id: 3, type: "Personal Leave", startDate: "2024-02-05", endDate: "2024-02-06", days: 2, status: "Pending" },
]

const salaryHistory = [
  { month: "January 2024", basic: "$6,250", bonus: "$500", total: "$6,750", status: "Paid" },
  { month: "December 2023", basic: "$6,250", bonus: "$1,000", total: "$7,250", status: "Paid" },
  { month: "November 2023", basic: "$6,250", bonus: "$0", total: "$6,250", status: "Paid" },
  { month: "October 2023", basic: "$6,250", bonus: "$500", total: "$6,750", status: "Paid" },
]

const documents = [
  { name: "Resume", type: "PDF", size: "2.5 MB", uploaded: "2023-01-10", status: "Verified" },
  { name: "ID Proof (Aadhar)", type: "PDF", size: "1.2 MB", uploaded: "2023-01-10", status: "Verified" },
  { name: "Address Proof", type: "PDF", size: "0.8 MB", uploaded: "2023-01-10", status: "Verified" },
  { name: "Educational Certificates", type: "PDF", size: "3.1 MB", uploaded: "2023-01-10", status: "Pending" },
  { name: "Previous Company Relieving Letter", type: "PDF", size: "0.5 MB", uploaded: "2023-01-12", status: "Verified" },
]

// Component: Profile Information Card
function ProfileInformationCard({ employee, getStatusBadge }) {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={employee.profileImage} />
            <AvatarFallback className="text-lg">
              {employee.name?.split(' ').map(n => n[0]).join('') || 'N/A'}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h3 className="text-lg font-semibold">{employee.name}</h3>
            <p className="text-sm text-muted-foreground">{employee.role}</p>
            <div className="flex items-center space-x-2 mt-2">
              {getStatusBadge(employee.status)}
              {employee.employeeId && (
                <Badge variant="outline" className="text-xs">
                  {employee.employeeId}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{employee.email}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{employee.primaryContact}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Joined {new Date(employee.joinDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Building className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{employee.department}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Component: Attendance, Leave & Salary Tabs Card
function AttendanceTabsCard({ employee, getStatusBadge }) {
  return (
    <Card>
      <CardContent className="p-6">
        <Tabs defaultValue="attendance" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="leaves">Leave History</TabsTrigger>
            <TabsTrigger value="salary">Salary History</TabsTrigger>
          </TabsList>

          <TabsContent value="attendance" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Recent Attendance</h3>
              <Badge variant="outline">95% this month</Badge>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceRecords.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.checkIn}</TableCell>
                    <TableCell>{record.checkOut}</TableCell>
                    <TableCell>{record.hours}</TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="leaves" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Leave History</h3>
              <Badge variant="outline">15 days available</Badge>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaveHistory.map((leave) => (
                  <TableRow key={leave.id}>
                    <TableCell>{leave.type}</TableCell>
                    <TableCell>{leave.startDate}</TableCell>
                    <TableCell>{leave.endDate}</TableCell>
                    <TableCell>{leave.days}</TableCell>
                    <TableCell>{getStatusBadge(leave.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="salary" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Salary History</h3>
              <Badge variant="outline">Annual: {employee.salary || 'Not Set'}</Badge>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead>Basic Salary</TableHead>
                  <TableHead>Bonus</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salaryHistory.map((salary, index) => (
                  <TableRow key={index}>
                    <TableCell>{salary.month}</TableCell>
                    <TableCell>{salary.basic}</TableCell>
                    <TableCell>{salary.bonus}</TableCell>
                    <TableCell className="font-medium">{salary.total}</TableCell>
                    <TableCell>{getStatusBadge(salary.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

// Component: Employment Details Card
function EmploymentDetailsCard({ employee }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Building className="h-5 w-5 mr-2" />
            Employment Details
          </span>
          <Badge variant="outline">Full-time</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Building className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Department</p>
                <p className="text-sm text-muted-foreground">{employee.department || 'Not Set'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Role</p>
                <p className="text-sm text-muted-foreground">{employee.role || 'Not Set'}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Work Location</p>
                <p className="text-sm text-muted-foreground">Office</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Shift Timings</p>
                <p className="text-sm text-muted-foreground">9 AM - 5 PM</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Working Hours</p>
                <p className="text-sm text-muted-foreground">40 hours/week</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Employment Type</p>
                <p className="text-sm text-muted-foreground">Full-time</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Component: Additional Information Card
function AdditionalInformationCard({ employee }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Additional Information
          </span>
          <Badge variant="outline">Personal Details</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="font-medium text-base flex items-center">
              <User className="h-4 w-4 mr-2" />
              Personal Details
            </h4>
            {employee.dateOfBirth && (
              <div>
                <p className="text-sm font-medium">Date of Birth</p>
                <p className="text-sm text-muted-foreground">{new Date(employee.dateOfBirth).toLocaleDateString()}</p>
              </div>
            )}
            {employee.gender && (
              <div>
                <p className="text-sm font-medium">Gender</p>
                <p className="text-sm text-muted-foreground">{employee.gender}</p>
              </div>
            )}
            {employee.bloodGroup && (
              <div>
                <p className="text-sm font-medium">Blood Group</p>
                <p className="text-sm text-muted-foreground">{employee.bloodGroup}</p>
              </div>
            )}
          </div>
          <div className="space-y-4">
            <h4 className="font-medium text-base flex items-center">
              <Heart className="h-4 w-4 mr-2" />
              Contact Information
            </h4>
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{employee.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Phone</p>
              <p className="text-sm text-muted-foreground">{employee.primaryContact}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Component: Documents Card
function DocumentsCard() {
  const getStatusBadge = (status) => {
    const variants = {
      "Verified": "bg-green-100 text-green-800",
      "Pending": "bg-yellow-100 text-yellow-800",
      "Rejected": "bg-red-100 text-red-800",
    }
    
    return (
      <Badge variant="secondary" className={variants[status] || ""}>
        {status}
      </Badge>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Documents
          </span>
          <Badge variant="outline">{documents.length} Documents</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Upload Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{doc.name}</TableCell>
                <TableCell>{doc.type}</TableCell>
                <TableCell>{doc.size}</TableCell>
                <TableCell>{doc.uploaded}</TableCell>
                <TableCell>{getStatusBadge(doc.status)}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="text-blue-600">
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default function EmployeeProfilePage() {
  const params = useParams()
  const employeeId = params.id
  const [employee, setEmployee] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const { canView, canUpdate } = usePermissions('employees', 'users')

  useEffect(() => {
    fetchEmployee()
  }, [employeeId])

  const fetchEmployee = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/employees/${employeeId}`)
      const data = await response.json()
      
      if (response.ok) {
        setEmployee(data.data)
      } else {
        setError(data.error || 'Failed to fetch employee')
      }
    } catch (error) {
      console.error('Error fetching employee:', error)
      setError('Failed to fetch employee')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      "Present": "bg-green-100 text-green-800",
      "Absent": "bg-red-100 text-red-800",
      "Approved": "bg-green-100 text-green-800",
      "Pending": "bg-yellow-100 text-yellow-800",
      "Paid": "bg-blue-100 text-blue-800",
      "Active": "bg-green-100 text-green-800",
    }
    
    return (
      <Badge variant="secondary" className={variants[status] || ""}>
        {status}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading employee profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link href="/employees">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Employees
            </Button>
          </Link>
        </div>
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!employee) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link href="/employees">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Employees
            </Button>
          </Link>
        </div>
        
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Employee not found</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/employees">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Employees
            </Button>
          </Link>
        </div>
        
        <PermissionWrapper action="update" resource="employees" module="users">
          <Link href={`/employees/${employeeId}/edit`}>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Edit Employee
            </Button>
          </Link>
        </PermissionWrapper>
      </div>

      {/* Row 1: Profile Information + Attendance/Leave/Salary Tabs */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <ProfileInformationCard employee={employee} getStatusBadge={getStatusBadge} />
        </div>
        <div className="md:col-span-2">
          <AttendanceTabsCard employee={employee} getStatusBadge={getStatusBadge} />
        </div>
      </div>

      {/* Row 2: Employment Details */}
      <EmploymentDetailsCard employee={employee} />

      {/* Row 3: Additional Info */}
      <AdditionalInformationCard employee={employee} />

      {/* Row 4: Documents */}
      <DocumentsCard />
    </div>
  )
} 