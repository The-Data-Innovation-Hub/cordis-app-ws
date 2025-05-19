'use client';

import { useAuth } from '@/contexts/auth-context';

type Role = 'admin' | 'user' | null;

export function useRole() {
  const { user, profile, loading } = useAuth();

  const hasRole = (requiredRole: Role): boolean => {
    if (loading) return false;
    if (!user) return false;
    if (!requiredRole) return true; // No role required
    return profile?.role === requiredRole;
  };

  const isAdmin = hasRole('admin');
  const isUser = hasRole('user');

  return {
    user,
    profile,
    loading,
    hasRole,
    isAdmin,
    isUser,
    isAuthenticated: !!user,
  };
}
