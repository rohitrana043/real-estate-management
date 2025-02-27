// src/app/(auth)/forgot-password/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

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
