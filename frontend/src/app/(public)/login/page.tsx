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
  const [redirectCount, setRedirectCount] = useState(0);

  useEffect(() => {
    // Only attempt redirect if authenticated and not currently loading
    if (isAuthenticated && !isLoading) {
      console.log('Auth state detected: authenticated=true, loading=false');

      if (redirectCount < 3) {
        setRedirectCount((prev) => prev + 1);
        setRedirectAttempted(true);

        const fromPath = searchParams.get('from');
        const destination = fromPath
          ? decodeURIComponent(fromPath)
          : '/dashboard';

        console.log(
          `Attempting redirect #${redirectCount + 1} to: ${destination}`
        );

        setTimeout(() => {
          console.log('Executing router.push to:', destination);
          router.push(destination);

          // Force a navigation to ensure the redirect happens
          setTimeout(() => {
            console.log('Checking if redirect succeeded...');
            window.location.href = destination;
          }, 500);
        }, 300);
      }
    }
  }, [isAuthenticated, isLoading, router, searchParams, redirectCount]);

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
