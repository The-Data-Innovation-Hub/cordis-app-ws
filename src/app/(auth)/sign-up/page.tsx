import { SupabaseAuth } from '@/components/auth/SupabaseAuth';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-[400px] text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Get Started</h1>
        <p className="text-gray-600 dark:text-gray-400">Create your account to begin</p>
      </div>
      <SupabaseAuth view="sign_up" />
    </div>
  );
}
