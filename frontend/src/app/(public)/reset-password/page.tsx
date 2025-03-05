// src/app/(auth)/reset-password/page.tsx
'use client';

import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ResetPasswordPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return <ResetPasswordForm />;
}
