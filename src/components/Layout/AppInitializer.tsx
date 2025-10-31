/**
 * App Initializer
 * Initializes CSRF token and connects AuthContext to axios client
 */

import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAuthContext } from 'contexts/Auth/useAuthContext';
import { setAuthFunctions } from 'src/lib/apiClient';
import { useCsrfToken } from 'hooks/useCsrfToken';

interface AppInitializerProps {
  children: ReactNode;
}

export default function AppInitializer({ children }: AppInitializerProps) {
  const { getAccessToken, refreshAccessToken, setAccessToken } = useAuthContext();

  // Initialize CSRF token
  useCsrfToken();

  // Connect auth functions to axios client
  useEffect(() => {
    setAuthFunctions(getAccessToken, refreshAccessToken, setAccessToken);
  }, [getAccessToken, refreshAccessToken, setAccessToken]);

  return (
		<>
			{children}
		</>
	);
}
