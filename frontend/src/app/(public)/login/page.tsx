// src/app/(public)/login/page.tsx
'use client';

import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [redirectAttempted, setRedirectAttempted] = useState(false);

  useEffect(() => {
    // Only redirect if authenticated, not loading, and haven't already attempted redirect
    if (isAuthenticated && !isLoading && !redirectAttempted) {
      setRedirectAttempted(true);

      const fromPath = searchParams.get('from');
      if (fromPath) {
        // Small delay to ensure everything is properly updated before navigation
        setTimeout(() => {
          router.push(decodeURIComponent(fromPath));
        }, 50);
      } else {
        setTimeout(() => {
          router.push('/dashboard');
        }, 50);
      }
    }
  }, [isAuthenticated, isLoading, router, searchParams, redirectAttempted]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isAuthenticated) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
        }}
      >
        <CircularProgress sx={{ mb: 2 }} />
        <Typography>Redirecting you now...</Typography>
      </Box>
    );
  }

  return <LoginForm />;
}
