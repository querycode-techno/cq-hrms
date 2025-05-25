"use client";

import { useSession } from 'next-auth/react';
import { 
  canPerformAction, 
  canAccessRoute, 
  getAvailableActions, 
  isAdmin,
  hasPermission 
} from '@/lib/permissions';

/**
 * Custom hook for permission checking in React components
 * 
 * @param {string} resource - Default resource for permission checks (optional)
 * @param {string} module - Default module for permission checks (optional)
 * @returns {Object} - Object with permission checking functions and user data
 */
export function usePermissions(resource = null, module = null) {
  const { data: session, status } = useSession();
  
  const userPermissions = session?.user?.role?.permissions || [];
  const userRole = session?.user?.role?.name || '';
  const user = session?.user || null;

  /**
   * Check if user can perform a specific action
   * @param {string} action - Action to check
   * @param {string} checkResource - Resource to check (uses default if not provided)
   * @param {string} checkModule - Module to check (uses default if not provided)
   * @returns {boolean} - Whether user has permission
   */
  const can = (action, checkResource = resource, checkModule = module) => {
    if (!checkResource) {
      console.warn('usePermissions: No resource provided for permission check');
      return false;
    }
    return canPerformAction(userPermissions, action, checkResource, checkModule);
  };

  /**
   * Check if user can access a specific route
   * @param {string} pathname - Route to check
   * @returns {boolean} - Whether user can access the route
   */
  const canAccess = (pathname) => {
    return canAccessRoute(userPermissions, pathname);
  };

  /**
   * Check if user has a specific permission exactly
   * @param {string} module - Module name
   * @param {string} action - Action name
   * @param {string} resource - Resource name
   * @returns {boolean} - Whether user has the exact permission
   */
  const hasExactPermission = (module, action, resource) => {
    return hasPermission(userPermissions, module, action, resource);
  };

  /**
   * Get all available actions for the default resource
   * @param {string} checkResource - Resource to check (uses default if not provided)
   * @param {string} checkModule - Module to check (uses default if not provided)
   * @returns {Object} - Object with boolean flags for each action
   */
  const getActions = (checkResource = resource, checkModule = module) => {
    if (!checkResource) {
      return { view: false, create: false, update: false, delete: false, all: false };
    }
    return getAvailableActions(userPermissions, checkResource, checkModule);
  };

  /**
   * Check if user has admin privileges
   * @returns {boolean} - Whether user is admin
   */
  const isUserAdmin = () => {
    return isAdmin(userPermissions, userRole);
  };

  /**
   * Check if user is authenticated
   * @returns {boolean} - Whether user is authenticated
   */
  const isAuthenticated = () => {
    return status === 'authenticated' && !!user;
  };

  /**
   * Check if authentication is loading
   * @returns {boolean} - Whether authentication is loading
   */
  const isLoading = () => {
    return status === 'loading';
  };

  /**
   * Get user's role information
   * @returns {Object} - User's role data
   */
  const getRole = () => {
    return session?.user?.role || null;
  };

  /**
   * Check if user has a specific role
   * @param {string} roleName - Role name to check
   * @returns {boolean} - Whether user has the role
   */
  const hasRole = (roleName) => {
    return userRole === roleName;
  };

  /**
   * Check if user has any of the specified roles
   * @param {Array} roleNames - Array of role names to check
   * @returns {boolean} - Whether user has any of the roles
   */
  const hasAnyRole = (roleNames) => {
    return roleNames.includes(userRole);
  };

  /**
   * Get filtered permissions for display
   * @returns {Array} - Array of user's permissions
   */
  const getPermissions = () => {
    return userPermissions;
  };

  /**
   * Check multiple permissions at once
   * @param {Array} checks - Array of permission check objects
   * @returns {Object} - Object with results for each check
   */
  const checkMultiple = (checks) => {
    const results = {};
    checks.forEach(({ key, action, resource: checkResource, module: checkModule }) => {
      results[key] = can(action, checkResource, checkModule);
    });
    return results;
  };

  return {
    // Permission checking functions
    can,
    canAccess,
    hasPermission: hasExactPermission,
    getActions,
    
    // Admin and role checking
    isAdmin: isUserAdmin,
    hasRole,
    hasAnyRole,
    getRole,
    
    // Authentication status
    isAuthenticated,
    isLoading,
    
    // User data
    user,
    userRole,
    permissions: userPermissions,
    getPermissions,
    
    // Utility functions
    checkMultiple,
    
    // Convenience properties for common checks (if resource is provided)
    ...(resource ? {
      canView: can('view'),
      canCreate: can('create'),
      canUpdate: can('update'),
      canDelete: can('delete'),
      canAll: can('all'),
      actions: getActions()
    } : {})
  };
}

/**
 * Hook specifically for route-based permission checking
 * @returns {Object} - Object with route permission functions
 */
export function useRoutePermissions() {
  const { canAccess, isAuthenticated, isLoading } = usePermissions();
  
  return {
    canAccess,
    isAuthenticated,
    isLoading,
    
    /**
     * Check if user can access current route
     * @param {string} currentPath - Current pathname
     * @returns {boolean} - Whether user can access current route
     */
    canAccessCurrent: (currentPath) => {
      return canAccess(currentPath);
    }
  };
}

/**
 * Hook for admin-specific permission checking
 * @returns {Object} - Object with admin permission functions
 */
export function useAdminPermissions() {
  const { isAdmin, hasRole, hasAnyRole, can, user } = usePermissions();
  
  return {
    isAdmin,
    isSuperAdmin: () => hasRole('Super Admin'),
    isHRManager: () => hasRole('HR Manager'),
    isManager: () => hasRole('Manager'),
    isEmployee: () => hasRole('Employee'),
    hasAnyAdminRole: () => hasAnyRole(['Super Admin', 'HR Manager']),
    canManageUsers: () => can('create', 'employees', 'users'),
    canManageRoles: () => can('view', 'roles', 'roles'),
    canManageSettings: () => can('view', 'system', 'settings'),
    user
  };
} 