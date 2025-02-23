// src/components/profile/ProfileLoading.tsx
import { Box, Container, Skeleton } from '@mui/material';

export default function ProfileLoading() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          width: '100%',
          borderRadius: 1,
          boxShadow: 1,
          overflow: 'hidden',
        }}
      >
        {/* Tab skeleton */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', p: 2 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Skeleton variant="rectangular" width={150} height={40} />
            <Skeleton variant="rectangular" width={150} height={40} />
          </Box>
        </Box>

        {/* Content skeleton */}
        <Box sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Skeleton variant="text" width="60%" height={40} />
            <Skeleton variant="text" width="40%" height={40} />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Skeleton variant="rectangular" width="100%" height={56} />
            <Skeleton variant="rectangular" width="100%" height={56} />
            <Skeleton variant="rectangular" width="100%" height={56} />
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
