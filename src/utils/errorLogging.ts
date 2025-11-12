/**
 * Error Logging Utility
 *
 * Centralized error logging for the Vineyard Group Fellowship application.
 * Logs errors to console in development and sends to Sentry in production.
 */

import { captureException, addBreadcrumb } from './monitoring';

export interface ErrorContext {
  componentStack?: string;
  userAction?: string;
  route?: string;
  timestamp: string;
  userAgent: string;
  userId?: string;
  environment: 'development' | 'production';
}

export interface ErrorLog {
  error: Error;
  context: ErrorContext;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

class ErrorLoggingService {
  private errorQueue: ErrorLog[] = [];
  private maxQueueSize = 100;

  /**
   * Log an error with context
   */
  logError(
    error: Error,
    severity: ErrorLog['severity'] = 'medium',
    additionalContext?: Partial<ErrorContext>
  ): void {
    const context: ErrorContext = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      route: window.location.pathname,
      environment: import.meta.env.DEV ? 'development' : 'production',
      ...additionalContext,
    };

    const errorLog: ErrorLog = {
      error,
      context,
      severity,
    };

    // Add breadcrumb to Sentry for error trail
    addBreadcrumb(
      `${severity.toUpperCase()}: ${error.message}`,
      'error',
      severity === 'critical' || severity === 'high' ? 'error' : 'warning'
    );

    // Add to queue
    this.errorQueue.push(errorLog);
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift(); // Remove oldest error
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      this.logToConsole(errorLog);
    }

    // Send to monitoring service in production
    if (import.meta.env.PROD) {
      this.sendToMonitoringService(errorLog);
    }
  }

  /**
   * Log to browser console with formatting
   */
  private logToConsole(errorLog: ErrorLog): void {
    const { error, context, severity } = errorLog;

    const severityColors = {
      low: '#3A4F41',
      medium: '#F4C77B',
      high: '#C25A5A',
      critical: '#8B0000',
    };

    console.group(
      `%c[${severity.toUpperCase()}] Error Logged`,
      `color: ${severityColors[severity]}; font-weight: bold;`
    );
    console.error('Error:', error);
    console.log('Context:', context);
    console.log('Stack Trace:', error.stack);
    if (context.componentStack) {
      console.log('Component Stack:', context.componentStack);
    }
    console.groupEnd();
  }

  /**
   * Send error to monitoring service (Sentry)
   */
  private sendToMonitoringService(errorLog: ErrorLog): void {
    // Send to Sentry in production
    if (!import.meta.env.DEV) {
      captureException(errorLog.error, {
        severity: errorLog.severity,
        context: errorLog.context,
      });
    }

    // Make critical errors visible in console
    if (errorLog.severity === 'critical') {
      console.error('CRITICAL ERROR:', errorLog);
    }

    // Also send to backend API for custom logging (optional)
    this.sendToBackend(errorLog).catch((err) => {
      // Silent fail - don't want logging errors to break the app
      if (import.meta.env.DEV) {
        console.warn('Failed to send error to backend:', err);
      }
    });
  }

  /**
   * Send error to backend API
   */
  private async sendToBackend(errorLog: ErrorLog): Promise<void> {
    try {
      // Only send in production to avoid cluttering dev logs
      if (import.meta.env.DEV) return;

      const response = await fetch('/api/logs/frontend-errors/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: errorLog.error.message,
          stack: errorLog.error.stack,
          severity: errorLog.severity,
          context: errorLog.context,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      // Silently fail - don't want logging errors to crash the app
      console.warn('Error logging to backend failed:', error);
    }
  }

  /**
   * Get recent errors (for debugging or error reports)
   */
  getRecentErrors(limit: number = 10): ErrorLog[] {
    return this.errorQueue.slice(-limit);
  }

  /**
   * Clear error queue
   */
  clearErrors(): void {
    this.errorQueue = [];
  }

  /**
   * Get error statistics
   */
  getErrorStats(): {
    total: number;
    bySeverity: Record<ErrorLog['severity'], number>;
  } {
    const bySeverity = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    };

    this.errorQueue.forEach((log) => {
      bySeverity[log.severity]++;
    });

    return {
      total: this.errorQueue.length,
      bySeverity,
    };
  }
}

// Export singleton instance
export const errorLogger = new ErrorLoggingService();

/**
 * Helper function to log errors from anywhere in the app
 */
export function logError(
  error: Error,
  severity: ErrorLog['severity'] = 'medium',
  context?: Partial<ErrorContext>
): void {
  errorLogger.logError(error, severity, context);
}

/**
 * Helper function to log API errors
 */
export function logApiError(
  error: Error,
  endpoint: string,
  method: string = 'GET'
): void {
  errorLogger.logError(error, 'high', {
    userAction: `API ${method} ${endpoint}`,
  });
}

/**
 * Helper function to log component errors
 */
export function logComponentError(
  error: Error,
  componentName: string,
  componentStack?: string
): void {
  errorLogger.logError(error, 'medium', {
    userAction: `Component: ${componentName}`,
    componentStack,
  });
}
