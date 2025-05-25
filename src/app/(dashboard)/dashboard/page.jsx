"use client"

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, Briefcase, Calendar, DollarSign, Bell, TrendingUp, Clock, UserCheck, AlertTriangle, CheckCircle } from "lucide-react"
import { usePermissions } from '@/hooks/usePermissions';
import PermissionWrapper from '@/components/auth/PermissionWrapper';

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('error');

  // Use the permission hook for easier permission checking
  const { user, userRole, can, isAuthenticated } = usePermissions();

  useEffect(() => {
    const error = searchParams.get('error');
    const attempted = searchParams.get('attempted');

    if (error === 'AccessDenied') {
      setAlertMessage(`Access denied to ${attempted}. You don't have permission to access that page.`);
      setAlertType('error');
      setShowAlert(true);
    }
  }, [searchParams]);

  // Define summary cards with permission checks
  const summaryCards = [
    {
      title: "Total Employees",
      value: "120",
      icon: Users,
      color: "text-blue-600",
      trend: "+12% from last month",
      action: "view",
      resource: "employees",
      module: "users"
    },
    {
      title: "Active Projects",
      value: "15",
      icon: Briefcase,
      color: "text-green-600",
      trend: "+3 new this week",
      action: "view",
      resource: "projects",
      module: "projects"
    },
    {
      title: "Pending Leaves",
      value: "8",
      icon: Calendar,
      color: "text-orange-600",
      trend: "2 urgent requests",
      action: "view",
      resource: "requests",
      module: "leaves"
    },
    {
      title: "Total Payroll",
      value: "$45,250",
      icon: DollarSign,
      color: "text-purple-600",
      trend: "Processed this month",
      action: "view",
      resource: "payroll",
      module: "salary"
    },
    {
      title: "Attendance Rate",
      value: "95%",
      icon: UserCheck,
      color: "text-emerald-600",
      trend: "This month average",
      action: "view",
      resource: "records",
      module: "attendance"
    }
  ];

  // Filter cards based on permissions
  const visibleCards = summaryCards.filter(card => 
    can(card.action, card.resource, card.module)
  );

  const recentActivities = [
    { 
      id: 1, 
      message: "John Doe checked in", 
      time: "2 minutes ago",
      requiredAction: "view",
      requiredResource: "records",
      requiredModule: "attendance"
    },
    { 
      id: 2, 
      message: "New leave request from Sarah", 
      time: "5 minutes ago",
      requiredAction: "view",
      requiredResource: "requests",
      requiredModule: "leaves"
    },
    { 
      id: 3, 
      message: "Project Alpha completed", 
      time: "1 hour ago",
      requiredAction: "view",
      requiredResource: "projects",
      requiredModule: "projects"
    },
    { 
      id: 4, 
      message: "New employee onboarded", 
      time: "2 hours ago",
      requiredAction: "view",
      requiredResource: "employees",
      requiredModule: "users"
    }
  ];

  // Filter activities based on permissions
  const visibleActivities = recentActivities.filter(activity =>
    can(activity.requiredAction, activity.requiredResource, activity.requiredModule)
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showAlert && (
        <Alert variant={alertType === 'error' ? 'destructive' : 'default'}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{alertMessage}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back, {user?.name} ({userRole})
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
              3
            </Badge>
          </Button>
        </div>
      </div>

      {visibleCards.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {visibleCards.map((card) => {
            const Icon = card.icon
            return (
              <Card key={card.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {card.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {card.trend}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Welcome to CQAMS</h3>
              <p className="text-muted-foreground">
                Your dashboard will show relevant information based on your permissions.
                Contact your administrator if you need access to additional features.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Attendance Trends - Show if user can view attendance */}
        <PermissionWrapper action="view" resource="records" module="attendance">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Daily Attendance Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Attendance chart will be displayed here</p>
                  <p className="text-sm text-muted-foreground">95% average attendance this week</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </PermissionWrapper>

        {/* Recent Activities */}
        {visibleActivities.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {visibleActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Project Progress - Show if user can view projects */}
        <PermissionWrapper action="view" resource="projects" module="projects">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Project Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Project Alpha</span>
                    <span className="text-sm text-muted-foreground">85%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Project Beta</span>
                    <span className="text-sm text-muted-foreground">60%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Project Gamma</span>
                    <span className="text-sm text-muted-foreground">30%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-orange-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </PermissionWrapper>

        {/* Leave Overview - Show if user can view leaves */}
        <PermissionWrapper action="view" resource="requests" module="leaves">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Leave Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Approved</span>
                  <Badge variant="secondary">15</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Pending</span>
                  <Badge variant="outline">8</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Rejected</span>
                  <Badge variant="destructive">2</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </PermissionWrapper>
      </div>
    </div>
  )
} 