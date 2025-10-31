import { z } from 'zod'
import type { FormSignal } from 'signals/form-signals'

export type FieldType = 'text' | 'email' | 'password' | 'checkbox' | 'radio' | 'select' | 'checkbox_group'

export type FieldValue = string | boolean | number | string[]

export interface FieldValidation {
  pattern?: RegExp
  minLength?: number
  maxLength?: number
  custom?: (value: FieldValue) => boolean | string
}

export interface FieldOption {
  value: string
  label: string
  description?: string
}

export interface FieldConfig {
  name: string
  label: string
  type: FieldType
  placeholder?: string
  isRequired?: boolean
  validation?: FieldValidation
  // For password fields with real-time validation feedback
  showValidationFeedback?: boolean
  // For checkbox fields
  checkboxLabel?: string
  // For radio and select fields
  options?: FieldOption[]
  // Additional description text
  description?: string
}

export interface FieldGroup {
  fields: FieldConfig[]
  layout: 'horizontal' | 'vertical'
  className?: string
}

export interface FormConfig {
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
  // Zod schema for validation
  schema?: z.ZodSchema<Record<string, FieldValue>>
}

export interface ConfigurableFormProps {
  config: FormConfig
  onSubmit: (data: Record<string, FieldValue>) => void
  isPending?: boolean
  error?: string | null
  initialData?: Record<string, FieldValue>
  className?: string
  // Server-side field errors
  serverErrors?: Record<string, string[]>
  // Optional form signal for signal-based state management
  formSignal?: FormSignal<Record<string, FieldValue>>
}

// Type guard to check if an item is a FieldGroup
export function isFieldGroup(item: FieldConfig | FieldGroup): item is FieldGroup {
  return 'fields' in item && Array.isArray(item.fields)
}

// Helper type for password strength feedback
export interface PasswordStrengthState {
  score: number // 0-4 strength score
  strength: 'very-weak' | 'weak' | 'fair' | 'strong' | 'very-strong'
  feedback: string
  percentage: number // 0-100 for progress bar
}