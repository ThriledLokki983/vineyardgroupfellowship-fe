// Administration Pages
import SettingsPage from "./Settings/Settings/SettingsPage";
import ProfilePage from "./Profile/ProfilePage";
import { SupporterBackground } from "./Profile";

// HomePage & Dashboard
import Home from "./Home/Home";
// import Dashboard from "./Dashboard/Dashboard/DashboardPage";

// Features Page (Development only)
import { Features } from "./Features";

// Resource Pages
import TermsOfUsePage from "./Resources/TermsOfUsePage";
import PrivacyPolicyPage from "./Resources/PrivacyPolicyPage";

// Auth &. Registration imports
import {
	LoginPage,
	VerifyEmailPage,
	EmailVerifyErrorPage,
	RegistrationPage,
	ForgotPasswordPage,
	AccountCreationSuccessPage,
	EmailVerificationCompleteHandler
} from './Auth';

export {
	Home,
	// Dashboard,

	// Authentication & Registration Pages
	LoginPage,
	VerifyEmailPage,
	EmailVerifyErrorPage,
	RegistrationPage,
	ForgotPasswordPage,
	AccountCreationSuccessPage,
	EmailVerificationCompleteHandler,

	// Onboarding Pages
	// OnboardingRouter,

	// Resource Pages
	PrivacyPolicyPage,
	TermsOfUsePage,

	// Profile Pages
	ProfilePage,
	SettingsPage,
	SupporterBackground,

	// Development Pages
	Features,
};