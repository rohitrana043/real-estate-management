// src/components/auth/ForgotPasswordForm.tsx
'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Link as MuiLink,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

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
    try {
      await forgotPassword(data.email);
      setSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
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

        {success ? (
          <Box>
            <Alert severity="success" sx={{ mb: 3 }}>
              Password reset instructions have been sent to your email address.
              Please check your inbox.
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
