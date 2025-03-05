// src/app/(public)/services/buy/page.tsx
'use client';

import { useSettings } from '@/contexts/SettingsContext';
import { translations } from '@/translations';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HandshakeIcon from '@mui/icons-material/Handshake';
import HomeIcon from '@mui/icons-material/Home';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import SearchIcon from '@mui/icons-material/Search';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';

export default function BuyPropertyPage() {
  const router = useRouter();
  const { language } = useSettings();
  const t = translations[language];

  const buyingProcess = [
    {
      title: 'Initial Consultation',
      icon: <AssignmentIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      description:
        'We start by understanding your needs, preferences, and budget to create a personalized home buying strategy.',
    },
    {
      title: 'Property Search',
      icon: <SearchIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      description:
        'Using our extensive network and resources, we identify properties that match your criteria and arrange viewings.',
    },
    {
      title: 'Financial Guidance',
      icon: <MonetizationOnIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      description: `We help you navigate mortgage options, connect with trusted lenders, and ensure you're financially prepared.`,
    },
    {
      title: 'Closing the Deal',
      icon: <HandshakeIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      description:
        'From offer negotiation to closing paperwork, we ensure a smooth transaction process every step of the way.',
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
          backgroundImage: 'url("/images/services-buy-bg.jpg")',
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
            Find Your Dream Home
          </Typography>
          <Typography variant="h5" textAlign="center" sx={{ mb: 4 }}>
            Expert Guidance Throughout Your Home Buying Journey
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
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
              onClick={() => router.push('/properties')}
            >
              Browse Available Properties
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Introduction Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h2" gutterBottom>
              Why Choose Us for Your Home Purchase
            </Typography>
            <Typography variant="body1" paragraph>
              Buying a home is one of the most significant investments you'll
              make. Our experienced team is dedicated to making your home buying
              experience seamless and successful.
            </Typography>
            <Typography variant="body1" paragraph>
              Whether you're a first-time homebuyer or a seasoned investor, we
              provide personalized guidance and insider knowledge to help you
              find the perfect property at the right price.
            </Typography>

            <List>
              {[
                'Access to exclusive property listings before they hit the market',
                'Expert negotiation to secure the best possible price',
                'Thorough property evaluations to identify potential issues',
                'Comprehensive understanding of neighborhood trends and values',
                'Streamlined paperwork and closing process',
              ].map((item, index) => (
                <ListItem key={index} disablePadding sx={{ mb: 1 }}>
                  <ListItemIcon>
                    <CheckCircleOutlineIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="/images/house-search.svg"
              alt="Happy family buying home"
              sx={{
                width: '100%',
              }}
            />
          </Grid>
        </Grid>
      </Container>

      {/* Our Process Section */}
      <Box sx={{ bgcolor: 'background.default', py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            component="h2"
            textAlign="center"
            gutterBottom
          >
            Our Home Buying Process
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}
          >
            We've streamlined the home buying process to make your journey as
            smooth as possible
          </Typography>

          <Grid container spacing={4}>
            {buyingProcess.map((step, index) => (
              <Grid item xs={12} md={6} lg={3} key={index}>
                <Paper sx={{ p: 3, height: '100%', textAlign: 'center' }}>
                  <Box sx={{ mb: 2 }}>{step.icon}</Box>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {step.title}
                  </Typography>
                  <Typography variant="body2">{step.description}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Buyer Types Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom>
          Specialized Buying Services
        </Typography>
        <Typography
          variant="body1"
          textAlign="center"
          color="text.secondary"
          sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}
        >
          We offer tailored approaches for different types of home buyers
        </Typography>

        <Grid container spacing={4}>
          {[
            {
              title: 'First-Time Home Buyers',
              description:
                'Comprehensive guidance for those navigating the home buying process for the first time, including education on all aspects of homeownership.',
              features: [
                'Educational resources about the buying process',
                'First-time homebuyer program assistance',
                'Budget-friendly property recommendations',
                'Detailed explanations at every step',
              ],
            },
            {
              title: 'Luxury Home Buyers',
              description:
                'White-glove service for discerning clients seeking premium properties with exclusive features and amenities.',
              features: [
                'Access to off-market luxury listings',
                'Discreet and confidential service',
                'Expert knowledge of premium neighborhoods',
                'Connections with high-end property developers',
              ],
            },
            {
              title: 'Investors',
              description:
                'Strategic guidance for those looking to build or expand their real estate investment portfolio with promising properties.',
              features: [
                'ROI analysis and investment projections',
                'Market trend insights for maximum appreciation',
                'Rental income potential assessment',
                'Portfolio diversification strategy',
              ],
            },
            {
              title: 'Relocating Buyers',
              description:
                'Specialized support for individuals and families moving to a new city or region, with comprehensive area information.',
              features: [
                'Virtual property tours for remote buyers',
                'Detailed neighborhood and community information',
                'Local lifestyle and amenities guidance',
                'Relocation logistics coordination',
              ],
            },
          ].map((service, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography
                    variant="h5"
                    component="h3"
                    gutterBottom
                    color="primary"
                  >
                    {service.title}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {service.description}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    gutterBottom
                  >
                    Key Features:
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
      </Container>

      {/* FAQs Section */}
      <Box sx={{ bgcolor: 'background.default', py: 8 }}>
        <Container maxWidth="md">
          <Typography
            variant="h4"
            component="h2"
            textAlign="center"
            gutterBottom
          >
            Frequently Asked Questions
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 6 }}
          >
            Common questions about the home buying process
          </Typography>

          {[
            {
              question: `How much do I need for a down payment?`,
              answer:
                'Down payment requirements vary depending on the type of mortgage, property, and your financial situation. Conventional loans typically require 5-20% down, while some government-backed loans may allow as little as 3.5% or even 0% down. We can help connect you with lenders to determine the best option for your situation.',
            },
            {
              question: 'How long does the home buying process take?',
              answer:
                'The timeline varies, but typically takes 30-90 days from offer acceptance to closing. Factors affecting this include mortgage approval, property inspections, appraisals, and any negotiations or repairs needed.',
            },
            {
              question:
                'What additional costs should I budget for beyond the purchase price?',
              answer:
                'Beyond the home price, buyers should budget for closing costs (typically 2-5% of the loan amount), home inspection fees, appraisal fees, moving expenses, and potential immediate repairs or renovations. We provide a detailed cost breakdown early in the process.',
            },
            {
              question:
                'Should I get pre-approved for a mortgage before looking at homes?',
              answer:
                'Yes, we strongly recommend getting pre-approved before beginning your home search. Pre-approval gives you a clear budget, strengthens your offer in competitive markets, and streamlines the purchase process once you find the right home.',
            },
            {
              question: `What's the difference between a buyer's agent and a seller's agent?`,
              answer: `A buyer's agent represents your interests exclusively, while a seller's agent represents the seller. As your buyer's agent, we have a fiduciary duty to negotiate the best terms for you, point out potential property issues, and keep your information confidential.`,
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
        </Container>
      </Box>

      {/* Call to Action */}
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
          <HomeIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Ready to Find Your Dream Home?
          </Typography>
          <Typography
            color="text.secondary"
            paragraph
            sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}
          >
            Let our expert team guide you through every step of the home buying
            process. Schedule a consultation today to get started on your
            journey to homeownership.
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button
                variant="contained"
                size="large"
                onClick={() => router.push('/contact')}
              >
                Contact Us
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                size="large"
                onClick={() => router.push('/properties')}
              >
                Browse Properties
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}
