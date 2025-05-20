'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAdmin } from '@/lib/supabase/admin';
import { useToast } from '@/hooks/use-toast';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdmin = async () => {
      const adminStatus = await isAdmin();
      setIsAuthorized(adminStatus);
      setLoading(false);

      if (!adminStatus) {
        toast({
          title: 'Unauthorized',
          description: 'You do not have permission to access this page.',
          variant: 'error',
        });
        router.push('/dashboard');
      }
    };

    checkAdmin();
  }, [router, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0089AD]"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Checking permissions...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
