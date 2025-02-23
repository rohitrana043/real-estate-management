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
  Divider,
} from '@mui/material';
import { useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { useSettings } from '@/contexts/SettingsContext';
import { translations } from '@/translations';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { debugAuthState } from '@/lib/debug/authDebug';

export default function Home() {
  const router = useRouter();
  const { language } = useSettings();
  const t = translations[language];
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    debugAuthState();
  }, []);

  useEffect(() => {
    console.log('Home page mounted, pathname:', pathname);

    // Debug router navigation
    const originalPush = router.push;
    router.push = function (...args) {
      console.log('Navigation triggered from Home page to:', args[0]);
      return originalPush.apply(this, args);
    };

    return () => {
      console.log('Home page unmounting');
      router.push = originalPush;
    };
  }, []);

  useEffect(() => {
    console.log(
      'Home page mounted, isAuthenticated:',
      isAuthenticated,
      'isLoading:',
      isLoading
    );

    // Simple redirect monitor
    const originalPush = router.push;
    router.push = function (...args) {
      console.log('Router redirecting to:', args[0]);
      return originalPush.apply(this, args);
    };

    return () => {
      router.push = originalPush;
    };
  }, [isAuthenticated, isLoading]);

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

  const featuredProperties = [
    {
      title: 'Luxury Villa with Ocean View',
      location: 'Miami Beach, FL',
      price: '$2,500,000',
      image:
        'https://robohash.org/1506c073d8abb8d10b5b079b0dab48ef?set=set4&bgset=&size=400x400',
      beds: 5,
      baths: 4,
      sqft: 4200,
    },
    {
      title: 'Modern Downtown Apartment',
      location: 'New York, NY',
      price: '$1,200,000',
      image:
        'https://robohash.org/1506c073d8abb8d10b5b079b0dab48ef?set=set4&bgset=&size=400x400',
      beds: 2,
      baths: 2,
      sqft: 1500,
    },
    {
      title: 'Suburban Family Home',
      location: 'Austin, TX',
      price: '$750,000',
      image:
        'https://robohash.org/1506c073d8abb8d10b5b079b0dab48ef?set=set4&bgset=&size=400x400',
      beds: 4,
      baths: 3,
      sqft: 2800,
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'First-time Homebuyer',
      comment:
        'The team made my first home purchase incredibly smooth. Their expertise and guidance were invaluable.',
      rating: 5,
      avatar:
        'https://robohash.org/1506c073d8abb8d10b5b079b0dab48ef?set=set4&bgset=&size=400x400',
    },
    {
      name: 'Michael Chen',
      role: 'Property Investor',
      comment:
        'Their market analysis helped me make informed investment decisions. Highly recommend their services.',
      rating: 5,
      avatar:
        'https://robohash.org/1506c073d8abb8d10b5b079b0dab48ef?set=set4&bgset=&size=400x400',
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
            'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url("")',
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

          <Grid container spacing={4}>
            {featuredProperties.map((property) => (
              <Grid item key={property.title} xs={12} md={4}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      transition: 'transform 0.2s',
                    },
                  }}
                  onClick={() => router.push('/properties')}
                >
                  <CardMedia
                    component="img"
                    height="240"
                    image={property.image}
                    alt={property.title}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="h3">
                      {property.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {property.location}
                    </Typography>
                    <Typography variant="h6" color="primary" gutterBottom>
                      {property.price}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {property.beds} beds • {property.baths} baths •{' '}
                      {property.sqft} sqft
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
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
