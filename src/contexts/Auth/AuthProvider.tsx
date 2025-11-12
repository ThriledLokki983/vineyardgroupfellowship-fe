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

import { useState, useEffect, useRef, useCallback } from 'react';
import type { ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import type { User } from '../../configs/hooks-interfaces';
import { AuthContext } from './AuthContext';
import { api, setAccessTokenGetter } from '../../services/api';
import { REFRESH_TOKEN_URL, LOGOUT_USER_URL, USER_PROFILE_URL, LOGIN_USER_URL } from '../../configs/api-endpoints';
import { PUBLIC_ROUTES } from '../../configs/paths';
import { errorLogger } from '../../utils/errorLogging';
import { setUserContext, clearUserContext } from '../../utils/monitoring';

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
  const refreshPromiseRef = useRef<Promise<string | null> | null>(null);
  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logoutRef = useRef<(() => Promise<void>) | null>(null);

  // Helper to set user and update Sentry context
  const setUserWithContext = useCallback((userData: User | null) => {
    setUser(userData);
    if (userData) {
      setUserContext({
        id: userData.id,
        email: userData.email,
        username: userData.username,
      });
    } else {
      clearUserContext();
    }
  }, []);

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

  // Forward ref for refreshAccessToken to break circular dependency
  const refreshAccessTokenRef = useRef<((silentFail?: boolean) => Promise<string | null>) | null>(null);

  // Schedule proactive token refresh before expiry
  const scheduleTokenRefresh = useCallback((token: string) => {
    try {
      // Clear any existing timeout
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = null;
      }

      // Decode JWT to get expiry time
      const decoded = jwtDecode<{ exp: number }>(token);
      const expiresAt = decoded.exp * 1000; // Convert to milliseconds
      const now = Date.now();
      const timeUntilExpiry = expiresAt - now;

      // Schedule refresh 1 minute before expiry (or immediately if < 1 min remaining)
      const refreshIn = Math.max(0, timeUntilExpiry - 60000);

      refreshTimeoutRef.current = setTimeout(() => {
        refreshAccessTokenRef.current?.(true); // Silent refresh via ref
      }, refreshIn);
    } catch (error) {
      errorLogger.logError(error as Error, 'medium', {
        userAction: 'scheduleTokenRefresh',
      });
    }
  }, []); // No dependencies - uses refs only

  // Refresh access token using refresh token from httpOnly cookie
  // Uses mutex to prevent concurrent refresh requests
  const refreshAccessToken = useCallback(async (silentFail = false): Promise<string | null> => {
    // Return existing promise if refresh already in progress
    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }

    // Create new refresh promise
    const refreshPromise = (async () => {
      try {
        const data = await api.post<{ access: string; user?: User; id?: string; email?: string }>(REFRESH_TOKEN_URL);

        // Update access token in memory and schedule next refresh
        accessTokenRef.current = data.access;
        scheduleTokenRefresh(data.access);

        // Handle user data
        if (data.user) {
          setUserWithContext(data.user);
        } else if (data.id && data.email) {
          // Partial user data - fetch full profile
          try {
            const userProfile = await api.get<User>(USER_PROFILE_URL);
            setUserWithContext(userProfile);
          } catch (profileError) {
            if (!silentFail) {
              errorLogger.logError(profileError as Error, 'high', {
                userAction: 'refreshAccessToken - fetch profile',
              });
              await logoutRef.current?.(); // Use ref to avoid circular dependency
            }
            return null;
          }
        } else {
          try {
            const userProfile = await api.get<User>(USER_PROFILE_URL);
            setUserWithContext(userProfile);
          } catch (profileError) {
            if (!silentFail) {
              errorLogger.logError(profileError as Error, 'high', {
                userAction: 'refreshAccessToken - fetch profile',
              });
              await logoutRef.current?.(); // Use ref to avoid circular dependency
            }
            return null;
          }
        }
        return data.access;
      } catch (error) {
        if (!silentFail) {
          errorLogger.logError(error as Error, 'critical', {
            userAction: 'refreshAccessToken',
          });
          await logoutRef.current?.(); // Use ref to avoid circular dependency
        }
        return null;
      } finally {
        // Clear the promise ref when done
        refreshPromiseRef.current = null;
      }
    })();

    // Store promise to prevent concurrent refreshes
    refreshPromiseRef.current = refreshPromise;
    return refreshPromise;
  }, [scheduleTokenRefresh, setUserWithContext]); // Include setUserWithContext

  // Store refreshAccessToken in ref for circular dependency resolution
  useEffect(() => {
    refreshAccessTokenRef.current = refreshAccessToken;
  }, [refreshAccessToken]);

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

      // Store access token in memory and schedule refresh
      accessTokenRef.current = data.access;
      scheduleTokenRefresh(data.access);

      // Fetch complete user profile after login
      // Login endpoint may return basic user data, but we need the full profile
      try {
        const userProfile = await api.get<User>(USER_PROFILE_URL);
        setUserWithContext(userProfile);
      } catch (profileError) {
        // Fallback to basic user data from login response
        errorLogger.logError(profileError as Error, 'medium', {
          userAction: 'login - fetch profile',
        });
        setUserWithContext(data.user);
      }
    } catch (error) {
      errorLogger.logError(error as Error, 'high', {
        userAction: 'login',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = useCallback(async () => {
    try {
      // Call logout endpoint - BE will clear the httpOnly cookie
      await api.post(LOGOUT_USER_URL);
    } catch (error) {
      errorLogger.logError(error as Error, 'low', {
        userAction: 'logout',
      });
      // Continue with local logout even if API fails
    } finally {
      // Clear all auth state
      accessTokenRef.current = null;
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = null;
      }
      refreshPromiseRef.current = null;
      setUserWithContext(null);
    }
  }, [setUserWithContext]);

  // Store logout in ref for circular dependency resolution
  useEffect(() => {
    logoutRef.current = logout;
  }, [logout]);

  // Initialize auth state on mount
  useEffect(() => {
    let isActive = true; // Prevents state updates after unmount (StrictMode compatibility)

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
          if (isActive) {
            setUserWithContext(null);
            setIsLoading(false);
          }
          return;
        }

        // Always attempt to refresh access token on mount (silent fail mode)
        // This will use the httpOnly cookie - access token AND user object on successful refresh
        const newToken = await refreshAccessToken(true);
        if (isActive) {
          if (newToken) {
            // User data is already set by refreshAccessToken
          } else {
            setUserWithContext(null);
          }
        }
      } catch (error) {
        errorLogger.logError(error as Error, 'medium', {
          userAction: 'auth initialization',
        });
        if (isActive) {
          setUserWithContext(null);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    initAuth();

    // Cleanup function for StrictMode
    return () => {
      isActive = false;
    };
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
