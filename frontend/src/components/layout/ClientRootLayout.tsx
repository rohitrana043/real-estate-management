// src/components/layout/ClientRootLayout.tsx
'use client';

import React from 'react';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import UnsecureLayout from './UnsecureLayout';
import SettingsDebugger from '@/components/debug/SettingsDebugger';
import SecureLayout from './SecureLayout';
import PersistentAnnouncementBanner from './PersistentAnnouncementBanner';

export default function ClientRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');
  return (
    <SettingsProvider>
      <AuthProvider>
        <PersistentAnnouncementBanner />
        {isDashboard ? (
          <SecureLayout>{children}</SecureLayout>
        ) : (
          <UnsecureLayout>{children}</UnsecureLayout>
        )}
        {/* Debug component - only rendered in development */}
        {process.env.NODE_ENV === 'development' && (
          <React.Suspense fallback={<div />}>
            <SettingsDebugger />
          </React.Suspense>
        )}
      </AuthProvider>
    </SettingsProvider>
  );
}
