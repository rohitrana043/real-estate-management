// src/app/dashboard/favorite/page.tsx
'use client';

import {
  Container,
  Typography,
  Box,
  Grid,
  CircularProgress,
} from '@mui/material';
import PropertyCard from '@/components/properties/PropertyCard';
import { useFavorites } from '@/hooks/useFavorites';

export default function FavoritesPage() {
  const { favorites, loading } = useFavorites();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 700 }}>
        My Favorite Properties
      </Typography>

      {favorites.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            You haven't saved any properties yet
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Click the heart icon on any property to add it to your favorites
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {favorites.map((property) => (
            <Grid item key={property.id} xs={12} sm={6} md={4}>
              <PropertyCard property={property} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
