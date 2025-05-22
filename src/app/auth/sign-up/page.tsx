'use client';

import { SupabaseAuth } from '@/components/auth/SupabaseAuth';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white">
      <div 
        className="w-full max-w-[400px] space-y-8 animate-fadeIn"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#0089AD] mb-2">Get Started</h1>
          <p className="text-gray-600">Create your account to begin</p>
        </div>
        <SupabaseAuth view="sign_up" />
      </div>
    </div>
  );
}
