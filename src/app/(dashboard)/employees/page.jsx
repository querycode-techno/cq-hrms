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
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Search, Edit, Trash2, Eye, Filter, MoreHorizontal, Loader2, AlertCircle, CheckCircle, UserPlus } from "lucide-react"
import Link from "next/link"
import { usePermissions } from '@/hooks/usePermissions'
import PermissionWrapper from '@/components/auth/PermissionWrapper'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function EmployeesPage() {
    const [employees, setEmployees] = useState([])
    const [roles, setRoles] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    
    // Quick Add Dialog State
    const [isQuickAddOpen, setIsQuickAddOpen] = useState(false)
    const [isQuickSubmitting, setIsQuickSubmitting] = useState(false)
    const [quickAddData, setQuickAddData] = useState({
        firstName: "",
        lastName: "",
        personalEmail: "",
        primaryContact: "",
        dateOfBirth: "",
        gender: "",
        roleId: "",
        department: "",
    })

    // Use permissions hook with default resource
    const { 
        user, 
        userRole, 
        canView, 
        canCreate, 
        canUpdate, 
        canDelete,
        can,
        actions 
    } = usePermissions('employees', 'users')

    // Fetch employees and roles on component mount
    useEffect(() => {
        fetchEmployees()
        fetchRoles()
    }, [])

    const fetchEmployees = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/admin/employees')
            const data = await response.json()
            
            if (response.ok) {
                setEmployees(data.data || [])
            } else {
                setError(data.error || 'Failed to fetch employees')
            }
        } catch (error) {
            console.error('Error fetching employees:', error)
            setError('Failed to fetch employees')
        } finally {
            setLoading(false)
        }
    }

    const fetchRoles = async () => {
        try {
            const response = await fetch('/api/roles')
            const data = await response.json()
            
            if (response.ok) {
                setRoles(data.data || [])
            }
        } catch (error) {
            console.error('Error fetching roles:', error)
        }
    }

    const filteredEmployees = employees.filter(
        (employee) =>
            employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleQuickAdd = async () => {
        if (!quickAddData.firstName || !quickAddData.lastName || !quickAddData.personalEmail || 
            !quickAddData.primaryContact || !quickAddData.dateOfBirth || !quickAddData.gender || !quickAddData.roleId) {
            setError('Please fill in all required fields for quick add')
            return
        }

        try {
            setIsQuickSubmitting(true)
            setError("")
            
            const response = await fetch('/api/admin/employees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(quickAddData),
            })

            const data = await response.json()

            if (response.ok) {
                setSuccess('Employee created successfully via Quick Add')
                setEmployees([data.data, ...employees])
                setIsQuickAddOpen(false)
                setQuickAddData({
                    firstName: "",
                    lastName: "",
                    personalEmail: "",
                    primaryContact: "",
                    dateOfBirth: "",
                    gender: "",
                    roleId: "",
                    department: "",
                })
            } else {
                setError(data.error || 'Failed to create employee')
            }
        } catch (error) {
            console.error('Error creating employee:', error)
            setError('Failed to create employee')
        } finally {
            setIsQuickSubmitting(false)
        }
    }

    const handleDeleteEmployee = async (id) => {
        if (!confirm('Are you sure you want to delete this employee?')) {
            return
        }

        try {
            const response = await fetch(`/api/admin/employees/${id}`, {
                method: 'DELETE',
            })

            const data = await response.json()

            if (response.ok) {
                setSuccess('Employee deleted successfully')
                setEmployees(employees.filter(emp => emp.id !== id))
            } else {
                setError(data.error || 'Failed to delete employee')
            }
        } catch (error) {
            console.error('Error deleting employee:', error)
            setError('Failed to delete employee')
        }
    }

    const getStatusBadge = (status) => {
        return status === "Active" ? (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
                Active
            </Badge>
        ) : (
            <Badge variant="outline" className="bg-red-100 text-red-800">
                {status}
            </Badge>
        )
    }

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase()
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString()
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading employees...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {success && (
                <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>{success}</AlertDescription>
                </Alert>
            )}

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Employees</h2>
                    <p className="text-muted-foreground">
                        Manage employee information and records
                    </p>
                </div>
                
                <PermissionWrapper action="create" resource="employees" module="users">
                    <div className="flex items-center space-x-2">
                        {/* Quick Add Dialog */}
                        <Dialog open={isQuickAddOpen} onOpenChange={setIsQuickAddOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline">
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Quick Add
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                    <DialogTitle>Quick Add Employee</DialogTitle>
                                    <DialogDescription>
                                        Add a new employee with basic information. You can complete their profile later.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="quickFirstName">First Name *</Label>
                                            <Input
                                                id="quickFirstName"
                                                value={quickAddData.firstName}
                                                onChange={(e) => setQuickAddData({...quickAddData, firstName: e.target.value})}
                                                placeholder="Enter first name"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="quickLastName">Last Name *</Label>
                                            <Input
                                                id="quickLastName"
                                                value={quickAddData.lastName}
                                                onChange={(e) => setQuickAddData({...quickAddData, lastName: e.target.value})}
                                                placeholder="Enter last name"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <Label htmlFor="quickEmail">Email *</Label>
                                        <Input
                                            id="quickEmail"
                                            type="email"
                                            value={quickAddData.personalEmail}
                                            onChange={(e) => setQuickAddData({...quickAddData, personalEmail: e.target.value})}
                                            placeholder="Enter email address"
                                        />
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="quickPhone">Phone *</Label>
                                            <Input
                                                id="quickPhone"
                                                value={quickAddData.primaryContact}
                                                onChange={(e) => setQuickAddData({...quickAddData, primaryContact: e.target.value})}
                                                placeholder="Enter phone number"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="quickDOB">Date of Birth *</Label>
                                            <Input
                                                id="quickDOB"
                                                type="date"
                                                value={quickAddData.dateOfBirth}
                                                onChange={(e) => setQuickAddData({...quickAddData, dateOfBirth: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="quickGender">Gender *</Label>
                                            <Select value={quickAddData.gender} onValueChange={(value) => setQuickAddData({...quickAddData, gender: value})}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select gender" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Male">Male</SelectItem>
                                                    <SelectItem value="Female">Female</SelectItem>
                                                    <SelectItem value="Other">Other</SelectItem>
                                                    <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label htmlFor="quickRole">Role *</Label>
                                            <Select value={quickAddData.roleId} onValueChange={(value) => setQuickAddData({...quickAddData, roleId: value})}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {roles.map((role) => (
                                                        <SelectItem key={role.id} value={role.id}>
                                                            {role.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <Label htmlFor="quickDepartment">Department</Label>
                                        <Select value={quickAddData.department} onValueChange={(value) => setQuickAddData({...quickAddData, department: value})}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select department" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Engineering">Engineering</SelectItem>
                                                <SelectItem value="Product">Product</SelectItem>
                                                <SelectItem value="Design">Design</SelectItem>
                                                <SelectItem value="Human Resources">Human Resources</SelectItem>
                                                <SelectItem value="Sales">Sales</SelectItem>
                                                <SelectItem value="Marketing">Marketing</SelectItem>
                                                <SelectItem value="Finance">Finance</SelectItem>
                                                <SelectItem value="Operations">Operations</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsQuickAddOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button 
                                        onClick={handleQuickAdd}
                                        disabled={isQuickSubmitting}
                                    >
                                        {isQuickSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Creating...
                                            </>
                                        ) : (
                                            'Quick Add Employee'
                                        )}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        {/* Full Onboarding Button */}
                        <Link href="/employees/add">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Employee
                            </Button>
                        </Link>
                    </div>
                </PermissionWrapper>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Employee Directory ({employees.length} employees)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search employees..."
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

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Employee</TableHead>
                                    <TableHead>Employee ID</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Join Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredEmployees.map((employee) => (
                                    <TableRow key={employee.id}>
                                        <TableCell>
                                            <div className="flex items-center space-x-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={employee.profileImage} alt={employee.name} />
                                                    <AvatarFallback className="text-sm">
                                                        {getInitials(employee.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium">{employee.name}</div>
                                                    <div className="text-sm text-muted-foreground">{employee.email}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-mono text-sm">{employee.employeeId}</TableCell>
                                        <TableCell>{employee.department}</TableCell>
                                        <TableCell>{employee.role}</TableCell>
                                        <TableCell>{getStatusBadge(employee.status)}</TableCell>
                                        <TableCell>{formatDate(employee.joinDate)}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <PermissionWrapper action="view" resource="employees" module="users">
                                                        <Link href={`/employees/${employee.id}`}>
                                                            <DropdownMenuItem>
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                View Details
                                                            </DropdownMenuItem>
                                                        </Link>
                                                    </PermissionWrapper>

                                                    <PermissionWrapper action="update" resource="employees" module="users">
                                                        <Link href={`/employees/${employee.id}/edit`}>
                                                            <DropdownMenuItem>
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit Employee
                                                            </DropdownMenuItem>
                                                        </Link>
                                                    </PermissionWrapper>

                                                    <PermissionWrapper action="delete" resource="employees" module="users">
                                                        <DropdownMenuItem 
                                                            className="text-red-600"
                                                            onClick={() => handleDeleteEmployee(employee.id)}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete Employee
                                                        </DropdownMenuItem>
                                                    </PermissionWrapper>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {filteredEmployees.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-muted-foreground">
                                {searchTerm ? 'No employees found matching your search.' : 'No employees found.'}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
} 