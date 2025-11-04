import { Label, Text, FieldError } from 'react-aria-components'
import { Checkbox } from 'components'
import type { FieldConfig, FieldValue } from '../types'
import styles from '../ConfigurableForm.module.scss'

interface CheckboxGroupProps {
  field: FieldConfig
  value: FieldValue
  onChange: (value: FieldValue) => void
  error?: string
}

export default function CheckboxGroup({ field, value, onChange, error }: CheckboxGroupProps) {
  return (
    <div key={field.name} className={styles.checkboxGroupContainer}>
      <Label className={styles.fieldLabel}>{field.label}</Label>
      {field.description && (
        <Text className={styles.fieldDescription}>{field.description}</Text>
      )}
      <div className={styles.checkboxGroup}>
        {field.options?.map((option) => (
          <Checkbox
            key={option.value}
            isSelected={Array.isArray(value) ? (value as string[]).includes(option.value) : false}
            onChange={(isSelected) => {
              const currentValues = Array.isArray(value) ? value as string[] : []
              let newValues: string[]

              if (isSelected) {
                newValues = [...currentValues, option.value]
              } else {
                newValues = currentValues.filter(v => v !== option.value)
              }

              onChange(newValues)
            }}
            description={option.description}
            className={styles.checkboxGroupOption}
          >
            {option.label}
          </Checkbox>
        ))}
      </div>
      {error && (
        <FieldError className={styles.fieldError}>
          {error}
        </FieldError>
      )}
    </div>
  )
}
