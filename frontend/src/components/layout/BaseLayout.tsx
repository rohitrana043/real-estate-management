// src/components/layout/BaseLayout.tsx
'use client';

import { Box } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from 'notistack';
import { createAppTheme } from '@/theme';
import { useSettings } from '@/contexts/SettingsContext';

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { themeMode } = useSettings();
  const theme = createAppTheme(themeMode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider
        maxSnack={3}
        autoHideDuration={4000}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
          }}
        >
          {children}
        </Box>
      </SnackbarProvider>
    </ThemeProvider>
  );
}
