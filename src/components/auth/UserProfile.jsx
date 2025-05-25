"use client";

import { useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, IdCard, Shield } from 'lucide-react';

export default function UserProfile({ showCard = false }) {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const { user } = session;
  const initials = user.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || 'U';

  if (showCard) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback className="text-lg font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">{user.name}</h3>
              <Badge variant="secondary" className="text-xs">
                {user.role?.name || 'No Role'}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">{user.email}</span>
            </div>
            
            {user.employeeId && (
              <div className="flex items-center gap-2 text-sm">
                <IdCard className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">ID: {user.employeeId}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Status: {user.status}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Compact version for header/sidebar
  return (
    <div className="flex items-center space-x-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src={user.image} alt={user.name} />
        <AvatarFallback className="text-sm font-medium">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {user.name}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {user.role?.name || 'No Role'}
        </span>
      </div>
    </div>
  );
} 