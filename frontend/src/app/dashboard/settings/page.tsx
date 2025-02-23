// src/app/dashboard/settings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Avatar,
  IconButton,
  Divider,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  CameraAlt as CameraIcon,
  DeleteForever as DeleteIcon,
  SupervisorAccount as AdminIcon,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';

import ProfileForm from '@/components/profile/ProfileForm';
import ChangePasswordForm from '@/components/profile/ChangePasswordForm';
import ProfileLoading from '@/components/profile/ProfileLoading';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function DashboardSettingsPage() {
  const [tabValue, setTabValue] = useState(0);
  const [deleteAccountDialog, setDeleteAccountDialog] = useState(false);
  const { user, logout } = useAuth();
  const { themeMode, language, toggleTheme, changeLanguage } = useSettings();
  const { enqueueSnackbar } = useSnackbar();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Use requestAnimationFrame to ensure we're in the browser
    const raf = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleDeleteAccount = async () => {
    try {
      // In a real app, you would implement account deletion logic
      enqueueSnackbar('Account deletion request submitted', {
        variant: 'info',
      });
      setDeleteAccountDialog(false);
      await logout(); // Log out after requesting account deletion
    } catch (error) {
      enqueueSnackbar('Failed to delete account', { variant: 'error' });
    }
  };

  // Show loading state while mounting or if user is not loaded
  if (!mounted || !user) {
    return <ProfileLoading />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 700 }}>
        Account Settings
      </Typography>

      <Grid container spacing={4}>
        {/* Left sidebar with user info and avatar */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'neutral.main',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar
                src={user.profilePicture}
                sx={{
                  width: 150,
                  height: 150,
                  mb: 2,
                  bgcolor: 'primary.main',
                  fontSize: '4rem',
                }}
              >
                {user.name.charAt(0)}
              </Avatar>

              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {user.name}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {user.roles.join(', ')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ mt: 3 }}>
              <Button
                variant="outlined"
                color="error"
                fullWidth
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteAccountDialog(true)}
              >
                Delete Account
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Right side with tab panels */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'neutral.main',
            }}
          >
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="settings tabs"
              >
                <Tab label="Profile" id="settings-tab-0" />
                <Tab label="Security" id="settings-tab-1" />
                <Tab label="Preferences" id="settings-tab-2" />
              </Tabs>
            </Box>

            {/* Profile Tab */}
            <TabPanel value={tabValue} index={0}>
              <ProfileForm />
            </TabPanel>

            {/* Security Tab */}
            <TabPanel value={tabValue} index={1}>
              <ChangePasswordForm />
            </TabPanel>

            {/* Preferences Tab */}
            <TabPanel value={tabValue} index={2}>
              <Box>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Application Preferences
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography sx={{ flexGrow: 1 }}>Theme Mode</Typography>
                  <Button variant="outlined" onClick={toggleTheme}>
                    Switch to {themeMode === 'light' ? 'Dark' : 'Light'} Mode
                  </Button>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ flexGrow: 1 }}>Language</Typography>
                  <Button
                    variant="outlined"
                    onClick={() =>
                      changeLanguage(language === 'en' ? 'fr' : 'en')
                    }
                  >
                    Switch to {language === 'en' ? 'French' : 'English'}
                  </Button>
                </Box>
              </Box>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>

      {/* Delete Account Dialog */}
      <Dialog
        open={deleteAccountDialog}
        onClose={() => setDeleteAccountDialog(false)}
      >
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your account? This action cannot be
            undone, and all your data will be permanently removed.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteAccountDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteAccount} color="error">
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
