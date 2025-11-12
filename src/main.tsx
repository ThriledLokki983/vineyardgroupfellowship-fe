import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from 'react-router-dom';
import { appRoutes } from './configs/routes.tsx';
import { AuthProvider } from './contexts/Auth/AuthProvider.tsx'
import AppInitializer from './components/Layout/AppInitializer.tsx'
import { ToastProvider } from './components/Toast'
import { GlobalErrorBoundary } from './components/ErrorBoundary'
import { GlobalLoadingIndicator } from './components/GlobalLoadingIndicator'
import { ApiError } from './services/api'

// STYLES
import './styles/styles.scss';

// PWA Cleanup in development
import './utils/pwaCleanup';

// Global error handlers
import { setupGlobalErrorHandlers } from './utils/globalErrorHandlers';

// Sentry monitoring - Initialize FIRST
import { initMonitoring } from './utils/monitoring';
initMonitoring();

// Initialize global error handlers
setupGlobalErrorHandlers();

/**
 * QueryClient with intelligent retry strategy
 * - Client errors (4xx): No retry - these won't succeed on retry
 * - Network errors: Retry up to 2 times with exponential backoff
 * - Server errors (5xx): Retry up to 2 times with exponential backoff
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount, error) => {
        // Don't retry on client errors (4xx) - these are validation/auth errors
        if (error instanceof ApiError && error.status && error.status >= 400 && error.status < 500) {
          return false;
        }

        // Retry network errors and server errors (5xx) up to 2 times
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => {
        // Exponential backoff: 1s, 2s, 4s (capped at 30s)
        return Math.min(1000 * 2 ** attemptIndex, 30000);
      },
    },
    mutations: {
      // Mutations should NEVER auto-retry to prevent duplicate operations
      retry: false,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <GlobalLoadingIndicator />
        <AuthProvider>
          <AppInitializer>
            <ToastProvider />
            <RouterProvider router={appRoutes} />
          </AppInitializer>
        </AuthProvider>
        {/* TanStack Query Devtools - Development Only */}
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </GlobalErrorBoundary>
  </StrictMode>,
)
