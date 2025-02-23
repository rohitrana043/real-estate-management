// src/components/layout/ClientRootLayout.tsx
'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { AuthProvider } from '@/contexts/AuthContext';
import UnsecureLayout from './UnsecureLayout';
import SecureLayout from './SecureLayout';
import SettingsDebugger from '@/components/debug/SettingsDebugger';

// Public paths that don't require authentication - KEEP SYNCHRONIZED with middleware.ts and AuthContext.tsx
const publicPaths = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/about',
  '/contact',
  '/services',
  '/properties',
];

export default function ClientRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  // Define which paths require authentication with consistent logic
  const isPublicPath =
    publicPaths.includes(pathname || '') ||
    publicPaths.some(
      (path) => path !== '/' && pathname?.startsWith(`${path}/`)
    ) ||
    pathname === '/properties';

  const isSecurePath =
    !isPublicPath ||
    (pathname?.startsWith('/properties/') && pathname !== '/properties');

  // This is to debug any redirects
  useEffect(() => {
    console.log('ClientRootLayout rendering with pathname:', pathname);
    console.log('isPublicPath:', isPublicPath, 'isSecurePath:', isSecurePath);

    // Debug router redirects
    const originalPush = router.push;
    router.push = function (...args) {
      console.log('Router redirect from ClientRootLayout to:', args[0]);
      return originalPush.apply(this, args);
    };

    return () => {
      router.push = originalPush;
    };
  }, [pathname, isPublicPath, isSecurePath]);

  return (
    <SettingsProvider>
      <AuthProvider>
        {isSecurePath ? (
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
