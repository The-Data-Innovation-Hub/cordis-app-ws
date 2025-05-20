import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

/**
 * Custom hook to handle role-based redirection
 * This ensures users are sent to the appropriate dashboard based on their role
 */
export function useRoleBasedRedirect() {
  const router = useRouter();
  const { profile, isLoading } = useAuth();

  useEffect(() => {
    // Skip if still loading or no profile data
    if (isLoading || !profile) {
      console.log('Role redirect: Still loading or no profile data');
      return;
    }

    // Log the current profile data for debugging
    console.log('Role redirect: Profile data loaded', {
      id: profile.id,
      email: profile.email,
      role: profile.role,
      roleType: typeof profile.role,
      currentPath: typeof window !== 'undefined' ? window.location.pathname : undefined
    });

    // Get the current path
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    // Only redirect if we're on the dashboard or root path
    const shouldRedirect = 
      currentPath === '/dashboard' || 
      currentPath === '/dashboard/' ||
      currentPath === '/' ||
      currentPath === '';

    if (!shouldRedirect) {
      console.log('Role redirect: Not on a redirectable path', { currentPath });
      return;
    }

    // Normalize the role value to handle case differences
    const roleValue = typeof profile.role === 'string' 
      ? profile.role.toLowerCase() 
      : 'user';

    // Perform the actual redirection based on role
    if (roleValue === 'admin') {
      console.log('Role redirect: Redirecting admin to admin dashboard');
      router.replace('/admin/dashboard');
    } else if (roleValue === 'manager') {
      console.log('Role redirect: Redirecting manager to manager dashboard');
      router.replace('/manager/dashboard');
    } else if (currentPath === '/' || currentPath === '') {
      // If a regular user is at root, send them to dashboard
      console.log('Role redirect: Redirecting regular user from root to dashboard');
      router.replace('/dashboard');
    } else {
      console.log('Role redirect: User already on appropriate dashboard', { roleValue });
    }
  }, [profile, isLoading, router]);
}
