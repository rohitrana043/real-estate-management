// src/app/dashboard/favorites/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Pagination,
  Paper,
  Button,
  Card,
  CardMedia,
  CardContent,
  Divider,
  Chip,
} from '@mui/material';
import {
  BedOutlined,
  BathtubOutlined,
  SquareFootOutlined,
  LocationOnOutlined,
  FavoriteOutlined,
  HomeOutlined,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import favoritesApi from '@/lib/api/favorites';
import { useSnackbar } from 'notistack';
import Link from 'next/link';
import FavoriteButton from '@/components/properties/FavoriteButton';
import { PropertyDTO } from '@/types/property';

export default function FavoritesPage() {
  const { isAuthenticated } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [properties, setProperties] = useState<PropertyDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProperties, setTotalProperties] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      setError('Please log in to view your favorites');
      setLoading(false);
      return;
    }

    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const response = await favoritesApi.getFavoriteProperties(page - 1, 6);
        setProperties(response.content);
        setTotalPages(response.totalPages);
        setTotalProperties(response.totalElements);
      } catch (err: any) {
        console.error('Error fetching favorites:', err);
        setError(
          err.response?.data?.message ||
            err.message ||
            'Failed to load favorites'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [isAuthenticated, page]);

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRemoveFavorite = async (propertyId: number) => {
    try {
      await favoritesApi.removeFavorite(propertyId);
      setProperties((prev) => prev.filter((p) => p.id !== propertyId));
      setTotalProperties((prev) => prev - 1);
      enqueueSnackbar('Removed from favorites', { variant: 'success' });
    } catch (err) {
      console.error('Error removing favorite:', err);
      enqueueSnackbar('Failed to remove from favorites', { variant: 'error' });
    }
  };

  // Format price as currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'success';
      case 'SOLD':
        return 'error';
      case 'RENTED':
        return 'info';
      default:
        return 'default';
    }
  };

  // Get main image URL
  const getMainImageUrl = (property: PropertyDTO): string => {
    if (!property.images || property.images.length === 0) {
      return '/images/property-placeholder.jpg';
    }

    const mainImage = property.images.find((img) => img.isMain);
    return mainImage ? mainImage.url : property.images[0].url;
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
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (properties.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <FavoriteOutlined
            sx={{ fontSize: 60, color: 'error.light', mb: 2 }}
          />
          <Typography variant="h5" gutterBottom>
            No Favorite Properties Yet
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            You haven't added any properties to your favorites. Browse
            properties and click the heart icon to add them here.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            href="/properties"
            startIcon={<HomeOutlined />}
            sx={{ mt: 2 }}
          >
            Browse Properties
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          My Favorite Properties
        </Typography>
        <Typography variant="body1" color="text.secondary">
          You have {totalProperties} saved{' '}
          {totalProperties === 1 ? 'property' : 'properties'}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {properties.map((property) => (
          <Grid item xs={12} sm={6} md={4} key={property.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6,
                },
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <Link href={`/properties/${property.id}`} passHref>
                  <CardMedia
                    component="img"
                    height="180"
                    image={getMainImageUrl(property)}
                    alt={property.title}
                    sx={{ cursor: 'pointer' }}
                  />
                </Link>

                {/* Status chip */}
                <Box sx={{ position: 'absolute', top: 12, left: 12 }}>
                  <Chip
                    label={property.status}
                    color={getStatusColor(property.status) as any}
                    size="small"
                    sx={{ fontWeight: 'bold' }}
                  />
                </Box>

                {/* Favorite button */}
                <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                  <FavoriteButton
                    propertyId={property.id || 0}
                    initialIsFavorite={true}
                    onToggle={(isFavorite) => {
                      if (!isFavorite) handleRemoveFavorite(property.id || 0);
                    }}
                  />
                </Box>
              </Box>

              <CardContent sx={{ flexGrow: 1 }}>
                <Link
                  href={`/properties/${property.id}`}
                  passHref
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <Typography variant="h6" component="div" noWrap>
                    {property.title}
                  </Typography>
                </Link>

                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <LocationOnOutlined
                    fontSize="small"
                    color="action"
                    sx={{ mr: 0.5 }}
                  />
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {property.address}, {property.city}
                  </Typography>
                </Box>

                <Typography
                  variant="h5"
                  sx={{ mt: 2, fontWeight: 'bold', color: 'primary.main' }}
                >
                  {formatPrice(property.price)}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                      }}
                    >
                      <BedOutlined fontSize="small" color="action" />
                      <Typography
                        variant="body2"
                        align="center"
                        sx={{ mt: 0.5 }}
                      >
                        {property.bedrooms} Beds
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                      }}
                    >
                      <BathtubOutlined fontSize="small" color="action" />
                      <Typography
                        variant="body2"
                        align="center"
                        sx={{ mt: 0.5 }}
                      >
                        {property.bathrooms} Baths
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                      }}
                    >
                      <SquareFootOutlined fontSize="small" color="action" />
                      <Typography
                        variant="body2"
                        align="center"
                        sx={{ mt: 0.5 }}
                      >
                        {property.area} ft²
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Box>
  );
}
