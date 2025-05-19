'use client';

import { ThemeProvider } from '@/components/theme-provider';
import { ToastProviderWrapper } from '@/providers/toast-provider';
import { Navbar } from '@/components/navbar';
import { AuthProvider } from '@/contexts/auth-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ToastProviderWrapper>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
        </ToastProviderWrapper>
      </ThemeProvider>
    </AuthProvider>
  );
}
