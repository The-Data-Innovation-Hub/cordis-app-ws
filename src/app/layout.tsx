import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { Toaster } from 'sonner';
import { cn } from '@/lib/utils';

import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: {
    default: 'Cordis',
    template: '%s | Cordis',
  },
  description:
    'A modern web application for data management and visualization.',
  keywords: [
    'data',
    'management',
    'visualization',
    'analytics',
    'dashboard',
  ],
  authors: [
    {
      name: 'Cordis',
      url: 'https://cordis.app',
    },
  ],
  creator: 'Cordis',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://cordis.app',
    title: 'Cordis',
    description: 'A modern web application for data management and visualization.',
    siteName: 'Cordis',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cordis',
    description: 'A modern web application for data management and visualization.',
    creator: '@cordis',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn('min-h-screen bg-background font-sans antialiased', inter.variable)}
        suppressHydrationWarning
      >
        <Providers>
          {children}
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
