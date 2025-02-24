// src/hooks/useRoles.ts
import { useAuth } from '@/contexts/AuthContext';
import {
  isAdmin,
  isAgent,
  isAdminOrAgent,
  canManageProperties,
  canManageUsers,
  ROLES,
} from '@/utils/roleUtils';

export const useRoles = () => {
  const { user } = useAuth();

  return {
    isAdmin: isAdmin(user),
    isAgent: isAgent(user),
    isAdminOrAgent: isAdminOrAgent(user),
    canManageProperties: canManageProperties(user),
    canManageUsers: canManageUsers(user),
    userRole: user?.roles?.[0] || '',
    ROLES,
  };
};
