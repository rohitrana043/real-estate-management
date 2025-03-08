// src/components/auth/LoginForm.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { loginSchema } from '@/lib/validation/auth';
import { LoginDTO } from '@/types/auth';
import { yupResolver } from '@hookform/resolvers/yup';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Link as MuiLink,
  Paper,
  Snackbar,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import DemoCredentials from '@/components/auth/DemoCredentials';
import { AxiosError } from 'axios';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [credentialsExpanded, setCredentialsExpanded] = useState(false);
  const { login } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginDTO>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginDTO) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await login(data);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (!error.response) {
          setErrorMessage(
            'Unable to connect to the server. Please check your internet connection or try again later.'
          );
        } else if (error.response.status === 401) {
          setErrorMessage('Invalid email or password. Please try again.');
        } else if (error.response.status === 403) {
          setErrorMessage('Your account is disabled. Please contact support.');
        } else if (error.response.status >= 500) {
          setErrorMessage(
            'Server error. Please try again later or contact support if the problem persists.'
          );
        } else {
          setErrorMessage(
            error.response.data?.message ||
              'An unexpected error occurred. Please try again.'
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

  const handleUseCredentials = (email: string, password: string) => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', password, { shouldValidate: true });
  };

  const handleCloseErrorAlert = () => {
    setErrorMessage(null);
  };

  const handleCredentialsToggle = (expanded: boolean) => {
    setCredentialsExpanded(expanded);
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
        elevation={theme.palette.mode === 'dark' ? 2 : 1}
        sx={{
          p: { xs: 3, sm: 4 },
          width: '100%',
          maxWidth: credentialsExpanded && !isMobile ? 700 : 420,
          borderRadius: 3,
          bgcolor: 'background.paper',
          transition: 'max-width 0.3s ease-in-out',
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          align="center"
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            mb: 1,
          }}
        >
          Welcome Back
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
          sx={{ mb: 3 }}
        >
          Sign in to your account
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
          <TextField
            {...register('email')}
            label="Email"
            fullWidth
            margin="normal"
            error={!!errors.email}
            helperText={errors.email?.message}
            autoComplete="email"
            sx={{ mb: 2 }}
          />

          <TextField
            {...register('password')}
            label="Password"
            fullWidth
            type={showPassword ? 'text' : 'password'}
            error={!!errors.password}
            helperText={errors.password?.message}
            autoComplete="current-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ mt: 2, mb: 2 }}>
            <Button
              component={Link}
              href="/forgot-password"
              variant="text"
              sx={{
                p: 0,
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                  background: 'none',
                },
              }}
            >
              Forgot password?
            </Button>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isSubmitting}
            sx={{
              py: 1.5,
              fontSize: '1rem',
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none',
              },
            }}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>

          {/* Demo Credentials Section */}
          <DemoCredentials
            onUseCredentials={handleUseCredentials}
            onToggle={handleCredentialsToggle}
          />

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ px: 1 }}>
              OR
            </Typography>
          </Divider>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <MuiLink
                component={Link}
                href="/register"
                sx={{
                  color: 'primary.main',
                  textDecoration: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Sign up here
              </MuiLink>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
