'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Users, Settings, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  roles?: string[];
}

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { profile } = useAuth();
  const pathname = usePathname();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

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

  const filteredNavItems = navItems.filter(
    (item) => !item.roles || (profile?.role && item.roles.includes(profile.role.toLowerCase()))
  );

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0089AD] focus:ring-offset-2"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="fixed inset-y-0 left-0 w-64 bg-white z-50 shadow-xl overflow-y-auto"
            >
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-semibold text-[#0089AD]">Menu</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                {profile && (
                  <div className="pt-3 border-t border-gray-100 mt-2 p-3 rounded-lg shadow-[inset_4px_4px_8px_rgba(0,0,0,0.05),inset_-4px_-4px_8px_rgba(255,255,255,0.1)]">
                    <p className="font-medium text-gray-900">
                      Welcome back,{' '}
                      <span className="text-[#0089AD] font-semibold">
                        {profile.full_name 
                          ? profile.full_name.split(' ')[0] 
                          : profile.email?.split('@')[0] || 'User'}
                      </span>
                    </p>
                    <div className="flex items-center mt-1">
                      <span className="inline-block w-2 h-2 rounded-full bg-[#0089AD] mr-2"></span>
                      <p className="text-xs text-gray-600 capitalize font-medium">{profile.role || 'user'}</p>
                    </div>
                  </div>
                )}
              </div>
              <nav className="p-4 space-y-1">
                {filteredNavItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center px-3 py-2 text-sm font-medium rounded-md',
                        isActive
                          ? 'bg-[#0089AD]/10 text-[#0089AD]'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      )}
                    >
                      <span className="mr-3">
                        {item.icon}
                      </span>
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
