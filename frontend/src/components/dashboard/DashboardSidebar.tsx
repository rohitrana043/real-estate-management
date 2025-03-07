// src/components/dashboard/DashboardSidebar.tsx
'use client';

import { dashboardRoutes } from '@/config/dashboardRoutes';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';
import { translations } from '@/translations';
import { hasRole } from '@/utils/roleUtils';
import {
  KeyboardDoubleArrowRight as CollapseIcon,
  ExpandLess,
  ExpandMore,
  Logout as LogoutIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import {
  Box,
  Collapse,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

const DRAWER_WIDTH = 280;
const COLLAPSED_WIDTH = 65;

export default function DashboardSidebar() {
  const [open, setOpen] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const { user, logout } = useAuth();
  const { language } = useSettings();
  const t = translations[language];

  // Filter routes based on user roles
  const authorizedRoutes = dashboardRoutes.filter((route) =>
    route.roles.some((role) => hasRole(user, role))
  );

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
      {/* Header */}
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

      {/* Navigation List */}
      <List sx={{ flexGrow: 1 }}>
        {authorizedRoutes.map((item) => (
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
                    {<item.icon />}
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
                  {item.children
                    .filter((child) =>
                      child.roles.some((role) => hasRole(user, role))
                    )
                    .map((child) => (
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

      {/* User Info and Logout */}
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
            <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
              {user?.name} ({user?.roles?.[0]?.replace('ROLE_', '')})
            </Typography>
          </>
        )}
        <Tooltip title={!isExpanded ? 'Logout' : ''} placement="right">
          <ListItemButton
            onClick={() => logout()}
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
