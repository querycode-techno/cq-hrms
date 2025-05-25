// Role-based theme configuration
export const roleThemes = {
  "Super Administrator": {
    primary: "bg-red-600 hover:bg-red-700",
    secondary: "bg-red-100 text-red-800",
    accent: "text-red-600",
    border: "border-red-200",
    gradient: "from-red-500 to-red-600",
    badge: "bg-red-100 text-red-800 border-red-200",
    button: {
      primary: "bg-red-600 hover:bg-red-700 text-white",
      secondary: "bg-red-100 hover:bg-red-200 text-red-800",
      outline: "border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
    },
    icon: "text-red-600",
    name: "Administrator"
  },
  "HR Administrator": {
    primary: "bg-blue-600 hover:bg-blue-700",
    secondary: "bg-blue-100 text-blue-800",
    accent: "text-blue-600",
    border: "border-blue-200",
    gradient: "from-blue-500 to-blue-600",
    badge: "bg-blue-100 text-blue-800 border-blue-200",
    button: {
      primary: "bg-blue-600 hover:bg-blue-700 text-white",
      secondary: "bg-blue-100 hover:bg-blue-200 text-blue-800",
      outline: "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
    },
    icon: "text-blue-600",
    name: "HR Manager"
  },
  "Team Administrator": {
    primary: "bg-green-600 hover:bg-green-700",
    secondary: "bg-green-100 text-green-800",
    accent: "text-green-600",
    border: "border-green-200",
    gradient: "from-green-500 to-green-600",
    badge: "bg-green-100 text-green-800 border-green-200",
    button: {
      primary: "bg-green-600 hover:bg-green-700 text-white",
      secondary: "bg-green-100 hover:bg-green-200 text-green-800",
      outline: "border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
    },
    icon: "text-green-600",
    name: "Team Lead"
  },
  "Project Administrator": {
    primary: "bg-purple-600 hover:bg-purple-700",
    secondary: "bg-purple-100 text-purple-800",
    accent: "text-purple-600",
    border: "border-purple-200",
    gradient: "from-purple-500 to-purple-600",
    badge: "bg-purple-100 text-purple-800 border-purple-200",
    button: {
      primary: "bg-purple-600 hover:bg-purple-700 text-white",
      secondary: "bg-purple-100 hover:bg-purple-200 text-purple-800",
      outline: "border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white"
    },
    icon: "text-purple-600",
    name: "Project Manager"
  },
  "Employee": {
    primary: "bg-gray-600 hover:bg-gray-700",
    secondary: "bg-gray-100 text-gray-800",
    accent: "text-gray-600",
    border: "border-gray-200",
    gradient: "from-gray-500 to-gray-600",
    badge: "bg-gray-100 text-gray-800 border-gray-200",
    button: {
      primary: "bg-gray-600 hover:bg-gray-700 text-white",
      secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800",
      outline: "border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white"
    },
    icon: "text-gray-600",
    name: "Employee"
  }
}

// Default theme fallback
export const defaultTheme = {
  primary: "bg-slate-600 hover:bg-slate-700",
  secondary: "bg-slate-100 text-slate-800",
  accent: "text-slate-600",
  border: "border-slate-200",
  gradient: "from-slate-500 to-slate-600",
  badge: "bg-slate-100 text-slate-800 border-slate-200",
  button: {
    primary: "bg-slate-600 hover:bg-slate-700 text-white",
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-800",
    outline: "border-slate-600 text-slate-600 hover:bg-slate-600 hover:text-white"
  },
  icon: "text-slate-600",
  name: "Default"
}

// Utility function to get role theme
export const getRoleTheme = (role) => {
  return roleThemes[role] || defaultTheme
}

// Utility function to get role-based button classes
export const getRoleButtonClass = (role, variant = "primary") => {
  const theme = getRoleTheme(role)
  return theme.button[variant] || theme.button.primary
}

// Utility function to get role-based badge classes
export const getRoleBadgeClass = (role) => {
  const theme = getRoleTheme(role)
  return theme.badge
}

// Utility function to get role-based icon classes
export const getRoleIconClass = (role) => {
  const theme = getRoleTheme(role)
  return theme.icon
}

// Utility function to get role color for status indicators
export const getRoleAccentClass = (role) => {
  const theme = getRoleTheme(role)
  return theme.accent
} 