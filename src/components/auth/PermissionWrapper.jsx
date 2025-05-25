"use client";

import { useSession } from 'next-auth/react';
import { canPerformAction } from '@/lib/permissions';

/**
 * Permission wrapper component that conditionally renders children based on user permissions
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to render if permission is granted
 * @param {string} props.action - Required action (e.g., 'view', 'create', 'update', 'delete')
 * @param {string} props.resource - Required resource (e.g., 'employees', 'projects')
 * @param {string} props.module - Required module (optional, will be inferred from resource)
 * @param {React.ReactNode} props.fallback - Content to render if permission is denied (optional)
 * @param {boolean} props.showFallback - Whether to show fallback content or nothing (default: false)
 * @param {Function} props.customCheck - Custom permission check function (optional)
 * @returns {React.ReactNode} - Rendered content or null
 */
export default function PermissionWrapper({ 
  children, 
  action, 
  resource, 
  module = null,
  fallback = null,
  showFallback = false,
  customCheck = null
}) {
  const { data: session } = useSession();
  
  if (!session?.user) {
    return showFallback ? fallback : null;
  }

  const userPermissions = session.user.role?.permissions || [];
  
  // Use custom check if provided, otherwise use standard permission check
  const hasPermission = customCheck 
    ? customCheck(userPermissions, session.user)
    : canPerformAction(userPermissions, action, resource, module);

  if (hasPermission) {
    return children;
  }

  return showFallback ? fallback : null;
}

/**
 * Higher-order component version of PermissionWrapper
 * 
 * @param {string} action - Required action
 * @param {string} resource - Required resource
 * @param {string} module - Required module (optional)
 * @param {Object} options - Additional options
 * @returns {Function} - HOC function
 */
export function withPermissionWrapper(action, resource, module = null, options = {}) {
  return function(WrappedComponent) {
    return function PermissionWrappedComponent(props) {
      return (
        <PermissionWrapper 
          action={action} 
          resource={resource} 
          module={module}
          {...options}
        >
          <WrappedComponent {...props} />
        </PermissionWrapper>
      );
    };
  };
}

/**
 * Permission-aware button component
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.action - Required action
 * @param {string} props.resource - Required resource
 * @param {string} props.module - Required module (optional)
 * @param {Function} props.onClick - Click handler
 * @param {Object} props.buttonProps - Additional button props
 * @returns {React.ReactNode} - Button or null
 */
export function PermissionButton({ 
  children, 
  action, 
  resource, 
  module = null, 
  onClick, 
  ...buttonProps 
}) {
  return (
    <PermissionWrapper action={action} resource={resource} module={module}>
      <button onClick={onClick} {...buttonProps}>
        {children}
      </button>
    </PermissionWrapper>
  );
}

/**
 * Permission-aware link component
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Link content
 * @param {string} props.href - Link destination
 * @param {string} props.action - Required action
 * @param {string} props.resource - Required resource
 * @param {string} props.module - Required module (optional)
 * @param {Object} props.linkProps - Additional link props
 * @returns {React.ReactNode} - Link or null
 */
export function PermissionLink({ 
  children, 
  href, 
  action, 
  resource, 
  module = null, 
  ...linkProps 
}) {
  return (
    <PermissionWrapper action={action} resource={resource} module={module}>
      <a href={href} {...linkProps}>
        {children}
      </a>
    </PermissionWrapper>
  );
} 