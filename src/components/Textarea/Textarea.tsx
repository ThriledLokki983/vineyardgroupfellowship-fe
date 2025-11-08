/**
 * Custom Textarea Component
 * Built with React Aria Components for accessible, styleable textareas
 */

import { TextField, TextArea as AriaTextArea, Label, FieldError, Text } from 'react-aria-components';
import type { TextFieldProps as AriaTextFieldProps, TextAreaProps } from 'react-aria-components';
import styles from './Textarea.module.scss';

interface CustomTextareaProps extends Omit<AriaTextFieldProps, 'children'> {
  label?: string;
  description?: string;
  errorMessage?: string;
  placeholder?: string;
  rows?: number;
  textAreaProps?: TextAreaProps;
  helperText?: React.ReactNode;
}

export function Textarea({
  label,
  description,
  errorMessage,
  placeholder,
  rows = 4,
  textAreaProps,
  helperText,
  ...props
}: CustomTextareaProps) {
  return (
    <TextField {...props} className={styles.textField}>
      {label && <Label className={styles.label}>{label}</Label>}
      {description && (
        <Text slot="description" className={styles.description}>
          {description}
        </Text>
      )}
      <AriaTextArea
        {...textAreaProps}
        placeholder={placeholder}
        rows={rows}
        className={styles.textarea}
      />
      {errorMessage && <FieldError className={styles.error}>{errorMessage}</FieldError>}
      {helperText && <div className={styles.helperText}>{helperText}</div>}
    </TextField>
  );
}
