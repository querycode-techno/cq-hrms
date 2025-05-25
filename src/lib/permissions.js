/**
 * Permission checking utilities for dynamic role-based access control
 */

// Route to permission mapping
export const ROUTE_PERMISSIONS = {
  // Dashboard routes
  '/dashboard': { module: 'dashboard', action: 'view', resource: 'analytics' },
  
  // Employee management
  '/employees': { module: 'users', action: 'view', resource: 'employees' },
  '/employees/add': { module: 'users', action: 'create', resource: 'employees' },
  '/employees/[id]': { module: 'users', action: 'view', resource: 'employees' },
  '/employees/[id]/edit': { module: 'users', action: 'update', resource: 'employees' },
  
  // Attendance management
  '/attendance': { module: 'attendance', action: 'view', resource: 'records' },
  
  // Salary management
  '/salary': { module: 'salary', action: 'view', resource: 'payroll' },
  
  // Project management
  '/projects': { module: 'projects', action: 'view', resource: 'projects' },
  
  // Leave management
  '/leaves': { module: 'leaves', action: 'view', resource: 'requests' },
  
  // Role management
  '/roles': { module: 'roles', action: 'view', resource: 'roles' },
  
  // Settings
  '/settings': { module: 'settings', action: 'view', resource: 'system' },
  
  // Admin routes
  '/admin': { module: 'system', action: 'all', resource: '*' },
  
  // Notifications
  '/notifications': { module: 'dashboard', action: 'view', resource: 'notifications' },
};

/**
 * Check if user has permission for a specific action
 * @param {Array} userPermissions - Array of user's permission objects
 * @param {string} module - Module name (e.g., 'users', 'attendance')
 * @param {string} action - Action name (e.g., 'view', 'create', 'update', 'delete')
 * @param {string} resource - Resource name (e.g., 'employees', 'records')
 * @returns {boolean} - Whether user has permission
 */
export function hasPermission(userPermissions, module, action, resource) {
  if (!userPermissions || !Array.isArray(userPermissions)) {
    return false;
  }

  return userPermissions.some(permission => {
    // Check for exact match
    if (
      permission.module === module &&
      permission.action === action &&
      permission.resource === resource
    ) {
      return true;
    }

    // Check for wildcard permissions
    if (
      permission.module === module &&
      permission.action === 'all' &&
      permission.resource === '*'
    ) {
      return true;
    }

    // Check for module-level permissions
    if (
      permission.module === module &&
      permission.action === action &&
      permission.resource === '*'
    ) {
      return true;
    }

    // Check for system-wide permissions
    if (
      permission.module === 'system' &&
      permission.action === 'all' &&
      permission.resource === '*'
    ) {
      return true;
    }

    return false;
  });
}

/**
 * Check if user can access a specific route
 * @param {Array} userPermissions - Array of user's permission objects
 * @param {string} pathname - Route pathname
 * @returns {boolean} - Whether user can access the route
 */
export function canAccessRoute(userPermissions, pathname) {
  // Remove query parameters and normalize path
  const cleanPath = pathname.split('?')[0];
  
  // Check for exact route match
  const routePermission = ROUTE_PERMISSIONS[cleanPath];
  if (routePermission) {
    return hasPermission(
      userPermissions,
      routePermission.module,
      routePermission.action,
      routePermission.resource
    );
  }

  // Check for dynamic routes (e.g., /employees/[id])
  for (const [route, permission] of Object.entries(ROUTE_PERMISSIONS)) {
    if (route.includes('[id]')) {
      const routePattern = route.replace('[id]', '[^/]+');
      const regex = new RegExp(`^${routePattern}$`);
      if (regex.test(cleanPath)) {
        return hasPermission(
          userPermissions,
          permission.module,
          permission.action,
          permission.resource
        );
      }
    }
  }

  // Default: allow access to dashboard if user has any permissions
  if (cleanPath === '/dashboard' && userPermissions.length > 0) {
    return true;
  }

  return false;
}

/**
 * Get user's accessible routes based on their permissions
 * @param {Array} userPermissions - Array of user's permission objects
 * @returns {Array} - Array of accessible route paths
 */
export function getAccessibleRoutes(userPermissions) {
  const accessibleRoutes = [];

  for (const [route, permission] of Object.entries(ROUTE_PERMISSIONS)) {
    if (hasPermission(
      userPermissions,
      permission.module,
      permission.action,
      permission.resource
    )) {
      accessibleRoutes.push(route);
    }
  }

  return accessibleRoutes;
}

/**
 * Get default redirect route for user based on their highest permission level
 * @param {Array} userPermissions - Array of user's permission objects
 * @param {string} userRole - User's role name
 * @returns {string} - Default route to redirect to
 */
