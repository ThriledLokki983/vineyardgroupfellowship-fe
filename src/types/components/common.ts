/**
 * Common UI Component Types
 * Types for reusable UI components
 */

import type { User } from 'configs/hooks-interfaces';

// Icon Component
export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
  size?: number;
}

// Modal Component
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  isDismissable?: boolean;
  isKeyboardDismissDisabled?: boolean;
  showCloseButton?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';
  'aria-label'?: string;
  id?: string;
}

// Loading State
export interface LoadingStateProps {
  icon?: string;
  message?: string;
  variant?: 'default' | 'centered' | 'fullscreen';
  showLayout?: boolean;
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
  user: User;
  onClose: () => void;
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
  description?: string;
  errorMessage?: string | ((validation: unknown) => string);
  items?: Iterable<T>;
  children: React.ReactNode | ((item: T) => React.ReactNode);
  placeholder?: string;
  selectedKey?: React.Key;
  onSelectionChange?: (key: React.Key) => void;
  isDisabled?: boolean;
  isRequired?: boolean;
  isInvalid?: boolean;
  name?: string;
  className?: string;
}
