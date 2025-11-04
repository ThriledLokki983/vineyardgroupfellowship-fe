import { useEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import type { PageTransitionProps } from 'types'
// import styles from './PageTransition.module.scss'

export default function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation()
  const navigationType = useNavigationType()
  const firstRenderRef = useRef(true)

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false
      return
    }

    if (navigationType !== 'PUSH') {
      return
    }

    if (!document.startViewTransition) {
      return
    }
  }, [location, navigationType])

  return (
    <div>
      {children}
    </div>
  )
}
