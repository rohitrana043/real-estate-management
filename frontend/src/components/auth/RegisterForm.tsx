// src/components/auth/RegisterForm.tsx
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
  Grid,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { registerSchema } from '@/lib/validation/auth';
import { RegisterDTO } from '@/lib/api/auth';

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registerData } = data;
      await registerUser(registerData);
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
