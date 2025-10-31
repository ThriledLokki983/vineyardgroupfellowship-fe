/**
 * Authentication Context
 * Secure token storage following best practices:
 * - Access tokens: Memory only (refs) - prevent XSS attacks, short-lived
 * - Refresh tokens: httpOnly cookies (set by backend) - XSS safe + survives reload
 *
 * This is an attempt to provide adequate amount of security - Can be improved later as well IronClad:
 * - Access token never persisted (only in memory)
 * - Refresh token in httpOnly cookie (not accessible to JavaScript)
 * - Both tokens protected from XSS attacks
 * - Refresh token survives page reload (via cookie)
 *
 * Backend:
 * - Sets refresh_token as httpOnly cookie during login
 * - Reads refresh_token from cookie during refresh
 * - Clears cookie on logout
 */

import { useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../../configs/hooks-interfaces';
import { AuthContext } from './AuthContext';
import { api, setAccessTokenGetter } from '../../services/api';
import { REFRESH_TOKEN_URL, LOGOUT_USER_URL, USER_PROFILE_URL, LOGIN_USER_URL } from '../../configs/api-endpoints';
import { PUBLIC_ROUTES } from '../../configs/paths';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean, deviceName?: string) => Promise<void>;
  logout: () => Promise<void>;
  getAccessToken: () => string | null;
  setAccessToken: (token: string) => void;
  setUser: (user: User | null) => void;
  refreshAccessToken: () => Promise<string | null>;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const accessTokenRef = useRef<string | null>(null);
  const hasInitialized = useRef(false);

  // Refresh token in httpOnly cookie (managed by backend, not accessible here)
  const isAuthenticated = !!user;

  // Register access token getter with api.ts so it can add Authorization header
  useEffect(() => {
    setAccessTokenGetter(() => accessTokenRef.current);
  }, []);

  // Get current access token and
  // Set access token (used after login/refresh)
  const getAccessToken = () => accessTokenRef.current;
  const setAccessToken = (token: string) => {
    accessTokenRef.current = token;
  };

  // Refresh access token using refresh token from httpOnly cookie
  const refreshAccessToken = async (silentFail = false): Promise<string | null> => {
    try {
      const data = await api.post<{ access: string; user?: User; id?: string; email?: string }>(REFRESH_TOKEN_URL);

      // Update access token in memory and check if BE returns user object on refresh
      accessTokenRef.current = data.access;
      if (data.user) {
        setUser(data.user);
      } else if (data.id && data.email) {
        // Partial user data - fetch full profile
        try {
          const userProfile = await api.get<User>(USER_PROFILE_URL);
          setUser(userProfile);
        } catch (profileError) {
          if (!silentFail) {
            console.warn('We failed to get the user data:', profileError);
            await logout();
          }
          return null;
        }
      } else {
        try {
          const userProfile = await api.get<User>(USER_PROFILE_URL);
          setUser(userProfile);
        } catch (profileError) {
          if (!silentFail) {
            console.error('We failed to get the user data:', profileError);
            await logout();
          }
          return null;
        }
      }
      return data.access;
    } catch (error) {
      if (!silentFail) {
        console.error('Token refresh failed with error:', error);
        await logout();
      }
      return null;
    }
  };

  /**
   * Function to handle logging in users
   * @param email
   * @param password
   * @param rememberMe
   * @param deviceName
   */
  const login = async (
    email: string,
    password: string,
    rememberMe: boolean = false,
    deviceName: string = 'Web Browser'
  ) => {
    try {
      setIsLoading(true);

      const data = await api.post<{ access: string; user: User }>(LOGIN_USER_URL, {
        email_or_username: email,
        password,
        remember_me: rememberMe,
        device_name: deviceName,
      });

      // Store access token in memory only
      accessTokenRef.current = data.access;

      // Fetch complete user profile after login
      // Login endpoint may return basic user data, but we need the full profile
      try {
        const userProfile = await api.get<User>(USER_PROFILE_URL);
        setUser(userProfile);
      } catch (profileError) {
        // Fallback to basic user data from login response
        console.warn('Profile fetch error, using basic user data:', profileError);
        setUser(data.user);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Call logout endpoint - BE will clear the httpOnly cookie
      await api.post(LOGOUT_USER_URL);
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with local logout even if API fails
    } finally {
      // Clear access token from memory
      accessTokenRef.current = null;
      // Refresh token cookie is cleared by backend
      setUser(null);
    }
  };

  // Initialize auth state on mount
  useEffect(() => {
    // Prevent duplicate initialization in StrictMode
    if (hasInitialized.current) {
      return;
    }
    hasInitialized.current = true;

    const initAuth = async () => {
      try {
        // Skip refresh attempt on public pages (auth, legal, success pages) - No need to restore sessions here
        const currentPath = window.location.pathname;
        const isPublicPage = PUBLIC_ROUTES.some(route => {
          // Handle wildcard routes
          if (route.endsWith('/*')) {
            const basePath = route.slice(0, -2); // Remove /*
            return currentPath.startsWith(basePath);
          }
          // Exact match for non-wildcard routes
          return route === currentPath;
        });

        if (isPublicPage) {
          setUser(null);
          setIsLoading(false);
          return;
        }

        // Always attempt to refresh access token on mount (silent fail mode)
        // This will use the httpOnly cookie - access token AND user object on successful refresh
        const newToken = await refreshAccessToken(true);
        if (newToken) {
          // User data is already set by refreshAccessToken
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    getAccessToken,
    setAccessToken,
    setUser,
    refreshAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
