/**
 * Card Component Types
 * Types for various card components
 */

import type { GroupMember } from '../group';

// Contact Card
export interface ContactCardProps {
  data: GroupMember;
  hasParentFocus?: boolean;
  showActions?: boolean;
  enableNavigation?: boolean;
}

// Profile Card
export interface UserProfile {
  id: string;
  display_name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  photo_url?: string;
  bio?: string;
  location?: string;
  recovery_approach?: string;
  faith_tradition?: string;
  joined_at?: string;
  sobriety_date?: string;
  profile_visibility?: 'public' | 'community' | 'private';
  friendship_status?: 'none' | 'pending' | 'friends';
  requestSentAt?: string | Date;
}

export interface ProfileCardProps {
  profile: UserProfile;
  onSendRequest?: () => void;
  onCancelRequest?: () => void;
  onAcceptRequest?: () => void;
  onRejectRequest?: () => void;
  onMessage?: () => void;
  isLoading?: boolean;
}

export interface ProfileActionsProps {
  profile: UserProfile;
  onSendRequest?: () => void;
  onCancelRequest?: () => void;
  onAcceptRequest?: () => void;
  onRejectRequest?: () => void;
  onMessage?: () => void;
  isLoading?: boolean;
}

// Group Member Card
export interface GroupMemberCardProps {
  member: GroupMember;
  onViewProfile?: (memberId: string) => void;
}

// Action Card (Dashboard)
export interface ActionProps {
  icon: string;
  title: string;
  description: string;
  actionText: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  isDisabled?: boolean;
}

export interface SupporterNextStep {
  id: string;
  title: string;
  description: string;
  action: string;
  completed: boolean;
  required: boolean;
}
