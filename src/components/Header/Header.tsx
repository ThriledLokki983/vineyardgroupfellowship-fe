import { useLocation } from 'react-router-dom'
import { useSignals } from '@preact/signals-react/runtime'
import ViewTransitionLink from '../Layout/ViewTransitionLink.tsx'
import { useIsAuthenticated, useCurrentUser } from 'hooks/useAuth'
import { navigation, header } from 'src/signals'
import { PATH_LOGIN, PATH_REGISTER, PATH_FORGOT_PASSWORD } from 'configs/paths'
import type { HeaderProps } from 'types'
import ProfileDropdown from './ProfileDropdown.tsx'
// import { NotificationBell } from 'src/features/groups/components/NotificationCenter'
import headerLogo from 'assets/header-logo.png';
import styles from './Header.module.scss'

export default function Header({ hideLogin = false, hideRegister = false, logoOnly = false }: HeaderProps = {}) {
  // Subscribe to signals - this makes React re-render when signals change
  useSignals()

  const isAuthenticated = useIsAuthenticated()
  const { data: user } = useCurrentUser()
  const location = useLocation()

  // Now we can use global signals with useSignals() subscription
  // Auto-detect which buttons to hide based on current path
  const shouldHideLogin = hideLogin || location.pathname === PATH_LOGIN
  const shouldHideRegister = hideRegister || location.pathname === PATH_REGISTER

  // Check if we're on an auth page
  const isAuthPage = [PATH_LOGIN, PATH_REGISTER, PATH_FORGOT_PASSWORD].includes(location.pathname)

  const toggleDropdown = () => {
    header.profileDropdownOpen.toggle()
  }

  const closeDropdown = () => {
    header.profileDropdownOpen.setFalse()
  }

  const toggleMobileMenu = () => {
    navigation.mobileMenuOpen.toggle()
  }

  const closeMobileMenu = () => {
    navigation.mobileMenuOpen.setFalse()
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <ViewTransitionLink to="/" className={`${styles.logo} ${logoOnly ? styles.logoOnly : ''}`}>
          <img
            src={headerLogo}
            alt="Vineyard Group Fellowship"
            className={styles.logoImage}
          />
          {/* {!logoOnly && <span className={styles.logoText}>Vineyard Group Fellowship</span>} */}
        </ViewTransitionLink>

        {/* Hide navigation on auth pages or when logoOnly is true */}
        {!logoOnly && !isAuthPage ? (
          <nav className={styles.nav}>
            {isAuthenticated && user ? (
              <>
                {/* Desktop Navigation */}
                <div className={styles.rightNav}>
                  {/* Main Navigation Links */}
                  <div className={styles.navLinks}>
                    <ViewTransitionLink
                      to="/"
                      className={`${styles.navLink} ${location.pathname === '/' ? styles.navLinkActive : ''}`}
                    >
                      Home
                    </ViewTransitionLink>
                    <ViewTransitionLink
                      to="/dashboard"
                      className={`${styles.navLink} ${location.pathname === '/dashboard' ? styles.navLinkActive : ''}`}
                    >
                      Dashboard
                    </ViewTransitionLink>
                    {import.meta.env.DEV ? (
                      <ViewTransitionLink
                        to="/features"
                        className={`${styles.navLink} ${location.pathname === '/features' ? styles.navLinkActive : ''}`}
                      >
                        Features
                      </ViewTransitionLink>
                    ) : ( null )}
                  </div>

                  {/* Notification Bell */}
                  {/* <NotificationBell /> */}

                  {/* Profile Section */}
                  <div className={styles.profileWrapper}>
                    <button
                      className={styles.profileButton}
                      onClick={toggleDropdown}
                      aria-label="User menu"
                      aria-expanded={header.profileDropdownOpen.value.value}
                    >
                      <div className={styles.profileIcon}>
                        {user.photo_url || user.photo_thumbnail_url ? (
                          <img
                            src={(user.photo_thumbnail_url || user.photo_url) as string}
                            alt="Profile"
                            className={styles.profileImage}
                          />
                        ) : (
                          user.display_name?.[0] || user.username?.[0] || user.email?.[0] || 'U'
                        )}
                      </div>
                      <span className={styles.userName}>
                        {user.display_name || user.username}
                      </span>
                    </button>

                    {/* Profile Dropdown */}
                    {header.profileDropdownOpen.value.value ? (
                      <ProfileDropdown user={user} onClose={closeDropdown} />
                    ): ( null )}
                  </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                  className={styles.mobileMenuButton}
                  onClick={toggleMobileMenu}
                  aria-label="Toggle mobile menu"
                  aria-expanded={navigation.mobileMenuOpen.value.value}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>

                {/* Mobile Navigation Menu */}
                {navigation.mobileMenuOpen.value.value ? (
                  <div className={styles.mobileMenu}>
                    <div className={styles.mobileMenuContent}>
                      <ViewTransitionLink
                        to="/"
                        className={`${styles.mobileNavLink} ${location.pathname === '/' ? styles.mobileNavLinkActive : ''}`}
                        onClick={closeMobileMenu}
                      >
                        Home
                      </ViewTransitionLink>
                      <ViewTransitionLink
                        to="/dashboard"
                        className={`${styles.mobileNavLink} ${location.pathname === '/dashboard' ? styles.mobileNavLinkActive : ''}`}
                        onClick={closeMobileMenu}
                      >
                        Dashboard
                      </ViewTransitionLink>
                      {import.meta.env.DEV ? (
                        <ViewTransitionLink
                          to="/features"
                          className={`${styles.mobileNavLink} ${location.pathname === '/features' ? styles.mobileNavLinkActive : ''}`}
                          onClick={closeMobileMenu}
                        >
                          Features
                        </ViewTransitionLink>
                      ) : ( null )}
                      <ViewTransitionLink
                        to="/profile"
                        className={styles.mobileNavLink}
                        onClick={closeMobileMenu}
                      >
                        Profile
                      </ViewTransitionLink>
                      <ViewTransitionLink
                        to="/settings"
                        className={styles.mobileNavLink}
                        onClick={closeMobileMenu}
                      >
                        Settings
                      </ViewTransitionLink>
                      <button
                        className={styles.mobileLogoutButton}
                        onClick={() => {
                          closeMobileMenu()
                          // Add logout logic here
                        }}
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : ( null )}
              </>
            ) : (
              <div className={styles.authButtons}>
                {!shouldHideLogin ? (
                  <ViewTransitionLink
                    to="/login"
                    className={`${styles.authLink} ${styles.loginLink}`}
                  >
                    Login
                  </ViewTransitionLink>
                ) : ( null )}
                {!shouldHideRegister ? (
                  <ViewTransitionLink
                    to="/register"
                    className={`${styles.authLink} ${styles.registerLink}`}
                  >
                    Register
                  </ViewTransitionLink>
                ) : ( null )}
              </div>
            )}
          </nav>
        ) : ( null )}
      </div>
    </header>
  )
}
