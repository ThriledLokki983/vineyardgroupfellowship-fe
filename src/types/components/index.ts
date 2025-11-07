/**
 * Component Props Interfaces
 * Centralized type definitions for all component props
 */

// Re-export all component types
export * from './dashboard';
export * from './profile';
export * from './modals';
export * from './common';
export * from './forms';
export * from './cards';
export * from './tabs';

// Avatar Component - specific to Avatar only, not in cards
export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  profile?: {
    photo_url?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    display_name?: string | null;
    email?: string | null;
  };
  size?: number | string;
}

// Header Component - specific to Header only
export interface HeaderProps {
  hideLogin?: boolean;
  hideRegister?: boolean;
  logoOnly?: boolean;
}

