// Lazy-loaded page components for code splitting
import { lazy } from 'react';

// HomePage - Keep eager as it's the landing page
import Home from "./Home/Home";

// Dashboard pages - Lazy load for better initial bundle
const Dashboard = lazy(() => import('./Dashboard/Dashboard/DashboardPage'));
const GroupDetailsPage = lazy(() => import('./Dashboard/GroupDetailsPage/GroupDetailsPage'));
const EditGroupPage = lazy(() => import('./Dashboard/EditGroupPage/EditGroupPage'));

// Features Page (Development only)
const Features = lazy(() => import('./Features').then(m => ({ default: m.Features })));

// Resource Pages
const TermsOfUsePage = lazy(() => import('./Resources/TermsOfUsePage'));
const PrivacyPolicyPage = lazy(() => import('./Resources/PrivacyPolicyPage'));

// Auth & Registration - Lazy load for better initial bundle
const LoginPage = lazy(() => import('./Auth').then(m => ({ default: m.LoginPage })));
const VerifyEmailPage = lazy(() => import('./Auth').then(m => ({ default: m.VerifyEmailPage })));
const EmailVerifyErrorPage = lazy(() => import('./Auth').then(m => ({ default: m.EmailVerifyErrorPage })));
const RegistrationPage = lazy(() => import('./Auth').then(m => ({ default: m.RegistrationPage })));
const ForgotPasswordPage = lazy(() => import('./Auth').then(m => ({ default: m.ForgotPasswordPage })));
const AccountCreationSuccessPage = lazy(() => import('./Auth').then(m => ({ default: m.AccountCreationSuccessPage })));
const EmailVerificationCompleteHandler = lazy(() => import('./Auth').then(m => ({ default: m.EmailVerificationCompleteHandler })));

// Profile Pages
const SettingsPage = lazy(() => import('./Settings/Settings/SettingsPage'));
const ProfilePage = lazy(() => import('./Profile/ProfilePage'));
const SupporterBackground = lazy(() => import('./Profile').then(m => ({ default: m.SupporterBackground })));

// Messaging Pages
const ConversationsListPage = lazy(() => import('./Messages').then(m => ({ default: m.ConversationsListPage })));
const ConversationDetailPage = lazy(() => import('./Messages').then(m => ({ default: m.ConversationDetailPage })));

export {
	Home,
	Dashboard,
	GroupDetailsPage,
	EditGroupPage,

	// Authentication & Registration Pages
	LoginPage,
	VerifyEmailPage,
	EmailVerifyErrorPage,
	RegistrationPage,
	ForgotPasswordPage,
	AccountCreationSuccessPage,
	EmailVerificationCompleteHandler,

	// Resource Pages
	PrivacyPolicyPage,
	TermsOfUsePage,

	// Profile Pages
	ProfilePage,
	SettingsPage,
	SupporterBackground,

	// Messaging Pages
	ConversationsListPage,
	ConversationDetailPage,

	// Development Pages
	Features,
};