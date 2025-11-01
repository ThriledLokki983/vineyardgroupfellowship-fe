// PROTECTED PATHS
export const PATH_HOME = '/';
export const PATH_DASHBOARD = '/dashboard';
export const PATH_PROFILE = '/profile';
export const PATH_SETTINGS = '/settings';
export const PATH_FEATURES = '/features'; // Development only


// PUBLIC PATHS
export const PATH_LOGIN = '/login';
export const PATH_REGISTER = '/register';
export const PATH_FORGOT_PASSWORD = '/forgot-password';
export const PATH_RESET_PASSWORD = '/reset-password';
export const PATH_ACCOUNT_CREATED = '/account-created';
export const PATH_EMAIL_VERIFIED = '/auth/verified';
export const PATH_EMAIL_VERIFY_ERROR = '/auth/verify-error';


// Dashboard
export const PATH_GROUP_LEADER_BACKGROUND = '/dashboard/group-leader/background';
export const PATH_GROUP_DETAILS = '/dashboard/groups/:id';
export const PATH_EDIT_GROUP = '/dashboard/groups/:id/edit';

// Helper function to generate group details path
export const getGroupDetailsPath = (groupId: string) => `/dashboard/groups/${groupId}`;

// Helper function to generate edit group path
export const getEditGroupPath = (groupId: string) => `/dashboard/groups/${groupId}/edit`;

// OPEN ROUTES
export const PATH_PRIVACY_POLICY = '/privacy-policy';
export const PATH_TERMS_OF_USE = '/terms-of-use';
export const PATH_VERIFY_EMAIL = '/auth/verify-email/*';

export const PUBLIC_ROUTES: readonly string[] = [
	PATH_HOME,
	PATH_LOGIN,
	PATH_REGISTER,
	PATH_FORGOT_PASSWORD,
	PATH_RESET_PASSWORD,
	PATH_VERIFY_EMAIL,
	PATH_EMAIL_VERIFIED,
	PATH_EMAIL_VERIFY_ERROR,
	PATH_ACCOUNT_CREATED,
	PATH_PRIVACY_POLICY,
	PATH_TERMS_OF_USE,
];