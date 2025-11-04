/**
 * App Initializer
 * Initializes CSRF token on app startup
 */

import type { ReactNode } from 'react';
import { useCsrfToken } from 'hooks/useCsrfToken';

interface AppInitializerProps {
  children: ReactNode;
}

export default function AppInitializer({ children }: AppInitializerProps) {
  // Initialize CSRF token
  useCsrfToken();

  return (
		<>
			{children}
		</>
	);
}
