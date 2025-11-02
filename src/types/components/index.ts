/**
 * Component Props Interfaces
 * Centralized type definitions for all component props
 */

import type { GroupMember } from '../group';

// Re-export dashboard types
export * from './dashboard';

// Avatar Component
export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  profile: {
    photo_url?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    display_name?: string | null;
    email?: string | null;
  };
  size?: number | string;
}

// Contact Card Component
export interface ContactCardProps {
  data: GroupMember;
  hasParentFocus?: boolean;
  showActions?: boolean;
  enableNavigation?: boolean;
}

// Group Member Card Component
export interface GroupMemberCardProps {
  member: GroupMember;
  onViewProfile?: (memberId: string) => void;
}

// Header Component
export interface HeaderProps {
  variant?: 'default' | 'transparent' | 'minimal';
  hideLogin?: boolean;
  hideRegister?: boolean;
  logoOnly?: boolean;
}

// Welcome Screen Component
export interface WelcomeScreenProps {
  onComplete?: () => void;
  userName?: string;
}

// Protected Route Component
export interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}
