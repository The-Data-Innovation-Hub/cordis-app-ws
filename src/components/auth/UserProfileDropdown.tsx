'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, HelpCircle } from 'lucide-react';
import { SignOutButton } from './SignOutButton';

export function UserProfileDropdown() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get user's initials for avatar
  const getInitials = () => {
    if (!user?.user_metadata?.full_name) return '?';
    return user.user_metadata.full_name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const menuItems = [
    {
      icon: User,
      label: 'Profile',
      href: '/profile',
    },
    {
      icon: Settings,
      label: 'Settings',
      href: '/settings',
    },
    {
      icon: HelpCircle,
      label: 'Help',
      href: '/help',
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center space-x-3 p-2 rounded-xl shadow-[4px_4px_8px_#d9d9d9,-4px_-4px_8px_#ffffff] hover:shadow-[inset_4px_4px_8px_#d9d9d9,inset_-4px_-4px_8px_#ffffff] transition-all focus:outline-none focus:ring-2 focus:ring-[#0089AD] focus:ring-offset-2"
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-[#0089AD] text-white flex items-center justify-center font-medium shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.1)]">
          {getInitials()}
        </div>
        
        {/* Name and Email */}
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-900">
            {user?.user_metadata?.full_name || 'User'}
          </p>
          <p className="text-xs text-gray-500 truncate max-w-[150px]">
            {user?.email}
          </p>
        </div>

        {/* Dropdown Indicator */}
        <svg
          className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-[8px_8px_16px_#d9d9d9,-8px_-8px_16px_#ffffff] overflow-hidden z-50"
          >
            {/* User Info Section */}
            <div className="p-4 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">
                {user?.user_metadata?.full_name || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email}
              </p>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50 focus:text-[#0089AD]"
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              ))}

              {/* Divider */}
              <div className="my-2 border-t border-gray-100" />

              {/* Sign Out Button */}
              <div className="px-2">
                <SignOutButton className="w-full justify-start text-sm" />
              </div>
            </div>

            {/* Neumorphic Inner Shadow Overlay */}
            <div className="absolute inset-0 pointer-events-none rounded-xl shadow-[inset_1px_1px_2px_rgba(0,0,0,0.05)]" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
