// src/app/(public)/services/page.tsx
'use client';

import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CardMedia,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useSettings } from '@/contexts/SettingsContext';
import { translations } from '@/translations';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HouseIcon from '@mui/icons-material/House';
import SellIcon from '@mui/icons-material/Sell';
import ApartmentIcon from '@mui/icons-material/Apartment';
import AssessmentIcon from '@mui/icons-material/Assessment';

export default function ServicesPage() {
  const router = useRouter();
  const { language } = useSettings();
  const t = translations[language];

  const mainServices = [
    {
      title: 'Buying Property',
      description:
        'Find your dream home with our expert guidance every step of the way.',
      icon: <HouseIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      image: '/images/services-buy.svg',
      link: '/services/buy',
      features: [
        'Personalized property searches based on your needs',
        'Expert advice on property values and potential',
        'Assistance with financing options and mortgage pre-approval',
        'Comprehensive support through inspection and closing processes',
      ],
    },
    {
      title: 'Selling Property',
      description: `Maximize your property's value with our strategic marketing and sales approach.`,
      icon: <SellIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      image: '/images/services-sell.svg',
      link: '/services/sell',
      features: [
        'Professional property valuation and market analysis',
        'Strategic pricing recommendations',
        'Professional photography and virtual tours',
        'Targeted marketing campaigns to reach qualified buyers',
      ],
    },
    {
      title: 'Property Rental',
      description:
        'Find perfect rental properties or trusted tenants for your investment.',
      icon: <ApartmentIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      image: '/images/services-rental.svg',
      link: '/services/rent',
      features: [
        'Extensive database of rental properties',
        'Thorough tenant screening and background checks',
        'Lease preparation and negotiation',
        'Ongoing property management services available',
      ],
    },
    {
      title: 'Market Analysis',
      description:
        'Make informed decisions with our comprehensive real estate market insights.',
      icon: <AssessmentIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      image: '/images/services-analysis.svg',
      link: '/services/analysis',
      features: [
        'Detailed neighborhood and property value analysis',
        'Investment opportunity assessments',
        'Market trend forecasting',
        'Customized reports for buyers, sellers, and investors',
      ],
    },
  ];

  const specializedServices = [
    'Luxury Property Specialists',
    'First-time Homebuyer Programs',
    'Commercial Real Estate Services',
    'Investment Portfolio Management',
    'Vacation and Second Home Specialists',
    'Relocation Assistance',
    'Property Renovation Consulting',
    'Senior Living Transitions',
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
            'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url("/images/services-bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Container maxWidth="md">
          <Box
            sx={{
              maxWidth: 800,
              mx: 'auto',
              textAlign: 'center',
              color: 'white',
            }}
          >
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              fontWeight="bold"
            >
              Our Services
            </Typography>
            <Typography variant="h5" sx={{ mb: 4 }}>
              Comprehensive Real Estate Solutions Tailored to Your Needs
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Main Services Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6}>
          {mainServices.map((service, index) => (
            <Grid item xs={12} key={index}>
              <Card sx={{ display: { md: 'flex' }, mb: 4 }}>
                <CardMedia
                  component="img"
                  sx={{
                    objectFit: 'contain',
                    width: { md: 300 },
                    height: { xs: 240, md: 'auto' },
                  }}
                  image={service.image}
                  alt={service.title}
                />
                <CardContent sx={{ flex: '1 1 auto', p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ mr: 2 }}>{service.icon}</Box>
                    <Typography variant="h4" component="h2">
                      {service.title}
                    </Typography>
                  </Box>
                  <Typography variant="body1" paragraph>
                    {service.description}
                  </Typography>

                  <List>
                    {service.features.map((feature, i) => (
                      <ListItem key={i} disablePadding sx={{ mb: 1 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckCircleOutlineIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={feature} />
                      </ListItem>
                    ))}
                  </List>

                  <Button
                    variant="contained"
                    size="large"
                    sx={{ mt: 2 }}
                    onClick={() => router.push(service.link)}
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Why Choose Us Section */}
      <Box sx={{ bgcolor: 'background.default', py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            component="h2"
            textAlign="center"
            gutterBottom
          >
            Why Choose Our Services
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}
          >
            We combine industry expertise with personalized care to deliver
            exceptional results for all your real estate needs.
          </Typography>

          <Grid container spacing={4}>
            {[
              {
                title: 'Experienced Team',
                description:
                  'Our agents have an average of 10+ years in the industry with deep local market knowledge.',
              },
              {
                title: 'Client-Centered Approach',
                description:
                  'We listen carefully to your needs and tailor our services to meet your specific goals.',
              },
              {
                title: 'Cutting-Edge Technology',
                description:
                  'We leverage the latest tools and platforms to streamline your real estate experience.',
              },
              {
                title: 'Transparent Communication',
                description:
                  'We keep you informed at every step with clear, honest updates throughout the process.',
              },
            ].map((item, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Typography
                    variant="h5"
                    component="h3"
                    gutterBottom
                    color="primary"
                  >
                    {item.title}
                  </Typography>
                  <Typography variant="body1">{item.description}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Specialized Services */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom>
          Specialized Services
        </Typography>
        <Typography
          variant="body1"
          textAlign="center"
          color="text.secondary"
          sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}
        >
          Beyond our core offerings, we provide specialized services to meet
          unique real estate needs.
        </Typography>

        <Grid container spacing={3}>
          {specializedServices.map((service, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                <Typography variant="h6" component="h3">
                  {service}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Process Section */}
      <Box sx={{ bgcolor: 'background.default', py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            component="h2"
            textAlign="center"
            gutterBottom
          >
            Our Process
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}
          >
            We've refined our approach to ensure a smooth and efficient
            experience for all our clients.
          </Typography>

          <Grid container spacing={2} justifyContent="center">
            {[
              {
                step: 1,
                title: 'Initial Consultation',
                description:
                  'We begin with a detailed discussion to understand your specific needs and goals.',
              },
              {
                step: 2,
                title: 'Customized Strategy',
                description:
                  'Based on your requirements, we develop a tailored plan to achieve your real estate objectives.',
              },
              {
                step: 3,
                title: 'Implementation',
                description:
                  'We execute the strategy with regular updates and adjustments as needed.',
              },
              {
                step: 4,
                title: 'Successful Outcome',
                description:
                  'We guide you through closing and ensure all details are handled professionally.',
              },
            ].map((step, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper
                  sx={{ p: 3, height: '100%', position: 'relative', pt: 5 }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -20,
                      left: 'calc(50% - 20px)',
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      boxShadow: 2,
                    }}
                  >
                    {step.step}
                  </Box>
                  <Typography
                    variant="h6"
                    component="h3"
                    textAlign="center"
                    gutterBottom
                  >
                    {step.title}
                  </Typography>
                  <Typography variant="body2" textAlign="center">
                    {step.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials */}
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom>
          Client Testimonials
        </Typography>
        <Typography
          variant="body1"
          textAlign="center"
          color="text.secondary"
          sx={{ mb: 6 }}
        >
          Hear what our clients have to say about our services
        </Typography>

        <Grid container spacing={4}>
          {[
            {
              quote:
                'Their expertise in the local market helped us find our dream home in just two weeks. The entire process was smooth and stress-free.',
              author: 'James & Emily Wilson',
              service: 'Home Buying',
            },
            {
              quote:
                'We were amazed at how quickly they sold our property and at a price above our expectations. Their marketing strategy was impressive.',
              author: 'Michael Rodriguez',
              service: 'Property Selling',
            },
          ].map((testimonial, index) => (
            <Grid item xs={12} key={index}>
              <Paper sx={{ p: 4, borderLeft: 4, borderColor: 'primary.main' }}>
                <Typography
                  variant="body1"
                  paragraph
                  sx={{ fontStyle: 'italic' }}
                >
                  "{testimonial.quote}"
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  {testimonial.author}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {testimonial.service}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8 }}>
        <Container maxWidth="md">
          <Box textAlign="center">
            <Typography variant="h4" component="h2" gutterBottom>
              Ready to Get Started?
            </Typography>
            <Typography
              variant="body1"
              paragraph
              sx={{ mb: 4, maxWidth: 800, mx: 'auto' }}
            >
              Whether you're looking to buy, sell, or invest in real estate, our
              team is here to help you achieve your goals.
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'grey.100',
                },
              }}
              onClick={() => router.push('/contact')}
            >
              Contact Us Today
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
