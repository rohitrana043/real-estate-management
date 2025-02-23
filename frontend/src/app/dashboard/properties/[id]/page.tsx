// src/app/properties/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Alert,
  Paper,
  Button,
  Chip,
  Divider,
  IconButton,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import { getProperty } from '@/lib/api/properties';
import { PropertyDTO } from '@/types/property';
import {
  BedOutlined,
  BathtubOutlined,
  SquareFootOutlined,
  HomeOutlined,
  LocationOnOutlined,
  DirectionsCarOutlined,
  SchoolOutlined,
  LocalHospitalOutlined,
  RestaurantOutlined,
  ParkOutlined,
  ArrowBack,
  Share,
  Favorite,
  FavoriteBorder,
  CalendarMonth,
  Phone,
  Email,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`property-tabpanel-${index}`}
      aria-labelledby={`property-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [property, setProperty] = useState<PropertyDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Get property ID from URL params
  const propertyId = params?.id ? Number(params.id) : null;

  // Fetch property details
  useEffect(() => {
    if (propertyId) {
      fetchPropertyDetails();
    } else {
      setError('Property ID is required');
      setLoading(false);
    }
  }, [propertyId]);

  const fetchPropertyDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const propertyData = await getProperty(propertyId as number);
      setProperty(propertyData);

      // Set the main image or first image as selected
      if (propertyData.images && propertyData.images.length > 0) {
        const mainImage = propertyData.images.find((img) => img.isMain);
        setSelectedImage(
          mainImage ? mainImage.url : propertyData.images[0].url
        );
      }
    } catch (err) {
      console.error('Error fetching property details:', err);
      setError('Failed to load property details. Please try again later.');
      enqueueSnackbar('Failed to load property details', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
    enqueueSnackbar(
      isFavorite ? 'Removed from favorites' : 'Added to favorites',
      { variant: 'success' }
    );
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: property?.title || 'Property Listing',
          text: `Check out this property: ${property?.title}`,
          url: window.location.href,
        })
        .catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      enqueueSnackbar('Link copied to clipboard', { variant: 'success' });
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

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Back button */}
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => router.back()}
            sx={{ textTransform: 'none' }}
          >
            Back to Properties
          </Button>
        </Box>

        {/* Error message */}
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {/* Loading indicator */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          property && (
            <>
              {/* Property Header */}
              <Box sx={{ mb: 4 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={8}>
                    <Typography
                      variant="h4"
                      component="h1"
                      sx={{ fontWeight: 700 }}
                    >
                      {property.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <LocationOnOutlined
                        fontSize="small"
                        color="action"
                        sx={{ mr: 0.5 }}
                      />
                      <Typography variant="body1" color="text.secondary">
                        {property.address}, {property.city}, {property.state}{' '}
                        {property.zipCode}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={4}
                    sx={{
                      display: 'flex',
                      justifyContent: { xs: 'flex-start', md: 'flex-end' },
                    }}
                  >
                    <Typography
                      variant="h4"
                      component="div"
                      sx={{ fontWeight: 700, color: 'primary.main' }}
                    >
                      {formatPrice(property.price)}
                    </Typography>
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Chip
                    label={property.status}
                    color={getStatusColor(property.status) as any}
                    sx={{ fontWeight: 600 }}
                  />
                  <Chip
                    label={property.type}
                    sx={{
                      backgroundColor: 'neutral.main',
                      color: 'text.primary',
                      fontWeight: 600,
                    }}
                  />
                </Box>
              </Box>

              {/* Property Images Gallery */}
              <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={12} md={8}>
                  <Paper
                    elevation={0}
                    sx={{
                      height: 500,
                      width: '100%',
                      backgroundColor: 'neutral.light',
                      backgroundImage: selectedImage
                        ? `url(${selectedImage})`
                        : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderRadius: 2,
                      position: 'relative',
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        display: 'flex',
                        gap: 1,
                      }}
                    >
                      <IconButton
                        onClick={handleFavoriteToggle}
                        sx={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
                      >
                        {isFavorite ? (
                          <Favorite color="error" />
                        ) : (
                          <FavoriteBorder />
                        )}
                      </IconButton>
                      <IconButton
                        onClick={handleShare}
                        sx={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
                      >
                        <Share />
                      </IconButton>
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Grid container spacing={1}>
                    {property.images &&
                      property.images.slice(0, 4).map((image, index) => (
                        <Grid item xs={6} key={image.id}>
                          <Paper
                            elevation={0}
                            sx={{
                              height: 120,
                              width: '100%',
                              backgroundColor: 'neutral.light',
                              backgroundImage: `url(${image.url})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              borderRadius: 2,
                              cursor: 'pointer',
                              border:
                                selectedImage === image.url
                                  ? '2px solid'
                                  : 'none',
                              borderColor: 'primary.main',
                            }}
                            onClick={() => setSelectedImage(image.url)}
                          />
                        </Grid>
                      ))}
                    {property.images && property.images.length > 4 && (
                      <Grid item xs={6}>
                        <Paper
                          elevation={0}
                          sx={{
                            height: 120,
                            width: '100%',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                          onClick={() => {
                            /* Open full gallery */
                          }}
                        >
                          <Typography variant="h6" color="white">
                            +{property.images.length - 4} more
                          </Typography>
                        </Paper>
                      </Grid>
                    )}
                  </Grid>

                  {/* Property Key Features */}
                  <Paper
                    elevation={0}
                    sx={{
                      mt: 2,
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: 'neutral.light',
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                          }}
                        >
                          <BedOutlined fontSize="medium" color="primary" />
                          <Typography
                            variant="h6"
                            align="center"
                            sx={{ mt: 1 }}
                          >
                            {property.bedrooms}
                          </Typography>
                          <Typography
                            variant="body2"
                            align="center"
                            color="text.secondary"
                          >
                            Bedrooms
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                          }}
                        >
                          <BathtubOutlined fontSize="medium" color="primary" />
                          <Typography
                            variant="h6"
                            align="center"
                            sx={{ mt: 1 }}
                          >
                            {property.bathrooms}
                          </Typography>
                          <Typography
                            variant="body2"
                            align="center"
                            color="text.secondary"
                          >
                            Bathrooms
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                          }}
                        >
                          <SquareFootOutlined
                            fontSize="medium"
                            color="primary"
                          />
                          <Typography
                            variant="h6"
                            align="center"
                            sx={{ mt: 1 }}
                          >
                            {property.area}
                          </Typography>
                          <Typography
                            variant="body2"
                            align="center"
                            color="text.secondary"
                          >
                            Sq Ft
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>

              {/* Contact and CTA */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  mb: 4,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'neutral.main',
                }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={8}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Interested in this property?
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      Contact our agent for more information or to schedule a
                      viewing
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={4}
                    sx={{
                      display: 'flex',
                      gap: 2,
                      justifyContent: { xs: 'flex-start', md: 'flex-end' },
                    }}
                  >
                    <Button variant="outlined" startIcon={<Phone />}>
                      Call
                    </Button>
                    <Button variant="outlined" startIcon={<Email />}>
                      Email
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<CalendarMonth />}
                    >
                      Schedule
                    </Button>
                  </Grid>
                </Grid>
              </Paper>

              {/* Tabs */}
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  aria-label="property tabs"
                >
                  <Tab label="Description" id="property-tab-0" />
                  <Tab label="Features" id="property-tab-1" />
                  <Tab label="Location" id="property-tab-2" />
                </Tabs>
              </Box>

              {/* Description Tab */}
              <TabPanel value={tabValue} index={0}>
                <Typography variant="body1" paragraph>
                  {property.description}
                </Typography>
                <Typography variant="body1" paragraph>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
                  nibh augue, suscipit a, scelerisque sed, lacinia in, mi. Cras
                  vel lorem. Etiam pellentesque aliquet tellus. Phasellus
                  pharetra nulla ac diam. Quisque semper justo at risus. Donec
                  venenatis, turpis vel hendrerit interdum, dui ligula ultricies
                  purus, sed posuere libero dui id orci.
                </Typography>
                <Typography variant="body1" paragraph>
                  Nam congue, pede vitae dapibus aliquet, elit magna vulputate
                  arcu, vel tempus metus leo non est. Etiam sit amet lectus quis
                  est congue mollis. Phasellus congue lacus eget neque.
                  Phasellus ornare, ante vitae consectetuer consequat, purus
                  sapien ultricies dolor, et mollis pede metus eget nisi.
                </Typography>
              </TabPanel>

              {/* Features Tab */}
              <TabPanel value={tabValue} index={1}>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Interior Features
                    </Typography>
                    <List>
                      {[
                        'Central Heating',
                        'Air Conditioning',
                        'Hardwood Floors',
                        'Walk-in Closet',
                        'Fireplace',
                      ].map((feature) => (
                        <ListItem key={feature} sx={{ py: 1 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <HomeOutlined fontSize="small" color="primary" />
                          </ListItemIcon>
                          <ListItemText primary={feature} />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Exterior Features
                    </Typography>
                    <List>
                      {[
                        'Garden',
                        'Garage',
                        'Swimming Pool',
                        'Balcony',
                        'Security System',
                      ].map((feature) => (
                        <ListItem key={feature} sx={{ py: 1 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <HomeOutlined fontSize="small" color="primary" />
                          </ListItemIcon>
                          <ListItemText primary={feature} />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                </Grid>
              </TabPanel>

              {/* Location Tab */}
              <TabPanel value={tabValue} index={2}>
                <Typography variant="body1" paragraph>
                  This property is located at {property.address},{' '}
                  {property.city}, {property.state} {property.zipCode}.
                </Typography>

                <Paper
                  elevation={0}
                  sx={{
                    height: 400,
                    width: '100%',
                    backgroundColor: 'neutral.light',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                  }}
                >
                  <Typography variant="body1" color="text.secondary">
                    Map view will be displayed here
                  </Typography>
                </Paper>

                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Nearby Amenities
                </Typography>
                <Grid container spacing={2}>
                  {[
                    {
                      icon: <SchoolOutlined />,
                      name: 'Schools',
                      distance: '0.5 miles',
                    },
                    {
                      icon: <LocalHospitalOutlined />,
                      name: 'Hospital',
                      distance: '2.1 miles',
                    },
                    {
                      icon: <RestaurantOutlined />,
                      name: 'Restaurants',
                      distance: '0.3 miles',
                    },
                    {
                      icon: <ParkOutlined />,
                      name: 'Parks',
                      distance: '0.7 miles',
                    },
                    {
                      icon: <DirectionsCarOutlined />,
                      name: 'Public Transit',
                      distance: '0.2 miles',
                    },
                  ].map((amenity, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: 'neutral.light',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ mr: 2, color: 'primary.main' }}>
                            {amenity.icon}
                          </Box>
                          <Box>
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: 600 }}
                            >
                              {amenity.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {amenity.distance}
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </TabPanel>

              {/* Similar Properties */}
              <Box sx={{ mt: 6, mb: 4 }}>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{ mb: 3, fontWeight: 700 }}
                >
                  Similar Properties
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Here are some other properties you might be interested in
                </Typography>
                <Grid container spacing={3}>
                  {[1, 2, 3].map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 0,
                          borderRadius: 2,
                          overflow: 'hidden',
                          '&:hover': {
                            boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.08)',
                            transition: 'all 0.3s ease-in-out',
                          },
                        }}
                      >
                        <Box
                          sx={{
                            height: 180,
                            backgroundColor: 'neutral.main',
                            backgroundImage: `url('/placeholder-image.jpg')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            position: 'relative',
                          }}
                        >
                          <Box
                            sx={{
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              right: 0,
                              backgroundColor: 'rgba(0, 0, 0, 0.6)',
                              color: 'white',
                              p: 1,
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: 600 }}
                            >
                              $425,000
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ p: 2 }}>
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 600, mb: 1 }}
                          >
                            Modern Apartment
                          </Typography>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 1,
                            }}
                          >
                            <LocationOnOutlined
                              fontSize="small"
                              color="action"
                              sx={{ mr: 0.5 }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              123 Main St, Cityville
                            </Typography>
                          </Box>
                          <Divider sx={{ my: 1.5 }} />
                          <Grid container spacing={1}>
                            <Grid item xs={4}>
                              <Box
                                sx={{ display: 'flex', alignItems: 'center' }}
                              >
                                <BedOutlined
                                  fontSize="small"
                                  color="action"
                                  sx={{ mr: 0.5 }}
                                />
                                <Typography variant="body2">2 Beds</Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={4}>
                              <Box
                                sx={{ display: 'flex', alignItems: 'center' }}
                              >
                                <BathtubOutlined
                                  fontSize="small"
                                  color="action"
                                  sx={{ mr: 0.5 }}
                                />
                                <Typography variant="body2">2 Baths</Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={4}>
                              <Box
                                sx={{ display: 'flex', alignItems: 'center' }}
                              >
                                <SquareFootOutlined
                                  fontSize="small"
                                  color="action"
                                  sx={{ mr: 0.5 }}
                                />
                                <Typography variant="body2">
                                  1200 ft²
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </>
          )
        )}
      </Container>
    </>
  );
}
