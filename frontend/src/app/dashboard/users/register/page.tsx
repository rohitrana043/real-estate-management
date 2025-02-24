// src/app/dashboard/users/register/page.tsx
'use client';

import { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Alert,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import UserForm from '@/components/users/UserForm';
import { withRoleProtection } from '@/components/auth/withRoleProtection';
import { ROLES } from '@/utils/roleUtils';
import { useUsers } from '@/hooks/useUsers';
import type { UserDTO } from '@/types/auth';

function AddUserPage() {
  const router = useRouter();
  const { createUser } = useUsers();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: Partial<UserDTO>) => {
    setIsSubmitting(true);
    try {
      await createUser(data);
      router.push('/dashboard/users');
    } catch (error) {
      // Error is handled by the hook
    } finally {
      setIsSubmitting(false);
    }
  };

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
          Add New User
        </Typography>
      </Box>

      <Paper sx={{ p: 4 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          Create a new user account. All users will receive an email with their
          login credentials.
        </Alert>
        <UserForm
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
          onCancel={() => router.back()}
        />
      </Paper>
    </Container>
  );
}

export default withRoleProtection(AddUserPage, [ROLES.ADMIN]);
