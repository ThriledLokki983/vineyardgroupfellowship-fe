/**
 * Signals Index
 * Central export point for all signal-related functionality
 */

// Core utilities
export * from './signal-utils'

// UI state signals
export * from './ui-signals'

// Form state signals
export * from './form-signals'

// Profile page signals
export * from './profile-signals'

// Supporter background signals
export * from './supporter-background-signals'

// Auth pages signals
export * from './auth-signals'

// Page-level signals
export * from './page-signals'

// React integration hooks
export * from './react-hooks'

// Re-export common signals for convenience
export { signal, computed, effect, batch } from '@preact/signals-react'
export type { Signal, ReadonlySignal } from '@preact/signals-react'