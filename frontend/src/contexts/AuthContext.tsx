// src/contexts/AuthContext.tsx
'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSnackbar } from 'notistack';
import authApi from '@/lib/api/auth';
import {
  LoginDTO,
  RegisterDTO,
  UserDTO,
  TokenResponse,
  LoginResponseDTO,
} from '@/types/auth';
import axios from '@/lib/api/axios';
import { AxiosError } from 'axios';
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
    newPassword: string,
    confirmPassword: string
  ) => Promise<void>;
}

// Create context with undefined initial value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Token expiration times
const ACCESS_TOKEN_EXPIRY = 15 * 60 * 1000; // 15 minutes
const TOKEN_REFRESH_INTERVAL = 14 * 60 * 1000; // Refresh every 14 minutes

// Constants for timing
const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes
const TOKEN_REFRESH_BUFFER = 60 * 1000; // 1 minute before expiry
const ACTIVITY_CHECK_INTERVAL = 60 * 1000; // Check activity every minute

// Storage keys for better organization
const STORAGE_KEYS = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  TOKEN_EXPIRY: 'tokenExpiry',
  TOKEN_TYPE: 'tokenType',
  LAST_ACTIVITY: 'lastActivity',
};

// Custom browser storage event name for auth sync
const AUTH_SYNC_EVENT = 'auth-state-change';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const pathname = usePathname();

  // Keep track if we're in the process of refreshing to avoid multiple concurrent refreshes
  const isRefreshingToken = useRef(false);

  // Use refs to keep track of intervals so we can clear them safely
  const activityCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const tokenRefreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize axios interceptor for handling 401 responses
  useEffect(() => {
    // Add response interceptor to handle unauthorized responses
    const interceptorId = axios.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Only handle 401s that aren't from the auth endpoints
          const url = error.config?.url || '';
          if (
            !url.includes('/auth/login') &&
            !url.includes('/auth/token/refresh')
          ) {
            console.log('401 response from API, logging out');

            // Check if we can refresh the token
            try {
              const refreshToken = localStorage.getItem(
                STORAGE_KEYS.REFRESH_TOKEN
              );
              if (refreshToken && !isRefreshingToken.current) {
                isRefreshingToken.current = true;

                // Try to refresh the token
                const response = await refreshUserToken();
                isRefreshingToken.current = false;

                if (response) {
                  // Retry the original request with the new token
                  if (error.config) {
                    error.config.headers[
                      'Authorization'
                    ] = `Bearer ${response.accessToken}`;
                    return axios(error.config);
                  }
                }
              }
            } catch (refreshError) {
              console.error('Failed to refresh token after 401:', refreshError);
            }

            // If we reach here, we couldn't refresh the token, so log the user out
            await logout(true, true);
            return Promise.reject(error);
          }
        }
        return Promise.reject(error);
      }
    );

    // Clean up the interceptor
    return () => {
      axios.interceptors.response.eject(interceptorId);
    };
  }, []);

  // Custom event to synchronize auth state across tabs
  useEffect(() => {
    // Function to handle storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.TOKEN || e.key === STORAGE_KEYS.USER) {
        if (!e.newValue) {
          // Token or user was removed in another tab
          console.log('Auth state changed in another tab (logged out)');
          clearAuthState(false);
        } else if (
          e.key === STORAGE_KEYS.USER &&
          e.newValue !== JSON.stringify(user)
        ) {
          // User data was updated in another tab
          console.log('User data updated in another tab');
          setUser(JSON.parse(e.newValue));
        }
      } else if (e.key === STORAGE_KEYS.LAST_ACTIVITY) {
        // Last activity was updated in another tab - no need to do anything
      }
    };

    // Listen for storage events
    window.addEventListener('storage', handleStorageChange);

    // Custom event for immediate sync across tabs
    const handleAuthSync = (e: CustomEvent) => {
      const { type, payload } = e.detail;

      if (type === 'logout') {
        clearAuthState(false);
      } else if (type === 'login' && payload) {
        setUser(payload.user);
      }
    };

    window.addEventListener(AUTH_SYNC_EVENT, handleAuthSync as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(
        AUTH_SYNC_EVENT,
        handleAuthSync as EventListener
      );
    };
  }, [user]);

  // Helper function to clear auth state without redirecting
  const clearAuthState = useCallback(
    (shouldRedirect = false) => {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY);
      localStorage.removeItem(STORAGE_KEYS.TOKEN_TYPE);
      deleteCookie('auth-token');
      setUser(null);
      delete axios.defaults.headers.common.Authorization;

      // Clear intervals
      if (activityCheckIntervalRef.current) {
        clearInterval(activityCheckIntervalRef.current);
        activityCheckIntervalRef.current = null;
      }

      if (tokenRefreshIntervalRef.current) {
        clearInterval(tokenRefreshIntervalRef.current);
        tokenRefreshIntervalRef.current = null;
      }

      if (shouldRedirect) {
        router.push('/login');
      }
    },
    [router]
  );

  // Track user activity
  const updateUserActivity = useCallback(() => {
    const timestamp = Date.now().toString();
    // Store last activity timestamp in localStorage for persistence across tabs
    localStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY, timestamp);
  }, []);

  // Setup activity listeners
  useEffect(() => {
    if (!user) return;

    const events = ['keydown', 'touchstart', 'click', 'mousemove', 'scroll'];
    const handleActivity = () => updateUserActivity();

    // Add event listeners with a throttled approach
    let lastUpdate = Date.now();
    const throttledHandleActivity = () => {
      const now = Date.now();
      if (now - lastUpdate > 5000) {
        // Only update every 5 seconds
        lastUpdate = now;
        updateUserActivity();
      }
    };

    events.forEach((event) => {
      window.addEventListener(event, throttledHandleActivity, {
        passive: true,
      });
    });

    // Initial activity update
    updateUserActivity();

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, throttledHandleActivity);
      });
    };
  }, [user, updateUserActivity]);

  // Create a logout function that optionally redirects
  const logout = useCallback(
    async (showNotification = true, redirectToLogin = true) => {
      try {
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        if (refreshToken) {
          try {
            await authApi.revokeToken(refreshToken);
          } catch (error) {
            console.error('Error revoking token:', error);
          }
        }
      } finally {
        // Clear storage
        clearAuthState(false);

        // Dispatch event to other tabs
        const event = new CustomEvent(AUTH_SYNC_EVENT, {
          detail: { type: 'logout' },
        });
        window.dispatchEvent(event);

        // Show notification
        if (showNotification) {
          enqueueSnackbar('Successfully logged out', { variant: 'success' });
        }

        // Redirect if requested
        if (redirectToLogin) {
          console.log('Redirecting to login');
          router.push('/login');
        }
      }
    },
    [router, enqueueSnackbar, clearAuthState]
  );

  // Check token expiration and user activity
  const checkSessionStatus = useCallback(() => {
    if (!user) return;

    const tokenExpiry = localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);
    const lastActivity = localStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY);

    if (!tokenExpiry || !lastActivity) {
      console.warn('Missing session data, logging out');
      logout(false, true);
      return;
    }

    const currentTime = Date.now();
    const expiryTime = parseInt(tokenExpiry);
    const lastActivityTime = parseInt(lastActivity);
    const timeUntilExpiry = expiryTime - currentTime;
    const inactiveTime = currentTime - lastActivityTime;

    // Check for inactivity timeout
    if (inactiveTime >= INACTIVITY_TIMEOUT) {
      console.log(`User inactive for ${inactiveTime}ms, logging out`);
      logout(true, true);
      return;
    }

    // Refresh token if it's about to expire
    if (timeUntilExpiry <= TOKEN_REFRESH_BUFFER) {
      refreshUserToken().catch((error) => {
        console.error('Failed to refresh token during session check:', error);
        logout(true, true);
      });
    }
  }, [user, logout]);

  // Set up periodic session checks
  useEffect(() => {
    if (!user) return;

    // Clear any existing interval
    if (activityCheckIntervalRef.current) {
      clearInterval(activityCheckIntervalRef.current);
    }

    // Set up new interval
    activityCheckIntervalRef.current = setInterval(
      checkSessionStatus,
      ACTIVITY_CHECK_INTERVAL
    );

    return () => {
      if (activityCheckIntervalRef.current) {
        clearInterval(activityCheckIntervalRef.current);
        activityCheckIntervalRef.current = null;
      }
    };
  }, [user, checkSessionStatus]);

  // Modified refreshUserToken to update timestamps
  const refreshUserToken =
    useCallback(async (): Promise<TokenResponse | null> => {
      // Prevent multiple refresh attempts
      if (isRefreshingToken.current) {
        console.log('Token refresh already in progress, skipping');
        return null;
      }

      isRefreshingToken.current = true;

      try {
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await authApi.refreshToken(refreshToken);

        // Update tokens and timestamps
        localStorage.setItem(STORAGE_KEYS.TOKEN, response.accessToken);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
        localStorage.setItem(
          STORAGE_KEYS.TOKEN_EXPIRY,
          (Date.now() + ACCESS_TOKEN_EXPIRY).toString()
        );

        // Update activity timestamp when refreshing token
        updateUserActivity();

        // Update axios headers
        axios.defaults.headers.common.Authorization = `Bearer ${response.accessToken}`;

        // Set cookie for SSR
        setCookie('auth-token', response.accessToken, {
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: '/',
          sameSite: 'strict',
        });

        return response;
      } catch (error) {
        console.error('Token refresh failed:', error);
        await logout(false, true);
        return null;
      } finally {
        isRefreshingToken.current = false;
      }
    }, [logout, updateUserActivity]);

  // Refresh token periodically
  useEffect(() => {
    if (!user) return;

    // Clear any existing interval
    if (tokenRefreshIntervalRef.current) {
      clearInterval(tokenRefreshIntervalRef.current);
    }

    // Set up new interval
    tokenRefreshIntervalRef.current = setInterval(async () => {
      try {
        await refreshUserToken();
      } catch (error) {
        console.error('Failed to refresh token:', error);
      }
    }, TOKEN_REFRESH_INTERVAL);

    return () => {
      if (tokenRefreshIntervalRef.current) {
        clearInterval(tokenRefreshIntervalRef.current);
        tokenRefreshIntervalRef.current = null;
      }
    };
  }, [user, refreshUserToken]);

  // Initial authentication check on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check for stored auth data on mount
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        const userData = localStorage.getItem(STORAGE_KEYS.USER);

        if (token && refreshToken && userData) {
          // Check if token is expired and needs refresh
          const tokenExpiry = localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);
          const isTokenExpired =
            tokenExpiry && new Date().getTime() > parseInt(tokenExpiry);

          if (isTokenExpired) {
            try {
              await refreshUserToken();
            } catch (error) {
              console.error('Failed to refresh expired token on init:', error);
              clearAuthState(false);
            }
          } else {
            setUser(JSON.parse(userData));

            // Set auth cookie for server-side routing
            setCookie('auth-token', token, {
              maxAge: 60 * 60 * 24 * 7, // 7 days
              path: '/',
              sameSite: 'strict',
            });

            // Make sure axios has the token
            axios.defaults.headers.common.Authorization = `Bearer ${token}`;

            // Update activity timestamp
            updateUserActivity();
          }
        } else {
          console.log('No auth data found, clearing state without redirect');
          clearAuthState(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        clearAuthState(false);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [refreshUserToken, clearAuthState, updateUserActivity]);

  // Modified setAuthState to include activity timestamp and notify other tabs
  const setAuthState = (authResponse: LoginResponseDTO) => {
    const { token, refreshToken, user: userData, tokenType } = authResponse;

    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    localStorage.setItem(STORAGE_KEYS.TOKEN_TYPE, tokenType);
    localStorage.setItem(
      STORAGE_KEYS.TOKEN_EXPIRY,
      (Date.now() + ACCESS_TOKEN_EXPIRY).toString()
    );
    updateUserActivity();

    // Set axios default authorization header
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;

    // Set cookie for middleware
    setCookie('auth-token', token, {
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
      sameSite: 'strict',
    });

    setUser(userData);

    // Notify other tabs about the login
    const event = new CustomEvent(AUTH_SYNC_EVENT, {
      detail: {
        type: 'login',
        payload: { user: userData },
      },
    });
    window.dispatchEvent(event);
  };

  const login = async (data: LoginDTO) => {
    try {
      const response = await authApi.login(data);

      // Set auth state with more verbose logging
      console.log('Login successful, setting authentication state');

      // Update tokens and user data
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
      localStorage.setItem(STORAGE_KEYS.TOKEN_TYPE, response.tokenType);
      localStorage.setItem(
        STORAGE_KEYS.TOKEN_EXPIRY,
        (Date.now() + ACCESS_TOKEN_EXPIRY).toString()
      );

      // Update activity timestamp
      updateUserActivity();

      // Set axios default authorization header
      axios.defaults.headers.common.Authorization = `Bearer ${response.token}`;

      // Set cookie for middleware
      setCookie('auth-token', response.token, {
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
        sameSite: 'strict',
      });

      // Finally, update the user state - this triggers the isAuthenticated value
      setUser(response.user);

      // Notify other tabs about the login
      const event = new CustomEvent(AUTH_SYNC_EVENT, {
        detail: {
          type: 'login',
          payload: { user: response.user },
        },
      });
      window.dispatchEvent(event);

      enqueueSnackbar('Successfully logged in', { variant: 'success' });
      console.log('Authentication state set successfully');
    } catch (error: any) {
      console.error('Login error:', error);
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
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      enqueueSnackbar('Profile updated successfully', { variant: 'success' });

      // Notify other tabs
      const event = new CustomEvent(AUTH_SYNC_EVENT, {
        detail: {
          type: 'update',
          payload: { user: updatedUser },
        },
      });
      window.dispatchEvent(event);

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
    confirmPassword: string
  ) => {
    try {
      await authApi.changePassword(
        currentPassword,
        newPassword,
        confirmPassword
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

  const value = useMemo(
    () => ({
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
    }),
    [
      user,
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
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
