// src/app/(public)/services/analysis/page.tsx
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
} from '@mui/material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSettings } from '@/contexts/SettingsContext';
import { translations } from '@/translations';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SearchIcon from '@mui/icons-material/Search';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import ShowChartIcon from '@mui/icons-material/ShowChart';

export default function MarketAnalysisPage() {
  const router = useRouter();
  const { language } = useSettings();
  const t = translations[language];

  const analysisServices = [
    {
      title: 'Comprehensive Market Reports',
      icon: <AssessmentIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      description:
        'Detailed analysis of market trends, property values, and future projections for specific neighborhoods or property types.',
      image: 'https://robohash.org/market-report?set=set4&bgset=&size=400x300',
      features: [
        'Price trend analysis by neighborhood',
        'Supply and demand metrics',
        'Seasonal market fluctuations',
        'Economic impact factors',
      ],
    },
    {
      title: 'Investment Opportunity Analysis',
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      description:
        'Evaluation of potential investment properties with ROI projections, risk assessment, and growth potential.',
      image:
        'https://robohash.org/investment-analysis?set=set4&bgset=&size=400x300',
      features: [
        'Cash flow projections',
        'Appreciation potential',
        'Risk factor assessment',
        'Comparative investment options',
      ],
    },
    {
      title: 'Buyer/Seller Market Intelligence',
      icon: <SearchIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      description:
        'Strategic insights for buyers and sellers to make informed decisions based on current market conditions.',
      image:
        'https://robohash.org/market-intelligence?set=set4&bgset=&size=400x300',
      features: [
        'Pricing strategy recommendations',
        'Negotiation leverage points',
        'Optimal timing analysis',
        'Competitive property comparisons',
      ],
    },
    {
      title: 'Demographic and Lifestyle Analysis',
      icon: <PeopleIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      description:
        'Understanding population trends, community profiles, and lifestyle patterns that impact property values.',
      image:
        'https://robohash.org/demographic-analysis?set=set4&bgset=&size=400x300',
      features: [
        'Population growth projections',
        'Income and employment trends',
        'Lifestyle and amenity preferences',
        'Development impact forecasting',
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
          backgroundImage:
            'url("https://robohash.org/analysis-hero?set=set4&bgset=&size=400x400")',
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
            Real Estate Market Analysis
          </Typography>
          <Typography variant="h5" textAlign="center" sx={{ mb: 4 }}>
            Make Data-Driven Decisions with Our Expert Market Insights
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
              Request Market Analysis
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Introduction Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h2" gutterBottom>
              Data-Driven Real Estate Decisions
            </Typography>
            <Typography variant="body1" paragraph>
              In today's dynamic real estate market, accurate information and
              expert analysis are essential for making sound decisions. Our
              comprehensive market analysis services provide you with the
              insights needed to navigate complex real estate landscapes
              confidently.
            </Typography>
            <Typography variant="body1" paragraph>
              Whether you're buying your first home, selling an investment
              property, or building a real estate portfolio, our tailored
              analysis services give you a competitive edge through data-driven
              strategies and local market expertise.
            </Typography>

            <List>
              {[
                'Customized reports based on your specific needs and goals',
                'Combination of advanced analytics and local market expertise',
                'Regular updates to reflect rapidly changing market conditions',
                'Actionable insights that translate into strategic advantages',
                'Clear, accessible presentation of complex market data',
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
              src="https://robohash.org/market-analysis?set=set4&bgset=&size=500x500"
              alt="Market analysis charts"
              sx={{
                width: '100%',
                borderRadius: 2,
                boxShadow: 3,
              }}
            />
          </Grid>
        </Grid>
      </Container>

      {/* Analysis Services */}
      <Box sx={{ bgcolor: 'background.default', py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            component="h2"
            textAlign="center"
            gutterBottom
          >
            Our Analysis Services
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}
          >
            Comprehensive market intelligence tailored to your specific real
            estate needs
          </Typography>

          <Grid container spacing={4}>
            {analysisServices.map((service, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={service.image}
                    alt={service.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
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
                    <Typography variant="subtitle2" gutterBottom>
                      Key Components:
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
      </Box>

      {/* Our Analysis Process */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom>
          Our Analysis Process
        </Typography>
        <Typography
          variant="body1"
          textAlign="center"
          color="text.secondary"
          sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}
        >
          How we develop comprehensive market insights tailored to your needs
        </Typography>

        <Grid container spacing={4}>
          {[
            {
              title: 'Initial Consultation',
              icon: <PeopleIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
              description:
                'We begin by understanding your specific goals, timeline, and requirements to customize our analysis approach.',
            },
            {
              title: 'Data Collection',
              icon: <SearchIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
              description:
                'We gather comprehensive data from multiple sources including MLS, public records, economic indicators, and proprietary databases.',
            },
            {
              title: 'Analysis & Interpretation',
              icon: (
                <BarChartIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              ),
              description:
                'Our experts analyze the data using advanced statistical methods and market expertise to identify relevant trends and insights.',
            },
            {
              title: 'Strategic Recommendations',
              icon: (
                <ShowChartIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              ),
              description:
                'We transform analysis into actionable recommendations aligned with your specific real estate objectives.',
            },
          ].map((step, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
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

      {/* Use Cases */}
      <Box sx={{ bgcolor: 'background.default', py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            component="h2"
            textAlign="center"
            gutterBottom
          >
            How Our Analysis Helps You
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}
          >
            Real-world applications of our market analysis services
          </Typography>

          <Grid container spacing={4}>
            {[
              {
                title: 'For Homebuyers',
                description:
                  'Make confident purchasing decisions with neighborhood-specific insights, price trend analysis, and future value projections.',
                features: [
                  'Identify undervalued properties with growth potential',
                  'Understand price fairness in specific neighborhoods',
                  'Recognize the best timing for your purchase',
                  'Assess long-term value retention factors',
                ],
              },
              {
                title: 'For Home Sellers',
                description:
                  'Optimize your selling strategy with accurate pricing guidance, market timing insights, and buyer demand analysis.',
                features: [
                  'Determine optimal listing price points',
                  'Identify the best time to list your property',
                  'Understand buyer preferences in your area',
                  'Highlight valuable property features for marketing',
                ],
              },
              {
                title: 'For Investors',
                description:
                  'Identify high-potential investment opportunities with ROI projections, risk assessments, and market growth forecasts.',
                features: [
                  'Compare investment potential across neighborhoods',
                  'Project rental income and appreciation rates',
                  'Evaluate market stability and risk factors',
                  'Identify emerging market opportunities',
                ],
              },
              {
                title: 'For Developers',
                description:
                  'Make informed development decisions with land value analysis, zoning insights, and future demand projections.',
                features: [
                  'Analyze highest and best use potential',
                  'Assess demographic trends and future demand',
                  'Evaluate competitive landscape for new developments',
                  'Project absorption rates for new properties',
                ],
              },
            ].map((useCase, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography
                      variant="h5"
                      component="h3"
                      gutterBottom
                      color="primary"
                    >
                      {useCase.title}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {useCase.description}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <List dense>
                      {useCase.features.map((feature, i) => (
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
      </Box>

      {/* Sample Reports */}
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom>
          Sample Analysis Reports
        </Typography>
        <Typography
          variant="body1"
          textAlign="center"
          color="text.secondary"
          sx={{ mb: 6 }}
        >
          Examples of our comprehensive market analysis reports
        </Typography>

        <Grid container spacing={4}>
          {[
            {
              title: 'Neighborhood Market Trend Report',
              description:
                'Detailed analysis of price trends, inventory levels, days on market, and comparative metrics for specific neighborhoods.',
              image:
                'https://robohash.org/trend-report?set=set4&bgset=&size=400x300',
            },
            {
              title: 'Investment Property Analysis',
              description:
                'Comprehensive evaluation of potential rental properties with cash flow projections, appreciation forecasts, and risk assessments.',
              image:
                'https://robohash.org/investment-report?set=set4&bgset=&size=400x300',
            },
            {
              title: "Seller's Advantage Report",
              description:
                'Strategic pricing analysis, buyer demand evaluation, and marketing recommendations to maximize property value.',
              image:
                'https://robohash.org/seller-report?set=set4&bgset=&size=400x300',
            },
          ].map((report, index) => (
            <Grid item xs={12} key={index}>
              <Paper sx={{ p: 0, overflow: 'hidden' }}>
                <Grid container>
                  <Grid item xs={12} sm={4}>
                    <Box
                      sx={{
                        height: { xs: 200, sm: '100%' },
                        backgroundImage: `url(${report.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Box sx={{ p: 3 }}>
                      <Typography variant="h6" component="h3" gutterBottom>
                        {report.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        paragraph
                      >
                        {report.description}
                      </Typography>
                      <Button variant="outlined" size="small">
                        View Sample
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
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
            Common questions about our market analysis services
          </Typography>

          {[
            {
              question:
                'How often should I get a market analysis for my property?',
              answer: `For homeowners not actively planning to sell, an annual market analysis helps you track your property's value and equity position. For investors, quarterly analyses are recommended to stay current with rapidly changing market conditions. If you're planning to buy or sell, a current analysis (within the last 30 days) is essential for accurate pricing and negotiation strategies.`,
            },
            {
              question:
                'What information do you need from me for a comprehensive analysis?',
              answer:
                'To create the most accurate analysis, we typically need your property address and details (square footage, bedrooms, bathrooms, recent improvements), your timeline and goals (buying, selling, investing, refinancing), and any specific questions or concerns you have about the market. For investment analyses, information about potential rental income or past performance is also helpful.',
            },
            {
              question:
                'How is your market analysis different from online home value estimators?',
              answer:
                'While online estimators use algorithms based on public records, our analyses combine advanced data analytics with human expertise and local market knowledge. We consider property-specific features, micro-neighborhood trends, current buyer preferences, and qualitative factors that automated systems cannot evaluate. Our reports also include strategic recommendations tailored to your specific goals, not just numerical values.',
            },
            {
              question: 'What is the cost of your market analysis services?',
              answer:
                'We offer several tiers of analysis services to meet different needs and budgets. Basic neighborhood reports start at $249, while comprehensive investment or development analyses range from $499-$999 depending on scope and complexity. For clients working with us on buying or selling properties, we often include appropriate analysis services as part of our overall service package.',
            },
            {
              question: 'How long does it take to complete a market analysis?',
              answer:
                'Standard neighborhood and property analyses are typically completed within 3-5 business days. More complex investment or development analyses may require 7-10 business days for thorough research and evaluation. We also offer expedited services when needed for time-sensitive decisions.',
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
          <AssessmentIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Ready for Expert Market Insights?
          </Typography>
          <Typography
            color="text.secondary"
            paragraph
            sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}
          >
            Get the data-driven analysis you need to make informed real estate
            decisions in today's dynamic market.
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button
                variant="contained"
                size="large"
                onClick={() => router.push('/contact')}
              >
                Request Market Analysis
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
