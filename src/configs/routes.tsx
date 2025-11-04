import { createBrowserRouter } from 'react-router-dom';
import * as Pages from '../pages';
import * as PATH from './paths.ts';
import * as Auth from '../components/Authentication';
import { LazyRoute } from 'components';

export const appRoutes = createBrowserRouter([
	{
		path: PATH.PATH_HOME,
		element: <Pages.Home />
	},
	// Features page - only available in development
	...(import.meta.env.DEV ? [{
		path: PATH.PATH_FEATURES,
		element: (
			<LazyRoute>
				<Auth.ProtectedRoute>
					<Pages.Features />
				</Auth.ProtectedRoute>
			</LazyRoute>
		)
	}] : []),
	{
	path: PATH.PATH_REGISTER,
		element: (
			<LazyRoute>
				<Auth.PublicRoute>
					<Pages.RegistrationPage />
				</Auth.PublicRoute>
			</LazyRoute>
		),
	},
	{
		path: PATH.PATH_ACCOUNT_CREATED,
		element: (
			<LazyRoute>
				<Auth.PublicRoute>
					<Pages.AccountCreationSuccessPage />
				</Auth.PublicRoute>
			</LazyRoute>
		),
	},
	{
		path: PATH.PATH_LOGIN,
		element: (
			<LazyRoute>
				<Auth.PublicRoute>
					<Pages.LoginPage />
				</Auth.PublicRoute>
			</LazyRoute>
		),
	},
	{
		path: PATH.PATH_FORGOT_PASSWORD,
		element: (
			<LazyRoute>
				<Auth.PublicRoute>
					<Pages.ForgotPasswordPage />
				</Auth.PublicRoute>
			</LazyRoute>
		),
	},
	{
		path: PATH.PATH_DASHBOARD,
		element: (
			<LazyRoute>
				<Auth.ProtectedRoute>
					<Pages.Dashboard />
				</Auth.ProtectedRoute>
			</LazyRoute>
		),
	},
	{
		path: PATH.PATH_GROUP_DETAILS,
		element: (
			<LazyRoute>
				<Auth.ProtectedRoute>
					<Pages.GroupDetailsPage />
				</Auth.ProtectedRoute>
			</LazyRoute>
		),
	},
	{
		path: PATH.PATH_EDIT_GROUP,
		element: (
			<LazyRoute>
				<Auth.ProtectedRoute>
					<Pages.EditGroupPage />
				</Auth.ProtectedRoute>
			</LazyRoute>
		),
	},
	{
		path: PATH.PATH_PROFILE,
		element: (
			<LazyRoute>
				<Auth.ProtectedRoute>
					<Pages.ProfilePage />
				</Auth.ProtectedRoute>
			</LazyRoute>
		),
	},
	{
		path: PATH.PATH_SETTINGS,
		element: (
			<LazyRoute>
				<Auth.ProtectedRoute>
					<Pages.SettingsPage />
				</Auth.ProtectedRoute>
			</LazyRoute>
		),
	},
	{
		path: PATH.PATH_PRIVACY_POLICY,
		element: (
			<LazyRoute>
				<Pages.PrivacyPolicyPage />
			</LazyRoute>
		),
	},
	{
		path: PATH.PATH_TERMS_OF_USE,
		element: (
			<LazyRoute>
				<Pages.TermsOfUsePage />
			</LazyRoute>
		),
	},
	{
		path: PATH.PATH_VERIFY_EMAIL,
		element: (
			<LazyRoute>
				<Pages.VerifyEmailPage />
			</LazyRoute>
		),
	},
	{
		path: PATH.PATH_EMAIL_VERIFIED,
		element: (
			<LazyRoute>
				<Auth.PublicRoute>
					<Pages.EmailVerificationCompleteHandler />
				</Auth.PublicRoute>
			</LazyRoute>
		),
	},
	{
		path: PATH.PATH_EMAIL_VERIFY_ERROR,
		element: (
			<LazyRoute>
				<Auth.PublicRoute>
					<Pages.EmailVerifyErrorPage />
				</Auth.PublicRoute>
			</LazyRoute>
		),
	},
]);
