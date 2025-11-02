import { useEffect } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import { TextField, Label, TextArea, FieldError, Text } from 'react-aria-components';
import { Button } from '../../../../components/Button/Button';
import { supporterBackgroundPage } from '../../../../signals/supporter-background-signals';
import { personalStorySchema } from '../../../../schemas/supporterBackgroundSchema';
import type { PersonalStoryStepProps } from 'types';
import styles from '../SupporterBackground.module.scss';

export function PersonalStoryStep({ formData, onUpdate, onComplete, mode = 'setup' }: PersonalStoryStepProps) {
  useSignals();

  // Sync signal with formData on mount
  useEffect(() => {
    if (formData.personal_recovery_story) {
      supporterBackgroundPage.steps.personalStory.story.value = formData.personal_recovery_story;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update parent form data when story signal changes
  // We need to watch the story value to call onUpdate
  const story = supporterBackgroundPage.steps.personalStory.story.value;
  useEffect(() => {
    onUpdate({ personal_recovery_story: story });
  }, [story, onUpdate]);

  const validateStory = (value: string): boolean => {
    try {
      personalStorySchema.parse({ personal_recovery_story: value });
      supporterBackgroundPage.steps.personalStory.errors.value = [];
      return true;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'errors' in error) {
        const zodError = error as { errors: Array<{ message: string }> };
        const errorMessages = zodError.errors?.map((e) => e.message) || ['Invalid input'];
        supporterBackgroundPage.steps.personalStory.errors.value = errorMessages;
      } else {
        supporterBackgroundPage.steps.personalStory.errors.value = ['Invalid input'];
      }
      return false;
    }
  };

  const handleChange = (value: string) => {
    supporterBackgroundPage.steps.personalStory.story.value = value;
    if (supporterBackgroundPage.steps.personalStory.touched.value.value) {
      validateStory(value);
    }
  };

  const handleBlur = () => {
    supporterBackgroundPage.steps.personalStory.touched.setTrue();
    validateStory(supporterBackgroundPage.steps.personalStory.story.value);
  };

  const handleContinue = () => {
    supporterBackgroundPage.steps.personalStory.touched.setTrue();
    if (validateStory(supporterBackgroundPage.steps.personalStory.story.value)) {
      onComplete();
    }
  };

  // Get signal values for rendering (story is already extracted above for useEffect)
  const errors = supporterBackgroundPage.steps.personalStory.errors.value;
  const touched = supporterBackgroundPage.steps.personalStory.touched.value.value;

  const isValid = story.length >= 50;
  const characterCount = story.length;
  const minRequired = 50;

  if (mode === 'review') {
    return (
      <div className={styles.stepContainer}>
        <div className={styles.stepHeader}>
          <h2>Personal Recovery Story</h2>
        </div>
        <div className={styles.reviewContent}>
          <p>{story || 'No story provided'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h2>Share Your Recovery Story</h2>
        <Text slot="description">
          Your personal experience helps us match you with people you can best support.
          Share as much or as little as you're comfortable with.
        </Text>
      </div>

      <TextField
        isRequired
        isInvalid={touched && errors.length > 0}
        value={story}
        onChange={handleChange}
        onBlur={handleBlur}
      >
        <Label aria-labelledby="Personal Recovery Story">Personal Recovery Story</Label>
        <TextArea
          placeholder="Tell us about your recovery journey. What challenges did you face? What helped you? What would you want someone else to know? Your story will help us match you with people facing similar challenges."
          rows={8}
          style={{ width: '100%', minHeight: '200px' }}
        />
        <Text slot="description">
          Minimum {minRequired} characters. This information is private and only used for matching.
        </Text>
        <div className={styles.characterCount}>
          {characterCount}/{minRequired} minimum
          {characterCount >= minRequired && ' ✓'}
        </div>
        {touched && errors.length > 0 && (
          <FieldError>{errors[0]}</FieldError>
        )}
      </TextField>

      <div className={styles.stepActions}>
        <Button
          onPress={handleContinue}
          isDisabled={!isValid}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}