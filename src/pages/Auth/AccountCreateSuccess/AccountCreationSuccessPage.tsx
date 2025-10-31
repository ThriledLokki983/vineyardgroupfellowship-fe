import { useNavigate, useLocation } from 'react-router-dom'
import { Text, Link } from 'react-aria-components'
import Layout from '../../../components/Layout/Layout'
import styles from './AccountCreationSuccessPage.module.scss'

export const AccountCreationSuccessPage = () => {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Layout variant="centered">
      <div className={styles.successContainer}>
        {/* Success Icon */}
        <div className={styles.iconWrapper}>
          <div className={styles.successIcon}>
            <svg viewBox="0 0 52 52" className={styles.checkmark}>
              <circle cx="26" cy="26" r="25" fill="none" className={styles.circle} />
              <path fill="none" d="M14 27l7.5 7.5L38 18" className={styles.check} />
            </svg>
          </div>
        	<h1 className={styles.title}>Check Your Email</h1>
        </div>


        {/* Main Message */}

        {/* Two Column Grid */}
        <div className={styles.contentGrid}>
          <div className={styles.messageBox}>
            <div className={styles.emailIconWrapper}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/>
              </svg>
            </div>
            <Text className={styles.primaryMessage}>We've sent a verification link to:</Text>
            <Text className={styles.emailDisplay}>{location.state?.email || 'free.yourself@example.com'}</Text>
            <Text className={styles.secondaryMessage}>Click the link to verify your account and begin your journey.</Text>
          </div>

          <div className={styles.infoBlock}>
            <blockquote className={styles.quote}>
              <Text className={styles.quoteText}>
                "Recovery is not a race. You don't have to feel guilty if it takes you longer than you thought it would."
              </Text>
              <footer className={styles.quoteAuthor}>— Unknown</footer>
            </blockquote>
            <div className={styles.statLine}>
              <span className={styles.statNumber}>85%</span>
              <Text className={styles.statText}>of people who seek help and stay committed achieve lasting recovery</Text>
            </div>
          </div>
        </div>

        {/* Minimal Tips */}
        <div className={styles.tipsBox}>
          <Text className={styles.tipsTitle}>Didn't receive the email?</Text>
          <ul className={styles.tipsList}>
            <li>Check your spam or junk folder</li>
            <li>Verify your email address</li>
            <li>Wait a few minutes for delivery</li>
          </ul>
        </div>

        {/* Action Button */}
        <div className={styles.actions}>
          <Link
            className={styles.loginLink}
            onPress={() => navigate('/login')}
          >
            <svg className={styles.linkIcon} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 3.5L8.9 4.6L14.3 10H3v1.5h11.3l-5.4 5.4 1.1 1.1 7.5-7.5-7.5-7.5z" fill="currentColor"/>
            </svg>
            Go to Sign In
          </Link>

          <Link
            className={styles.secondaryLink}
            onPress={() => navigate('/register')}
          >
            <svg className={styles.linkIcon} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Create a Different Account
          </Link>
        </div>
      </div>
    </Layout>
  );

};

export default AccountCreationSuccessPage;
