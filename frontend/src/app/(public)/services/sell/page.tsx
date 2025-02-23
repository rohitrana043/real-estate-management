// src/app/(public)/services/sell/page.tsx
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
  CardMedia,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSettings } from '@/contexts/SettingsContext';
import { translations } from '@/translations';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SellIcon from '@mui/icons-material/Sell';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import BusinessIcon from '@mui/icons-material/Business';
import EqualizerIcon from '@mui/icons-material/Equalizer';

export default function SellPropertyPage() {
  const router = useRouter();
  const { language } = useSettings();
  const t = translations[language];

  const sellingSteps = [
    {
      label: 'Property Evaluation',
      description:
        'We conduct a comprehensive assessment of your property, analyzing its features, condition, and market position to determine an optimal listing price.',
    },
    {
      label: 'Preparation & Staging',
      description: `Our team provides recommendations for repairs, improvements, and staging that will maximize your property's appeal to potential buyers.`,
    },
    {
      label: 'Professional Marketing',
      description:
        'We create a tailored marketing strategy including professional photography, virtual tours, detailed listings, and targeted advertising to reach qualified buyers.',
    },
    {
      label: 'Showing Management',
      description:
        'We handle scheduling and conducting property showings, open houses, and follow-ups with potential buyers to gather valuable feedback.',
    },
    {
      label: 'Offer Negotiation',
      description:
        'Our expert negotiators work to secure the best possible terms and price, carefully reviewing all offers and advising you on the strongest options.',
    },
    {
      label: 'Closing Process',
      description:
        'We guide you through inspections, appraisals, and paperwork, coordinating with attorneys and other parties to ensure a smooth closing.',
    },
  ];

  const marketingServices = [
    {
      title: 'Professional Photography & Virtual Tours',
      description: `High-quality images and immersive 3D tours that showcase your property's best features and give buyers a realistic preview.`,
      image: 'https://robohash.org/photo-tour?set=set4&bgset=&size=400x300',
    },
    {
      title: 'Strategic Online Presence',
      description:
        'Optimized listings on major real estate platforms, our website, and social media to maximize visibility to potential buyers.',
      image: 'https://robohash.org/online-listing?set=set4&bgset=&size=400x300',
    },
    {
      title: 'Print & Direct Marketing',
      description:
        'Professionally designed brochures, feature sheets, and targeted direct mail campaigns to reach specific buyer demographics.',
      image:
        'https://robohash.org/print-marketing?set=set4&bgset=&size=400x300',
    },
    {
      title: 'Network & Database Marketing',
      description:
        'Promotion to our extensive network of potential buyers, investors, and fellow agents who may have interested clients.',
      image:
        'https://robohash.org/network-marketing?set=set4&bgset=&size=400x300',
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
          backgroundImage:
            'url("https://robohash.org/selling-hero?set=set4&bgset=&size=400x400")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
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
            Sell Your Property
          </Typography>
          <Typography variant="h5" textAlign="center" sx={{ mb: 4 }}>
            Maximize Your Value with Our Expert Selling Services
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
              onClick={() => router.push('/contact')}
            >
              Request a Property Valuation
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Introduction Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="https://robohash.org/sell-service?set=set4&bgset=&size=500x500"
              alt="Property sold sign"
              sx={{
                width: '100%',
                borderRadius: 2,
                boxShadow: 3,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h2" gutterBottom>
              Why Choose Us to Sell Your Property
            </Typography>
            <Typography variant="body1" paragraph>
              Selling your property is a significant financial decision. Our
              experienced team combines market knowledge, innovative marketing
              strategies, and negotiation expertise to achieve the best possible
              outcome for your sale.
            </Typography>
            <Typography variant="body1" paragraph>
              We understand that every property and seller has unique needs.
              That's why we create a customized selling strategy for each
              client, designed to maximize value while meeting your timeline and
              goals.
            </Typography>

            <List>
              {[
                'Strategic pricing based on comprehensive market analysis',
                'Premium marketing packages to showcase your property',
                'Wide exposure to qualified buyers through multiple channels',
                'Expert negotiation to secure the best terms and price',
                'Seamless transaction management from listing to closing',
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
        </Grid>
      </Container>

      {/* Selling Process Steps */}
      <Box sx={{ bgcolor: 'background.default', py: 8 }}>
        <Container maxWidth="md">
          <Typography
            variant="h4"
            component="h2"
            textAlign="center"
            gutterBottom
          >
            Our Selling Process
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 6 }}
          >
            A strategic, step-by-step approach to selling your property for
            maximum value
          </Typography>

          <Stepper orientation="vertical">
            {sellingSteps.map((step, index) => (
              <Step key={index} active={true}>
                <StepLabel>
                  <Typography variant="h6">{step.label}</Typography>
                </StepLabel>
                <StepContent>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ py: 2 }}
                  >
                    {step.description}
                  </Typography>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Container>
      </Box>

      {/* Marketing Strategy */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom>
          Premium Marketing Strategy
        </Typography>
        <Typography
          variant="body1"
          textAlign="center"
          color="text.secondary"
          sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}
        >
          Our comprehensive marketing approach ensures maximum visibility to
          qualified buyers
        </Typography>

        <Grid container spacing={4}>
          {marketingServices.map((service, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={service.image}
                  alt={service.title}
                />
                <CardContent>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {service.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {service.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Specialized Services */}
      <Box sx={{ bgcolor: 'background.default', py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            component="h2"
            textAlign="center"
            gutterBottom
          >
            Specialized Selling Services
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}
          >
            Tailored approaches for different types of properties and selling
            situations
          </Typography>

          <Grid container spacing={4}>
            {[
              {
                title: 'Luxury Property Marketing',
                icon: (
                  <BusinessIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                ),
                description:
                  'Distinguished marketing strategies for high-end properties, targeting affluent buyers through exclusive channels.',
                features: [
                  'Exclusive luxury property network access',
                  'High-end photography and videography',
                  'Private showings and exclusive events',
                  'International buyer targeting',
                ],
              },
              {
                title: 'Investment Property Sales',
                icon: (
                  <TrendingUpIcon
                    sx={{ fontSize: 40, color: 'primary.main' }}
                  />
                ),
                description:
                  'Strategic marketing and valuation for investment properties, highlighting ROI potential and financial benefits.',
                features: [
                  'Detailed financial analysis and ROI projections',
                  'Targeting of qualified investors',
                  'Comprehensive cash flow assessments',
                  'Portfolio sale coordination',
                ],
              },
              {
                title: 'Renovation & Staging Services',
                icon: (
                  <PhotoCameraIcon
                    sx={{ fontSize: 40, color: 'primary.main' }}
                  />
                ),
                description: `Enhancement services to maximize your property's visual appeal and market value before listing.`,
                features: [
                  'Pre-listing renovation consultation',
                  'Professional staging services',
                  'Virtual staging options',
                  'Contractor coordination',
                ],
              },
              {
                title: 'Market Analysis Reports',
                icon: (
                  <EqualizerIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                ),
                description:
                  'Comprehensive market evaluation to determine optimal pricing strategy and marketing approach.',
                features: [
                  'Comparative market analysis',
                  'Neighborhood trend assessment',
                  'Price point optimization',
                  'Timing strategy recommendations',
                ],
              },
            ].map((service, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Paper sx={{ p: 4, height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {service.icon}
                    <Typography variant="h5" component="h3" sx={{ ml: 2 }}>
                      {service.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" paragraph>
                    {service.description}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
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
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials */}
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom>
          Success Stories
        </Typography>
        <Typography
          variant="body1"
          textAlign="center"
          color="text.secondary"
          sx={{ mb: 6 }}
        >
          Hear from clients who successfully sold their properties with us
        </Typography>

        <Grid container spacing={4}>
          {[
            {
              quote:
                'We listed our home with this team after it sat on the market for months with another agency. They refreshed our marketing, suggested strategic updates, and we had multiple offers within two weeks!',
              author: 'Thomas & Rebecca Chen',
              property: '4-bedroom house in Westfield',
              result: 'Sold for 8% above asking price',
            },
            {
              quote:
                'Selling my investment property portfolio seemed daunting until I worked with this team. Their market knowledge and investor network helped me secure excellent terms across all properties.',
              author: 'Michael Rodriguez',
              property: 'Multi-unit investment properties',
              result: 'Sold within 45 days at target price',
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
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {testimonial.author}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {testimonial.property}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="primary"
                    fontWeight="medium"
                  >
                    {testimonial.result}
                  </Typography>
                </Box>
              </Paper>
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
            Common questions about selling your property
          </Typography>

          {[
            {
              question: 'When is the best time to sell my property?',
              answer:
                'While spring and early fall are traditionally strong selling seasons, the ideal timing depends on multiple factors including your local market conditions, property type, and personal circumstances. We provide a personalized analysis to recommend optimal timing for your specific situation.',
            },
            {
              question:
                'How do you determine the listing price for my property?',
              answer: `We conduct a comprehensive Comparative Market Analysis (CMA) that evaluates recent sales of similar properties, current market conditions, your property's unique features and condition, and broader economic factors. This data-driven approach ensures your property is priced competitively to attract serious buyers while maximizing your return.`,
            },
            {
              question: 'What improvements should I make before selling?',
              answer:
                'We provide a detailed pre-listing consultation to identify strategic improvements that offer the highest return on investment. Often, minor updates like fresh paint, landscaping, and decluttering yield the best results. Our recommendations balance potential value increase against your budget and timeline.',
            },
            {
              question: 'How long will it take to sell my property?',
              answer: `The timeline varies based on market conditions, property type, location, price point, and condition. In our current market, well-priced properties typically receive offers within 30 days, with closing occurring 30-45 days later. We'll provide a more specific timeline based on your property's unique characteristics.`,
            },
            {
              question: 'What costs are involved in selling my property?',
              answer: `Typical selling costs include agent commissions (typically 5-6% split between listing and buyer's agents), closing costs (1-3% of the sale price), potential repair costs from inspections, possible staging costs, and any agreed-upon buyer concessions. We provide a detailed net proceeds estimate so you understand exactly what to expect.`,
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
          <SellIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Ready to Sell Your Property?
          </Typography>
          <Typography
            color="text.secondary"
            paragraph
            sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}
          >
            Let our expert team help you maximize your property's value and
            ensure a smooth selling process. Schedule a free property valuation
            today.
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button
                variant="contained"
                size="large"
                onClick={() => router.push('/contact')}
              >
                Request Property Valuation
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                size="large"
                onClick={() => router.push('/services')}
              >
                Explore Other Services
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}
