import { Button } from "@/components/ui/button"
import { getRoleButtonClass } from "@/lib/role-themes"
import { cn } from "@/lib/utils"

export function RoleButton({ 
  role, 
  variant = "primary", 
  className, 
  children, 
  ...props 
}) {
  const roleButtonClass = getRoleButtonClass(role, variant)
  
  return (
    <Button
      className={cn(
        roleButtonClass,
        "transition-all duration-200",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
} 