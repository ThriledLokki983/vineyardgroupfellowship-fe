// Component exports - centralized for easy importing

// ActionMenu
export { default as ActionMenu } from './ActionMenu';
export type { ActionMenuItem } from './ActionMenu';

// AlertBar
export { AlertBar } from './AlertBar';
// Avatar
export { default as Avatar } from './Avatar/Avatar';

// Authentication
export { ProtectedRoute, PublicRoute } from './Authentication';

// BackLink
export { default as BackLink } from './BackLink/BackLink';

// BrowseGroupsModal
export { default as BrowseGroupsModal } from './BrowseGroupsModal';

// Button
export { Button, type ButtonProps } from './Button';

// ButtonSet
export { ButtonSet, type ButtonSetProps } from './ButtonSet';


// ContactCard
export { default as ContactCard } from './ContactCard/ContactCard';

export { InlineLoader } from './InlineLoader/InlineLoader';

// Checkbox
export { default as Checkbox } from './Checkbox';
export type { CheckboxProps } from './Checkbox';

// ConfigurableForm
export { default as ConfigurableForm } from './ConfigurableForm';
export * from './ConfigurableForm/types';

// CreateGroupModal
export { default as CreateGroupModal } from './CreateGroupModal';

// DashboardCard
export { default as DashboardCard } from './DashboardCard';
export type { DashboardCardProps } from './DashboardCard';

// ErrorBoundary
export {
  ErrorBoundary,
  GlobalErrorBoundary,
  RouteErrorBoundary,
  ComponentErrorBoundary,
  FormErrorBoundary,
  DashboardWidgetErrorBoundary
} from './ErrorBoundary';

// FilterButtonGroup
export { FilterButtonGroup, default as FilterButtonGroupComponent } from './FilterButtonGroup';
export type { FilterOption } from './FilterButtonGroup';

// Footer
export { default as Footer } from './Footer';

// GroupMemberCard
export { GroupMemberCard } from './GroupMemberCard';

// Greetings
export { Greetings } from './Greetings';

// Header
export { default as Header } from './Header';

// Icon
export { default as Icon } from './Icon';

// Input
export { Input } from './Input';

// Layout
export {
  Layout,
  AppInitializer,
  ViewTransitionLink
} from './Layout';

// LazyRoute
export { LazyRoute } from './LazyRoute';

// LoadingState
export { default as LoadingState } from './LoadingState';

// LocationAutocomplete
export { default as LocationAutocomplete } from './LocationAutocomplete';
export type { LocationAutocompleteProps, PlaceData } from 'types/components/location';

// Modal
export { Modal } from './Modal';

// OnboardingModal
export { OnboardingModal } from './OnboardingModal';

// PageLoader
export { PageLoader } from './PageLoader';

// PageTransition
export { default as PageTransition } from './PageTransition';

// ProfileCard
export { default as ProfileCard } from './ProfileCard/ProfileCard';

// ProfileReviewModal
export { ProfileReviewModal } from './ProfileReviewModal';

// ProtectedRoutes
export {
  SupporterRoute,
  SeekerRoute,
  PurposeRoute
} from './ProtectedRoutes';

// Radio
export { default as Radio } from './Radio';

// RadioGroup
export { RadioGroup } from './RadioGroup';

// Select
export { Select, SelectItem } from './Select';

// Tab
export { default as Tab } from './Tab';

// TabPanel
export { default as TabPanel } from './TabPanel';

// Tabs (compound component with Tab.List, Tab.Tab, Tab.Panel)
export { Tabs } from './Tabs';
export type { TabsProps } from './Tabs';

// Textarea
export { Textarea } from './Textarea';

// Toast
export {
  ToastProvider,
  toast,
  toastQueue
} from './Toast';
export type { ToastContent, ToastType } from './Toast';

// WelcomeScreen
export { WelcomeScreen } from './WelcomeScreen';
// Messaging (Phase 1 & Phase 2)
export * from './Messaging';
