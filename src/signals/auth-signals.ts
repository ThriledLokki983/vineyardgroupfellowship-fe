/**
 * Auth Pages Signals
 *
 * Centralized state management for authentication pages including:
 * - ForgotPasswordPage
 * - EmailVerificationCompleteHandler
 * - EmailVerifyErrorPage
 */

import { signal } from '@preact/signals-react';
import { createToggleSignal } from './signal-utils';

// ============================================================================
// ForgotPasswordPage State
// ============================================================================

export const forgotPasswordPage = {
  // Whether the reset email has been sent successfully
  isEmailSent: createToggleSignal(false),

  // Actions
  resetState: () => {
    forgotPasswordPage.isEmailSent.setFalse();
  }
};

// ============================================================================
// EmailVerificationCompleteHandler State
// ============================================================================

export type EmailVerificationStatus = 'loading' | 'success' | 'error';

export interface EmailVerificationState {
  status: EmailVerificationStatus;
  error?: string;
  errorDetails?: string;
}

export const emailVerificationCompletePage = {
  // Verification state
  state: signal<EmailVerificationState>({ status: 'loading' }),

  // Actions
  setLoading: () => {
    emailVerificationCompletePage.state.value = { status: 'loading' };
  },

  setSuccess: () => {
    emailVerificationCompletePage.state.value = { status: 'success' };
  },

  setError: (error: string, errorDetails?: string) => {
    emailVerificationCompletePage.state.value = {
      status: 'error',
      error,
      errorDetails
    };
  },

  resetState: () => {
    emailVerificationCompletePage.state.value = { status: 'loading' };
  }
};

// ============================================================================
// EmailVerifyErrorPage State
// ============================================================================

export type ResendStatus = 'idle' | 'success' | 'error';

export const emailVerifyErrorPage = {
  // UI state
  showResendForm: createToggleSignal(false),
  isResending: createToggleSignal(false),

  // Form state
  email: signal<string>(''),
  resendStatus: signal<ResendStatus>('idle'),
  resendMessage: signal<string>(''),

  // Actions
  setEmail: (value: string) => {
    emailVerifyErrorPage.email.value = value;
  },

  setResendStatus: (status: ResendStatus, message: string = '') => {
    emailVerifyErrorPage.resendStatus.value = status;
    emailVerifyErrorPage.resendMessage.value = message;
  },

  resetForm: () => {
    emailVerifyErrorPage.email.value = '';
    emailVerifyErrorPage.resendStatus.value = 'idle';
    emailVerifyErrorPage.resendMessage.value = '';
  },

  resetState: () => {
    emailVerifyErrorPage.showResendForm.setFalse();
    emailVerifyErrorPage.isResending.setFalse();
    emailVerifyErrorPage.resetForm();
  }
};
