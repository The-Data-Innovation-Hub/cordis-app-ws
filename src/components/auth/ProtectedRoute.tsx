'use client';

import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'user';
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  requiredRole = 'user',
  redirectTo = '/signin' 
}: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // If user is not authenticated, redirect to sign in
      if (!user) {
        router.push(redirectTo);
        return;
      }

      // If user doesn't have the required role, redirect to home or 403
      if (requiredRole === 'admin' && profile?.role !== 'admin') {
        router.push('/');
        return;
      }
    }
  }, [user, profile, loading, requiredRole, router, redirectTo]);

  // Show loading state while checking auth status
  if (loading || !user || (requiredRole === 'admin' && profile?.role !== 'admin')) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated and has required role, render children
  return <>{children}</>;
}
