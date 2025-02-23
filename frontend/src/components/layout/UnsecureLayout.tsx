// src/components/layout/UnsecureLayout.tsx
'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BaseLayout from './BaseLayout';

export default function UnsecureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BaseLayout>
      <Navbar />
      {children}
      <Footer />
    </BaseLayout>
  );
}
