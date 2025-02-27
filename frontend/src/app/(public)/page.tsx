// src/app/(public)/page.tsx
'use client';

import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Card,
  CardMedia,
  CardContent,
  Avatar,
  Rating,
  Stack,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useState, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { useSettings } from '@/contexts/SettingsContext';
import { translations } from '@/translations';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { debugAuthState } from '@/lib/debug/authDebug';
import { getProperties } from '@/lib/api/properties';
import { PropertyDTO } from '@/types/property';
import PropertyCard from '@/components/properties/PropertyCard';
import favoritesApi from '@/lib/api/favorites';
import { useSnackbar } from 'notistack';

export default function Home() {
  const router = useRouter();
  const { language } = useSettings();
  const t = translations[language];
  const { isAuthenticated, isLoading, user } = useAuth();
  const pathname = usePathname();
  const { enqueueSnackbar } = useSnackbar();
  // State for featured properties
  const [featuredProperties, setFeaturedProperties] = useState<PropertyDTO[]>(
    []
  );
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [propertiesError, setPropertiesError] = useState<string | null>(null);
  const [favoritePropertyIds, setFavoritePropertyIds] = useState<Set<number>>(
    new Set()
  );

  useEffect(() => {
    debugAuthState();
  }, []);

  useEffect(() => {
    // Simple redirect monitor
    const originalPush = router.push;
    router.push = function (...args) {
      return originalPush.apply(this, args);
    };

    return () => {
      router.push = originalPush;
    };
  }, [isAuthenticated, isLoading]);

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        setPropertiesLoading(true);
        // Fetch first page of properties
        const response = await getProperties(0, 10);

        // Randomly select 3 properties or take first 3 if less than 3
        const selectedProperties =
          response.content.length > 3
            ? getRandomProperties(response.content, 3)
            : response.content.slice(0, 3);

        setFeaturedProperties(selectedProperties);
      } catch (error) {
        console.error('Error fetching featured properties:', error);
        setPropertiesError('Failed to load featured properties');
      } finally {
        setPropertiesLoading(false);
      }
    };

    fetchFeaturedProperties();
  }, []);

  // Fetch favorite IDs when component mounts and user is logged in
  useEffect(() => {
    const fetchFavoriteIds = async () => {
      if (user) {
        try {
          const ids = await favoritesApi.getFavoriteIds();
          setFavoritePropertyIds(new Set(ids));
        } catch (error) {
          console.error('Error fetching favorite IDs:', error);
        }
      }
    };

    fetchFavoriteIds();
  }, [user]);

  // Toggle favorite status for a property
  const handleToggleFavorite = async (propertyId: number) => {
    if (!user) {
      enqueueSnackbar('Please log in to save favorites', { variant: 'info' });
      return;
    }

    try {
      const isCurrentlyFavorite = favoritePropertyIds.has(propertyId);

      if (isCurrentlyFavorite) {
        await favoritesApi.removeFavorite(propertyId);
        setFavoritePropertyIds((prev) => {
          const next = new Set(prev);
          next.delete(propertyId);
          return next;
        });
      } else {
        await favoritesApi.addFavorite(propertyId);
        setFavoritePropertyIds((prev) => new Set([...prev, propertyId]));
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const getRandomProperties = (properties: PropertyDTO[], count: number) => {
    const shuffled = [...properties].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Format price as currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const features = [
    {
      title: t.home.featuredProperties,
      description:
        'Browse through our carefully curated selection of premium properties, ranging from luxury apartments to spacious family homes.',
      icon: <HomeIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />,
    },
    {
      title: t.home.marketAnalysis,
      description:
        'Stay informed with our comprehensive market analysis, price trends, and investment opportunities in prime locations.',
      icon: (
        <TrendingUpIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
      ),
    },
    {
      title: t.home.expertAdvice,
      description:
        'Connect with our experienced real estate professionals for personalized guidance throughout your property journey.',
      icon: (
        <SupportAgentIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
      ),
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'First-time Homebuyer',
      comment:
        'The team made my first home purchase incredibly smooth. Their expertise and guidance were invaluable.',
      rating: 5,
      avatar: '/images/male-profile-pic.svg',
    },
    {
      name: 'Michael Chen',
      role: 'Property Investor',
      comment:
        'Their market analysis helped me make informed investment decisions. Highly recommend their services.',
      rating: 5,
      avatar: '/images/female-profile-pic.svg',
    },
  ];

  const stats = [
    { label: 'Properties Sold', value: '1,200+' },
    { label: 'Happy Clients', value: '950+' },
    { label: 'Cities Covered', value: '32' },
    { label: 'Expert Agents', value: '85' },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          position: 'relative',
          pt: 8,
          pb: 12,
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url("/images/hero-bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              maxWidth: 800,
              mx: 'auto',
              textAlign: 'center',
              color: 'white',
            }}
          >
            <Typography
              component="h1"
              variant="h2"
              gutterBottom
              sx={{
                fontWeight: 700,
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                mb: 3,
              }}
            >
              {t.home.title}
            </Typography>
            <Typography
              variant="h5"
              paragraph
              sx={{ mb: 4, textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
            >
              {t.home.subtitle}
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<SearchIcon />}
              onClick={() => router.push('/properties')}
              sx={{
                py: 1.5,
                px: 4,
                fontSize: '1.1rem',
                boxShadow: '0 4px 14px 0 rgba(0,0,0,0.25)',
              }}
            >
              {t.home.browseProperties}
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {features.map((feature) => (
            <Grid item key={feature.title} xs={12} md={4}>
              <Paper
                sx={{
                  p: 4,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  },
                }}
              >
                {feature.icon}
                <Typography variant="h5" component="h2" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Properties */}
      <Box sx={{ bgcolor: 'background.default', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" gutterBottom>
            Featured Properties
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            color="text.secondary"
            sx={{ mb: 6 }}
          >
            Discover our handpicked selection of premium properties
          </Typography>

          {propertiesLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : propertiesError ? (
            <Alert severity="error" sx={{ mx: 'auto', maxWidth: 600 }}>
              {propertiesError}
            </Alert>
          ) : (
            <Grid container spacing={4}>
              {featuredProperties.map((property) => (
                <Grid item key={property.id} xs={12} md={4}>
                  <PropertyCard
                    property={property}
                    isFavorite={
                      property.id ? favoritePropertyIds.has(property.id) : false
                    }
                    onToggleFavorite={handleToggleFavorite}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>

      {/* Statistics Section */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            {stats.map((stat) => (
              <Grid item key={stat.label} xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="h3"
                    component="div"
                    sx={{ fontWeight: 700, mb: 1 }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant="subtitle1">{stat.label}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" align="center" gutterBottom>
          What Our Clients Say
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          sx={{ mb: 6 }}
        >
          Read about experiences from our satisfied clients
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {testimonials.map((testimonial) => (
            <Grid item key={testimonial.name} xs={12} md={6}>
              <Paper sx={{ p: 4 }}>
                <Stack spacing={2}>
                  <Rating value={testimonial.rating} readOnly />
                  <Typography variant="body1" color="text.secondary" paragraph>
                    "{testimonial.comment}"
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar src={testimonial.avatar} alt={testimonial.name} />
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box sx={{ bgcolor: 'background.default', py: 8 }}>
        <Container maxWidth="md">
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
              Ready to Find Your Dream Home?
            </Typography>
            <Typography color="text.secondary" paragraph sx={{ mb: 4 }}>
              Connect with our expert agents and start your journey today
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => router.push('/properties')}
              >
                Browse Properties
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => router.push('/contact')}
              >
                Contact Us
              </Button>
            </Stack>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}
