'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';

interface SupabaseAuthProps {
  view?: 'sign_in' | 'sign_up';
}

export function SupabaseAuth({ view = 'sign_in' }: SupabaseAuthProps) {
  const { signIn, signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (view === 'sign_in') {
        const { error } = await signIn(email, password, rememberMe);
        if (error) throw error;
        toast.success('Successfully signed in!');
      } else {
        const { error } = await signUp(email, password);
        if (error) throw error;
        toast.success('Successfully signed up! Please check your email for verification.');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast.error(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[400px] mx-auto p-6 rounded-xl bg-white dark:bg-gray-800 shadow-[8px_8px_16px_#d9d9d9,-8px_-8px_16px_#ffffff] dark:shadow-[8px_8px_16px_#0f172a,-8px_-8px_16px_#1e293b]">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0089AD] focus:border-transparent transition-shadow"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0089AD] focus:border-transparent transition-shadow"
          />
        </div>

        {view === 'sign_in' && (
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-[#0089AD] focus:ring-[#0089AD] border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Remember me
            </label>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 bg-[#0089AD] hover:bg-[#006d8f] text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {view === 'sign_in' ? 'Signing in...' : 'Signing up...'}
            </span>
          ) : (
            <>{view === 'sign_in' ? 'Sign In' : 'Sign Up'}</>
          )}
        </button>
      </form>
    </div>
  );
              password_label: 'Password',
              button_label: 'Sign Up',
              loading_button_label: 'Signing up...',
              link_text: 'Don\'t have an account? Sign up',
            },
          },
        }}
      />
    </div>
  );
}
