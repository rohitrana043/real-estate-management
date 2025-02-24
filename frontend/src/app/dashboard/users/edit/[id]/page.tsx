// src/app/dashboard/users/edit/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useParams, useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import UserForm from '@/components/users/UserForm';
import authApi from '@/lib/api/auth';
import { UserDTO } from '@/types/auth';
import { ROLES } from '@/utils/roleUtils';
import { withRoleProtection } from '@/components/auth/withRoleProtection';

function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [user, setUser] = useState<UserDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (!params?.id) {
        setError('User ID is required');
        setLoading(false);
        return;
      }

      try {
        const userData = await authApi.getUserById(Number(params.id));
        setUser(userData);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch user');
        enqueueSnackbar('Failed to load user data', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [params?.id, enqueueSnackbar]);

  const handleSubmit = async (data: UserDTO) => {
    if (!user?.id) return;

    setIsSubmitting(true);
    try {
      const updatedUser = await authApi.updateUser(user.id, data);
      setUser(updatedUser);
      enqueueSnackbar('User updated successfully', { variant: 'success' });
    } catch (err: any) {
      enqueueSnackbar(err.message || 'Failed to update user', {
        variant: 'error',
      });
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.back()}
          sx={{ mb: 2 }}
        >
          Back to Users
        </Button>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Edit User
        </Typography>
      </Box>

      <Paper sx={{ p: 4 }}>
        {user ? (
          <UserForm
            user={user}
            onSubmit={handleSubmit}
            isLoading={isSubmitting}
          />
        ) : (
          <Alert severity="error">User not found</Alert>
        )}
      </Paper>
    </Container>
  );
}

export default withRoleProtection(EditUserPage, [ROLES.ADMIN]);
