/**
 * FeedItemPreview Component
 *
 * Compact preview of a feed item for the dashboard
 * Displays content type, author, title, preview, and interaction counts
 * Clickable to navigate to the full item in GroupDetailsPage
 */

import { useNavigate } from 'react-router-dom';
import Icon from '../../../../components/Icon';
import type { FeedItem } from '../../../../types/messaging';
import {
  getContentTypeIcon,
  getContentTypeLabel,
  formatRelativeTime,
  truncate
} from '../../../../utils/helpers';
import { navigateToFeedItem } from '../../../../utils/navigation';
import styles from './FeedItemPreview.module.scss';

export interface FeedItemPreviewProps {
  item: FeedItem;
  onClick?: (item: FeedItem) => void;
}

export const FeedItemPreview = ({ item, onClick }: FeedItemPreviewProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick(item);
    } else {
      // Default navigation behavior
      navigateToFeedItem(item, navigate);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className={styles.feedItemPreview}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`View ${getContentTypeLabel(item.content_type)}: ${item.title}`}
    >
      {/* Header: Content type, author, timestamp */}
      <div className={styles.header}>
        <div className={styles.contentType}>
          <Icon name={getContentTypeIcon(item.content_type)} size={16} />
          <span>{getContentTypeLabel(item.content_type)}</span>
        </div>
        <div className={styles.meta}>
          <span className={styles.author}>@{item.author.username}</span>
          <span className={styles.separator}>•</span>
          <span className={styles.timestamp}>{formatRelativeTime(item.created_at)}</span>
        </div>
      </div>

      {/* Title */}
      <h4 className={styles.title}>{item.title}</h4>

      {/* Preview text */}
      {item.preview && (
        <p className={styles.preview}>{truncate(item.preview, 70)}</p>
      )}

      {/* Footer: Engagement metrics */}
      {/* <div className={styles.footer}>
        <div className={styles.stat}>
          <Icon name="ChatBubbleIcon" size={14} />
          <span>{item.comment_count}</span>
        </div>
        <div className={styles.stat}>
          <Icon name="PraiseIcon" size={14} />
          <span>{item.reaction_count}</span>
        </div>
        {item.is_pinned && (
          <div className={styles.pinned}>
            <Icon name="StarIconFill" size={14} />
            <span>Pinned</span>
          </div>
        )}
      </div> */}
    </div>
  );
};
