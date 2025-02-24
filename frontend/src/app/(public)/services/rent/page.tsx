// src/app/(public)/services/rent/page.tsx
'use client';

import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Card,
  CardContent,
  Divider,
  Tab,
  Tabs,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSettings } from '@/contexts/SettingsContext';
import { translations } from '@/translations';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ApartmentIcon from '@mui/icons-material/Apartment';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

export default function RentPropertyPage() {
  const router = useRouter();
  const { language } = useSettings();
  const t = translations[language];
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const rentalServices = [
    {
      title: 'Property Search',
      icon: <ApartmentIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      description:
        'Find the perfect rental property that meets your needs, preferences, and budget.',
      features: [
        'Personalized property matching',
        'Neighborhood guidance',
        'Virtual and in-person viewings',
        'Rental market insights',
      ],
    },
    {
      title: 'Tenant Placement',
      icon: <PersonIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      description:
        'For property owners, we find high-quality tenants through rigorous screening and matching.',
      features: [
        'Comprehensive tenant screening',
        'Background and credit checks',
        'Income verification',
        'Rental history evaluation',
      ],
    },
    {
      title: 'Property Management',
      icon: <BusinessIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      description:
        'Full-service property management to maximize returns and minimize hassles for landlords.',
      features: [
        'Rent collection and accounting',
        'Property maintenance coordination',
        'Regular property inspections',
        'Tenant communication management',
      ],
    },
    {
      title: 'Leasing Services',
      icon: <AssignmentIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      description: `Professional lease preparation and negotiation to protect all parties' interests.`,
      features: [
        'Customized lease agreements',
        'Term and condition negotiation',
        'Legal compliance review',
        'Lease renewal management',
      ],
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          py: 8,
          position: 'relative',
          backgroundImage: 'url("/images/services-rental-bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
          },
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            fontWeight="bold"
            textAlign="center"
          >
            Rental Services
          </Typography>
          <Typography variant="h5" textAlign="center" sx={{ mb: 4 }}>
            Comprehensive Solutions for Renters and Property Owners
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: 2,
                width: { xs: '100%', sm: '80%', md: '60%' },
                '& .MuiTab-root': {
                  color: 'text.primary',
                  minWidth: 120,
                  fontWeight: 500,
                  px: 4,
                  '&:first-of-type': {
                    borderTopLeftRadius: 8,
                    borderBottomLeftRadius: 8,
                  },
                  '&:last-child': {
                    borderTopRightRadius: 8,
                    borderBottomRightRadius: 8,
                  },
                },
                '& .Mui-selected': {
                  color: 'primary.main',
                  fontWeight: 700,
                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                },
                '& .MuiTabs-indicator': {
                  height: 3,
                },
              }}
            >
              <Tab label="For Renters" />
              <Tab label="For Property Owners" />
            </Tabs>
          </Box>
        </Container>
      </Box>

      {/* Tab Content */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Content for Renters */}
        <div role="tabpanel" hidden={tabValue !== 0}>
          {tabValue === 0 && (
            <Grid container spacing={6}>
              <Grid item xs={12} md={6}>
                <Typography variant="h4" component="h2" gutterBottom>
                  Find Your Perfect Rental Home
                </Typography>
                <Typography variant="body1" paragraph>
                  Looking for a great place to rent? Our dedicated rental
                  specialists make the process easy and stress-free, helping you
                  find a home that fits your lifestyle, preferences, and budget.
                </Typography>
                <Typography variant="body1" paragraph>
                  Whether you're looking for a short-term rental or a long-term
                  home, we have access to a wide range of properties from
                  apartments and condos to single-family homes and luxury
                  rentals.
                </Typography>

                <List>
                  {[
                    'Personalized property matching based on your criteria',
                    'Insider knowledge of upcoming rental properties',
                    'Guided property tours (in-person or virtual)',
                    'Expert negotiation of lease terms',
                    'Thorough explanation of lease obligations and rights',
                    'Ongoing support throughout your tenancy',
                  ].map((item, index) => (
                    <ListItem key={index} disablePadding sx={{ mb: 1 }}>
                      <ListItemIcon>
                        <CheckCircleOutlineIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={item} />
                    </ListItem>
                  ))}
                </List>

                <Button
                  variant="contained"
                  size="large"
                  sx={{ mt: 3 }}
                  onClick={() => router.push('/properties')}
                >
                  Browse Rental Properties
                </Button>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  component="img"
                  src="/images/services-for-renters.svg"
                  alt="Happy renters"
                  sx={{
                    width: '100%',
                    borderRadius: 2,
                    boxShadow: 3,
                  }}
                />
              </Grid>

              {/* How It Works for Renters */}
              <Grid item xs={12} sx={{ mt: 4 }}>
                <Typography variant="h5" component="h3" gutterBottom>
                  How Our Rental Process Works
                </Typography>
                <Divider sx={{ mb: 4 }} />

                <Grid container spacing={3}>
                  {[
                    {
                      title: 'Initial Consultation',
                      description:
                        'We start by understanding your requirements, preferences, budget, and timeline to create a personalized rental search plan.',
                    },
                    {
                      title: 'Property Matching',
                      description:
                        'Based on your criteria, we curate a selection of suitable rental properties from our database and arrange viewings.',
                    },
                    {
                      title: 'Viewing & Selection',
                      description:
                        'We accompany you on property tours, highlighting features and answering questions to help you make an informed decision.',
                    },
                    {
                      title: 'Application & Screening',
                      description: `Once you've chosen a property, we guide you through the application process, ensuring all requirements are met.`,
                    },
                    {
                      title: 'Lease Negotiation',
                      description:
                        'We negotiate favorable lease terms on your behalf and review the contract to protect your interests.',
                    },
                    {
                      title: 'Move-In Support',
                      description:
                        'We coordinate the move-in process, including property condition documentation and utility setup assistance.',
                    },
                  ].map((step, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Paper sx={{ p: 3, height: '100%' }}>
                        <Typography
                          variant="h6"
                          component="h4"
                          gutterBottom
                          color="primary"
                        >
                          {index + 1}. {step.title}
                        </Typography>
                        <Typography variant="body2">
                          {step.description}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              {/* Renter FAQs */}
              <Grid item xs={12} sx={{ mt: 4 }}>
                <Typography variant="h5" component="h3" gutterBottom>
                  Frequently Asked Questions - For Renters
                </Typography>
                <Divider sx={{ mb: 4 }} />

                {[
                  {
                    question:
                      'Do I need to pay for your rental search services?',
                    answer: `In most cases, our rental search services are provided at no cost to renters, as we're compensated by the property owners or management companies. For certain specialized searches or highly competitive markets, a nominal service fee may apply, which we'll discuss upfront.`,
                  },
                  {
                    question:
                      'What information do I need to provide for a rental application?',
                    answer: `Typically, you'll need to provide proof of income (pay stubs, tax returns, or bank statements), identification, rental history, personal references, and consent for a credit and background check. We'll guide you through preparing these documents in advance to streamline the application process.`,
                  },
                  {
                    question: `How much should I budget for a security deposit?`,
                    answer: `Security deposits typically range from one to two months' rent, depending on the property and local regulations. Some properties may also require additional pet deposits or move-in fees. We'll ensure you understand all costs upfront before proceeding with any application.`,
                  },
                  {
                    question: `Can you help me find a rental if I have pets?`,
                    answer: `Absolutely! We maintain a database of pet-friendly rentals and can negotiate with property owners on your behalf. We'll help you understand any pet policies, additional deposits, or pet rent that may apply to different properties.`,
                  },
                ].map((faq, index) => (
                  <Accordion key={index} sx={{ mb: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {faq.question}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2">{faq.answer}</Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Grid>
            </Grid>
          )}
        </div>

        {/* Content for Property Owners */}
        <div role="tabpanel" hidden={tabValue !== 1}>
          {tabValue === 1 && (
            <Grid container spacing={6}>
              <Grid item xs={12} md={6}>
                <Box
                  component="img"
                  src="/images/services-for-owners.svg"
                  alt="Property management"
                  sx={{
                    width: '100%',
                    borderRadius: 2,
                    boxShadow: 3,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h4" component="h2" gutterBottom>
                  Maximize Your Rental Property Returns
                </Typography>
                <Typography variant="body1" paragraph>
                  As a property owner, your rental investment should generate
                  optimal returns with minimal stress. Our comprehensive rental
                  management services are designed to protect your investment
                  while maximizing its income potential.
                </Typography>
                <Typography variant="body1" paragraph>
                  From finding qualified tenants to handling day-to-day
                  management, we provide tailored solutions for individual
                  landlords and property investors alike.
                </Typography>

                <List>
                  {[
                    'Thorough tenant screening and selection',
                    'Market-optimized rental pricing strategy',
                    'Professional property marketing and listing',
                    'Legally compliant lease documentation',
                    'Timely rent collection and detailed financial reporting',
                    'Proactive maintenance and property preservation',
                  ].map((item, index) => (
                    <ListItem key={index} disablePadding sx={{ mb: 1 }}>
                      <ListItemIcon>
                        <CheckCircleOutlineIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={item} />
                    </ListItem>
                  ))}
                </List>

                <Button
                  variant="contained"
                  size="large"
                  sx={{ mt: 3 }}
                  onClick={() => router.push('/contact')}
                >
                  Discuss Your Property Needs
                </Button>
              </Grid>

              {/* Service Options for Landlords */}
              <Grid item xs={12} sx={{ mt: 4 }}>
                <Typography variant="h5" component="h3" gutterBottom>
                  Our Property Owner Services
                </Typography>
                <Divider sx={{ mb: 4 }} />

                <Grid container spacing={4}>
                  {[
                    {
                      title: 'Tenant Placement',
                      icon: <PersonIcon fontSize="large" color="primary" />,
                      description:
                        'Finding high-quality tenants through marketing, thorough screening, and matching to your property.',
                      features: [
                        'Property marketing',
                        'Prospect screening',
                        'Background checks',
                        'Lease preparation',
                      ],
                    },
                    {
                      title: 'Full Property Management',
                      icon: <BusinessIcon fontSize="large" color="primary" />,
                      description:
                        'Comprehensive end-to-end management of your rental property, handling all aspects of daily operations.',
                      features: [
                        'Tenant relations',
                        'Maintenance coordination',
                        'Rent collection',
                        'Financial reporting',
                      ],
                    },
                    {
                      title: 'Financial Management',
                      icon: (
                        <MonetizationOnIcon fontSize="large" color="primary" />
                      ),
                      description:
                        'Expert handling of all financial aspects of your rental property to maximize returns.',
                      features: [
                        'Rent optimization',
                        'Expense tracking',
                        'Monthly statements',
                        'Tax documentation',
                      ],
                    },
                    {
                      title: 'Maintenance Services',
                      icon: (
                        <SupportAgentIcon fontSize="large" color="primary" />
                      ),
                      description: `Proactive and responsive maintenance to preserve your property's condition and value.`,
                      features: [
                        '24/7 emergency response',
                        'Vendor management',
                        'Preventive maintenance',
                        'Property inspections',
                      ],
                    },
                  ].map((service, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Card sx={{ height: '100%' }}>
                        <CardContent>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 2,
                            }}
                          >
                            {service.icon}
                            <Typography
                              variant="h6"
                              component="h4"
                              sx={{ ml: 2 }}
                            >
                              {service.title}
                            </Typography>
                          </Box>
                          <Typography variant="body2" paragraph>
                            {service.description}
                          </Typography>
                          <Divider sx={{ my: 2 }} />
                          <Typography variant="subtitle2" gutterBottom>
                            Includes:
                          </Typography>
                          <List dense>
                            {service.features.map((feature, i) => (
                              <ListItem key={i} disablePadding sx={{ mb: 0.5 }}>
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                  <CheckCircleOutlineIcon
                                    color="primary"
                                    fontSize="small"
                                  />
                                </ListItemIcon>
                                <ListItemText primary={feature} />
                              </ListItem>
                            ))}
                          </List>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              {/* Landlord FAQs */}
              <Grid item xs={12} sx={{ mt: 4 }}>
                <Typography variant="h5" component="h3" gutterBottom>
                  Frequently Asked Questions - For Property Owners
                </Typography>
                <Divider sx={{ mb: 4 }} />

                {[
                  {
                    question:
                      'What fees are associated with property management services?',
                    answer: `Our fee structure is transparent and typically includes a percentage of the monthly rent (usually 8-12% depending on services required and property size) for full management services, and/or a tenant placement fee (often equivalent to one month's rent). We provide a detailed breakdown of all fees during our initial consultation.`,
                  },
                  {
                    question: 'How do you screen potential tenants?',
                    answer:
                      'Our comprehensive screening process includes credit checks, criminal background verification, employment verification, income validation (requiring income of 3x the monthly rent), previous rental history checks, and personal references. This thorough approach helps us identify reliable, qualified tenants for your property.',
                  },
                  {
                    question:
                      'How quickly can you find tenants for my property?',
                    answer:
                      'The timeline varies depending on market conditions, property location, condition, and pricing. On average, we place qualified tenants within 2-4 weeks. Our strategic marketing and extensive network help minimize vacancy periods while ensuring quality tenants.',
                  },
                  {
                    question: 'How do you handle maintenance and repairs?',
                    answer:
                      'We maintain relationships with trusted, licensed contractors who provide quality work at reasonable rates. For minor repairs (typically under $500), we handle them promptly without owner approval to minimize tenant inconvenience. For larger issues, we provide you with estimates and recommendations before proceeding. Emergency repairs are addressed immediately to protect your property.',
                  },
                  {
                    question: `What happens if a tenant doesn't pay rent?`,
                    answer: `We have a structured process for handling non-payment. This includes immediate communication with the tenant, formal notices as required by law, and if necessary, initiation of eviction proceedings. Our thorough screening process helps minimize these occurrences, but when they happen, we act quickly to protect your interests and income.`,
                  },
                ].map((faq, index) => (
                  <Accordion key={index} sx={{ mb: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {faq.question}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2">{faq.answer}</Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Grid>
            </Grid>
          )}
        </div>
      </Container>

      {/* Call to Action */}
      <Box sx={{ bgcolor: 'background.default', py: 8 }}>
        <Container maxWidth="md">
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
            <ApartmentIcon
              sx={{ fontSize: 60, color: 'primary.main', mb: 2 }}
            />
            <Typography variant="h4" gutterBottom>
              {tabValue === 0
                ? 'Ready to Find Your Perfect Rental?'
                : 'Ready to Optimize Your Rental Property?'}
            </Typography>
            <Typography
              color="text.secondary"
              paragraph
              sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}
            >
              {tabValue === 0
                ? 'Let our rental specialists help you find the perfect home that meets all your needs and preferences.'
                : 'Our property management experts can help maximize your returns while minimizing your stress and workload.'}
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              <Grid item>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => router.push('/contact')}
                >
                  {tabValue === 0
                    ? 'Start Your Rental Search'
                    : 'Get Property Management Quote'}
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() =>
                    tabValue === 0
                      ? router.push('/properties')
                      : router.push('/services')
                  }
                >
                  {tabValue === 0
                    ? 'Browse Available Rentals'
                    : 'Explore Other Services'}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}
