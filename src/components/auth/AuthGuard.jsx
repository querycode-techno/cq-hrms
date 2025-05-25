"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import { canAccessRoute, getDefaultRoute } from '@/lib/permissions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

/**
 * AuthGuard component that protects routes and components with authentication and permission checks
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to render if authenticated and authorized
 * @param {string} props.requiredPermission - Required permission object (optional)
 * @param {Array} props.requiredRoles - Array of required roles (optional)
 * @param {string} props.redirectTo - Custom redirect URL (optional)
 * @param {boolean} props.showFallback - Whether to show fallback UI instead of redirecting
 * @param {React.ReactNode} props.fallback - Custom fallback content
 * @param {Function} props.customCheck - Custom authorization check function
 * @returns {React.ReactNode} - Protected content or loading/error state
 */
export default function AuthGuard({
  children,
  requiredPermission = null,
  requiredRoles = [],
  redirectTo = null,
  showFallback = false,
  fallback = null,
  customCheck = null
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      setIsChecking(true);
      setAuthError(null);

      // Wait for session to load
      if (status === 'loading') {
        return;
      }

      // Check authentication
      if (status === 'unauthenticated' || !session?.user) {
        if (showFallback) {
          setAuthError('You must be logged in to access this content.');
          setIsChecking(false);
          return;
        }
        
        // Redirect to login
        const currentPath = window.location.pathname;
        router.replace(`/login?callbackUrl=${encodeURIComponent(currentPath)}`);
        return;
      }

      // Check account status
      if (session.user.status !== 'Active') {
        if (showFallback) {
          setAuthError('Your account is inactive. Please contact administrator.');
          setIsChecking(false);
          return;
        }
        
        router.replace('/login?error=AccountInactive');
        return;
      }

      const userPermissions = session.user.role?.permissions || [];
      const userRole = session.user.role?.name;

      // Custom authorization check
      if (customCheck) {
        const isAuthorized = customCheck(userPermissions, session.user);
        if (!isAuthorized) {
          if (showFallback) {
            setAuthError('You do not have permission to access this content.');
            setIsChecking(false);
            return;
          }
          
          const defaultRoute = getDefaultRoute(userPermissions, userRole);
          router.replace(`${defaultRoute}?error=AccessDenied`);
          return;
        }
      }

      // Role-based check
      if (requiredRoles.length > 0) {
        const hasRequiredRole = requiredRoles.includes(userRole);
        if (!hasRequiredRole) {
          if (showFallback) {
            setAuthError(`This content requires one of the following roles: ${requiredRoles.join(', ')}`);
            setIsChecking(false);
            return;
          }
          
          const defaultRoute = getDefaultRoute(userPermissions, userRole);
          router.replace(`${defaultRoute}?error=AccessDenied`);
          return;
        }
      }

      // Permission-based check
      if (requiredPermission) {
        const hasPermission = userPermissions.some(permission =>
          permission.module === requiredPermission.module &&
          permission.action === requiredPermission.action &&
          permission.resource === requiredPermission.resource
        );

        if (!hasPermission) {
          if (showFallback) {
            setAuthError('You do not have the required permissions to access this content.');
            setIsChecking(false);
            return;
          }
          
          const defaultRoute = getDefaultRoute(userPermissions, userRole);
          router.replace(`${defaultRoute}?error=AccessDenied`);
          return;
        }
      }

      // Route-based check (if no specific permission/role requirements)
      if (!requiredPermission && requiredRoles.length === 0 && !customCheck) {
        const currentPath = window.location.pathname;
        const canAccess = canAccessRoute(userPermissions, currentPath);
        
        if (!canAccess) {
          if (showFallback) {
            setAuthError('You do not have permission to access this page.');
            setIsChecking(false);
            return;
          }
          
          const defaultRoute = getDefaultRoute(userPermissions, userRole);
          router.replace(`${defaultRoute}?error=AccessDenied&attempted=${encodeURIComponent(currentPath)}`);
          return;
        }
      }

      // All checks passed
      setIsChecking(false);
    };

    checkAuth();
  }, [session, status, router, requiredPermission, requiredRoles, customCheck, showFallback]);

  // Loading state
  if (status === 'loading' || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // Error state (when showFallback is true)
  if (authError) {
    if (fallback) {
      return fallback;
    }

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="mb-4">
              {authError}
            </AlertDescription>
          </Alert>
          <div className="mt-4 flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => router.back()}
              className="flex-1"
            >
              Go Back
            </Button>
            <Button 
              onClick={() => router.push('/login')}
              className="flex-1"
            >
              Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Render protected content
  return children;
}

/**
 * Higher-order component version of AuthGuard
 * 
 * @param {Object} guardOptions - Guard configuration options
 * @returns {Function} - HOC function
 */
export function withAuthGuard(guardOptions = {}) {
  return function(WrappedComponent) {
    return function AuthGuardedComponent(props) {
      return (
        <AuthGuard {...guardOptions}>
          <WrappedComponent {...props} />
        </AuthGuard>
      );
    };
  };
}

/**
 * Hook for checking authentication status and permissions
 * 
 * @param {Object} options - Check options
 * @returns {Object} - Authentication and authorization status
 */
export function useAuthGuard(options = {}) {
  const { data: session, status } = useSession();
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isAuthorized: false,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const checkAuth = () => {
      if (status === 'loading') {
        setAuthState(prev => ({ ...prev, isLoading: true }));
        return;
      }

      if (status === 'unauthenticated' || !session?.user) {
        setAuthState({
          isAuthenticated: false,
          isAuthorized: false,
          isLoading: false,
          error: 'Not authenticated'
        });
        return;
      }

      if (session.user.status !== 'Active') {
        setAuthState({
          isAuthenticated: true,
          isAuthorized: false,
          isLoading: false,
          error: 'Account inactive'
        });
        return;
      }

      const userPermissions = session.user.role?.permissions || [];
      const userRole = session.user.role?.name;

      // Check authorization based on options
      let isAuthorized = true;
      let error = null;

      if (options.customCheck) {
        isAuthorized = options.customCheck(userPermissions, session.user);
        if (!isAuthorized) error = 'Custom check failed';
      }

      if (options.requiredRoles?.length > 0) {
        isAuthorized = isAuthorized && options.requiredRoles.includes(userRole);
        if (!isAuthorized) error = 'Required role not found';
      }

      if (options.requiredPermission) {
        const hasPermission = userPermissions.some(permission =>
          permission.module === options.requiredPermission.module &&
          permission.action === options.requiredPermission.action &&
          permission.resource === options.requiredPermission.resource
        );
        isAuthorized = isAuthorized && hasPermission;
        if (!isAuthorized) error = 'Required permission not found';
      }

      setAuthState({
        isAuthenticated: true,
        isAuthorized,
        isLoading: false,
        error
      });
    };

    checkAuth();
  }, [session, status, options]);

  return authState;
} 