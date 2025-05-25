"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { usePermissions } from '@/hooks/usePermissions'
import { filterNavigationByPermissions } from '@/lib/permissions'
import {
  LayoutDashboard,
  Users,
  Clock,
  Shield,
  UserCog,
  Briefcase,
  Calendar,
  DollarSign,
  Bell,
  Settings,
  Palette,
} from "lucide-react"

const allRoutes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
    alwaysShow: true
  },
  {
    label: "Employees",
    icon: Users,
    href: "/employees",
    color: "text-violet-500",
  },
  {
    label: "Attendance",
    icon: Clock,
    href: "/attendance",
    color: "text-pink-700",
  },
  {
    label: "Projects",
    icon: Briefcase,
    href: "/projects",
    color: "text-blue-700",
  },
  {
    label: "Leave Requests",
    icon: Calendar,
    href: "/leaves",
    color: "text-rose-700",
  },
  {
    label: "Salary",
    icon: DollarSign,
    href: "/salary",
    color: "text-green-700",
  },
  {
    label: "Roles",
    icon: Shield,
    href: "/roles",
    color: "text-orange-700",
  },
  {
    label: "Admin Panel",
    icon: UserCog,
    href: "/admin",
    color: "text-emerald-500",
  },
  {
    label: "Notifications",
    icon: Bell,
    href: "/notifications",
    color: "text-yellow-700",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
    color: "text-gray-700",
    alwaysShow: true
  },
  {
    label: "Theme Demo",
    icon: Palette,
    href: "/theme-demo",
    color: "text-purple-700",
    alwaysShow: true
  },
]

export function MainNav() {
  const pathname = usePathname()
  const { permissions, isAuthenticated, userRole } = usePermissions()

  if (!isAuthenticated) {
    return null
  }

  // Filter routes based on permissions and role
  const accessibleRoutes = allRoutes.filter(route => {
    // Always show certain routes for all authenticated users
    if (route.alwaysShow) {
      return true
    }
    
    // Super Admin has access to all routes
    if (userRole === 'Super Admin') {
      return true
    }
    
    // For other roles, use permission-based filtering
    return filterNavigationByPermissions([route], permissions).length > 0
  })

  return (
    <nav className="flex flex-col gap-2 p-4">
      {accessibleRoutes.map((route) => {
        const Icon = route.icon
        return (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-x-2 text-sm font-medium px-3 py-2 rounded-lg hover:bg-accent transition-all",
              pathname === route.href
                ? "text-primary bg-accent"
                : "text-muted-foreground"
            )}
          >
            <Icon className={cn("h-5 w-5", route.color)} />
            {route.label}
          </Link>
        )
      })}
    </nav>
  )
} 