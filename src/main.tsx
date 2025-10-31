import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom';
import { appRoutes } from './configs/routes.tsx';
import { AuthProvider } from './contexts/Auth/AuthProvider.tsx'
import AppInitializer from './components/Layout/AppInitializer.tsx'
import { ToastProvider } from './components/Toast'
import { GlobalErrorBoundary } from './components/ErrorBoundary'

// STYLES
import './styles/styles.scss';

// PWA Cleanup in development
import './utils/pwaCleanup';

// Global error handlers
import { setupGlobalErrorHandlers } from './utils/globalErrorHandlers';

// Initialize global error handlers
setupGlobalErrorHandlers();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: false,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppInitializer>
            <ToastProvider />
            <RouterProvider router={appRoutes} />
          </AppInitializer>
        </AuthProvider>
      </QueryClientProvider>
    </GlobalErrorBoundary>
  </StrictMode>,
)
