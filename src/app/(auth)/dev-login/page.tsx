'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Eye, EyeOff, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';

/**
 * Development-only login page that bypasses Supabase authentication
 * This is used when experiencing the "unexpected_failure" error with status 500
 */
export default function DevLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Please enter both email and password');
      return;
    }

    try {
      setIsLoading(true);
      toast.loading('Authenticating...', { id: 'auth-toast' });
      
      // Check if the user exists in the profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .ilike('email', formData.email.trim().toLowerCase())
        .maybeSingle();
      
      if (profileError) {
        console.error('Error checking profile:', profileError);
        throw new Error('Could not verify user profile');
      }
      
      if (!profileData) {
        toast.error('Authentication failed', {
          id: 'auth-toast',
          description: 'No account found with this email'
        });
        return;
      }
      
      console.log('Found profile:', profileData);
      
      // Create a manual user object
      const manualUser = {
        id: profileData.id,
        email: profileData.email,
        role: profileData.role,
        user_metadata: { role: profileData.role },
        app_metadata: { role: profileData.role },
        email_confirmed_at: new Date().toISOString(),
      };
      
      // Create a manual session
      const manualSession = {
        user: manualUser,
        session: { user: manualUser },
        profile: profileData,
        isManualSession: true,
        timestamp: new Date().toISOString()
      };
      
      // Store in localStorage
      localStorage.setItem('cordis-manual-session', JSON.stringify(manualSession));
      
      console.log('Created manual session:', manualSession);
      
      toast.success('Successfully signed in!', {
        id: 'auth-toast',
        description: 'Routing to your dashboard...'
      });
      
      // Redirect to the appropriate dashboard based on role
      const role = profileData.role?.toLowerCase() || 'user';
      let redirectTo = '/dashboard';
      
      if (role === 'admin') {
        redirectTo = '/admin/dashboard';
      } else if (role === 'manager') {
        redirectTo = '/manager/dashboard';
      }
      
      console.log('DEV LOGIN SUCCESS: Redirecting to', redirectTo);
      
      setTimeout(() => {
        window.location.href = redirectTo;
      }, 1000);
    } catch (error: any) {
      console.error('Dev login error:', error);
      toast.error('Sign in failed', {
        id: 'auth-toast',
        description: error.message || 'An unexpected error occurred'
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
          <h1 className="text-3xl font-bold text-[#0089AD] mb-2">Development Login</h1>
          <div className="flex items-center justify-center gap-2 bg-amber-50 p-3 rounded-lg border border-amber-200 mb-4">
            <AlertTriangle className="text-amber-500" size={20} />
            <p className="text-amber-700 text-sm">
              This page bypasses Supabase auth for local development only
            </p>
          </div>
        </div>

        <form onSubmit={handleManualLogin} className="space-y-6">
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
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="block w-full px-4 py-3 rounded-xl border border-gray-300 shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1)] focus:ring-[#0089AD] focus:border-[#0089AD] transition-shadow"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                className="h-4 w-4 text-[#0089AD] focus:ring-[#0089AD] border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-[5px_5px_10px_rgba(0,0,0,0.1),-5px_-5px_10px_rgba(255,255,255,0.8)] text-white bg-[#0089AD] hover:bg-[#007a9d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0089AD] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        <div className="text-center text-sm">
          <p className="text-gray-600">
            Return to{" "}
            <Link href="/sign-in" className="text-[#0089AD] hover:underline">
              regular sign in
            </Link>
          </p>
        </div>
        
        <div className="text-center mt-4">
          <p className="text-xs text-gray-500">
            Test accounts: admin@example.com / password, test@example.com / password
          </p>
        </div>
      </motion.div>
    </div>
  );
}
