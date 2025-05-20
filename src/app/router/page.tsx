'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

/**
 * Role-Based Router Page
 * 
 * This is a dedicated page that handles authentication and role-based routing
 * with a direct approach using window.location rather than Next.js routing.
 * 
 * The flow is:
 * 1. Check if user is authenticated
 * 2. Fetch their profile to determine role
 * 3. Navigate to the appropriate dashboard
 */
export default function RouterPage() {
  // State to show user-friendly status messages
  const [message, setMessage] = useState('Checking your account...');
  // State to track what animation to show
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    // Self-executing async function to handle routing
    (async () => {
      try {
        // STEP 1: Check authentication
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // Not authenticated, redirect to login
          console.log('Router: No active session found');
          setStatus('error');
          setMessage('Please log in to continue');
          toast.error('Authentication required');
          
          setTimeout(() => {
            window.location.href = '/auth/login';
          }, 1000);
          return;
        }
        
        // STEP 2: Get user profile for role information
        setMessage('Loading your profile...');
        // First verify we still have a valid session token
        console.log('ROUTER - Verifying token validity');
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        
        if (!currentUser || currentUser.id !== session.user.id) {
          console.error('ROUTER - User ID mismatch or token invalid');
          setStatus('error');
          setMessage('Authentication error');
          toast.error('Authentication error', { description: 'Please log in again' });
          setTimeout(() => { window.location.href = '/auth/login'; }, 2000);
          return;
        }
        
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role, email, full_name')
          .eq('id', session.user.id)
          .single();
          
        if (error || !profile) {
          console.error('Router: Error fetching profile', error);
          setStatus('error');
          setMessage('Unable to load your profile');
          
          toast.error('Profile error', { 
            description: 'Redirecting to default dashboard' 
          });
          
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 1500);
          return;
        }
        
        // STEP 3: Determine dashboard based on role
        // Display full profile information for debugging
        console.log('ROUTER - PROFILE DATA:', {
          id: session.user.id,
          email: profile.email,
          role: profile.role,
          roleType: typeof profile.role,
          roleStringValue: String(profile.role)
        });
        
        // Set defaults
        let targetDashboard = '/dashboard';
        let roleDisplay = 'User';
        
        // Normalize role to handle any data type or casing issues
        if (profile.role !== null && profile.role !== undefined) {
          const normalizedRole = String(profile.role).toLowerCase().trim();
          console.log(`ROUTER - Normalized role: "${normalizedRole}"`);
          
          // Assign dashboard path based on role
          if (normalizedRole === 'admin') {
            targetDashboard = '/admin/dashboard';
            roleDisplay = 'Administrator';
          } else if (normalizedRole === 'manager') {
            targetDashboard = '/manager/dashboard';
            roleDisplay = 'Manager';
          }
        }
        
        // STEP 4: Show success animation and redirect
        setStatus('success');
        setMessage(`Welcome ${profile.full_name || roleDisplay}!`);
        
        toast.success(`Welcome back!`, {
          description: `Redirecting to your ${roleDisplay} dashboard...`
        });
        
        console.log(`ROUTER - Redirecting to: ${targetDashboard}`);
        
        // First, refresh token to ensure session persists
        try {
          console.log('ROUTER - Refreshing auth token before redirect');
          await supabase.auth.refreshSession();
          
          // Verify session is still valid after refresh
          const { data: { session: refreshedSession } } = await supabase.auth.getSession();
          if (!refreshedSession) {
            console.error('ROUTER - Session lost after refresh!');
            setStatus('error');
            setMessage('Session lost. Please log in again.');
            toast.error('Authentication error', { description: 'Please log in again' });
            setTimeout(() => { window.location.href = '/auth/login'; }, 2000);
            return;
          }
          
          console.log('ROUTER - Session refreshed successfully');
        } catch (refreshError) {
          console.warn('ROUTER - Non-fatal refresh error:', refreshError);
        }
        
        // Store user role in localStorage to help with persistence
        if (profile.role) {
          localStorage.setItem('userRole', String(profile.role).toLowerCase().trim());
        }
        
        // Set a redirection timestamp to prevent infinite loops
        localStorage.setItem('lastRedirect', Date.now().toString());
        
        // Short delay to allow animation to be seen
        setTimeout(() => {
          console.log(`ROUTER - FINAL REDIRECT to ${targetDashboard}`);
          // Use direct browser navigation which bypasses Next.js routing
          // Use replace instead of href to avoid back-button issues
          window.location.replace(targetDashboard);
        }, 1500);
        
      } catch (err) {
        // Handle any unexpected errors
        console.error('Router: Unexpected error', err);
        setStatus('error');
        setMessage('Something went wrong');
        
        toast.error('Navigation error', { 
          description: 'Please try again later' 
        });
        
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      }
    })();
  }, []);
  
  // Animation classes based on status
  const iconClasses = {
    loading: "animate-spin",
    success: "scale-110 duration-700 text-green-500",
    error: "scale-110 duration-700 text-red-500"
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      {/* Neumorphic card with soft shadows */}
      <div className="w-full max-w-md p-8 rounded-2xl 
                     shadow-[8px_8px_16px_#d9d9d9,-8px_-8px_16px_#ffffff] 
                     transition-all duration-300 ease-in-out 
                     hover:shadow-[10px_10px_20px_#d1d1d1,-10px_-10px_20px_#ffffff]
                     bg-white text-center">
        
        {/* Animated icon based on status */}
        <div className={`w-20 h-20 mx-auto mb-6 transition-all duration-300 ${iconClasses[status]}`}>
          {status === 'loading' ? (
            <div className="w-full h-full border-4 border-[#0089AD] border-t-transparent rounded-full"></div>
          ) : status === 'success' ? (
            <div className="w-full h-full flex items-center justify-center text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}
        </div>
        
        {/* Status message with title */}
        <h2 className="text-2xl font-bold text-[#0089AD] mb-3">Authentication Router</h2>
        <p className="text-gray-700 text-lg transition-all duration-300">{message}</p>
      </div>
    </div>
  );
}
