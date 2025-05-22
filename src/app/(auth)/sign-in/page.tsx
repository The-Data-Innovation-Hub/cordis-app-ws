'use client';

import { useAuth } from '@/contexts/auth-context';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function SignInPage() {
  const { signIn } = useAuth();

  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  useEffect(() => {
    const message = searchParams.get('message');
    if (message === 'verification_email_sent') {
      toast.success('Verification email sent', {
        description: 'Please check your inbox and follow the link to verify your email.'
      });
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Please enter both email and password');
      return;
    }

    try {
      setIsLoading(true);
      toast.loading('Authenticating...', { id: 'auth-toast' });
      
      // Try regular sign in first
      try {
        const response = await signIn(formData.email.trim(), formData.password.trim());
        
        if (response) {
          const { user } = response;
          console.log('User authenticated successfully:', user.email);
          
          toast.success('Successfully signed in!', {
            id: 'auth-toast',
            description: 'Routing to your dashboard...'
          });

          const redirectTo = searchParams.get('redirectedFrom') || '/router';
          console.log('LOGIN SUCCESS: Redirecting to', redirectTo);
          
          setTimeout(() => {
            window.location.href = redirectTo;
          }, 1000);
          return;
        }
      } catch (signInError: any) {
        console.error('Regular sign in failed, trying manual authentication:', signInError);
        
        // If regular sign in fails with unexpected_failure, try manual authentication
        if (signInError?.message?.includes('unexpected_failure') || 
            (signInError?.status === 500 && signInError?.code === 'unexpected_failure')) {
          
          try {
            // Import the auth helper directly
            const { loginWithEmail } = await import('@/lib/supabase/auth-helper');
            
            // Check if the email matches one of our test users
            const email = formData.email.trim().toLowerCase();
            const password = formData.password.trim();
            
            console.log('Attempting manual authentication for:', email);
            
            // Try to authenticate with our helper
            const manualResponse = await loginWithEmail(email, password);
            
            if (manualResponse.success) {
              console.log('Manual authentication successful:', manualResponse);
              
              toast.success('Successfully signed in!', {
                id: 'auth-toast',
                description: 'Routing to your dashboard...'
              });
              
              const redirectTo = searchParams.get('redirectedFrom') || '/router';
              console.log('MANUAL LOGIN SUCCESS: Redirecting to', redirectTo);
              
              setTimeout(() => {
                window.location.href = redirectTo;
              }, 1000);
              return;
            } else {
              throw new Error('Manual authentication failed');
            }
          } catch (manualError) {
            console.error('Manual authentication failed:', manualError);
            throw manualError;
          }
        } else {
          // Re-throw the original error if it's not an unexpected_failure
          throw signInError;
        }
      }
      
      // If we get here, both authentication methods failed
      toast.error('Authentication failed', {
        id: 'auth-toast',
        description: 'Please check your credentials'
      });
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Sign in failed', {
        id: 'auth-toast',
        description: error.message || 'Please check your credentials and try again'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[400px] space-y-8"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#0089AD] mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 block w-full px-4 py-3 rounded-xl border border-gray-300 shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1)] focus:ring-[#0089AD] focus:border-[#0089AD] transition-shadow"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative mt-1">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="block w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1)] focus:ring-[#0089AD] focus:border-[#0089AD] transition-shadow"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3
                           text-gray-400 hover:text-[#0089AD] focus:text-[#0089AD] focus:outline-none cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
                <span className="sr-only">
                  {showPassword ? 'Hide password' : 'Show password'}
                </span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                className="h-4 w-4 text-[#0089AD] focus:ring-[#0089AD] border-gray-300 rounded cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <Link
                href="/auth/forgot-password"
                className="font-medium text-[#0089AD] hover:text-[#0089AD]/80 transition-colors"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-[8px_8px_16px_#d9d9d9,-8px_-8px_16px_#ffffff] text-white bg-[#0089AD] hover:bg-[#007a9d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0089AD] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/auth/sign-up" className="font-medium text-[#0089AD] hover:text-[#0089AD]/80 transition-colors">
              Sign up here
            </Link>
          </p>
        </div>

        <div className="text-center mt-4">
          <p className="text-xs text-gray-500">
            Test accounts: admin@example.com / password, test@example.com / password
          </p>
        </div>
        
        {process.env.NODE_ENV !== 'production' && (
          <div className="text-center mt-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-center gap-2 mb-1">
              <AlertTriangle className="text-amber-500" size={16} />
              <p className="text-xs font-medium text-gray-700">
                Having authentication issues?
              </p>
            </div>
            <p className="text-xs text-gray-600">
              Try the{" "}
              <Link href="/dev-login" className="text-[#0089AD] hover:underline font-medium">
                Development Login
              </Link>
              {" "}that bypasses Supabase auth
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
