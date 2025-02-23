// src/components/auth/SecureRegisterForm.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Grid,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import type { SecureRegisterCredentials } from '@/types/auth';
import { secureRegisterSchema } from '@/lib/validation/auth';
import authApi from '@/lib/api/auth';

// Define the form data type to match the validation schema
type FormInputs = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: 'ADMIN' | 'AGENT';
  adminCode?: string;
  agencyName?: string;
  licenseNumber?: string;
};

export default function SecureRegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: yupResolver(secureRegisterSchema),
    defaultValues: {
      role: 'AGENT',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: FormInputs) => {
    try {
      setIsLoading(true);
      setError(null);

      // Convert form data to SecureRegisterCredentials
      const registerData: SecureRegisterCredentials = {
        ...data,
        phoneNumber: data.phoneNumber || undefined,
        adminCode: data.adminCode,
        agencyName: data.agencyName,
        licenseNumber: data.licenseNumber,
      };

      const response = await authApi.registerSecure(registerData);
      enqueueSnackbar('Registration successful!', { variant: 'success' });
      router.push('/dashboard/users');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
      enqueueSnackbar('Registration failed', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{ mt: 1 }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Register New Admin/Agent
          </Typography>
        </Grid>

        {error && (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}

        <Grid item xs={12} sm={6}>
          <TextField
            {...register('firstName')}
            required
            fullWidth
            label="First Name"
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            {...register('lastName')}
            required
            fullWidth
            label="Last Name"
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            {...register('email')}
            required
            fullWidth
            label="Email Address"
            autoComplete="email"
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            {...register('password')}
            required
            fullWidth
            label="Password"
            type="password"
            error={!!errors.password}
            helperText={errors.password?.message}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            {...register('phoneNumber')}
            fullWidth
            label="Phone Number"
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber?.message}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            {...register('role')}
            select
            required
            fullWidth
            label="Role"
            defaultValue="AGENT"
            error={!!errors.role}
            helperText={errors.role?.message}
          >
            <MenuItem value="ADMIN">Admin</MenuItem>
            <MenuItem value="AGENT">Agent</MenuItem>
          </TextField>
        </Grid>

        {selectedRole === 'ADMIN' && (
          <Grid item xs={12}>
            <TextField
              {...register('adminCode')}
              required
              fullWidth
              label="Admin Security Code"
              type="password"
              error={!!errors.adminCode}
              helperText={errors.adminCode?.message}
            />
          </Grid>
        )}

        {selectedRole === 'AGENT' && (
          <>
            <Grid item xs={12}>
              <TextField
                {...register('agencyName')}
                required
                fullWidth
                label="Agency Name"
                error={!!errors.agencyName}
                helperText={errors.agencyName?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register('licenseNumber')}
                required
                fullWidth
                label="License Number"
                error={!!errors.licenseNumber}
                helperText={errors.licenseNumber?.message}
              />
            </Grid>
          </>
        )}

        <Grid item xs={12}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isLoading}
            sx={{ mt: 2 }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Register'
            )}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
