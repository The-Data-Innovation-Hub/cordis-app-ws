'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';
import { Home, Users, Settings, Shield, LogOut } from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  roles?: string[];
}

export function MainNav() {
  const { profile, signOut } = useAuth();
  const pathname = usePathname();

  // Define navigation items with role-based visibility
  const navItems: NavItem[] = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: 'Team',
      href: '/team',
      icon: <Users className="h-5 w-5" />,
      roles: ['admin', 'manager'],
    },
    {
      name: 'Admin',
      href: '/admin',
      icon: <Shield className="h-5 w-5" />,
      roles: ['admin'],
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: <Settings className="h-5 w-5" />,
      roles: ['admin'],
    },
    {
      name: 'User Settings',
      href: '/settings',
      icon: <Settings className="h-5 w-5" />,
      roles: ['user'],
    },
  ];

  // Debug logging for profile and roles
  console.log('Current profile:', {
    profile,
    role: profile?.role,
    isAdmin: profile?.role === 'admin'
  });

  // Filter navigation items based on user role
  const filteredNavItems = navItems.filter((item) => {
    const hasAccess = !item.roles || (profile?.role && item.roles.includes(profile.role.toLowerCase()));
    
    // Debug logging for each restricted item
    if (item.roles) {
      console.log(`Menu item ${item.name}:`, {
        requiredRoles: item.roles,
        userRole: profile?.role,
        hasAccess
      });
    }
    
    return hasAccess;
  });

  // Debug logging for settings menu item visibility
  const userSettings = filteredNavItems.find(item => item.name === 'Settings' && item.roles?.includes('user'));
  console.log('Settings menu item for user:', userSettings);

  return (
    <nav className="flex flex-col h-full">
      <div className="flex-grow flex flex-col space-y-1">
      {filteredNavItems.map((item) => {
        const isActive = pathname?.startsWith(item.href) && item.href !== '/' || pathname === item.href;
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
              isActive
                ? 'bg-[#0089AD]/10 text-[#0089AD]'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
              'relative overflow-hidden'
            )}
          >
            <div className="flex items-center">
              <span className={cn(
                'mr-3',
                isActive ? 'text-[#0089AD]' : 'text-gray-400 group-hover:text-gray-600'
              )}>
                {item.icon}
              </span>
              {item.name}
            </div>
            {isActive && (
              <motion.div
                layoutId="activeNavItem"
                className="absolute right-0 top-0 bottom-0 w-1 bg-[#0089AD] rounded-l-full"
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 30,
                }}
              />
            )}
          </Link>
        );
      })}
      </div>
      
      {/* Logout button */}
      <button
        onClick={() => {
          signOut();
          toast.success('Logged out successfully');
        }}
        className="group flex items-center px-4 py-3 mt-4 text-sm font-medium rounded-lg transition-colors
                   text-red-600 hover:bg-red-50"
      >
        <span className="mr-3 text-red-400 group-hover:text-red-600">
          <LogOut className="h-5 w-5" />
        </span>
        Logout
      </button>
    </nav>
  );
}
