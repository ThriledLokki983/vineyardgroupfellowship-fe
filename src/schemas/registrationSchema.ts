import { z } from 'zod'

// User purpose enum for type safety - matches backend exactly
export const UserPurpose = {
  SEEKING_RECOVERY: 'seeking_recovery',
  PROVIDING_SUPPORT: 'providing_support'
} as const

export type UserPurposeType = typeof UserPurpose[keyof typeof UserPurpose]

// Registration form schema with comprehensive validation
export const registrationSchema = z.object({
  username: z.string()
    .min(1, 'Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .refine(val => !/^(admin|root|user|test|guest)$/i.test(val), 'Username cannot be a reserved word'),

  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(254, 'Email address is too long'),

  password: z.string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be less than 128 characters')
    .regex(/^(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
    .regex(/^(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
    .regex(/^(?=.*\d)/, 'Password must contain at least one number')
    .regex(/^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/, 'Password must contain at least one special character')
    .refine(val => !/(.)\1{2,}/.test(val), 'Password cannot contain repeating characters')
    .refine(val => !/^(password|123456|admin|user|test|login)$/i.test(val), 'Password cannot be a common password'),

  confirmPassword: z.string()
    .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Export TypeScript type
export type RegistrationFormData = z.infer<typeof registrationSchema>