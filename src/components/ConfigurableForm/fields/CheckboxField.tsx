import { useSignals } from '@preact/signals-react/runtime'
import { Checkbox } from 'components'
import type { FieldConfig, FieldValue } from '../types'
import styles from '../ConfigurableForm.module.scss'

interface CheckboxFieldProps {
  field: FieldConfig
  value: FieldValue
  handleInputChange: (fieldName: string, newValue: FieldValue) => void
}

export default function CheckboxField({ field, value, handleInputChange }: CheckboxFieldProps) {
  useSignals()

  return (
    <Checkbox
      key={field.name}
      className={styles.checkboxField}
      isSelected={value as boolean}
      onChange={(isSelected) => handleInputChange(field.name, isSelected)}
    >
      {field.checkboxLabel || field.label}
    </Checkbox>
  )
}
