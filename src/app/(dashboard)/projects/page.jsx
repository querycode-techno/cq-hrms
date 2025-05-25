"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Users, Calendar, BarChart3, Eye } from "lucide-react"

const projects = [
  {
    id: 1,
    name: "Website Redesign",
    description: "Complete overhaul of company website",
    status: "In Progress",
    progress: 75,
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    assignedMembers: ["John Doe", "Sarah Wilson", "Mike Johnson"],
    tasks: 24,
    completedTasks: 18
  },
  {
    id: 2,
    name: "Mobile App Development",
    description: "Native mobile app for iOS and Android",
    status: "Planning",
    progress: 20,
    startDate: "2024-02-15",
    endDate: "2024-08-15",
    assignedMembers: ["Alex Chen", "Emily Davis"],
    tasks: 45,
    completedTasks: 9
  },
  {
    id: 3,
    name: "Database Migration",
    description: "Migrate legacy database to cloud",
    status: "Completed",
    progress: 100,
    startDate: "2023-11-01",
    endDate: "2024-01-15",
    assignedMembers: ["John Doe", "Alex Chen"],
    tasks: 12,
    completedTasks: 12
  },
  {
    id: 4,
    name: "Security Audit",
    description: "Comprehensive security assessment",
    status: "On Hold",
    progress: 30,
    startDate: "2024-01-20",
    endDate: "2024-04-20",
    assignedMembers: ["Mike Johnson"],
    tasks: 15,
    completedTasks: 4
  }
]

export default function ProjectsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    assignedMembers: []
  })

  const getStatusBadge = (status) => {
    const variants = {
      "Planning": "bg-blue-100 text-blue-800",
      "In Progress": "bg-yellow-100 text-yellow-800",
      "Completed": "bg-green-100 text-green-800",
      "On Hold": "bg-gray-100 text-gray-800",
    }
    return <Badge variant="secondary" className={variants[status]}>{status}</Badge>
  }

  const getProgressColor = (progress) => {
    if (progress >= 80) return "bg-green-600"
    if (progress >= 50) return "bg-yellow-600"
    return "bg-red-600"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Projects & Assignments</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>Set up a new project with details and assignments.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Project Name</Label>
                <Input value={newProject.name} onChange={(e) => setNewProject({...newProject, name: e.target.value})} className="col-span-3" placeholder="Enter project name" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Description</Label>
                <Textarea value={newProject.description} onChange={(e) => setNewProject({...newProject, description: e.target.value})} className="col-span-3" placeholder="Project description" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Start Date</Label>
                <Input type="date" value={newProject.startDate} onChange={(e) => setNewProject({...newProject, startDate: e.target.value})} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">End Date</Label>
                <Input type="date" value={newProject.endDate} onChange={(e) => setNewProject({...newProject, endDate: e.target.value})} className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsCreateDialogOpen(false)}>Create Project</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-muted-foreground">Active projects</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.filter(p => p.status === "In Progress").length}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.filter(p => p.status === "Completed").length}</div>
            <p className="text-xs text-muted-foreground">Successfully finished</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.reduce((acc, p) => acc + p.tasks, 0)}</div>
            <p className="text-xs text-muted-foreground">Across all projects</p>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{project.name}</CardTitle>
                {getStatusBadge(project.status)}
              </div>
              <p className="text-sm text-muted-foreground">{project.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress Bar */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-muted-foreground">{project.progress}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getProgressColor(project.progress)}`} 
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Tasks */}
              <div className="flex items-center justify-between text-sm">
                <span>Tasks</span>
                <span className="font-medium">{project.completedTasks}/{project.tasks}</span>
              </div>

              {/* Timeline */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {project.startDate}
                </div>
                <div>
                  to {project.endDate}
                </div>
              </div>

              {/* Assigned Members */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Team</span>
                  <span className="text-sm text-muted-foreground flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {project.assignedMembers.length}
                  </span>
                </div>
                <div className="flex -space-x-2">
                  {project.assignedMembers.slice(0, 3).map((member, index) => (
                    <Avatar key={index} className="h-8 w-8 border-2 border-background">
                      <AvatarFallback className="text-xs">
                        {member.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {project.assignedMembers.length > 3 && (
                    <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">+{project.assignedMembers.length - 3}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 