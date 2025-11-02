import type { ReactNode } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import AppLogo from 'assets/auth-logo.png';
import styles from './Layout.module.scss'

interface LayoutProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'centered' | 'fullscreen'
  design?: 'auth' | 'content'
  hideHeader?: boolean
  hideFooter?: boolean
}

export default function Layout({
  children,
  className = '',
  variant = 'default',
  design = 'content',
  hideHeader = false,
  hideFooter = false,
}: LayoutProps) {
  const layoutClasses = [
    styles.layout,
    styles[variant],
    design === 'auth' && styles.authDesign,
    className
  ].filter(Boolean).join(' ')

  if (design === 'auth') {
    return (
      <div className={layoutClasses}>

        <div className={styles.authContainer}>
          <div className={styles.authContent}>
            {!hideHeader ? (
              <div className={styles.authHeader}>
                <Header />
              </div>
            ) : null}
            <main className={styles.main}>
              {children}
            </main>
            {!hideFooter ? (
              <div className={styles.authFooter}>
                <Footer />
              </div>
            ) : null}
          </div>
          <div className={styles.authImage}>
            <img src={AppLogo} alt="Vineyard Group Fellowship" />
            {/* Pure gradient background - no image */}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={layoutClasses}>
      {
        !hideHeader ?
        (<Header />) : null
      }
      <main className={styles.main}>
        {children}
      </main>
      {
        !hideFooter ?
        (<Footer />) : null
      }
    </div>
  )
}