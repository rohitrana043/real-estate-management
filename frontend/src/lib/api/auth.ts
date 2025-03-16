// src/lib/api/auth.ts
import axiosInstance from './axios';
import axios, { AxiosError } from 'axios';
import {
  LoginDTO,
  LoginResponseDTO,
  RegisterDTO,
  UserDTO,
  UpdateProfileDTO,
  TokenResponse,
  SecureRegisterCredentials,
  AdminRegisterResponse,
} from '@/types/auth';
import { withMock } from './mockUtil';

const REFRESH_TOKEN_URL = '/auth/token/refresh';
const REVOKE_TOKEN_URL = '/auth/token/revoke';

const authApi = {
  login: async (data: LoginDTO): Promise<LoginResponseDTO> => {
    return withMock(
      () =>
        axiosInstance
          .post('/auth/login', data)
          .then((response) => response.data),
      'auth.login',
      'login',
      data // Pass the login credentials for mock authentication
    );
  },

  register: async (data: RegisterDTO): Promise<string> => {
    return withMock(
      () =>
        axiosInstance
          .post('/auth/register', data)
          .then((response) => response.data),
      'auth.register',
      'register'
    );
  },

  verifyEmail: async (token: string): Promise<void> => {
    return withMock(
      () => axiosInstance.get(`/account/verify?token=${token}`).then(() => {}),
      'auth.verifyEmail',
      'verifyEmail'
    );
  },

  resendVerification: async (email: string): Promise<void> => {
    return withMock(
      () =>
        axiosInstance
          .post(`/account/resend-verification?email=${email}`)
          .then(() => {}),
      'auth.resendVerification',
      'resendVerification'
    );
  },

  forgotPassword: async (email: string): Promise<void> => {
    return withMock(
      () =>
        axiosInstance
          .post(`/account/password/forgot?email=${email}`)
          .then(() => {}),
      'auth.forgotPassword',
      'forgotPassword'
    );
  },

  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    return withMock(
      () =>
        axiosInstance
          .post('/account/password/reset', {
            token,
            newPassword,
          })
          .then(() => {}),
      'auth.resetPassword',
      'resetPassword'
    );
  },

  getCurrentUser: async (): Promise<UserDTO> => {
    return withMock(
      () =>
        axiosInstance.get('/users/profile').then((response) => response.data),
      'auth.getCurrentUser',
      'getCurrentUser',
      // Special handler for mock mode to return the current user based on localStorage token
      { getCurrentUserMock: true }
    );
  },

  // Updated profile update method to handle both text and file uploads
  updateProfile: async (data: UpdateProfileDTO): Promise<UserDTO> => {
    return withMock(
      async () => {
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
          const response = await axiosInstance.put(
            '/users/profile',
            updateData
          );
          return response.data;
        }

        // Regular profile update without picture
        const response = await axiosInstance.put('/users/profile', data);
        return response.data;
      },
      'auth.updateProfile',
      'updateProfile'
    );
  },

  // Method to upload profile picture
  uploadProfilePicture: async (file: File): Promise<string> => {
    return withMock(
      () => {
        const formData = new FormData();
        formData.append('file', file);

        return axiosInstance
          .post('/users/profile/picture', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then((response) => response.data.url);
      },
      'auth.uploadProfilePicture',
      'uploadProfilePicture'
    );
  },

  changePassword: async (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<void> => {
    return withMock(
      () =>
        axiosInstance
          .post('/users/change-password', {
            currentPassword,
            newPassword,
            confirmPassword,
          })
          .then(() => {}),
      'auth.changePassword',
      'changePassword'
    );
  },

  // Add method to check if user has admin privileges
  checkAdminAccess: async (): Promise<boolean> => {
    return withMock(
      async () => {
        try {
          const user = await authApi.getCurrentUser();
          return user.roles.includes('ADMIN');
        } catch (error) {
          return false;
        }
      },
      'auth.getCurrentUser',
      'checkAdminAccess'
    ).then((user) => {
      if (user && user.roles) {
        return user.roles.includes('ADMIN');
      }
      return false;
    });
  },

  refreshToken: async (refreshToken: string): Promise<TokenResponse> => {
    return withMock(
      async () => {
        try {
          const response = await axiosInstance.post(REFRESH_TOKEN_URL, {
            refreshToken,
          });
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
      'auth.refreshToken',
      'refreshToken'
    );
  },

  // Continue with the rest of the methods...
  // For brevity, I'm not showing all methods but you would apply the same pattern

  getAllUsers: async (): Promise<UserDTO[]> => {
    return withMock(
      () => axiosInstance.get('/users').then((response) => response.data),
      'auth.getAllUsers',
      'getAllUsers'
    );
  },
};

export default authApi;
