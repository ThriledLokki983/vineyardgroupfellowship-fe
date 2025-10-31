/**
 * Axios API Client with Auto Token Refresh
 * Automatically adds Authorization headers and CSRF tokens
 * Handles 401 errors with automatic token refresh
 */

import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import { API_BASE_URL } from '../configs/api-configs';


// Create axios instance
// Always send cookies
const apiClient = axios.create({
  baseURL: API_BASE_URL || 'https://api.vineyardgroupfellowship.org/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Store reference to auth context functions
let getAccessTokenFn: (() => string | null) | null = null;
let refreshAccessTokenFn: (() => Promise<string | null>) | null = null;
let setAccessTokenFn: ((token: string) => void) | null = null;

/**
 * Set auth functions from AuthContext
 * Call this in App.tsx after AuthProvider is mounted
 */
export const setAuthFunctions = (
  getAccessToken: () => string | null,
  refreshAccessToken: () => Promise<string | null>,
  setAccessToken: (token: string) => void
) => {
  getAccessTokenFn = getAccessToken;
  refreshAccessTokenFn = refreshAccessToken;
  setAccessTokenFn = setAccessToken;
};

// Request interceptor - add auth headers
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add CSRF token for state-changing requests
    if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase() || '')) {
      const csrfToken = Cookies.get('csrftoken');
      if (csrfToken && config.headers) {
        config.headers['X-CSRFToken'] = csrfToken;
      }
    }

    // Add access token if available
    const accessToken = getAccessTokenFn?.();
    if (accessToken && config.headers) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle token refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Another request is already refreshing, queue this one
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh token
        const newAccessToken = await refreshAccessTokenFn?.();

        if (newAccessToken) {
          // Update token in context
          setAccessTokenFn?.(newAccessToken);

          // Process queued requests
          processQueue(null, newAccessToken);

          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          }
          return apiClient(originalRequest);
        } else {
          // Refresh failed - redirect to login
          processQueue(new Error('Token refresh failed'), null);
          window.location.href = '/login';
          return Promise.reject(error);
        }
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
