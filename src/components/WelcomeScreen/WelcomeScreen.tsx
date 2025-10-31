import React from 'react';
import styles from './WelcomeScreen.module.scss';

interface WelcomeScreenProps {
  isLoading?: boolean;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ isLoading = false }) => {
  return (
    <div className={styles.welcomeScreen}>
      <div className={styles.container}>
        <div className={styles.content}>
          {isLoading ? (
            <>
              <div className={styles.spinner}>
                <div className={styles.spinnerRing}></div>
              </div>
              <h1 className={styles.title}>Verifying your email...</h1>
              <p className={styles.subtitle}>
                Just a moment while we confirm your account
              </p>
            </>
          ) : (
            <>
              <div className={styles.checkmarkContainer}>
                <div className={styles.checkmark}>
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={styles.checkmarkIcon}
                  >
                    <circle
                      cx="32"
                      cy="32"
                      r="30"
                      stroke="var(--brand-primary)"
                      strokeWidth="4"
                      fill="none"
                      className={styles.checkmarkCircle}
                    />
                    <path
                      d="M20 32l8 8 16-16"
                      stroke="var(--brand-primary)"
                      strokeWidth="4"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={styles.checkmarkPath}
                    />
                  </svg>
                </div>
              </div>
              <h1 className={styles.title}>Welcome to Vineyard Group Fellowship!</h1>
              <p className={styles.subtitle}>
                Your email has been verified successfully
              </p>
              <p className={styles.message}>
                Let's get started with your healing journey
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};