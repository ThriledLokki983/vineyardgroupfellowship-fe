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

// Profile Card (Calendar Access Context)
export interface CalendarProfile {
  id: string;
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  display_name: string;
  photo_url: string;
  role: string;
  status: string;
  joined_at: string;
  // Calendar access properties
  is_accepted?: boolean;
  is_accepted_by_requester?: boolean;
  allowedAccess?: boolean;
  just_sent?: boolean;
  just_in?: boolean;
}

export interface ProfileCardProps {
  profile: CalendarProfile;
  revokeCalendarAccessRequest?: () => void;
  revokeExistingCalendarAccess?: () => void;
  resendRequest?: () => void;
}

export interface ProfileActionsProps {
  profile: CalendarProfile;
  revokeCalendarAccessRequest?: () => void;
  revokeExistingCalendarAccess?: () => void;
  resendRequest?: () => void;
  show?: boolean;
}

// User Profile Card (Friendship/Community Context)
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

export interface UserProfileCardProps {
  profile: UserProfile;
  onSendRequest?: () => void;
  onCancelRequest?: () => void;
  onAcceptRequest?: () => void;
  onRejectRequest?: () => void;
  onMessage?: () => void;
  isLoading?: boolean;
}

export interface UserProfileActionsProps {
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
  groupId?: string; // Optional: enables messaging feature
  groupName?: string; // Optional: context for messaging
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
