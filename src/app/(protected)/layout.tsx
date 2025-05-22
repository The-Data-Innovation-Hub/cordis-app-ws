'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MainNav } from '@/components/navigation/main-nav';
import { MobileNav } from '@/components/navigation/mobile-nav';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      if (!isLoading && !user) {
        console.log('No user found, redirecting to sign-in...');
        await router.replace('/auth/login');
      }
    };
    checkAuth();
  }, [user, isLoading, router]);

  useEffect(() => {
    // Debug: Check authentication state with full details
    console.log('Protected layout auth state:', { 
      userExists: !!user,
      profileExists: !!profile, 
      isLoading, 
      profileData: profile ? {
        id: profile.id,
        email: profile.email,
        role: profile.role,
        roleType: typeof profile.role,
        roleStringValue: String(profile.role),
        roleNormalized: typeof profile.role === 'string' ? profile.role.toLowerCase() : String(profile.role).toLowerCase()
      } : null
    });

    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        console.log('Loading timeout reached - forcing navigation to dashboard');
        router.push('/dashboard');
      }
    }, 5000); // 5 seconds timeout
    
    // Cleanup timeout on unmount
    return () => clearTimeout(timeoutId);

    // Only proceed if we have user data (even without complete profile)
    if (user) {
      const currentPath = window.location.pathname;
      console.log('Current path:', currentPath);
      
      // Get the normalized role string regardless of type
      // Default to user if profile or role is missing
      let normalizedRole = 'user';
      
      // Only check role if profile exists
      if (profile && profile.role !== null && profile.role !== undefined) {
        // Convert to string and normalize to lowercase
        normalizedRole = String(profile.role).toLowerCase().trim();
        console.log(`Role detected from profile: ${normalizedRole}`);
      } else {
        console.log('No profile or role found, defaulting to user role');
      }
      
      console.log('Normalized role for routing:', normalizedRole);
      
      // Check if we're already on the correct path for the role
      const isAdminPath = currentPath.startsWith('/admin/');
      const isManagerPath = currentPath.startsWith('/manager/');
      const isSettingsPath = currentPath.startsWith('/settings');
      const isUserPath = (!isAdminPath && !isManagerPath) || isSettingsPath;
      
      // Only redirect if we're on the wrong path
      try {
        if (normalizedRole === 'admin' && !isAdminPath) {
          console.log('⚡ REDIRECTING: Admin user to admin dashboard');
          router.push('/admin/dashboard');
        } else if (normalizedRole === 'manager' && !isManagerPath) {
          console.log('⚡ REDIRECTING: Manager user to manager dashboard');
          router.push('/manager/dashboard');
        } else if (normalizedRole === 'user' && !isUserPath) {
          console.log('⚡ REDIRECTING: Standard user to dashboard');
          router.push('/dashboard');
        } else {
          console.log('✅ User is on the correct path for their role');
        }
      } catch (error) {
        console.error('Navigation error:', error);
      }
    } else {
      console.log('Missing profile data or still loading - cannot redirect');
    }
  }, [profile, isLoading, router, user]);

  if (isLoading && !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900">
        <div className="w-16 h-16 rounded-full border-4 border-[#0089AD] border-t-transparent animate-spin mb-4" />
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-md px-4">
          Preparing your dashboard experience...
        </p>
      </div>
    );
  }
  
  // If we have a user but are still loading profile data, show the normal UI
  // rather than keeping the user stuck on a loading screen
  if (!user) {
    return null;
  }

  // Check if we're in the admin section
  const isAdminSection = window.location.pathname.startsWith('/admin/');

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      {!isAdminSection && (
        <>
          {/* Mobile header */}
          <header className="md:hidden border-b border-gray-100 bg-white sticky top-0 z-30 shadow-sm">
            <div className="px-4 h-16 flex items-center justify-between">
              <div className="flex items-center">
                <MobileNav />
              </div>
            </div>
          </header>

          {/* Desktop sidebar */}
          <aside className="hidden md:block w-64 bg-white border-r border-gray-200 fixed top-0 bottom-0 left-0">
            <div className="h-full flex flex-col p-4">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-6"
              >
                <Image 
                  src="/Cordis Logo.png" 
                  alt="Cordis Logo" 
                  width={150} 
                  height={40} 
                  priority
                  className="w-auto h-auto"
                />
              </motion.div>
              
              {/* User Profile Info */}
              {profile && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="px-4 py-4 mb-5 rounded-xl shadow-[8px_8px_16px_#d9d9d9,-8px_-8px_16px_#ffffff] bg-white"
                >
                  <p className="font-medium text-gray-900">
                    Welcome back,{' '}
                    <span className="text-[#0089AD] font-semibold">
                      {profile.full_name 
                        ? profile.full_name.split(' ')[0] 
                        : profile.email?.split('@')[0] || 'User'}
                    </span>
                  </p>
                  <div className="flex items-center mt-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#0089AD] mr-2"></span>
                    <p className="text-xs text-gray-600 capitalize font-medium">{profile.role || 'user'}</p>
                  </div>
                </motion.div>
              )}
              
              <div className="flex-1 flex flex-col min-h-0">
                <MainNav />
              </div>
            </div>
          </aside>
        </>
      )}

      {/* Main content */}
      <main className={isAdminSection ? 'flex-1' : 'flex-1 md:ml-64'}>
        <div className="max-w-7xl mx-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
