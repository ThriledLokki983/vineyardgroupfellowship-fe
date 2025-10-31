import {
  UNSTABLE_ToastQueue as ToastQueue
} from 'react-aria-components'
import { flushSync } from 'react-dom'

// Define toast content types
export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastContent {
  title: string
  description?: string
  type?: ToastType
}

// Create a global ToastQueue with CSS view transitions
export const toastQueue = new ToastQueue<ToastContent>({
  // Wrap state updates in a CSS view transition for smooth animations
  wrapUpdate(fn) {
    if ('startViewTransition' in document) {
      // TypeScript doesn't have full view transition types yet
      const doc = document as Document & {
        startViewTransition?: (callback: () => void) => void
      }
      if (doc.startViewTransition) {
        doc.startViewTransition(() => {
          flushSync(fn)
        })
      } else {
        fn()
      }
    } else {
      fn()
    }
  }
})

// Helper functions for common toast types
export const toast = {
  success: (title: string, description?: string, timeout = 5000) => {
    return toastQueue.add({ title, description, type: 'success' }, { timeout })
  },
  error: (title: string, description?: string, timeout = 7000) => {
    return toastQueue.add({ title, description, type: 'error' }, { timeout })
  },
  info: (title: string, description?: string, timeout = 5000) => {
    return toastQueue.add({ title, description, type: 'info' }, { timeout })
  },
  warning: (title: string, description?: string, timeout = 6000) => {
    return toastQueue.add({ title, description, type: 'warning' }, { timeout })
  },
  // Custom toast with full options
  custom: (content: ToastContent, options?: { timeout?: number; onClose?: () => void }) => {
    return toastQueue.add(content, options)
  }
}
