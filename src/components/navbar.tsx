'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignInModal } from './auth/SignInModal';
import { SignUpModal } from './auth/SignUpModal';

const routes = [
  {
    name: 'Contact',
    path: '/contact',
  },
];

export function Navbar() {
  const pathname = usePathname();

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
        <nav className="flex items-center space-x-4">
          {routes.map((route) => (
            <Link
              key={route.path}
              href={route.path}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                pathname === route.path
                  ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
            >
              {route.name}
            </Link>
          ))}
          <div className="flex items-center space-x-2">
            <SignInModal />
            <SignUpModal />
          </div>
        </nav>
      </div>
    </header>
  );
}
