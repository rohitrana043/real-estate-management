// src/lib/api/auth.ts
import axiosInstance from './axios';
import axios, { AxiosError } from 'axios';
import { SecureRegisterCredentials, AdminRegisterResponse } from '@/types/auth';

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  role?: string;
}

export interface UserDTO {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  profilePicture?: string | null;
  enabled: boolean;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileDTO {
  name?: string;
  email?: string;
  phone?: string | null;
  address?: string | null;
  profilePicture?: string | File | null;
}

export interface LoginResponseDTO {
  token: string;
  refreshToken: string;
  tokenType: string;
  user: UserDTO;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

export interface PasswordResetRequest {
  token: string;
  newPassword: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

const REFRESH_TOKEN_URL = '/auth/token/refresh';
const REVOKE_TOKEN_URL = '/auth/token/revoke';

const authApi = {
  login: async (data: LoginDTO): Promise<LoginResponseDTO> => {
    const response = await axiosInstance.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterDTO): Promise<string> => {
    const response = await axiosInstance.post('/auth/register', data);
    return response.data;
  },

  verifyEmail: async (token: string): Promise<void> => {
    await axiosInstance.get(`/account/verify?token=${token}`);
  },

  resendVerification: async (email: string): Promise<void> => {
    await axiosInstance.post(`/account/resend-verification?email=${email}`);
  },

  forgotPassword: async (email: string): Promise<void> => {
    await axiosInstance.post(`/account/password/forgot?email=${email}`);
  },

  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await axiosInstance.post('/account/password/reset', {
      token,
      newPassword,
    });
  },

  getCurrentUser: async (): Promise<UserDTO> => {
    const response = await axiosInstance.get('/users/profile');
    return response.data;
  },

  // Updated profile update method to handle both text and file uploads
  updateProfile: async (data: UpdateProfileDTO): Promise<UserDTO> => {
    // Check if profilePicture is a File
    if (data.profilePicture instanceof File) {
      // Upload profile picture first
      const profilePictureUrl = await authApi.uploadProfilePicture(
        data.profilePicture
      );

      // Remove File and add URL to data
      const { profilePicture, ...profileData } = data;
      const updateData: UpdateProfileDTO = {
        ...profileData,
        profilePicture: profilePictureUrl,
      };

      // Update profile with picture URL
      const response = await axiosInstance.put('/users/profile', updateData);
      return response.data;
    }

    // Regular profile update without picture
    const response = await axiosInstance.put('/users/profile', data);
    return response.data;
  },

  // Method to upload profile picture
  uploadProfilePicture: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosInstance.post(
      '/users/profile/picture',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data.url;
  },

  changePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<void> => {
    await axiosInstance.post('/users/profile/change-password', {
      currentPassword,
      newPassword,
    });
  },

  registerSecure: async (
    data: SecureRegisterCredentials
  ): Promise<AdminRegisterResponse> => {
    const response = await axiosInstance.post('/auth/register/secure', data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    return response.data;
  },

  // Add method to check if user has admin privileges
  checkAdminAccess: async (): Promise<boolean> => {
    try {
      const user = await authApi.getCurrentUser();
      return user.roles.includes('ADMIN');
    } catch (error) {
      return false;
    }
  },

  refreshToken: async (refreshToken: string): Promise<TokenResponse> => {
    try {
      const response = await axios.post(REFRESH_TOKEN_URL, { refreshToken });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        // Clear stored tokens if refresh token is invalid
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      }
      throw error;
    }
  },

  revokeToken: async (refreshToken: string): Promise<void> => {
    try {
      await axiosInstance.post(REVOKE_TOKEN_URL, { refreshToken });
    } catch (error) {
      // Even if revocation fails, we'll still clear local tokens
      console.error('Failed to revoke token:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }
  },

  // Helper method to check if token is expired
  isTokenExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiryTime = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= expiryTime;
    } catch (error) {
      return true; // If we can't decode the token, consider it expired
    }
  },
};

export default authApi;
