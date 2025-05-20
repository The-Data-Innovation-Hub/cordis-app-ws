'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  
  // No auto-redirect effect - we'll only redirect after explicit login

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    try {
      setIsLoading(true);
      // Clear any previous toasts
      toast.dismiss();
      toast.loading('Authenticating...', { id: 'auth-toast' });
      
      // Attempt to sign in
      const response = await signIn(email.trim(), password.trim());
      
      if (response) {
        // Get the user data from the response
        const { user } = response;
        console.log('User authenticated successfully:', user.email);
        
        // Update the toast to success
        toast.success('Successfully signed in!', {
          id: 'auth-toast',
          description: 'Routing to your dashboard...'
        });

        // Redirect to the router page which will handle role-based redirection
        console.log('LOGIN SUCCESS: Redirecting to router page');
        
        // Short delay to allow the toast to be seen
        setTimeout(() => {
          // Using window.location.href for reliable navigation
          window.location.href = '/router';
        }, 1000);
      } else {
        toast.error('Authentication failed', {
          id: 'auth-toast',
          description: 'Please check your credentials'
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Sign in failed', {
        description: error.message || 'Please check your credentials and try again'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="/auth/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative flex w-full justify-center rounded-lg border-0 bg-[#0089AD] px-5 py-3 text-base font-semibold text-white 
                transition-all duration-200
                hover:bg-[#0089AD]/90
                hover:shadow-[4px_4px_8px_#006f8b,-4px_-4px_8px_#00a3cf]
                active:shadow-[inset_3px_3px_6px_#006f8b,inset_-3px_-3px_6px_#00a3cf]
                focus:outline-none 
                ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>
        
        <div className="text-center text-sm">
          <span className="text-gray-600">Don't have an account? </span>
          <a href="/auth/signup" className="font-medium text-primary-600 hover:text-primary-500">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}
