'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

// Helper function to safely handle navigation
const safeNavigate = (path: string) => {
  try {
    if (typeof window !== 'undefined' && window.location.pathname !== path) {
      console.log(`Navigating to: ${path}`);
      window.location.href = path;
    }
  } catch (error) {
    console.error('Navigation error:', error);
  }
};

// Determines the target dashboard URL based on user role
const getDashboardByRole = (role: string | null) => {
  if (!role) return { path: '/dashboard', displayRole: 'User' };
  
  const normalizedRole = role.toLowerCase().trim();
  console.log(`Normalized role: "${normalizedRole}"`);
  
  switch (normalizedRole) {
    case 'admin':
      return { path: '/admin/dashboard', displayRole: 'Administrator' };
    case 'manager':
      return { path: '/manager/dashboard', displayRole: 'Manager' };
    default:
      return { path: '/dashboard', displayRole: 'User' };
  }
};

// Loading spinner component
const LoadingSpinner = () => (
  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
);

// Status icon component
const StatusIcon = ({ status }: { status: 'loading' | 'success' | 'error' }) => {
  if (status === 'loading') return <LoadingSpinner />;
  if (status === 'success') return <div className="text-green-500 text-4xl mb-2">✓</div>;
  return <div className="text-red-500 text-4xl mb-2">⚠️</div>;
};

// Status message component
const StatusMessage = ({ status }: { status: 'loading' | 'success' | 'error' }) => {
  if (status === 'loading') return 'Please wait...';
  if (status === 'success') return 'Taking you to your dashboard...';
  return 'Redirecting to login...';
};

/**
 * Role-Based Router Page
 * 
 * Handles authentication and role-based routing for the application.
 * Ensures users are properly authenticated and routes them to the appropriate dashboard.
 */
export default function RouterPage() {
  const [message, setMessage] = useState('Checking your account...');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [hasRedirected, setHasRedirected] = useState(false);

  // Handles the entire redirection logic
  const handleRedirect = useCallback(async () => {
    if (hasRedirected) {
      console.log('Redirection already handled');
      return;
    }

    try {
      // STEP 1: Check authentication
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Error getting session:', sessionError);
        throw sessionError;
      }

      if (!session) {
        // If no session, redirect to login
        const currentPath = window.location.pathname;
        const redirectUrl = currentPath === '/' ? '/auth/login' : 
          `/auth/login?redirectedFrom=${encodeURIComponent(currentPath)}`;
        
        setStatus('error');
        setMessage('No active session');
        toast.error('Please log in to continue');
        
        setHasRedirected(true);
        safeNavigate(redirectUrl);
        return;
      }
      
      // STEP 2: Verify session with a fresh token
      setMessage('Verifying your session...');
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !currentUser) {
        console.error('Error getting current user:', userError);
        throw userError || new Error('No user found');
      }
      
      // STEP 3: Get user profile
      setMessage('Loading your profile...');
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, email, full_name')
        .eq('id', currentUser.id)
        .single();
      
      if (profileError || !profile) {
        console.error('Error fetching profile:', profileError);
        setStatus('error');
        setMessage('Unable to load your profile');
        toast.error('Profile error', { description: 'Redirecting to default dashboard' });
        
        setHasRedirected(true);
        safeNavigate('/dashboard');
        return;
      }
      
      // Log profile data for debugging
      console.log('Profile data:', {
        id: currentUser.id,
        email: profile.email,
        role: profile.role,
        roleType: typeof profile.role,
        roleStringValue: String(profile.role)
      });
      
      // STEP 4: Determine dashboard based on role
      const { path: targetDashboard, displayRole } = getDashboardByRole(profile.role);
      
      // STEP 5: Update UI and prepare for redirect
      setStatus('success');
      setMessage(`Welcome, ${profile.full_name || displayRole}!`);
      console.log(`Redirecting to: ${targetDashboard}`);
      
      // Mark redirection as handled and redirect
      setHasRedirected(true);
      setTimeout(() => safeNavigate(targetDashboard), 1000);
      
    } catch (error) {
      console.error('Router error:', error);
      setStatus('error');
      setMessage('An error occurred');
      toast.error('Error', { description: 'Redirecting to login...' });
      
      // Redirect to login on error
      setTimeout(() => safeNavigate('/auth/login'), 2000);
    }
  }, [hasRedirected]);

  // Run the redirect logic on component mount
  useEffect(() => {
    handleRedirect();
  }, [handleRedirect]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 max-w-md w-full">
        <div className="mb-4">
          <StatusIcon status={status} />
        </div>
        <h1 className="text-xl font-semibold text-gray-800 mb-2">
          {message}
        </h1>
        <p className="text-gray-600 text-sm">
          <StatusMessage status={status} />
        </p>
      </div>
    </div>
  );
}
