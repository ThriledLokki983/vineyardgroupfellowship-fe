export interface RegistrationData {
  username: string
  email: string
  password: string
  password_confirm: string
  first_name?: string  // Optional since not collected in form
  last_name?: string   // Optional since not collected in form
  user_purpose: string  // Backend field name
  terms_accepted: boolean
  privacy_policy_accepted: boolean
  terms_of_service_accepted: boolean
}

export interface RegistrationFormData {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export interface LoginData {
  email_or_username: string;
  password: string;
  remember_me?: boolean;
  device_name: string;
}

export interface ForgotPasswordData {
  email: string
}

export interface ResetPasswordData {
  token: string
  password: string
  confirmPassword: string
}

// Supporter Status Info - NEW SECTION
export interface SupporterNextStep {
  step: string;
  title: string;
  description: string;
  url: string;
  priority: 'high' | 'medium' | 'low';
}

// Profile Completeness Info
export interface ProfileCompleteness {
  score: number;
  max_score: number;
  completed_fields: string[];
  missing_fields: string[];
  suggestions: string[];
}

// Privacy Summary Info
export interface PrivacySummary {
  visibility_level: 'public' | 'private' | 'friends';
  allows_messages: boolean;
  notifications_enabled: boolean;
  shares_sobriety_date: boolean;
}

export interface AccountStatus {
  email_verified: boolean;
  profile_complete: boolean;
  onboarding_complete: boolean;
  last_updated: string;
  current_onboarding_step?: string;
}

interface Group {
  id: string;
  name: string;
  description: string;
  location: string;
  location_type: 'in_person' | 'virtual' | 'hybrid';
  meeting_time: string;
  is_open: boolean;
  current_member_count: number;
  member_limit: number;
  available_spots: number;
  photo_url: string | null;
  my_role: 'leader' | 'co_leader' | 'member';
  created_by_me: boolean;
  joined_at: string;
  membership_status: 'pending' | 'active' | 'inactive' | 'removed';
}

// Main User Profile Interface - matches /profiles/me/ response
export interface User {
  id: string; // UUID from backend
  email: string;
  username: string;
  date_joined: string;
  email_verified: boolean;

  // User purpose - determines app features and permissions
  user_purpose?: 'group_member' | 'group_leader';
  can_lead_groups?: boolean; // Legacy field
  display_name_or_email?: string;

  // Leadership info (new structure from backend)
  leadership_info?: {
    can_lead_group: boolean;
    group?: Group | null
  };

  // Profile fields
  display_name?: string;
  bio?: string;
  location?: string;
  timezone?: string;
  recovery_stage?: string;
  sobriety_date?: string | null;

  // Profile photo fields
  photo_url?: string | null;
  photo_thumbnail_url?: string | null;
  photo_visibility?: 'public' | 'private' | 'community';
  can_upload_photo?: boolean;

  // Privacy settings
  profile_visibility?: 'public' | 'private' | 'friends';
  show_sobriety_date?: boolean;
  allow_direct_messages?: boolean;

  // Notification preferences
  email_notifications?: boolean;
  community_notifications?: boolean;
  emergency_notifications?: boolean;

  // Onboarding status (new structure from backend)
  onboarding?: {
    completed: boolean;
    current_step: string;
    progress_percentage: number;
  };

  // Legacy onboarding fields - kept for backward compatibility
  onboarded?: boolean;
  onboarding_completed_at?: string | null;
  onboarding_step?: string | null;

  // Timestamps
  created_at?: string;
  updated_at?: string;

  // Computed fields from backend
  profile_completeness?: ProfileCompleteness;
  privacy_summary?: PrivacySummary;
  account_status?: AccountStatus;

  // Legacy fields for backward compatibility (if needed)
  first_name?: string;
  last_name?: string;
  is_premium?: boolean;

  // Supporter-specific info (if user is providing support)
  supporter_info?: {
    background_required?: boolean;
    background_completed?: boolean;
    background_approved?: boolean;
    can_lead_groups?: boolean;
    can_provide_support?: boolean;
    available_for_one_on_one?: boolean;
    available_for_group_leadership?: boolean;
    has_professional_credentials?: boolean;
    completed_training?: boolean;
    max_mentees?: number;
    specializations?: string[];
    supporter_status?: string;
    next_required_step?: string;
    next_steps?: string[];
  };
}

export interface AuthResponse {
	user: User
	token: string
	refreshToken?: string
}

export interface RegistrationResponse {
	message: string
	user: {
		id: string
		email: string
		user_purpose: string
		is_verified: boolean
		requires_onboarding: boolean
	}
	tokens: {
		access: string
		refresh: string
	}
	onboarding: {
		next_step: string
		total_steps: number
		personalized_flow: boolean
		user_type: string
	}
}