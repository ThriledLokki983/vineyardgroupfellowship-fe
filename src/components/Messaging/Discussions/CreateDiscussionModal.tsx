/**
 * CreateDiscussionModal Component
 * Modal form for creating new discussions (leaders only)
 */

import { useState } from 'react';
import { useCreateDiscussion, usePinDiscussion } from 'hooks/messaging';
import { Modal, Button } from 'components';
import styles from './CreateDiscussionModal.module.scss';

interface CreateDiscussionModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  onSuccess?: () => void;
}

const CreateDiscussionModal = ({
  isOpen,
  onClose,
  groupId,
  onSuccess,
}: CreateDiscussionModalProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [shouldPin, setShouldPin] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({});

  const { mutate: createDiscussion, isPending } = useCreateDiscussion();
  const { mutate: pinDiscussion } = usePinDiscussion();

  // Validation
  const validate = (): boolean => {
    const newErrors: { title?: string; content?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length > 200) {
      newErrors.title = 'Title must be 200 characters or less';
    }

    if (!content.trim()) {
      newErrors.content = 'Content is required';
    } else if (content.length < 10) {
      newErrors.content = 'Content must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handlers
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    createDiscussion(
      {
        group: groupId,
        title: title.trim(),
        content: content.trim(),
      },
      {
        onSuccess: (newDiscussion) => {
          // Pin if requested
          if (shouldPin && newDiscussion?.id) {
            pinDiscussion(newDiscussion.id);
          }

          // Reset form
          setTitle('');
          setContent('');
          setShouldPin(false);
          setErrors({});
          // Close modal
          onClose();
          // Notify parent
          onSuccess?.();
        },
        onError: (error: unknown) => {
          // Handle API errors
          if (error && typeof error === 'object' && 'response' in error) {
            const err = error as { response?: { data?: Record<string, string> } };
            if (err.response?.data) {
              setErrors(err.response.data);
            }
          }
        },
      }
    );
  };

  const handleClose = () => {
    if (!isPending) {
      setTitle('');
      setContent('');
      setShouldPin(false);
      setErrors({});
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Discussion"
      size="lg"
      isDismissable={!isPending}
      isKeyboardDismissDisabled={isPending}
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Title Field */}
        <div className={styles.field}>
          <label htmlFor="discussion-title" className={styles.label}>
            Title <span className={styles.required}>*</span>
          </label>
          <input
            id="discussion-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What would you like to discuss?"
            className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
            disabled={isPending}
            maxLength={200}
          />
          {errors.title && <span className={styles.errorText}>{errors.title}</span>}
          <span className={styles.helperText}>{title.length}/200 characters</span>
        </div>

        {/* Content Field */}
        <div className={styles.field}>
          <label htmlFor="discussion-content" className={styles.label}>
            Content <span className={styles.required}>*</span>
          </label>
          <textarea
            id="discussion-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts, questions, or experiences..."
            className={`${styles.textarea} ${errors.content ? styles.inputError : ''}`}
            disabled={isPending}
            rows={6}
          />
          {errors.content && <span className={styles.errorText}>{errors.content}</span>}
          <span className={styles.helperText}>Minimum 10 characters</span>
        </div>

        {/* Pin Checkbox */}
        <div className={styles.checkboxField}>
          <label htmlFor="discussion-pinned" className={styles.checkboxLabel}>
            <input
              id="discussion-pinned"
              type="checkbox"
              checked={shouldPin}
              onChange={(e) => setShouldPin(e.target.checked)}
              className={styles.checkbox}
              disabled={isPending}
            />
            <span>Pin this discussion to the top</span>
          </label>
          <p className={styles.checkboxHint}>
            Pinned discussions appear first and are visible to all group members
          </p>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <Button
            variant="secondary"
            onPress={handleClose}
            isDisabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            isDisabled={isPending}
          >
            {isPending ? 'Creating...' : 'Create Discussion'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateDiscussionModal;
