"use client"

import { createContext, useContext, useState } from "react"
import { getRoleTheme } from "@/lib/role-themes"

const RoleContext = createContext()

export function RoleProvider({ children }) {
  // This would typically come from authentication/user session
  const [currentUser, setCurrentUser] = useState({
    id: 1,
    name: "John Admin",
    email: "admin@company.com",
    role: "Super Administrator",
    department: "IT"
  })

  const currentTheme = getRoleTheme(currentUser.role)

  const switchRole = (newRole) => {
    setCurrentUser(prev => ({
      ...prev,
      role: newRole
    }))
  }

  const value = {
    currentUser,
    currentTheme,
    switchRole,
    userRole: currentUser.role
  }

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  const context = useContext(RoleContext)
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider")
  }
  return context
} 