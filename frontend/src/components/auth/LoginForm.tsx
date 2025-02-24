// src/components/auth/LoginForm.tsx
'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Link as MuiLink,
  InputAdornment,
  IconButton,
  CircularProgress,
  Divider,
  useTheme,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { loginSchema } from '@/lib/validation/auth';
import { LoginDTO } from '@/types/auth';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const theme = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDTO>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginDTO) => {
    setIsSubmitting(true);
    try {
      await login(data);
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
        elevation={theme.palette.mode === 'dark' ? 2 : 1}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 420,
          borderRadius: 3,
          bgcolor: 'background.paper',
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
          sx={{ mb: 4 }}
        >
          Sign in to your account
        </Typography>

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

          <Box sx={{ mt: 2, mb: 3 }}>
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
