// src/app/dashboard/properties/add/page.tsx
'use client';

import { withRoleProtection } from '@/components/auth/withRoleProtection';
import PropertyForm from '@/components/properties/PropertyForm';
import { createProperty } from '@/lib/api/properties';
import { PropertyDTO } from '@/types/property';
import { ROLES } from '@/utils/roleUtils';
import { ArrowBack } from '@mui/icons-material';
import { Alert, Box, Button, Container, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

function AddPropertyPage() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (
    data: PropertyDTO
  ): Promise<PropertyDTO | undefined> => {
    setIsSubmitting(true);
    setError(null);

    try {
      const newProperty = await createProperty(data);
      enqueueSnackbar('Property created successfully', { variant: 'success' });

      // Redirect to the property edit page to allow further image management
      router.push(`/dashboard/properties/edit?id=${newProperty.id}`);
      return newProperty;
    } catch (err: any) {
      console.error('Error creating property:', err);
      setError(err.response?.data?.message || 'Failed to create property');
      enqueueSnackbar(error || 'Failed to create property', {
        variant: 'error',
      });
      return undefined;
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
          Back to Properties
        </Button>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Add New Property
        </Typography>
      </Box>

      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {/* Property Form */}
      <PropertyForm onSubmit={handleSubmit} isLoading={isSubmitting} />
    </Container>
  );
}

export default withRoleProtection(AddPropertyPage, [ROLES.ADMIN, ROLES.AGENT]);
