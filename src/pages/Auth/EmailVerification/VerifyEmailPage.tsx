/**
 * Email Verification Page
 * Handles email verification when user clicks link in email
 */

import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../../../configs/api-configs';
import Layout from '../../../components/Layout/Layout';
import styles from './VerifyEmailPage.module.scss';

export default function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Parse uidb64 and token from the pathname
  // URL format: /auth/verify-email/{uidb64}/{token}
  const pathParts = location.pathname.split('/auth/verify-email/')[1]?.split('/').filter(part => part !== ''); // Remove empty parts
  const uidb64 = pathParts?.[0];
  const token = pathParts?.slice(1).join('/'); // Join remaining parts in case token contains slashes

  useEffect(() => {
    // Redirect to backend GET endpoint for email verification
    if (uidb64 && token) {
      // Backend expects GET request to: /auth/verify-email/{uidb64}/{token}/
      // Backend will respond with HTTP 302 redirect to: /auth/verified?exchange_token=abc123
      const backendVerifyUrl = `${API_BASE_URL}/auth/verify-email/${uidb64}/${token}/`;

      // Redirect to backend - this will trigger the GET request and redirect flow
      window.location.href = backendVerifyUrl;
    } else {
      // Invalid URL - missing parameters
      console.error('❌ Invalid verification URL - missing uidb64 or token');
      navigate('/login');
    }
  }, [uidb64, token, navigate]);

  return (
    <Layout variant="centered">
      <div className={styles.container}>
        <div className={styles.verifying}>
          <div className={styles.spinner}></div>
          <h1>Verifying your email...</h1>
          <p>Please wait while we redirect you for email verification.</p>
        </div>
      </div>
    </Layout>
  );
}
