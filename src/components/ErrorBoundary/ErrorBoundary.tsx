import React, { Component, type ReactNode } from 'react';
import { Button } from 'react-aria-components';
import Icon from '../Icon';
import { errorLogger, type ErrorLog } from '../../utils/errorLogging';
import styles from './ErrorBoundary.module.scss';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  errorId?: string; // Unique ID for tracking
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  severity?: ErrorLog['severity']; // Allow custom severity
  context?: string; // Context name for better logging (e.g., "Dashboard", "Groups")
  resetKeys?: unknown[]; // Keys that trigger reset when changed
  showResetButton?: boolean; // Show "Try Again" button (default: true)
  showReloadButton?: boolean; // Show "Reload Page" button (default: true)
}

/**
 * Error Boundary component that catches JavaScript errors anywhere in the child component tree
 * and displays a fallback UI instead of crashing the entire app.
 *
 * Follows the Vineyard Group Fellowship design system with healing-focused messaging.
 * Integrates with error logging service for monitoring and debugging.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorId: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const { severity = 'medium', context = 'App', onError } = this.props;

    // Log error with context
    errorLogger.logError(error, severity, {
      componentStack: errorInfo.componentStack ?? undefined,
      userAction: `Error in ${context}`,
    });

    // Update state with error info
    this.setState({
      error,
      errorInfo,
    });

    // Call optional error handler
    if (onError) {
      onError(error, errorInfo);
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    // Reset error state if resetKeys change
    if (
      this.state.hasError &&
      this.props.resetKeys &&
      prevProps.resetKeys &&
      this.props.resetKeys.some((key, index) => key !== prevProps.resetKeys?.[index])
    ) {
      this.handleRetry();
    }
  }

  handleRetry = () => {
    // Reset error state to retry rendering
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined
    });
  };

  handleReload = () => {
    // Reload the entire page as last resort
    window.location.reload();
  };

  render() {
    const { showResetButton = true, showReloadButton = true, context = 'this part of the app' } = this.props;

    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI with design system styling
      return (
        <div className={styles.errorBoundary} role="alert" aria-live="assertive">
          <div className={styles.container}>
            <div className={styles.iconContainer}>
              <Icon name="ExclamationTriangleIcon" className={styles.errorIcon} />
            </div>

            <div className={styles.content}>
              <h1 className={styles.title}>Something went wrong</h1>
              <p className={styles.message}>
                We're sorry, but something unexpected happened in {context}. Your journey is important to us,
                and we're here to help you get back on track.
              </p>

              {this.state.errorId && (
                <p className={styles.errorId}>
                  Error ID: <code>{this.state.errorId}</code>
                </p>
              )}

              {import.meta.env.DEV && this.state.error && (
                <details className={styles.errorDetails}>
                  <summary className={styles.errorSummary}>
                    Technical Details (Development)
                  </summary>
                  <div className={styles.errorText}>
                    <strong>Error:</strong> {this.state.error.message}
                  </div>
                  {this.state.errorInfo && (
                    <div className={styles.errorText}>
                      <strong>Component Stack:</strong>
                      <pre>{this.state.errorInfo.componentStack}</pre>
                    </div>
                  )}
                </details>
              )}
            </div>

            <div className={styles.actions}>
              {showResetButton && (
                <Button
                  className={styles.primaryButton}
                  onPress={this.handleRetry}
                >
                  Try Again
                </Button>
              )}

              {showReloadButton && (
                <Button
                  className={styles.secondaryButton}
                  onPress={this.handleReload}
                >
                  Reload Page
                </Button>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;