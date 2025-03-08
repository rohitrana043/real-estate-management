// src/components/layout/UnsecureLayout.tsx
'use client';

import BaseLayout from './BaseLayout';
import AnnouncementBanner from './AnnouncementBanner';
import Footer from './footer';
import Navbar from './Navbar';

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
