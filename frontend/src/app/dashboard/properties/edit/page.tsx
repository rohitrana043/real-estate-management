// src/app/dashboard/properties/edit/page.tsx
'use client';

import { useState } from 'react';
import { Container, Typography, Box, Button, Alert } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import PropertySearchForm from '@/components/properties/PropertySearchForm';
import PropertyForm from '@/components/properties/PropertyForm';
import { updateProperty } from '@/lib/api/properties';
import { PropertyDTO } from '@/types/property';
import { withRoleProtection } from '@/components/auth/withRoleProtection';
import { ROLES } from '@/utils/roleUtils';

function EditPropertyPage() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [selectedProperty, setSelectedProperty] = useState<PropertyDTO | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePropertyFound = (property: PropertyDTO) => {
    setSelectedProperty(property);
  };

  const handleSubmit = async (data: PropertyDTO) => {
    if (!selectedProperty?.id) return undefined;

    setIsSubmitting(true);
    try {
      const updatedProperty = await updateProperty(selectedProperty.id, data);
      setSelectedProperty(updatedProperty);
      enqueueSnackbar('Property updated successfully', { variant: 'success' });
      return updatedProperty;
    } catch (err: any) {
      enqueueSnackbar(
        err.response?.data?.message || 'Failed to update property',
        {
          variant: 'error',
        }
      );
      throw err;
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
          Edit Property
        </Typography>
      </Box>

      <PropertySearchForm onPropertyFound={handlePropertyFound} />

      {selectedProperty ? (
        <PropertyForm
          initialData={selectedProperty}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />
      ) : (
        <Alert severity="info" sx={{ mt: 2 }}>
          Search for a property to edit its details
        </Alert>
      )}
    </Container>
  );
}

export default withRoleProtection(EditPropertyPage, [ROLES.ADMIN, ROLES.AGENT]);
