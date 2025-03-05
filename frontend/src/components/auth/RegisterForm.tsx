// src/components/auth/RegisterForm.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { registerSchema } from '@/lib/validation/auth';
import { RegisterDTO } from '@/types/auth';
import { yupResolver } from '@hookform/resolvers/yup';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  Link as MuiLink,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AxiosError } from 'axios';

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterDTO & { confirmPassword: string }>({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterDTO & { confirmPassword: string }) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registerData } = data;
      await registerUser(registerData);
    } catch (error) {
      console.error('Registration error:', error);

      // Handle different types of errors
      if (error instanceof AxiosError) {
        if (!error.response) {
          setErrorMessage(
            'Unable to connect to the server. Please check your internet connection or try again later.'
          );
        } else if (error.response.status === 409) {
          setErrorMessage(
            'This email is already registered. Please use a different email or try to log in.'
          );
        } else if (error.response.status >= 500) {
          setErrorMessage(
            'Server error. Please try again later or contact support if the problem persists.'
          );
        } else {
          setErrorMessage(
            error.response.data?.message ||
              'An unexpected error occurred during registration. Please try again.'
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
          maxWidth: 600,
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Create Account
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
          sx={{ mb: 4 }}
        >
          Join our community and start exploring properties
        </Typography>

        {/* Error Alert */}
        {errorMessage && (
          <Alert
            severity="error"
            onClose={handleCloseErrorAlert}
            sx={{ mb: 3 }}
          >
            {errorMessage}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                {...register('name')}
                label="Full Name"
                fullWidth
                error={!!errors.name}
                helperText={errors.name?.message}
                autoComplete="name"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                {...register('email')}
                label="Email"
                fullWidth
                error={!!errors.email}
                helperText={errors.email?.message}
                autoComplete="email"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                {...register('password')}
                label="Password"
                fullWidth
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
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                {...register('confirmPassword')}
                label="Confirm Password"
                fullWidth
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
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                {...register('phone')}
                label="Phone Number (Optional)"
                fullWidth
                error={!!errors.phone}
                helperText={errors.phone?.message}
                autoComplete="tel"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                {...register('address')}
                label="Address (Optional)"
                fullWidth
                error={!!errors.address}
                helperText={errors.address?.message}
                autoComplete="street-address"
                multiline
                rows={2}
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isSubmitting}
            sx={{ mt: 3 }}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'Create Account'}
          </Button>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <MuiLink component={Link} href="/login">
                Sign in here
              </MuiLink>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
