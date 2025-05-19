'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { User, Mail, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '@/lib/supabase/client';

interface ProfileFormData {
  fullName: string;
  email: string;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    defaultValues: {
      fullName: user?.user_metadata?.full_name || '',
      email: user?.email || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: data.fullName },
      });

      if (error) throw error;

      // Update profile in database
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: data.fullName,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);

      if (profileError) throw profileError;

      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Profile Header */}
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-[#0089AD] text-white flex items-center justify-center text-2xl font-medium shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.1)]">
            {user?.user_metadata?.full_name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-600">Manage your account information</p>
          </div>
        </div>

        {/* Profile Form */}
        <div className="p-6 rounded-2xl shadow-[8px_8px_16px_#d9d9d9,-8px_-8px_16px_#ffffff] bg-white">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('fullName', { required: 'Full name is required' })}
                    type="text"
                    className="w-full pl-10 px-4 py-3 rounded-lg bg-white shadow-[inset_4px_4px_8px_#d9d9d9,inset_-4px_-4px_8px_#ffffff] border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0089AD] focus:border-transparent transition-shadow"
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('email')}
                    type="email"
                    disabled
                    className="w-full pl-10 px-4 py-3 rounded-lg bg-gray-50 shadow-[inset_4px_4px_8px_#d9d9d9,inset_-4px_-4px_8px_#ffffff] border border-gray-100 cursor-not-allowed"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Email cannot be changed
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isUpdating || !isDirty}
              className="w-full py-3 px-4 rounded-lg bg-[#0089AD] text-white font-medium shadow-[4px_4px_8px_#d9d9d9,-4px_-4px_8px_#ffffff] hover:bg-[#006d8a] focus:outline-none focus:ring-2 focus:ring-[#0089AD] focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98] flex items-center justify-center space-x-2"
              whileTap={{ scale: 0.98 }}
            >
              {isUpdating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  <span>Save Changes</span>
                </>
              )}
            </motion.button>
          </form>
        </div>

        {/* Account Info */}
        <div className="p-6 rounded-2xl shadow-[8px_8px_16px_#d9d9d9,-8px_-8px_16px_#ffffff] bg-white">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Account created</span>
              <span className="text-gray-900">
                {new Date(user?.created_at || '').toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Last sign in</span>
              <span className="text-gray-900">
                {new Date(user?.last_sign_in_at || '').toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
