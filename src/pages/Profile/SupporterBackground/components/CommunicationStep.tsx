import { useEffect } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import { CheckboxGroup, Label, TextField, Text } from 'react-aria-components';
import { Button, Checkbox } from 'components';
import { supporterBackgroundPage } from 'src/signals/supporter-background-signals';
import type { SupporterBackgroundFormData } from 'src/schemas/supporterBackgroundSchema';
import { COMMUNICATION_METHODS_OPTIONS } from 'src/schemas/supporterBackgroundSchema';
import styles from '../SupporterBackground.module.scss';

interface CommunicationStepProps {
  formData: Partial<SupporterBackgroundFormData>;
  onUpdate: (data: Partial<SupporterBackgroundFormData>) => void;
  onComplete: () => void;
  mode?: 'setup' | 'edit' | 'review';
}

export function CommunicationStep({ formData, onUpdate, onComplete, mode = 'setup' }: CommunicationStepProps) {
  useSignals(); // Subscribe to signal changes

  // Sync signals with formData on mount
  useEffect(() => {
    if (formData.time_zone_availability) {
      supporterBackgroundPage.steps.communication.timeZone.value = formData.time_zone_availability;
    }
    if (formData.preferred_communication_methods) {
      supporterBackgroundPage.steps.communication.commMethods.value = formData.preferred_communication_methods;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only sync on mount

  // Extract signal values for rendering and useEffect dependencies
  const timeZone = supporterBackgroundPage.steps.communication.timeZone.value;
  const commMethods = supporterBackgroundPage.steps.communication.commMethods.value;

  useEffect(() => {
    onUpdate({
      time_zone_availability: timeZone || undefined,
      preferred_communication_methods: commMethods.length > 0 ? commMethods : undefined
    });
  }, [timeZone, commMethods, onUpdate]);

  if (mode === 'review') {
    return (
      <div className={styles.stepContainer}>
        <div className={styles.stepHeader}>
          <h2>Communication Preferences</h2>
        </div>
        <div className={styles.reviewContent}>
          <p><strong>Time Zone:</strong> {timeZone || 'Not specified'}</p>
          <p><strong>Preferred Communication Methods:</strong></p>
          {commMethods.length > 0 ? (
            <ul className={styles.reviewList}>
              {commMethods.map((method, index) => {
                const option = COMMUNICATION_METHODS_OPTIONS.find(opt => opt.value === method);
                return (
                  <li key={index}>{option?.label || method}</li>
                );
              })}
            </ul>
          ) : (
            <p>No preferences specified</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h2>Communication Preferences</h2>
        <Text slot="description">
          Help us understand when and how you prefer to communicate with mentees.
          This information is optional but helps with better matching.
        </Text>
      </div>

      <TextField
        value={timeZone}
        onChange={(value) => {
          supporterBackgroundPage.steps.communication.timeZone.value = value;
        }}
      >
        <Label aria-labelledby="Time Zone Availability">Time Zone Availability</Label>
        <input
          type="text"
          placeholder="e.g., EST, PST, UTC-5 to UTC-8, or 'Eastern and Central US'"
          className="input"
        />
        <Text slot="description">
          What time zones are you comfortable working across?
        </Text>
      </TextField>

      <CheckboxGroup
        value={commMethods}
        onChange={(values: string[]) => {
          supporterBackgroundPage.steps.communication.commMethods.value = values;
        }}
      >
        <Label aria-labelledby="Preferred Communication Method">Preferred Communication Methods</Label>
        <div className={styles.checkboxGrid}>
          {COMMUNICATION_METHODS_OPTIONS.map((method) => (
            <Checkbox
              key={method.value}
              value={method.value}
							aria-labelledby={method.value}
              isSelected={commMethods.includes(method.value)}
              onChange={(isSelected) => {
                const current = supporterBackgroundPage.steps.communication.commMethods.value;
                if (isSelected) {
                  supporterBackgroundPage.steps.communication.commMethods.value = [...current, method.value];
                } else {
                  supporterBackgroundPage.steps.communication.commMethods.value = current.filter(m => m !== method.value);
                }
              }}
              description={method.description}
            >
              {method.label}
            </Checkbox>
          ))}
        </div>
      </CheckboxGroup>

      <div className={styles.stepActions}>
        <Button
          onPress={onComplete}
          className="btn btn-primary"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}