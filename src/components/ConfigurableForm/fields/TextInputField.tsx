import { useState } from 'react'
import { TextField, Input, Label, FieldError } from 'react-aria-components'
import type { FieldConfig, FieldValue } from '../types'
import styles from '../ConfigurableForm.module.scss'

interface TextInputFieldProps {
  field: FieldConfig
  value: FieldValue
  onChange: (value: FieldValue) => void
  onBlur?: () => void
  error?: string
  renderPasswordStrengthMeter: (password: string) => React.ReactElement
}

export default function TextInputField({
  field,
  value,
  onChange,
  onBlur,
  error,
  renderPasswordStrengthMeter
}: TextInputFieldProps) {
  const [showPasswordStrength, setShowPasswordStrength] = useState(false)

  return (
    <TextField
      key={field.name}
      className={styles.formField}
      type={field.type}
      isRequired={field.isRequired}
      isInvalid={!!error}
    >
      <Label>{field.label}</Label>
      <Input
        value={value as string}
        onChange={(e) => {
          const newValue = e.target.value
          onChange(newValue)

          if (field.type === 'password' && field.showValidationFeedback) {
            if (!showPasswordStrength && newValue.length > 0) {
              setShowPasswordStrength(true)
            }
          }
        }}
        onFocus={() => {
          if (field.type === 'password' && field.showValidationFeedback && (value as string).length > 0) {
            setShowPasswordStrength(true)
          }
        }}
        onBlur={onBlur}
        placeholder={field.placeholder}
      />
      {error && <FieldError>{error}</FieldError>}

      {field.type === 'password' &&
       field.showValidationFeedback &&
       showPasswordStrength &&
       renderPasswordStrengthMeter(value as string)}
    </TextField>
  )
}
