// src/components/auth/VerifyEmail.tsx
'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Button,
  Alert,
} from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchParams } from 'next/navigation';

export default function VerifyEmail() {
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const { verifyEmail, resendVerification } = useAuth();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setError('No verification token provided');
        setIsVerifying(false);
        return;
      }

      try {
        await verifyEmail(token);
        setIsVerifying(false);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Verification failed');
        setEmail(err.response?.data?.email || null);
        setIsVerifying(false);
      }
    };

    verify();
  }, [token, verifyEmail]);

  const handleResendVerification = async () => {
    if (!email) return;

    try {
      await resendVerification(email);
    } catch (err) {
      // Error handling is done in the auth context
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        p: 2,
        bgcolor: 'background.default',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 500,
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
        {isVerifying ? (
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={48} sx={{ mb: 2 }} />
            <Typography variant="h6">Verifying your email...</Typography>
          </Box>
        ) : error ? (
          <Box>
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
            {email && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleResendVerification}
                sx={{ mt: 2 }}
              >
                Resend Verification Email
              </Button>
            )}
          </Box>
        ) : (
          <Box>
            <Alert severity="success" sx={{ mb: 3 }}>
              Your email has been verified successfully!
            </Alert>
            <Button
              variant="contained"
              color="primary"
              href="/login"
              sx={{ mt: 2 }}
            >
              Proceed to Login
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
