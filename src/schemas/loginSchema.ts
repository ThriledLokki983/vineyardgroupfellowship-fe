import { z } from 'zod'

// Login form schema
export const loginSchema = z.object({
  email_or_username: z.string()
    .min(4, 'Email or username is required')
    .max(254, 'Email or username is too long')
    .refine((value) => {
      // Allow either email format or username (no @ symbol)
      const isEmail = value.includes('@')
      const isUsername = !value.includes('@') && value.length >= 3
      return isEmail ? z.string().email().safeParse(value).success : isUsername
    }, {
      message: 'Please enter a valid email address or username (minimum 3 characters)'
    }),

  password: z.string()
    .min(1, 'Password is required')
    .max(128, 'Password is too long'),

  remember_me: z.boolean().optional().default(false)
})

// Export TypeScript type
export type LoginFormData = z.infer<typeof loginSchema>