// src/components/dashboard/DashboardSidebar.tsx
'use client';

import { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
  Collapse,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  Favorite as FavoriteIcon,
  Search as SearchIcon,
  Message as MessageIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  ExpandLess,
  ExpandMore,
  Menu as MenuIcon,
  KeyboardDoubleArrowRight as CollapseIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';
import { translations } from '@/translations';

const DRAWER_WIDTH = 280;
const COLLAPSED_WIDTH = 65;

interface MenuItem {
  title: string;
  path: string;
  icon: React.ReactElement;
  children?: { title: string; path: string }[];
}

export default function DashboardSidebar() {
  const [open, setOpen] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const { user, logout } = useAuth();
  const { language } = useSettings();
  const t = translations[language];

  const menuItems: MenuItem[] = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: <DashboardIcon />,
    },
    {
      title: 'Properties',
      path: '/dashboard/properties',
      icon: <HomeIcon />,
      children: [
        { title: 'Browse', path: '/properties' },
        { title: 'Edit Property', path: '/dashboard/properties/edit' },
        { title: 'Add New', path: '/dashboard/properties/add' },
      ],
    },
    {
      title: 'Favorite',
      path: '/dashboard/favorite',
      icon: <FavoriteIcon />,
    },
    {
      title: 'Messages',
      path: '/dashboard/messages',
      icon: <MessageIcon />,
    },
    {
      title: 'Settings',
      path: '/dashboard/settings',
      icon: <SettingsIcon />,
    },
  ];

  const handleClick = (path: string) => {
    if (!isExpanded) {
      setIsExpanded(true);
      return;
    }
    if (open === path) {
      setOpen(null);
    } else {
      setOpen(path);
    }
  };

  const handleDrawerToggle = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setOpen(null);
    }
  };

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box
        sx={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: isExpanded ? 'space-between' : 'center',
          px: isExpanded ? 3 : 1,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        {isExpanded && (
          <Typography
            variant="h6"
            color="primary"
            fontWeight="bold"
            href="/"
            component={Link}
            sx={{
              display: 'flex',
              fontWeight: 700,
              color: 'primary.main',
              textDecoration: 'none',
              '&:hover': {
                color: 'primary.dark',
              },
            }}
          >
            RealEstate
          </Typography>
        )}
        <IconButton
          onClick={handleDrawerToggle}
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
            transition: theme.transitions.create(
              ['transform', 'background-color'],
              {
                duration: theme.transitions.duration.shorter,
              }
            ),
            ...(isExpanded && {
              transform: 'rotate(180deg)',
            }),
          }}
        >
          {isExpanded ? <CollapseIcon /> : <MenuIcon />}
        </IconButton>
      </Box>

      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <Box key={item.path}>
            <ListItem disablePadding>
              <Tooltip title={!isExpanded ? item.title : ''} placement="right">
                <ListItemButton
                  selected={pathname === item.path}
                  onClick={() => {
                    if (item.children) {
                      handleClick(item.path);
                    } else {
                      router.push(item.path);
                    }
                  }}
                  sx={{
                    minHeight: 48,
                    justifyContent: isExpanded ? 'initial' : 'center',
                    px: 2.5,
                    '&.Mui-selected': {
                      bgcolor: 'primary.light',
                      color: 'primary.contrastText',
                      '&:hover': {
                        bgcolor: 'primary.light',
                      },
                      '& .MuiListItemIcon-root': {
                        color: 'primary.contrastText',
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: isExpanded ? 3 : 'auto',
                      justifyContent: 'center',
                      color:
                        pathname === item.path
                          ? 'primary.contrastText'
                          : 'inherit',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {isExpanded && (
                    <>
                      <ListItemText primary={item.title} />
                      {item.children &&
                        (open === item.path ? <ExpandLess /> : <ExpandMore />)}
                    </>
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>

            {isExpanded && item.children && (
              <Collapse in={open === item.path} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.children.map((child) => (
                    <ListItemButton
                      key={child.path}
                      selected={pathname === child.path}
                      onClick={() => router.push(child.path)}
                      sx={{
                        pl: 4,
                        '&.Mui-selected': {
                          bgcolor: 'primary.light',
                          color: 'primary.contrastText',
                        },
                      }}
                    >
                      <ListItemText primary={child.title} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
          </Box>
        ))}
      </List>

      <Box
        sx={{
          p: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: isExpanded ? 'flex-start' : 'center',
        }}
      >
        {isExpanded && (
          <>
            <Typography variant="body2" color="text.secondary">
              Logged in as:
            </Typography>
            <Typography variant="body2" fontWeight="medium" sx={{ mb: 2 }}>
              {user?.name}
            </Typography>
          </>
        )}
        <Tooltip title={!isExpanded ? 'Logout' : ''} placement="right">
          <ListItemButton
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              logout();
            }}
            sx={{
              borderRadius: 1,
              minWidth: 0,
              justifyContent: isExpanded ? 'initial' : 'center',
              px: 2.5,
              '&:hover': {
                bgcolor: 'primary.light',
                color: 'primary.contrastText',
                '& .MuiListItemIcon-root': {
                  color: 'primary.contrastText',
                },
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: isExpanded ? 3 : 'auto',
                justifyContent: 'center',
              }}
            >
              <LogoutIcon />
            </ListItemIcon>
            {isExpanded && <ListItemText primary="Logout" />}
          </ListItemButton>
        </Tooltip>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { sm: isExpanded ? DRAWER_WIDTH : COLLAPSED_WIDTH },
        flexShrink: { sm: 0 },
      }}
    >
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: isExpanded ? DRAWER_WIDTH : COLLAPSED_WIDTH,
            borderRight: `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.paper',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
}
