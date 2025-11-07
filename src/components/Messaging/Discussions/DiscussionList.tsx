/**
 * DiscussionList Component
 * Displays a list of discussions with sorting and filtering
 */

import { useMemo, useState } from 'react';
import { FilterButtonGroup, Icon } from 'components';
import type { FilterOption } from 'components';
import DiscussionCard from './DiscussionCard';
import type { Discussion } from 'types/messaging';
import styles from './DiscussionList.module.scss';

interface DiscussionListProps {
  discussions: Discussion[];
  groupId: string;
  isLoading?: boolean;
  onDiscussionClick?: (discussion: Discussion) => void;
  discussionRefs?: React.RefObject<Map<string, HTMLElement>>;
}

type SortOption = 'recent' | 'popular' | 'oldest';

const sortOptions: FilterOption<SortOption>[] = [
  {
    value: 'recent',
    label: 'Most Recent',
    icon: <Icon name="ClockIcon" size={16} />,
  },
  {
    value: 'popular',
    label: 'Most Popular',
    icon: <Icon name="StarIconFill" size={16} />,
  },
  {
    value: 'oldest',
    label: 'Oldest First',
    icon: <Icon name="CalendarIcon" size={16} />,
  },
];

const DiscussionList = ({
  discussions,
  groupId,
  isLoading = false,
  onDiscussionClick,
  discussionRefs,
}: DiscussionListProps) => {
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  // Sort discussions based on selected option
  const sortedDiscussions = useMemo(() => {
    const sorted = [...discussions];

    // Always put pinned discussions first
    sorted.sort((a, b) => {
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;

      // Then sort by the selected criteria
      switch (sortBy) {
        case 'recent':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'popular': {
          // Sort by engagement (comments + reactions)
          const aEngagement = a.comment_count + a.reaction_count;
          const bEngagement = b.comment_count + b.reaction_count;
          return bEngagement - aEngagement;
        }
        default:
          return 0;
      }
    });

    return sorted;
  }, [discussions, sortBy]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <p>Loading discussions...</p>
        </div>
      </div>
    );
  }

  if (discussions.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <h3>No discussions yet</h3>
          <p>Be the first to start a conversation in this group!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Sort Controls */}
      <div className={styles.controls}>
        <FilterButtonGroup
          label="Sort by:"
          options={sortOptions}
          value={sortBy}
          onChange={setSortBy}
        />
      </div>

      {/* Discussion List */}
      <div className={styles.list}>
        {sortedDiscussions.map((discussion) => (
          <div
            key={discussion.id}
            ref={(el) => {
              if (discussionRefs?.current) {
                if (el) {
                  discussionRefs.current.set(discussion.id, el);
                } else {
                  discussionRefs.current.delete(discussion.id);
                }
              }
            }}
          >
            <DiscussionCard
              discussion={discussion}
              groupId={groupId}
              onClick={onDiscussionClick ? () => onDiscussionClick(discussion) : undefined}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscussionList;
