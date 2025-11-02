/**
 * Common UI Component Types
 * Types for reusable UI components
 */

// Icon Component
export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
  size?: number;
}

// Loading State
export interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

// Page Transition
export interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

// Welcome Screen
export interface WelcomeScreenProps {
  isLoading?: boolean;
}

// Profile Dropdown
export interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    first_name?: string;
    last_name?: string;
    email?: string;
    photo_url?: string;
  };
}

// Protected Routes
export interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export interface LocationState {
  from?: {
    pathname: string;
  };
}

export interface SupporterRouteProps {
  children: React.ReactNode;
  fallbackPath?: string;
}

export interface SeekerRouteProps {
  children: React.ReactNode;
  fallbackPath?: string;
}

export interface PurposeRouteProps {
  children: React.ReactNode;
  requiredPurpose: 'group_member' | 'group_leader' | 'seeking_recovery' | 'providing_support';
  fallbackPath?: string;
}

export interface ConditionalComponentProps {
  showFor: 'group_member' | 'group_leader' | 'seeking_recovery' | 'providing_support' | 'both';
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

// Select Component
export interface CustomSelectProps<T extends object> {
  label?: string;
  placeholder?: string;
  items: T[];
  selectedKey?: React.Key;
  onSelectionChange?: (key: React.Key) => void;
  isDisabled?: boolean;
  isRequired?: boolean;
  errorMessage?: string;
  description?: string;
}
