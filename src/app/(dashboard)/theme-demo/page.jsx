"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RoleButton } from "@/components/ui/role-button"
import { RoleBadge } from "@/components/ui/role-badge"
import { useRole } from "@/components/role-provider"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { roleThemes } from "@/lib/role-themes"
import { Palette, Crown, Users, Shield, Star, User } from "lucide-react"

export default function ThemeDemoPage() {
  const { currentUser, currentTheme, switchRole } = useRole()

  const roleIcons = {
    "Super Administrator": Crown,
    "HR Administrator": Users,
    "Team Administrator": Star,
    "Project Administrator": Shield,
    "Employee": User
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h2 className="text-3xl font-bold tracking-tight">Theme & Color Demo</h2>
          <Badge className={currentTheme.badge}>
            Current: {currentUser.role}
          </Badge>
        </div>
        <Palette className={`h-8 w-8 ${currentTheme.icon}`} />
      </div>

      {/* Current Role Showcase */}
      <Card className={`border-l-4 ${currentTheme.border.replace('border-', 'border-l-')}`}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>Current Role Theme</span>
            <Badge className={currentTheme.badge}>{currentUser.role}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <h4 className="font-semibold">Buttons</h4>
              <div className="space-y-2">
                <RoleButton role={currentUser.role} size="sm">
                  Primary Button
                </RoleButton>
                <RoleButton role={currentUser.role} variant="secondary" size="sm">
                  Secondary Button
                </RoleButton>
                <RoleButton role={currentUser.role} variant="outline" size="sm">
                  Outline Button
                </RoleButton>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">Colors</h4>
              <div className="flex items-center space-x-2">
                <div className={`w-4 h-4 rounded-full ${currentTheme.primary.split(' ')[0]}`}></div>
                <span className="text-sm">Primary</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-4 h-4 rounded ${currentTheme.secondary.split(' ')[0]}`}></div>
                <span className="text-sm">Secondary</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-4 h-4 rounded border-2 ${currentTheme.border}`}></div>
                <span className="text-sm">Border</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Icons & Text</h4>
              <div className="flex items-center space-x-2">
                <Shield className={`h-4 w-4 ${currentTheme.icon}`} />
                <span className={`text-sm ${currentTheme.accent}`}>Accent Text</span>
              </div>
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className={currentTheme.secondary}>
                    {currentUser.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">Avatar Background</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* All Roles Theme Gallery */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">All Role Themes</h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(roleThemes).map(([role, theme]) => {
            const IconComponent = roleIcons[role] || User
            const isCurrentRole = role === currentUser.role
            
            return (
              <Card 
                key={role} 
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  isCurrentRole ? `border-l-4 ${theme.border.replace('border-', 'border-l-')} shadow-md` : ''
                }`}
                onClick={() => switchRole(role)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-lg">
                    <span>{role}</span>
                    <IconComponent className={`h-5 w-5 ${theme.icon}`} />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Color Swatches */}
                  <div className="flex space-x-2">
                    <div className={`w-6 h-6 rounded-full ${theme.primary.split(' ')[0]} border-2 border-white shadow-sm`}></div>
                    <div className={`w-6 h-6 rounded ${theme.secondary.split(' ')[0]} border shadow-sm`}></div>
                    <div className={`w-6 h-6 rounded border-2 ${theme.border} bg-white`}></div>
                  </div>

                  {/* Sample Components */}
                  <div className="space-y-2">
                    <RoleButton role={role} size="sm" className="w-full">
                      {theme.name} Action
                    </RoleButton>
                    
                    <div className="flex items-center justify-between">
                      <RoleBadge role={role} className="text-xs" />
                      <span className={`text-sm ${theme.accent}`}>Sample Text</span>
                    </div>
                  </div>

                  {/* Usage Stats */}
                  <div className="text-xs text-muted-foreground pt-2 border-t">
                    <div className="flex justify-between">
                      <span>Preview Theme</span>
                      <span>{isCurrentRole ? 'Active' : 'Click to Try'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Interactive Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Interactive Role Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <h4 className="font-semibold">Admin Actions</h4>
              <div className="space-y-2">
                <RoleButton role="Super Administrator" size="sm" className="w-full">
                  System Configuration
                </RoleButton>
                <RoleButton role="HR Administrator" size="sm" className="w-full">
                  Manage Employees
                </RoleButton>
                <RoleButton role="Team Administrator" size="sm" className="w-full">
                  Team Management
                </RoleButton>
                <RoleButton role="Project Administrator" size="sm" className="w-full">
                  Project Planning
                </RoleButton>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Role Badges</h4>
              <div className="flex flex-wrap gap-2">
                {Object.keys(roleThemes).map((role) => (
                  <RoleBadge key={role} role={role} />
                ))}
              </div>
              
              <h4 className="font-semibold mt-4">User Avatars</h4>
              <div className="flex space-x-2">
                {Object.entries(roleThemes).map(([role, theme]) => (
                  <Avatar key={role} className="h-10 w-10">
                    <AvatarFallback className={theme.secondary}>
                      {role.split(' ').map(word => word[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Implementation Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Implementation Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• <strong>Role-based theming:</strong> Colors automatically change based on user role</p>
          <p>• <strong>Component integration:</strong> RoleButton and RoleBadge components use role context</p>
          <p>• <strong>Dynamic switching:</strong> Click any role card above to preview that theme</p>
          <p>• <strong>Consistent styling:</strong> All UI elements follow the same color scheme</p>
          <p>• <strong>Accessibility:</strong> High contrast ratios maintained across all themes</p>
        </CardContent>
      </Card>
    </div>
  )
} 