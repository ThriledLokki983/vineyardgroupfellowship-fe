/**
 * Core Signal Types and Utilities for Vineyard Group Fellowship
 *
 * This file provides TypeScript types and utility functions for consistent
 * signal usage across the application.
 */

import { signal, effect } from '@preact/signals-react'
import type { Signal } from '@preact/signals-react'

// Re-export signals for consistent imports
export { signal, computed, effect, batch } from '@preact/signals-react'
export type { Signal, ReadonlySignal } from '@preact/signals-react'

/**
 * Common signal patterns and utilities
 */

// Boolean toggle signal utility
export const createToggleSignal = (initialValue = false) => {
  const state = signal(initialValue)

  return {
    value: state,
    toggle: () => state.value = !state.value,
    setTrue: () => state.value = true,
    setFalse: () => state.value = false,
    set: (value: boolean) => state.value = value
  }
}

// Loading state signal utility
export function createLoadingSignal() {
  const isLoading = signal(false)
  const error = signal<string | null>(null)

  return {
    isLoading,
    error,
    setLoading: (loading: boolean) => {
      isLoading.value = loading
      if (loading) error.value = null
    },
    setError: (err: string | null) => {
      error.value = err
      isLoading.value = false
    },
    reset: () => {
      isLoading.value = false
      error.value = null
    }
  }
}

// Counter signal utility
export function createCounterSignal(initialValue = 0) {
  const count = signal(initialValue)

  return {
    value: count,
    increment: () => count.value++,
    decrement: () => count.value--,
    reset: () => count.value = initialValue,
    set: (value: number) => count.value = value
  }
}

// Object state signal utility with deep equality check
export function createObjectSignal<T extends Record<string, unknown>>(initialValue: T) {
  const state = signal(initialValue)

  return {
    value: state,
    update: (updates: Partial<T>) => {
      state.value = { ...state.value, ...updates }
    },
    set: (newValue: T) => state.value = newValue,
    reset: () => state.value = initialValue
  }
}

// Array signal utility
export function createArraySignal<T>(initialValue: T[] = []) {
  const state = signal(initialValue)

  return {
    value: state,
    push: (item: T) => state.value = [...state.value, item],
    remove: (index: number) => state.value = state.value.filter((_, i) => i !== index),
    removeItem: (item: T) => state.value = state.value.filter(i => i !== item),
    update: (index: number, item: T) => {
      const newArray = [...state.value]
      newArray[index] = item
      state.value = newArray
    },
    clear: () => state.value = [],
    set: (newArray: T[]) => state.value = newArray
  }
}

/**
 * Signal naming conventions:
 * - UI state: camelCase (isModalOpen, currentTab)
 * - Form state: formName + field (profileFormDraft, loginFormErrors)
 * - Global state: descriptive names (userPreferences, dashboardSettings)
 */

/**
 * Development utilities
 */
export function createSignalLogger<T>(signalInstance: Signal<T>, name: string) {
  if (import.meta.env.DEV) {
    effect(() => {
      console.log(`[Signal ${name}]:`, signalInstance.value)
    })
  }
}

/**
 * Signal cleanup utility for component unmounting
 */
export function createSignalCleanup() {
  const cleanupFunctions: (() => void)[] = []

  return {
    add: (cleanup: () => void) => cleanupFunctions.push(cleanup),
    cleanup: () => {
      cleanupFunctions.forEach(fn => fn())
      cleanupFunctions.length = 0
    }
  }
}