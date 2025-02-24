// src/components/property/PropertyCard.tsx
'use client';
import { useAuth } from '@/contexts/AuthContext';
import { PropertyDTO } from '@/types/property';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Grid,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  BedOutlined,
  BathtubOutlined,
  SquareFootOutlined,
  Favorite,
  FavoriteBorder,
  LocationOnOutlined,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

interface PropertyCardProps {
  property: PropertyDTO;
  isFavorite: boolean;
  onToggleFavorite: (propertyId: number) => void;
}

const PropertyCard = ({
  property,
  isFavorite,
  onToggleFavorite,
}: PropertyCardProps) => {
  const router = useRouter();
  const { user } = useAuth();

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

  // Handle favorite toggle
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (property.id) {
      onToggleFavorite(property.id);
    }
  };

  const handleCardClick = () => {
    router.push(`/properties/${property.id}`);
  };

  // Default placeholder image
  const defaultImage = '/images/properties/property-placeholder.jpg';

  // Get main image or first image or default
  const getMainImage = () => {
    if (!property.images || property.images.length === 0) {
      return defaultImage;
    }

    const mainImage = property.images.find((img) => img.isMain);
    return mainImage ? mainImage.url : property.images[0].url;
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-4px)',
          transition: 'transform 0.2s ease-in-out',
          boxShadow: 4,
        },
      }}
      onClick={handleCardClick}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="220"
          image={getMainImage()}
          alt={property.title}
        />
        <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
          <Tooltip
            title={
              user
                ? isFavorite
                  ? 'Remove from favorites'
                  : 'Add to favorites'
                : 'Login to save favorites'
            }
          >
            <IconButton
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
              }}
              onClick={handleFavoriteClick}
            >
              {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
            </IconButton>
          </Tooltip>
        </Box>
        <Box sx={{ position: 'absolute', top: 12, left: 12 }}>
          <Chip
            label={property.status}
            color={getStatusColor(property.status) as any}
            sx={{ fontWeight: 600 }}
          />
        </Box>
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            color: 'white',
            p: 1.5,
          }}
        >
          <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
            {formatPrice(property.price)}
          </Typography>
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, pt: 2 }}>
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          sx={{ fontWeight: 600 }}
        >
          {property.title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LocationOnOutlined
            fontSize="small"
            color="action"
            sx={{ mr: 0.5 }}
          />
          <Typography variant="body2" color="text.secondary">
            {property.address}, {property.city}, {property.state}
          </Typography>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, height: '3em', overflow: 'hidden' }}
        >
          {property.description}
        </Typography>

        <Grid container spacing={1} sx={{ mt: 1 }}>
          <Grid item xs={4}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <BedOutlined fontSize="small" color="action" sx={{ mr: 0.5 }} />
              <Typography variant="body2">
                {property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <BathtubOutlined
                fontSize="small"
                color="action"
                sx={{ mr: 0.5 }}
              />
              <Typography variant="body2">
                {property.bathrooms}{' '}
                {property.bathrooms === 1 ? 'Bath' : 'Baths'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SquareFootOutlined
                fontSize="small"
                color="action"
                sx={{ mr: 0.5 }}
              />
              <Typography variant="body2">{property.area} ft²</Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 2 }}>
          <Chip
            label={property.type}
            size="small"
            sx={{
              backgroundColor: 'neutral.main',
              color: 'text.primary',
              mr: 1,
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
