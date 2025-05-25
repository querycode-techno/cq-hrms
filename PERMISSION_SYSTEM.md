# CQAMS Permission System Documentation

## Overview

CQAMS uses a **hybrid permission system** that combines both middleware-level route protection and component-level permission checking for optimal security and user experience.

## Architecture

### 1. Middleware-Level Protection (Route Security)
- **Purpose**: Prevents unauthorized access to entire pages/routes
- **Location**: `middleware.js`
- **Benefits**: 
  - Blocks requests before they reach components
  - Better performance (no unnecessary page loads)
  - Centralized route security
  - Prevents URL manipulation attacks

### 2. Component-Level Protection (UI Security)
- **Purpose**: Controls what users see and can interact with within pages
- **Location**: Individual components using hooks and wrappers
- **Benefits**:
  - Granular control over UI elements
  - Better user experience (show relevant content only)
  - Dynamic content based on permissions
  - Flexible permission logic per component

## Permission Structure

### Permission Object Format
```javascript
{
  module: 'users',        // Module name (users, projects, attendance, etc.)
  action: 'view',         // Action (view, create, update, delete, all)
  resource: 'employees'   // Resource (employees, projects, records, etc.)
}
```

### Route to Permission Mapping
```javascript
const ROUTE_PERMISSIONS = {
  '/employees': { module: 'users', action: 'view', resource: 'employees' },
  '/employees/add': { module: 'users', action: 'create', resource: 'employees' },
  '/projects': { module: 'projects', action: 'view', resource: 'projects' },
  // ... more routes
};
```

## Implementation Guide

### 1. Middleware Setup

The middleware automatically protects routes based on the `ROUTE_PERMISSIONS` mapping:

```javascript
// middleware.js
export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;
    
    const userPermissions = token.role?.permissions || [];
    
    // Dynamic permission checking
    if (!canAccessRoute(userPermissions, pathname)) {
      // Redirect to default allowed route
      const defaultRoute = getDefaultRoute(userPermissions, userRole);
      return NextResponse.redirect(new URL(defaultRoute, req.url));
    }
    
    return NextResponse.next();
  }
);
```

### 2. Component-Level Permission Checking

#### Using the Permission Hook
```javascript
import { usePermissions } from '@/hooks/usePermissions';

function EmployeePage() {
  // Hook with default resource
  const { canView, canCreate, canUpdate, canDelete, can } = usePermissions('employees', 'users');
  
  return (
    <div>
      {canView && <EmployeeList />}
      {canCreate && <AddEmployeeButton />}
      {canUpdate && <EditEmployeeButton />}
      {canDelete && <DeleteEmployeeButton />}
      
      {/* Custom permission check */}
      {can('approve', 'leaves', 'leaves') && <ApproveLeaveButton />}
    </div>
  );
}
```

#### Using Permission Wrapper Component
```javascript
import PermissionWrapper from '@/components/auth/PermissionWrapper';

function EmployeePage() {
  return (
    <div>
      {/* Wrap components that need permission checks */}
      <PermissionWrapper action="create" resource="employees" module="users">
        <AddEmployeeButton />
      </PermissionWrapper>
      
      <PermissionWrapper action="update" resource="employees" module="users">
        <EditEmployeeButton />
      </PermissionWrapper>
      
      {/* With fallback content */}
      <PermissionWrapper 
        action="delete" 
        resource="employees" 
        module="users"
        fallback={<p>You don't have permission to delete employees</p>}
        showFallback={true}
      >
        <DeleteEmployeeButton />
      </PermissionWrapper>
    </div>
  );
}
```

#### Custom Permission Checks
```javascript
import { usePermissions } from '@/hooks/usePermissions';

function EmployeePage() {
  const { user } = usePermissions();
  
  return (
    <div>
      {/* Custom logic for complex permission scenarios */}
      <PermissionWrapper
        action="view"
        resource="employees"
        module="users"
        customCheck={(permissions, user) => {
          // Custom logic: managers can only see their department
          if (user.role?.name === 'Manager') {
            return permissions.some(p => 
              p.module === 'users' && 
              p.action === 'view' && 
              p.resource === 'employees' &&
              p.department === user.department
            );
          }
          return true;
        }}
      >
        <EmployeeList />
      </PermissionWrapper>
    </div>
  );
}
```

## Available Hooks

### 1. `usePermissions(resource, module)`
Main permission hook with convenience methods:

```javascript
const {
  // Permission checking
  can,                    // can(action, resource, module)
  canAccess,             // canAccess(pathname)
  hasPermission,         // hasPermission(module, action, resource)
  
  // Convenience properties (if resource provided)
  canView,               // can('view')
  canCreate,             // can('create')
  canUpdate,             // can('update')
  canDelete,             // can('delete')
  canAll,                // can('all')
  
  // User data
  user,                  // Current user object
  userRole,              // User's role name
  permissions,           // Array of user permissions
  
  // Status
  isAuthenticated,       // Boolean
  isLoading,             // Boolean
  isAdmin,               // Boolean
  
  // Role checking
  hasRole,               // hasRole(roleName)
  hasAnyRole,            // hasAnyRole([roleNames])
  
  // Utilities
  getActions,            // Get all available actions for resource
  checkMultiple          // Check multiple permissions at once
} = usePermissions('employees', 'users');
```

