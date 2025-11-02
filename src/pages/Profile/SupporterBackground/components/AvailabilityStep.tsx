import { useEffect } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import { RadioGroup, Label, Text } from 'react-aria-components';
import { Button, Radio } from 'components';
import { supporterBackgroundPage } from 'src/signals/supporter-background-signals';
import type { AvailabilityStepProps } from 'types';
import styles from '../SupporterBackground.module.scss';

export function AvailabilityStep({ formData, onUpdate, onComplete, mode = 'setup' }: AvailabilityStepProps) {
  useSignals();

  // Sync signals with formData on mount
  useEffect(() => {
    if (formData.available_for_one_on_one !== undefined) {
      if (formData.available_for_one_on_one) {
        supporterBackgroundPage.steps.availability.oneOnOne.setTrue();
      } else {
        supporterBackgroundPage.steps.availability.oneOnOne.setFalse();
      }
    }
    if (formData.available_for_group_leadership !== undefined) {
      if (formData.available_for_group_leadership) {
        supporterBackgroundPage.steps.availability.groupLeadership.setTrue();
      } else {
        supporterBackgroundPage.steps.availability.groupLeadership.setFalse();
      }
    }
    if (formData.max_mentees) {
      supporterBackgroundPage.steps.availability.maxMentees.value = formData.max_mentees;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only sync on mount

  // Extract signal values for rendering and useEffect dependencies
  const oneOnOne = supporterBackgroundPage.steps.availability.oneOnOne.value.value;
  const groupLeadership = supporterBackgroundPage.steps.availability.groupLeadership.value.value;
  const maxMentees = supporterBackgroundPage.steps.availability.maxMentees.value;

  useEffect(() => {
    onUpdate({
      available_for_one_on_one: oneOnOne,
      available_for_group_leadership: groupLeadership,
      max_mentees: oneOnOne ? maxMentees : undefined
    });
  }, [oneOnOne, groupLeadership, maxMentees, onUpdate]);

  if (mode === 'review') {
    return (
      <div className={styles.stepContainer}>
        <div className={styles.stepHeader}>
          <h2>Support Availability</h2>
        </div>
        <div className={styles.reviewContent}>
          <p><strong>One-on-One Mentoring:</strong> {oneOnOne ? 'Yes' : 'No'}</p>
          <p><strong>Group Leadership:</strong> {groupLeadership ? 'Yes' : 'No'}</p>
          {oneOnOne && <p><strong>Maximum Mentees:</strong> {maxMentees}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h2>Support Availability</h2>
        <Text slot="description">
          How would you like to help others in their recovery journey?
        </Text>
      </div>

			<RadioGroup
        value={oneOnOne ? 'true' : 'false'}
        onChange={(value) => {
          if (value === 'true') {
            supporterBackgroundPage.steps.availability.oneOnOne.setTrue();
          } else {
            supporterBackgroundPage.steps.availability.oneOnOne.setFalse();
          }
        }}
        className={styles.radioGroup}
				aria-labelledby="One-on-One Mentoring"
      >
        <Radio value="true" description="I'm comfortable providing direct guidance and support to individuals">
          Yes, I'm available for one-on-one mentoring
        </Radio>
        <Radio value="false" description="I prefer to help through group settings and community support">
          No, I prefer group settings only
        </Radio>
      </RadioGroup>

      {oneOnOne && (
        <div className={styles.sliderContainer}>
          <Label>Maximum number of mentees you're comfortable supporting</Label>
          <div className={styles.sliderValue}>{maxMentees} mentees</div>
          <input
            type="range"
            min="1"
            max="20"
            value={maxMentees}
            onChange={(e) => {
              supporterBackgroundPage.steps.availability.maxMentees.value = parseInt(e.target.value);
            }}
            style={{ width: '100%' }}
          />
          <Text slot="description">
            You can always adjust this number later based on your availability.
          </Text>
        </div>
      )}

      <RadioGroup
        value={groupLeadership.toString()}
        onChange={(value) => {
          if (value === 'true') {
            supporterBackgroundPage.steps.availability.groupLeadership.setTrue();
          } else {
            supporterBackgroundPage.steps.availability.groupLeadership.setFalse();
          }
        }}
        className={styles.radioGroup}
				aria-labelledby="Group Leadership"
      >
        <Label>Group Leadership</Label>
        <Radio value="true" description="I'm comfortable facilitating discussions and managing group dynamics">
          Yes, I'm interested in leading support groups
        </Radio>
        <Radio value="false" description="I prefer to participate as a peer member rather than lead">
          No, I prefer participating as a member
        </Radio>
      </RadioGroup>

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