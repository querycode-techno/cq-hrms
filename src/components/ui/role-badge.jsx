import { Badge } from "@/components/ui/badge"
import { getRoleBadgeClass } from "@/lib/role-themes"
import { cn } from "@/lib/utils"

export function RoleBadge({ 
  role, 
  className, 
  children, 
  showRole = true,
  ...props 
}) {
  const roleBadgeClass = getRoleBadgeClass(role)
  
  return (
    <Badge
      variant="secondary"
      className={cn(
        roleBadgeClass,
        "border transition-all duration-200",
        className
      )}
      {...props}
    >
      {showRole ? role : children}
    </Badge>
  )
} 