'use client';

import { useAuth } from '@/contexts/auth-context';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function SignInPage() {
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Attempting sign in...');
      const response = await signIn(formData.email, formData.password);
      console.log('Sign in response:', response);
      
      if (response) {
        toast.success('Successfully signed in!', {
          description: 'Redirecting you to your dashboard...'
        });
        console.log('User authenticated. Waiting for redirection...');
      } else {
        toast.error('Failed to sign in');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Sign in error:', error);
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
            <input
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="mt-1 block w-full px-4 py-3 rounded-xl border border-gray-300 shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1)] focus:ring-[#0089AD] focus:border-[#0089AD] transition-shadow"
              placeholder="Enter your password"
            />
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
      </motion.div>
    </div>
  );
}
