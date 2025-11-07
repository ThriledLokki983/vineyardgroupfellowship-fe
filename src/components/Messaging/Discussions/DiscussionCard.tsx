/**
 * DiscussionCard Component
 * Displays a discussion preview in list view
 */

import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../Icon';
import type { Discussion } from '../../../types/messaging';
import styles from './DiscussionCard.module.scss';

interface DiscussionCardProps {
  discussion: Discussion;
  groupId: string;
  onClick?: () => void;
}

export const DiscussionCard: React.FC<DiscussionCardProps> = ({
  discussion,
  groupId,
  onClick,
}) => {
  // Format relative timestamp
  const relativeTime = useMemo(() => {
    const now = new Date();
    const createdAt = new Date(discussion.created_at);
    const diffMs = now.getTime() - createdAt.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }, [discussion.created_at]);

  // Truncate content for preview
  const contentPreview = useMemo(() => {
    const maxLength = 200;
    if (discussion.content.length <= maxLength) return discussion.content;
    return `${discussion.content.substring(0, maxLength)}...`;
  }, [discussion.content]);

  const CardContent = (
    <article
      className={`${styles.discussionCard} ${discussion.is_pinned ? styles.pinned : ''}`}
      onClick={onClick}
    >
      {/* Header */}
      <div className={styles.header}>
        <h3 className={styles.title}>
          {discussion.is_pinned && (
            <Icon name="StarIconFill" size={18} className={styles.pinnedIcon} />
          )}
          {discussion.title}
        </h3>
        <time className={styles.timestamp} dateTime={discussion.created_at}>
          {relativeTime}
        </time>
      </div>

      {/* Author */}
      <div className={styles.author}>
        <span className={styles.authorName}>
          {discussion.author.first_name && discussion.author.last_name
            ? `${discussion.author.first_name} ${discussion.author.last_name}`
            : discussion.author.username}
        </span>
      </div>

      {/* Content Preview */}
      <p className={styles.contentPreview}>{contentPreview}</p>

      {/* Footer Stats */}
      <div className={styles.footer}>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <Icon name="ChatBubbleIcon" size={16} />
            <span>{discussion.comment_count}</span>
          </div>
          <div className={styles.stat}>
            <Icon name="PraiseIcon" size={16} />
            <span>{discussion.reaction_count}</span>
          </div>
        </div>
      </div>
    </article>
  );

  // If onClick is provided, render as button; otherwise as Link
  if (onClick) {
    return (
      <button
        type="button"
        className={styles.cardButton}
        onClick={onClick}
        aria-label={`Open discussion: ${discussion.title}`}
      >
        {CardContent}
      </button>
    );
  }

  return (
    <Link
      to={`/groups/${groupId}/messages/discussions/${discussion.id}`}
      className={styles.cardLink}
      aria-label={`Open discussion: ${discussion.title}`}
    >
      {CardContent}
    </Link>
  );
};

export default DiscussionCard;
