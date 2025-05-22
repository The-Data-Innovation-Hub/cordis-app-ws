'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { ArrowLeft, Settings as SettingsIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import type { AdminSettings } from '@/types/admin-settings';
import { Switch } from '@/components/ui/switch';

const DEFAULT_SETTINGS_ID = '00000000-0000-0000-0000-000000000000';

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { register, handleSubmit, setValue, watch } = useForm<AdminSettings>();

  // Watch values for real-time updates
  const ipWhitelistEnabled = watch('ip_whitelist_enabled');
  const requireTwoFactor = watch('require_two_factor');

  useEffect(() => {
    const loadSettings = async () => {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .eq('id', DEFAULT_SETTINGS_ID)
        .single();

      if (error) {
        toast.error('Failed to load settings');
        return;
      }

      if (data) {
        Object.entries(data).forEach(([key, value]) => {
          if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === null || Array.isArray(value)) {
            setValue(key as keyof AdminSettings, value);
          }
        });
      }
      setIsLoading(false);
    };

    loadSettings();
  }, [setValue, supabase]);

  const onSubmit = async (data: AdminSettings) => {
    setIsLoading(true);
    const { error } = await supabase
      .from('admin_settings')
      .update(data)
      .eq('id', DEFAULT_SETTINGS_ID);

    if (error) {
      toast.error('Failed to update settings');
    } else {
      toast.success('Settings updated successfully');
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link 
            href="/admin"
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-[#0089AD] text-white flex items-center justify-center shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.1)]">
              <SettingsIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600">Manage platform settings and configurations</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Password Policy */}
          <div className="p-6 rounded-2xl shadow-[8px_8px_16px_#d9d9d9,-8px_-8px_16px_#ffffff] bg-white">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Password Policy</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Length
                </label>
                <input
                  type="number"
                  {...register('password_min_length')}
                  className="w-full px-4 py-2 rounded-lg bg-white shadow-[inset_4px_4px_8px_#d9d9d9,inset_-4px_-4px_8px_#ffffff] border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0089AD]"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Require Numbers & Symbols
                </label>
                <Switch
                  checked={watch('password_require_numbers_symbols')}
                  onCheckedChange={(checked) => setValue('password_require_numbers_symbols', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Require Two-Factor Authentication
                </label>
                <Switch
                  checked={requireTwoFactor}
                  onCheckedChange={(checked) => setValue('require_two_factor', checked)}
                />
              </div>
            </div>
          </div>

          {/* Two-Factor Authentication */}
          <div className="p-6 rounded-2xl shadow-[8px_8px_16px_#d9d9d9,-8px_-8px_16px_#ffffff] bg-white">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">IP Whitelist</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Enable IP Whitelist
                  </label>
                  <p className="text-sm text-gray-500">
                    Specify IP addresses that are allowed to access the admin panel
                  </p>
                </div>
                <Switch
                  checked={ipWhitelistEnabled}
                  onCheckedChange={(checked) => setValue('ip_whitelist_enabled', checked)}
                />
              </div>

              {ipWhitelistEnabled && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Allowed IP Addresses
                  </label>
                  <textarea
                    {...register('ip_whitelist')}
                    placeholder="Enter IP addresses, one per line"
                    className="w-full px-4 py-2 rounded-lg bg-white shadow-[inset_4px_4px_8px_#d9d9d9,inset_-4px_-4px_8px_#ffffff] border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0089AD]"
                    rows={4}
                  />
                </div>
              )}
            </div>
          </div>

          {/* AI Configuration */}
          <div className="p-6 rounded-2xl shadow-[8px_8px_16px_#d9d9d9,-8px_-8px_16px_#ffffff] bg-white">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Configuration</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  AI Model
                </label>
                <select
                  {...register('ai_model')}
                  className="w-full px-4 py-2 rounded-lg bg-white shadow-[inset_4px_4px_8px_#d9d9d9,inset_-4px_-4px_8px_#ffffff] border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0089AD]"
                >
                  <option value="GPT-4">GPT-4</option>
                  <option value="GPT-3.5">GPT-3.5</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key
                </label>
                <input
                  type="password"
                  {...register('ai_api_key')}
                  className="w-full px-4 py-2 rounded-lg bg-white shadow-[inset_4px_4px_8px_#d9d9d9,inset_-4px_-4px_8px_#ffffff] border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0089AD]"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-lg bg-[#0089AD] text-white font-medium shadow-[4px_4px_8px_#d9d9d9,-4px_-4px_8px_#ffffff] hover:bg-[#006d8a] focus:outline-none focus:ring-2 focus:ring-[#0089AD] focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? 'Saving...' : 'Save Settings'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
