// src/app/(public)/login/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
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

  return <LoginForm />;
}
