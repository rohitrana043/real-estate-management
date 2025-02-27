// src/app/dashboard/page.tsx
'use client';

import React, { useState } from 'react';
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
  Tab,
  Tabs,
  IconButton,
  Chip,
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
  TrendingUp as TrendingUpIcon,
  AttachMoney as AttachMoneyIcon,
  Apartment as ApartmentIcon,
  BusinessCenter as BusinessCenterIcon,
  House as HouseIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';
import { translations } from '@/translations';
import { useDashboard } from '@/hooks/useDashboard';
import { isAdminOrAgent } from '@/utils/roleUtils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';

// Define chart colors
const CHART_COLORS = [
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff8042',
  '#0088fe',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
];
const PIE_COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884d8',
  '#82ca9d',
];

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
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

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
    <Card
      sx={{
        height: '100%',
        boxShadow: 3,
        transition: 'transform 0.3s',
        '&:hover': { transform: 'translateY(-4px)' },
      }}
    >
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
                vs last period
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

  if (!stats?.recentActivity || stats.recentActivity.length === 0) {
    return (
      <Card sx={{ height: '100%', boxShadow: 3 }}>
        <CardHeader title="Property Activity" />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            No recent activity data available
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%', boxShadow: 3 }}>
      <CardHeader
        title="Property Activity"
        action={
          <IconButton>
            <RefreshIcon />
          </IconButton>
        }
      />
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

// Sample data for monthly property listings chart
const generateMonthlyData = () => {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const currentMonth = new Date().getMonth();

  return months.map((month, index) => {
    // Show more realistic data with some randomness but trend upward for recent months
    const baseValue = 10 + Math.floor(Math.random() * 20);
    const trend = index > currentMonth - 3 ? index * 3 : index;

    return {
      name: month,
      listings: baseValue + trend,
      sales: baseValue - 5 + Math.floor(Math.random() * 10),
    };
  });
};

// Sample data for property type distribution
const propertyTypeData = [
  { name: 'House', value: 35 },
  { name: 'Apartment', value: 40 },
  { name: 'Commercial', value: 15 },
  { name: 'Land', value: 10 },
];

// Sample data for price range distribution
const priceRangeData = [
  { name: 'Under $250k', value: 30 },
  { name: '$250k-$500k', value: 45 },
  { name: '$500k-$750k', value: 15 },
  { name: '$750k-$1M', value: 7 },
  { name: 'Over $1M', value: 3 },
];

// Price trend data
const priceTrendData = [
  { month: 'Jan', averagePrice: 320000 },
  { month: 'Feb', averagePrice: 325000 },
  { month: 'Mar', averagePrice: 318000 },
  { month: 'Apr', averagePrice: 332000 },
  { month: 'May', averagePrice: 340000 },
  { month: 'Jun', averagePrice: 355000 },
];

const PropertyTrendsChart: React.FC = () => {
  const monthlyData = generateMonthlyData();

  return (
    <Card sx={{ boxShadow: 3, height: '100%' }}>
      <CardHeader title="Monthly Property Trends" />
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={monthlyData}
            margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorListings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="listings"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorListings)"
              name="New Listings"
            />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#82ca9d"
              fillOpacity={1}
              fill="url(#colorSales)"
              name="Sales"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const PropertyTypeDistribution: React.FC = () => {
  return (
    <Card sx={{ boxShadow: 3, height: '100%' }}>
      <CardHeader title="Property Type Distribution" />
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={propertyTypeData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {propertyTypeData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={PIE_COLORS[index % PIE_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value}%`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const PriceRangeDistribution: React.FC = () => {
  return (
    <Card sx={{ boxShadow: 3, height: '100%' }}>
      <CardHeader title="Price Range Distribution" />
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={priceRangeData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `${value}%`} />
            <Bar dataKey="value" name="Percentage" fill="#8884d8">
              {priceRangeData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const PriceTrendChart: React.FC = () => {
  return (
    <Card sx={{ boxShadow: 3, height: '100%' }}>
      <CardHeader title="Average Price Trend" />
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={priceTrendData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
            <Legend />
            <Line
              type="monotone"
              dataKey="averagePrice"
              stroke="#8884d8"
              name="Average Price"
              activeDot={{ r: 8 }}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const PropertiesOverview: React.FC = () => {
  const { stats } = useDashboard();
  const { user } = useAuth();
  const showManageButton = isAdminOrAgent(user);

  if (!stats?.propertyStats) {
    return (
      <Card sx={{ boxShadow: 3, height: '100%' }}>
        <CardHeader title="Properties Overview" />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            No properties data available
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ boxShadow: 3, height: '100%' }}>
      <CardHeader
        title="Properties Overview"
        action={
          showManageButton && (
            <Button
              color="primary"
              href="/dashboard/properties"
              variant="contained"
              sx={{ borderRadius: 8 }}
            >
              Manage Properties
            </Button>
          )
        }
      />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                textAlign: 'center',
                borderRadius: 2,
                boxShadow: 2,
                bgcolor: 'primary.light',
                color: 'primary.contrastText',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 1,
                }}
              >
                <ApartmentIcon sx={{ mr: 1 }} />
                <Typography variant="h5" fontWeight="bold">
                  {stats.propertyStats.activeListings}
                </Typography>
              </Box>
              <Typography variant="body2">Available Properties</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                textAlign: 'center',
                borderRadius: 2,
                boxShadow: 2,
                bgcolor: 'secondary.light',
                color: 'secondary.contrastText',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 1,
                }}
              >
                <AttachMoneyIcon sx={{ mr: 1 }} />
                <Typography variant="h5" fontWeight="bold">
                  {stats.propertyStats.pendingSales}
                </Typography>
              </Box>
              <Typography variant="body2">Sold Properties</Typography>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Box
              sx={{
                mt: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Chip
                icon={<TrendingUpIcon />}
                label={`${Math.floor(Math.random() * 15) + 5}% Growth Rate`}
                color="success"
                sx={{ mr: 1 }}
              />
              <Chip
                icon={<HomeIcon />}
                label={`${
                  stats.propertyStats.activeListings +
                  stats.propertyStats.pendingSales
                } Total Properties`}
                color="primary"
              />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const MarketAnalytics: React.FC = () => {
  const { stats } = useDashboard();

  if (!stats) {
    return null;
  }

  return (
    <Card sx={{ boxShadow: 3 }}>
      <CardHeader
        title="Market Analytics"
        subheader="Current market data based on property analytics"
      />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Paper
              sx={{ p: 2, textAlign: 'center', borderRadius: 2, boxShadow: 1 }}
            >
              <Typography variant="h5" color="primary.main" fontWeight="bold">
                {stats.totalProperties}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Properties
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={3}>
            <Paper
              sx={{ p: 2, textAlign: 'center', borderRadius: 2, boxShadow: 1 }}
            >
              <Typography variant="h5" color="primary.main" fontWeight="bold">
                ${(stats.totalFavorites * 1000).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Average Price
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={3}>
            <Paper
              sx={{ p: 2, textAlign: 'center', borderRadius: 2, boxShadow: 1 }}
            >
              <Typography variant="h5" color="success.main" fontWeight="bold">
                {85}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Occupancy Rate
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={3}>
            <Paper
              sx={{ p: 2, textAlign: 'center', borderRadius: 2, boxShadow: 1 }}
            >
              <Typography variant="h5" color="error.main" fontWeight="bold">
                {stats.propertyStats.trends.favorites.value}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Price Growth
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
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

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
        No analytics data available. Please ensure the analytics service is
        running.
      </Alert>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          mb: 4,
          p: 3,
          borderRadius: 2,
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          color: 'white',
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Welcome back, {user?.name}!
        </Typography>
        <Typography variant="body1">
          Here's your real estate analytics summary.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={3}>
          <StatCard
            title="Property Views"
            value={stats.totalViews}
            icon={<VisibilityIcon />}
            color={theme.palette.primary.main}
            trend={stats.propertyStats.trends.views}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StatCard
            title="Total Properties"
            value={stats.totalProperties}
            icon={<HomeIcon />}
            color={theme.palette.secondary.main}
            trend={stats.propertyStats.trends.properties}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StatCard
            title="Available Properties"
            value={stats.propertyStats.activeListings}
            icon={<ApartmentIcon />}
            color={theme.palette.success.main}
            trend={stats.propertyStats.trends.favorites}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StatCard
            title="Sold Properties"
            value={stats.propertyStats.pendingSales}
            icon={<AttachMoneyIcon />}
            color={theme.palette.error.main}
            trend={stats.propertyStats.trends.messages}
          />
        </Grid>

        <Grid item xs={12}>
          <MarketAnalytics />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="dashboard tabs"
            >
              <Tab
                icon={<TrendingUpIcon />}
                iconPosition="start"
                label="Trends"
              />
              <Tab
                icon={<HomeIcon />}
                iconPosition="start"
                label="Properties"
              />
              <Tab
                icon={<BusinessCenterIcon />}
                iconPosition="start"
                label="Market"
              />
              <Tab
                icon={<LocationIcon />}
                iconPosition="start"
                label="Activity"
              />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <PropertyTrendsChart />
              </Grid>
              <Grid item xs={12} md={4}>
                <PriceTrendChart />
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <PropertiesOverview />
              </Grid>
              <Grid item xs={12} md={4}>
                <PropertyTypeDistribution />
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={7}>
                <PriceRangeDistribution />
              </Grid>
              <Grid item xs={12} md={5}>
                <PropertyTypeDistribution />
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <PropertyTrendsChart />
              </Grid>
              <Grid item xs={12} md={4}>
                <RecentActivity />
              </Grid>
            </Grid>
          </TabPanel>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardHome;
