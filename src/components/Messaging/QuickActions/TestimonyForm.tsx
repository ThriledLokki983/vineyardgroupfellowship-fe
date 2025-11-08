import { useState } from 'react';
import type { FormEvent } from 'react';
import { Input } from '../../Input';
import { Textarea } from '../../Textarea';
import { Select, SelectItem } from '../../Select';
import { Button } from '../../Button';
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
      <Input
        label="Testimony Title"
        placeholder="Brief summary of your testimony..."
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
        label="Your Testimony"
        placeholder="Share the full story of what God has done..."
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

      {/* Link to Answered Prayer */}
      {answeredPrayers.length > 0 && (
        <div className={styles.field}>
          <Select
            label="Link to Answered Prayer (Optional)"
            placeholder="None - not related to a prayer"
            selectedKey={linkedPrayerId || undefined}
            onSelectionChange={(key) => setLinkedPrayerId((key as string) || '')}
            isDisabled={createMutation.isPending}
          >
            <SelectItem key="" id="">
              None - not related to a prayer
            </SelectItem>
            {answeredPrayers.map((prayer) => (
              <SelectItem key={prayer.id} id={prayer.id}>
                {prayer.title}
              </SelectItem>
            ))}
          </Select>
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
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          isDisabled={createMutation.isPending}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isDisabled={!canSubmit}
        >
          {createMutation.isPending ? 'Posting...' : 'Post Testimony'}
        </Button>
      </div>
    </form>
  );
}
