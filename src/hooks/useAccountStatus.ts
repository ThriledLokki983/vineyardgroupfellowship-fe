/**
 * Account Status Hook
 * Provides utilities to check user account status from profiles/me data
 */

import { useAuthContext } from '../contexts/Auth/useAuthContext';
import type { AccountStatus } from '../configs/hooks-interfaces';

interface AccountStatusHook {
  accountStatus: AccountStatus | null;
  isEmailVerified: boolean;
  isProfileComplete: boolean;
  isOnboardingComplete: boolean;
  needsOnboarding: boolean;
  lastUpdated: string | null;
  currentOnboardingStep: string | null;
}

/**
 * Hook to access and check user account status
 * Uses the account_status field from profiles/me API response
 * Includes backward compatibility with legacy fields
 */
export const useAccountStatus = (): AccountStatusHook => {
  const { user } = useAuthContext();

  const accountStatus = user?.account_status || null;

  const isOnboardingComplete =
    user?.onboarding?.completed === true ||
    accountStatus?.onboarding_complete === true ||
    (user?.onboarding_completed_at !== null && user?.onboarding_step === null) ||
    user?.onboarded === true;

  const currentOnboardingStep =
    user?.onboarding?.current_step ||
    accountStatus?.current_onboarding_step ||
    user?.onboarding_step ||
    null;

  return {
    accountStatus,
    isEmailVerified: accountStatus?.email_verified ?? user?.email_verified ?? false,
    isProfileComplete: accountStatus?.profile_complete ?? false,
    isOnboardingComplete,
    needsOnboarding: !isOnboardingComplete,
    lastUpdated: accountStatus?.last_updated || null,
    currentOnboardingStep,
  };
};