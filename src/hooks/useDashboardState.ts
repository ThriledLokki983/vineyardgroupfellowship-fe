import { useMemo } from 'react';
import { useAuthContext } from 'contexts/Auth/useAuthContext';
import { useAccountStatus } from './useAccountStatus';

import {
  USER_PURPOSE_GROUP_LEADER,
  USER_PURPOSE_GROUP_MEMBER,
  USER_PURPOSE_UNKNOWN,
  LOADING_STATE,
} from 'configs/constants';

import type { UserPurposeType } from 'configs/constants';

export type DashboardState =
  | 'first-visit-seeker'          // Seeker, no goals/data, first login
  | 'first-visit-supporter'       // Supporter, no mentees/groups, first login
  | 'active-seeker'               // Seeker with ongoing recovery tracking
  | 'active-supporter'            // Supporter with active mentees/groups
  | 'returning-seeker'            // Seeker returning after absence
  | 'returning-supporter'         // Supporter returning after absence
  | 'onboarding-required'         // User hasn't completed onboarding
  | typeof LOADING_STATE                     // Still loading user data


interface DashboardStateData {
  state: DashboardState
  userPurpose: UserPurposeType
  isFirstVisit: boolean
  isReturning: boolean
  daysSinceLastActivity: number
};

export const useDashboardState = (): DashboardStateData => {
  const { user, isLoading } = useAuthContext();
  const { isOnboardingComplete } = useAccountStatus();

  const dashboardData = useMemo(() => {
    // Helper function to determine user purpose
    const getUserPurpose = (purpose: boolean = false): UserPurposeType => {
      if (user?.leadership_info?.can_lead_group === true) {
        return USER_PURPOSE_GROUP_LEADER;
      }

      // Then check legacy can_lead_groups field
      if (user?.can_lead_groups === true) {
        return USER_PURPOSE_GROUP_LEADER;
      }

      // Finally check user_purpose field
      switch (purpose) {
        case true:
          return USER_PURPOSE_GROUP_LEADER
        case false:
          return USER_PURPOSE_GROUP_MEMBER
        default:
          return USER_PURPOSE_UNKNOWN
      }
    }

    if (isLoading || !user) {
      return {
        state: 'loading' as DashboardState,
        userPurpose: null,
        isFirstVisit: false,
        isReturning: false,
        daysSinceLastActivity: 0
      }
    }

    // Check if onboarding is completed using account_status
    if (!isOnboardingComplete) {
      return {
        state: 'onboarding-required' as DashboardState,
        userPurpose: getUserPurpose(user.leadership_info?.can_lead_group),
        isFirstVisit: false,
        isReturning: false,
        daysSinceLastActivity: 0
      }
    }

    const userPurpose: UserPurposeType = getUserPurpose(user.leadership_info?.can_lead_group)
    // Use available timestamp fields for activity detection
    const lastActivityDate = user.updated_at || user.created_at
    const daysSinceLastActivity = lastActivityDate
      ? Math.floor((Date.now() - new Date(lastActivityDate).getTime()) / (1000 * 60 * 60 * 24))
      : 0

    // For now, determine first visit based on basic profile completion
    // In the future, these will come from API calls or additional user fields
    const hasProfileData = user.bio || user.display_name || user.sobriety_date
    const hasActivityData = user.updated_at !== user.created_at // Profile has been updated since creation

    // These will be determined by future API calls or user fields
    // For now, assume first visit if basic profile is incomplete
    // const hasGoals = false // TODO: Implement goals API
    const hasMentees = false // TODO: Implement mentees API
    const hasGroups = false // TODO: Implement groups API

    // Check for returning user (more than 14 days inactive)
    const isReturning = daysSinceLastActivity >= 14

    // Determine dashboard state based on user purpose
    if (userPurpose === USER_PURPOSE_GROUP_MEMBER) {
      return {
        state: 'active-seeker' as DashboardState,
        userPurpose,
        isFirstVisit: false,
        isReturning: false,
        daysSinceLastActivity
      }
    }

    if (userPurpose === USER_PURPOSE_GROUP_LEADER) {
      // For supporters, prioritize background completion status
      const supporterStatus = user?.supporter_info || {}
      const needsBackgroundSetup = supporterStatus?.background_required && !supporterStatus?.background_completed

      // If background is required but not completed, always show first-visit flow
      if (needsBackgroundSetup) {
        return {
          state: 'first-visit-supporter' as DashboardState,
          userPurpose,
          isFirstVisit: true,
          isReturning: false,
          daysSinceLastActivity
        }
      }

      const isFirstVisit = !hasMentees && !hasGroups && !hasActivityData && !hasProfileData

      if (isFirstVisit) {
        return {
          state: 'first-visit-supporter' as DashboardState,
          userPurpose,
          isFirstVisit: true,
          isReturning: false,
          daysSinceLastActivity
        }
      }

      if (isReturning) {
        return {
          state: 'returning-supporter' as DashboardState,
          userPurpose,
          isFirstVisit: false,
          isReturning: true,
          daysSinceLastActivity
        }
      }

      return {
        state: 'active-supporter' as DashboardState,
        userPurpose,
        isFirstVisit: false,
        isReturning: false,
        daysSinceLastActivity
      }
    }

    // Fallback for unknown user purpose
    return {
      state: 'first-visit-seeker' as DashboardState,
      userPurpose: USER_PURPOSE_UNKNOWN as UserPurposeType,
      isFirstVisit: true,
      isReturning: false,
      daysSinceLastActivity
    }
  }, [user, isOnboardingComplete, isLoading])

  return dashboardData
}