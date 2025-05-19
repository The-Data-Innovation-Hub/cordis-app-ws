'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 rounded-2xl shadow-[8px_8px_16px_#d9d9d9,-8px_-8px_16px_#ffffff] bg-white text-center"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-[#0089AD] rounded-full flex items-center justify-center mb-4 shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.1)]">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Verify Your Email</h1>
          <p className="text-gray-600 mt-4 max-w-sm">
            We've sent you an email with a verification link. Please check your inbox and click the link to verify your account.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Didn't receive the email? Check your spam folder or{' '}
            <Link
              href="/auth/sign-up"
              className="text-[#0089AD] hover:text-[#006d8a] font-medium transition-colors"
            >
              try signing up again
            </Link>
          </p>

          <div className="pt-4">
            <Link
              href="/auth/sign-in"
              className="text-[#0089AD] hover:text-[#006d8a] font-medium transition-colors"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
