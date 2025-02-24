// src/components/auth/withRoleProtection.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { hasRole } from '@/utils/roleUtils';
import { Box, CircularProgress, Typography } from '@mui/material';

export function withRoleProtection(
  WrappedComponent: React.ComponentType<any>,
  allowedRoles: string[]
) {
  return function ProtectedRoute(props: any) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !user) {
        router.push('/login');
        return;
      }

      if (
        !isLoading &&
        user &&
        !allowedRoles.some((role) => hasRole(user, role))
      ) {
        router.push('/dashboard');
      }
    }, [isLoading, user, router]);

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

    if (!user || !allowedRoles.some((role) => hasRole(user, role))) {
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <Typography>Access Denied</Typography>
        </Box>
      );
    }

    return <WrappedComponent {...props} />;
  };
}

// Usage example:
// export default withRoleProtection(YourComponent, [ROLES.ADMIN, ROLES.AGENT]);
