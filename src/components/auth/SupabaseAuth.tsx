'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth-context';

type UserRole = 'admin' | 'manager' | 'user';

interface SupabaseAuthProps {
  view?: 'sign_in' | 'sign_up';
}

export function SupabaseAuth({ view: initialView = 'sign_in' }: SupabaseAuthProps) {
  const router = useRouter();
  const { signIn, signUp } = useAuth();
  
  const [view, setView] = useState<'sign_in' | 'sign_up'>(initialView);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (view === 'sign_in') {
        // Handle sign in
        toast.loading('Signing in...', { id: 'auth-toast' });
        
        try {
          const result = await signIn(email, password);
          if (!result) throw new Error('Failed to sign in');
          
          toast.success('Successfully signed in!', { id: 'auth-toast' });
          router.push('/router'); // Use the router page to handle role-based redirects
        } catch (signInError: any) {
          console.error('Sign in error:', signInError);
          
          // Show a more user-friendly error message
          const errorMessage = signInError?.message || 'Failed to sign in';
          toast.error('Sign in failed', { 
            id: 'auth-toast',
            description: errorMessage
          });
          
          throw signInError;
        }
      } else {
        // Handle sign up with full name and role
        toast.loading('Creating your account...', { id: 'auth-toast' });
        
        try {
          // Validate form data
          if (!fullName.trim()) {
            toast.error('Please enter your full name', { id: 'auth-toast' });
            throw new Error('Full name is required');
          }
          
          if (!email.trim()) {
            toast.error('Please enter your email', { id: 'auth-toast' });
            throw new Error('Email is required');
          }
          
          if (password.length < 6) {
            toast.error('Password too short', { 
              id: 'auth-toast',
              description: 'Password must be at least 6 characters long'
            });
            throw new Error('Password must be at least 6 characters long');
          }
          
          // We'll let the signUp function handle the duplicate user check
          // as it already has that logic built in
          
          // Attempt to sign up
          const result = await signUp(email, password, { 
            full_name: fullName.trim(), 
            role: role 
          });
          
          if (!result || !result.user) {
            // Check if we need email verification
            if (result && result.profile) {
              toast.success('Account created successfully!', { 
                id: 'auth-toast',
                description: 'Please check your email to verify your account.'
              });
              
              // Redirect to sign-in page after successful signup
              setTimeout(() => {
                router.push('/sign-in');
              }, 2000);
              
              // Reset form
              setEmail('');
              setPassword('');
              setFullName('');
              return;
            } else {
              throw new Error('Failed to create account');
            }
          }
          
          toast.success('Account created successfully!', { 
            id: 'auth-toast',
            description: 'You can now sign in with your credentials.'
          });
          
          // Redirect to sign-in page after successful signup
          setTimeout(() => {
            router.push('/sign-in');
          }, 2000);
          
          // Reset form
          setEmail('');
          setPassword('');
          setFullName('');
        } catch (signUpError: any) {
          console.error('Sign up error:', signUpError);
          
          // Show a more user-friendly error message
          let errorMessage = 'Failed to create account';
          
          if (signUpError instanceof Error) {
            errorMessage = signUpError.message;
          } else if (typeof signUpError === 'object' && signUpError !== null) {
            if ('message' in signUpError && typeof signUpError.message === 'string') {
              errorMessage = signUpError.message;
            } else if ('error' in signUpError && typeof signUpError.error === 'object' && signUpError.error !== null) {
              if ('message' in signUpError.error && typeof signUpError.error.message === 'string') {
                errorMessage = signUpError.error.message;
              }
            }
          }
          
          toast.error('Sign up failed', { 
            id: 'auth-toast',
            description: errorMessage.includes('already exists') ? 
              'An account with this email already exists. Please sign in instead.' : 
              errorMessage
          });
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred during authentication');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[400px] mx-auto p-6 rounded-xl bg-white shadow-[8px_8px_16px_#d9d9d9,-8px_-8px_16px_#ffffff]">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-black">
          {view === 'sign_in' ? 'Sign in to your account' : 'Create a new account'}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {view === 'sign_in' ? 'Don\'t have an account? ' : 'Already have an account? '}
          <button
            type="button"
            onClick={() => {
              setView(view === 'sign_in' ? 'sign_up' : 'sign_in');
              setError(null);
            }}
            className="font-medium text-[#0089AD] hover:text-[#0089AD]/80 transition-colors cursor-pointer"
          >
            {view === 'sign_in' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {view === 'sign_up' && (
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1)] focus:ring-[#0089AD] focus:border-[#0089AD] transition-shadow"
              placeholder="John Doe"
              required
            />
          </div>
        )}
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1)] focus:ring-[#0089AD] focus:border-[#0089AD] transition-shadow"
            placeholder="your.email@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1)] focus:ring-[#0089AD] focus:border-[#0089AD] transition-shadow"
            placeholder="••••••••"
          />
        </div>

        {view === 'sign_up' && (
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1)] focus:ring-[#0089AD] focus:border-[#0089AD] transition-shadow cursor-pointer"
            >
              <option value="user">User</option>
              <option value="manager">Manager</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
        )}

        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-[8px_8px_16px_#d9d9d9,-8px_-8px_16px_#ffffff] text-white bg-[#0089AD] hover:bg-[#007a9d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0089AD] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              {view === 'sign_in' ? 'Signing in...' : 'Creating account...'}
            </>
          ) : (
            view === 'sign_in' ? 'Sign in' : 'Create account'
          )}
        </button>
      </form>
    </div>
  );
}
