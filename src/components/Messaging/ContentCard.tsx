/**
 * ContentCard Component
 * Reusable card component for displaying content previews
 * Works for discussions, prayers, testimonies, and scriptures
 */

import { useMemo } from 'react';
import Icon from '../Icon';
import { formatRelativeTime, truncate } from '../../utils/helpers';
import type { Discussion, PrayerRequest, Testimony, Scripture } from '../../types/messaging';
import styles from './ContentCard.module.scss';

type ContentItem = Discussion | PrayerRequest | Testimony | Scripture;

interface ContentCardProps {
  content: ContentItem;
  contentType: 'discussion' | 'prayer' | 'testimony' | 'scripture';
  onClick?: () => void;
  isPinned?: boolean;
}

export const ContentCard: React.FC<ContentCardProps> = ({
  content,
  contentType,
  onClick,
  isPinned = false,
}) => {
  // Get title based on content type
  const title = useMemo(() => {
    if ('title' in content) return content.title;
    if (contentType === 'scripture' && 'reference' in content) {
      // For scripture, we'll render reference and translation separately
      return content.reference;
    }
    return 'Untitled';
  }, [content, contentType]);

  // Get translation for scripture (to be rendered inline)
  const translation = useMemo(() => {
    if (contentType === 'scripture' && 'translation' in content) {
      return content.translation;
    }
    return null;
  }, [content, contentType]);

  // Get content preview
  const contentPreview = useMemo(() => {
    if ('content' in content) return truncate(content.content, 200);
    if (contentType === 'scripture' && 'verse_text' in content) {
      return truncate(content.verse_text, 200);
    }
    return '';
  }, [content, contentType]);

  // Get author display name
  const authorName = useMemo(() => {
    const author = content.author;
    if (author.first_name && author.last_name) {
      return `${author.first_name} ${author.last_name}`;
    }
    return author.username;
  }, [content.author]);

  // Format relative time
  const relativeTime = formatRelativeTime(content.created_at);

  // Get comment count
  const commentCount = 'comment_count' in content ? content.comment_count : 0;

  // Get additional metadata based on type
  const metadata = useMemo(() => {
    if (contentType === 'prayer' && 'urgency' in content) {
      return {
        badge: content.urgency,
        badgeColor: content.urgency === 'urgent' ? 'orange' : content.urgency === 'critical' ? 'red' : undefined,
        isAnswered: content.is_answered,
        prayerCount: content.prayer_count,
      };
    }
    // Scripture translation is now shown inline with title, not as a badge
    return {};
  }, [content, contentType]);

  return (
    <article
      className={`${styles.contentCard} ${isPinned ? styles.pinned : ''} ${
        metadata.isAnswered ? styles.answered : ''
      }`}
      onClick={onClick}
    >
      {/* Header */}
      <div className={styles.header}>
        <h3 className={styles.title}>
          {isPinned && (
            <Icon name="StarIconFill" size={18} className={styles.pinnedIcon} />
          )}
          {metadata.isAnswered && contentType === 'prayer' && (
            <Icon name="CheckMarkIcon" size={18} className={styles.answeredIcon} />
          )}
          {title}
          {translation && <span className={styles.translationBadge}> ({translation})</span>}
        </h3>
        <time className={styles.timestamp} dateTime={content.created_at}>
          {relativeTime}
        </time>
      </div>

      {/* Metadata badges */}
      {metadata.badge && (
        <div className={styles.badges}>
          <span
            className={`${styles.badge} ${
              metadata.badgeColor ? styles[metadata.badgeColor] : ''
            }`}
          >
            {metadata.badge}
          </span>
        </div>
      )}

      {/* Author */}
      <div className={styles.author}>
        <span className={styles.authorName}>{authorName}</span>
      </div>

      {/* Content Preview */}
      <p className={styles.contentPreview}>{contentPreview}</p>

      {/* Footer Stats */}
      <div className={styles.footer}>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <Icon name="ChatBubbleIcon" size={16} />
            <span>{commentCount}</span>
          </div>
          {'reaction_count' in content && (
            <div className={`${styles.stat} ${styles.statBigger}`}>
              <Icon name="PraiseIcon" size={16} />
              <span>{content.reaction_count}</span>
            </div>
          )}
          {metadata.prayerCount !== undefined && (
            <div className={styles.stat}>
              <Icon name="HandIcon" size={16} />
              <span>{metadata.prayerCount} prayed</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default ContentCard;
