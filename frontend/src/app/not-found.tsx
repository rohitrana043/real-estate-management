// src/app/not-found.tsx
'use client';

import {
  Container,
  Box,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { Home as HomeIcon } from '@mui/icons-material';

export default function NotFoundPage() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Container
      maxWidth="lg"
      sx={{
        px: { xs: 2, sm: 3, md: 4 }, // Responsive padding
      }}
    >
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          py: { xs: 4, sm: 6, md: 8 }, // Responsive vertical padding
          px: { xs: 2, sm: 3 }, // Responsive horizontal padding
        }}
      >
        <Box
          component="img"
          src="/images/404-illustration.svg"
          alt="404 Page Not Found"
          sx={{
            width: '100%',
            maxWidth: { xs: 280, sm: 340, md: 400 }, // Responsive image size
            height: 'auto',
            mb: { xs: 3, sm: 4 }, // Responsive margin
          }}
        />

        <Typography
          variant={isMobile ? 'h3' : 'h2'} // Responsive font size
          component="h1"
          sx={{
            fontWeight: 700,
            mb: { xs: 1.5, sm: 2 }, // Responsive margin
            fontSize: {
              xs: '2rem', // For extra small devices
              sm: '2.5rem', // For small devices
              md: '3rem', // For medium devices
              lg: '3.5rem', // For large devices
            },
            background: (theme) =>
              `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            px: { xs: 1, sm: 2 }, // Responsive padding
          }}
        >
          Oops! Page Not Found
        </Typography>

        <Typography
          variant={isMobile ? 'body1' : 'h5'} // Responsive font size
          color="text.secondary"
          sx={{
            maxWidth: { xs: '100%', sm: 450, md: 600 }, // Responsive max width
            mb: { xs: 3, sm: 4 }, // Responsive margin
            px: { xs: 1, sm: 2 }, // Responsive padding
            fontSize: {
              xs: '1rem', // For extra small devices
              sm: '1.1rem', // For small devices
              md: '1.25rem', // For medium devices
            },
          }}
        >
          We can't seem to find the page you're looking for. It might have been
          moved or doesn't exist.
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' }, // Stack buttons on mobile
            gap: { xs: 1.5, sm: 2 }, // Responsive gap
            width: { xs: '100%', sm: 'auto' }, // Full width on mobile
          }}
        >
          <Button
            variant="contained"
            size={isMobile ? 'medium' : 'large'}
            fullWidth={isMobile} // Full width on mobile
            startIcon={<HomeIcon />}
            onClick={() => router.push('/')}
            sx={{
              px: { xs: 3, sm: 4 }, // Responsive padding
              py: { xs: 1.25, sm: 1.5 }, // Responsive padding
              borderRadius: 2,
              textTransform: 'none',
              fontSize: {
                xs: '1rem',
                sm: '1.05rem',
                md: '1.1rem',
              },
              whiteSpace: 'nowrap', // Prevent text wrapping
            }}
          >
            Go to Homepage
          </Button>

          <Button
            variant="outlined"
            size={isMobile ? 'medium' : 'large'}
            fullWidth={isMobile} // Full width on mobile
            onClick={() => router.back()}
            sx={{
              px: { xs: 3, sm: 4 }, // Responsive padding
              py: { xs: 1.25, sm: 1.5 }, // Responsive padding
              borderRadius: 2,
              textTransform: 'none',
              fontSize: {
                xs: '1rem',
                sm: '1.05rem',
                md: '1.1rem',
              },
              whiteSpace: 'nowrap', // Prevent text wrapping
            }}
          >
            Go Back
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
