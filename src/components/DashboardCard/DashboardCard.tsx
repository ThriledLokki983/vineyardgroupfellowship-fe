import type { ReactNode } from 'react';
import styles from './DashboardCard.module.scss';

export interface DashboardCardProps {
  title: string;
  icon: ReactNode;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'default' | 'accent';
  illustration?: ReactNode;
}

export default function DashboardCard({
  title,
  icon,
  message,
  actionLabel,
  onAction,
  variant = 'default',
  illustration,
}: DashboardCardProps) {
  return (
    <div className={`${styles.dashboardCard} ${styles[variant]}`}>
      {illustration && (
        <div className={styles.illustration}>{illustration}</div>
      )}

      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.icon}>{icon}</div>
          <h3 className={styles.title}>{title}</h3>
        </div>

        <p className={styles.message}>{message}</p>

        {actionLabel && onAction && (
          <button className={styles.action} onClick={onAction}>
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