### 2. `useRoutePermissions()`
Specialized hook for route-based permission checking:

```javascript
const {
  canAccess,             // canAccess(pathname)
  canAccessCurrent,      // canAccessCurrent(currentPath)
  isAuthenticated,
  isLoading
} = useRoutePermissions();
```

### 3. `useAdminPermissions()`
Specialized hook for admin-specific checks:

```javascript
const {
  isAdmin,
  isSuperAdmin,
  isHRManager,
  isManager,
  isEmployee,
  hasAnyAdminRole,
  canManageUsers,
  canManageRoles,
  canManageSettings
} = useAdminPermissions();
```

## Permission Components

### 1. `PermissionWrapper`
Main wrapper component for conditional rendering:

```javascript
<PermissionWrapper 
  action="create"           // Required action
  resource="employees"      // Required resource
  module="users"           // Optional module (inferred if not provided)
  fallback={<NoAccess />}  // Optional fallback content
  showFallback={true}      // Whether to show fallback (default: false)
  customCheck={myCheck}    // Optional custom check function
>
  <ProtectedContent />
</PermissionWrapper>
```

### 2. `PermissionButton`
Permission-aware button component:

```javascript
<PermissionButton
  action="delete"
  resource="employees"
  module="users"
  onClick={handleDelete}
  className="btn-danger"
>
  Delete Employee
</PermissionButton>
```

### 3. `PermissionLink`
Permission-aware link component:

```javascript
<PermissionLink
  action="view"
  resource="employees"
  module="users"
  href="/employees/123"
>
  View Employee
</PermissionLink>
```

## Best Practices

### 1. Route Protection Strategy
- **Always use middleware** for route-level protection
- **Never rely solely** on component-level checks for security
- **Use component checks** for UI enhancement and user experience

### 2. Permission Granularity
```javascript
// ✅ Good: Specific permissions
<PermissionWrapper action="update" resource="employees" module="users">
  <EditButton />
</PermissionWrapper>

// ❌ Avoid: Overly broad permissions
<PermissionWrapper action="all" resource="*" module="*">
  <EditButton />
</PermissionWrapper>
```

### 3. Error Handling
```javascript
// ✅ Good: Graceful fallbacks
<PermissionWrapper 
  action="view" 
  resource="salary" 
  module="salary"
  fallback={<p>Contact HR for salary information</p>}
  showFallback={true}
>
  <SalaryDetails />
</PermissionWrapper>

// ❌ Avoid: No feedback to user
<PermissionWrapper action="view" resource="salary" module="salary">
  <SalaryDetails />
</PermissionWrapper>
```

### 4. Performance Optimization
```javascript
// ✅ Good: Use hook with default resource
const { canView, canEdit } = usePermissions('employees', 'users');

// ❌ Avoid: Multiple permission calls
const permissions = usePermissions();
const canView = permissions.can('view', 'employees', 'users');
const canEdit = permissions.can('edit', 'employees', 'users');
```

## Security Considerations

### 1. Defense in Depth
- **Middleware**: First line of defense (route protection)
- **Components**: Second line of defense (UI protection)
- **API**: Third line of defense (data protection)

### 2. Never Trust Client-Side
- Component-level checks are for **UX only**
- Always validate permissions on the **server-side**
- API endpoints must have their own permission checks

### 3. Permission Caching
- Permissions are cached in JWT tokens
- Token refresh updates permissions
- Consider permission changes require re-authentication

## Example: Complete Implementation

```javascript
// pages/employees/page.jsx
"use client";

import { usePermissions } from '@/hooks/usePermissions';
import PermissionWrapper from '@/components/auth/PermissionWrapper';

export default function EmployeesPage() {
  // Hook provides convenient permission checks
  const { canView, canCreate, canUpdate, canDelete, user } = usePermissions('employees', 'users');
  
  return (
    <div>
      <h1>Employees</h1>
      
      {/* Header actions based on permissions */}
      <div className="actions">
        <PermissionWrapper action="create" resource="employees" module="users">
          <AddEmployeeButton />
        </PermissionWrapper>
      </div>
      
      {/* Main content - protected by middleware, but we can enhance UX */}
      {canView ? (
        <EmployeeList 
          showEditActions={canUpdate}
          showDeleteActions={canDelete}
        />
      ) : (
        <NoAccessMessage />
      )}
      
      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <PermissionDebugInfo user={user} permissions={{ canView, canCreate, canUpdate, canDelete }} />
      )}
    </div>
  );
}
```

## Conclusion

The hybrid approach provides:
- **Security**: Middleware prevents unauthorized access
- **Flexibility**: Components can show/hide based on permissions
- **Performance**: Efficient permission checking
- **Maintainability**: Centralized permission logic
- **User Experience**: Relevant content only

This system ensures that users only see what they're allowed to access while maintaining strong security boundaries. 