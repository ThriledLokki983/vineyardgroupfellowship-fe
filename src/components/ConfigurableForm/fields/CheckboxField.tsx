import { Checkbox } from 'components'
import type { FieldConfig, FieldValue } from '../types'
import styles from '../ConfigurableForm.module.scss'

interface CheckboxFieldProps {
  field: FieldConfig
  value: FieldValue
  onChange: (value: FieldValue) => void
}

export default function CheckboxField({ field, value, onChange }: CheckboxFieldProps) {
  return (
    <Checkbox
      key={field.name}
      className={styles.checkboxField}
      isSelected={value as boolean}
      onChange={onChange}
    >
      {field.checkboxLabel || field.label}
    </Checkbox>
  )
}
