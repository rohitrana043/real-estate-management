// src/app/(auth)/forgot-password/page.tsx
'use client';

import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function ForgotPasswordPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isAuthenticated) {
      const fromPath = searchParams.get('from');
      if (fromPath) {
        router.replace(fromPath);
        return;
      }

      router.replace('/dashboard');
    }
  }, [isAuthenticated, router, searchParams]);

  return <ForgotPasswordForm />;
}
