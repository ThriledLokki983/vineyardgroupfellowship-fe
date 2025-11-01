import { createBrowserRouter } from 'react-router-dom';
import * as Pages from '../pages';
import * as PATH from './paths.ts';
import * as Auth from '../components/Authentication';
// import { PageLoader } from '../components/PageLoader';

// Lazy load group pages for code splitting
// const GroupsListPage = lazy(() => import('../features/groups/pages').then(m => ({ default: m.GroupsListPage })));
// const CreateGroupPage = lazy(() => import('../features/groups/pages').then(m => ({ default: m.CreateGroupPage })));
// const GroupDetailPage = lazy(() => import('../features/groups/pages').then(m => ({ default: m.GroupDetailPage })));
// const GroupDashboardPage = lazy(() => import('../features/groups/pages').then(m => ({ default: m.GroupDashboardPage })));
// const GroupDiscussionsPage = lazy(() => import('../features/groups/pages').then(m => ({ default: m.GroupDiscussionsPage })));
// const TopicDetailPage = lazy(() => import('../features/groups/pages').then(m => ({ default: m.TopicDetailPage })));
// const GroupMembersPage = lazy(() => import('../features/groups/pages').then(m => ({ default: m.GroupMembersPage })));
// const GroupManagePage = lazy(() => import('../features/groups/pages').then(m => ({ default: m.GroupManagePage })));

export const appRoutes = createBrowserRouter([
	{
		path: PATH.PATH_HOME,
		element: <Pages.Home />
	},
	// Features page - only available in development
	...(import.meta.env.DEV ? [{
		path: PATH.PATH_FEATURES,
		element: (
			<Auth.ProtectedRoute>
				<Pages.Features />
			</Auth.ProtectedRoute>
		)
	}] : []),
	{
	path: PATH.PATH_REGISTER,
		element: (
			<Auth.PublicRoute>
				<Pages.RegistrationPage />
			</Auth.PublicRoute>
		),
	},
	{
		path: PATH.PATH_ACCOUNT_CREATED,
		element: (
			<Auth.PublicRoute>
				<Pages.AccountCreationSuccessPage />
			</Auth.PublicRoute>
		),
	},
	{
		path: PATH.PATH_LOGIN,
		element: (
			<Auth.PublicRoute>
				<Pages.LoginPage />
			</Auth.PublicRoute>
		),
	},
	{
		path: PATH.PATH_FORGOT_PASSWORD,
		element: (
			<Auth.PublicRoute>
				<Pages.ForgotPasswordPage />
			</Auth.PublicRoute>
		),
	},
	{
		path: PATH.PATH_DASHBOARD,
		element: (
			<Auth.ProtectedRoute>
				<Pages.Dashboard />
			</Auth.ProtectedRoute>
		),
	},
	{
		path: PATH.PATH_PROFILE,
		element: (
			<Auth.ProtectedRoute>
				<Pages.ProfilePage />
			</Auth.ProtectedRoute>
		),
	},
	{
		path: PATH.PATH_SETTINGS,
		element: (
			<Auth.ProtectedRoute>
				<Pages.SettingsPage />
			</Auth.ProtectedRoute>
		),
	},
	{
		path: PATH.PATH_PRIVACY_POLICY,
		element: <Pages.PrivacyPolicyPage />,
	},
	{
		path: PATH.PATH_TERMS_OF_USE,
		element: <Pages.TermsOfUsePage />,
	},
	{
		path: PATH.PATH_VERIFY_EMAIL,
		element: <Pages.VerifyEmailPage />,
	},
	{
		path: PATH.PATH_EMAIL_VERIFIED,
		element: (
			<Auth.PublicRoute>
				<Pages.EmailVerificationCompleteHandler />
			</Auth.PublicRoute>
		),
	},
	{
		path: PATH.PATH_EMAIL_VERIFY_ERROR,
		element: (
			<Auth.PublicRoute>
				<Pages.EmailVerifyErrorPage />
			</Auth.PublicRoute>
		),
	},
]);
