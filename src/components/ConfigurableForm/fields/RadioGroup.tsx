import { createFormSignal } from 'signals/form-signals';
import { useSignals } from '@preact/signals-react/runtime';
import type { FieldConfig, FieldValue } from '../types';
import { Label, Text, RadioGroup } from 'react-aria-components';
import { Radio } from 'components';
import styles from '../ConfigurableForm.module.scss';


interface RadioGroupFieldProps {
	field: FieldConfig;
	value: FieldValue;
	handleInputChange: (fieldName: string, newValue: FieldValue) => void;
	formSignal: ReturnType<typeof createFormSignal>;
}

const RadioGroupField = ({ field, value, handleInputChange, formSignal }: RadioGroupFieldProps) => {
  useSignals()

  return (
    <div key={field.name} className={styles.radioGroupContainer}>
      <Label className={styles.fieldLabel} aria-labelledby={field.label}>{field.label}</Label>
      {field.description && (
        <Text className={styles.fieldDescription}>{field.description}</Text>
      )}
      <RadioGroup
        aria-labelledby={field.name}
        value={value as string}
        onChange={(selectedValue) => {
          handleInputChange(field.name, selectedValue)
          if (formSignal.errors.value[field.name]) {
            formSignal.clearFieldError(field.name)
          }
        }}
        className={styles.radioGroup}
        isRequired={field.isRequired}
        isInvalid={!!formSignal.errors.value[field.name]}
      >
        {field.options?.map((option) => (
          <Radio
            key={option.value}
            value={option.value}
            description={option.description}
            className={styles.radioOption}
          >
            {option.label}
          </Radio>
        ))}
      </RadioGroup>
      {formSignal.errors.value[field.name] && (
        <div className={styles.fieldError}>
          {formSignal.errors.value[field.name]}
        </div>
      )}
    </div>
  );

};

export default RadioGroupField;
