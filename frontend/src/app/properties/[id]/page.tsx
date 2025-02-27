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
import { getProperty, getSimilarProperties } from '@/lib/api/properties';
import { PropertyDTO } from '@/types/property';
import FavoriteButton from '@/components/properties/FavoriteButton';
import PropertyFavoritesStats from '@/components/properties/PropertyFavoritesStats';
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
  CalendarMonth,
  Phone,
  Email,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

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

// PropertyCard component for similar properties
const SimilarPropertyCard = ({
  property,
  onToggleFavorite,
}: {
  property: PropertyDTO;
  onToggleFavorite: (id: number) => void;
}) => {
  const router = useRouter();

  // Get the main image URL or use a placeholder
  const mainImageUrl =
    property.images && property.images.length > 0
      ? property.images.find((img) => img.isMain)?.url || property.images[0].url
      : '/images/properties/property-placeholder.jpg';

  // Format price as currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 0,
        borderRadius: 2,
        overflow: 'hidden',
        '&:hover': {
          boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s ease-in-out',
          cursor: 'pointer',
        },
      }}
      onClick={() => property.id && router.push(`/properties/${property.id}`)}
    >
      <Box
        sx={{
          height: 180,
          backgroundColor: 'neutral.main',
          backgroundImage: `url('${mainImageUrl}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
          }}
        >
          {property.id && (
            <FavoriteButton
              propertyId={property.id}
              size="small"
              initialIsFavorite={property.favorite || false}
              showCount={false}
              color="default"
            />
          )}
        </Box>
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
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {formatPrice(property.price)}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
          {property.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LocationOnOutlined
            fontSize="small"
            color="action"
            sx={{ mr: 0.5 }}
          />
          <Typography variant="body2" color="text.secondary" noWrap>
            {property.address}, {property.city}
          </Typography>
        </Box>
        <Divider sx={{ my: 1.5 }} />
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <BedOutlined fontSize="small" color="action" sx={{ mr: 0.5 }} />
              <Typography variant="body2">{property.bedrooms} Beds</Typography>
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
                {property.bathrooms} Baths
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
      </Box>
    </Paper>
  );
};

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { user, isAuthenticated } = useAuth();
  const [property, setProperty] = useState<PropertyDTO | null>(null);
  const [similarProperties, setSimilarProperties] = useState<PropertyDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [similarLoading, setSimilarLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      if (!params?.id) {
        setError('Property ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const propertyData = await getProperty(Number(params.id));
        setProperty(propertyData);
        // Find and set the main image as the selected image
        if (propertyData.images && propertyData.images.length > 0) {
          const mainImage = propertyData.images.find((img) => img.isMain);

          // If a main image exists, use it; otherwise, use the first image
          setSelectedImage(
            mainImage ? mainImage.url : propertyData.images[0].url
          );
        }

        // Fetch similar properties
        setSimilarLoading(true);
        fetchSimilarProperties(Number(params.id));
      } catch (err: any) {
        console.error('Error fetching property details:', err);

        // Handle different types of errors
        if (err.response?.status === 401) {
          enqueueSnackbar('Please log in to view property details', {
            variant: 'warning',
          });
          // Optionally redirect to login
          router.push(`/login?from=/properties/${params.id}`);
        } else if (err.response?.status === 403) {
          setError('You do not have permission to view this property');
        } else if (err.response?.status === 404) {
          setError('Property not found');
        } else {
          setError('Failed to load property details. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [params?.id, enqueueSnackbar, router]);

  // Fetch similar properties
  const fetchSimilarProperties = async (propertyId: number) => {
    try {
      const similarProps = await getSimilarProperties(propertyId);
      // Filter out the current property just in case it's included in the results
      setSimilarProperties(similarProps.filter((p) => p.id !== propertyId));
    } catch (err) {
      console.error('Error fetching similar properties:', err);
      // We don't set an error state for similar properties - just show empty if fails
    } finally {
      setSimilarLoading(false);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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

  // Handle toggle favorite for similar properties
  const handleToggleFavorite = async (propertyId: number) => {
    if (!user) {
      enqueueSnackbar('Please log in to save favorites', { variant: 'info' });
      return;
    }

    // This would be handled by the FavoriteButton component
    // We just need to pass this method to the component
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

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!property) {
    return (
      <Container maxWidth="lg">
        {/* Back button */}
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => router.push('/properties')}
            sx={{ textTransform: 'none' }}
          >
            Back to Properties
          </Button>
        </Box>
        <Alert severity="info" sx={{ mt: 4 }}>
          Property not found
          {error}
        </Alert>
      </Container>
    );
  }
  return (
    <>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <>
          {/* Back button */}
          <Box sx={{ mb: 3 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => router.push('/properties')}
              sx={{ textTransform: 'none' }}
            >
              Back to Properties
            </Button>
          </Box>
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

            <Box sx={{ display: 'flex', mt: 2 }}>
              <PropertyFavoritesStats
                propertyId={property.id}
                isFavorite={property.favorite}
                favoriteCount={property.favoriteCount}
                variant="simple"
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
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
                  <FavoriteButton
                    propertyId={property.id || 0}
                    size="large"
                    initialIsFavorite={false} // This will be updated by the component
                    showCount={false}
                    color="default"
                  />
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
                            selectedImage === image.url ? '2px solid' : 'none',
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
                      <Typography variant="h6" align="center" sx={{ mt: 1 }}>
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
                      <Typography variant="h6" align="center" sx={{ mt: 1 }}>
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
                      <SquareFootOutlined fontSize="medium" color="primary" />
                      <Typography variant="h6" align="center" sx={{ mt: 1 }}>
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
              nibh augue, suscipit a, scelerisque sed, lacinia in, mi. Cras vel
              lorem. Etiam pellentesque aliquet tellus. Phasellus pharetra nulla
              ac diam. Quisque semper justo at risus. Donec venenatis, turpis
              vel hendrerit interdum, dui ligula ultricies purus, sed posuere
              libero dui id orci.
            </Typography>
            <Typography variant="body1" paragraph>
              Nam congue, pede vitae dapibus aliquet, elit magna vulputate arcu,
              vel tempus metus leo non est. Etiam sit amet lectus quis est
              congue mollis. Phasellus congue lacus eget neque. Phasellus
              ornare, ante vitae consectetuer consequat, purus sapien ultricies
              dolor, et mollis pede metus eget nisi.
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
              This property is located at {property.address}, {property.city},{' '}
              {property.state} {property.zipCode}.
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
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Here are some other properties you might be interested in
            </Typography>

            {similarLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : similarProperties.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No similar properties found
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {similarProperties.map((property) => (
                  <Grid item xs={12} sm={6} md={4} key={property.id}>
                    <SimilarPropertyCard
                      property={property}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </>
      </Container>
    </>
  );
}
