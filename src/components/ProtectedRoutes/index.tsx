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
  requiredPurpose: 'seeking_recovery' | 'providing_support'
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

  if (userPurpose !== requiredPurpose) {
    return <Navigate to={fallbackPath} replace />
  }

  return <>{children}</>
}

interface ConditionalComponentProps {
  showFor: 'seeking_recovery' | 'providing_support' | 'both'
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

  if (userPurpose === showFor) {
    return <>{children}</>
  }

  return <>{fallback}</>
}