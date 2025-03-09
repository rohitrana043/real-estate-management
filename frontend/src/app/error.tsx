// src/app/error.tsx
'use client';

import React from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Alert,
} from '@mui/material';
import Link from 'next/link';
import RefreshIcon from '@mui/icons-material/Refresh';
import HomeIcon from '@mui/icons-material/Home';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  // Log the error for debugging purposes
  React.useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Something went wrong
        </Typography>

        <Alert severity="warning" sx={{ my: 4, textAlign: 'left' }}>
          We've encountered an unexpected error while trying to load this page.
          This could be due to a temporary service disruption.
        </Alert>

        <Typography color="text.secondary" sx={{ mb: 4 }}>
          You can try refreshing the page or return to the homepage.
        </Typography>

        {process.env.NODE_ENV === 'development' && (
          <Box sx={{ mb: 4, textAlign: 'left' }}>
            <Typography variant="subtitle2" gutterBottom>
              Error details (visible in development only):
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                backgroundColor: 'grey.100',
                overflow: 'auto',
                maxHeight: '200px',
              }}
            >
              <pre style={{ margin: 0, fontSize: '0.875rem' }}>
                {error.message}
                {error.stack && `\n\n${error.stack}`}
              </pre>
            </Paper>
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={reset}
          >
            Try Again
          </Button>

          <Link href="/" passHref style={{ textDecoration: 'none' }}>
            <Button variant="outlined" startIcon={<HomeIcon />}>
              Back to Home
            </Button>
          </Link>
        </Box>
      </Paper>
    </Container>
  );
}
