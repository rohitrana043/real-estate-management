// src/app/dashboard/properties/add/page.tsx
'use client';

import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Alert,
  Paper,
  Button,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import PropertyForm from '@/components/properties/PropertyForm';
import { PropertyDTO } from '@/types/property';
import { createProperty } from '@/lib/api/properties';
import Navbar from '@/components/layout/Navbar';

export default function AddPropertyPage() {
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

      // Redirect to the property list or edit page
      router.push(`/dashboard/properties/${newProperty.id}`);
      return newProperty;
    } catch (err: any) {
      console.error('Error creating property:', err);
      setError(err.response?.data?.message || 'Failed to create property');
      return undefined;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Page header */}
        <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 700 }}>
          Add New Property
        </Typography>

        {/* Error message */}
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {/* Property Form */}
        <PropertyForm onSubmit={handleSubmit} isLoading={isSubmitting} />
      </Container>
    </>
  );
}
