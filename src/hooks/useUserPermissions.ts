/**
 * User purpose permission hooks
 * Provides permission checks based on user purpose for feature access
 */

import { useAuthContext } from '../contexts/Auth/useAuthContext'

export const useUserPermissions = () => {
  const { user } = useAuthContext()

  const userPurpose = user?.user_purpose

  return {
    // Basic user purpose checks
    isRecoverySeeker: userPurpose === 'seeking_recovery',
    isRecoverySupporter: userPurpose === 'providing_support',

    // Feature permissions
    canLeadGroups: user?.can_lead_groups || false,
    canAccessSupporterFeatures: userPurpose === 'providing_support',
    canViewSupporterOnboarding: userPurpose === 'providing_support',
    canCreateGroups: userPurpose === 'providing_support' && (user?.can_lead_groups || false),
    canModerateGroups: userPurpose === 'providing_support' && (user?.can_lead_groups || false),

    // UI permissions
    shouldShowSupporterDashboard: userPurpose === 'providing_support',
    shouldShowSeekerDashboard: userPurpose === 'seeking_recovery',
    shouldShowGroupLeadershipTools: userPurpose === 'providing_support' && (user?.can_lead_groups || false),

    // Raw user data
    user,
    userPurpose
  }
}

// Hook for checking if user has specific purpose
export const useHasUserPurpose = (requiredPurpose: 'seeking_recovery' | 'providing_support') => {
  const { userPurpose } = useUserPermissions()
  return userPurpose === requiredPurpose
}

// Hook for checking if any of multiple purposes match
export const useHasAnyUserPurpose = (purposes: ('seeking_recovery' | 'providing_support')[]) => {
  const { userPurpose } = useUserPermissions()
  return userPurpose ? purposes.includes(userPurpose) : false
}