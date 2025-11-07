/**
 * PrayerTabPanel Component
 * Displays prayer requests for a group with two-layer architecture
 */

import { useState, useEffect, useRef } from 'react';
import { usePrayerRequests } from 'hooks/messaging';
import { ContentList, ContentDetail } from 'components/Messaging';
import { Icon } from 'components';
import styles from './DiscussionsTabPanel.module.scss';

interface PrayerTabPanelProps {
  groupId: string;
  isActiveMember: boolean;
  highlightedItemId?: string | null;
}

export const PrayerTabPanel = ({
  groupId,
  isActiveMember,
  highlightedItemId,
}: PrayerTabPanelProps) => {
  const [selectedPrayerId, setSelectedPrayerId] = useState<string | null>(null);
  const prayerRefs = useRef<Map<string, HTMLElement>>(new Map());

  // Fetch prayer requests for this group - disable when viewing a single prayer
  const { data: prayersData, isLoading } = usePrayerRequests(groupId, {
    ordering: '-created_at',
    enabled: !selectedPrayerId, // Only fetch when on list view
  });

  const prayers = prayersData?.results || [];

  // Handle scroll and highlight for deep-linked prayer
  useEffect(() => {
    if (highlightedItemId && prayerRefs.current.has(highlightedItemId)) {
      const element = prayerRefs.current.get(highlightedItemId);
      if (!element) return;

      // Wait for DOM to render
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add(styles.highlighted);

        // Remove highlight after 2 seconds
        setTimeout(() => {
          element.classList.remove(styles.highlighted);
        }, 2000);
      }, 100);
    }
  }, [highlightedItemId]);

  // Handle prayer selection
  const handlePrayerClick = (prayer: { id: string }) => {
    setSelectedPrayerId(prayer.id);
  };

  // Handle back to list
  const handleBackToList = () => {
    setSelectedPrayerId(null);
  };

  // Handle prayer deleted
  const handlePrayerDeleted = () => {
    setSelectedPrayerId(null);
  };

  // If not an active member, show message
  if (!isActiveMember) {
    return (
      <div className={styles.container}>
        <div className={styles.notMemberMessage}>
          <Icon name="PraiseIcon" size={48} />
          <h3>Join the Group to View Prayers</h3>
          <p>You need to be an active member to view and share prayer requests.</p>
        </div>
      </div>
    );
  }

  // Show selected prayer detail
  if (selectedPrayerId) {
    return (
      <div className={styles.container}>
        <ContentDetail
          itemId={selectedPrayerId}
          contentType="prayer"
          groupId={groupId}
          onBack={handleBackToList}
          onDeleted={handlePrayerDeleted}
        />
      </div>
    );
  }

  // Show prayer list
  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Prayer Requests</h2>
          <p className={styles.subtitle}>
            Share prayer needs and lift each other up in prayer
          </p>
        </div>
      </div>

      {/* Prayer List */}
      <ContentList
        items={prayers}
        contentType="prayer"
        groupId={groupId}
        isLoading={isLoading}
        onItemClick={handlePrayerClick}
        contentRefs={prayerRefs}
      />
    </div>
  );
};

export default PrayerTabPanel;
