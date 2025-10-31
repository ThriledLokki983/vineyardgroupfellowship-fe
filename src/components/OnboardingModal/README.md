# OnboardingModal Component

An automated onboarding modal that appears for first-time users after email verification, guiding them through Vineyard Group Fellowship's key features.

## Features

- ✅ **Automatic Display**: Shows when user is verified but not onboarded
- ✅ **Multi-Step Flow**: 4-step guided tour of app features
- ✅ **Step Navigation**: Click indicators to jump between steps
- ✅ **API Integration**: Marks user as onboarded in backend
- ✅ **Skip Option**: Allow users to skip onboarding
- ✅ **Responsive Design**: Mobile-friendly interface
- ✅ **Recovery-Focused**: Content tailored for addiction recovery

## Automatic Behavior

The modal automatically appears when:
1. User is authenticated (`user` exists)
2. User has verified their email (`user.email_verified === true`)
3. User has not completed onboarding (`user.onboarded !== true`)

## Onboarding Steps

### Step 1: Welcome
- **Title**: "Welcome to Vineyard Group Fellowship"
- **Focus**: Introduction to the digital recovery companion

### Step 2: Progress Tracking
- **Title**: "Track Your Progress"
- **Focus**: Goal setting and milestone celebration

### Step 3: Habit Building
- **Title**: "Build Healthy Habits"
- **Focus**: Replacing old patterns with positive routines

### Step 4: Community & Support
- **Title**: "Connect & Support"
- **Focus**: Community features and peer support

## Usage

### Automatic Integration

Simply include the component in your app - it handles its own visibility:

```tsx
import { OnboardingModal } from 'components/OnboardingModal';

function App() {
  return (
    <div>
      <OnboardingModal />
      {/* Rest of your app */}
    </div>
  );
}
```

### Manual Control (Advanced)

For custom implementations, you can control the modal manually:

```tsx
import { OnboardingModal } from 'components/OnboardingModal';

// The component checks user state automatically
// No additional props needed for standard usage
```

## API Integration

When user completes or skips onboarding:

1. **API Call**: `PATCH /profiles/me/` with `{ onboarded: true }`
2. **State Update**: Updates user context with `onboarded: true`
3. **Modal Close**: Modal closes and won't show again

## Styling

The component uses design system tokens and includes:

- **Brand Colors**: Primary and accent colors
- **Smooth Animations**: Step transitions and modal entry/exit
- **Responsive Layout**: Mobile, tablet, and desktop optimized
- **Focus Management**: Proper keyboard navigation

## Content Customization

To modify onboarding content, edit the `onboardingSteps` array:

```tsx
const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: "Your Custom Title",
    description: "Your custom description...",
    image: "/images/your-image.png"
  },
  // ... more steps
];
```

## Image Assets

The component expects images in `/public/images/`:
- `onboarding-1.png` - Welcome step
- `onboarding-2.png` - Progress tracking
- `onboarding-3.png` - Habit building
- `onboarding-4.png` - Community features

**Note**: Currently uses icon placeholders if images are not available.

## User Flow

1. **User logs in** for the first time
2. **Email verification** completes
3. **OnboardingModal appears** automatically
4. **User navigates** through 4 steps
5. **User clicks "Start Your Journey"** or "Skip for now"
6. **Backend updated** with onboarded status
7. **Modal closes** and user continues to dashboard

## Accessibility

- ✅ **ARIA Labels**: Proper labeling for all interactive elements
- ✅ **Step Indicators**: Clear current step indication
- ✅ **Keyboard Navigation**: Tab through all controls
- ✅ **Screen Reader**: Descriptive text for all actions
- ✅ **Focus Management**: Handled by underlying Modal component

## Error Handling

- **API Failures**: Modal still closes if backend call fails
- **Network Issues**: Graceful degradation with console logging
- **Missing User**: Component safely handles null user state

## Related Components

- **Modal**: Base modal component used internally
- **Button**: For navigation and actions
- **Icon**: For step indicators and buttons
- **AuthContext**: Provides user state and setUser function

## Development

For development, you can temporarily force the modal to show by:

1. Setting `user.onboarded = false` in AuthContext
2. Or adding a manual override in the component
3. Checking browser console for API call results