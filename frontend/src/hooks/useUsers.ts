// src/hooks/useUsers.ts
import { useState, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import authApi from '@/lib/api/auth';
import { UserDTO } from '@/types/auth';
import { ROLES } from '@/utils/roleUtils';

interface UseUsersReturn {
  users: UserDTO[];
  loading: boolean;
  error: string | null;
  totalUsers: number;
  fetchUsers: () => Promise<void>;
  fetchUserById: (id: number) => Promise<UserDTO>;
  createUser: (userData: Partial<UserDTO>) => Promise<UserDTO>;
  updateUser: (id: number, userData: Partial<UserDTO>) => Promise<UserDTO>;
  deleteUser: (id: number) => Promise<void>;
  getUsersByRole: (role: string) => Promise<UserDTO[]>;
}

export const useUsers = (): UseUsersReturn => {
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await authApi.getAllUsers();
      setUsers(data);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Failed to fetch users';
      setError(errorMessage);
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  const fetchUserById = useCallback(
    async (id: number): Promise<UserDTO> => {
      try {
        setLoading(true);
        setError(null);
        const user = await authApi.getUserById(id);
        return user;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || 'Failed to fetch user';
        setError(errorMessage);
        enqueueSnackbar(errorMessage, { variant: 'error' });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [enqueueSnackbar]
  );

  const createUser = useCallback(
    async (userData: Partial<UserDTO>): Promise<UserDTO> => {
      try {
        setLoading(true);
        setError(null);

        // For new users, we use the registerSecure endpoint
        const result = await authApi.registerSecure({
          ...userData,
          role: userData.roles?.[0] || ROLES.CLIENT,
        } as any);

        // Only execute these lines if registration succeeded
        await fetchUsers();
        enqueueSnackbar('User created successfully', { variant: 'success' });
        return result; // Return the actual result from API
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          (typeof err.response?.data === 'string' ? err.response.data : null) ||
          err.message ||
          'Failed to create user';

        setError(errorMessage);
        enqueueSnackbar(errorMessage, { variant: 'error' });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchUsers, enqueueSnackbar]
  );

  const updateUser = useCallback(
    async (id: number, userData: Partial<UserDTO>): Promise<UserDTO> => {
      try {
        setLoading(true);
        setError(null);
        const updatedUser = await authApi.updateUser(id, userData);

        // Update the users list
        setUsers((prev) =>
          prev.map((user) =>
            user.id === id ? { ...user, ...updatedUser } : user
          )
        );

        enqueueSnackbar('User updated successfully', { variant: 'success' });
        return updatedUser;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || 'Failed to update user';
        setError(errorMessage);
        enqueueSnackbar(errorMessage, { variant: 'error' });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [enqueueSnackbar]
  );

  const deleteUser = useCallback(
    async (id: number): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        await authApi.deleteUser(id);

        // Update the users list
        setUsers((prev) => prev.filter((user) => user.id !== id));

        enqueueSnackbar('User deleted successfully', { variant: 'success' });
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || 'Failed to delete user';
        setError(errorMessage);
        enqueueSnackbar(errorMessage, { variant: 'error' });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [enqueueSnackbar]
  );

  const getUsersByRole = useCallback(
    async (role: string): Promise<UserDTO[]> => {
      try {
        setLoading(true);
        setError(null);
        const data = await authApi.getUsersByRole(role);
        return data;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || 'Failed to fetch users by role';
        setError(errorMessage);
        enqueueSnackbar(errorMessage, { variant: 'error' });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [enqueueSnackbar]
  );

  return {
    users,
    loading,
    error,
    totalUsers: users.length,
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
    getUsersByRole,
  };
};
