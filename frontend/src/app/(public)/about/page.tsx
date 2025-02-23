// src/app/(public)/about/page.tsx
'use client';

import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Avatar,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { useSettings } from '@/contexts/SettingsContext';
import { translations } from '@/translations';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import HandshakeIcon from '@mui/icons-material/Handshake';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

export default function AboutPage() {
  const { language } = useSettings();
  const t = translations[language];

  const stats = [
    {
      value: '15+',
      label: 'Years of Experience',
      icon: <HomeWorkIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    },
    {
      value: '1,200+',
      label: 'Properties Sold',
      icon: <HandshakeIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    },
    {
      value: '24',
      label: 'Industry Awards',
      icon: <EmojiEventsIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    },
  ];

  const teamMembers = [
    {
      name: 'John Smith',
      role: 'CEO & Founder',
      bio: 'John has over 20 years of experience in real estate and has helped hundreds of families find their dream homes.',
      avatar: 'https://robohash.org/john-smith?set=set4&bgset=&size=200x200',
    },
    {
      name: 'Sarah Johnson',
      role: 'Head of Sales',
      bio: 'With her exceptional negotiation skills, Sarah has consistently exceeded client expectations for the past 10 years.',
      avatar: 'https://robohash.org/sarah-johnson?set=set4&bgset=&size=200x200',
    },
    {
      name: 'Michael Chen',
      role: 'Property Consultant',
      bio: 'Michael specializes in luxury properties and has an eye for finding unique investment opportunities for his clients.',
      avatar: 'https://robohash.org/michael-chen?set=set4&bgset=&size=200x200',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Marketing Director',
      bio: 'Emily brings creativity and innovation to our marketing strategies, ensuring maximum visibility for our properties.',
      avatar:
        'https://robohash.org/emily-rodriguez?set=set4&bgset=&size=200x200',
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
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            fontWeight="bold"
          >
            About Us
          </Typography>
          <Typography variant="h5" sx={{ mb: 4 }}>
            Your Trusted Partner in Real Estate Since 2009
          </Typography>
        </Container>
      </Box>

      {/* Company History */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h2" gutterBottom>
              Our Story
            </Typography>
            <Typography variant="body1" paragraph>
              Founded in 2009, RealEstate has grown from a small local agency to
              one of the most trusted real estate companies in the region. Our
              journey began with a simple mission: to help people find homes
              they love and investments that grow.
            </Typography>
            <Typography variant="body1" paragraph>
              Over the years, we've maintained our commitment to personalized
              service while expanding our offerings to meet the evolving needs
              of our clients. Today, we're proud to have helped thousands of
              families, investors, and businesses make informed real estate
              decisions.
            </Typography>
            <Typography variant="body1">
              What sets us apart is our dedicated team of professionals who
              combine industry expertise with genuine care for our clients'
              needs. We believe in building lasting relationships based on
              trust, integrity, and exceptional results.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="https://robohash.org/about-company?set=set4&bgset=&size=500x500"
              alt="Company building"
              sx={{
                width: '100%',
                borderRadius: 2,
                boxShadow: 3,
              }}
            />
          </Grid>
        </Grid>
      </Container>

      {/* Stats Section */}
      <Box sx={{ bgcolor: 'background.default', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {stats.map((stat) => (
              <Grid item key={stat.label} xs={12} md={4}>
                <Paper
                  sx={{
                    p: 4,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  {stat.icon}
                  <Typography
                    variant="h3"
                    component="div"
                    sx={{ fontWeight: 700, my: 2 }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Mission & Values */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom>
          Our Mission & Values
        </Typography>
        <Typography
          variant="body1"
          textAlign="center"
          color="text.secondary"
          sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}
        >
          We're committed to excellence in every aspect of our business, guided
          by a set of core principles that define who we are.
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography
                  variant="h5"
                  component="h3"
                  gutterBottom
                  color="primary"
                >
                  Integrity
                </Typography>
                <Typography variant="body1">
                  We conduct our business with honesty and transparency, always
                  putting our clients' interests first. We believe that building
                  trust is the foundation of lasting relationships.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography
                  variant="h5"
                  component="h3"
                  gutterBottom
                  color="primary"
                >
                  Excellence
                </Typography>
                <Typography variant="body1">
                  We strive for excellence in everything we do, from the
                  properties we represent to the service we provide. Our
                  attention to detail and commitment to quality set us apart.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography
                  variant="h5"
                  component="h3"
                  gutterBottom
                  color="primary"
                >
                  Innovation
                </Typography>
                <Typography variant="body1">
                  We embrace technology and innovative approaches to improve the
                  real estate experience. We're constantly evolving to better
                  serve our clients in a changing market.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Team Section */}
      <Box sx={{ bgcolor: 'background.default', py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            component="h2"
            textAlign="center"
            gutterBottom
          >
            Meet Our Team
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}
          >
            Our success is driven by our talented team of professionals who are
            passionate about real estate and dedicated to your success.
          </Typography>

          <Grid container spacing={4}>
            {teamMembers.map((member) => (
              <Grid item key={member.name} xs={12} sm={6} md={3}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Avatar
                      src={member.avatar}
                      alt={member.name}
                      sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                    />
                    <Typography variant="h6" component="h3" gutterBottom>
                      {member.name}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      color="primary"
                      gutterBottom
                    >
                      {member.role}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                      {member.bio}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
