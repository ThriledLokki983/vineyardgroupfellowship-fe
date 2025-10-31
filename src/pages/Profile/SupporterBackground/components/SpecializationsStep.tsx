import { useEffect } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import { CheckboxGroup, Label, Text } from 'react-aria-components';
import { Button, Checkbox } from 'components';
import { supporterBackgroundPage } from 'src/signals/supporter-background-signals';
import type { SupporterBackgroundFormData } from 'src/schemas/supporterBackgroundSchema';
import { SPECIALIZATIONS_OPTIONS } from 'src/schemas/supporterBackgroundSchema';
import styles from '../SupporterBackground.module.scss';

interface SpecializationsStepProps {
  formData: Partial<SupporterBackgroundFormData>;
  onUpdate: (data: Partial<SupporterBackgroundFormData>) => void;
  onComplete: () => void;
  mode?: 'setup' | 'edit' | 'review';
}

export function SpecializationsStep({ formData, onUpdate, onComplete, mode = 'setup' }: SpecializationsStepProps) {
  useSignals(); // Subscribe to signal changes

  // Sync signal with formData on mount
  useEffect(() => {
    if (formData.specializations) {
      supporterBackgroundPage.steps.specializations.selectedSpecs.value = formData.specializations;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only sync on mount

  // Extract signal value for rendering and useEffect dependency
  const selectedSpecs = supporterBackgroundPage.steps.specializations.selectedSpecs.value;

  useEffect(() => {
    onUpdate({ specializations: selectedSpecs });
  }, [selectedSpecs, onUpdate]);

  if (mode === 'review') {
    return (
      <div className={styles.stepContainer}>
        <div className={styles.stepHeader}>
          <h2>Areas of Specialization</h2>
        </div>
        <div className={styles.reviewContent}>
          {selectedSpecs.length > 0 ? (
            <ul className={styles.reviewList}>
              {selectedSpecs.map((spec, index) => {
                const option = SPECIALIZATIONS_OPTIONS.find(opt => opt.value === spec);
                return (
                  <li key={index}>{option?.label || spec}</li>
                );
              })}
            </ul>
          ) : (
            <p>No specializations selected</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h2>Areas of Specialization</h2>
        <Text slot="description">
          What aspects of recovery do you feel most qualified to support others with?
          This step is optional but helps us match you with the right people.
        </Text>
      </div>

      <CheckboxGroup
        value={selectedSpecs}
        onChange={(values: string[]) => {
          supporterBackgroundPage.steps.specializations.selectedSpecs.value = values;
        }}
      >
        <Label aria-labelledby="Specialization">Specialization Areas</Label>
        <div className={styles.checkboxGrid}>
          {SPECIALIZATIONS_OPTIONS.map((spec) => (
            <Checkbox
              key={spec.value}
              value={spec.value}
              isSelected={selectedSpecs.includes(spec.value)}
              onChange={(isSelected) => {
                const current = supporterBackgroundPage.steps.specializations.selectedSpecs.value;
                if (isSelected) {
                  supporterBackgroundPage.steps.specializations.selectedSpecs.value = [...current, spec.value];
                } else {
                  supporterBackgroundPage.steps.specializations.selectedSpecs.value = current.filter(s => s !== spec.value);
                }
              }}
              description={spec.description}
            >
              {spec.label}
            </Checkbox>
          ))}
        </div>
      </CheckboxGroup>

      <div className={styles.stepActions}>
        <Button
          onPress={onComplete}
					variant='primary'
        >
          Continue
        </Button>
      </div>
    </div>
  );
}