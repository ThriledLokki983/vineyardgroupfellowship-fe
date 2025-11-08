/**
 * Custom RadioGroup Component
 * Built with React Aria Components for accessible, styleable radio buttons
 */

import { RadioGroup as AriaRadioGroup, Radio as AriaRadio, Label, FieldError, Text } from 'react-aria-components';
import type { RadioGroupProps as AriaRadioGroupProps, RadioProps } from 'react-aria-components';
import styles from './RadioGroup.module.scss';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface CustomRadioGroupProps extends Omit<AriaRadioGroupProps, 'children'> {
  label?: string;
  description?: string;
  errorMessage?: string;
  options: RadioOption[];
  orientation?: 'horizontal' | 'vertical';
}

export function RadioGroup({
  label,
  description,
  errorMessage,
  options,
  orientation = 'vertical',
  ...props
}: CustomRadioGroupProps) {
  return (
    <AriaRadioGroup {...props} className={styles.radioGroup}>
      {label && <Label className={styles.label}>{label}</Label>}
      {description && (
        <Text slot="description" className={styles.description}>
          {description}
        </Text>
      )}
      <div className={`${styles.options} ${styles[orientation]}`}>
        {options.map((option) => (
          <Radio key={option.value} value={option.value} isDisabled={option.disabled}>
            <span className={styles.radioTitle}>{option.label}</span>
            {option.description && (
              <span className={styles.radioDescription}>{option.description}</span>
            )}
          </Radio>
        ))}
      </div>
      {errorMessage && <FieldError className={styles.error}>{errorMessage}</FieldError>}
    </AriaRadioGroup>
  );
}

// Export Radio component for custom usage
export function Radio({ children, ...props }: RadioProps) {
  return (
    <AriaRadio {...props} className={styles.radio}>
      {({ isSelected }) => (
        <>
          <div className={`${styles.indicator} ${isSelected ? styles.selected : ''}`} />
          <div className={styles.content}>{children as React.ReactNode}</div>
        </>
      )}
    </AriaRadio>
  );
}
