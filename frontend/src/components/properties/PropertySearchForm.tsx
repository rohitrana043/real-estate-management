// src/components/properties/PropertySearchForm.tsx
'use client';

import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { getProperty } from '@/lib/api/properties';
import { PropertyDTO } from '@/types/property';

interface PropertySearchFormProps {
  onPropertyFound: (property: PropertyDTO) => void;
}

export default function PropertySearchForm({
  onPropertyFound,
}: PropertySearchFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: { propertyId: string }) => {
    setLoading(true);
    setError(null);

    try {
      const propertyId = parseInt(data.propertyId);
      if (isNaN(propertyId)) {
        throw new Error('Please enter a valid property ID');
      }

      const property = await getProperty(propertyId);
      onPropertyFound(property);
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || 'Failed to find property'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Search Property by ID
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}
      >
        <TextField
          {...register('propertyId', { required: 'Property ID is required' })}
          label="Property ID"
          variant="outlined"
          error={!!errors.propertyId}
          helperText={errors.propertyId?.message as string}
          size="small"
          sx={{ flexGrow: 1 }}
        />
        <Button
          type="submit"
          variant="contained"
          startIcon={
            loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <SearchIcon />
            )
          }
          disabled={loading}
        >
          Search
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Paper>
  );
}
