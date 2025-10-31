import { useSignals } from '@preact/signals-react/runtime'
import { TextField, Input, FieldError } from 'react-aria-components'
import { createFormSignal } from 'signals/form-signals'
import type { FieldConfig, FieldValue } from '../types'
import styles from '../ConfigurableForm.module.scss'

interface TextInputFieldProps {
  field: FieldConfig
  value: FieldValue
  handleInputChange: (fieldName: string, newValue: FieldValue) => void
  formSignal: ReturnType<typeof createFormSignal>
  renderPasswordStrengthMeter: (password: string) => React.ReactElement
}

export default function TextInputField({ field, value, handleInputChange, formSignal, renderPasswordStrengthMeter }: TextInputFieldProps) {
  useSignals()

  return (
    <TextField
      key={field.name}
      className={styles.formField}
      type={field.type}
      isRequired={field.isRequired}
      isInvalid={!!formSignal.errors.value[field.name]}
      aria-labelledby={field.label}
    >
      <Input
        value={value as string}
        aria-labelledby={field.label}
        onChange={(e) => {
          const newValue = e.target.value
          handleInputChange(field.name, newValue)

          if (formSignal.errors.value[field.name]) {
            formSignal.clearFieldError(field.name)
          }

          if (field.type === 'password' && field.showValidationFeedback) {
            if (!formSignal.shouldShowInstructions(field.name) && newValue.length > 0) {
              formSignal.toggleFieldInstructions(field.name)
            }
          }
        }}
        onFocus={() => {
          if (field.type === 'password' && field.showValidationFeedback && (value as string).length > 0) {
            formSignal.toggleFieldInstructions(field.name)
          }
        }}
        placeholder={field.placeholder}
      />
      <FieldError>
        {formSignal.errors.value[field.name]}
      </FieldError>

      {field.type === 'password' &&
       field.showValidationFeedback &&
       formSignal.shouldShowInstructions(field.name) &&
       renderPasswordStrengthMeter(value as string)}
    </TextField>
  )
}
