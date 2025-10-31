import { Checkbox as AriaCheckbox, type CheckboxProps as AriaCheckboxProps } from 'react-aria-components';
import styles from './Checkbox.module.scss';

export interface CheckboxProps extends Omit<AriaCheckboxProps, 'children'> {
  children: React.ReactNode;
  description?: string;
}

export default function Checkbox({ children, description, className = '', ...props }: CheckboxProps) {
  return (
    <AriaCheckbox
      className={`${styles.checkbox} ${className}`}
      {...props}
    >
      <div className={styles.checkboxIndicator}>
        <svg viewBox="0 0 18 18" aria-hidden="true">
          <polyline points="1 9 7 14 15 4" />
        </svg>
      </div>
      <div className={styles.checkboxContent}>
        <span className={styles.checkboxLabel}>{children}</span>
        {description && (
          <span className={styles.checkboxDescription}>{description}</span>
        )}
      </div>
    </AriaCheckbox>
  );
}