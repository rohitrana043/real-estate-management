// src/components/layout/Footer.tsx
'use client';

import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  Stack,
  Button,
  TextField,
  useTheme,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  LocationOn,
  Phone,
  Email,
  ArrowForward,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useSettings } from '@/contexts/SettingsContext';
import { translations } from '@/translations';
import { validateEmail } from '@/lib/validation/newsletter';
import newsletterApi from '@/lib/api/newsletter';

export default function Footer() {
  const router = useRouter();
  const theme = useTheme();
  const { language } = useSettings();
  const t = translations[language];
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const quickLinks = [
    { title: t.common.home, href: '/' },
    { title: t.common.properties, href: '/properties' },
    { title: t.common.services, href: '/services' },
    { title: t.common.about, href: '/about' },
    { title: t.common.contact, href: '/contact' },
  ];

  const services = [
    { title: t.footer.buyProperty, href: '/services/buy' },
    { title: t.footer.sellProperty, href: '/services/sell' },
    { title: t.footer.rentProperty, href: '/services/rent' },
    { title: t.footer.marketAnalysis, href: '/services/analysis' },
  ];

  const socialLinks = [
    { icon: <Facebook />, href: 'https://facebook.com', label: 'Facebook' },
    { icon: <Twitter />, href: 'https://twitter.com', label: 'Twitter' },
    { icon: <Instagram />, href: 'https://instagram.com', label: 'Instagram' },
    { icon: <LinkedIn />, href: 'https://linkedin.com', label: 'LinkedIn' },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email
    const validation = validateEmail(email);
    if (!validation.isValid) {
      setEmailError(validation.error || 'Invalid email');
      return;
    }

    setLoading(true);
    setEmailError('');

    try {
      await newsletterApi.subscribe(email);

      setSubscribeSuccess(true);
      setEmail('');
      enqueueSnackbar(
        t.newsletter.successMessage || 'Successfully subscribed to newsletter!',
        {
          variant: 'success',
        }
      );
    } catch (error: any) {
      console.error('Newsletter subscription error:', error);

      if (error.apiError?.errors?.email) {
        setEmailError(error.apiError.errors.email);
      }

      enqueueSnackbar(
        error.apiError?.message ||
          t.newsletter.errorMessage ||
          'Failed to subscribe. Please try again.',
        {
          variant: 'error',
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) {
      setEmailError('');
    }
    if (subscribeSuccess) {
      setSubscribeSuccess(false);
    }
  };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor:
          theme.palette.mode === 'dark' ? 'background.paper' : 'grey.100',
        borderTop: 1,
        borderColor: 'divider',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              component="div"
              color="primary"
              sx={{ fontWeight: 700, mb: 2, cursor: 'pointer' }}
              onClick={() => handleNavigation('/')}
            >
              RealEstate
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {t.footer.companyDescription}
            </Typography>
            <Stack direction="row" spacing={1}>
              {socialLinks.map((social, index) => (
                <IconButton
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  color="primary"
                  sx={{
                    '&:hover': {
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                    },
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" color="primary" gutterBottom>
              {t.footer.quickLinks}
            </Typography>
            <Stack spacing={1}>
              {quickLinks.map((link) => (
                <Link
                  key={link.title}
                  component="button"
                  variant="body2"
                  onClick={() => handleNavigation(link.href)}
                  color="text.secondary"
                  sx={{
                    textAlign: 'left',
                    textDecoration: 'none',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  {link.title}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Services */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" color="primary" gutterBottom>
              {t.footer.services}
            </Typography>
            <Stack spacing={1}>
              {services.map((service) => (
                <Link
                  key={service.title}
                  component="button"
                  variant="body2"
                  onClick={() => handleNavigation(service.href)}
                  color="text.secondary"
                  sx={{
                    textAlign: 'left',
                    textDecoration: 'none',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  {service.title}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Newsletter */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="primary" gutterBottom>
              {t.footer.newsletter}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {t.footer.newsletterDescription}
            </Typography>

            <Box component="form" noValidate onSubmit={handleNewsletterSubmit}>
              {subscribeSuccess && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {t.newsletter.successAlert}
                </Alert>
              )}

              <Stack spacing={2}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder={t.newsletter.emailPlaceholder}
                  value={email}
                  onChange={handleEmailChange}
                  error={!!emailError}
                  helperText={emailError}
                  disabled={loading}
                  sx={{
                    bgcolor: 'background.paper',
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-error': {
                        backgroundColor: 'error.light',
                      },
                    },
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                  endIcon={!loading && <ArrowForward />}
                  fullWidth
                  sx={{ mt: 1 }}
                >
                  {loading ? t.common.loading : t.newsletter.subscribeButton}
                </Button>
              </Stack>
            </Box>
          </Grid>
        </Grid>

        {/* Contact Information */}
        <Box sx={{ mt: 4, pt: 4, borderTop: 1, borderColor: 'divider' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Stack direction="row" spacing={1} alignItems="center">
                <LocationOn color="primary" />
                <Typography variant="body2" color="text.secondary">
                  123 Real Estate St, City, Country
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Phone color="primary" />
                <Typography variant="body2" color="text.secondary">
                  +1 234 567 8900
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Email color="primary" />
                <Typography variant="body2" color="text.secondary">
                  info@realestate.com
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Box>

        {/* Copyright */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} RealEstate.{' '}
            {t.footer.allRightsReserved}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
