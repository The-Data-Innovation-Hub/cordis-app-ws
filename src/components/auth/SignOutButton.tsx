'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SignOutButtonProps {
  variant?: 'default' | 'minimal';
  className?: string;
}

export function SignOutButton({ variant = 'default', className = '' }: SignOutButtonProps) {
  const router = useRouter();
  const { signOut, isLoading } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      router.push('/auth/sign-in');
    }
  };

  // Base styles for both variants
  const baseButtonStyles = 'flex items-center justify-center transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed';
  
  // Variant-specific styles
  const buttonStyles = {
    default: `${baseButtonStyles} px-4 py-2 rounded-lg bg-[#0089AD] text-white font-medium shadow-[4px_4px_8px_#d9d9d9,-4px_-4px_8px_#ffffff] hover:bg-[#006d8a] focus:outline-none focus:ring-2 focus:ring-[#0089AD] focus:ring-offset-2`,
    minimal: `${baseButtonStyles} p-2 rounded-full text-gray-600 hover:text-[#0089AD] shadow-[4px_4px_8px_#d9d9d9,-4px_-4px_8px_#ffffff] hover:shadow-[inset_4px_4px_8px_#d9d9d9,inset_-4px_-4px_8px_#ffffff] focus:outline-none focus:ring-2 focus:ring-[#0089AD] focus:ring-offset-2`
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        disabled={isLoading}
        className={`${buttonStyles[variant]} ${className}`}
      >
        <LogOut className={variant === 'minimal' ? 'w-5 h-5' : 'w-5 h-5 mr-2'} />
        {variant === 'default' && 'Sign Out'}
      </button>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-sm p-6 rounded-2xl shadow-[8px_8px_16px_#d9d9d9,-8px_-8px_16px_#ffffff] bg-white"
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-[#0089AD] rounded-full flex items-center justify-center mb-4 shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.1)]">
                  <LogOut className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Sign Out
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  Are you sure you want to sign out?
                </p>

                <div className="flex space-x-4 w-full">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-medium shadow-[4px_4px_8px_#d9d9d9,-4px_-4px_8px_#ffffff] hover:shadow-[inset_4px_4px_8px_#d9d9d9,inset_-4px_-4px_8px_#ffffff] focus:outline-none focus:ring-2 focus:ring-[#0089AD] focus:ring-offset-2 transition-all transform active:scale-[0.98]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSignOut}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 rounded-lg bg-[#0089AD] text-white font-medium shadow-[4px_4px_8px_#d9d9d9,-4px_-4px_8px_#ffffff] hover:bg-[#006d8a] focus:outline-none focus:ring-2 focus:ring-[#0089AD] focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
                  >
                    {isLoading ? 'Signing out...' : 'Sign Out'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
