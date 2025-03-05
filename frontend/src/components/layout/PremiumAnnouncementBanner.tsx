// src/components/layout/PremiumAnnouncementBanner.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Container,
  Button,
  Slide,
  Grow,
  useMediaQuery,
  useTheme,
  Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import GitHubIcon from '@mui/icons-material/GitHub';
import CodeIcon from '@mui/icons-material/Code';
import VerifiedIcon from '@mui/icons-material/Verified';
import StarIcon from '@mui/icons-material/Star';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { useSettings } from '@/contexts/SettingsContext';
import { useRouter } from 'next/navigation';
import { translations } from '@/translations';

const BANNER_STORAGE_KEY = 'premium-announcement-banner-dismissed';
const BANNER_VIEW_COUNT_KEY = 'premium-announcement-banner-views';

export default function PremiumAnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<
    'left' | 'right'
  >('left');
  const [viewCount, setViewCount] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const { language, themeMode } = useSettings();
  const t = translations[language];

  // Enhanced message content
  const messages = [
    {
      id: 1,
      primary: 'Built by Rohit Rana',
      secondary: 'Check out my portfolio website',
      highlightText: 'rohitrana.dev',
      primaryAction: {
        text: 'View Portfolio',
        link: 'https://www.rohitrana.dev',
        external: true,
      },
      secondaryAction: {
        text: 'Contact',
        link: '/contact',
        external: false,
      },
      icon: <CodeIcon />,
      chipText: 'Developer',
      chipColor: 'primary',
    },
    {
      id: 2,
      primary: 'Open Source Project',
      secondary: 'Get the complete source code on GitHub',
      primaryAction: {
        text: 'GitHub Repo',
        link: 'https://github.com/rohitrana043/real-estate-management',
        external: true,
      },
      icon: <GitHubIcon />,
      chipText: 'MIT License',
      chipColor: 'secondary',
    },
    {
      id: 3,
      primary: 'Special Offer',
      secondary: 'New listings get featured placement for free',
      highlightText: 'Limited Time!',
      primaryAction: {
        text: 'List Property',
        link: '/services/sell',
        external: false,
      },
      icon: <LocalFireDepartmentIcon />,
      chipText: '50% Off',
      chipColor: 'error',
    },
  ];

  // Initialize banner state and view counter
  useEffect(() => {
    const isDismissed = localStorage.getItem(BANNER_STORAGE_KEY) === 'true';
    const viewCountStr = localStorage.getItem(BANNER_VIEW_COUNT_KEY) || '0';
    const parsedViewCount = parseInt(viewCountStr, 10);

    setViewCount(parsedViewCount);

    // Show banner unless it's been dismissed
    if (!isDismissed) {
      setIsVisible(true);

      // Update view count
      const newViewCount = parsedViewCount + 1;
      localStorage.setItem(BANNER_VIEW_COUNT_KEY, newViewCount.toString());
      setViewCount(newViewCount);
    }
  }, []);

  // Rotate messages
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setTransitioning(true);
      // Set direction - alternating for interesting visual effect
      setAnimationDirection((prev) => (prev === 'left' ? 'right' : 'left'));

      // Change message after exit animation
      setTimeout(() => {
        setCurrentMessageIndex(
          (prevIndex) => (prevIndex + 1) % messages.length
        );
        setTransitioning(false);
      }, 300); // Sync with transition time
    }, 8000); // Show each message for 8 seconds

    return () => clearInterval(interval);
  }, [isVisible, messages.length]);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(BANNER_STORAGE_KEY, 'true');
  };

  // Show countdown on 3rd+ view to encourage action
  const showCountdown = viewCount >= 3;

  // Handle button clicks
  const handleButtonClick = (link: string, external: boolean = false) => {
    if (external) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      router.push(link);
    }
  };

  if (!isVisible) return null;

  const currentMessage = messages[currentMessageIndex];

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
            py: { xs: 1.5, sm: 1.75 },
            minHeight: { xs: '60px', sm: '70px' },
          }}
        >
          <Slide
            direction={animationDirection}
            in={!transitioning}
            mountOnEnter
            unmountOnExit
            timeout={300}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexGrow: 1,
                justifyContent: 'center',
                gap: { xs: 1, sm: 3 },
                flexDirection: { xs: 'column', sm: 'row' },
              }}
            >
              {/* Icon with circular background */}
              <Grow in={!transitioning} timeout={500}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: '50%',
                    width: { xs: 40, sm: 48 },
                    height: { xs: 40, sm: 48 },
                    color: 'white',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                  }}
                >
                  {currentMessage.icon}
                </Box>
              </Grow>

              {/* Text Content */}
              <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    justifyContent: { xs: 'center', sm: 'flex-start' },
                    gap: 1,
                    mb: 0.5,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    component="h3"
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      lineHeight: 1.2,
                    }}
                  >
                    {currentMessage.primary}
                  </Typography>

                  {currentMessage.chipText && (
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
                        bgcolor: `${currentMessage.chipColor}.main`,
                        color: `${currentMessage.chipColor}.contrastText`,
                      }}
                    >
                      {currentMessage.chipText}
                    </Box>
                  )}
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.9,
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    justifyContent: { xs: 'center', sm: 'flex-start' },
                    gap: 0.5,
                    fontSize: { xs: '0.75rem', sm: '0.85rem' },
                  }}
                >
                  {currentMessage.secondary}
                  {currentMessage.highlightText && (
                    <Box
                      component="span"
                      sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.15)',
                        px: 0.75,
                        py: 0.25,
                        borderRadius: 1,
                        ml: 0.5,
                        fontWeight: 600,
                        fontSize: '0.7rem',
                      }}
                    >
                      {currentMessage.highlightText}
                    </Box>
                  )}
                </Typography>
              </Box>

              {/* Action Buttons */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: { xs: 'center', sm: 'flex-start' },
                  mt: { xs: 1, sm: 0 },
                }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  size={isMobile ? 'small' : 'medium'}
                  endIcon={<ArrowForwardIcon />}
                  onClick={() =>
                    handleButtonClick(
                      currentMessage.primaryAction.link,
                      currentMessage.primaryAction.external
                    )
                  }
                  sx={{
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                    whiteSpace: 'nowrap',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    px: { xs: 1.5, sm: 2 },
                  }}
                >
                  {currentMessage.primaryAction.text}
                </Button>

                {currentMessage.secondaryAction && (
                  <Button
                    variant="outlined"
                    size={isMobile ? 'small' : 'medium'}
                    onClick={() =>
                      handleButtonClick(
                        currentMessage.secondaryAction!.link,
                        currentMessage.secondaryAction!.external
                      )
                    }
                    sx={{
                      fontWeight: 500,
                      textTransform: 'none',
                      color: 'white',
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                      },
                      whiteSpace: 'nowrap',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      px: { xs: 1.5, sm: 2 },
                    }}
                  >
                    {currentMessage.secondaryAction.text}
                  </Button>
                )}
              </Box>
            </Box>
          </Slide>

          {/* Close button */}
          <Tooltip
            title={
              showCountdown ? "Dismiss (won't show for 7 days)" : 'Dismiss'
            }
          >
            <IconButton
              size="small"
              aria-label="close"
              onClick={handleDismiss}
              sx={{
                color: 'white',
                opacity: 0.7,
                position: { xs: 'absolute', sm: 'static' },
                right: { xs: 8, sm: 'auto' },
                top: { xs: 8, sm: 'auto' },
                ml: { sm: 2 },
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
