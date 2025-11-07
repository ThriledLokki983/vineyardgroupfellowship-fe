/**
 * Dashboard Component Interfaces
 * Centralized type definitions for all dashboard-related components
 */

import type { ReactNode } from 'react';

// Dashboard State Types
export type DashboardState =
  | 'first-visit-seeker'
  | 'first-visit-supporter'
  | 'active-seeker'
  | 'active-supporter'
  | 'returning-seeker'
  | 'returning-supporter'
  | 'unknown';

// Icon Maps for Dashboard Components
export type DashboardEmptyIconMap =
  | 'EmptyMailboxIcon'
  | 'EmptyWritingIcon'
  | 'EmptyGroupIcon'
  | 'SearchIcon';

export type DashboardTitleIconMap =
  | 'OutboxIcon'
  | 'InboxIcon'
  | 'PeopleIcon'
  | 'ClockIcon'
  | 'SearchIcon'
  | 'DashboardIcon'
  | 'StatsIcon';

// Group Data Interface
export interface GroupData {
  id: string;
  name: string;
  description: string;
  location: string;
  location_type: 'in_person' | 'virtual' | 'hybrid';
  meeting_time: string;
  meeting_day?: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  meeting_frequency?: 'weekly' | 'biweekly' | 'monthly';
  is_open: boolean;
  current_member_count: number;
  member_limit: number;
  available_spots: number;
  photo_url: string | null;
  my_role: 'leader' | 'co_leader' | 'member';
  created_by_me: boolean;
  joined_at: string;
  membership_status: 'pending' | 'active' | 'inactive' | 'removed' | 'leader' | 'co_leader' | null;
  focus_areas?: string[];
  visibility?: 'public' | 'community' | 'private';
}

// Dashboard Card Component Props
export interface DashboardCardProps {
  titleIconName?: DashboardTitleIconMap;
  emptyIconName?: DashboardEmptyIconMap;
  title: string;
  emptyMessage: string;
  isEmpty: boolean;
  showActionButton?: boolean;
  actionButtonText?: string;
  isLoading?: boolean;
  onActionClick?: () => void;
  groupData?: GroupData | null;
  isSecondaryBtn?: boolean;
  children?: ReactNode;
}

// Group Summary Card Props
export interface GroupSummaryCardProps {
  groupData: {
    id: string;
    name: string;
    description?: string;
    location?: string;
    location_type?: 'in_person' | 'virtual' | 'hybrid';
    meeting_time?: string;
    is_open?: boolean;
    current_member_count?: number;
    member_limit?: number;
    status?: string;
    membership_status?: string | null;
    member_count?: number;
    max_members?: number;
    meeting_frequency?: string;
  };
  showStatus?: boolean;
}

// Pending Request Card Props
export interface PendingRequestCardProps {
  request: {
    id: string;
    user_id: string;
    display_name: string;
    first_name?: string;
    last_name?: string;
    email: string;
    phone_number?: string;
    photo_url?: string | null;
    message?: string;
    joined_at: string;
    bio?: string;
    profile_visibility?: string;
  };
  groupId: string;
  groupName: string;
}

// Dashboard Page Props
export interface GroupMemberDashboardProps {
  dashboardState: DashboardState;
}

export interface GroupLeaderDashboardProps {
  dashboardState: DashboardState;
}
