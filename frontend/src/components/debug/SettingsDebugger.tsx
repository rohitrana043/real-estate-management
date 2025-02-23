// src/components/debug/SettingsDebugger.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, Grid } from '@mui/material';
import { useSettings } from '@/contexts/SettingsContext';
import { settingsStorage } from '@/utils/storage';

/**
 * Debug component to display and manage settings
 * Only include this in development builds
 */
const SettingsDebugger = () => {
  const settings = useSettings();
  const [localStorageData, setLocalStorageData] = useState<string>('');
  const [showDebugger, setShowDebugger] = useState(false);

  // Update local storage data when settings change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('appSettings');
      setLocalStorageData(data || 'No settings found');
    }
  }, [settings]);

  const refreshLocalStorageData = () => {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('appSettings');
      setLocalStorageData(data || 'No settings found');
    }
  };

  const clearLocalStorage = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('appSettings');
      refreshLocalStorageData();
    }
  };

  if (!showDebugger) {
    return (
      <Button
        variant="outlined"
        size="small"
        onClick={() => setShowDebugger(true)}
        sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 9999 }}
      >
        Show Settings Debug
      </Button>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 9999,
        p: 2,
        maxWidth: 500,
        maxHeight: '80vh',
        overflow: 'auto',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Settings Debugger
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="subtitle1">Current Settings Context:</Typography>
          <Box
            component="pre"
            sx={{
              p: 1,
              bgcolor: 'background.paper',
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              overflow: 'auto',
              fontSize: '0.75rem',
            }}
          >
            {JSON.stringify(
              {
                themeMode: settings.themeMode,
                language: settings.language,
              },
              null,
              2
            )}
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1">LocalStorage Data:</Typography>
          <Box
            component="pre"
            sx={{
              p: 1,
              bgcolor: 'background.paper',
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              overflow: 'auto',
              fontSize: '0.75rem',
            }}
          >
            {localStorageData}
          </Box>
        </Grid>

        <Grid item container spacing={1}>
          <Grid item>
            <Button
              variant="outlined"
              size="small"
              onClick={refreshLocalStorageData}
            >
              Refresh
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              size="small"
              color="primary"
              onClick={() => settings.toggleTheme()}
            >
              Toggle Theme
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              size="small"
              color="warning"
              onClick={clearLocalStorage}
            >
              Clear LocalStorage
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              size="small"
              color="success"
              onClick={settings.resetToDefaultSettings}
            >
              Reset to Defaults
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              size="small"
              color="error"
              onClick={() => setShowDebugger(false)}
            >
              Close
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default SettingsDebugger;
