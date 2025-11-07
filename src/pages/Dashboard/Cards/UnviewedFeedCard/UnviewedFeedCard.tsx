/**
 * UnviewedFeedCard Component
 *
 * Dashboard card displaying recent unviewed feed items from user's group
 * Shows prayers, testimonies, scriptures, and discussions
 * Provides quick access to group activity without leaving dashboard
 */

import { useNavigate } from 'react-router-dom';
import { DashboardCard } from '../DashboardCard/DashboardCard';
import { FeedItemPreview } from './FeedItemPreview';
import { useUnviewedFeed, useMarkFeedViewed } from '../../../../hooks/messaging';
import { navigateToFeedItem } from '../../../../utils/navigation';
import type { FeedItem } from '../../../../types/messaging';
import styles from './UnviewedFeedCard.module.scss';

export interface UnviewedFeedCardProps {
  groupId: string;
  maxItems?: number;
  onViewAll?: () => void;
}

export const UnviewedFeedCard = ({
  groupId,
  maxItems = 5,
  onViewAll
}: UnviewedFeedCardProps) => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useUnviewedFeed(groupId, { maxItems });
  const { mutate: markViewed } = useMarkFeedViewed();

  // Client-side filter to ensure we only show unviewed items
  // This is a safety measure in case the backend returns viewed items
  const allItems = data?.results || [];
  const feedItems = allItems.filter(item => !item.has_viewed);
  const isEmpty = !isLoading && feedItems.length === 0;

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      // Navigate to feed tab in group details
      navigate(`/dashboard/group/${groupId}/feed`);
    }
  };

  const handleItemClick = (item: FeedItem) => {
    // Mark the feed item as viewed
    markViewed(item.id);

    // Navigate to the specific content item
    navigateToFeedItem(item, navigate);
  };

  return (
    <DashboardCard
      titleIconName="InboxIcon"
      title="Recent Activity"
      emptyIconName="EmptyMailboxIcon"
      emptyMessage="No new activity in your group"
      isEmpty={isEmpty}
      isLoading={isLoading}
      showActionButton={!isEmpty && !isLoading}
      actionButtonText="View All"
      onActionClick={handleViewAll}
			isSecondaryBtn={true}
    >
      {error && (
        <div className={styles.error} role="alert" aria-live="polite">
          <p>Unable to load activity. Please try again later.</p>
        </div>
      )}

      {!error && !isEmpty && (
        <div
          className={styles.feedList}
          role="list"
          aria-label="Recent group activity"
        >
          {feedItems.map((item) => (
            <FeedItemPreview
              key={item.id}
              item={item}
              onClick={() => handleItemClick(item)}
            />
          ))}
        </div>
      )}
    </DashboardCard>
  );
};
