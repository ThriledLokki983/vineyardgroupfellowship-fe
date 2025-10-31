import { type ReactNode } from 'react';
import { ErrorBoundary } from '../ErrorBoundary';
import { type ErrorLog } from '../../utils/errorLogging';

/**
 * Global Error Boundary
 * Wraps the entire application to catch any unhandled errors
 */
interface GlobalErrorBoundaryProps {
  children: ReactNode;
}

export function GlobalErrorBoundary({ children }: GlobalErrorBoundaryProps) {
  return (
    <ErrorBoundary
      context="the application"
      severity="critical"
      showReloadButton={true}
      showResetButton={false}
    >
      {children}
    </ErrorBoundary>
  );
}

/**
 * Route Error Boundary
 * Wraps individual routes for graceful degradation
 */
interface RouteErrorBoundaryProps {
  children: ReactNode;
  routeName?: string;
}

export function RouteErrorBoundary({ children, routeName = 'this page' }: RouteErrorBoundaryProps) {
  return (
    <ErrorBoundary
      context={routeName}
      severity="high"
      showReloadButton={true}
      showResetButton={true}
    >
      {children}
    </ErrorBoundary>
  );
}

/**
 * Component Error Boundary
 * Wraps specific components that might fail independently
 */
interface ComponentErrorBoundaryProps {
  children: ReactNode;
  componentName?: string;
  severity?: ErrorLog['severity'];
  fallback?: ReactNode;
}

export function ComponentErrorBoundary({
  children,
  componentName = 'this component',
  severity = 'medium',
  fallback
}: ComponentErrorBoundaryProps) {
  return (
    <ErrorBoundary
      context={componentName}
      severity={severity}
      showReloadButton={false}
      showResetButton={true}
      fallback={fallback}
    >
      {children}
    </ErrorBoundary>
  );
}

/**
 * Form Error Boundary
 * Specialized for forms to preserve user input when possible
 */
interface FormErrorBoundaryProps {
  children: ReactNode;
  formName?: string;
}

export function FormErrorBoundary({ children, formName = 'this form' }: FormErrorBoundaryProps) {
  return (
    <ErrorBoundary
      context={formName}
      severity="high"
      showReloadButton={false}
      showResetButton={true}
    >
      {children}
    </ErrorBoundary>
  );
}

/**
 * Dashboard Error Boundary
 * For dashboard widgets that can fail independently
 */
interface DashboardWidgetErrorBoundaryProps {
  children: ReactNode;
  widgetName?: string;
  fallback?: ReactNode;
}

export function DashboardWidgetErrorBoundary({
  children,
  widgetName = 'this widget',
  fallback
}: DashboardWidgetErrorBoundaryProps) {
  // Custom minimal fallback for dashboard widgets
  const defaultFallback = (
    <div style={{
      padding: 'var(--size-4)',
      backgroundColor: 'var(--surface-elevated)',
      borderRadius: 'var(--radius-2)',
      textAlign: 'center',
      color: 'var(--text-secondary)',
    }}>
      <p style={{ fontSize: 'var(--font-size-0)', marginBottom: 'var(--size-2)' }}>
        Unable to load {widgetName}
      </p>
      <button
        onClick={() => window.location.reload()}
        style={{
          padding: 'var(--size-2) var(--size-3)',
          fontSize: 'var(--font-size-0)',
          backgroundColor: 'var(--brand-primary)',
          color: 'white',
          border: 'none',
          borderRadius: 'var(--radius-1)',
          cursor: 'pointer',
        }}
      >
        Reload
      </button>
    </div>
  );

  return (
    <ErrorBoundary
      context={widgetName}
      severity="low"
      fallback={fallback || defaultFallback}
    >
      {children}
    </ErrorBoundary>
  );
}

/**
 * Export all variants
 */
export {
  ErrorBoundary, // Re-export base component
};
