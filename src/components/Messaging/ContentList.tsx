/**
 * ContentList Component
 * Reusable list component for displaying content items
 * Works for discussions, prayers, testimonies, and scriptures
 */

import { useState, useMemo } from 'react';
import { FilterButtonGroup, Icon } from 'components';
import type { FilterOption } from 'components';
import ContentCard from './ContentCard';
import type { Discussion, PrayerRequest, Testimony, Scripture } from '../../types/messaging';
import styles from './ContentList.module.scss';

type ContentItem = Discussion | PrayerRequest | Testimony | Scripture;

interface ContentListProps {
  items: ContentItem[];
  contentType: 'discussion' | 'prayer' | 'testimony' | 'scripture';
  groupId: string;
  isLoading?: boolean;
  onItemClick?: (item: ContentItem) => void;
  contentRefs?: React.MutableRefObject<Map<string, HTMLElement>>;
  showFilters?: boolean;
}

type SortOption = 'recent' | 'oldest';

const sortOptions: FilterOption<SortOption>[] = [
  {
    value: 'recent',
    label: 'Most Recent',
    icon: <Icon name="ClockIcon" size={16} />,
  },
  {
    value: 'oldest',
    label: 'Oldest First',
    icon: <Icon name="CalendarIcon" size={16} />,
  },
];

const ContentList = ({
  items,
  contentType,
  groupId: _groupId,
  isLoading = false,
  onItemClick,
  contentRefs,
  showFilters = true,
}: ContentListProps) => {
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  // Sort items based on selected option
  const sortedItems = useMemo(() => {
    const sorted = [...items];

    switch (sortBy) {
      case 'recent':
        sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'oldest':
        sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      default:
        break;
    }

    return sorted;
  }, [items, sortBy]);

  // Get pinned status
  const isPinned = (item: ContentItem) => {
    if ('is_pinned' in item) return item.is_pinned;
    return false;
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <p>Loading {contentType}s...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <Icon name="EmptyMailboxIcon" size={48} />
          <h3>No {contentType}s yet</h3>
          <p>Be the first to create a {contentType} in this group!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Sort Controls */}
      {showFilters && (
        <div className={styles.controls}>
          <FilterButtonGroup
            label="Sort by:"
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
          />
        </div>
      )}

      {/* Content List */}
      <div className={styles.list}>
        {sortedItems.map((item) => (
          <div
            key={item.id}
            ref={(el) => {
              if (contentRefs?.current) {
                if (el) {
                  contentRefs.current.set(item.id, el);
                } else {
                  contentRefs.current.delete(item.id);
                }
              }
            }}
          >
            <ContentCard
              content={item}
              contentType={contentType}
              onClick={onItemClick ? () => onItemClick(item) : undefined}
              isPinned={isPinned(item)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentList;
