import { useSignals } from '@preact/signals-react/runtime'
import { Label, Text } from 'react-aria-components'
import { createFormSignal } from 'signals/form-signals'
import { Checkbox } from 'components'
import type { FieldConfig, FieldValue } from '../types'
import styles from '../ConfigurableForm.module.scss'

interface CheckboxGroupProps {
  field: FieldConfig
  value: FieldValue
  handleInputChange: (fieldName: string, newValue: FieldValue) => void
  formSignal: ReturnType<typeof createFormSignal>
}

export default function CheckboxGroup({ field, value, handleInputChange, formSignal }: CheckboxGroupProps) {
  useSignals()

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

              handleInputChange(field.name, newValues)

              if (formSignal.errors.value[field.name]) {
                formSignal.clearFieldError(field.name)
              }
            }}
            description={option.description}
            className={styles.checkboxGroupOption}
          >
            {option.label}
          </Checkbox>
        ))}
      </div>
      {formSignal.errors.value[field.name] && (
        <div className={styles.fieldError}>
          {formSignal.errors.value[field.name]}
        </div>
      )}
    </div>
  )
}
