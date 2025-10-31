/**
 * React Signal Integration Hooks
 *
 * Custom hooks that provide better React integration for signals,
 * including cleanup and lifecycle management.
 */

import { useEffect, useRef } from 'react'
import { effect, signal, computed } from '@preact/signals-react'
import type { Signal } from '@preact/signals-react'

/**
 * Hook for automatic signal cleanup on component unmount
 */
export function useSignalCleanup() {
  const cleanupFunctions = useRef<(() => void)[]>([])

  useEffect(() => {
    return () => {
      cleanupFunctions.current.forEach(cleanup => cleanup())
      cleanupFunctions.current = []
    }
  }, [])

  const addCleanup = (cleanup: () => void) => {
    cleanupFunctions.current.push(cleanup)
  }

  return { addCleanup }
}

/**
 * Hook for creating signal effects with automatic cleanup
 */
export function useSignalEffect(effectFn: () => void | (() => void), deps?: unknown[]) {
  const { addCleanup } = useSignalCleanup()

  useEffect(() => {
    const dispose = effect(effectFn)
    addCleanup(dispose)

    return dispose
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps
}

/**
 * Hook for logging signal changes in development
 */
export function useSignalLogger<T>(signalInstance: Signal<T>, name: string) {
  useSignalEffect(() => {
    if (import.meta.env.DEV) {
      console.log(`[Signal ${name}]:`, signalInstance.value)
    }
  })
}

/**
 * Hook for creating a signal that syncs with a prop
 */
export function usePropSignal<T>(prop: T): Signal<T> {
  const signalRef = useRef<Signal<T> | null>(null)

  if (!signalRef.current) {
    signalRef.current = signal(prop)
  }

  // Update signal when prop changes
  useEffect(() => {
    if (signalRef.current) {
      signalRef.current.value = prop
    }
  }, [prop])

  return signalRef.current
}

/**
 * Hook for creating a signal with localStorage persistence
 */
export function usePersistedSignal<T>(
  key: string,
  defaultValue: T,
  serializer: {
    serialize: (value: T) => string
    deserialize: (value: string) => T
  } = {
    serialize: JSON.stringify,
    deserialize: JSON.parse
  }
): Signal<T> {
  const signalRef = useRef<Signal<T> | null>(null)
  const { addCleanup } = useSignalCleanup()

  if (!signalRef.current) {
    // Load initial value from localStorage
    let initialValue = defaultValue
    try {
      const stored = localStorage.getItem(key)
      if (stored !== null) {
        initialValue = serializer.deserialize(stored)
      }
    } catch (error) {
      console.warn(`Failed to load persisted signal "${key}":`, error)
    }

    signalRef.current = signal(initialValue)

    // Set up persistence effect
    const dispose = effect(() => {
      try {
        if (signalRef.current) {
          localStorage.setItem(key, serializer.serialize(signalRef.current.value))
        }
      } catch (error) {
        console.warn(`Failed to persist signal "${key}":`, error)
      }
    })

    // Clean up on unmount
    addCleanup(dispose)
  }

  return signalRef.current
}

/**
 * Hook for debouncing signal updates
 */
export function useDebouncedSignal<T>(sourceSignal: Signal<T>, delay: number): Signal<T> {
  const debouncedSignalRef = useRef<Signal<T> | null>(null)
  const timeoutRef = useRef<number | null>(null)

  if (!debouncedSignalRef.current) {
    debouncedSignalRef.current = signal(sourceSignal.value)
  }

  useSignalEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = window.setTimeout(() => {
      if (debouncedSignalRef.current) {
        debouncedSignalRef.current.value = sourceSignal.value
      }
    }, delay)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  })

  return debouncedSignalRef.current
}

/**
 * Hook for creating computed signals with dependencies
 */
export function useComputedSignal<T>(computeFn: () => T, deps?: unknown[]): Signal<T> {
  const computedRef = useRef<Signal<T> | null>(null)

  useEffect(() => {
    computedRef.current = computed(computeFn)

    return () => {
      // Computed signals are automatically disposed when no longer referenced
    }
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps

  // Return a stable reference with fallback
  return computedRef.current || signal(computeFn())
}