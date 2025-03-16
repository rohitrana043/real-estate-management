// src/lib/api/axios.ts
import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import authApi from './auth';
import { isMockEnabled } from './mockUtil';

const BASE_URL =
  `${process.env.NEXT_PUBLIC_API_URL}/api` || 'http://localhost:8080/api';

interface QueueItem {
  resolve: (value: unknown) => void;
  reject: (error: AxiosError) => void;
  config: InternalAxiosRequestConfig;
}

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null = null
) => {
  failedQueue.forEach((item) => {
    if (error) {
      item.reject(error);
    } else {
      if (token && item.config.headers) {
        item.config.headers.Authorization = `Bearer ${token}`;
      }
      item.resolve(axiosInstance(item.config));
    }
  });
  failedQueue = [];
};

// Log mock mode status on startup
if (isMockEnabled) {
  console.log(
    '[MOCK] Mock API mode is enabled. No real API calls will be made.'
  );
} else {
  console.log('[API] Using real API endpoints:', BASE_URL);
}

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // If mock mode is enabled, we can still let the request go through
    // (it will be intercepted by withMock before actually being sent)
    if (isMockEnabled) {
      // We can add this for debugging purposes
      config.headers['X-Mock-Mode'] = 'true';
    }

    // Get token from localStorage
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(
        'Setting Authorization header:',
        `Bearer ${token.substring(0, 10)}...`
      );
    }
    config.withCredentials = true;

    return config;
  },
  (error: AxiosError) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    // If we're in mock mode, don't do token refresh etc.
    if (isMockEnabled) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Avoid circular refresh for refresh token endpoint itself
    const isRefreshEndpoint = originalRequest.url?.includes(
      '/auth/token/refresh'
    );

    // If error is not 401 or request already retried, or it's the refresh endpoint, reject
    if (
      error.response?.status !== 401 ||
      (originalRequest as any)._retry ||
      isRefreshEndpoint
    ) {
      return Promise.reject(error);
    }

    if (typeof window === 'undefined') {
      return Promise.reject(error);
    }

    // If we're already refreshing, queue this request
    if (isRefreshing) {
      return new Promise<unknown>((resolve, reject) => {
        failedQueue.push({ resolve, reject, config: originalRequest });
      });
    }

    (originalRequest as any)._retry = true;
    isRefreshing = true;

    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      processQueue(
        new AxiosError('No refresh token available', 'ERR_NO_REFRESH_TOKEN')
      );
      isRefreshing = false;
      return Promise.reject(error);
    }

    try {
      // Direct axios call to avoid interceptor loop
      const response = await axios.post(`${BASE_URL}/auth/token/refresh`, {
        refreshToken,
      });

      const { accessToken, refreshToken: newRefreshToken } = response.data;

      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      localStorage.setItem(
        'tokenExpiry',
        (new Date().getTime() + 15 * 60 * 1000).toString()
      );

      // Update authorization header for the retried request
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      }

      // Process queued requests
      processQueue(null, accessToken);

      // Return the original request with the new token
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      // If refresh fails, clear localStorage and reject all queued requests
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('tokenExpiry');

      processQueue(refreshError as AxiosError);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;
