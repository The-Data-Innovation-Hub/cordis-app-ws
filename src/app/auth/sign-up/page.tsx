'use client';

import { USER_ROLES, type UserRole } from '@/lib/constants/roles';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';

interface SignUpFormData {
  role: UserRole;
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
}

export default function SignUpPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<SignUpFormData>({
    defaultValues: {
      role: USER_ROLES.USER
    }
  });

  const password = watch('password');

  const onSubmit = async (data: SignUpFormData) => {
    setIsSubmitting(true);
    try {
    setError('');

      if (data.password !== data.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      const { error } = await signUp(data.email, data.password, data.fullName, data.role);

      if (error) {
        setError(error.message);
      } else {
        router.push('/auth/verify-email');
      }
    } catch (error) {
      console.error('Error during sign up:', error);
      setError(error instanceof Error ? error.message : 'An error occurred during sign up');
    } finally {
      setIsSubmitting(false);
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
            <UserPlus className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-600 mt-2">Join us today</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              {...register('fullName', { required: 'Full name is required' })}
              type="text"
              className="w-full px-4 py-3 rounded-lg bg-white shadow-[inset_4px_4px_8px_#d9d9d9,inset_-4px_-4px_8px_#ffffff] border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0089AD] focus:border-transparent transition-shadow"
              placeholder="Enter your full name"
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
            )}
          </div>

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

          <div className="space-y-1">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              {...register('role')}
              className="w-full px-4 py-3 rounded-lg bg-white shadow-[inset_4px_4px_8px_#d9d9d9,inset_-4px_-4px_8px_#ffffff] border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0089AD] focus:border-transparent transition-shadow"
            >
              {Object.entries(USER_ROLES).map(([key, value]) => (
                <option key={value} value={value}>
                  {key.charAt(0) + key.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
                  message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
                },
              })}
              type="password"
              className="w-full px-4 py-3 rounded-lg bg-white shadow-[inset_4px_4px_8px_#d9d9d9,inset_-4px_-4px_8px_#ffffff] border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0089AD] focus:border-transparent transition-shadow"
              placeholder="Create a password"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: value => value === password || 'Passwords do not match',
              })}
              type="password"
              className="w-full px-4 py-3 rounded-lg bg-white shadow-[inset_4px_4px_8px_#d9d9d9,inset_-4px_-4px_8px_#ffffff] border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0089AD] focus:border-transparent transition-shadow"
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || Object.keys(errors).length > 0}
            className="w-full py-3 px-4 rounded-lg bg-[#0089AD] text-white font-medium shadow-[4px_4px_8px_#d9d9d9,-4px_-4px_8px_#ffffff] hover:bg-[#006d8a] focus:outline-none focus:ring-2 focus:ring-[#0089AD] focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
          >
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              href="/auth/sign-in"
              className="text-[#0089AD] hover:text-[#006d8a] font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
