/**
 * PageLoader Component
 * Loading fallback for lazy-loaded routes
 */

import React from 'react';
import styles from './PageLoader.module.scss';

export const PageLoader: React.FC = () => {
  return (
    <div className={styles.pageLoader}>
      <div className={styles.spinner}>
        <div className={styles.spinnerCircle}></div>
      </div>
      <p className={styles.loadingText}>Loading...</p>
    </div>
  );
};
