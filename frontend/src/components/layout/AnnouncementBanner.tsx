// src/components/layout/AnnouncementBanner.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Container,
  Button,
  useMediaQuery,
  useTheme,
  Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import GitHubIcon from '@mui/icons-material/GitHub';
import CodeIcon from '@mui/icons-material/Code';
import { useSettings } from '@/contexts/SettingsContext';
import { useRouter } from 'next/navigation';
import { translations } from '@/translations';

const BANNER_STORAGE_KEY = 'announcement-banner-dismissed';

export default function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const { language } = useSettings();
  const t = translations[language];

  // Check if the banner has been dismissed before
  useEffect(() => {
    const isDismissed = localStorage.getItem(BANNER_STORAGE_KEY) === 'true';
    setIsVisible(!isDismissed);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(BANNER_STORAGE_KEY, 'true');
  };

  // Handle button clicks
  const handleButtonClick = (link: string, external: boolean = false) => {
    if (external) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      router.push(link);
    }
  };

  if (!isVisible) return null;

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        background: (theme) =>
          `linear-gradient(90deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.primary.dark} 100%)`,
        color: 'white',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: (theme) => theme.zIndex.appBar + 1,
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          background:
            "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      <Container maxWidth="xl">
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            py: { xs: 2, sm: 2 },
            minHeight: { xs: '120px', sm: '80px' },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexGrow: 1,
              justifyContent: { xs: 'center', sm: 'space-evenly' },
              gap: { xs: 3, sm: 2 },
              flexDirection: { xs: 'column', sm: 'row' },
              width: '100%',
              maxWidth: { sm: '90%', md: '80%', lg: '70%' },
              mx: 'auto',
            }}
          >
            {/* Portfolio Section */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 1, sm: 2 },
              }}
            >
              {/* Icon with circular background */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '50%',
                  width: { xs: 36, sm: 42 },
                  height: { xs: 36, sm: 42 },
                  color: 'white',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                }}
              >
                <CodeIcon />
              </Box>

              {/* Text Content */}
              <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    justifyContent: { xs: 'center', sm: 'flex-start' },
                    gap: 1,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    component="h3"
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      lineHeight: 1.2,
                    }}
                  >
                    {t.common.checkoutPortfolio}
                  </Typography>

                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      height: 20,
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      px: 1,
                      py: 0.25,
                      borderRadius: 10,
                      bgcolor: 'primary.dark',
                      color: 'primary.contrastText',
                    }}
                  >
                    Developer
                  </Box>
                </Box>

                <Button
                  size="small"
                  variant="outlined"
                  endIcon={<ArrowForwardIcon fontSize="small" />}
                  onClick={() =>
                    handleButtonClick('https://www.rohitrana.dev', true)
                  }
                  sx={{
                    mt: 0.5,
                    fontWeight: 500,
                    textTransform: 'none',
                    color: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    },
                    fontSize: '0.75rem',
                    py: 0.25,
                  }}
                >
                  rohitrana.dev
                </Button>
              </Box>
            </Box>

            {/* Space between sections */}
            <Box sx={{ width: { xs: 0, sm: 16 } }} />

            {/* GitHub Section */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 1, sm: 2 },
              }}
            >
              {/* Icon with circular background */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '50%',
                  width: { xs: 36, sm: 42 },
                  height: { xs: 36, sm: 42 },
                  color: 'white',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                }}
              >
                <GitHubIcon />
              </Box>

              {/* Text Content */}
              <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    justifyContent: { xs: 'center', sm: 'flex-start' },
                    gap: 1,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    component="h3"
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      lineHeight: 1.2,
                    }}
                  >
                    {t.common.getSourceCode}
                  </Typography>

                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      height: 20,
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      px: 1,
                      py: 0.25,
                      borderRadius: 10,
                      bgcolor: 'secondary.main',
                      color: 'secondary.contrastText',
                    }}
                  >
                    MIT License
                  </Box>
                </Box>

                <Button
                  size="small"
                  variant="outlined"
                  endIcon={<ArrowForwardIcon fontSize="small" />}
                  onClick={() =>
                    handleButtonClick(
                      'https://github.com/rohitrana043/real-estate-management',
                      true
                    )
                  }
                  sx={{
                    mt: 0.5,
                    fontWeight: 500,
                    textTransform: 'none',
                    color: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    },
                    fontSize: '0.75rem',
                    py: 0.25,
                  }}
                >
                  GitHub
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Close button */}
          <Tooltip title="Dismiss">
            <IconButton
              size="small"
              aria-label="close"
              onClick={handleDismiss}
              sx={{
                color: 'white',
                opacity: 0.7,
                position: 'absolute',
                right: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                '&:hover': {
                  opacity: 1,
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
                border: '1px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Container>
    </Box>
  );
}
