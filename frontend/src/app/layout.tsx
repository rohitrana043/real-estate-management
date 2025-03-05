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
