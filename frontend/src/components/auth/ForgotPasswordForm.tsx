// src/components/auth/ForgotPasswordForm.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Link as MuiLink,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { AxiosError } from 'axios';

const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
});

type ForgotPasswordData = {
  email: string;
};

export default function ForgotPasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { forgotPassword } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordData>({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordData) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await forgotPassword(data.email);
      setSuccess(true);
    } catch (error) {
      console.error('Password reset request error:', error);

      if (error instanceof AxiosError) {
        if (!error.response) {
          setErrorMessage(
            'Unable to connect to the server. Please check your internet connection or try again later.'
          );
        } else if (error.response.status === 404) {
          // For security reasons, we typically don't want to reveal if an email exists or not
          // Instead we show the success message anyway but log the error
          console.log('Email not found, but showing success for security');
          setSuccess(true);
        } else if (error.response.status >= 500) {
          setErrorMessage(
            'Server error. Please try again later or contact support if the problem persists.'
          );
        } else {
          setErrorMessage(
            error.response.data?.message ||
              'Failed to send reset instructions. Please try again.'
          );
        }
      } else if (error instanceof Error) {
        setErrorMessage(
          error.message || 'An unexpected error occurred. Please try again.'
        );
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseErrorAlert = () => {
    setErrorMessage(null);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
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
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Reset Password
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
          sx={{ mb: 4 }}
        >
          Enter your email address and we'll send you instructions to reset your
          password
        </Typography>

        {errorMessage && (
          <Alert
            severity="error"
            onClose={handleCloseErrorAlert}
            sx={{ mb: 3 }}
          >
            {errorMessage}
          </Alert>
        )}

        {success ? (
          <Box>
            <Alert severity="success" sx={{ mb: 3 }}>
              Password reset instructions have been sent to your email address.
              Please check your inbox and spam folder.
            </Alert>
            <Button
              component={Link}
              href="/login"
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
            >
              Return to Login
            </Button>
          </Box>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              {...register('email')}
              label="Email"
              fullWidth
              margin="normal"
              error={!!errors.email}
              helperText={errors.email?.message}
              autoComplete="email"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isSubmitting}
              sx={{ mt: 3 }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} />
              ) : (
                'Send Reset Instructions'
              )}
            </Button>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Remember your password?{' '}
                <MuiLink component={Link} href="/login">
                  Sign in here
                </MuiLink>
              </Typography>
            </Box>
          </form>
        )}
      </Paper>
    </Box>
  );
}
