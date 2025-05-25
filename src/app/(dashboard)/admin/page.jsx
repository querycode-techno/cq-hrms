"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Shield, Activity, Eye, Edit, Trash2, Search, Filter, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { usePermissions } from '@/hooks/usePermissions'
import PermissionWrapper from '@/components/auth/PermissionWrapper'

export default function AdminPage() {
  const [admins, setAdmins] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [newAdmin, setNewAdmin] = useState({
    firstName: "",
    lastName: "",
    email: "",
    roleId: "",
    department: "",
    password: ""
  })

  const { user, userRole, can } = usePermissions()

  // Fetch admins and roles on component mount
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [adminsResponse, rolesResponse] = await Promise.all([
        fetch('/api/admin/admins'),
        fetch('/api/roles')
      ])

      if (adminsResponse.ok) {
        const adminsData = await adminsResponse.json()
        setAdmins(adminsData.data || [])
      }

      if (rolesResponse.ok) {
        const rolesData = await rolesResponse.json()
        setRoles(rolesData.data || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const filteredAdmins = admins.filter(admin =>
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddAdmin = async () => {
    if (!newAdmin.firstName || !newAdmin.lastName || !newAdmin.email || !newAdmin.roleId || !newAdmin.password) {
      setError('Please fill in all required fields')
      return
    }

    try {
      setIsSubmitting(true)
      setError("")
      
      const response = await fetch('/api/admin/admins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAdmin),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Admin user created successfully')
        setAdmins([data.data, ...admins])
        setIsAddDialogOpen(false)
        setNewAdmin({
          firstName: "",
          lastName: "",
          email: "",
          roleId: "",
          department: "",
          password: ""
        })
      } else {
        setError(data.error || 'Failed to create admin user')
      }
    } catch (error) {
      console.error('Error creating admin:', error)
      setError('Failed to create admin user')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteAdmin = async (adminId) => {
    if (!confirm('Are you sure you want to delete this admin user?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/admins/${adminId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setAdmins(admins.filter(admin => admin.id !== adminId))
        setSuccess('Admin user deleted successfully')
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to delete admin user')
      }
    } catch (error) {
      console.error('Error deleting admin:', error)
      setError('Failed to delete admin user')
    }
  }

  const getStatusBadge = (status) => {
    return status === "Active" ? (
      <Badge variant="secondary" className="bg-green-100 text-green-800">
        <CheckCircle className="h-3 w-3 mr-1" />
        Active
      </Badge>
    ) : (
      <Badge variant="outline" className="text-red-600">
        <AlertCircle className="h-3 w-3 mr-1" />
        Inactive
      </Badge>
    )
  }

  const getRoleBadge = (roleName) => {
    const colors = {
      'Super Admin': 'bg-red-100 text-red-800',
      'HR Manager': 'bg-blue-100 text-blue-800',
      'Manager': 'bg-green-100 text-green-800',
      'Employee': 'bg-gray-100 text-gray-800'
    }
    
    return (
      <Badge variant="secondary" className={colors[roleName] || 'bg-purple-100 text-purple-800'}>
        {roleName}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading admin data...</p>
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
        <div className="flex items-center space-x-3">
          <h2 className="text-3xl font-bold tracking-tight">Admin Management</h2>
          <Badge variant="secondary">
            {userRole}
          </Badge>
        </div>
        
        <PermissionWrapper action="create" resource="admin" module="admin">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Admin
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Administrator</DialogTitle>
                <DialogDescription>
                  Create a new admin user with specific permissions.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">First Name *</Label>
                  <Input
                    value={newAdmin.firstName}
                    onChange={(e) => setNewAdmin({...newAdmin, firstName: e.target.value})}
                    className="col-span-3"
                    placeholder="First name"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Last Name *</Label>
                  <Input
                    value={newAdmin.lastName}
                    onChange={(e) => setNewAdmin({...newAdmin, lastName: e.target.value})}
                    className="col-span-3"
                    placeholder="Last name"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Email *</Label>
                  <Input
                    type="email"
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                    className="col-span-3"
                    placeholder="Email address"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Role *</Label>
                  <Select value={newAdmin.roleId} onValueChange={(value) => setNewAdmin({...newAdmin, roleId: value})}>
                    <SelectTrigger className="col-span-3">
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
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Department</Label>
                  <Input
                    value={newAdmin.department}
                    onChange={(e) => setNewAdmin({...newAdmin, department: e.target.value})}
                    className="col-span-3"
                    placeholder="Department"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Password *</Label>
                  <Input
                    type="password"
                    value={newAdmin.password}
                    onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                    className="col-span-3"
                    placeholder="Password"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  onClick={handleAddAdmin} 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Admin'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </PermissionWrapper>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Admins</CardTitle>
            <Shield className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{admins.length}</div>
            <p className="text-xs text-muted-foreground">Active administrators</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online Now</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{admins.filter(a => a.status === 'Active').length}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Roles</CardTitle>
            <Shield className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roles.length}</div>
            <p className="text-xs text-muted-foreground">Available roles</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Super Admins</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {admins.filter(a => a.role.name === 'Super Admin').length}
            </div>
            <p className="text-xs text-muted-foreground">System administrators</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="administrators" className="space-y-6">
        <TabsList>
          <TabsTrigger value="administrators">Administrators</TabsTrigger>
        </TabsList>

        <TabsContent value="administrators">
          <Card>
            <CardHeader>
              <CardTitle>Administrator Users</CardTitle>
              <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search administrators..."
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Administrator</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAdmins.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>
                            {admin.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{admin.name}</div>
                          <div className="text-sm text-muted-foreground">{admin.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getRoleBadge(admin.role.name)}
                      </TableCell>
                      <TableCell>{admin.department}</TableCell>
                      <TableCell className="font-mono text-sm">{admin.employeeId}</TableCell>
                      <TableCell>{getStatusBadge(admin.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <PermissionWrapper action="view" resource="admin" module="admin">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </PermissionWrapper>
                          <PermissionWrapper action="update" resource="admin" module="admin">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </PermissionWrapper>
                          <PermissionWrapper action="delete" resource="admin" module="admin">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-600 hover:text-red-900"
                              onClick={() => handleDeleteAdmin(admin.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </PermissionWrapper>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredAdmins.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No administrators found matching your search.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 