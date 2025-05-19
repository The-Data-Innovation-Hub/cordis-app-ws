import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { DevBanner } from '@/components/dev/DevBanner';
import { DevErrorBoundary } from '@/components/dev/DevErrorBoundary';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Cordis Brand Management',
    template: '%s | Cordis',
  },
  description: 'Modern brand management platform for the digital age',
  keywords: [
    'brand management',
    'digital assets',
    'marketing',
    'brand guidelines',
    'design system',
  ],
  authors: [
    {
      name: 'Cordis Team',
      url: 'https://cordis.example.com',
    },
  ],
  creator: 'Cordis',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://cordis.example.com',
    title: 'Cordis Brand Management',
    description: 'Modern brand management platform for the digital age',
    siteName: 'Cordis',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Cordis Brand Management',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cordis Brand Management',
    description: 'Modern brand management platform for the digital age',
    images: ['/og-image.jpg'],
    creator: '@cordis',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} font-sans`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-screen bg-white font-sans antialiased dark:bg-gray-950">
        <Providers>
          <DevErrorBoundary>
            <DevBanner />
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
                  {process.env.NODE_ENV !== 'production' && (
                    <a
                      href="/dev"
                      className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      Dev Tools
                    </a>
                  )}
                </div>
              </div>
            </footer>
          </DevErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}
