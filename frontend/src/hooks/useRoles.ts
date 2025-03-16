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

  // Debug user roles when using mock data
  if (process.env.NEXT_PUBLIC_USE_MOCK_API === 'true' && user) {
    console.log('Current user roles:', user.roles);
  }

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
