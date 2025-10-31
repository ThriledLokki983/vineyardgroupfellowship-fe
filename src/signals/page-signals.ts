/**
 * Page-Level Signals
 *
 * Centralized state management for page-level UI states including:
 * - HomePage
 * - OnboardingRouter
 * - SettingsPage
 */

import { signal } from '@preact/signals-react';
import { createToggleSignal } from './signal-utils';

// ============================================================================
// HomePage State
// ============================================================================

export const homePage = {
  // Whether the app is checking for existing authentication session
  isCheckingAuth: createToggleSignal(true),

  // Actions
  finishAuthCheck: () => {
    homePage.isCheckingAuth.setFalse();
  },

  resetState: () => {
    homePage.isCheckingAuth.setTrue();
  }
};

// ============================================================================
// OnboardingRouter State
// ============================================================================

export const onboardingRouter = {
  // Whether the onboarding router is loading user data
  loading: createToggleSignal(true),

  // Actions
  finishLoading: () => {
    onboardingRouter.loading.setFalse();
  },

  resetState: () => {
    onboardingRouter.loading.setTrue();
  }
};

// ============================================================================
// SettingsPage State
// ============================================================================

export type SettingsTab = 'account' | 'privacy' | 'notifications' | 'preferences' | 'appearance' | 'danger';

export const settingsPage = {
  // Active settings tab
  activeTab: signal<SettingsTab>('account'),

  // Delete account confirmation dialog state
  showDeleteConfirm: createToggleSignal(false),

  // Actions
  setActiveTab: (tab: SettingsTab) => {
    settingsPage.activeTab.value = tab;
  },

  resetState: () => {
    settingsPage.activeTab.value = 'account';
    settingsPage.showDeleteConfirm.setFalse();
  }
};
