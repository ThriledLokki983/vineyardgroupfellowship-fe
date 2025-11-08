import { useState } from 'react';
import type { FormEvent } from 'react';
import { Input } from '../../Input';
import { Textarea } from '../../Textarea';
import { RadioGroup } from '../../RadioGroup';
import { Select, SelectItem } from '../../Select';
import { Button } from '../../Button';
import { useCreatePrayerRequest } from '../../../hooks/messaging/usePrayerRequests';
import Icon from '../../Icon';
import styles from './PrayerRequestForm.module.scss';
import type { PrayerUrgency, PrayerCategory } from '../../../types/messaging';

interface PrayerRequestFormProps {
  groupId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const URGENCY_OPTIONS: { value: PrayerUrgency; label: string; description: string }[] = [
  { value: 'normal', label: 'Normal', description: 'Standard prayer request' },
  { value: 'urgent', label: 'Urgent', description: 'Needs attention soon' },
  { value: 'critical', label: 'Critical', description: 'Immediate attention needed' },
];

const CATEGORY_OPTIONS: { value: PrayerCategory; label: string }[] = [
  { value: 'personal', label: 'Personal' },
  { value: 'family', label: 'Family' },
  { value: 'health', label: 'Health' },
  { value: 'work', label: 'Work' },
  { value: 'ministry', label: 'Ministry' },
  { value: 'salvation', label: 'Salvation' },
  { value: 'other', label: 'Other' },
];

const MAX_TITLE_LENGTH = 200;
const MAX_CONTENT_LENGTH = 500;

/**
 * PrayerRequestForm - Form for creating prayer requests
 *
 * Features:
 * - Title and content text areas
 * - Urgency selector (normal/urgent/critical)
 * - Category dropdown
 * - Character count validation
 * - Submit/cancel actions
 */
export function PrayerRequestForm({
  groupId,
  onSuccess,
  onCancel,
}: PrayerRequestFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [urgency, setUrgency] = useState<PrayerUrgency>('normal');
  const [category, setCategory] = useState<PrayerCategory>('personal');

  const createMutation = useCreatePrayerRequest();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      return;
    }

    createMutation.mutate(
      {
        group: groupId,
        title: title.trim(),
        content: content.trim(),
        urgency,
        category,
      },
      {
        onSuccess: () => {
          setTitle('');
          setContent('');
          setUrgency('normal');
          setCategory('personal');
          onSuccess();
        },
      }
    );
  };

  const canSubmit =
    title.trim().length > 0 &&
    title.length <= MAX_TITLE_LENGTH &&
    content.trim().length > 0 &&
    content.length <= MAX_CONTENT_LENGTH &&
    !createMutation.isPending;

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <Icon name="HandIcon" className={styles.titleIcon} />
          New Prayer Request
        </h2>
        <p className={styles.subtitle}>
          Share your prayer need with the group. Members will be able to pray and offer support.
        </p>
      </div>

      {/* Title Input */}
      <Input
        label="Prayer Title"
        placeholder="Brief summary of your prayer request..."
        isRequired
        isDisabled={createMutation.isPending}
        inputProps={{
          value: title,
          onChange: (e) => setTitle(e.target.value),
          maxLength: MAX_TITLE_LENGTH,
        }}
        helperText={
          <div className={styles.charCount}>
            {title.length}/{MAX_TITLE_LENGTH}
          </div>
        }
      />

      {/* Content Textarea */}
      <Textarea
        label="Prayer Details"
        placeholder="Share the details of your prayer request..."
        rows={5}
        isRequired
        isDisabled={createMutation.isPending}
        textAreaProps={{
          value: content,
          onChange: (e) => setContent(e.target.value),
          maxLength: MAX_CONTENT_LENGTH,
        }}
        helperText={
          <div className={styles.charCount}>
            {content.length}/{MAX_CONTENT_LENGTH}
          </div>
        }
      />

      {/* Urgency Selector */}
      <RadioGroup
        label="Urgency Level"
        value={urgency}
        onChange={(value) => setUrgency(value as PrayerUrgency)}
        isDisabled={createMutation.isPending}
        options={URGENCY_OPTIONS}
        orientation="vertical"
      />

      {/* Category Dropdown */}
      <Select
        label="Category"
        placeholder="Select a category"
        selectedKey={category}
        onSelectionChange={(key) => setCategory(key as PrayerCategory)}
        isDisabled={createMutation.isPending}
      >
        {CATEGORY_OPTIONS.map((option) => (
          <SelectItem key={option.value} id={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </Select>

      {/* Error Message */}
      {createMutation.isError && (
        <div className={styles.error}>
          <Icon name="ExclamationCircleIcon" className={styles.errorIcon} />
          <span>
            {createMutation.error instanceof Error
              ? createMutation.error.message
              : 'Failed to create prayer request. Please try again.'}
          </span>
        </div>
      )}

      {/* Actions */}
      <div className={styles.actions}>
        <Button
          type="button"
          variant='secondary'
          size='small'
          className={styles.cancelButton}
          onClick={onCancel}
          isDisabled={createMutation.isPending}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant='primary'
          size='small'
          className={styles.submitButton}
          isDisabled={!canSubmit}
        >
          {createMutation.isPending ? 'Creating...' : 'Create Prayer Request'}
        </Button>
      </div>
    </form>
  );
}
