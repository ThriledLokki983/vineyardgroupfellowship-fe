/**
 * Sentry Monitoring Configuration
 *
 * Centralized error monitoring and performance tracking for production.
 * Integrates with Sentry for real-time error alerts, session replay, and performance metrics.
 */

import * as Sentry from '@sentry/react';

/**
 * Initialize Sentry monitoring
 * Should be called as early as possible in the application lifecycle
 */
export function initMonitoring(): void {
  // Only initialize in production
  if (import.meta.env.DEV) {
    console.log('[Monitoring] Skipping Sentry initialization in development mode');
    return;
  }

  const sentryDsn = import.meta.env.VITE_SENTRY_DSN;

  if (!sentryDsn) {
    console.warn('[Monitoring] VITE_SENTRY_DSN not found - error monitoring disabled');
    return;
  }

  Sentry.init({
    dsn: sentryDsn,

    // Application metadata
    environment: import.meta.env.MODE,
    release: import.meta.env.VITE_APP_VERSION || 'unknown',

    // Performance Monitoring
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0, // 10% in production, 100% in staging

    // Session Replay for error debugging
    replaysSessionSampleRate: 0.1, // 10% of sessions
    replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors

    integrations: [
      // Browser tracing for performance monitoring
      Sentry.browserTracingIntegration(),

      // Session Replay for visual debugging
      Sentry.replayIntegration({
        maskAllText: true, // Privacy: mask all text content
        blockAllMedia: true, // Privacy: block all media
        maskAllInputs: true, // Privacy: mask form inputs
      }),

      // Feedback integration for user-reported issues
      Sentry.feedbackIntegration({
        colorScheme: 'light',
        showBranding: false,
      }),
    ],

    // Error filtering
    ignoreErrors: [
      // Browser extensions
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',

      // Network errors (handled by our error logger)
      'NetworkError',
      'Failed to fetch',
      'Load failed',

      // Cancelled requests
      'AbortError',
      'The operation was aborted',
    ],

    // Privacy: scrub sensitive data
    beforeSend(event) {
      // Remove sensitive query parameters
      if (event.request?.url) {
        const url = new URL(event.request.url);
        ['token', 'access', 'refresh', 'password', 'secret'].forEach(param => {
          if (url.searchParams.has(param)) {
            url.searchParams.set(param, '[REDACTED]');
          }
        });
        event.request.url = url.toString();
      }

      // Remove authorization headers
      if (event.request?.headers) {
        delete event.request.headers['Authorization'];
        delete event.request.headers['Cookie'];
      }

      return event;
    },

    // Add user context (non-PII)
    beforeBreadcrumb(breadcrumb) {
      // Redact sensitive data from breadcrumbs
      if (breadcrumb.category === 'console' && breadcrumb.message) {
        // Don't log passwords, tokens, etc.
        if (breadcrumb.message.match(/password|token|secret|key|auth/i)) {
          return null;
        }
      }
      return breadcrumb;
    },
  });

  console.log('[Monitoring] Sentry initialized successfully');
}

/**
 * Set user context for error tracking
 * Call this after successful authentication
 */
export function setUserContext(user: {
  id: string;
  email?: string;
  username?: string;
}): void {
  if (import.meta.env.DEV) return;

  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.username,
  });
}

/**
 * Clear user context
 * Call this after logout
 */
export function clearUserContext(): void {
  if (import.meta.env.DEV) return;

  Sentry.setUser(null);
}

/**
 * Add custom context to errors
 */
export function addBreadcrumb(message: string, category: string, level: 'info' | 'warning' | 'error' = 'info'): void {
  if (import.meta.env.DEV) return;

  Sentry.addBreadcrumb({
    message,
    category,
    level,
    timestamp: Date.now() / 1000,
  });
}

/**
 * Manually capture an exception
 */
export function captureException(error: Error, context?: Record<string, unknown>): void {
  if (import.meta.env.DEV) {
    console.error('[Monitoring] Error captured:', error, context);
    return;
  }

  Sentry.captureException(error, {
    extra: context,
  });
}

/**
 * Capture a message (non-error event)
 */
export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info'): void {
  if (import.meta.env.DEV) {
    console.log(`[Monitoring] ${level.toUpperCase()}:`, message);
    return;
  }

  Sentry.captureMessage(message, level);
}
