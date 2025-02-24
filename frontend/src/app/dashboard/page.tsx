// src/app/dashboard/page.tsx
'use client';

import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  useTheme,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Home as HomeIcon,
  Favorite as FavoriteIcon,
  Message as MessageIcon,
  Visibility as VisibilityIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';
import { translations } from '@/translations';
import { useDashboard } from '@/hooks/useDashboard';
import { isAdminOrAgent } from '@/utils/roleUtils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactElement;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  trend,
}) => {
  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: `${color}15`,
              color: color,
              width: 48,
              height: 48,
            }}
          >
            {icon}
          </Avatar>
          <Box sx={{ ml: 2, flexGrow: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h4" component="div" fontWeight="medium">
              {value}
            </Typography>
          </Box>
          {trend && (
            <Box sx={{ textAlign: 'right' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}
              >
                {trend.isPositive ? (
                  <ArrowUpwardIcon
                    sx={{ color: 'success.main', fontSize: 20 }}
                  />
                ) : (
                  <ArrowDownwardIcon
                    sx={{ color: 'error.main', fontSize: 20 }}
                  />
                )}
                <Typography
                  variant="body2"
                  color={trend.isPositive ? 'success.main' : 'error.main'}
                  sx={{ ml: 0.5 }}
                >
                  {trend.value}%
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                vs last month
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

const RecentActivity: React.FC = () => {
  const { stats } = useDashboard();

  if (!stats?.recentActivity) return null;

  return (
    <Card>
      <CardHeader title="Recent Activity" />
      <List sx={{ p: 0 }}>
        {stats.recentActivity.map((activity, index) => (
          <React.Fragment key={activity.id}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'primary.light' }}>
                  {activity.type === 'property_view' && <VisibilityIcon />}
                  {activity.type === 'favorite_added' && <FavoriteIcon />}
                  {activity.type === 'message' && <MessageIcon />}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={activity.property}
                secondary={
                  <Box component="span">
                    <Box
                      component="span"
                      sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}
                    >
                      <LocationIcon
                        sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }}
                      />
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.secondary"
                      >
                        {activity.location}
                      </Typography>
                    </Box>
                    <Box
                      component="span"
                      sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}
                    >
                      <ScheduleIcon
                        sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }}
                      />
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.secondary"
                      >
                        {activity.time}
                      </Typography>
                    </Box>
                  </Box>
                }
              />
            </ListItem>
            {index < stats.recentActivity.length - 1 && (
              <Divider variant="inset" component="li" />
            )}
          </React.Fragment>
        ))}
      </List>
    </Card>
  );
};

const PropertiesOverview: React.FC = () => {
  const { stats } = useDashboard();
  const { user } = useAuth();
  const showManageButton = isAdminOrAgent(user);

  if (!stats?.propertyStats) return null;

  return (
    <Card>
      <CardHeader
        title="Properties Overview"
        action={
          showManageButton && (
            <Button color="primary" href="/dashboard/properties">
              Manage Properties
            </Button>
          )
        }
      />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="primary.main">
                {stats.propertyStats.activeListings}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Listings
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="secondary.main">
                {stats.propertyStats.pendingSales}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending Sales
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const DashboardHome: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const { language } = useSettings();
  const { stats, loading, error } = useDashboard();
  const t = translations[language];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mx: 2, mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!stats) {
    return (
      <Alert severity="info" sx={{ mx: 2, mt: 2 }}>
        No dashboard data available
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.name}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your properties today.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={3}>
          <StatCard
            title="Total Views"
            value={stats.totalViews}
            icon={<VisibilityIcon />}
            color={theme.palette.primary.main}
            trend={stats.propertyStats.trends.views}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StatCard
            title="Properties"
            value={stats.totalProperties}
            icon={<HomeIcon />}
            color={theme.palette.secondary.main}
            trend={stats.propertyStats.trends.properties}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StatCard
            title="Favorites"
            value={stats.totalFavorites}
            icon={<FavoriteIcon />}
            color={theme.palette.error.main}
            trend={stats.propertyStats.trends.favorites}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StatCard
            title="Messages"
            value={stats.totalMessages}
            icon={<MessageIcon />}
            color={theme.palette.success.main}
            trend={stats.propertyStats.trends.messages}
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <PropertiesOverview />
        </Grid>
        <Grid item xs={12} md={4}>
          <RecentActivity />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardHome;
