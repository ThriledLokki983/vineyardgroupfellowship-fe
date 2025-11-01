/**
 * Group Type Definitions
 * Based on backend API structure from FRONTEND_INTEGRATION.md
 */

export interface LeaderInfo {
  id: string;
  email: string;
  display_name: string;
}

export interface UserMembership {
  id: string;
  role: 'leader' | 'co_leader' | 'member';
  status: 'pending' | 'active' | 'inactive' | 'removed';
  joined_at: string;
}

export interface GroupMember {
  id: string;
  user_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  display_name: string;
  photo_url?: string | null;
  role: 'leader' | 'co_leader' | 'member';
  status: 'pending' | 'active' | 'inactive' | 'removed';
  joined_at: string;
  profile_visibility: 'public' | 'community' | 'private';
  phone_number?: string;
  bio?: string;
  updated_at: string;
  created_at: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  location: string;
  location_type: 'in_person' | 'virtual' | 'hybrid';
  member_limit: number;
  current_member_count: number;
  is_full: boolean;
  available_spots: number;
  is_open: boolean;
  is_active: boolean;
  can_accept_members: boolean;
  leader: string;
  leader_info: LeaderInfo;
  co_leaders: string[];
  co_leaders_info: LeaderInfo[];
  photo: string | null;
  photo_url: string | null;
  meeting_day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  meeting_time: string;
  meeting_frequency: 'weekly' | 'biweekly' | 'monthly';
  focus_areas: string[];
  visibility: 'public' | 'community' | 'private';
  membership_status?: 'pending' | 'active' | 'inactive' | 'removed' | 'leader' | 'co_leader' | null; // User's relationship with this group (list view)
  user_membership: UserMembership | null; // Detailed membership info (detail view)
  group_members?: GroupMember[];
  created_at: string;
  updated_at: string;
}

export interface GroupListItem {
  id: string;
  name: string;
  description: string;
  location: string;
  location_type: 'in_person' | 'virtual' | 'hybrid';
  member_limit: number;
  current_member_count: number;
  available_spots: number;
  is_open: boolean;
  is_active: boolean;
  leader_info: LeaderInfo;
  photo_url: string | null;
  meeting_day: string;
  meeting_time: string;
  meeting_frequency: string;
  focus_areas: string[];
  created_at: string;
  membership_status: 'pending' | 'active' | 'inactive' | 'removed' | 'leader' | 'co_leader' | null; // User's relationship with this group
  user_membership?: UserMembership; // Optional - only present in detail view
}

export interface CreateGroupData {
  name: string;
  description?: string;
  location?: string;
  location_type?: 'in_person' | 'virtual' | 'hybrid';
  member_limit?: number;
  is_open?: boolean;
  meeting_day?: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  meeting_time?: string;
  meeting_frequency?: 'weekly' | 'biweekly' | 'monthly';
  focus_areas?: string[];
  visibility?: 'public' | 'community' | 'private';
}

export interface JoinGroupData {
  message?: string;
}

export interface JoinGroupResponse {
  message: string;
  membership: UserMembership;
}

export interface PendingRequest extends GroupMember {
  // Additional fields specific to pending requests can go here
  message?: string; // Optional message from the user when requesting to join
}

export interface ApproveRequestResponse {
  message: string;
  membership: GroupMember;
}

export interface RejectRequestResponse {
  message: string;
}
