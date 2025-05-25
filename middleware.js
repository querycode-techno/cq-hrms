// middleware.js
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { canAccessRoute, getDefaultRoute } from './src/lib/permissions';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Allow access to setup page always (for initial setup)
    if (pathname.startsWith('/setup')) {
      return NextResponse.next();
    }

    // Redirect to login if not authenticated
    if (!token) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check if user account is active
    if (token.status !== 'Active') {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('error', 'AccountInactive');
      return NextResponse.redirect(loginUrl);
    }

    // Get user permissions from token
    const userPermissions = token.role?.permissions || [];
    const userRole = token.role?.name;

    // Handle root path redirect
    if (pathname === '/') {
      const defaultRoute = getDefaultRoute(userPermissions, userRole);
      return NextResponse.redirect(new URL(defaultRoute, req.url));
    }

    // Dynamic permission checking for protected routes
    if (!canAccessRoute(userPermissions, pathname)) {
      // If user doesn't have permission, redirect to their default allowed route
      const defaultRoute = getDefaultRoute(userPermissions, userRole);
      
      // If they're trying to access a route they don't have permission for,
      // redirect them to their default route with an error message
      const redirectUrl = new URL(defaultRoute, req.url);
      redirectUrl.searchParams.set('error', 'AccessDenied');
      redirectUrl.searchParams.set('attempted', pathname);
      
      return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Allow public routes
        if (
          pathname.startsWith('/login') ||
          pathname.startsWith('/api/auth') ||
          pathname.startsWith('/setup') ||
          pathname.startsWith('/_next') ||
          pathname.startsWith('/favicon.ico') ||
          pathname.startsWith('/api/health')
        ) {
          return true;
        }

        // Require authentication for all other routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth routes)
     * - api/health (health check)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api/auth|api/health|_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 