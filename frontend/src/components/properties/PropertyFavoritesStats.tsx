// src/components/property/PropertyFavoritesStats.tsx
import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Tooltip,
  Chip,
  useTheme,
  LinearProgress,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  Person as PersonIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import FavoriteButton from './FavoriteButton';

interface PropertyFavoritesStatsProps {
  propertyId: number;
  isFavorite: boolean;
  favoriteCount: number;
  onToggleFavorite?: (isFavorite: boolean) => void;
  variant?: 'simple' | 'detailed' | 'visual';
}

const PropertyFavoritesStats: React.FC<PropertyFavoritesStatsProps> = ({
  propertyId,
  isFavorite,
  favoriteCount,
  onToggleFavorite,
  variant = 'simple',
}) => {
  const theme = useTheme();

  // For the popularity meter - assume >20 favorites is "very popular"
  const popularityPercentage = Math.min(100, (favoriteCount / 20) * 100);

  // Helper function to determine popularity text
  const getPopularityText = (count: number): string => {
    if (count === 0) return 'New listing';
    if (count < 5) return 'Rising interest';
    if (count < 10) return 'Popular';
    if (count < 20) return 'Very popular';
    return 'Hot property';
  };

  // Simple variant - clean text display with heart icon
  if (variant === 'simple') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <FavoriteButton
          propertyId={propertyId}
          initialIsFavorite={isFavorite}
          initialCount={0}
          showCount={false}
          onToggle={onToggleFavorite}
          size="small"
        />
        <Typography variant="body2" color="text.secondary">
          {favoriteCount === 0 ? (
            'Be the first to favorite this property!'
          ) : (
            <span>
              <strong>{favoriteCount}</strong>{' '}
              {favoriteCount === 1 ? 'person has' : 'people have'} favorited
              this property
            </span>
          )}
        </Typography>
      </Box>
    );
  }

  // Visual variant - progress bar showing popularity
  if (variant === 'visual') {
    return (
      <Paper sx={{ p: 2, my: 2, borderRadius: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUpIcon color="action" />
            <Typography variant="subtitle1" fontWeight="medium">
              Property Popularity
            </Typography>
          </Box>

          <FavoriteButton
            propertyId={propertyId}
            initialIsFavorite={isFavorite}
            initialCount={0}
            showCount={false}
            onToggle={onToggleFavorite}
            size="small"
          />
        </Box>

        <Box sx={{ width: '100%', mb: 1 }}>
          <LinearProgress
            variant="determinate"
            value={popularityPercentage}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: theme.palette.grey[200],
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                backgroundColor:
                  popularityPercentage > 75
                    ? theme.palette.error.main
                    : popularityPercentage > 40
                    ? theme.palette.warning.main
                    : theme.palette.success.main,
              },
            }}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Tooltip
            title={`${favoriteCount} ${
              favoriteCount === 1 ? 'person has' : 'people have'
            } favorited this property`}
          >
            <Chip
              icon={<FavoriteIcon fontSize="small" />}
              label={getPopularityText(favoriteCount)}
              color={
                favoriteCount > 15
                  ? 'error'
                  : favoriteCount > 8
                  ? 'warning'
                  : favoriteCount > 0
                  ? 'success'
                  : 'default'
              }
              size="small"
            />
          </Tooltip>

          <Typography variant="body2" color="text.secondary">
            <PersonIcon
              fontSize="small"
              sx={{ verticalAlign: 'middle', mr: 0.5 }}
            />
            {favoriteCount} {favoriteCount === 1 ? 'favorite' : 'favorites'}
          </Typography>
        </Box>
      </Paper>
    );
  }

  // Detailed variant - more comprehensive stats display
  return (
    <Paper sx={{ p: 2, my: 2, borderRadius: 2 }}>
      <Typography variant="subtitle1" fontWeight="medium" mb={2}>
        Property Engagement
      </Typography>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="body2" color="text.secondary">
            Favorited by
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
            <FavoriteIcon color="error" fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="h6" fontWeight="bold">
              {favoriteCount}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
              {favoriteCount === 1 ? 'person' : 'people'}
            </Typography>
          </Box>
        </Box>

        <FavoriteButton
          propertyId={propertyId}
          initialIsFavorite={isFavorite}
          initialCount={0}
          showCount={false}
          onToggle={onToggleFavorite}
          size="medium"
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Chip
          label={getPopularityText(favoriteCount)}
          color={
            favoriteCount > 15
              ? 'error'
              : favoriteCount > 8
              ? 'warning'
              : favoriteCount > 0
              ? 'success'
              : 'default'
          }
          size="small"
          sx={{ mr: 1 }}
        />

        <Typography variant="caption" color="text.secondary">
          {isFavorite
            ? "You've favorited this property"
            : 'Add to your favorites'}
        </Typography>
      </Box>
    </Paper>
  );
};

export default PropertyFavoritesStats;
