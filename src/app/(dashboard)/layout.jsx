"use client"

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // Check if current page is chat
  const isChatPage = pathname === '/chat';

  useEffect(() => {
    // Redirect to login if not authenticated
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show loading while redirecting unauthenticated users
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Only render dashboard if authenticated
  if (status === 'authenticated' && session?.user) {
    return (
      <div className="min-h-screen flex bg-background">
        {/* Sidebar */}
        <div className="hidden md:flex w-64 flex-col fixed inset-y-0 bg-card border-r shadow-sm">
          <div className="flex-1 flex flex-col min-h-0">
            {/* Header */}
            <div className="flex items-center h-16 flex-shrink-0 px-4 border-b bg-primary">
              <h1 className="text-lg font-semibold text-primary-foreground">CQAMS</h1>
            </div>
            
            {/* Navigation */}
            <div className="flex-1 flex flex-col overflow-y-auto">
              <MainNav />
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 md:pl-64">
          {/* Top bar */}
          <div className="sticky top-0 z-10 flex h-16 bg-background border-b shadow-sm">
            <div className="flex-1 px-4 flex justify-between items-center">
              <div className="flex-1 flex items-center">
                {/* Mobile menu button could go here */}
              </div>
              <div className="ml-4 flex items-center space-x-4">
                <ModeToggle />
                <UserNav />
              </div>
            </div>
          </div>

          {/* Page content */}
          <main className="flex-1">
            {isChatPage ? (
              children
            ) : (
              <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                  {children}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    );
  }

  // Fallback loading state
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Initializing...</p>
      </div>
    </div>
  );
} 