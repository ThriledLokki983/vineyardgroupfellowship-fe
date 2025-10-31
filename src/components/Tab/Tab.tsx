import { Tab as AriaTab, type TabProps as AriaTabProps } from 'react-aria-components';
import styles from './Tab.module.scss';

export interface TabProps extends Omit<AriaTabProps, 'children'> {
  children: React.ReactNode;
  stepNumber?: number;
  completed?: boolean;
}

export default function Tab({ children, stepNumber, completed, className = '', ...props }: TabProps) {
  return (
    <AriaTab
      className={`${styles.tab} ${className}`}
      {...props}
    >
      {stepNumber && (
        <span className={styles.stepNumber}>{stepNumber}</span>
      )}
      <span className={styles.tabLabel}>{children}</span>
      {completed && (
        <span className={styles.completedIcon}>✓</span>
      )}
    </AriaTab>
  );
}