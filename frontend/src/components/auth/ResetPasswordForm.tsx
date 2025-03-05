// src/components/auth/ResetPasswordForm.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { passwordResetSchema } from '@/lib/validation/auth';
import { yupResolver } from '@hookform/resolvers/yup';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link as MuiLink,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { AxiosError } from 'axios';

type ResetPasswordData = {
  password: string;
  confirmPassword: string;
};

export default function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { resetPassword } = useAuth();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordData>({
    resolver: yupResolver(passwordResetSchema),
  });

  const onSubmit = async (data: ResetPasswordData) => {
    if (!token) {
      setError('Reset token is missing');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await resetPassword(token, data.password);
      setSuccess(true);
    } catch (error) {
      console.error('Password reset error:', error);

      if (error instanceof AxiosError) {
        if (!error.response) {
          setError(
            'Unable to connect to the server. Please check your internet connection or try again later.'
          );
        } else if (error.response.status === 400) {
          setError(
            'Invalid or expired reset token. Please request a new password reset link.'
          );
        } else if (error.response.status === 404) {
          setError(
            'Reset token not found. Please request a new password reset link.'
          );
        } else if (error.response.status >= 500) {
          setError(
            'Server error. Please try again later or contact support if the problem persists.'
          );
        } else {
          setError(
            error.response.data?.message ||
              'Failed to reset password. Please try again.'
          );
        }
      } else if (error instanceof Error) {
        setError(
          error.message || 'An unexpected error occurred. Please try again.'
        );
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          p: 2,
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
          <Alert severity="error" sx={{ mb: 3 }}>
            Invalid or missing reset token
          </Alert>
          <Typography variant="body1" sx={{ mb: 3 }}>
            The password reset link you followed is invalid or has expired.
            Please request a new password reset link.
          </Typography>
          <Button
            component={Link}
            href="/forgot-password"
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
          >
            Request New Reset Link
          </Button>
        </Paper>
      </Box>
    );
  }

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
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Reset Your Password
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
          sx={{ mb: 4 }}
        >
          Enter your new password below
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success ? (
          <Box>
            <Alert severity="success" sx={{ mb: 3 }}>
              Your password has been successfully reset.
            </Alert>
            <Button
              component={Link}
              href="/login"
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
            >
              Go to Login
            </Button>
          </Box>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              {...register('password')}
              label="New Password"
              fullWidth
              margin="normal"
              type={showPassword ? 'text' : 'password'}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              {...register('confirmPassword')}
              label="Confirm New Password"
              fullWidth
              margin="normal"
              type={showConfirmPassword ? 'text' : 'password'}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isSubmitting}
              sx={{ mt: 3 }}
            >
              {isSubmitting ? <CircularProgress size={24} /> : 'Reset Password'}
            </Button>
          </form>
        )}
      </Paper>
    </Box>
  );
}
