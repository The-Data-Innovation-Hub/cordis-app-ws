'use client';

import { ReactNode } from 'react';
import { Sidebar } from '@/components/sidebar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
