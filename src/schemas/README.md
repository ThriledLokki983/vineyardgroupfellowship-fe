# Form Validation Schemas

This directory contains Zod validation schemas for all forms in the Vineyard Group Fellowship application. Each schema provides comprehensive, type-safe validation with detailed error messages.

## 📁 Schema Files

### 🔐 Authentication Schemas

#### `registrationSchema.ts`
Validates user registration with comprehensive checks:
- **First Name**: 2-50 characters, letters/spaces/hyphens only, no reserved words
- **Last Name**: 2-50 characters, letters/spaces/hyphens only, no reserved words
- **Username**: 3-30 characters, alphanumeric + underscores, no reserved words
- **Email**: Valid email format, max 254 characters
- **Password**: 8-128 characters with complexity requirements:
  - At least one lowercase letter
  - At least one uppercase letter
  - At least one number
  - At least one special character
  - No repeating characters (e.g., "aaa")
  - Not a common password
- **Confirm Password**: Must match password

#### `loginSchema.ts`
Validates user login:
- **Email**: Valid email format, required
- **Password**: Required, max 128 characters
- **Remember Me**: Optional boolean (defaults to false)

#### `forgotPasswordSchema.ts`
Validates password reset requests:
- **Email**: Valid email format, required, max 254 characters

## 🎯 Usage

### Import Individual Schemas
```typescript
import { registrationSchema } from '../schemas/registrationSchema'
import { loginSchema } from '../schemas/loginSchema'
import { forgotPasswordSchema } from '../schemas/forgotPasswordSchema'
```

### Import All Schemas
```typescript
import {
  registrationSchema,
  loginSchema,
  forgotPasswordSchema,
  type RegistrationFormData,
  type LoginFormData,
  type ForgotPasswordFormData
} from '../schemas'
```

### Use with ConfigurableForm
```typescript
const formConfig: FormConfig = {
  fields: [/* ... */],
  submitButton: {/* ... */},
  schema: registrationSchema // Add Zod validation
}
```

### Manual Validation
```typescript
try {
  const validData = registrationSchema.parse(formData)
  // Data is valid
} catch (error) {
  if (error instanceof z.ZodError) {
    // Handle validation errors
    console.log(error.issues)
  }
}
```

## ✨ Features

### 🔒 Security-First Validation
- Password complexity requirements
- Reserved word blocking (admin, root, etc.)
- Common password prevention
- Email format validation
- Length limits to prevent attacks

### 🎨 User-Friendly Error Messages
- Clear, actionable error descriptions
- Field-specific validation feedback
- Real-time validation support

### 📱 Type Safety
- Full TypeScript integration
- Inferred types for form data
- Compile-time validation

### 🔄 Integration
- Works seamlessly with ConfigurableForm
- React Aria Components support
- Real-time error clearing
- Form submission validation

## 🛡️ Validation Rules

### Password Security
Our password validation follows security best practices:
1. **Length**: 8-128 characters (prevents both weak and DoS attacks)
2. **Complexity**: Mixed case, numbers, symbols
3. **Pattern Prevention**: No repeating characters
4. **Common Password Protection**: Blocks common weak passwords
5. **Real-time Feedback**: Visual indicators for each requirement

### Email Validation
- RFC 5322 compliant email validation
- Maximum length enforcement (254 chars per RFC)
- Proper error messaging

### Name Validation
- Supports international characters
- Allows common name patterns (hyphens, apostrophes)
- Prevents injection attacks with character restrictions

## 🔧 Extending Schemas

To add new validation rules:

```typescript
// Add custom validation
const enhancedSchema = baseSchema.extend({
  newField: z.string()
    .min(1, 'Field is required')
    .refine(val => customCheck(val), 'Custom error message')
})

// Add cross-field validation
const schemaWithCrossValidation = baseSchema.refine(
  (data) => data.field1 === data.field2,
  {
    message: "Fields must match",
    path: ["field2"], // Error appears on field2
  }
)
```

## 📋 Error Handling

The schemas integrate with ConfigurableForm to provide:
- **Real-time validation**: Errors clear as user types
- **Form submission blocking**: Invalid forms cannot be submitted
- **Field-level errors**: Specific feedback per field
- **Accessible errors**: Screen reader compatible error messages

## 🧪 Testing

Each schema should be tested with:
- Valid data cases
- Invalid data cases
- Edge cases (empty, very long, special characters)
- Cross-field validation scenarios

Example test:
```typescript
import { registrationSchema } from './registrationSchema'

describe('registrationSchema', () => {
  it('validates correct registration data', () => {
    const validData = {
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'john@example.com',
      password: 'SecurePass123!',
      confirmPassword: 'SecurePass123!'
    }

    expect(() => registrationSchema.parse(validData)).not.toThrow()
  })
})
```