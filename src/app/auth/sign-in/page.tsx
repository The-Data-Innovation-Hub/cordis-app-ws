'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';

interface SignInFormData {
  email: string;
  password: string;
}

export default function SignInPage() {
  const router = useRouter();
  const { signIn, isLoading } = useAuth();
  const [error, setError] = useState<string>('');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>();

  const onSubmit = async (data: SignInFormData) => {
    setError('');
    const { error } = await signIn(data.email, data.password);
    if (error) {
      setError(error.message);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 rounded-2xl shadow-[8px_8px_16px_#d9d9d9,-8px_-8px_16px_#ffffff] bg-white"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-[#0089AD] rounded-full flex items-center justify-center mb-4 shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.1)]">
            <LogIn className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              type="email"
              className="w-full px-4 py-3 rounded-lg bg-white shadow-[inset_4px_4px_8px_#d9d9d9,inset_-4px_-4px_8px_#ffffff] border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0089AD] focus:border-transparent transition-shadow"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              {...register('password', { required: 'Password is required' })}
              type="password"
              className="w-full px-4 py-3 rounded-lg bg-white shadow-[inset_4px_4px_8px_#d9d9d9,inset_-4px_-4px_8px_#ffffff] border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0089AD] focus:border-transparent transition-shadow"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between text-sm">
            <Link
              href="/auth/reset-password"
              className="text-[#0089AD] hover:text-[#006d8a] transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-lg bg-[#0089AD] text-white font-medium shadow-[4px_4px_8px_#d9d9d9,-4px_-4px_8px_#ffffff] hover:bg-[#006d8a] focus:outline-none focus:ring-2 focus:ring-[#0089AD] focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              href="/auth/sign-up"
              className="text-[#0089AD] hover:text-[#006d8a] font-medium transition-colors"
            >
              Sign up
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
