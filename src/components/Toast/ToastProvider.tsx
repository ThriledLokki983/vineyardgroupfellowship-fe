import {
  UNSTABLE_Toast as Toast,
  UNSTABLE_ToastContent as ToastContent,
  UNSTABLE_ToastRegion as ToastRegion,
  Button,
  Text
} from 'react-aria-components'
import { toastQueue, type ToastType } from './toastQueue'
import styles from './ToastProvider.module.scss'

// Toast icon components
const ToastIcon = ({ type }: { type?: ToastType }) => {
  switch (type) {
    case 'success':
      return (
        <svg className={styles.icon} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2"/>
          <path d="M6 10l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case 'error':
      return (
        <svg className={styles.icon} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2"/>
          <path d="M7 7l6 6M13 7l-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    case 'warning':
      return (
        <svg className={styles.icon} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 2L2 17h16L10 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
          <path d="M10 8v4M10 14v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    case 'info':
    default:
      return (
        <svg className={styles.icon} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2"/>
          <path d="M10 10v4M10 6v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
  }
}

// ToastProvider component to be added to your app root
export default function ToastProvider() {
  return (
    <ToastRegion queue={toastQueue} className={styles.toastRegion}>
      {({ toast: toastItem }) => (
        <Toast
          toast={toastItem}
          className={`${styles.toast} ${styles[toastItem.content.type || 'info']}`}
          style={{ viewTransitionName: toastItem.key } as React.CSSProperties}
        >
          <div className={styles.toastContent}>
            <ToastIcon type={toastItem.content.type} />
            <ToastContent className={styles.content}>
              <Text slot="title" className={styles.title}>
                {toastItem.content.title}
              </Text>
              {toastItem.content.description && (
                <Text slot="description" className={styles.description}>
                  {toastItem.content.description}
                </Text>
              )}
            </ToastContent>
            <Button slot="close" className={styles.closeButton} aria-label="Dismiss notification">
              <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </Button>
          </div>
        </Toast>
      )}
    </ToastRegion>
  )
}
