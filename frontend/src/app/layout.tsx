// src/app/layout.tsx
import ClientRootLayout from '@/components/layout/ClientRootLayout';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

// Initialize font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Real Estate Management',
  description:
    'Find your dream property with our comprehensive real estate platform',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16' },
      { url: '/favicon-32x32.png', sizes: '32x32' },
    ],
    apple: { url: '/apple-touch-icon.png' },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <ClientRootLayout>{children}</ClientRootLayout>
      </body>
    </html>
  );
}
