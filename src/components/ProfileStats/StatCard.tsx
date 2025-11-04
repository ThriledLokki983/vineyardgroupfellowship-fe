/**
 * StatCard - Reusable component for displaying metrics
 */

import Icon from '../Icon';
import type { IconName } from '../../types';
import styles from './StatCard.module.scss';

interface StatCardProps {
  icon: IconName;
  value: string | number;
  label: string;
  sublabel?: string;
  variant?: 'default' | 'accent';
}

export default function StatCard({
  icon,
  value,
  label,
  sublabel,
  variant = 'default'
}: StatCardProps) {
  return (
    <div className={`${styles.statCard} ${styles[variant]}`}>
      <div className={styles.statIcon}>
        <Icon name={icon} width={24} height={24} aria-hidden="true" />
      </div>
      <div className={styles.statContent}>
        <div className={styles.statValue}>{value}</div>
        <div className={styles.statLabel}>{label}</div>
        {sublabel && <div className={styles.statSublabel}>{sublabel}</div>}
      </div>
    </div>
  );
}
