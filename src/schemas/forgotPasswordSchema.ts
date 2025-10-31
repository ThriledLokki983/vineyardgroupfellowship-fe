import { z } from 'zod'

// Forgot password form schema
export const forgotPasswordSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(254, 'Email address is too long')
})

// Export TypeScript type
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>