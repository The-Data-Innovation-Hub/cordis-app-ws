'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { isAdmin } from '@/lib/supabase/admin';
import { Shield } from 'lucide-react';

export function Navbar() {
  const { session } = useAuth();
  const [isAdminUser, setIsAdminUser] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (session) {
        const adminStatus = await isAdmin();
        setIsAdminUser(adminStatus);
      }
    };

    checkAdminStatus();
  }, [session]);

  return (
    <header className="border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <img 
            src="/Cordis Logo.png" 
            alt="Cordis Logo" 
            className="h-8 w-auto"
          />
        </Link>
        <nav className="flex items-center gap-4">
          {/* Navigation links moved to sidebar */}
          {isAdminUser && (
            <Link
              href="/admin"
              className="flex items-center gap-2 text-sm font-medium text-foreground/60 hover:text-foreground/80 transition-colors"
            >
              <Shield className="h-4 w-4" />
              Admin
            </Link>
          )}
          {/* Authentication handled by the protected layout */}
        </nav>
      </div>
    </header>
  );
}
