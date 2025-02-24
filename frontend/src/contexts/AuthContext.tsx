// src/contexts/AuthContext.tsx
'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSnackbar } from 'notistack';
import authApi, {
  LoginDTO,
  RegisterDTO,
  UserDTO,
  TokenResponse,
  LoginResponseDTO,
} from '@/lib/api/auth';
import axios from '@/lib/api/axios';
import { setCookie, deleteCookie } from 'cookies-next';

interface AuthContextType {
  user: UserDTO | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginDTO) => Promise<void>;
  register: (data: RegisterDTO) => Promise<void>;
  logout: (
    showNotification?: boolean,
    redirectToLogin?: boolean
  ) => Promise<void>;
  refreshUserToken: () => Promise<TokenResponse | null>;
  verifyEmail: (token: string) => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  updateProfile: (data: Partial<UserDTO>) => Promise<UserDTO>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
}

// Create context with undefined initial value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Token expiration times
const ACCESS_TOKEN_EXPIRY = 15 * 60 * 1000; // 15 minutes
const TOKEN_REFRESH_INTERVAL = 14 * 60 * 1000; // Refresh every 14 minutes

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const pathname = usePathname();

  // Constants for timing
  const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes
  const TOKEN_REFRESH_BUFFER = 60 * 1000; // 1 minute before expiry
  const ACTIVITY_CHECK_INTERVAL = 60 * 1000; // Check activity every minute

  // Track user activity
  const updateUserActivity = useCallback(() => {
    setLastActivity(Date.now());
    // Store last activity timestamp in localStorage for persistence across tabs
    localStorage.setItem('lastActivity', Date.now().toString());
  }, []);

  // Setup activity listeners
  useEffect(() => {
    if (user) {
      // List of events to track
      const events = [
        'mousedown',
        'keydown',
        'scroll',
        'touchstart',
        'mousemove',
        'click',
      ];

      const handleActivity = () => {
        updateUserActivity();
      };

      // Add event listeners
      events.forEach((event) => {
        window.addEventListener(event, handleActivity);
      });

      // Remove event listeners on cleanup
      return () => {
        events.forEach((event) => {
          window.removeEventListener(event, handleActivity);
        });
      };
    }
  }, [user, updateUserActivity]);

  // Create a logout function that optionally redirects
  const logout = useCallback(
    async (showNotification = true, redirectToLogin = true) => {
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          try {
            await authApi.revokeToken(refreshToken);
          } catch (error) {
            console.error('Error revoking token:', error);
          }
        }
      } finally {
        // Clear storage
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('tokenExpiry');
        localStorage.removeItem('tokenType');

        // Clear cookie for middleware
        deleteCookie('auth-token');

        // Clear state
        setUser(null);

        // Reset axios default authorization header
        delete axios.defaults.headers.common.Authorization;

        // Show notification
        if (showNotification) {
          enqueueSnackbar('Successfully logged out', { variant: 'success' });
        }

        // Only redirect if explicitly requested
        if (redirectToLogin) {
          console.log('Redirecting to login');
          router.push('/login');
        } else {
          console.log('Logout completed without redirect');
        }
      }
    },
    [router, enqueueSnackbar]
  );

  // Check token expiration and user activity
  const checkSessionStatus = useCallback(async () => {
    const tokenExpiry = localStorage.getItem('tokenExpiry');
    const currentTime = Date.now();

    if (!tokenExpiry) return;

    const expiryTime = parseInt(tokenExpiry);
    const timeUntilExpiry = expiryTime - currentTime;
    const lastActivityTime = parseInt(
      localStorage.getItem('lastActivity') || lastActivity.toString()
    );
    const inactiveTime = currentTime - lastActivityTime;

    // If user has been inactive for too long, log them out
    if (inactiveTime >= INACTIVITY_TIMEOUT) {
      console.log('User inactive, logging out');
      await logout(true);
      return;
    }

    // If token is about to expire but user is active, refresh it
    if (
      timeUntilExpiry <= TOKEN_REFRESH_BUFFER &&
      inactiveTime < INACTIVITY_TIMEOUT
    ) {
      console.log('Token about to expire, refreshing...');
      await refreshUserToken();
    }
  }, [lastActivity, logout]);

  // Set up periodic session checks
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (user) {
      // Check session status periodically
      intervalId = setInterval(async () => {
        await checkSessionStatus();
      }, ACTIVITY_CHECK_INTERVAL);

      // Initial check
      checkSessionStatus();
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [user, checkSessionStatus]);

  // Handle auth state changes
  useEffect(() => {
    if (user && window.location.pathname === '/login') {
      const params = new URLSearchParams(window.location.search);
      const redirectPath = params.get('from');

      if (
        redirectPath &&
        redirectPath.startsWith('/') &&
        !redirectPath.startsWith('//') &&
        !redirectPath.includes('://')
      ) {
        console.log('Auth state changed, redirecting to:', redirectPath);
        router.replace(redirectPath);
      }
    }
  }, [user, router]);

  // Modified refreshUserToken to update timestamps
  const refreshUserToken =
    useCallback(async (): Promise<TokenResponse | null> => {
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await authApi.refreshToken(refreshToken);

        // Update tokens and timestamps
        localStorage.setItem('token', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem(
          'tokenExpiry',
          (Date.now() + ACCESS_TOKEN_EXPIRY).toString()
        );

        // Update activity timestamp when refreshing token
        updateUserActivity();

        // Update axios headers
        axios.defaults.headers.common.Authorization = `Bearer ${response.accessToken}`;

        return response;
      } catch (error) {
        console.error('Token refresh failed:', error);
        await logout(false);
        return null;
      }
    }, [logout, updateUserActivity]);

  // Refresh token periodically
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (user) {
      intervalId = setInterval(async () => {
        try {
          await refreshUserToken();
        } catch (error) {
          console.error('Failed to refresh token:', error);
        }
      }, TOKEN_REFRESH_INTERVAL);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [user, refreshUserToken]);

  console.log('AuthProvider component rendered');

  // Initial authentication check on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check for stored auth data on mount
        const token = localStorage.getItem('token');
        const refreshToken = localStorage.getItem('refreshToken');
        const userData = localStorage.getItem('user');

        if (token && refreshToken && userData) {
          // Check if token is expired and needs refresh
          const tokenExpiry = localStorage.getItem('tokenExpiry');
          const isTokenExpired =
            tokenExpiry && new Date().getTime() > parseInt(tokenExpiry);

          if (isTokenExpired) {
            try {
              await refreshUserToken();
            } catch (error) {
              // Just clear the auth state without redirecting
              clearAuthState();
            }
          } else {
            setUser(JSON.parse(userData));
            // Set auth cookie for server-side routing
            setCookie('auth-token', token, {
              maxAge: 60 * 60 * 24 * 7, // 7 days
              path: '/',
              sameSite: 'strict',
            });
          }
        } else {
          console.log('No auth data found, clearing state without redirect');
          clearAuthState();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        clearAuthState();
      } finally {
        setIsLoading(false);
      }
    };

    // Helper function to clear auth state without redirecting
    const clearAuthState = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('tokenExpiry');
      localStorage.removeItem('tokenType');
      deleteCookie('auth-token');
      setUser(null);
      delete axios.defaults.headers.common.Authorization;
    };

    initAuth();
  }, [refreshUserToken]);

  // Modified setAuthState to include activity timestamp
  const setAuthState = (authResponse: LoginResponseDTO) => {
    const { token, refreshToken, user: userData, tokenType } = authResponse;

    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('tokenType', tokenType);
    localStorage.setItem(
      'tokenExpiry',
      (Date.now() + ACCESS_TOKEN_EXPIRY).toString()
    );
    localStorage.setItem('lastActivity', Date.now().toString());

    // Set axios default authorization header
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;

    // Set cookie for middleware
    setCookie('auth-token', token, {
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
      sameSite: 'strict',
    });

    setUser(userData);
    updateUserActivity();
  };

  const login = async (data: LoginDTO) => {
    try {
      const response = await authApi.login(data);
      setAuthState(response);
      const params = new URLSearchParams(window.location.search);
      const redirectPath = params.get('from');
      // Validate the redirect path
      const isValidRedirect =
        redirectPath &&
        redirectPath.startsWith('/') &&
        !redirectPath.startsWith('//') &&
        !redirectPath.includes('://');

      // Set final redirect path
      const finalPath = isValidRedirect ? redirectPath : '/dashboard';
      console.log('Final redirect path:', finalPath);

      enqueueSnackbar('Successfully logged in', { variant: 'success' });
      // Use replace instead of push and await the navigation
      await router.replace(finalPath);
    } catch (error: any) {
      enqueueSnackbar(error.response?.data?.message || 'Login failed', {
        variant: 'error',
      });
      throw error;
    }
  };

  const register = async (data: RegisterDTO) => {
    try {
      await authApi.register(data);
      enqueueSnackbar(
        'Registration successful. Please check your email to verify your account.',
        { variant: 'success' }
      );
      console.log('Redirecting to login after registration');
      router.push('/login');
    } catch (error: any) {
      enqueueSnackbar(error.response?.data?.message || 'Registration failed', {
        variant: 'error',
      });
      throw error;
    }
  };

  const verifyEmail = async (token: string) => {
    try {
      await authApi.verifyEmail(token);
      enqueueSnackbar('Email verified successfully', { variant: 'success' });
      console.log('Redirecting to login after email verification');
      router.push('/login');
    } catch (error: any) {
      enqueueSnackbar(
        error.response?.data?.message || 'Email verification failed',
        { variant: 'error' }
      );
      throw error;
    }
  };

  const resendVerification = async (email: string) => {
    try {
      await authApi.resendVerification(email);
      enqueueSnackbar('Verification email sent', { variant: 'success' });
    } catch (error: any) {
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to send verification email',
        { variant: 'error' }
      );
      throw error;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await authApi.forgotPassword(email);
      enqueueSnackbar('Password reset email sent', { variant: 'success' });
    } catch (error: any) {
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to send reset email',
        { variant: 'error' }
      );
      throw error;
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      await authApi.resetPassword(token, newPassword);
      enqueueSnackbar('Password reset successful', { variant: 'success' });
      console.log('Redirecting to login after password reset');
      router.push('/login');
    } catch (error: any) {
      enqueueSnackbar(
        error.response?.data?.message || 'Password reset failed',
        { variant: 'error' }
      );
      throw error;
    }
  };

  const updateProfile = async (data: Partial<UserDTO>): Promise<UserDTO> => {
    try {
      const updatedUser = await authApi.updateProfile(data);
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      enqueueSnackbar('Profile updated successfully', { variant: 'success' });
      return updatedUser;
    } catch (error: any) {
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to update profile',
        { variant: 'error' }
      );
      throw error;
    }
  };

  // Method to handle password changes
  const changePassword = async (
    currentPassword: string,
    newPassword: string,
    changePassword: string
  ) => {
    try {
      await authApi.changePassword(
        currentPassword,
        newPassword,
        changePassword
      );
      enqueueSnackbar('Password changed successfully', { variant: 'success' });

      // Log out after successful password change
      await logout();
    } catch (error: any) {
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to change password',
        { variant: 'error' }
      );
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    refreshUserToken,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
    updateProfile,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
