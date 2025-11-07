import { useState } from 'react';
import type { FormEvent } from 'react';
import { useCreateTestimony } from '../../../hooks/messaging/useTestimonies';
import { usePrayerRequests } from '../../../hooks/messaging/usePrayerRequests';
import Icon from '../../Icon';
import styles from './TestimonyForm.module.scss';

interface TestimonyFormProps {
  groupId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const MAX_TITLE_LENGTH = 200;
const MAX_CONTENT_LENGTH = 1000;

/**
 * TestimonyForm - Form for creating testimonies
 *
 * Features:
 * - Title and content text areas
 * - Optional link to answered prayer
 * - Character count validation
 * - Submit/cancel actions
 */
export function TestimonyForm({
  groupId,
  onSuccess,
  onCancel,
}: TestimonyFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [linkedPrayerId, setLinkedPrayerId] = useState<string>('');

  const createMutation = useCreateTestimony();

  // Fetch answered prayers for linking (optional)
  const { data: prayersData } = usePrayerRequests(groupId, {
    is_answered: true,
    ordering: '-answered_at',
    page_size: 50,
  });

  const answeredPrayers = prayersData?.results || [];

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
        answered_prayer: linkedPrayerId || null,
      },
      {
        onSuccess: () => {
          setTitle('');
          setContent('');
          setLinkedPrayerId('');
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
          <Icon name="PraiseIcon" className={styles.titleIcon} />
          Share a Testimony
        </h2>
        <p className={styles.subtitle}>
          Share how God has worked in your life. Your testimony encourages others and gives glory to God.
        </p>
      </div>

      {/* Title Input */}
      <div className={styles.field}>
        <label htmlFor="testimony-title" className={styles.label}>
          Testimony Title
        </label>
        <input
          id="testimony-title"
          type="text"
          className={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Brief summary of your testimony..."
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
        <label htmlFor="testimony-content" className={styles.label}>
          Your Testimony
        </label>
        <textarea
          id="testimony-content"
          className={styles.textarea}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share the full story of what God has done..."
          maxLength={MAX_CONTENT_LENGTH}
          rows={8}
          disabled={createMutation.isPending}
          required
        />
        <div className={styles.charCount}>
          {content.length}/{MAX_CONTENT_LENGTH}
        </div>
      </div>

      {/* Link to Answered Prayer */}
      {answeredPrayers.length > 0 && (
        <div className={styles.field}>
          <label htmlFor="linked-prayer" className={styles.label}>
            Link to Answered Prayer (Optional)
          </label>
          <select
            id="linked-prayer"
            className={styles.select}
            value={linkedPrayerId}
            onChange={(e) => setLinkedPrayerId(e.target.value)}
            disabled={createMutation.isPending}
          >
            <option value="">None - not related to a prayer</option>
            {answeredPrayers.map((prayer) => (
              <option key={prayer.id} value={prayer.id}>
                {prayer.title}
              </option>
            ))}
          </select>
          <p className={styles.helpText}>
            <Icon name="HandIcon" className={styles.helpIcon} />
            Connect this testimony to a prayer that God answered
          </p>
        </div>
      )}

      {/* Share Publicly Info */}
      <div className={styles.infoBox}>
        <Icon name="ExclamationIcon" className={styles.infoIcon} />
        <div className={styles.infoContent}>
          <p className={styles.infoTitle}>Privacy & Sharing</p>
          <p className={styles.infoText}>
            Your testimony will be visible to group members. After posting, you can request to share it publicly
            (requires leader approval).
          </p>
        </div>
      </div>

      {/* Error Message */}
      {createMutation.isError && (
        <div className={styles.error}>
          <Icon name="ExclamationCircleIcon" className={styles.errorIcon} />
          <span>
            {createMutation.error instanceof Error
              ? createMutation.error.message
              : 'Failed to create testimony. Please try again.'}
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
          {createMutation.isPending ? 'Posting...' : 'Post Testimony'}
        </button>
      </div>
    </form>
  );
}
