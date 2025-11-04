# ConfigurableForm Component

A flexible, reusable form component built with **React Hook Form** and **React Aria Components** that supports various field types, validation, and layout configurations.

## 🎯 Key Technologies

- **React Hook Form v7**: Powerful form state management with minimal re-renders
- **React Aria Components**: Accessible UI primitives (WCAG 2.1 AA compliant)
- **Zod**: Type-safe schema validation
- **@hookform/resolvers**: Seamless Zod integration

## Features

- **Multiple Field Types**: text, email, password, checkbox, radio, checkbox_group
- **Flexible Layout**: Individual fields or grouped fields (horizontal/vertical)
- **Real-time Validation**: Zod schema validation with immediate feedback
- **Password Validation**: Built-in password strength indicators
- **TypeScript Support**: Fully typed with comprehensive interfaces
- **Accessibility**: Built on React Aria Components for full a11y support
- **Consistent Styling**: Integrated with our design system
- **Server Error Handling**: Automatic integration of Django server-side errors
- **Performance Optimized**: React Hook Form's efficient re-render strategy

## 📚 Documentation

For detailed integration guide and advanced patterns, see:
- **[React Hook Form Integration Guide](./REACT_HOOK_FORM_INTEGRATION.md)** - Complete documentation on RHF integration

## Usage

```tsx
import ConfigurableForm from '../components/ConfigurableForm'
import { FormConfig } from '../components/ConfigurableForm/types'
import { z } from 'zod'

// Define Zod schema for validation
const registrationSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional()
})

const formConfig: FormConfig = {
  fields: [
    // Single field
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter your email',
      isRequired: true
    },

    // Field group (side-by-side)
    {
      fields: [
        {
          name: 'firstName',
          label: 'First Name',
          type: 'text',
          placeholder: 'First name',
          isRequired: true
        },
        {
          name: 'lastName',
          label: 'Last Name',
          type: 'text',
          placeholder: 'Last name',
          isRequired: true
        }
      ],
      layout: 'horizontal'
    },

    // Password with validation feedback
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Create a password',
      isRequired: true,
      showValidationFeedback: true
    },

    // Checkbox
    {
      name: 'rememberMe',
      label: 'Remember Me',
      type: 'checkbox',
      checkboxLabel: 'Keep me signed in'
    }
  ],
  schema: registrationSchema, // Zod schema for React Hook Form validation
  submitButton: {
    text: 'Create Account',
    loadingText: 'Creating...',
    variant: 'primary'
  },
  footer: {
    text: 'Already have an account?',
    buttonText: 'Sign In',
    onButtonClick: () => navigate('/login'),
    buttonVariant: 'tertiary'
  }
}

function MyPage() {
  const handleSubmit = (data: Record<string, FieldValue>) => {
    console.log('Form submitted:', data)
  }

  return (
    <ConfigurableForm
      config={formConfig}
      onSubmit={handleSubmit}
      isPending={isSubmitting}
      error={submitError}
      initialData={{ email: 'prefilled@example.com' }}
      serverErrors={serverValidationErrors} // Django server errors
    />
  )
}
```

## Field Types

### Text/Email Fields
```tsx
{
  name: 'username',
  label: 'Username',
  type: 'text',
  placeholder: 'Choose a username',
  isRequired: true,
  validation: {
    minLength: 3,
    pattern: /^[a-zA-Z0-9_]+$/,
    custom: (value) => value !== 'admin' || 'Username cannot be admin'
  }
}
```

### Password Fields
```tsx
{
  name: 'password',
  label: 'Password',
  type: 'password',
  isRequired: true,
  showValidationFeedback: true  // Shows strength indicators
}
```

### Checkbox Fields
```tsx
{
  name: 'agreeToTerms',
  label: 'Terms',
  type: 'checkbox',
  checkboxLabel: 'I agree to the Terms of Service',
  isRequired: true
}
```

### Field Groups
```tsx
{
  fields: [
    { name: 'city', label: 'City', type: 'text' },
    { name: 'state', label: 'State', type: 'text' }
  ],
  layout: 'horizontal',  // 'horizontal' | 'vertical'
  className: 'custom-group-class'
}
```

## Form Configuration

```tsx
interface FormConfig {
  fields: (FieldConfig | FieldGroup)[]
  submitButton: {
    text: string
    loadingText?: string
    variant?: 'primary' | 'secondary' | 'tertiary'
  }
  footer?: {
    text: string
    buttonText: string
    onButtonClick: () => void
    buttonVariant?: 'primary' | 'secondary' | 'tertiary'
  }
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `config` | `FormConfig` | ✅ | Form configuration object |
| `onSubmit` | `(data: Record<string, FieldValue>) => void` | ✅ | Submit handler |
| `isPending` | `boolean` | ❌ | Loading state for submit button |
| `error` | `string \| null` | ❌ | Error message to display |
| `initialData` | `Record<string, FieldValue>` | ❌ | Pre-fill form data |
| `className` | `string` | ❌ | Additional CSS class |

## Validation

Built-in validation includes:
- Required field validation
- Pattern matching (regex)
- Min/max length
- Custom validation functions
- Password strength indicators (length, complexity, uniqueness, common patterns)

## Styling

The component uses CSS Modules and follows our design system tokens. Key classes:

- `.configurableForm` - Root container
- `.form` - Form wrapper
- `.formField` - Individual field wrapper
- `.fieldGroup` - Group container
- `.horizontal/.vertical` - Group layout modifiers
- `.checkboxField` - Checkbox styling
- `.passwordInstructions` - Password validation feedback
- `.errorMessage` - Error display
- `.footer` - Footer with additional action

## Accessibility

Built on React Aria Components, providing:
- Proper ARIA labels and descriptions
- Keyboard navigation
- Focus management
- Screen reader support
- High contrast support
- Error announcements