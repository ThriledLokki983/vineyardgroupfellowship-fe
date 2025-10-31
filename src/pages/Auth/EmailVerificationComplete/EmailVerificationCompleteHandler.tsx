import { useEffect, useRef } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../../contexts/Auth/useAuthContext';
import { api } from '../../../services/api';
import type { TokenExchangeResponse } from '../../../services/api';
import type { User } from '../../../configs/hooks-interfaces';
import { emailVerificationCompletePage } from '../../../signals/auth-signals';
import { WelcomeScreen } from '../../../components/WelcomeScreen';
import Layout from '../../../components/Layout/Layout';
import styles from './EmailVerificationCompleteHandler.module.scss';

export const EmailVerificationCompleteHandler = () => {
  useSignals(); // Subscribe to signal changes
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAccessToken, setUser } = useAuthContext();

  // Simple duplicate request prevention - bcos of StrictMode double-invoke and if I allow that
  // The page will try to exchange the token twice and fail the second time
  // And this is not what we want for a better UX
  const hasExchangedRef = useRef(false);
  const exchangeToken = searchParams.get('exchange_token');

  useEffect(() => {
    if (!exchangeToken) {
      emailVerificationCompletePage.setError(
        'No verification token found. Please click the verification link from your email.',
        'Missing exchange_token parameter in URL'
      );
      return;
    }

    // Skip if already processed (prevents StrictMode double-invoke)
    if (hasExchangedRef.current) {
      return;
    }

    // Set flag IMMEDIATELY before async operation
    hasExchangedRef.current = true;

    const performTokenExchange = async () => {
      try {
        emailVerificationCompletePage.setLoading();

        // Exchange the token for JWT tokens
        const response: TokenExchangeResponse = await api.exchangeToken(exchangeToken);
        setAccessToken(response.access_token);

        // Fetch user profile to complete authentication
        const userProfile = await api.get<User>('/profiles/me/');
        setUser(userProfile);

        emailVerificationCompletePage.setSuccess();

        // Determine if this is a first login
        const isFirstLogin = response.first_login || false;

        // Show welcome screen for 2 seconds, then redirect
        setTimeout(() => {
          navigate(`/dashboard?welcome=true&first_login=${isFirstLogin}`, { replace: true });
        }, 2000);

      } catch (error: unknown) {
        console.error('Token exchange failed:', error);

        // Reset flag on error to allow retry
        hasExchangedRef.current = false;

        let errorMessage = 'An unexpected error occurred. Please try again.';
        let errorDetails = '';

        if (error && typeof error === 'object') {
          // Handle ApiError instances (from our api.ts)
          if ('message' in error && typeof error.message === 'string') {
            // Extract detailed error information
            if ('errors' in error && error.errors) {
              const apiError = error as { message: string; errors: Record<string, string[]>; status?: number };

              // Look for specific error types
              if (apiError.errors.exchange_token) {
                errorMessage = apiError.errors.exchange_token[0];
              } else if (apiError.errors.non_field_errors) {
                errorMessage = apiError.errors.non_field_errors[0];
              } else {
                // Get first error from any field
                const firstErrorField = Object.keys(apiError.errors)[0];
                if (firstErrorField && apiError.errors[firstErrorField][0]) {
                  errorMessage = apiError.errors[firstErrorField][0];
                }
              }

              // Set detailed error info for debugging
              errorDetails = `Error Code: ${apiError.status || 'Unknown'}\nDetails: ${JSON.stringify(apiError.errors, null, 2)}`;
            } else if ('status' in error) {
              const statusError = error as { message: string; status: number };

              // Handle specific status codes with user-friendly messages
              switch (statusError.status) {
                case 400:
                  errorMessage = 'Invalid verification token. Please try clicking the verification link from your email again.';
                  break;
                case 404:
                  errorMessage = 'Verification token not found. The link may have expired or been used already.';
                  break;
                case 429:
                  errorMessage = 'Too many verification attempts. Please wait a moment before trying again.';
                  break;
                case 500:
                  errorMessage = 'Server error occurred. Please try again in a few moments or contact support.';
                  break;
                default:
                  errorMessage = statusError.message || errorMessage;
              }

              errorDetails = `Error Code: ${statusError.status}\nMessage: ${statusError.message}`;
            } else {
              errorMessage = (error as { message: string }).message;
            }
          }
        }

        emailVerificationCompletePage.setError(errorMessage, errorDetails);
      }
    };

    performTokenExchange();
  }, [exchangeToken, setAccessToken, setUser, navigate]);

  // Get signal value for rendering
  const state = emailVerificationCompletePage.state.value;

  if (state.status === 'error') {
    return (
      <Layout variant="centered">
        <div className={styles.errorContainer}>
          <div className={styles.errorSection}>
            <div className={styles.errorIcon}>❌</div>

            <h1 className={styles.errorTitle}>Verification Failed</h1>

            <p className={styles.errorMessage}>
              {state.error}
            </p>

            {state.errorDetails && import.meta.env.DEV && (
              <details className={styles.errorDetails}>
                <summary>Technical Details (Development)</summary>
                <pre>{state.errorDetails}</pre>
              </details>
            )}

            <div className={styles.errorActions}>
              <button
                onClick={() => navigate('/login')}
                className={styles.primaryButton}
              >
                Go to Login
              </button>

              <button
                onClick={() => navigate('/auth/verify-error')}
                className={styles.secondaryButton}
              >
                Request New Verification
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Show welcome screen during loading and success
  return <WelcomeScreen isLoading={state.status === 'loading'} />;
};