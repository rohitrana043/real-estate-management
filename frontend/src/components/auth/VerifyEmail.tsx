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
import { useSearchParams, useRouter } from 'next/navigation';

export default function VerifyEmail() {
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const { verifyEmail, resendVerification } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
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
        setShowSuccess(true);

        // Delay redirect by 3 seconds after successful verification
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } catch (err: any) {
        // More specific error handling
        const errorResponse = err.response?.data;
        // Handle case where response is a string
        const errorMessage =
          typeof errorResponse === 'string'
            ? errorResponse
            : errorResponse?.message;

        if (errorMessage?.toLowerCase().includes('expired')) {
          setError('Verification link has expired. Please request a new one.');
        } else if (errorMessage?.toLowerCase().includes('invalid')) {
          setError(
            'Invalid verification link. Please check your email for the correct link.'
          );
        } else {
          setError(errorMessage || 'Verification failed. Please try again.');
        }

        // Extract email from response if available
        const email =
          typeof errorResponse === 'object' ? errorResponse?.email : null;
        setEmail(email);
        setIsVerifying(false);
      }
    };

    verify();
  }, [token, verifyEmail, router]);

  const handleResendVerification = async () => {
    if (!email) return;

    try {
      await resendVerification(email);
      setError(
        'A new verification email has been sent. Please check your inbox.'
      );
    } catch (err: any) {
      setError('Failed to resend verification email. Please try again later.');
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
        ) : showSuccess ? (
          <Box>
            <Alert severity="success" sx={{ mb: 3 }}>
              Your email has been verified successfully! You will be redirected
              to the login page in 3 seconds.
            </Alert>
            <Button
              variant="contained"
              color="primary"
              href="/login"
              sx={{ mt: 2 }}
            >
              Go to Login Now
            </Button>
          </Box>
        ) : null}
      </Paper>
    </Box>
  );
}
