/**
 * Form State Signals
 *
 * Reusable signal patterns for form state management.
 * Designed to work with ConfigurableForm and other form components.
 */

import { signal } from '@preact/signals-react'
import { createToggleSignal } from './signal-utils'
import type { FieldValue } from '../components/ConfigurableForm/types'

/**
 * Create a form state signal
 * Manages form data, validation, and submission state
 */
export function createFormSignal<T extends Record<string, FieldValue>>(initialData: T = {} as T) {
  // Form data state
  const data = signal<T>(initialData)

  // Validation errors (field name -> error message)
  const errors = signal<Record<string, string>>({})

  // Server errors (field name -> error messages array)
  const serverErrors = signal<Record<string, string[]>>({})

  // Field-specific UI state
  const fieldStates = signal<Record<string, {
    touched: boolean
    focused: boolean
    showInstructions: boolean
  }>>({})

  // Form-level state
  const isSubmitting = createToggleSignal(false)
  const isDirty = createToggleSignal(false)
  const isValidating = createToggleSignal(false)

  return {
    // Data
    data,
    errors,
    serverErrors,
    fieldStates,

    // State flags
    isSubmitting,
    isDirty,
    isValidating,

    // Helper methods
    setFieldValue: (fieldName: string, value: FieldValue) => {
      data.value = { ...data.value, [fieldName]: value }
      isDirty.setTrue()
    },

    setFieldError: (fieldName: string, error: string) => {
      errors.value = { ...errors.value, [fieldName]: error }
    },

    clearFieldError: (fieldName: string) => {
      const newErrors = { ...errors.value }
      delete newErrors[fieldName]
      errors.value = newErrors
    },

    setServerErrors: (serverErrs: Record<string, string[]>) => {
      serverErrors.value = serverErrs
    },

    clearServerErrors: () => {
      serverErrors.value = {}
    },

    setFieldTouched: (fieldName: string, touched: boolean = true) => {
      fieldStates.value = {
        ...fieldStates.value,
        [fieldName]: {
          ...fieldStates.value[fieldName],
          touched
        }
      }
    },

    setFieldFocused: (fieldName: string, focused: boolean) => {
      fieldStates.value = {
        ...fieldStates.value,
        [fieldName]: {
          ...fieldStates.value[fieldName],
          focused
        }
      }
    },

    toggleFieldInstructions: (fieldName: string) => {
      const current = fieldStates.value[fieldName]?.showInstructions || false
      fieldStates.value = {
        ...fieldStates.value,
        [fieldName]: {
          ...fieldStates.value[fieldName],
          showInstructions: !current
        }
      }
    },

    reset: (newData: T = {} as T) => {
      data.value = newData
      errors.value = {}
      serverErrors.value = {}
      fieldStates.value = {}
      isSubmitting.setFalse()
      isDirty.setFalse()
      isValidating.setFalse()
    },

    clearErrors: () => {
      errors.value = {}
      serverErrors.value = {}
    },

    // Computed helpers
    hasErrors: () => {
      return Object.keys(errors.value).length > 0 || Object.keys(serverErrors.value).length > 0
    },

    getFieldError: (fieldName: string): string | null => {
      // Server errors take precedence
      if (serverErrors.value[fieldName]?.length > 0) {
        return serverErrors.value[fieldName][0]
      }
      return errors.value[fieldName] || null
    },

    isFieldTouched: (fieldName: string): boolean => {
      return fieldStates.value[fieldName]?.touched || false
    },

    isFieldFocused: (fieldName: string): boolean => {
      return fieldStates.value[fieldName]?.focused || false
    },

    shouldShowInstructions: (fieldName: string): boolean => {
      return fieldStates.value[fieldName]?.showInstructions || false
    }
  }
}

/**
 * Form Signals Type
 * Export the type for TypeScript inference
 */
export type FormSignal<T extends Record<string, FieldValue>> = ReturnType<typeof createFormSignal<T>>

/**
 * Pre-configured form signals for common forms
 */

// Login form
export const loginForm = createFormSignal<{
  email_or_username: string
  password: string
  remember_me: boolean
}>({
  email_or_username: '',
  password: '',
  remember_me: false
})

// Registration form
export const registrationForm = createFormSignal<{
  username: string
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  user_purpose: string
  terms_accepted: boolean
  privacy_policy_accepted: boolean
  terms_of_service_accepted: boolean
}>({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
  user_purpose: '',
  terms_accepted: false,
  privacy_policy_accepted: false,
  terms_of_service_accepted: false
})

// Password reset form
export const passwordResetForm = createFormSignal<{
  email: string
}>({
  email: ''
})

// Forgot password form
export const forgotPasswordForm = createFormSignal<{
  token: string
  password: string
  confirmPassword: string
}>({
  token: '',
  password: '',
  confirmPassword: ''
})

/**
 * Development helpers
 */
if (import.meta.env.DEV) {
  // Make form signals available in browser console for debugging
  ;(globalThis as Record<string, unknown>).formSignals = {
    loginForm,
    registrationForm,
    passwordResetForm,
    forgotPasswordForm
  }
}
