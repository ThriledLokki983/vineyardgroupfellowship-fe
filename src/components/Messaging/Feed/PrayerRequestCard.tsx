/**
 * PrayerRequestCard Component
 * Displays a prayer request with urgency badge, "I Prayed" button, and answered status
 */

import { useState } from 'react';
import Icon from '../../Icon';
import { usePrayForRequest, useMarkPrayerAnswered } from '../../../hooks/messaging/usePrayerRequests';
import { useUser } from '../../../hooks/useUser';
import type { PrayerRequest, PrayerUrgency } from '../../../types/messaging';
import styles from './PrayerRequestCard.module.scss';

interface PrayerRequestCardProps {
  prayer: PrayerRequest;
  onClick?: () => void;
  showFullContent?: boolean;
}

export const PrayerRequestCard = ({
  prayer,
  onClick,
  showFullContent = false,
}: PrayerRequestCardProps) => {
  const { user: currentUser } = useUser();
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [answerDescription, setAnswerDescription] = useState('');

  const prayMutation = usePrayForRequest();
  const markAnsweredMutation = useMarkPrayerAnswered();

  const isAuthor = currentUser?.id === prayer.author.id;

  // Handle "I Prayed" button click
  const handlePray = (e: React.MouseEvent) => {
    e.stopPropagation();
    prayMutation.mutate(prayer.id);
  };

  // Handle mark as answered
  const handleMarkAnswered = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!answerDescription.trim()) return;

    markAnsweredMutation.mutate(
      { id: prayer.id, payload: { answer_description: answerDescription } },
      {
        onSuccess: () => {
          setShowAnswerForm(false);
          setAnswerDescription('');
        },
      }
    );
  };

  // Get urgency badge color
  const getUrgencyClass = (urgency: PrayerUrgency) => {
    switch (urgency) {
      case 'critical':
        return styles.critical;
      case 'urgent':
        return styles.urgent;
      default:
        return styles.normal;
    }
  };

  // Get urgency label
  const getUrgencyLabel = (urgency: PrayerUrgency) => {
    switch (urgency) {
      case 'critical':
        return 'Critical';
      case 'urgent':
        return 'Urgent';
      default:
        return 'Normal';
    }
  };

  // Get category label
  const getCategoryLabel = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <article className={styles.prayerCard} onClick={onClick}>
      {/* Header with urgency and category */}
      <div className={styles.header}>
        <div className={styles.badges}>
          <span className={`${styles.urgencyBadge} ${getUrgencyClass(prayer.urgency)}`}>
            {getUrgencyLabel(prayer.urgency)}
          </span>
          <span className={styles.categoryBadge}>{getCategoryLabel(prayer.category)}</span>
        </div>

        {prayer.is_answered && (
          <div className={styles.answeredBadge}>
            <Icon name="CheckMarkIcon" size={14} />
            <span>Answered</span>
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className={styles.title}>{prayer.title}</h3>

      {/* Content */}
      <p className={showFullContent ? styles.content : styles.contentPreview}>{prayer.content}</p>

      {/* Answer Description (if answered) */}
      {prayer.is_answered && prayer.answer_description && (
        <div className={styles.answerSection}>
          <div className={styles.answerHeader}>
            <Icon name="PraiseIcon" size={16} />
            <span>Praise Report</span>
          </div>
          <p className={styles.answerText}>{prayer.answer_description}</p>
          {prayer.answered_at && (
            <time className={styles.answeredDate}>
              Answered {formatDate(prayer.answered_at)}
            </time>
          )}
        </div>
      )}

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.meta}>
          <span className={styles.author}>
            {prayer.author.display_name || prayer.author.username}
          </span>
          <span className={styles.separator}>•</span>
          <time dateTime={prayer.created_at}>{formatDate(prayer.created_at)}</time>
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <Icon name="ChatBubbleIcon" size={14} />
            <span>{prayer.comment_count || 0}</span>
          </div>
          <div className={styles.stat}>
            <Icon name="HandIcon" size={14} />
            <span>{prayer.prayer_count || 0}</span>
          </div>
        </div>

        {/* Action Buttons */}
        {!prayer.is_answered && (
          <div className={styles.actions}>
            {/* I Prayed Button */}
            <button
              type="button"
              onClick={handlePray}
              className={styles.prayButton}
              disabled={prayMutation.isPending}
            >
              <Icon name="HandIcon" size={16} />
              <span>{prayMutation.isPending ? 'Praying...' : 'I Prayed'}</span>
              {prayer.prayer_count > 0 && (
                <span className={styles.count}>{prayer.prayer_count}</span>
              )}
            </button>

            {/* Mark as Answered (Author only) */}
            {isAuthor && !showAnswerForm && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAnswerForm(true);
                }}
                className={styles.answerButton}
              >
                <Icon name="CheckMarkIcon" size={16} />
                <span>Mark Answered</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Answer Form (Author only) */}
      {showAnswerForm && isAuthor && (
        <form
          onSubmit={handleMarkAnswered}
          className={styles.answerForm}
          onClick={(e) => e.stopPropagation()}
        >
          <label htmlFor={`answer-${prayer.id}`} className={styles.formLabel}>
            How was your prayer answered?
          </label>
          <textarea
            id={`answer-${prayer.id}`}
            value={answerDescription}
            onChange={(e) => setAnswerDescription(e.target.value)}
            placeholder="Share how God answered this prayer..."
            rows={3}
            maxLength={500}
            className={styles.textarea}
            disabled={markAnsweredMutation.isPending}
          />
          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={!answerDescription.trim() || markAnsweredMutation.isPending}
            >
              {markAnsweredMutation.isPending ? 'Saving...' : 'Save Answer'}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowAnswerForm(false);
                setAnswerDescription('');
              }}
              className={styles.cancelButton}
              disabled={markAnsweredMutation.isPending}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </article>
  );
};
