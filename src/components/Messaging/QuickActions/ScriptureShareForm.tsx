import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useCreateScripture, useVerseLookup } from '../../../hooks/messaging/useScriptures';
import Icon from '../../Icon';
import styles from './ScriptureShareForm.module.scss';
import type { BibleTranslation } from '../../../types/messaging';

interface ScriptureShareFormProps {
  groupId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const TRANSLATION_OPTIONS: { value: BibleTranslation; label: string }[] = [
  { value: 'KJV', label: 'King James Version (KJV)' },
  { value: 'NIV', label: 'New International Version (NIV)' },
  { value: 'ESV', label: 'English Standard Version (ESV)' },
  { value: 'NLT', label: 'New Living Translation (NLT)' },
  { value: 'NKJV', label: 'New King James Version (NKJV)' },
  { value: 'NASB', label: 'New American Standard Bible (NASB)' },
  { value: 'MSG', label: 'The Message (MSG)' },
];

const MAX_REFLECTION_LENGTH = 500;

/**
 * ScriptureShareForm - Form for sharing scripture with verse lookup
 *
 * Features:
 * - Reference input (e.g., "John 3:16")
 * - Translation selector
 * - Real-time verse lookup and preview
 * - Optional personal reflection
 * - Character count validation
 * - Submit/cancel actions
 */
export function ScriptureShareForm({
  groupId,
  onSuccess,
  onCancel,
}: ScriptureShareFormProps) {
  const [reference, setReference] = useState('');
  const [translation, setTranslation] = useState<BibleTranslation>('NIV');
  const [reflection, setReflection] = useState('');
  const [lookupEnabled, setLookupEnabled] = useState(false);

  const createMutation = useCreateScripture();

  // Verse lookup - only enabled when user has entered a reference
  const { data: verseData, isLoading: isLoadingVerse, isError: isVerseError } = useVerseLookup(
    reference.trim(),
    translation,
    lookupEnabled && reference.trim().length > 0
  );

  const handleReferenceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setReference(e.target.value);
    // Disable lookup temporarily while user is typing
    setLookupEnabled(false);
  };

  const handleLookupClick = () => {
    if (reference.trim()) {
      setLookupEnabled(true);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!reference.trim() || !verseData) {
      return;
    }

    createMutation.mutate(
      {
        group: groupId,
        reference: reference.trim(),
        verse_text: verseData.text,
        translation,
        reflection: reflection.trim() || undefined,
      },
      {
        onSuccess: () => {
          setReference('');
          setReflection('');
          setTranslation('NIV');
          setLookupEnabled(false);
          onSuccess();
        },
      }
    );
  };

  const canSubmit =
    reference.trim().length > 0 &&
    verseData !== undefined &&
    !isVerseError &&
    reflection.length <= MAX_REFLECTION_LENGTH &&
    !createMutation.isPending;

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <Icon name="AgendaCheck" className={styles.titleIcon} />
          Share Scripture
        </h2>
        <p className={styles.subtitle}>
          Share a verse that speaks to you. Add your personal reflection to help others apply it to their lives.
        </p>
      </div>

      {/* Reference Input */}
      <div className={styles.field}>
        <label htmlFor="scripture-reference" className={styles.label}>
          Bible Reference
        </label>
        <div className={styles.referenceRow}>
          <input
            id="scripture-reference"
            type="text"
            className={styles.input}
            value={reference}
            onChange={handleReferenceChange}
            placeholder="e.g., John 3:16 or Psalm 23:1-3"
            disabled={createMutation.isPending}
            required
          />
          <button
            type="button"
            className={styles.lookupButton}
            onClick={handleLookupClick}
            disabled={!reference.trim() || isLoadingVerse || createMutation.isPending}
          >
            {isLoadingVerse ? 'Looking up...' : 'Lookup'}
          </button>
        </div>
        <p className={styles.helpText}>
          Enter a verse reference (e.g., John 3:16, Psalm 23, Romans 8:28-30)
        </p>
      </div>

      {/* Translation Selector */}
      <div className={styles.field}>
        <label htmlFor="scripture-translation" className={styles.label}>
          Bible Translation
        </label>
        <select
          id="scripture-translation"
          className={styles.select}
          value={translation}
          onChange={(e) => {
            setTranslation(e.target.value as BibleTranslation);
            // Reset lookup when translation changes
            if (lookupEnabled && reference.trim()) {
              setLookupEnabled(false);
              setTimeout(() => setLookupEnabled(true), 100);
            }
          }}
          disabled={createMutation.isPending}
        >
          {TRANSLATION_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Verse Preview */}
      {lookupEnabled && (
        <div className={styles.versePreview}>
          {isLoadingVerse && (
            <div className={styles.loading}>
              <Icon name="ReloadIcon" className={styles.loadingIcon} />
              <span>Looking up verse...</span>
            </div>
          )}

          {isVerseError && (
            <div className={styles.verseError}>
              <Icon name="ExclamationCircleIcon" className={styles.errorIcon} />
              <span>
                Could not find this verse. Please check the reference and try again.
              </span>
            </div>
          )}

          {verseData && !isLoadingVerse && (
            <div className={styles.verseContent}>
              <div className={styles.verseHeader}>
                <Icon name="AgendaCheck" className={styles.verseIcon} />
                <span className={styles.verseReference}>{verseData.reference}</span>
                <span className={styles.verseTranslation}>({verseData.translation})</span>
              </div>
              <blockquote className={styles.verseText}>
                {verseData.text}
              </blockquote>
              <p className={styles.verseSource}>Source: {verseData.source}</p>
            </div>
          )}
        </div>
      )}

      {/* Personal Reflection (Optional) */}
      <div className={styles.field}>
        <label htmlFor="scripture-reflection" className={styles.label}>
          Personal Reflection (Optional)
        </label>
        <textarea
          id="scripture-reflection"
          className={styles.textarea}
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="Share what this verse means to you or how it applies to your life..."
          maxLength={MAX_REFLECTION_LENGTH}
          rows={4}
          disabled={createMutation.isPending}
        />
        <div className={styles.charCount}>
          {reflection.length}/{MAX_REFLECTION_LENGTH}
        </div>
      </div>

      {/* Error Message */}
      {createMutation.isError && (
        <div className={styles.error}>
          <Icon name="ExclamationCircleIcon" className={styles.errorIcon} />
          <span>
            {createMutation.error instanceof Error
              ? createMutation.error.message
              : 'Failed to share scripture. Please try again.'}
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
          {createMutation.isPending ? 'Sharing...' : 'Share Scripture'}
        </button>
      </div>
    </form>
  );
}
