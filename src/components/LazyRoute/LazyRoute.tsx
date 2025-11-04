import { Suspense } from 'react';
import { PageLoader } from '../PageLoader';

/**
 * Wrapper component for lazy-loaded routes with Suspense boundary
 * Shows PageLoader while the lazy component is being loaded
 */
export const LazyRoute = ({ children }: { children: React.ReactNode }) => (
	<Suspense fallback={<PageLoader />}>
		{children}
	</Suspense>
);
