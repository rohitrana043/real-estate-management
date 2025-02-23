// src/components/newsletter/NewsletterSignup.tsx
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Stack,
  useTheme,
} from '@mui/material';
import { Mail as MailIcon } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { validateEmail } from '@/lib/validation/newsletter';
import newsletterApi from '@/lib/api/newsletter';
import { useSettings } from '@/contexts/SettingsContext';
import { translations } from '@/translations';

interface NewsletterSignupProps {
  variant?: 'inline' | 'card';
  title?: string;
  description?: string;
}

export default function NewsletterSignup({
  variant = 'card',
  title,
  description,
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const { language } = useSettings();
  const t = translations[language];

  const handleSubmit = async (e: React.FormEvent) => {
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
      enqueueSnackbar(t.newsletter.successMessage, { variant: 'success' });
    } catch (error: any) {
      console.error('Newsletter subscription error:', error);

      if (error.apiError?.errors?.email) {
        setEmailError(error.apiError.errors.email);
      }

      enqueueSnackbar(error.apiError?.message || t.newsletter.errorMessage, {
        variant: 'error',
      });
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

  const content = (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {subscribeSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {t.newsletter.successAlert}
        </Alert>
      )}

      {title && (
        <Typography variant="h5" component="h2" gutterBottom>
          {title}
        </Typography>
      )}

      {description && (
        <Typography variant="body1" color="text.secondary" paragraph>
          {description}
        </Typography>
      )}

      <Stack spacing={2}>
        <TextField
          fullWidth
          label={t.newsletter.emailLabel}
          type="email"
          value={email}
          onChange={handleEmailChange}
          error={!!emailError}
          helperText={emailError}
          disabled={loading}
          size={variant === 'inline' ? 'small' : 'medium'}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <MailIcon />}
          fullWidth={variant === 'card'}
        >
          {loading ? t.common.loading : t.newsletter.subscribeButton}
        </Button>
      </Stack>
    </Box>
  );

  if (variant === 'inline') {
    return content;
  }

  return (
    <Paper
      elevation={2}
      sx={{
        p: 4,
        bgcolor: theme.palette.background.paper,
        borderRadius: 2,
      }}
    >
      {content}
    </Paper>
  );
}
