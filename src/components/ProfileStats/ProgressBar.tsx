/**
 * ProgressBar - Visual progress indicator
 */

import styles from './ProgressBar.module.scss';

interface ProgressBarProps {
  percentage: number;
  variant?: 'default' | 'accent';
  showLabel?: boolean;
}

export default function ProgressBar({
  percentage,
  variant = 'default',
  showLabel = true
}: ProgressBarProps) {
  const clampedPercentage = Math.min(100, Math.max(0, percentage));

  return (
    <div className={styles.progressContainer}>
      <div className={`${styles.progressBar} ${styles[variant]}`}>
        <div
          className={styles.progressFill}
          style={{ width: `${clampedPercentage}%` }}
          role="progressbar"
          aria-valuenow={clampedPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {showLabel && (
        <div className={styles.progressLabel}>
          {clampedPercentage}%
        </div>
      )}
    </div>
  );
}
