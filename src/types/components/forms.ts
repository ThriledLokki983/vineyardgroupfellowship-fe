/**
 * Form Component Types
 * Types for ConfigurableForm and field components
 */

// Text Input Field
export interface TextInputFieldProps {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  error?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  onChange?: (value: string) => void;
  onBlur?: () => void;
}

// Checkbox Field
export interface CheckboxFieldProps {
  name: string;
  label: string;
  value?: boolean;
  error?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  onChange?: (checked: boolean) => void;
}

// Checkbox Group
export interface CheckboxGroupProps {
  name: string;
  label: string;
  options: Array<{
    value: string;
    label: string;
  }>;
  value?: string[];
  error?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  onChange?: (values: string[]) => void;
}

// Radio Group
export interface RadioGroupFieldProps {
  name: string;
  label: string;
  options: Array<{
    value: string;
    label: string;
  }>;
  value?: string;
  error?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  onChange?: (value: string) => void;
}

// Form Configuration (for ConfigurableForm README reference)
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'checkbox' | 'radio' | 'select';
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
  };
}

export interface FormConfig {
  fields: FormField[];
  submitText?: string;
  cancelText?: string;
}
