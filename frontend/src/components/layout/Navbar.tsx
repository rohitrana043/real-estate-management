// src/components/layout/Navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
  Avatar,
  Collapse,
  List,
  ListItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import TranslateIcon from '@mui/icons-material/Translate';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { hasRole } from '@/utils/roleUtils';
import { dashboardRoutes } from '@/config/dashboardRoutes';
import LogoutIcon from '@mui/icons-material/Logout';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useSettings } from '@/contexts/SettingsContext';
import { translations } from '@/translations';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElSettings, setAnchorElSettings] = useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElServices, setAnchorElServices] = useState<null | HTMLElement>(
    null
  );
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const { themeMode, language, toggleTheme, changeLanguage } = useSettings();
  const { isAuthenticated, user, logout } = useAuth();

  const t = translations[language];

  // Base navigation pages
  const pages = [
    { title: t.common.properties, path: '/properties' },
    {
      title: t.common.services,
      path: '/services',
      hasChildren: true,
      children: [
        { title: t.footer.buyProperty, path: '/services/buy' },
        { title: t.footer.sellProperty, path: '/services/sell' },
        { title: t.footer.rentProperty, path: '/services/rent' },
        { title: t.footer.marketAnalysis, path: '/services/analysis' },
      ],
    },
    { title: t.common.about, path: '/about' },
    { title: t.common.contact, path: '/contact' },
  ];

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenSettingsMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElSettings(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseSettingsMenu = () => {
    setAnchorElSettings(null);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenServicesMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElServices(event.currentTarget);
  };

  const handleCloseServicesMenu = () => {
    setAnchorElServices(null);
  };

  const toggleMobileServices = () => {
    setMobileServicesOpen(!mobileServicesOpen);
  };

  const handleLogout = async () => {
    await logout();
    handleCloseUserMenu();
    router.push('/');
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Desktop Logo */}
          <HomeIcon
            sx={{
              display: { xs: 'none', md: 'flex' },
              mr: 1,
              color: 'primary.main',
            }}
          />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            href="/"
            sx={{
              mr: 4,
              display: { xs: 'none', md: 'flex' },
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

          {/* Mobile Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="primary"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) =>
                page.hasChildren ? (
                  <Box key={page.title}>
                    <MenuItem onClick={toggleMobileServices}>
                      <Typography
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        {page.title}
                        {mobileServicesOpen ? (
                          <ExpandLessIcon sx={{ ml: 1 }} />
                        ) : (
                          <ExpandMoreIcon sx={{ ml: 1 }} />
                        )}
                      </Typography>
                    </MenuItem>
                    <Collapse
                      in={mobileServicesOpen}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List sx={{ pl: 2 }}>
                        <MenuItem
                          onClick={() => {
                            handleCloseNavMenu();
                            router.push(page.path);
                          }}
                          sx={{
                            color: isActive(page.path)
                              ? 'primary.main'
                              : 'inherit',
                            fontWeight: isActive(page.path) ? 'bold' : 'normal',
                          }}
                        >
                          <Typography variant="body2">
                            {t.common.allServices}
                          </Typography>
                        </MenuItem>
                        {page.children?.map((child) => (
                          <MenuItem
                            key={child.title}
                            onClick={() => {
                              handleCloseNavMenu();
                              router.push(child.path);
                            }}
                            sx={{
                              color: isActive(child.path)
                                ? 'primary.main'
                                : 'inherit',
                              fontWeight: isActive(child.path)
                                ? 'bold'
                                : 'normal',
                            }}
                          >
                            <Typography variant="body2">
                              {child.title}
                            </Typography>
                          </MenuItem>
                        ))}
                      </List>
                    </Collapse>
                  </Box>
                ) : (
                  <MenuItem
                    key={page.title}
                    onClick={() => {
                      handleCloseNavMenu();
                      router.push(page.path);
                    }}
                    sx={{
                      color: isActive(page.path) ? 'primary.main' : 'inherit',
                      fontWeight: isActive(page.path) ? 'bold' : 'normal',
                    }}
                  >
                    <Typography textAlign="center">{page.title}</Typography>
                  </MenuItem>
                )
              )}
              <Divider />
              {!isAuthenticated ? (
                [
                  <MenuItem key="login" onClick={() => router.push('/login')}>
                    <Typography textAlign="center">{t.common.login}</Typography>
                  </MenuItem>,
                  <MenuItem
                    key="register"
                    onClick={() => router.push('/register')}
                  >
                    <Typography textAlign="center">
                      {t.common.register}
                    </Typography>
                  </MenuItem>,
                ]
              ) : (
                // Only show dashboard link in mobile menu, not all dashboard links
                <MenuItem
                  key="dashboard"
                  onClick={() => router.push('/dashboard')}
                >
                  <ListItemIcon>
                    <DashboardIcon fontSize="small" />
                  </ListItemIcon>
                  <Typography textAlign="center">
                    {t.common.dashboard}
                  </Typography>
                </MenuItem>
              )}
            </Menu>
          </Box>

          {/* Mobile Logo */}
          <HomeIcon
            sx={{
              display: { xs: 'flex', md: 'none' },
              mr: 1,
              color: 'primary.main',
            }}
          />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            href="/"
            sx={{
              flexGrow: 1,
              display: { xs: 'flex', md: 'none' },
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

          {/* Desktop Menu */}
          <Box
            sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 2 }}
          >
            {pages.map((page) =>
              page.hasChildren ? (
                <Box key={page.title} sx={{ position: 'relative' }}>
                  <Button
                    onClick={handleOpenServicesMenu}
                    sx={{
                      color:
                        isActive(page.path) ||
                        page.children?.some((child) => isActive(child.path))
                          ? 'primary.main'
                          : 'text.primary',
                      fontWeight:
                        isActive(page.path) ||
                        page.children?.some((child) => isActive(child.path))
                          ? 'bold'
                          : 500,
                      '&:hover': {
                        color: 'primary.main',
                        backgroundColor: 'transparent',
                      },
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    endIcon={<ExpandMoreIcon />}
                  >
                    {page.title}
                  </Button>
                  <Menu
                    id="services-menu"
                    anchorEl={anchorElServices}
                    open={Boolean(anchorElServices)}
                    onClose={handleCloseServicesMenu}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'center',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'center',
                    }}
                  >
                    <MenuItem
                      onClick={() => {
                        handleCloseServicesMenu();
                        router.push(page.path);
                      }}
                      sx={{
                        fontWeight: isActive(page.path) ? 'bold' : 'normal',
                        color: isActive(page.path) ? 'primary.main' : 'inherit',
                        minWidth: 200,
                      }}
                    >
                      {t.common.allServices}
                    </MenuItem>
                    <Divider />
                    {page.children?.map((child) => (
                      <MenuItem
                        key={child.title}
                        onClick={() => {
                          handleCloseServicesMenu();
                          router.push(child.path);
                        }}
                        sx={{
                          fontWeight: isActive(child.path) ? 'bold' : 'normal',
                          color: isActive(child.path)
                            ? 'primary.main'
                            : 'inherit',
                        }}
                      >
                        {child.title}
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              ) : (
                <Button
                  key={page.title}
                  onClick={() => router.push(page.path)}
                  sx={{
                    color: isActive(page.path)
                      ? 'primary.main'
                      : 'text.primary',
                    fontWeight: isActive(page.path) ? 'bold' : 500,
                    '&:hover': {
                      color: 'primary.main',
                      backgroundColor: 'transparent',
                    },
                  }}
                >
                  {page.title}
                </Button>
              )
            )}
          </Box>

          {/* Settings and User Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Settings Menu */}
            <IconButton
              onClick={handleOpenSettingsMenu}
              color="primary"
              aria-label="settings"
            >
              <SettingsIcon />
            </IconButton>
            <Menu
              id="settings-menu"
              anchorEl={anchorElSettings}
              open={Boolean(anchorElSettings)}
              onClose={handleCloseSettingsMenu}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              {/* Theme Toggle */}
              <MenuItem onClick={toggleTheme}>
                <ListItemIcon>
                  {themeMode === 'dark' ? (
                    <Brightness7Icon />
                  ) : (
                    <Brightness4Icon />
                  )}
                </ListItemIcon>
                <ListItemText>
                  {themeMode === 'dark'
                    ? t.common.lightMode
                    : t.common.darkMode}
                </ListItemText>
              </MenuItem>

              {/* Language Selection */}
              <MenuItem
                onClick={() => changeLanguage(language === 'en' ? 'fr' : 'en')}
              >
                <ListItemIcon>
                  <TranslateIcon />
                </ListItemIcon>
                <ListItemText>
                  {language === 'en' ? 'Français' : 'English'}
                </ListItemText>
              </MenuItem>
            </Menu>

            {/* Auth Buttons or User Menu */}
            {!isAuthenticated ? (
              <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => router.push('/login')}
                >
                  {t.common.login}
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => router.push('/register')}
                >
                  {t.common.register}
                </Button>
              </Box>
            ) : (
              <>
                <IconButton
                  onClick={handleOpenUserMenu}
                  sx={{ padding: 0 }}
                  aria-label="user menu"
                >
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {user?.name?.[0] || 'U'}
                  </Avatar>
                </IconButton>
                <Menu
                  id="user-menu"
                  anchorEl={anchorElUser}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <MenuItem onClick={() => router.push('/dashboard')}>
                    <ListItemIcon>
                      <DashboardIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{t.common.dashboard}</ListItemText>
                  </MenuItem>
                  {dashboardRoutes
                    .filter(
                      (route) =>
                        route.roles.some((role) => hasRole(user, role)) &&
                        route.path !== '/dashboard'
                    )
                    .map((route) => (
                      <MenuItem
                        key={route.path}
                        onClick={() => {
                          handleCloseUserMenu();
                          router.push(route.path);
                        }}
                      >
                        <ListItemIcon>
                          <route.icon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>{route.title}</ListItemText>
                      </MenuItem>
                    ))}
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{t.common.logout}</ListItemText>
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
