/**
 * TestimonyCard Component
 * Displays a testimony with linked prayer, public badge, and sharing options
 */

import { useState } from 'react';
import Icon from '../../Icon';
import { useRequestPublicTestimony } from '../../../hooks/messaging/useTestimonies';
import { useUser } from '../../../hooks/useUser';
import type { Testimony } from '../../../types/messaging';
import styles from './TestimonyCard.module.scss';

interface TestimonyCardProps {
  testimony: Testimony;
  onClick?: () => void;
  showFullContent?: boolean;
  linkedPrayerTitle?: string;
}

export const TestimonyCard = ({
  testimony,
  onClick,
  showFullContent = false,
  linkedPrayerTitle,
}: TestimonyCardProps) => {
  const { user: currentUser } = useUser();
  const [showShareConfirm, setShowShareConfirm] = useState(false);

  const sharePublicMutation = useRequestPublicTestimony();

  const isAuthor = currentUser?.id === testimony.author.id;

  // Handle share publicly request
  const handleSharePublic = (e: React.MouseEvent) => {
    e.stopPropagation();

    sharePublicMutation.mutate(testimony.id, {
      onSuccess: () => {
        setShowShareConfirm(false);
      },
    });
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

  // Get approval status text
  const getApprovalStatus = () => {
    if (testimony.is_public && testimony.is_public_approved) {
      return 'Public - Approved';
    }
    if (testimony.is_public && !testimony.is_public_approved) {
      return 'Pending Approval';
    }
    return null;
  };

  const approvalStatus = getApprovalStatus();

  return (
    <article className={styles.testimonyCard} onClick={onClick}>
      {/* Header with badges */}
      <div className={styles.header}>
        <div className={styles.badges}>
          <span className={styles.testimonyBadge}>
            <Icon name="PraiseIcon" size={14} />
            <span>Testimony</span>
          </span>

          {/* Linked Prayer Badge */}
          {(testimony.answered_prayer || linkedPrayerTitle) && (
            <span className={styles.linkedPrayerBadge}>
              <Icon name="HandIcon" size={14} />
              <span>{linkedPrayerTitle || 'Answered Prayer'}</span>
            </span>
          )}
        </div>

        {/* Public/Approval Status */}
        {approvalStatus && (
          <div
            className={`${styles.statusBadge} ${
              testimony.is_public_approved ? styles.approved : styles.pending
            }`}
          >
            <Icon
              name={testimony.is_public_approved ? 'CheckMarkIcon' : 'ClockIcon'}
              size={14}
            />
            <span>{approvalStatus}</span>
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className={styles.title}>{testimony.title}</h3>

      {/* Content */}
      <p className={showFullContent ? styles.content : styles.contentPreview}>
        {testimony.content}
      </p>

      {/* Approved By (if public and approved) */}
      {testimony.is_public_approved && testimony.approved_by && testimony.approved_at && (
        <div className={styles.approvalInfo}>
          <Icon name="CheckMarkIcon" size={14} />
          <span>
            Approved by{' '}
            {testimony.approved_by.first_name && testimony.approved_by.last_name
              ? `${testimony.approved_by.first_name} ${testimony.approved_by.last_name}`
              : testimony.approved_by.username}{' '}
            on {new Date(testimony.approved_at).toLocaleDateString()}
          </span>
        </div>
      )}

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.meta}>
          <span className={styles.author}>
            {testimony.author.first_name && testimony.author.last_name
              ? `${testimony.author.first_name} ${testimony.author.last_name}`
              : testimony.author.username}
          </span>
          <span className={styles.separator}>•</span>
          <time dateTime={testimony.created_at}>{formatDate(testimony.created_at)}</time>
          {testimony.comment_count > 0 && (
            <>
              <span className={styles.separator}>•</span>
              <div className={styles.metaItem}>
                <Icon name="ChatBubbleIcon" size={14} />
                <span>{testimony.comment_count}</span>
              </div>
            </>
          )}
        </div>

        {/* Share Publicly Button (Author only, not yet public) */}
        {isAuthor && !testimony.is_public && !showShareConfirm && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowShareConfirm(true);
            }}
            className={styles.shareButton}
          >
            <Icon name="PeopleIcon" size={16} />
            <span>Share Publicly</span>
          </button>
        )}
      </div>

      {/* Share Confirmation (Author only) */}
      {showShareConfirm && isAuthor && (
        <div className={styles.shareConfirm} onClick={(e) => e.stopPropagation()}>
          <p className={styles.confirmMessage}>
            Share this testimony publicly? It will be visible to all users after leader approval.
          </p>
          <div className={styles.confirmActions}>
            <button
              type="button"
              onClick={handleSharePublic}
              className={styles.confirmButton}
              disabled={sharePublicMutation.isPending}
            >
              {sharePublicMutation.isPending ? 'Requesting...' : 'Request Approval'}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowShareConfirm(false);
              }}
              className={styles.cancelButton}
              disabled={sharePublicMutation.isPending}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </article>
  );
};
