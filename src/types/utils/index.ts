/**
 * Utility Interfaces
 * Centralized type definitions for utility functions
 */

// Error Logging
export interface ErrorContext {
  componentStack?: string;
  errorBoundary?: string;
  userId?: string;
  userAgent?: string;
  url?: string;
  timestamp?: string;
  [key: string]: unknown;
}

export interface ErrorLog {
  message: string;
  stack?: string;
  context?: ErrorContext;
  level: 'error' | 'warning' | 'info';
  timestamp: string;
}

// Profile Data
export interface ProfileData {
  photo_url?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  display_name?: string | null;
  email?: string | null;
}

// Relative Time
export interface RelativeTimeResult {
  value: number;
  label: string;
}

// Breakpoints
export interface BreakpointValues {
  mobile: number;
  tablet: number;
  desktop: number;
  wide: number;
}

// Data with Timestamp
export interface DataWithUpdatedAt {
  updated_at?: string;
  [key: string]: unknown;
}

// Attendee Data
export interface AttendeeData {
  id: string;
  name: string;
  role?: string;
  [key: string]: unknown;
}

// Error Boundary
export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}
