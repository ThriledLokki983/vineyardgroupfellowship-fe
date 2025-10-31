import { useEffect, useRef, type ReactNode } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import styles from './PageTransition.module.scss'

interface PageTransitionProps {
  children: ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation()
  const navigationType = useNavigationType()
  const firstRenderRef = useRef(true)

  useEffect(() => {
    // Skip transition on first render (page load/refresh)
    if (firstRenderRef.current) {
      firstRenderRef.current = false
      return
    }

    // Skip transition for POP navigation (browser back/forward)
    // Only animate on PUSH (user clicking links)
    if (navigationType !== 'PUSH') {
      return
    }

    // Check if browser supports View Transitions API
    if (!document.startViewTransition) {
      return
    }

    // The view transition will be handled by CSS
    // We just need to trigger it when location changes
  }, [location, navigationType])

  return (
    <div className={styles.pageTransition}>
      {children}
    </div>
  )
}
