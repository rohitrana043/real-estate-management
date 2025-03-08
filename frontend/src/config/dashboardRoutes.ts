// src/config/dashboardRoutes.ts
import { ROLES } from '@/utils/roleUtils';
import {
  Dashboard as DashboardIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  Favorite as FavoriteIcon,
  Message as MessageIcon,
  Settings as SettingsIcon,
  People as PeopleIcon,
  Add as AddIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

export const dashboardRoutes = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: DashboardIcon,
    roles: [ROLES.ADMIN, ROLES.AGENT, ROLES.CLIENT],
  },
  {
    title: 'Properties',
    path: '/properties',
    icon: HomeIcon,
    roles: [ROLES.ADMIN, ROLES.AGENT, ROLES.CLIENT],
    children: [
      {
        title: 'Browse',
        path: '/properties',
        roles: [ROLES.ADMIN, ROLES.AGENT, ROLES.CLIENT],
      },
      {
        title: 'Edit Property',
        path: '/dashboard/properties/edit',
        roles: [ROLES.ADMIN, ROLES.AGENT],
      },
      {
        title: 'Add New',
        path: '/dashboard/properties/add',
        roles: [ROLES.ADMIN, ROLES.AGENT],
      },
    ],
  },
  {
    title: 'Users',
    path: '/dashboard/users',
    icon: PeopleIcon,
    roles: [ROLES.ADMIN],
    children: [
      {
        title: 'All Users',
        path: '/dashboard/users',
        roles: [ROLES.ADMIN],
      },
      {
        title: 'Add User',
        path: '/dashboard/users/register',
        roles: [ROLES.ADMIN],
      },
    ],
  },
  {
    title: 'Favorite',
    path: '/dashboard/favorite',
    icon: FavoriteIcon,
    roles: [ROLES.ADMIN, ROLES.AGENT, ROLES.CLIENT],
  },
  {
    title: 'Messages',
    path: '/dashboard/messages',
    icon: MessageIcon,
    roles: [ROLES.ADMIN, ROLES.AGENT, ROLES.CLIENT],
  },
  {
    title: 'Settings',
    path: '/dashboard/settings',
    icon: SettingsIcon,
    roles: [ROLES.ADMIN, ROLES.AGENT, ROLES.CLIENT],
  },
];
