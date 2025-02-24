// src/utils/roleUtils.ts
import { UserDTO } from '@/types/auth';

export const ROLES = {
  ADMIN: 'ROLE_ADMIN',
  AGENT: 'ROLE_AGENT',
  CLIENT: 'ROLE_CLIENT',
} as const;

export type RoleType = (typeof ROLES)[keyof typeof ROLES];

export const hasRole = (user: UserDTO | null, role: RoleType): boolean => {
  return user?.roles?.includes(role) || false;
};

export const isAdmin = (user: UserDTO | null): boolean => {
  return hasRole(user, ROLES.ADMIN);
};

export const isAgent = (user: UserDTO | null): boolean => {
  return hasRole(user, ROLES.AGENT);
};

export const isAdminOrAgent = (user: UserDTO | null): boolean => {
  return isAdmin(user) || isAgent(user);
};

export const canManageProperties = (user: UserDTO | null): boolean => {
  return isAdminOrAgent(user);
};

export const canManageUsers = (user: UserDTO | null): boolean => {
  return isAdmin(user);
};
