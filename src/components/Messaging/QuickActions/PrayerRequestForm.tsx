import { useState } from 'react';
import type { FormEvent } from 'react';
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
      <div className={styles.field}>
        <label htmlFor="prayer-title" className={styles.label}>
          Prayer Title
        </label>
        <input
          id="prayer-title"
          type="text"
          className={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Brief summary of your prayer request..."
          maxLength={MAX_TITLE_LENGTH}
          disabled={createMutation.isPending}
          required
        />
        <div className={styles.charCount}>
          {title.length}/{MAX_TITLE_LENGTH}
        </div>
      </div>

      {/* Content Textarea */}
      <div className={styles.field}>
        <label htmlFor="prayer-content" className={styles.label}>
          Prayer Details
        </label>
        <textarea
          id="prayer-content"
          className={styles.textarea}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share the details of your prayer request..."
          maxLength={MAX_CONTENT_LENGTH}
          rows={6}
          disabled={createMutation.isPending}
          required
        />
        <div className={styles.charCount}>
          {content.length}/{MAX_CONTENT_LENGTH}
        </div>
      </div>

      {/* Urgency Selector */}
      <div className={styles.field}>
        <label className={styles.label}>Urgency Level</label>
        <div className={styles.radioGroup}>
          {URGENCY_OPTIONS.map((option) => (
            <label key={option.value} className={styles.radioLabel}>
              <input
                type="radio"
                name="urgency"
                value={option.value}
                checked={urgency === option.value}
                onChange={(e) => setUrgency(e.target.value as PrayerUrgency)}
                disabled={createMutation.isPending}
                className={styles.radioInput}
              />
              <span className={styles.radioContent}>
                <span className={styles.radioTitle}>{option.label}</span>
                <span className={styles.radioDescription}>{option.description}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Category Dropdown */}
      <div className={styles.field}>
        <label htmlFor="prayer-category" className={styles.label}>
          Category
        </label>
        <select
          id="prayer-category"
          className={styles.select}
          value={category}
          onChange={(e) => setCategory(e.target.value as PrayerCategory)}
          disabled={createMutation.isPending}
        >
          {CATEGORY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

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
        <button
          type="button"
          className={styles.cancelButton}
          onClick={onCancel}
          disabled={createMutation.isPending}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={!canSubmit}
        >
          {createMutation.isPending ? 'Creating...' : 'Create Prayer Request'}
        </button>
      </div>
    </form>
  );
}
