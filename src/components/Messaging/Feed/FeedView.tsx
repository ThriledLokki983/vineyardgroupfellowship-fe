/**
 * FeedView Component
 * Unified activity stream displaying all content types (discussions, prayers, testimonies, scriptures)
 */

import { useState, useEffect, useRef } from 'react';
import { useFeed } from '../../../hooks/messaging/useFeed';
import { FilterButtonGroup, Icon } from 'components';
import type { FilterOption } from 'components';
import type { FeedContentType } from '../../../types/messaging';
import { formatRelativeDate, getContentTypeIcon, getContentTypeLabel, getContentTypeLabelPlural } from '../../../utils/helpers';
import styles from './FeedView.module.scss';

interface FeedViewProps {
  groupId: string;
  onItemClick?: (contentType: FeedContentType, contentId: string) => void;
  initialContentType?: string | null; // Initial content type filter from URL
  highlightedItemId?: string | null; // ID of item to highlight and scroll to
}

type ContentFilterType = FeedContentType | 'all';
type SortByType = 'newest' | 'pinned';

// Content type filter options
const contentTypeOptions: FilterOption<ContentFilterType>[] = [
  {
    value: 'all',
    label: 'All Activity',
    icon: <Icon name="InboxIcon" size={16} />,
  },
  {
    value: 'discussion',
    label: 'Discussions',
    icon: <Icon name="ChatBubbleIcon" size={16} />,
  },
  {
    value: 'prayer',
    label: 'Prayers',
    icon: <Icon name="HandIcon" size={16} />,
  },
  {
    value: 'testimony',
    label: 'Testimonies',
    icon: <Icon name="PraiseIcon" size={16} />,
  },
  {
    value: 'scripture',
    label: 'Scriptures',
    icon: <Icon name="AgendaCheck" size={16} />,
  },
];

// Sort options
const sortOptions: FilterOption<SortByType>[] = [
  {
    value: 'newest',
    label: 'Newest First',
    icon: <Icon name="ClockIcon" size={16} />,
  },
  {
    value: 'pinned',
    label: 'Pinned First',
    icon: <Icon name="StarIconFill" size={16} />,
  },
];

export const FeedView = ({
  groupId,
  onItemClick,
  initialContentType,
  highlightedItemId
}: FeedViewProps) => {
  // Set initial filter from URL parameter if provided
  const [contentTypeFilter, setContentTypeFilter] = useState<ContentFilterType>(
    (initialContentType as ContentFilterType) || 'all'
  );
  const [sortBy, setSortBy] = useState<SortByType>('newest');

  // Refs to track feed items for scrolling
  const itemRefs = useRef<Map<string, HTMLElement>>(new Map());

  // Fetch feed with auto-refresh every 30 seconds
  const { data, isLoading, isError, error } = useFeed(groupId, {
    content_type: contentTypeFilter === 'all' ? undefined : contentTypeFilter,
    refetchInterval: 30_000,
  });

  const feedItems = data?.results || [];

  // Scroll to and highlight item when highlightedItemId changes
  useEffect(() => {
    if (highlightedItemId && itemRefs.current.has(highlightedItemId)) {
      const element = itemRefs.current.get(highlightedItemId);
      if (element) {
        // Wait for DOM to be ready
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });

          // Add highlight effect
          element.classList.add(styles.highlighted);
          setTimeout(() => {
            element.classList.remove(styles.highlighted);
          }, 2000);
        }, 100);
      }
    }
  }, [highlightedItemId]);

  // Sort feed items
  const sortedItems = [...feedItems].sort((a, b) => {
    if (sortBy === 'pinned') {
      // Pinned items first
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;
    }
    // Then by date (newest first)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const handleItemClick = (item: typeof feedItems[0]) => {
    onItemClick?.(item.content_type, item.content_id);
  };

  if (isError) {
    return (
      <div className={styles.error} role="alert" aria-live="assertive">
        <Icon name="ExclamationTriangleIcon" size={32} />
        <p>Failed to load activity feed</p>
        <p className={styles.errorMessage}>
          {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.feedView}>
      {/* Screen reader announcement for highlighted item */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={styles.srOnly}
      >
        {highlightedItemId && 'Navigated to selected item'}
      </div>

      {/* Header with filters */}
      <div className={styles.header}>
        <h2 className={styles.title}>Activity Feed</h2>

        <div className={styles.filters}>
          {/* Content Type Filter */}
          <FilterButtonGroup
            label="Filter by"
            options={contentTypeOptions}
            value={contentTypeFilter}
            onChange={setContentTypeFilter}
          />

          {/* Sort Options */}
          <FilterButtonGroup
            label="Sort by"
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
          />
        </div>
      </div>

      {/* Feed Content */}
      {isLoading ? (
        <div className={styles.loading}>
          <div className={styles.skeleton} />
          <div className={styles.skeleton} />
          <div className={styles.skeleton} />
        </div>
      ) : sortedItems.length === 0 ? (
        <div className={styles.empty}>
          <Icon name="InboxIcon" size={48} />
          <h3>No activity yet</h3>
          <p>
            {contentTypeFilter === 'all'
              ? 'Be the first to share something with the group!'
              : `No ${getContentTypeLabelPlural(contentTypeFilter as FeedContentType)} have been shared yet.`}
          </p>
        </div>
      ) : (
        <div className={styles.feedList}>
          {sortedItems.map((item) => (
            <article
              key={item.id}
              ref={(el) => {
                if (el) {
                  itemRefs.current.set(item.id, el);
                } else {
                  itemRefs.current.delete(item.id);
                }
              }}
              className={`${styles.feedItem} ${item.is_pinned ? styles.pinned : ''}`}
              onClick={() => handleItemClick(item)}
            >
              {/* Content Type Badge */}
              <div className={styles.itemHeader}>
                <div className={styles.contentType}>
                  <Icon name={getContentTypeIcon(item.content_type)} size={16} />
                  <span>{getContentTypeLabel(item.content_type)}</span>
                </div>
                {item.is_pinned && (
                  <div className={styles.pinnedBadge}>
                    <Icon name="StarIconFill" size={14} />
                    <span>Pinned</span>
                  </div>
                )}
              </div>

              {/* Title */}
              <h3 className={styles.itemTitle}>{item.title}</h3>

              {/* Preview */}
              <p className={styles.itemPreview}>{item.preview}</p>

              {/* Footer */}
              <div className={styles.itemFooter}>
                <div className={styles.author}>
                  <span>
                    {item.author.first_name && item.author.last_name
                      ? `${item.author.first_name} ${item.author.last_name}`
                      : item.author.username}
                  </span>
                </div>
                <div className={styles.meta}>
                  <div className={styles.metaItem}>
                    <Icon name="ChatBubbleIcon" size={14} />
                    <span>{item.comment_count}</span>
                  </div>
                  {item.reaction_count > 0 && (
                    <div className={styles.metaItem}>
                      <Icon name="ThumbsUpIcon" size={14} />
                      <span>{item.reaction_count}</span>
                    </div>
                  )}
                  <time className={styles.timestamp} dateTime={item.created_at}>
                    {formatRelativeDate(item.created_at)}
                  </time>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
