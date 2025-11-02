import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Icon } from 'components'
import { useLogout } from 'hooks/useAuth'
import type { ProfileDropdownProps } from 'types'
import styles from './ProfileDropdown.module.scss'

export default function ProfileDropdown({ user, onClose }: ProfileDropdownProps) {
  const navigate = useNavigate()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { mutate: logout } = useLogout()

  // Support both new and legacy user_purpose values
  const userPurpose = user.user_purpose as 'group_member' | 'group_leader' | 'seeking_recovery' | 'providing_support' | undefined

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    // Close on Escape key
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  const handleProfileClick = () => {
    navigate('/profile')
    onClose()
  }

  const handleSettingsClick = () => {
    navigate('/settings')
    onClose()
  }

  const handleBackgroundClick = () => {
    navigate('/profile/supporter-background')
    onClose()
  }

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        navigate('/login')
        onClose()
      }
    })
  }

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <div className={styles.userInfo}>
        <div className={styles.userAvatar}>
          {user.photo_url || user.photo_thumbnail_url ? (
            <img
              src={(user.photo_thumbnail_url || user.photo_url) as string}
              alt="Profile"
              className={styles.avatarImage}
            />
          ) : (
            user.display_name?.[0] || user.username?.[0] || user.email?.[0] || 'U'
          )}
        </div>
        <div className={styles.userDetails}>
          <p className={styles.userName}>{user.display_name || user.username}</p>
          <p className={styles.userEmail}>{user.email}</p>
        </div>
      </div>

      <div className={styles.divider} />

      <nav className={styles.menu}>
        <button className={styles.menuItem} onClick={handleProfileClick}>
          <Icon name="PersonOutlineIcon" className={styles.menuIcon} width={20} height={20} />
          Profile
        </button>

        {/* Show Background link only for supporters */}
        {(userPurpose === 'group_leader' || userPurpose === 'providing_support') && (
          <button className={styles.menuItem} onClick={handleBackgroundClick}>
            <Icon name="PencilIcon" className={styles.menuIcon} width={20} height={20} />
            Background
          </button>
        )}

        <button className={styles.menuItem} onClick={handleSettingsClick}>
          <Icon name="SettingsIcon" className={styles.menuIcon} width={20} height={20} />
          Settings
        </button>
      </nav>

      <div className={styles.divider} />

      <div className={styles.logoutSection}>
        <Button
          variant="tertiary"
          onPress={handleLogout}
          className={styles.logoutButton}
        >
          <Icon name="ArrowLeftIcon" className={styles.menuIcon} width={20} height={20} />
          Logout
        </Button>
      </div>
    </div>
  )
}
