/**
 * Global UI State Signals
 *
 * Centralized UI state management using signals for consistent behavior
 * across the application. This replaces scattered useState calls for UI state.
 */

import { createToggleSignal, signal } from './signal-utils'
import type { RecoveryApproach, FaithTradition, ReligiousContentPreference } from '../services/api'

/**
 * Modal States
 * Replace individual useState calls for modal visibility
 */
export const modals = {
  // Onboarding modal
  onboarding: createToggleSignal(false),

  // Profile modals
  profilePhoto: createToggleSignal(false),
  profileSettings: createToggleSignal(false),

  // Group modals
  createGroup: createToggleSignal(false),

  // General purpose modal
  generic: createToggleSignal(false),

  // Confirmation modals
  confirmation: createToggleSignal(false),

  // Helper to close all modals
  closeAll: () => {
    modals.onboarding.setFalse()
    modals.profilePhoto.setFalse()
    modals.profileSettings.setFalse()
    modals.createGroup.setFalse()
    modals.generic.setFalse()
    modals.confirmation.setFalse()
  }
}

/**
 * Onboarding State
 * Track onboarding flow state
 */
export const onboarding = {
  // Current step (1-based index)
  step: signal(1),

  // Modal visibility
  isOpen: createToggleSignal(false),

  // Loading state
  isLoading: createToggleSignal(false),

  // Form data for onboarding steps
  recoveryApproach: signal<RecoveryApproach | null>(null),
  faithTradition: signal<FaithTradition | null>(null),
  contentPreference: signal<ReligiousContentPreference>('moderate'),  // Step navigation helpers
  nextStep: () => {
    onboarding.step.value = onboarding.step.value + 1
  },

  previousStep: () => {
    onboarding.step.value = Math.max(1, onboarding.step.value - 1)
  },

  setStep: (step: number) => {
    onboarding.step.value = step
  },

  reset: () => {
    onboarding.step.value = 1
    onboarding.isOpen.setFalse()
    onboarding.isLoading.setFalse()
    onboarding.recoveryApproach.value = null
    onboarding.faithTradition.value = null
    onboarding.contentPreference.value = 'moderate'
  }
}

/**
 * Loading States
 * Global loading indicators for different operations
 */
export const loading = {
  // Page-level loading
  pageLoading: createToggleSignal(false),

  // Form submissions
  formSubmitting: createToggleSignal(false),

  // File uploads
  fileUploading: createToggleSignal(false),

  // Photo uploads specifically
  photoUploading: createToggleSignal(false),

  // API operations
  apiLoading: createToggleSignal(false),

  // Helper to reset all loading states
  resetAll: () => {
    loading.pageLoading.setFalse()
    loading.formSubmitting.setFalse()
    loading.fileUploading.setFalse()
    loading.photoUploading.setFalse()
    loading.apiLoading.setFalse()
  }
}

/**
 * Editing States
 * Track what components are in editing mode
 */
export const editing = {
  // Profile editing
  profile: createToggleSignal(false),

  // Settings editing
  settings: createToggleSignal(false),

  // Form editing
  form: createToggleSignal(false),

  // Helper to exit all editing modes
  exitAll: () => {
    editing.profile.setFalse()
    editing.settings.setFalse()
    editing.form.setFalse()
  }
}

/**
 * Navigation State
 * Track navigation-related UI state
 */
export const navigation = {
  // Mobile menu state
  mobileMenuOpen: createToggleSignal(false),

  // Current active tab/section
  activeTab: signal('profile'),

  // Sidebar state
  sidebarOpen: createToggleSignal(true),

  // Breadcrumb state
  breadcrumbs: signal<Array<{ label: string; path?: string }>>([])
}

/**
 * Header State
 * Track header-specific UI state
 */
export const header = {
  // Profile dropdown state
  profileDropdownOpen: createToggleSignal(false),

  // Notifications dropdown state
  notificationsDropdownOpen: createToggleSignal(false),

  // Search state
  searchOpen: createToggleSignal(false),

  // Helper to close all dropdowns
  closeAllDropdowns: () => {
    header.profileDropdownOpen.setFalse()
    header.notificationsDropdownOpen.setFalse()
    header.searchOpen.setFalse()
  }
}

/**
 * Toast/Notification State
 * Global notification system state
 */
export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  timeout?: number
}

export const notifications = {
  // Current toast messages
  toasts: signal<ToastMessage[]>([]),

  // Add a new toast
  addToast: (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const newToast: ToastMessage = { ...toast, id }
    notifications.toasts.value = [...notifications.toasts.value, newToast]

    // Auto-remove after timeout
    if (toast.timeout !== 0) {
      setTimeout(() => {
        notifications.removeToast(id)
      }, toast.timeout || 5000)
    }

    return id
  },

  // Remove a specific toast
  removeToast: (id: string) => {
    notifications.toasts.value = notifications.toasts.value.filter(toast => toast.id !== id)
  },

  // Clear all toasts
  clearAll: () => {
    notifications.toasts.value = []
  }
}

/**
 * Form UI State
 * Generic form UI state that can be reused across forms
 */
export const formUI = {
  // Field focus state
  focusedField: signal<string | null>(null),

  // Form dirty state
  isDirty: createToggleSignal(false),

  // Form validation state
  isValidating: createToggleSignal(false),

  // Submit button state
  isSubmitting: createToggleSignal(false),

  // Form errors
  errors: signal<Record<string, string>>({}),

  // Helper functions
  setFieldFocus: (fieldName: string | null) => {
    formUI.focusedField.value = fieldName
  },

  setFieldError: (fieldName: string, error: string) => {
    formUI.errors.value = { ...formUI.errors.value, [fieldName]: error }
  },

  clearFieldError: (fieldName: string) => {
    const newErrors = { ...formUI.errors.value }
    delete newErrors[fieldName]
    formUI.errors.value = newErrors
  },

  clearAllErrors: () => {
    formUI.errors.value = {}
  },

  reset: () => {
    formUI.focusedField.value = null
    formUI.isDirty.setFalse()
    formUI.isValidating.setFalse()
    formUI.isSubmitting.setFalse()
    formUI.errors.value = {}
  }
}

/**
 * Global UI Reset
 * Reset all UI state to initial values
 */
export const resetAllUIState = () => {
  modals.closeAll()
  onboarding.reset()
  loading.pageLoading.setFalse()
  loading.formSubmitting.setFalse()
  loading.fileUploading.setFalse()
  editing.exitAll()
  navigation.mobileMenuOpen.setFalse()
  navigation.activeTab.value = 'profile'
  navigation.breadcrumbs.value = []
  header.closeAllDropdowns()
  notifications.clearAll()
  formUI.reset()
}

/**
 * Development helpers
 */
if (import.meta.env.DEV) {
  // Make UI signals available in browser console for debugging
  ;(globalThis as Record<string, unknown>).uiSignals = {
    modals,
    onboarding,
    loading,
    editing,
    navigation,
    header,
    notifications,
    formUI,
    resetAllUIState
  }
}