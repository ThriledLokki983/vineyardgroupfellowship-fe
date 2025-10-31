# Components Directory

This directory contains all reusable UI components for the Vineyard Group Fellowship frontend application.

## Centralized Exports

All components are exported from the main `index.ts` file for easy importing and usage throughout the application.

### Usage

Instead of importing components from their individual directories:

```typescript
// ❌ Old way - importing from individual directories
import Button from '../components/Button/Button';
import Header from '../components/Header/Header';
import { AlertBar } from '../components/AlertBar/AlertBar';
```

You can now import all components from the centralized index:

```typescript
// ✅ New way - importing from centralized index
import { Button, Header, AlertBar } from '../components';
```

### Available Components

#### UI Components
- `AlertBar` - Alert/notification bars
- `Button` - Primary button component with variants
- `Checkbox` - Checkbox input component
- `Radio` - Radio button input component
- `Modal` - Modal dialog component
- `Icon` - Icon component
- `LoadingState` - Loading state indicator
- `Toast` components (`ToastProvider`, `toast`, `toastQueue`)

#### Layout Components
- `Layout` - Main layout wrapper
- `AppInitializer` - App initialization component
- `ViewTransitionLink` - Navigation link with transitions
- `Header` - Application header
- `Footer` - Application footer
- `PageLoader` - Page loading component
- `PageTransition` - Page transition wrapper

#### Form Components
- `ConfigurableForm` - Dynamic form builder
- `Tab` - Tab component
- `TabPanel` - Tab panel component

#### Authentication Components
- `ProtectedRoute` - Route protection for authenticated users
- `PublicRoute` - Route protection for unauthenticated users
- `SupporterRoute` - Route protection for supporter users
- `SeekerRoute` - Route protection for seeker users
- `PurposeRoute` - Route protection based on user purpose

#### Error Handling
- `ErrorBoundary` - Base error boundary component
- `GlobalErrorBoundary` - Global application error boundary
- `RouteErrorBoundary` - Route-specific error boundary
- `ComponentErrorBoundary` - Component-specific error boundary
- `FormErrorBoundary` - Form-specific error boundary
- `DashboardWidgetErrorBoundary` - Dashboard widget error boundary

#### Specialized Components
- `DashboardCard` - Dashboard card component
- `OnboardingModal` - Onboarding flow modal
- `WelcomeScreen` - Welcome screen component

### Types

Most components also export their TypeScript types:

```typescript
import {
  Button,
  type ButtonProps,
  Checkbox,
  type CheckboxProps,
  DashboardCard,
  type DashboardCardProps
} from '../components';
```

### Component Structure

Each component follows this structure:
```
ComponentName/
├── index.ts              # Component exports
├── ComponentName.tsx     # Main component file
├── ComponentName.module.scss # Component styles
└── types.ts             # Component types (if applicable)
```

### Adding New Components

When adding new components:

1. Create the component directory following the established pattern
2. Create the component files (`.tsx`, `.module.scss`, `index.ts`)
3. Export the component from its `index.ts` file
4. Add the export to the main `/components/index.ts` file
5. Update this README with the new component

### Design System

All components follow the Vineyard Group Fellowship design system:
- Use SCSS modules for styling
- Follow accessibility-first patterns (React Aria Components)
- Use Open Props design tokens
- Maintain the premium wellness aesthetic
- Follow the 4pt spacing system

### Testing

Components should include appropriate tests and follow the accessibility guidelines outlined in the project documentation.