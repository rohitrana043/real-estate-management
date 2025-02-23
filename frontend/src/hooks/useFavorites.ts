// src/hooks/useFavorites.ts
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import favoritesApi from '@/lib/api/favorites';
import { PropertyDTO } from '@/types/property';
import { useSnackbar } from 'notistack';

export const useFavorites = () => {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  const [favoriteProperties, setFavoriteProperties] = useState<PropertyDTO[]>(
    []
  );
  const [loading, setLoading] = useState(false);

  // Fetch all favorite IDs
  const fetchFavoriteIds = useCallback(async () => {
    if (!user) return;

    try {
      const ids = await favoritesApi.getFavoriteIds();
      setFavoriteIds(new Set(ids));
    } catch (error) {
      console.error('Error fetching favorite IDs:', error);
    }
  }, [user]);

  // Fetch all favorite properties with details
  const fetchFavoriteProperties = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const properties = await favoritesApi.getFavoriteProperties();
      setFavoriteProperties(properties);
      // Update favorite IDs as well
      setFavoriteIds(new Set(properties.map((p) => p.id!)));
    } catch (error) {
      console.error('Error fetching favorite properties:', error);
      enqueueSnackbar('Failed to fetch favorites', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [user, enqueueSnackbar]);

  // Initial fetch
  useEffect(() => {
    fetchFavoriteIds();
  }, [fetchFavoriteIds]);

  const toggleFavorite = async (propertyId: number) => {
    if (!user) {
      enqueueSnackbar('Please log in to save favorites', { variant: 'info' });
      return;
    }

    const isFavorite = favoriteIds.has(propertyId);

    try {
      if (isFavorite) {
        await favoritesApi.removeFavorite(propertyId);
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          next.delete(propertyId);
          return next;
        });
        setFavoriteProperties((prev) =>
          prev.filter((p) => p.id !== propertyId)
        );
        enqueueSnackbar('Removed from favorites', { variant: 'success' });
      } else {
        await favoritesApi.addFavorite(propertyId);
        setFavoriteIds((prev) => new Set([...prev, propertyId]));
        // Optionally refresh the full properties list if you need the updated data
        fetchFavoriteProperties();
        enqueueSnackbar('Added to favorites', { variant: 'success' });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      enqueueSnackbar('Failed to update favorites', { variant: 'error' });
    }
  };

  const isFavorite = useCallback(
    (propertyId: number) => {
      return favoriteIds.has(propertyId);
    },
    [favoriteIds]
  );

  return {
    favoriteProperties,
    loading,
    toggleFavorite,
    isFavorite,
    fetchFavoriteProperties,
  };
};
