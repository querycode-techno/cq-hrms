'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getDefaultRoute } from '@/lib/permissions';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Still loading

    if (status === 'unauthenticated') {
      // Not logged in, redirect to login
      router.replace('/login');
      return;
    }

    if (session?.user) {
      // User is logged in, redirect to their default route based on permissions
      const userPermissions = session.user.role?.permissions || [];
      const userRole = session.user.role?.name;
      const defaultRoute = getDefaultRoute(userPermissions, userRole);
      
      router.replace(defaultRoute);
    }
  }, [session, status, router]);

  // Show loading while determining authentication status
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return null; // This component will redirect, so no need to render anything
}
