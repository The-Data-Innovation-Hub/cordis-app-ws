'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';

export default function DevToolsPage() {
  const router = useRouter();
  const { user, profile, signIn, signOut } = useAuth();

  // Redirect to home if in production
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      router.push('/');
    }
  }, [router]);

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const handleSignInAs = async (role: 'admin' | 'user') => {
    try {
      // This is just for development - in a real app, you would have proper test users
      const testUsers = {
        admin: {
          email: 'admin@example.com',
          password: 'password123',
        },
        user: {
          email: 'user@example.com',
          password: 'password123',
        },
      };

      const { error } = await signIn(testUsers[role].email, testUsers[role].password);
      
      if (error) throw error;
      
      router.push('/');
    } catch (error) {
      console.error('Failed to sign in:', error);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Development Tools</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Authentication</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Current User</h3>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                  {user ? (
                    <div>
                      <p className="text-gray-900 dark:text-white">Email: {user.email}</p>
                      <p className="text-gray-900 dark:text-white mt-1">Role: {profile?.role || 'user'}</p>
                      <button
                        onClick={() => signOut()}
                        className="mt-4 w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-600 dark:text-white dark:border-gray-600 dark:hover:bg-gray-500"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <p className="text-gray-900 dark:text-white">Not signed in</p>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Quick Sign In</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handleSignInAs('admin')}
                    className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                  >
                    Sign In as Admin
                  </button>
                  <button
                    onClick={() => handleSignInAs('user')}
                    className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                  >
                    Sign In as User
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Development Tools</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Environment</h3>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md space-y-1">
                  <p className="text-gray-900 dark:text-white">
                    <span className="font-medium">NODE_ENV:</span> {process.env.NODE_ENV}
                  </p>
                  <p className="text-gray-900 dark:text-white">
                    <span className="font-medium">NEXT_PUBLIC_ENV:</span> {process.env.NEXT_PUBLIC_ENV}
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Links</h3>
                <div className="space-y-2">
                  <a
                    href="/admin"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full px-4 py-2 text-sm font-medium text-center text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                  >
                    Admin Dashboard
                  </a>
                  <a
                    href="/api/health"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full px-4 py-2 text-sm font-medium text-center text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                  >
                    API Health Check
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
