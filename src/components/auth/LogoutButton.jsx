"use client";

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default function LogoutButton({ variant = "ghost", size = "sm", className = "" }) {
  const handleLogout = async () => {
    await signOut({
      callbackUrl: '/login',
      redirect: true
    });
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      className={`flex items-center gap-2 ${className}`}
    >
      <LogOut className="h-4 w-4" />
      Sign Out
    </Button>
  );
} 