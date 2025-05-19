'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

const routes = [
  {
    href: '/dashboard',
    label: 'Dashboard',
  },
  {
    href: '/analytics',
    label: 'Analytics',
  },
  {
    href: '/brands',
    label: 'Brands',
  },
  {
    href: '/reports',
    label: 'Reports',
  },
  {
    href: '/settings',
    label: 'Settings',
  },
];

export function MainNav() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <img 
              src="/Cordis Logo.png" 
              alt="Cordis Logo" 
              className="h-8 w-auto"
            />
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {routes.map((route) => (
              <Button
                key={route.href}
                asChild
                variant="ghost"
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  pathname === route.href
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-primary'
                )}
              >
                <Link href={route.href}>{route.label}</Link>
              </Button>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-4
        ">
          <ThemeToggle />
          <Button variant="outline" size="sm" className="hidden md:flex">
            Sign In
          </Button>
          <Button size="sm" className="hidden md:flex">
            Get Started
          </Button>
          
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t">
          <div className="container px-4 py-2 space-y-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  'block px-3 py-2 rounded-md text-base font-medium',
                  pathname === route.href
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {route.label}
              </Link>
            ))}
            <div className="pt-2 border-t mt-2">
              <Button variant="outline" className="w-full mb-2">
                Sign In
              </Button>
              <Button className="w-full">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
