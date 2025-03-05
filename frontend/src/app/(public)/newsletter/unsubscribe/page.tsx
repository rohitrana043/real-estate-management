// src/app/(public)/newsletter/unsubscribe/page.tsx
'use client';

import newsletterApi from '@/lib/api/newsletter';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmailIcon from '@mui/icons-material/Email';
import ErrorIcon from '@mui/icons-material/Error';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Link as MuiLink,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';

enum UnsubscribeState {
  INITIAL = 'initial',
  LOADING = 'loading',
  FORM = 'form',
  SUCCESS = 'success',
  ERROR = 'error',
}

export default function NewsletterUnsubscribePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [state, setState] = useState<UnsubscribeState>(
    UnsubscribeState.INITIAL
  );
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [token, setToken] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Extract token from URL query parameters
  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
      verifyUnsubscribeToken(tokenParam);
    } else {
      // No token, show form directly
      setState(UnsubscribeState.FORM);
    }
  }, [searchParams]);

  // Verify token and get associated email
  const verifyUnsubscribeToken = async (token: string) => {
    setState(UnsubscribeState.LOADING);

    try {
      const response = await newsletterApi.verifyUnsubscribeToken(token);

      if (response.success && response.email) {
        setEmail(response.email);
        setState(UnsubscribeState.FORM);
      } else {
        setErrorMessage(
          'Invalid or expired unsubscribe link. Please try again.'
        );
        setState(UnsubscribeState.ERROR);
      }
    } catch (error: any) {
      console.error('Token verification error:', error);
      setErrorMessage(
        error.apiError?.message ||
          'Invalid or expired unsubscribe link. Please try again.'
      );
      setState(UnsubscribeState.ERROR);
    }
  };

  // Validate email
  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = regex.test(email);
    if (!isValid) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
    return isValid;
  };

  // Handle email change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) {
      validateEmail(e.target.value);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email
    if (!email.trim()) {
      setEmailError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await newsletterApi.unsubscribe(email, token);

      // Show success message
      setState(UnsubscribeState.SUCCESS);
      enqueueSnackbar(
        response.message || 'Successfully unsubscribed from newsletter',
        {
          variant: 'success',
        }
      );
    } catch (error: any) {
      console.error('Unsubscribe error:', error);

      // Extract error message
      const errorMsg =
        error.apiError?.message ||
        'Failed to unsubscribe. Please try again later.';

      // Show error
      enqueueSnackbar(errorMsg, { variant: 'error' });

      // Handle specific field errors
      if (error.apiError?.errors?.email) {
        setEmailError(error.apiError.errors.email);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render loading state
  if (state === UnsubscribeState.LOADING) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="50vh"
        >
          <CircularProgress />
          <Typography variant="h6" mt={2}>
            Verifying your unsubscribe request...
          </Typography>
        </Box>
      </Container>
    );
  }

  // Render error state
  if (state === UnsubscribeState.ERROR) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <ErrorIcon color="error" sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Something Went Wrong
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
            {errorMessage}
          </Typography>
          <Divider sx={{ my: 3 }} />
          <Typography variant="body2" paragraph>
            You can still unsubscribe by entering your email below:
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Your Email Address"
              variant="outlined"
              value={email}
              onChange={handleEmailChange}
              error={!!emailError}
              helperText={emailError}
              disabled={isSubmitting}
              margin="normal"
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isSubmitting}
              startIcon={
                isSubmitting ? <CircularProgress size={20} /> : <EmailIcon />
              }
              sx={{ mt: 2 }}
            >
              {isSubmitting ? 'Processing...' : 'Unsubscribe'}
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  // Render success state
  if (state === UnsubscribeState.SUCCESS) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <CheckCircleIcon color="success" sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Successfully Unsubscribed
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
            You've been successfully unsubscribed from our newsletter. You'll no
            longer receive emails from us.
          </Typography>
          <Typography variant="body1" paragraph>
            If this was a mistake, you can always subscribe again from our
            website.
          </Typography>
          <Button component={Link} href="/" variant="contained" sx={{ mt: 2 }}>
            Return to Homepage
          </Button>
        </Paper>
      </Container>
    );
  }

  // Render form state (default)
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom textAlign="center">
          Unsubscribe from Newsletter
        </Typography>
        <Typography
          variant="body1"
          paragraph
          color="text.secondary"
          textAlign="center"
        >
          We're sorry to see you go. Please confirm your email address below to
          unsubscribe from our newsletter.
        </Typography>

        <Alert severity="info" sx={{ mb: 3 }}>
          This will unsubscribe you from all marketing emails. You'll still
          receive important account notifications.
        </Alert>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Your Email Address"
            variant="outlined"
            value={email}
            onChange={handleEmailChange}
            error={!!emailError}
            helperText={emailError}
            disabled={isSubmitting}
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
            sx={{ mt: 2 }}
          >
            {isSubmitting ? 'Processing...' : 'Confirm Unsubscribe'}
          </Button>
        </Box>

        <Box mt={3} textAlign="center">
          <Link href="/" passHref>
            <MuiLink>Return to Homepage</MuiLink>
          </Link>
        </Box>
      </Paper>
    </Container>
  );
}
