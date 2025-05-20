'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Settings, Users, BarChart3, Database } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const adminNavItems = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: BarChart3,
  },
  {
    title: 'User Management',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'Data Management',
    href: '/admin/data',
    icon: Database,
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && (!user || profile?.role !== 'admin')) {
      router.push('/auth/sign-in');
    }
  }, [user, profile, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 rounded-full border-4 border-[#0089AD] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user || profile?.role !== 'admin') {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 bg-white border-r border-gray-200"
      >
        <div className="p-6">
          <h2 className="text-lg font-semibold text-[#0089AD]">Admin Panel</h2>
          <p className="text-sm text-gray-500">System Management</p>
        </div>
        <nav className="px-4 pb-6">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors mb-1',
                  isActive
                    ? 'bg-[#0089AD] text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.title}</span>
                {isActive && (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </Link>
            );
          })}
        </nav>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
