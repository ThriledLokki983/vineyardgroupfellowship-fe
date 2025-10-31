/**
 * Email Verification Error Page
 * Handles cases where email verification fails or email is already verified
 */

import { useEffect } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../../../services/api';
import { RESEND_VERIFICATION_URL } from '../../../configs/api-endpoints';
import { emailVerifyErrorPage } from '../../../signals/auth-signals';
import Layout from '../../../components/Layout/Layout';
import styles from './EmailVerifyErrorPage.module.scss';

export default function EmailVerifyErrorPage() {
  useSignals(); // Subscribe to signal changes
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const reason = searchParams.get('reason');

  // Parse the error reason
  let errorMessage = 'Email verification failed';
  let isAlreadyVerified = false;

  if (reason) {
    try {
      // Decode the URL-encoded reason
      const decodedReason = decodeURIComponent(reason);

      if (decodedReason.includes('already verified')) {
        errorMessage = 'Your email is already verified';
        isAlreadyVerified = true;
      } else {
        errorMessage = 'Email verification failed';
      }
    } catch (error) {
      console.error('Failed to parse error reason:', error);
    }
  }

  // Handle resending verification email
  const handleResendVerification = async (e: React.FormEvent) => {
    e.preventDefault();

    const email = emailVerifyErrorPage.email.value;

    if (!email.trim()) {
      emailVerifyErrorPage.setResendStatus('error', 'Please enter your email address');
      return;
    }

    emailVerifyErrorPage.isResending.setTrue();
    emailVerifyErrorPage.setResendStatus('idle');

    try {
      await api.post(RESEND_VERIFICATION_URL, { email: email.trim() });

      emailVerifyErrorPage.setResendStatus('success', 'Verification email sent! Please check your inbox and spam folder.');

      // Hide the form after successful send
      setTimeout(() => {
        emailVerifyErrorPage.showResendForm.setFalse();
        emailVerifyErrorPage.setResendStatus('idle');
      }, 3000);

    } catch (error: unknown) {
      console.error('Failed to resend verification email:', error);

      let errorMessage = 'Failed to send verification email. Please try again.';
      if (error && typeof error === 'object' && 'errors' in error) {
        const apiError = error as { errors?: { email?: string[] } };
        if (apiError.errors?.email) {
          errorMessage = apiError.errors.email[0];
        }
      } else if (error && typeof error === 'object' && 'message' in error) {
        const messageError = error as { message: string };
        errorMessage = messageError.message;
      }
      emailVerifyErrorPage.setResendStatus('error', errorMessage);
    } finally {
      emailVerifyErrorPage.isResending.setFalse();
    }
  };

  // Get signal values for rendering
  const showResendForm = emailVerifyErrorPage.showResendForm.value.value;
  const email = emailVerifyErrorPage.email.value;
  const isResending = emailVerifyErrorPage.isResending.value.value;
  const resendStatus = emailVerifyErrorPage.resendStatus.value;
  const resendMessage = emailVerifyErrorPage.resendMessage.value;

  // Auto-redirect to login after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login', {
        state: {
          message: isAlreadyVerified
            ? 'Your email is already verified. Please log in.'
            : 'Please try the verification process again.'
        }
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate, isAlreadyVerified]);

  return (
    <Layout variant="centered">
      <div className={styles.container}>
        <div className={styles.errorSection}>
          <div className={styles.icon}>
            {isAlreadyVerified ? '✅' : '❌'}
          </div>

          <h1 className={styles.title}>
            {isAlreadyVerified ? 'Already Verified' : 'Verification Failed'}
          </h1>

          <p className={styles.message}>
            {errorMessage}
          </p>

          {isAlreadyVerified ? (
            <p className={styles.subtitle}>
              Your email has been verified previously. You can now log in to your account.
            </p>
          ) : (
            <p className={styles.subtitle}>
              The verification link may be invalid or expired. Please try requesting a new verification email.
            </p>
          )}

          {/* Resend verification form */}
          {!isAlreadyVerified && !showResendForm && (
            <div className={styles.actions}>
              <button
                className={styles.resendButton}
                onClick={() => emailVerifyErrorPage.showResendForm.setTrue()}
              >
                Resend Verification Email
              </button>
            </div>
          )}

          {/* Resend form */}
          {showResendForm && (
            <div className={styles.resendForm}>
              <form onSubmit={handleResendVerification}>
                <div className={styles.inputGroup}>
                  <label htmlFor="email" className={styles.label}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => emailVerifyErrorPage.setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className={styles.input}
                    required
                    disabled={isResending}
                  />
                </div>

                {resendStatus === 'success' && (
                  <div className={styles.successMessage}>
                    ✅ {resendMessage}
                  </div>
                )}

                {resendStatus === 'error' && (
                  <div className={styles.errorMessage}>
                    ❌ {resendMessage}
                  </div>
                )}

                <div className={styles.formActions}>
                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={isResending || !email.trim()}
                  >
                    {isResending ? 'Sending...' : 'Send Verification Email'}
                  </button>

                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={() => {
                      emailVerifyErrorPage.showResendForm.setFalse();
                      emailVerifyErrorPage.resetForm();
                    }}
                    disabled={isResending}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <p className={styles.redirect}>
            Redirecting to login in 5 seconds...
          </p>

          <button
            className={styles.button}
            onClick={() => navigate('/login')}
          >
            Go to Login Now
          </button>
        </div>
      </div>
    </Layout>
  );
}