/**
 * CSRF Token Hook
 * Fetches CSRF token from backend on app initialization
 * Token is automatically stored in cookie by Django
 */

import { useEffect, useRef } from 'react';
import { API_BASE_URL } from '../configs/api-configs';
import { CSRF_URL } from '../configs/api-endpoints';

export const useCsrfToken = () => {
  // Prevent duplicate fetches in StrictMode
  const hasFetched = useRef(false);

  useEffect(() => {
    // Skip if already fetched (prevents StrictMode double-invoke)
    if (hasFetched.current) {
      return;
    }

    // Set flag IMMEDIATELY before async operation
    hasFetched.current = true;

    const fetchCsrfToken = async () => {
      try {
        // Fetch CSRF token - Django will set it in cookie
        await fetch(`${API_BASE_URL}${CSRF_URL}`, {
          method: 'GET',
          credentials: 'include', // Important for cookies
        });
      } catch (error) {
        console.error('Failed to fetch CSRF token:', error);
        // Reset flag on error so it can retry
        hasFetched.current = false;
      }
    };

    fetchCsrfToken();
  }, []);
};
