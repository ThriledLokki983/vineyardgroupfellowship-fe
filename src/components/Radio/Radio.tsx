import { Radio as AriaRadio, type RadioProps as AriaRadioProps } from 'react-aria-components';
import styles from './Radio.module.scss';

export interface RadioProps extends Omit<AriaRadioProps, 'children'> {
  children: React.ReactNode;
  description?: string;
}

export default function Radio({ children, description, className = '', ...props }: RadioProps) {
  return (
    <AriaRadio
      className={`${styles.radio} ${className}`}
      {...props}
    >
      <div className={styles.radioIndicator}>
        <div className={styles.radioInner} />
      </div>
      <div className={styles.radioContent}>
        <span className={styles.radioLabel}>{children}</span>
        {description && (
          <span className={styles.radioDescription}>{description}</span>
        )}
      </div>
    </AriaRadio>
  );
}