import { Navigate } from 'react-router-dom'
import { useUserPermissions } from 'hooks/useUserPermissions'

interface SupporterRouteProps {
  children: React.ReactNode
  fallbackPath?: string
}

/**
 * Route protection component for supporter-only pages
 * Redirects non-supporters to fallback path or dashboard
 */
export const SupporterRoute = ({ children, fallbackPath = '/dashboard' }: SupporterRouteProps) => {
  const { canAccessSupporterFeatures } = useUserPermissions()

  if (!canAccessSupporterFeatures) {
    return <Navigate to={fallbackPath} replace />
  }

  return <>{children}</>
}

interface SeekerRouteProps {
  children: React.ReactNode
  fallbackPath?: string
}

/**
 * Route protection component for seeker-only pages
 * Redirects non-seekers to fallback path or dashboard
 */
export const SeekerRoute = ({ children, fallbackPath = '/dashboard' }: SeekerRouteProps) => {
  const { isRecoverySeeker } = useUserPermissions()

  if (!isRecoverySeeker) {
    return <Navigate to={fallbackPath} replace />
  }

  return <>{children}</>
}

interface PurposeRouteProps {
  children: React.ReactNode
  requiredPurpose: 'group_member' | 'group_leader' | 'seeking_recovery' | 'providing_support' // Support legacy
  fallbackPath?: string
}

/**
 * Generic route protection component for specific user purposes
 */
export const PurposeRoute = ({
  children,
  requiredPurpose,
  fallbackPath = '/dashboard'
}: PurposeRouteProps) => {
  const { userPurpose } = useUserPermissions()

  // Support both new and legacy values
  const purposeMatches =
    (requiredPurpose === 'group_member' && (userPurpose === 'group_member' || userPurpose === 'seeking_recovery')) ||
    (requiredPurpose === 'seeking_recovery' && (userPurpose === 'group_member' || userPurpose === 'seeking_recovery')) ||
    (requiredPurpose === 'group_leader' && (userPurpose === 'group_leader' || userPurpose === 'providing_support')) ||
    (requiredPurpose === 'providing_support' && (userPurpose === 'group_leader' || userPurpose === 'providing_support'))

  if (!purposeMatches) {
    return <Navigate to={fallbackPath} replace />
  }

  return <>{children}</>
}

interface ConditionalComponentProps {
  showFor: 'group_member' | 'group_leader' | 'seeking_recovery' | 'providing_support' | 'both' // Support legacy
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * Conditionally render components based on user purpose
 * Useful for showing different UI elements to different user types
 */
export const ConditionalComponent = ({
  showFor,
  children,
  fallback = null
}: ConditionalComponentProps) => {
  const { userPurpose } = useUserPermissions()

  if (showFor === 'both') {
    return <>{children}</>
  }

  // Support both new and legacy values
  const shouldShow =
    (showFor === 'group_member' && (userPurpose === 'group_member' || userPurpose === 'seeking_recovery')) ||
    (showFor === 'seeking_recovery' && (userPurpose === 'group_member' || userPurpose === 'seeking_recovery')) ||
    (showFor === 'group_leader' && (userPurpose === 'group_leader' || userPurpose === 'providing_support')) ||
    (showFor === 'providing_support' && (userPurpose === 'group_leader' || userPurpose === 'providing_support'))

  if (shouldShow) {
    return <>{children}</>
  }

  return <>{fallback}</>
}