export function getDefaultRoute(userPermissions, userRole) {
  // Super Admin - redirect to admin dashboard
  if (userRole === 'Super Admin' || hasPermission(userPermissions, 'system', 'all', '*')) {
    return '/admin';
  }

  // HR Manager - redirect to employees
  if (userRole === 'HR Manager' || hasPermission(userPermissions, 'users', 'view', 'employees')) {
    return '/employees';
  }

  // Manager - redirect to projects or attendance
  if (userRole === 'Manager') {
    if (hasPermission(userPermissions, 'projects', 'view', 'projects')) {
      return '/projects';
    }
    if (hasPermission(userPermissions, 'attendance', 'view', 'records')) {
      return '/attendance';
    }
  }

  // Employee - redirect to attendance
  if (hasPermission(userPermissions, 'attendance', 'view', 'records')) {
    return '/attendance';
  }

  // Default fallback
  return '/dashboard';
}

/**
 * Check if user has any admin-level permissions
 * @param {Array} userPermissions - Array of user's permission objects
 * @param {string} userRole - User's role name
 * @returns {boolean} - Whether user has admin permissions
 */
export function isAdmin(userPermissions, userRole) {
  return userRole === 'Super Admin' || 
         userRole === 'HR Manager' ||
         hasPermission(userPermissions, 'system', 'all', '*') ||
         hasPermission(userPermissions, 'users', 'create', 'employees');
}

/**
 * Filter navigation items based on user permissions
 * @param {Array} navigationItems - Array of navigation items
 * @param {Array} userPermissions - Array of user's permission objects
 * @returns {Array} - Filtered navigation items
 */
export function filterNavigationByPermissions(navigationItems, userPermissions) {
  return navigationItems.filter(item => {
    if (!item.href) return true; // Keep items without href (like headers)
    
    return canAccessRoute(userPermissions, item.href);
  });
}

/**
 * Component-level permission checking utilities
 */

/**
 * Check if user can perform a specific action on a button/component
 * @param {Array} userPermissions - Array of user's permission objects
 * @param {string} action - Action name (e.g., 'create', 'update', 'delete')
 * @param {string} resource - Resource name (e.g., 'employees', 'projects')
 * @param {string} module - Module name (e.g., 'users', 'projects')
 * @returns {boolean} - Whether user can perform the action
 */
export function canPerformAction(userPermissions, action, resource, module = null) {
  if (!userPermissions || !Array.isArray(userPermissions)) {
    return false;
  }

  // If module is not provided, try to infer it from resource
  if (!module) {
    const moduleMap = {
      'employees': 'users',
      'projects': 'projects',
      'attendance': 'attendance',
      'leaves': 'leaves',
      'roles': 'roles',
      'settings': 'settings',
      'payroll': 'salary'
    };
    module = moduleMap[resource] || resource;
  }

  return hasPermission(userPermissions, module, action, resource);
}

/**
 * Get filtered data based on user permissions (for data tables, lists, etc.)
 * @param {Array} data - Array of data items
 * @param {Array} userPermissions - Array of user's permission objects
 * @param {string} resource - Resource name
 * @param {Function} filterFn - Custom filter function (optional)
 * @returns {Array} - Filtered data array
 */
export function filterDataByPermissions(data, userPermissions, resource, filterFn = null) {
  if (!data || !Array.isArray(data)) {
    return [];
  }

  // If user has view permission for the resource, return all data
  if (canPerformAction(userPermissions, 'view', resource)) {
    return filterFn ? data.filter(filterFn) : data;
  }

  // If no permission, return empty array
  return [];
}

/**
 * Get available actions for a resource based on user permissions
 * @param {Array} userPermissions - Array of user's permission objects
 * @param {string} resource - Resource name
 * @param {string} module - Module name (optional)
 * @returns {Object} - Object with boolean flags for each action
 */
export function getAvailableActions(userPermissions, resource, module = null) {
  return {
    view: canPerformAction(userPermissions, 'view', resource, module),
    create: canPerformAction(userPermissions, 'create', resource, module),
    update: canPerformAction(userPermissions, 'update', resource, module),
    delete: canPerformAction(userPermissions, 'delete', resource, module),
    all: canPerformAction(userPermissions, 'all', resource, module)
  };
}

/**
 * Higher-order component for permission-based rendering
 * @param {Array} userPermissions - Array of user's permission objects
 * @param {string} requiredAction - Required action
 * @param {string} requiredResource - Required resource
 * @param {string} requiredModule - Required module (optional)
 * @returns {Function} - Function that takes a component and returns it conditionally
 */
export function withPermission(userPermissions, requiredAction, requiredResource, requiredModule = null) {
  return function(Component) {
    if (canPerformAction(userPermissions, requiredAction, requiredResource, requiredModule)) {
      return Component;
    }
    return null;
  };
}

/**
 * Hook-like function for permission checking in components
 * @param {Array} userPermissions - Array of user's permission objects
 * @param {string} resource - Resource name
 * @param {string} module - Module name (optional)
 * @returns {Object} - Object with permission checking functions
 */
export function usePermissions(userPermissions, resource, module = null) {
  const actions = getAvailableActions(userPermissions, resource, module);
  
  return {
    ...actions,
    can: (action) => canPerformAction(userPermissions, action, resource, module),
    canAccess: (pathname) => canAccessRoute(userPermissions, pathname),
    isAdmin: () => isAdmin(userPermissions, null)
  };
} 