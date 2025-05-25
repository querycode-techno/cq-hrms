"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Edit, Trash2, Shield, Users, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { usePermissions } from '@/hooks/usePermissions'
import PermissionWrapper from '@/components/auth/PermissionWrapper'

export default function RolesPage() {
  const [roles, setRoles] = useState([])
  const [permissions, setPermissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedRole, setSelectedRole] = useState(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    permissionIds: []
  })

  const { user, userRole, can } = usePermissions()

  // Fetch roles and permissions on component mount
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [rolesResponse, permissionsResponse] = await Promise.all([
        fetch('/api/roles'),
        fetch('/api/permissions')
      ])

      if (rolesResponse.ok) {
        const rolesData = await rolesResponse.json()
        setRoles(rolesData.data || [])
      }

      if (permissionsResponse.ok) {
        const permissionsData = await permissionsResponse.json()
        setPermissions(permissionsData.data || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleAddRole = async () => {
    if (!newRole.name || newRole.permissionIds.length === 0) {
      setError('Please provide role name and select at least one permission')
      return
    }

    try {
      setIsSubmitting(true)
      setError("")
      
      const response = await fetch('/api/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRole),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Role created successfully')
        setRoles([data.data, ...roles])
        setIsAddDialogOpen(false)
        setNewRole({ name: "", description: "", permissionIds: [] })
      } else {
        setError(data.error || 'Failed to create role')
      }
    } catch (error) {
      console.error('Error creating role:', error)
      setError('Failed to create role')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePermissionChange = (permissionId, checked) => {
    if (checked) {
      setNewRole({
        ...newRole,
        permissionIds: [...newRole.permissionIds, permissionId]
      })
    } else {
      setNewRole({
        ...newRole,
        permissionIds: newRole.permissionIds.filter(id => id !== permissionId)
      })
    }
  }

  const openPermissionDialog = (role) => {
    setSelectedRole(role)
    setIsPermissionDialogOpen(true)
  }

  const getRoleColor = (roleName) => {
    const colors = {
      'Super Admin': 'bg-red-100 text-red-800',
      'HR Manager': 'bg-blue-100 text-blue-800',
      'Manager': 'bg-green-100 text-green-800',
      'Employee': 'bg-gray-100 text-gray-800'
    }
    return colors[roleName] || 'bg-purple-100 text-purple-800'
  }

  const hasPermission = (role, permissionKey) => {
    return role.permissions.some(p => `${p.resource}.${p.action}` === permissionKey)
  }

  // Create a flat list of all permissions for the matrix
  const allPermissionKeys = permissions.flatMap(module => 
    module.permissions.map(p => p.key)
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading roles and permissions...</p>
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
        <h2 className="text-3xl font-bold tracking-tight">Roles & Permissions</h2>
        
        <PermissionWrapper action="create" resource="roles" module="roles">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Role
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Role</DialogTitle>
                <DialogDescription>
                  Define a new role with specific permissions.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Role Name *
                  </Label>
                  <Input
                    id="name"
                    value={newRole.name}
                    onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                    className="col-span-3"
                    placeholder="Enter role name"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={newRole.description}
                    onChange={(e) => setNewRole({...newRole, description: e.target.value})}
                    className="col-span-3"
                    placeholder="Describe the role"
                  />
                </div>
                
                <div className="mt-4">
                  <Label className="text-sm font-medium mb-4 block">Permissions *</Label>
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {permissions.map((module) => (
                      <div key={module.module} className="space-y-2">
                        <h4 className="font-medium text-sm">{module.module}</h4>
                        <div className="pl-4 space-y-2">
                          {module.permissions.map((permission) => (
                            <div key={permission.id} className="flex items-center space-x-2">
                              <Checkbox 
                                id={permission.id}
                                checked={newRole.permissionIds.includes(permission.id)}
                                onCheckedChange={(checked) => handlePermissionChange(permission.id, checked)}
                              />
                              <Label htmlFor={permission.id} className="text-sm">
                                {permission.name}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  type="submit" 
                  onClick={handleAddRole}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Role'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </PermissionWrapper>
      </div>

      {/* Roles Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {roles.map((role) => (
          <Card key={role.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{role.name}</CardTitle>
                <Badge variant="secondary" className={getRoleColor(role.name)}>
                  {role.userCount} users
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                {role.description || 'No description provided'}
              </p>
              <div className="flex items-center justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => openPermissionDialog(role)}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Permissions ({role.permissions.length})
                </Button>
                <div className="flex space-x-1">
                  <PermissionWrapper action="update" resource="roles" module="roles">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </PermissionWrapper>
                  <PermissionWrapper action="delete" resource="roles" module="roles">
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </PermissionWrapper>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Permission Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Permission Matrix</CardTitle>
          <p className="text-sm text-muted-foreground">
            Overview of permissions across all roles
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-48">Permission</TableHead>
                  {roles.map((role) => (
                    <TableHead key={role.id} className="text-center min-w-32">
                      {role.name}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissions.map((module) => (
                  <React.Fragment key={module.module}>
                    <TableRow className="bg-muted/50">
                      <TableCell className="font-semibold" colSpan={roles.length + 1}>
                        {module.module}
                      </TableCell>
                    </TableRow>
                    {module.permissions.map((permission) => (
                      <TableRow key={`${module.module}-${permission.key}`}>
                        <TableCell className="pl-6">{permission.name}</TableCell>
                        {roles.map((role) => (
                          <TableCell key={`${role.id}-${permission.key}`} className="text-center">
                            {hasPermission(role, permission.key) ? (
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                ✓
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-gray-400">
                                ✗
                              </Badge>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Permission Detail Dialog */}
      <Dialog open={isPermissionDialogOpen} onOpenChange={setIsPermissionDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedRole?.name} Permissions</DialogTitle>
            <DialogDescription>
              Detailed view of permissions for this role.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedRole && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Role Information</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedRole.description || 'No description provided'}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    <Users className="inline h-4 w-4 mr-1" />
                    {selectedRole.userCount} users assigned
                  </p>
                  {selectedRole.isSystemRole && (
                    <Badge variant="outline" className="mt-2">
                      System Role
                    </Badge>
                  )}
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Permissions ({selectedRole.permissions.length})</h4>
                  <div className="space-y-2">
                    {permissions.map((module) => {
                      const modulePermissions = selectedRole.permissions.filter(p => p.module === module.module)
                      if (modulePermissions.length === 0) return null
                      
                      return (
                        <div key={module.module}>
                          <h5 className="text-sm font-medium text-muted-foreground">{module.module}</h5>
                          <div className="pl-4 space-y-1">
                            {modulePermissions.map((permission) => (
                              <div key={permission.id} className="flex items-center space-x-2">
                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                  ✓
                                </Badge>
                                <span className="text-sm">
                                  {permission.action.charAt(0).toUpperCase() + permission.action.slice(1)} {permission.resource}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 