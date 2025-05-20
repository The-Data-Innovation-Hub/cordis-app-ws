'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
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
        await router.replace('/auth/sign-in');
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

    // Only proceed if we have profile data and we're not still loading
    if (profile && !isLoading) {
      const currentPath = window.location.pathname;
      console.log('Current path:', currentPath);
      
      // Get the normalized role string regardless of type
      let normalizedRole = 'user'; // Default to user
      
      if (profile.role !== null && profile.role !== undefined) {
        // Convert to string and normalize to lowercase
        normalizedRole = String(profile.role).toLowerCase().trim();
      }
      
      console.log('Normalized role for routing:', normalizedRole);
      
      // Force an immediate redirect based on role
      try {
        if (normalizedRole === 'admin') {
          console.log('⚡ REDIRECTING: Admin user to admin dashboard');
          router.push('/admin/dashboard');
        } else if (normalizedRole === 'manager') {
          console.log('⚡ REDIRECTING: Manager user to manager dashboard');
          router.push('/manager/dashboard');
        } else {
          console.log('⚡ REDIRECTING: Standard user to dashboard');
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Navigation error:', error);
      }
    } else {
      console.log('Missing profile data or still loading - cannot redirect');
    }
  }, [profile, isLoading, router, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 rounded-full border-4 border-[#0089AD] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      {/* Mobile header */}
      <header className="md:hidden border-b border-gray-100 bg-white sticky top-0 z-30 shadow-sm">
        <div className="px-4 h-16 flex items-center justify-between">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-semibold text-[#0089AD]"
          >
            CORDIS
          </motion.h1>
          <div className="flex items-center">
            <MobileNav />
          </div>
        </div>
      </header>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
          <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xl font-semibold text-[#0089AD]"
              >
                CORDIS
              </motion.h1>
            </div>
            
            {/* User Profile Info */}
            {profile && (
              <div className="px-4 py-3 border-b border-gray-100 mb-4">
                <p className="font-medium text-gray-900">
                  Welcome back,{' '}
                  <span className="text-[#0089AD]">
                    {profile.full_name 
                      ? profile.full_name.split(' ')[0] 
                      : profile.email.split('@')[0]}
                  </span>
                </p>
                <p className="text-xs text-gray-500 capitalize">{profile.role}</p>
              </div>
            )}
            
            <div className="mt-2 flex-1 flex flex-col">
              <MainNav />
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Desktop header - Removed empty header */}

        {/* Page content */}
        <main className="flex-1 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {children}
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
