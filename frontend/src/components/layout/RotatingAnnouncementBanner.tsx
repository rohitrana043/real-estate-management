// src/components/layout/RotatingAnnouncementBanner.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Container,
  Button,
  Fade,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import GitHubIcon from '@mui/icons-material/GitHub';
import LaunchIcon from '@mui/icons-material/Launch';
import HomeIcon from '@mui/icons-material/Home';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { useSettings } from '@/contexts/SettingsContext';
import { translations } from '@/translations';

const BANNER_STORAGE_KEY = 'announcement-banner-dismissed';

interface AnnouncementProps {
  showDismissButton?: boolean;
}

export default function RotatingAnnouncementBanner({
  showDismissButton = true,
}: AnnouncementProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { language, themeMode } = useSettings();
  const t = translations[language];

  // Define our rotating messages
  const messages = [
    {
      icon: <HomeIcon fontSize="small" />,
      text: t.common.checkoutPortfolio,
      buttonText: 'rohitrana.dev',
      link: 'https://www.rohitrana.dev',
    },
    {
      icon: <GitHubIcon fontSize="small" />,
      text: t.common.getSourceCode,
      buttonText: 'GitHub',
      link: 'https://github.com/rohitrana043/real-estate-management',
    },
    {
      icon: <NewReleasesIcon fontSize="small" />,
      text: 'New properties added weekly! Check our latest listings',
      buttonText: 'Browse Now',
      link: '/properties',
    },
    {
      icon: <LocalOfferIcon fontSize="small" />,
      text: 'Limited time offer: Premium account free for first 30 days',
      buttonText: 'Sign Up',
      link: '/register',
    },
  ];

  // Check if the banner has been dismissed before
  useEffect(() => {
    const isDismissed = localStorage.getItem(BANNER_STORAGE_KEY) === 'true';
    setIsVisible(!isDismissed);
  }, []);

  // Rotate messages every few seconds
  useEffect(() => {
    if (!isVisible) return;

    const rotationInterval = setInterval(() => {
      setIsTransitioning(true);

      // Wait for fade out to complete before changing message
      setTimeout(() => {
        setCurrentMessageIndex(
          (prevIndex) => (prevIndex + 1) % messages.length
        );
        setIsTransitioning(false);
      }, 500);
    }, 7000); // Change message every 7 seconds

    return () => clearInterval(rotationInterval);
  }, [isVisible, messages.length]);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(BANNER_STORAGE_KEY, 'true');
  };

  // Return null if banner is not visible
  if (!isVisible) return null;

  const currentMessage = messages[currentMessageIndex];

  return (
    <Box
      sx={{
        py: 1.5,
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        position: 'relative',
        zIndex: (theme) => theme.zIndex.appBar + 1,
        minHeight: '46px', // Fixed height to prevent layout shifts during transitions
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Fade in={!isTransitioning} timeout={500}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1.5,
                py: 0.5,
                bgcolor: 'rgba(255, 255, 255, 0.15)',
                borderRadius: 1,
                mx: 'auto',
                maxWidth: 'fit-content',
                minWidth: { xs: '80%', md: '50%' },
                justifyContent: 'center',
              }}
            >
              {currentMessage.icon}
              <Typography variant="body2" fontWeight="medium">
                {currentMessage.text}
              </Typography>
              <Button
                href={currentMessage.link}
                target={
                  currentMessage.link.startsWith('http') ? '_blank' : undefined
                }
                rel={
                  currentMessage.link.startsWith('http')
                    ? 'noopener noreferrer'
                    : undefined
                }
                size="small"
                variant="outlined"
                endIcon={<LaunchIcon fontSize="small" />}
                sx={{
                  ml: 1,
                  color: 'inherit',
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                  textTransform: 'none',
                  fontSize: '0.75rem',
                }}
              >
                {currentMessage.buttonText}
              </Button>
            </Box>
          </Fade>

          {showDismissButton && (
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleDismiss}
              sx={{
                opacity: 0.7,
                position: { xs: 'absolute', md: 'static' },
                right: { xs: 8, md: 'auto' },
                '&:hover': {
                  opacity: 1,
                  bgcolor: 'rgba(255, 255, 255, 0.15)',
                },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Container>
    </Box>
  );
}
