// src/components/layout/PersistentAnnouncementBanner.tsx
'use client';

import React from 'react';
import {
  Box,
  Typography,
  Container,
  Button,
  useTheme,
  Stack,
  Paper,
  useMediaQuery,
} from '@mui/material';
import {
  Info as InfoIcon,
  GitHub as GitHubIcon,
  Architecture as ArchitectureIcon,
} from '@mui/icons-material';

/**
 * A persistent announcement banner that cannot be dismissed
 * Used to inform users about the demo nature of the application
 */
export default function PersistentAnnouncementBanner() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // External links
  const handleGitHubClick = () => {
    window.open(
      'https://github.com/rohitrana043/real-estate-management',
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <Paper
      elevation={0}
      square
      sx={{
        position: 'relative',
        width: '100%',
        zIndex: theme.zIndex.appBar + 2,
        bgcolor:
          theme.palette.mode === 'dark'
            ? 'rgba(20, 20, 20, 0.95)'
            : 'rgba(253, 237, 237, 0.95)',
        borderBottom: '1px solid',
        borderColor:
          theme.palette.mode === 'dark' ? 'error.dark' : 'error.light',
        py: 1.5,
      }}
    >
      {/* Background pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          background:
            "url(\"data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ff0000' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 5v1H5V0zm1 5v1H5v-1h1z'/%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ color: 'error.main' }}
          >
            <InfoIcon color="inherit" fontSize="small" />
            <Typography variant="body2" color="error.main" fontWeight="medium">
              {isMobile
                ? 'Demo Mode: Using mock data'
                : 'This application is running in demo mode with mock responses due to high server hosting cost.'}
            </Typography>
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            sx={{
              justifyContent: 'center',
              width: { xs: '100%', md: 'auto' },
            }}
          >
            <Button
              size="small"
              variant="outlined"
              color="error"
              startIcon={<GitHubIcon />}
              onClick={handleGitHubClick}
              sx={{
                borderRadius: '16px',
                fontSize: '0.75rem',
                py: 0.5,
              }}
            >
              View on GitHub
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              startIcon={<ArchitectureIcon />}
              component="a"
              href="/images/architecture-diagram.png"
              target="_blank"
              sx={{
                borderRadius: '16px',
                fontSize: '0.75rem',
                py: 0.5,
                display: { xs: 'none', sm: 'flex' },
              }}
            >
              Architecture Diagram
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Paper>
  );
}
