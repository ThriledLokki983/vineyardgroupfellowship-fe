import styles from './ButtonSet.module.scss';
import type { ReactNode } from 'react';

export interface ButtonSetProps {
  children: ReactNode;
  align?: 'left' | 'center' | 'right' | 'space-between';
  className?: string;
}

/**
 * ButtonSet - Container for grouping multiple buttons
 * Provides consistent spacing and alignment for button groups
 */
export const ButtonSet = ({
  children,
  align = 'left',
  className = ''
}: ButtonSetProps) => {
  const classes = [
    styles.buttonSet,
    styles[align],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {children}
    </div>
  );
};
