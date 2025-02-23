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
  const activities = [
    {
      id: 1,
      type: 'property_view',
      property: 'Modern Apartment',
      location: 'Downtown',
      time: '2 hours ago',
      icon: <VisibilityIcon />,
    },
    {
      id: 2,
      type: 'favorite_added',
      property: 'Luxury Villa',
      location: 'Beachfront',
      time: '5 hours ago',
      icon: <FavoriteIcon />,
    },
    {
      id: 3,
      type: 'message',
      property: 'Family House',
      location: 'Suburbs',
      time: '1 day ago',
      icon: <MessageIcon />,
    },
  ];

  return (
    <Card>
      <CardHeader title="Recent Activity" />
      <List sx={{ p: 0 }}>
        {activities.map((activity, index) => (
          <React.Fragment key={activity.id}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'primary.light' }}>
                  {activity.icon}
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
                        sx={{
                          fontSize: 14,
                          mr: 0.5,
                          color: 'text.secondary',
                        }}
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
                        sx={{
                          fontSize: 14,
                          mr: 0.5,
                          color: 'text.secondary',
                        }}
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
            {index < activities.length - 1 && (
              <Divider variant="inset" component="li" />
            )}
          </React.Fragment>
        ))}
      </List>
    </Card>
  );
};

const PropertiesOverview: React.FC = () => {
  return (
    <Card>
      <CardHeader
        title="Properties Overview"
        action={<Button color="primary">View All</Button>}
      />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="primary.main">
                15
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Listings
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="secondary.main">
                3
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

const DashboardHome: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const { language } = useSettings();
  const t = translations[language];

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
            value="2,845"
            icon={<VisibilityIcon />}
            color={theme.palette.primary.main}
            trend={{ value: 12, isPositive: true }}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StatCard
            title="Properties"
            value="18"
            icon={<HomeIcon />}
            color={theme.palette.secondary.main}
            trend={{ value: 5, isPositive: true }}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StatCard
            title="Favorites"
            value="245"
            icon={<FavoriteIcon />}
            color={theme.palette.error.main}
            trend={{ value: 8, isPositive: true }}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StatCard
            title="Messages"
            value="12"
            icon={<MessageIcon />}
            color={theme.palette.success.main}
            trend={{ value: 3, isPositive: false }}
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
