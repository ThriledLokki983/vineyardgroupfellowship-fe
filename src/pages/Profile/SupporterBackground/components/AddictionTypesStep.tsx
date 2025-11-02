import { useEffect } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import { CheckboxGroup, Label, FieldError, TextField, Text } from 'react-aria-components';
import { Button } from '../../../../components/Button/Button';
import Checkbox from '../../../../components/Checkbox';
import { supporterBackgroundPage } from '../../../../signals/supporter-background-signals';
import { ADDICTION_TYPES_OPTIONS, addictionTypesSchema } from '../../../../schemas/supporterBackgroundSchema';
import type { AddictionTypesStepProps } from 'types';
import styles from '../SupporterBackground.module.scss';

export function AddictionTypesStep({ formData, onUpdate, onComplete, mode = 'setup' }: AddictionTypesStepProps) {
  useSignals();

  // Sync signals with formData on mount
  useEffect(() => {
    if (formData.addiction_types_experienced) {
      supporterBackgroundPage.steps.addictionTypes.selectedTypes.value = formData.addiction_types_experienced;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only sync on mount

  // Extract signal values for rendering and useEffect dependencies
  const selectedTypes = supporterBackgroundPage.steps.addictionTypes.selectedTypes.value;
  const otherText = supporterBackgroundPage.steps.addictionTypes.otherText.value;

  useEffect(() => {
    // Build final types array
    const baseTypes = selectedTypes.filter(type => type !== 'other');
    const finalTypes = selectedTypes.includes('other') && otherText.trim()
      ? [...baseTypes, otherText.trim()]
      : baseTypes;

    onUpdate({ addiction_types_experienced: finalTypes });
  }, [selectedTypes, otherText, onUpdate]);

  const validateTypes = (types: string[]): boolean => {
    try {
      addictionTypesSchema.parse({ addiction_types_experienced: types });
      supporterBackgroundPage.steps.addictionTypes.errors.value = [];
      return true;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'errors' in error) {
        const zodError = error as { errors: Array<{ message: string }> };
        const errorMessages = zodError.errors?.map((e) => e.message) || ['Invalid selection'];
        supporterBackgroundPage.steps.addictionTypes.errors.value = errorMessages;
      } else {
        supporterBackgroundPage.steps.addictionTypes.errors.value = ['Invalid selection'];
      }
      return false;
    }
  };

  const handleSelectionChange = (values: string[]) => {
    supporterBackgroundPage.steps.addictionTypes.selectedTypes.value = values;
    if (supporterBackgroundPage.steps.addictionTypes.touched.value.value) {
      // Validate with current other text if "other" is selected
      const baseTypes = values.filter(type => type !== 'other');
      const currentOtherText = supporterBackgroundPage.steps.addictionTypes.otherText.value;
      const finalTypes = values.includes('other') && currentOtherText.trim()
        ? [...baseTypes, currentOtherText.trim()]
        : baseTypes;
      validateTypes(finalTypes);
    }
  };

  const handleOtherChange = (value: string) => {
    supporterBackgroundPage.steps.addictionTypes.otherText.value = value;
    if (supporterBackgroundPage.steps.addictionTypes.touched.value.value && selectedTypes.includes('other')) {
      const baseTypes = selectedTypes.filter(type => type !== 'other');
      const finalTypes = value.trim() ? [...baseTypes, value.trim()] : baseTypes;
      validateTypes(finalTypes);
    }
  };

  const handleContinue = () => {
    supporterBackgroundPage.steps.addictionTypes.touched.setTrue();
    const baseTypes = selectedTypes.filter(type => type !== 'other');
    const finalTypes = selectedTypes.includes('other') && otherText.trim()
      ? [...baseTypes, otherText.trim()]
      : baseTypes;

    if (validateTypes(finalTypes)) {
      onComplete();
    }
  };

  // Get signal values for rendering
  const errors = supporterBackgroundPage.steps.addictionTypes.errors.value;
  const touched = supporterBackgroundPage.steps.addictionTypes.touched.value.value;

  const finalTypes = selectedTypes.filter(type => type !== 'other');
  if (selectedTypes.includes('other') && otherText.trim()) {
    finalTypes.push(otherText.trim());
  }
  const isValid = finalTypes.length > 0;

  if (mode === 'review') {
    return (
      <div className={styles.stepContainer}>
        <div className={styles.stepHeader}>
          <h2>Addiction Types Experienced</h2>
        </div>
        <div className={styles.reviewContent}>
          {finalTypes.length > 0 ? (
            <ul className={styles.reviewList}>
              {finalTypes.map((type, index) => (
                <li key={index}>{type}</li>
              ))}
            </ul>
          ) : (
            <p>No types selected</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h2>Types of Addiction You've Experienced</h2>
        <Text slot="description">
          Select all that apply. This helps us match you with people facing similar challenges.
        </Text>
      </div>

      <CheckboxGroup
        value={selectedTypes}
        onChange={handleSelectionChange}
        isRequired
        isInvalid={touched && errors.length > 0}
      >
        <Label>Addiction Types</Label>
        <div className={styles.checkboxGrid}>
          {ADDICTION_TYPES_OPTIONS.map((type) => (
            <Checkbox
              key={type.value}
              value={type.value}
              isSelected={selectedTypes.includes(type.value)}
              onChange={(isSelected) => {
                const currentTypes = supporterBackgroundPage.steps.addictionTypes.selectedTypes.value;
                if (isSelected) {
                  supporterBackgroundPage.steps.addictionTypes.selectedTypes.value = [...currentTypes, type.value];
                } else {
                  supporterBackgroundPage.steps.addictionTypes.selectedTypes.value = currentTypes.filter(t => t !== type.value);
                }
              }}
            >
              {type.label}
            </Checkbox>
          ))}
        </div>
        {touched && errors.length > 0 && (
          <FieldError>{errors[0]}</FieldError>
        )}
      </CheckboxGroup>

      {selectedTypes.includes('other') && (
        <TextField value={otherText} onChange={handleOtherChange}>
          <Label>Please specify the other addiction type</Label>
          <input
            type="text"
            placeholder="Describe the other addiction type"
            className="input"
          />
        </TextField>
      )}

      <div className={styles.stepActions}>
        <Button
          onPress={handleContinue}
          isDisabled={!isValid}
          className="btn btn-primary"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}