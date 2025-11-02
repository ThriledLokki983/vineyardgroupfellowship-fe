/**
 * Hook Interfaces
 * Centralized type definitions for custom hooks
 */

// Email Verification Hook
export interface VerifyEmailParams {
  uid: string;
  token: string;
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
  user?: {
    email: string;
    is_email_verified: boolean;
  };
}

// Pending Requests Hook
export interface PendingRequestWithGroup {
  groupId: string;
  groupName: string;
  request: {
    id: string;
    user_id: string;
    display_name: string;
    first_name?: string;
    last_name?: string;
    email: string;
    phone_number?: string;
    photo_url?: string;
    message?: string;
    joined_at: string;
    bio?: string;
    profile_visibility?: string;
  };
}
