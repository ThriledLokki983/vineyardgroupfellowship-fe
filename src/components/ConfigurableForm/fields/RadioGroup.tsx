import type { FieldConfig, FieldValue } from '../types';
import { Label, Text, RadioGroup, FieldError } from 'react-aria-components';
import { Radio } from 'components';
import styles from '../ConfigurableForm.module.scss';

interface RadioGroupFieldProps {
	field: FieldConfig;
	value: FieldValue;
	onChange: (value: FieldValue) => void;
	error?: string;
}

const RadioGroupField = ({ field, value, onChange, error }: RadioGroupFieldProps) => {
  return (
    <div key={field.name} className={styles.radioGroupContainer}>
      <Label className={styles.fieldLabel}>{field.label}</Label>
      {field.description && (
        <Text className={styles.fieldDescription}>{field.description}</Text>
      )}
      <RadioGroup
        value={value as string}
        onChange={onChange}
        className={styles.radioGroup}
        isRequired={field.isRequired}
        isInvalid={!!error}
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
      {error && (
        <FieldError className={styles.fieldError}>
          {error}
        </FieldError>
      )}
    </div>
  );
};

export default RadioGroupField;
