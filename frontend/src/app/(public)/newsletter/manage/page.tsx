// src/app/(public)/newsletter/manage/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Paper,
  Card,
  CardContent,
  Divider,
  Grid,
  Switch,
  FormControlLabel,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  FormGroup,
  Checkbox,
  Radio,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import newsletterApi from '@/lib/api/newsletter';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

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
      id={`newsletter-tabpanel-${index}`}
      aria-labelledby={`newsletter-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `newsletter-tab-${index}`,
    'aria-controls': `newsletter-tabpanel-${index}`,
  };
}

enum PageState {
  LOADING = 'loading',
  FORM = 'form',
  SUCCESS = 'success',
  ERROR = 'error',
}

const preferenceCategories = [
  { id: 'market_updates', label: 'Market Updates' },
  { id: 'property_alerts', label: 'Property Alerts' },
  { id: 'investment_tips', label: 'Investment Tips' },
  { id: 'company_news', label: 'Company News' },
  { id: 'promotions', label: 'Promotions and Offers' },
];

export default function NewsletterManagePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [tabIndex, setTabIndex] = useState(0);
  const [pageState, setPageState] = useState<PageState>(PageState.LOADING);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // User data
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [token, setToken] = useState('');
  const [subscribed, setSubscribed] = useState(true);
  const [preferences, setPreferences] = useState<Record<string, boolean>>({});
  const [frequency, setFrequency] = useState('weekly');

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    const emailParam = searchParams.get('email');

    if (tokenParam && emailParam) {
      setToken(tokenParam);
      setEmail(emailParam);
      verifyManageToken(tokenParam, emailParam);
    } else {
      setErrorMessage(
        'Invalid or missing parameters. Please use the link from your email.'
      );
      setPageState(PageState.ERROR);
    }
  }, [searchParams]);

  const verifyManageToken = async (token: string, email: string) => {
    setPageState(PageState.LOADING);

    try {
      // In a real app, you would call an API to verify the token
      // For now, we'll simulate a successful verification

      // Initialize default preferences
      const defaultPreferences: Record<string, boolean> = {};
      preferenceCategories.forEach((cat) => {
        defaultPreferences[cat.id] = true;
      });

      setPreferences(defaultPreferences);
      setPageState(PageState.FORM);
    } catch (error: any) {
      console.error('Token verification error:', error);
      setErrorMessage(
        error.apiError?.message ||
          'Invalid or expired link. Please request a new one.'
      );
      setPageState(PageState.ERROR);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleFrequencyChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFrequency(event.target.value);
  };

  const handleSubscriptionToggle = () => {
    setSubscribed(!subscribed);
  };

  const handlePreferenceChange =
    (id: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setPreferences((prev) => ({
        ...prev,
        [id]: event.target.checked,
      }));
    };

  const handleSaveChanges = async () => {
    setLoading(true);

    try {
      // In a real app, you would call an API to save the preferences
      // For now, we'll simulate a successful save

      setTimeout(() => {
        enqueueSnackbar('Your newsletter preferences have been updated', {
          variant: 'success',
        });
        setLoading(false);
      }, 1000);
    } catch (error: any) {
      console.error('Save preferences error:', error);
      enqueueSnackbar(
        error.apiError?.message ||
          'Failed to save preferences. Please try again.',
        {
          variant: 'error',
        }
      );
      setLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    setLoading(true);

    try {
      await newsletterApi.unsubscribe(email, token);

      enqueueSnackbar('You have been unsubscribed from all newsletters', {
        variant: 'success',
      });

      setPageState(PageState.SUCCESS);
    } catch (error: any) {
      console.error('Unsubscribe error:', error);
      enqueueSnackbar(
        error.apiError?.message || 'Failed to unsubscribe. Please try again.',
        {
          variant: 'error',
        }
      );
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (pageState === PageState.LOADING) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="50vh"
        >
          <CircularProgress />
          <Typography variant="h6" mt={2}>
            Loading your newsletter preferences...
          </Typography>
        </Box>
      </Container>
    );
  }

  // Error state
  if (pageState === PageState.ERROR) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <ErrorIcon color="error" sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Something Went Wrong
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
            {errorMessage}
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push('/')}
            sx={{ mt: 2 }}
          >
            Return to Homepage
          </Button>
        </Paper>
      </Container>
    );
  }

  // Success state (unsubscribed)
  if (pageState === PageState.SUCCESS) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <CheckCircleIcon color="success" sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Successfully Unsubscribed
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
            You've been successfully unsubscribed from our newsletters. You'll
            no longer receive marketing emails from us.
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push('/')}
            sx={{ mt: 2 }}
          >
            Return to Homepage
          </Button>
        </Paper>
      </Container>
    );
  }

  // Form state
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Manage Your Newsletter Preferences
      </Typography>
      <Typography
        variant="body1"
        paragraph
        align="center"
        color="text.secondary"
      >
        Customize your email preferences for {email}
      </Typography>

      <Paper elevation={3} sx={{ mt: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            aria-label="newsletter preferences tabs"
            variant="fullWidth"
          >
            <Tab
              icon={<NotificationsActiveIcon />}
              label="Preferences"
              {...a11yProps(0)}
            />
            <Tab icon={<SettingsIcon />} label="Settings" {...a11yProps(1)} />
            <Tab icon={<PersonIcon />} label="Account" {...a11yProps(2)} />
          </Tabs>
        </Box>

        {/* Preferences Tab */}
        <TabPanel value={tabIndex} index={0}>
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Email Subscription
              </Typography>
              <Typography variant="body2" paragraph color="text.secondary">
                Control whether you receive newsletter emails from us.
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={subscribed}
                    onChange={handleSubscriptionToggle}
                    color="primary"
                  />
                }
                label={subscribed ? 'Subscribed' : 'Unsubscribed'}
              />

              {!subscribed && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  You've opted out of receiving newsletters. Toggle the switch
                  above to resubscribe.
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Content Preferences
              </Typography>
              <Typography variant="body2" paragraph color="text.secondary">
                Select the types of content you're interested in receiving.
              </Typography>

              <FormGroup>
                {preferenceCategories.map((category) => (
                  <FormControlLabel
                    key={category.id}
                    control={
                      <Checkbox
                        checked={preferences[category.id] || false}
                        onChange={handlePreferenceChange(category.id)}
                        disabled={!subscribed}
                      />
                    }
                    label={category.label}
                  />
                ))}
              </FormGroup>
            </CardContent>
          </Card>

          <Box display="flex" justifyContent="space-between">
            <Button
              variant="outlined"
              color="error"
              onClick={handleUnsubscribe}
              startIcon={
                loading ? (
                  <CircularProgress size={20} />
                ) : (
                  <NotificationsOffIcon />
                )
              }
              disabled={loading}
            >
              Unsubscribe from All
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveChanges}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Saving...' : 'Save Preferences'}
            </Button>
          </Box>
        </TabPanel>

        {/* Settings Tab */}
        <TabPanel value={tabIndex} index={1}>
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Email Frequency
              </Typography>
              <Typography variant="body2" paragraph color="text.secondary">
                Choose how often you'd like to receive our emails.
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Radio
                        checked={frequency === 'daily'}
                        onChange={handleFrequencyChange}
                        value="daily"
                        disabled={!subscribed}
                      />
                    }
                    label="Daily"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Radio
                        checked={frequency === 'weekly'}
                        onChange={handleFrequencyChange}
                        value="weekly"
                        disabled={!subscribed}
                      />
                    }
                    label="Weekly"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Radio
                        checked={frequency === 'monthly'}
                        onChange={handleFrequencyChange}
                        value="monthly"
                        disabled={!subscribed}
                      />
                    }
                    label="Monthly"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveChanges}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </Button>
          </Box>
        </TabPanel>

        {/* Account Tab */}
        <TabPanel value={tabIndex} index={2}>
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Subscriber Details
              </Typography>

              <TextField
                fullWidth
                label="Email Address"
                variant="outlined"
                value={email}
                disabled
                margin="normal"
              />

              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                This is the email address associated with your newsletter
                subscription.
              </Typography>
            </CardContent>
          </Card>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" color="error" gutterBottom>
            Danger Zone
          </Typography>

          <Card
            variant="outlined"
            sx={{ mb: 3, border: '1px solid rgba(255, 0, 0, 0.3)' }}
          >
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Unsubscribe from all communications
              </Typography>
              <Typography variant="body2" paragraph color="text.secondary">
                This will unsubscribe you from all newsletters and marketing
                emails.
              </Typography>

              <Button
                variant="outlined"
                color="error"
                onClick={handleUnsubscribe}
                startIcon={
                  loading ? (
                    <CircularProgress size={20} />
                  ) : (
                    <NotificationsOffIcon />
                  )
                }
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Unsubscribe Completely'}
              </Button>
            </CardContent>
          </Card>
        </TabPanel>
      </Paper>
    </Container>
  );
}
