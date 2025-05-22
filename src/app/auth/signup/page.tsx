'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Redirect component to maintain backward compatibility
// This redirects from /auth/signup to /auth/sign-up
export default function RedirectToSignUp() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/auth/sign-up');
  }, [router]);

  // Display a loading state during redirect
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-[400px] text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Redirecting...</h1>
        <p className="text-gray-600 dark:text-gray-400">Please wait while we redirect you to the sign-up page</p>
        
        <div className="mt-6 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0089AD]"></div>
        </div>
      </div>
    </div>
  );
}
