/**
 * Global Error Handlers
 *
 * Catches unhandled errors and promise rejections at the window level.
 * Works in conjunction with React Error Boundaries to provide comprehensive error coverage.
 */

import { logError } from './errorLogging';

/**
 * Handle unhandled errors (window.onerror)
 */
function handleWindowError(
  message: string | Event,
  source?: string,
  lineno?: number,
  colno?: number,
  error?: Error
): boolean {
  // Create error object if not provided
  const errorObj = error || new Error(typeof message === 'string' ? message : 'Unknown error');

  // Log the error
  logError(errorObj, 'high', {
    userAction: 'Unhandled window error',
    componentStack: source ? `${source}:${lineno}:${colno}` : undefined,
  });

  // Return true to prevent default error handling
  return true;
}

/**
 * Handle unhandled promise rejections
 */
function handleUnhandledRejection(event: PromiseRejectionEvent): void {
  // Extract error from rejection
  const error = event.reason instanceof Error
    ? event.reason
    : new Error(String(event.reason));

  // Log the error
  logError(error, 'high', {
    userAction: 'Unhandled promise rejection',
  });

  // Prevent default handling
  event.preventDefault();
}

/**
 * Setup global error handlers
 * Call this once at app initialization
 */
export function setupGlobalErrorHandlers(): void {
  // Only setup in browser environment
  if (typeof window === 'undefined') return;

  // Handle unhandled errors
  window.onerror = handleWindowError;

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', handleUnhandledRejection);

  // Log that handlers are active
  if (import.meta.env.DEV) {
    console.log(
      '%c[Vineyard Group Fellowship] Global error handlers initialized',
      'color: #3A4F41; font-weight: bold;'
    );
  }
}

/**
 * Cleanup global error handlers
 * Call this if needed (e.g., in tests)
 */
export function cleanupGlobalErrorHandlers(): void {
  if (typeof window === 'undefined') return;

  window.onerror = null;
  window.removeEventListener('unhandledrejection', handleUnhandledRejection);
}
