// src/components/layout/UnsecureLayout.tsx
'use client';

import Navbar from '@/components/layout/Navbar';
import BaseLayout from './BaseLayout';
import AnnouncementBanner from './AnnouncementBanner';
import Footer from './Footer';

export default function UnsecureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BaseLayout>
      <AnnouncementBanner />
      <Navbar />
      {children}
      <Footer />
    </BaseLayout>
  );
}
