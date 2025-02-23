// src/app/dashboard/users/register/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Container, Paper, Typography, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import SecureRegisterForm from '@/components/auth/SecureRegisterForm';
import authApi from '@/lib/api/auth';

export default function SecureRegisterPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const hasAccess = await authApi.checkAdminAccess();
        setIsAuthorized(hasAccess);
        if (!hasAccess) {
          router.push('/dashboard');
        }
      } catch (error) {
        router.push('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthorization();
  }, [router]);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <Container component="main" maxWidth="md">
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mt: 4,
          borderRadius: 2,
          bgcolor: 'background.paper',
        }}
      >
        <SecureRegisterForm />
      </Paper>
    </Container>
  );
}
