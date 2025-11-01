// Authentication and User Management
export const CSRF_URL = '/auth/csrf/';
export const REGISTER_USER_URL = '/auth/register/';
export const LOGIN_USER_URL = '/auth/login/';
export const TOKEN_EXCHANGE_URL = '/auth/exchange-token/';
export const USER_PROFILE_URL = '/profiles/me/';
export const UPLOAD_PHOTO_URL = '/profiles/me/photo/upload/';

// Authentication Actions
export const LOGOUT_USER_URL = '/auth/logout/';
export const RESET_PASSWORD_URL = '/auth/password/reset/';
export const CHANGE_PASSWORD_URL = '/auth/password/change/';
export const EMAIL_VERIFY_URL = '/auth/email/verify/';
export const RESEND_VERIFICATION_URL = '/auth/email/resend/';

// Token Management
export const REFRESH_TOKEN_URL = '/auth/token/refresh/';
export const VERIFY_TOKEN_URL = '/auth/token/verify/';

// Onboarding
export const COMPLETE_ONBOARDING_URL = '/onboarding/complete/';
export const ONBOARDING_STEP_URL = '/onboarding/step/';
export const ONBOARDING_STATUS_URL = '/onboarding/status/';
export const RECOVERY_APPROACH_URL = '/onboarding/recovery-approach/';

// Groups
export const GROUPS_URL = '/groups/';
export const GROUP_DETAIL_URL = (id: string) => `/groups/${id}/`;
export const GROUP_MEMBERS_URL = (id: string) => `/groups/${id}/members/`;
export const GROUP_JOIN_URL = (id: string) => `/groups/${id}/join/`;
export const GROUP_LEAVE_URL = (id: string) => `/groups/${id}/leave/`;
export const GROUP_UPLOAD_PHOTO_URL = (id: string) => `/groups/${id}/upload_photo/`;
export const GROUP_PENDING_REQUESTS_URL = (id: string) => `/groups/${id}/pending_requests/`;
export const GROUP_APPROVE_REQUEST_URL = (id: string, membershipId: string) => `/groups/${id}/approve-request/${membershipId}/`;
export const GROUP_REJECT_REQUEST_URL = (id: string, membershipId: string) => `/groups/${id}/reject-request/${membershipId}/`;
