'use client';

import { DevErrorBoundary } from '@/components/dev/DevErrorBoundary';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <DevErrorBoundary>
      <div className="min-h-screen flex flex-col">
        {children}
        <footer className="border-t border-gray-200 py-6 dark:border-gray-800 mt-auto">
          <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 md:text-left">
              &copy; {new Date().getFullYear()} Cordis. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <a
                href="#"
                className="text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              >
                Contact
              </a>
            </div>
          </div>
        </footer>
      </div>
    </DevErrorBoundary>
  );
}
