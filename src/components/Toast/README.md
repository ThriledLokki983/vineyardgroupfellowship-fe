# Toast Component

A fully accessible toast notification system built with React Aria Components that follows WCAG 2.1 AA standards.

## Features

- ✅ **Fully accessible** - ARIA alertdialog pattern with landmark regions
- 🎨 **Premium design** - Smooth animations with CSS view transitions
- 🎯 **Type-safe** - Full TypeScript support
- 📱 **Responsive** - Mobile-optimized with touch-friendly interactions
- ⏱️ **Auto-dismiss** - Configurable timeouts with pause on hover/focus
- 🎭 **4 Toast Types** - Success, Error, Warning, Info

## Installation

The toast system is already integrated into the app via `main.tsx`. The `ToastProvider` component renders the toast region.

## Usage

Import the `toast` helper anywhere in your application:

```tsx
import { toast } from '../components/Toast'
```

### Basic Usage

```tsx
// Success toast (5 second timeout)
toast.success('Account Created!', 'Check your email for verification.')

// Error toast (7 second timeout)
toast.error('Login Failed', 'Invalid credentials. Please try again.')

// Warning toast (6 second timeout)
toast.warning('Session Expiring', 'Your session will expire in 5 minutes.')

// Info toast (5 second timeout)
toast.info('New Feature', 'Check out our new recovery tools!')
```

### Advanced Usage

```tsx
// Custom timeout
toast.success('Saved!', 'Your changes have been saved.', 3000)

// With callback
const toastKey = toast.custom(
  {
    title: 'Upload in Progress',
    description: 'Please wait...',
    type: 'info'
  },
  {
    timeout: 0, // Don't auto-dismiss
    onClose: () => {
      console.log('Toast dismissed')
    }
  }
)

// Programmatically dismiss
toastQueue.close(toastKey)
```

## Toast Types

### Success ✅
Used for: Successful operations, confirmations, completed actions
- Color: Green (`--green-7`)
- Default timeout: 5 seconds
- Example: "Account created!", "Password updated", "Settings saved"

### Error ❌
Used for: Failed operations, validation errors, system errors
- Color: Clay Red (`--accent-danger`)
- Default timeout: 7 seconds (longer to ensure users see critical info)
- Example: "Login failed", "Network error", "Invalid input"

### Warning ⚠️
Used for: Important information, potential issues, cautions
- Color: Soft Amber (`--accent-warm`)
- Default timeout: 6 seconds
- Example: "Session expiring soon", "Unsaved changes", "Slow connection"

### Info ℹ️
Used for: General information, tips, neutral updates
- Color: Deep Olive Green (`--brand-primary`)
- Default timeout: 5 seconds
- Example: "New feature available", "Tip of the day", "Update available"

## Accessibility

### Keyboard Navigation
- **F6** - Jump to toast region from anywhere in the app
- **Shift + F6** - Jump backward to toast region
- **Escape** or **Close Button** - Dismiss active toast
- Focus automatically moves to next toast when one is dismissed

### Screen Readers
- Toast content is announced when it appears
- Toasts are rendered in an ARIA landmark region labeled "Notifications"
- Close button has proper `aria-label`

### Auto-Dismiss Guidelines
- **Minimum timeout: 5 seconds** - Gives users enough time to read
- Timers pause when user hovers or focuses on toast
- Critical information should NOT auto-dismiss (use `timeout: 0`)
- Only auto-dismiss non-essential information

## Styling

Toast styles are defined in `ToastProvider.module.scss` using:
- Open Props design tokens for consistency
- CSS view transitions for smooth animations
- Responsive breakpoints for mobile optimization
- Type-specific color accents via left border

### Customization

To customize toast appearance, edit `ToastProvider.module.scss`:

```scss
.toast {
  // Adjust spacing, shadows, borders, etc.
  border-radius: var(--radius-3);
  box-shadow: var(--shadow-4);
}

.success {
  // Customize success toast color
  border-left: 4px solid var(--green-7);
}
```

## Examples from the App

### Registration Success
```tsx
registerUser(data, {
  onSuccess: () => {
    toast.success(
      'Account Created!',
      `Verification email sent to ${data.email}`
    )
  },
  onError: (error) => {
    toast.error(
      'Registration Failed',
      error.message || 'Please try again.'
    )
  }
})
```

### Login
```tsx
loginUser(credentials, {
  onSuccess: () => {
    toast.success('Welcome back!', 'You have successfully signed in.')
  },
  onError: () => {
    toast.error('Sign In Failed', 'Invalid credentials.')
  }
})
```

### Form Validation
```tsx
if (serverErrors?.email) {
  toast.error(
    'Email Already Exists',
    'This email is already registered. Try logging in instead.'
  )
}
```

## API Reference

### `toast.success(title, description?, timeout?)`
- **title**: string (required) - Main message
- **description**: string (optional) - Additional details
- **timeout**: number (optional, default: 5000) - Auto-dismiss delay in ms

### `toast.error(title, description?, timeout?)`
Same as success, default timeout: 7000ms

### `toast.warning(title, description?, timeout?)`
Same as success, default timeout: 6000ms

### `toast.info(title, description?, timeout?)`
Same as success, default timeout: 5000ms

### `toast.custom(content, options?)`
- **content**: `{ title, description?, type? }`
- **options**: `{ timeout?, onClose? }`
- Returns: `string` - Toast key for programmatic dismissal

## Best Practices

1. **Keep messages concise** - Users should grasp the message quickly
2. **Use appropriate types** - Match the severity of the situation
3. **Provide actionable feedback** - Tell users what happened and what to do next
4. **Don't overuse** - Too many toasts can be overwhelming
5. **Test with screen readers** - Ensure announcements are clear
6. **Consider mobile** - Messages should fit on small screens
7. **Use descriptions wisely** - Add context without being verbose

## Troubleshooting

### Toast not appearing
- Ensure `ToastProvider` is rendered in `main.tsx`
- Check browser console for errors
- Verify `react-aria-components` is installed

### Toast dismissed too quickly
- Increase timeout value
- Ensure user isn't accidentally clicking close button
- Check if toast is being programmatically closed

### Animations not smooth
- Check browser support for CSS view transitions
- Verify CSS is properly imported
- Test in modern browsers (Chrome 111+, Safari 18+)

## Dependencies

- `react-aria-components` - Toast components (UNSTABLE API)
- `react-dom` - For `flushSync` in view transitions
- Open Props - Design tokens
