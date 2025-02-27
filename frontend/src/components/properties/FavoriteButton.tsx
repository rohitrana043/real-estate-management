// src/components/properties/FavoriteButton.tsx
import React, { useState, useEffect } from 'react';
import { IconButton, Badge, Tooltip } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import favoritesApi from '@/lib/api/favorites';
import { useAuth } from '@/contexts/AuthContext';
import { useSnackbar } from 'notistack';

interface FavoriteButtonProps {
  propertyId: number;
  initialIsFavorite?: boolean;
  initialCount?: number;
  showCount?: boolean;
  size?: 'small' | 'medium' | 'large';
  color?: string;
  onToggle?: (isFavorite: boolean) => void;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  propertyId,
  initialIsFavorite = false,
  initialCount = 0,
  showCount = false,
  size = 'medium',
  color = 'default',
  onToggle,
}) => {
  const { isAuthenticated } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [favoriteCount, setFavoriteCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);

  // Check favorite status when component mounts
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (isAuthenticated && propertyId) {
        try {
          const status = await favoritesApi.checkFavoriteStatus(propertyId);
          setIsFavorite(status);

          // Get favorite count if needed
          if (showCount) {
            const count = await favoritesApi.getPropertyFavoriteCount(
              propertyId
            );
            setFavoriteCount(count);
          }
        } catch (error) {
          console.error('Error checking favorite status:', error);
        }
      }
    };

    // Set initial values even if we don't fetch from API
    setIsFavorite(initialIsFavorite);
    setFavoriteCount(initialCount);

    // Only check with API if authenticated
    if (isAuthenticated) {
      checkFavoriteStatus();
    }
  }, [propertyId, isAuthenticated, initialIsFavorite, initialCount, showCount]);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      enqueueSnackbar('Please log in to save favorites', { variant: 'info' });
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    try {
      if (isFavorite) {
        await favoritesApi.removeFavorite(propertyId);
        setFavoriteCount((prev) => Math.max(0, prev - 1));
        enqueueSnackbar('Removed from favorites', { variant: 'success' });
      } else {
        await favoritesApi.addFavorite(propertyId);
        setFavoriteCount((prev) => prev + 1);
        enqueueSnackbar('Added to favorites', { variant: 'success' });
      }

      // Toggle the favorite state
      setIsFavorite(!isFavorite);

      // Notify parent component if callback provided
      if (onToggle) {
        onToggle(!isFavorite);
      }
    } catch (error) {
      console.error('Error toggling favorite status:', error);
      enqueueSnackbar('Failed to update favorite status', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const button = (
    <IconButton
      onClick={handleToggleFavorite}
      disabled={isLoading}
      size={size}
      color={isFavorite ? 'error' : (color as any)}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      sx={{
        transition: 'all 0.2s',
        '&:hover': {
          transform: 'scale(1.1)',
        },
      }}
    >
      {isFavorite ? <Favorite /> : <FavoriteBorder />}
    </IconButton>
  );

  if (!showCount) {
    return (
      <Tooltip
        title={
          isAuthenticated
            ? isFavorite
              ? 'Remove from favorites'
              : 'Add to favorites'
            : 'Log in to save favorites'
        }
      >
        {button}
      </Tooltip>
    );
  }

  return (
    <Tooltip
      title={
        isAuthenticated
          ? isFavorite
            ? 'Remove from favorites'
            : 'Add to favorites'
          : 'Log in to save favorites'
      }
    >
      <Badge badgeContent={favoriteCount} color="primary">
        {button}
      </Badge>
    </Tooltip>
  );
};

export default FavoriteButton;
