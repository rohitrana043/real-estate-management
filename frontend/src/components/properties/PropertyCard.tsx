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
  Divider,
  CardActionArea,
} from '@mui/material';
import {
  BedOutlined,
  BathtubOutlined,
  SquareFootOutlined,
  LocationOnOutlined,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import FavoriteButton from './FavoriteButton';
import Link from 'next/link';

interface PropertyCardProps {
  property: PropertyDTO;
  isFavorite: boolean;
  onToggleFavorite: (propertyId: number) => void;
}

const PropertyCard = ({
  property,
  isFavorite = false,
  onToggleFavorite,
}: PropertyCardProps) => {
  const router = useRouter();
  const { user } = useAuth();

  // Get main image URL
  const getMainImageUrl = (): string => {
    if (!property.images || property.images.length === 0) {
      return '/images/property-placeholder.jpg';
    }

    const mainImage = property.images.find((img) => img.isMain);
    return mainImage ? mainImage.url : property.images[0].url;
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

  // Handle favorite toggle
  const handleFavoriteToggle = (newIsFavorite: boolean) => {
    if (onToggleFavorite && property.id) {
      onToggleFavorite(property.id);
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.3s, box-shadow 0.3s',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 4,
        },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <Link href={`/properties/${property.id}`} passHref>
          <CardActionArea>
            <CardMedia
              component="img"
              height="200"
              image={getMainImageUrl()}
              alt={property.title}
              sx={{ objectFit: 'cover' }}
            />
          </CardActionArea>
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
            initialIsFavorite={isFavorite}
            onToggle={handleFavoriteToggle}
          />
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" component="div" noWrap>
            {property.title}
          </Typography>
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
        </Box>

        <Divider sx={{ my: 1.5 }} />

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
              <Typography variant="body2" align="center" sx={{ mt: 0.5 }}>
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
              <Typography variant="body2" align="center" sx={{ mt: 0.5 }}>
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
              <Typography variant="body2" align="center" sx={{ mt: 0.5 }}>
                {property.area} ft²
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
