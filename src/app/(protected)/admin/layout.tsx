'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronDown, 
  Settings, 
  Users, 
  BarChart3, 
  Shield, 
  Activity, 
  List, 
  Zap,
  Building2,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
}

const adminNavItems: NavItem[] = [
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
    title: 'Company Management',
    href: '/admin/companies',
    icon: Building2,
  },
  {
    title: 'AI Management',
    href: '/admin/ai',
    icon: Zap,
    children: [
      { title: 'Providers', href: '/admin/ai/providers' },
      { title: 'Models', href: '/admin/ai/models' },
      { title: 'API Keys', href: '/admin/ai/keys' },
      { title: 'Usage', href: '/admin/ai/usage' },
    ],
  },
  {
    title: 'System',
    href: '/admin/system',
    icon: Activity,
    children: [
      { title: 'Monitoring', href: '/admin/system/monitoring' },
      { title: 'Logs', href: '/admin/system/logs' },
      { title: 'Backups', href: '/admin/system/backups' },
    ],
  },
  {
    title: 'Security',
    href: '/admin/security',
    icon: Shield,
    children: [
      { title: 'Policies', href: '/admin/security/policies' },
      { title: 'Audit Logs', href: '/admin/security/audit' },
      { title: 'IP Whitelist', href: '/admin/security/ip-whitelist' },
    ],
  },
  {
    title: 'Integrations',
    href: '/admin/integrations',
    icon: List,
  },
  {
    title: 'Waiting List',
    href: '/admin/waiting-list',
    icon: Clock,
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  }
];

interface NavItemProps {
  item: NavItem;
  pathname: string;
}

const NavItem = ({ item, pathname }: NavItemProps) => {
  const [isOpen, setIsOpen] = useState(pathname.startsWith(item.href));
  const hasChildren = item.children && item.children.length > 0;
  const isActive = pathname === item.href || (hasChildren && pathname.startsWith(item.href));
  const Icon = item.icon || (() => null);

  return (
    <div className="mb-1">
      <Link
        href={item.href}
        className={cn(
          'flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors',
          isActive
            ? 'bg-[#0089AD] text-white shadow-lg'
            : 'text-gray-600 hover:bg-gray-100',
          hasChildren ? 'justify-between' : ''
        )}
        onClick={(e) => {
          if (hasChildren) {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5" />
          <span>{item.title}</span>
        </div>
        {hasChildren ? (
          <ChevronDown
            className={cn(
              'w-4 h-4 transition-transform',
              isOpen ? 'transform rotate-180' : ''
            )}
          />
        ) : isActive ? (
          <ChevronRight className="w-4 h-4 ml-auto" />
        ) : null}
      </Link>
      
      {hasChildren && (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="ml-6 mt-1 space-y-1 overflow-hidden"
            >
              {item.children?.map((child) => {
                const isChildActive = pathname === child.href;
                const ChildIcon = child.icon || (() => null);
                
                return (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors',
                      isChildActive
                        ? 'text-[#0089AD] font-medium bg-blue-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    <ChildIcon className="w-4 h-4" />
                    <span>{child.title}</span>
                  </Link>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

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
      router.push('/auth/login');
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
          {adminNavItems.map((item) => (
            <NavItem key={item.href} item={item} pathname={pathname} />
          ))}
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
