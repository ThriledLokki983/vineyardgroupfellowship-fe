/**
 * Custom Input Component
 * Built with React Aria Components for accessible, styleable text inputs
 */

import { TextField, Input as AriaInput, Label, FieldError, Text } from 'react-aria-components';
import type { TextFieldProps as AriaTextFieldProps, InputProps } from 'react-aria-components';
import styles from './Input.module.scss';

interface CustomInputProps extends Omit<AriaTextFieldProps, 'children'> {
  label?: string;
  description?: string;
  errorMessage?: string;
  placeholder?: string;
  inputProps?: InputProps;
  helperText?: React.ReactNode;
}

export function Input({
  label,
  description,
  errorMessage,
  placeholder,
  inputProps,
  helperText,
  ...props
}: CustomInputProps) {
  return (
    <TextField {...props} className={styles.textField}>
      {label && <Label className={styles.label}>{label}</Label>}
      {description && (
        <Text slot="description" className={styles.description}>
          {description}
        </Text>
      )}
      <AriaInput
        {...inputProps}
        placeholder={placeholder}
        className={styles.input}
      />
      {errorMessage && <FieldError className={styles.error}>{errorMessage}</FieldError>}
      {helperText && <div className={styles.helperText}>{helperText}</div>}
    </TextField>
  );
}
