/**
 * TestimonyTabPanel Component
 * Displays testimonies for a group with two-layer architecture
 */

import { useState, useEffect, useRef } from 'react';
import { useTestimonies } from 'hooks/messaging';
import { ContentList, ContentDetail } from 'components/Messaging';
import { Icon } from 'components';
import styles from './DiscussionsTabPanel.module.scss';

interface TestimonyTabPanelProps {
  groupId: string;
  isActiveMember: boolean;
  highlightedItemId?: string | null;
}

export const TestimonyTabPanel = ({
  groupId,
  isActiveMember,
  highlightedItemId,
}: TestimonyTabPanelProps) => {
  const [selectedTestimonyId, setSelectedTestimonyId] = useState<string | null>(null);
  const testimonyRefs = useRef<Map<string, HTMLElement>>(new Map());

  // Fetch testimonies for this group - disable when viewing a single testimony
  const { data: testimoniesData, isLoading } = useTestimonies(groupId, {
    ordering: '-created_at',
    enabled: !selectedTestimonyId, // Only fetch when on list view
  });

  const testimonies = testimoniesData?.results || [];

  // Handle scroll and highlight for deep-linked testimony
  useEffect(() => {
    if (highlightedItemId && testimonyRefs.current.has(highlightedItemId)) {
      const element = testimonyRefs.current.get(highlightedItemId);
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

  // Handle testimony selection
  const handleTestimonyClick = (testimony: { id: string }) => {
    setSelectedTestimonyId(testimony.id);
  };

  // Handle back to list
  const handleBackToList = () => {
    setSelectedTestimonyId(null);
  };

  // Handle testimony deleted
  const handleTestimonyDeleted = () => {
    setSelectedTestimonyId(null);
  };

  // If not an active member, show message
  if (!isActiveMember) {
    return (
      <div className={styles.container}>
        <div className={styles.notMemberMessage}>
          <Icon name="CelebrateIcon" size={48} />
          <h3>Join the Group to View Testimonies</h3>
          <p>You need to be an active member to view and share testimonies.</p>
        </div>
      </div>
    );
  }

  // Show selected testimony detail
  if (selectedTestimonyId) {
    return (
      <div className={styles.container}>
        <ContentDetail
          itemId={selectedTestimonyId}
          contentType="testimony"
          groupId={groupId}
          onBack={handleBackToList}
          onDeleted={handleTestimonyDeleted}
        />
      </div>
    );
  }

  // Show testimony list
  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Testimonies</h2>
          <p className={styles.subtitle}>
            Share stories of faith, hope, and answered prayers
          </p>
        </div>
      </div>

      {/* Testimony List */}
      <ContentList
        items={testimonies}
        contentType="testimony"
        groupId={groupId}
        isLoading={isLoading}
        onItemClick={handleTestimonyClick}
        contentRefs={testimonyRefs}
      />
    </div>
  );
};

export default TestimonyTabPanel;
