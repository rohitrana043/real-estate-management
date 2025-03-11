// src/app/dashboard/layout.tsx
'use client';

import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import CommonFooter from '@/components/layout/CommonFooter';
import { useAuth } from '@/contexts/AuthContext';
import { Box, CircularProgress, useMediaQuery, useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <DashboardSidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          bgcolor: 'background.default',
          overflowX: 'hidden',
          width: { xs: '100%', sm: 'auto' }, // Full width on mobile
        }}
      >
        {/* Main Content */}
        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            pt: { xs: 4, sm: 3 }, // Extra top padding on mobile to account for AppBar
          }}
        >
          {children}
        </Box>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            py: 3,
            px: 3,
            mt: 'auto',
            backgroundColor: 'background.paper',
            borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <CommonFooter />
        </Box>
      </Box>
    </Box>
  );
}
