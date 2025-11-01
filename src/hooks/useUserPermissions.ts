/**
 * User purpose permission hooks
 * Provides permission checks based on user purpose for feature access
 */

import { useAuthContext } from '../contexts/Auth/useAuthContext'

export const useUserPermissions = () => {
  const { user } = useAuthContext()

  const userPurpose = user?.user_purpose as 'group_member' | 'group_leader' | 'seeking_recovery' | 'providing_support' | undefined

  // Check if user can lead groups - prioritize new structure
  const canLeadGroups = user?.leadership_info?.can_lead_group ?? user?.can_lead_groups ?? false

  return {
    // Basic user purpose checks
    isRecoverySeeker: userPurpose === 'group_member' || userPurpose === 'seeking_recovery', // Support legacy
    isRecoverySupporter: userPurpose === 'group_leader' || userPurpose === 'providing_support', // Support legacy

    // Feature permissions
    canLeadGroups,
    canAccessSupporterFeatures: userPurpose === 'group_leader' || userPurpose === 'providing_support',
    canViewSupporterOnboarding: userPurpose === 'group_leader' || userPurpose === 'providing_support',
    canCreateGroups: (userPurpose === 'group_leader' || userPurpose === 'providing_support') && canLeadGroups,
    canModerateGroups: (userPurpose === 'group_leader' || userPurpose === 'providing_support') && canLeadGroups,

    // UI permissions
    shouldShowSupporterDashboard: userPurpose === 'group_leader' || userPurpose === 'providing_support',
    shouldShowSeekerDashboard: userPurpose === 'group_member' || userPurpose === 'seeking_recovery',
    shouldShowGroupLeadershipTools: (userPurpose === 'group_leader' || userPurpose === 'providing_support') && canLeadGroups,

    // Raw user data
    user,
    userPurpose
  }
}

// Hook for checking if user has specific purpose
export const useHasUserPurpose = (requiredPurpose: 'group_member' | 'group_leader' | 'seeking_recovery' | 'providing_support') => {
  const { userPurpose } = useUserPermissions()
  // Support both new and legacy values
  if (requiredPurpose === 'group_member' || requiredPurpose === 'seeking_recovery') {
    return userPurpose === 'group_member' || userPurpose === 'seeking_recovery'
  }
  if (requiredPurpose === 'group_leader' || requiredPurpose === 'providing_support') {
    return userPurpose === 'group_leader' || userPurpose === 'providing_support'
  }
  return false
}

// Hook for checking if any of multiple purposes match
export const useHasAnyUserPurpose = (purposes: ('group_member' | 'group_leader' | 'seeking_recovery' | 'providing_support')[]) => {
  const { userPurpose } = useUserPermissions()
  if (!userPurpose) return false

  // Check if any purpose matches (supporting both new and legacy)
  return purposes.some(purpose => {
    if ((purpose === 'group_member' || purpose === 'seeking_recovery') &&
        (userPurpose === 'group_member' || userPurpose === 'seeking_recovery')) {
      return true
    }
    if ((purpose === 'group_leader' || purpose === 'providing_support') &&
        (userPurpose === 'group_leader' || userPurpose === 'providing_support')) {
      return true
    }
    return false
  })
}