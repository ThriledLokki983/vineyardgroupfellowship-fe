/**
 * ScriptureTabPanel Component
 * Displays scripture shares for a group with two-layer architecture
 */

import { useState, useEffect, useRef } from 'react';
import { useScriptures } from 'hooks/messaging';
import { ContentList, ContentDetail } from 'components/Messaging';
import { Icon } from 'components';
import styles from './DiscussionsTabPanel.module.scss';

interface ScriptureTabPanelProps {
  groupId: string;
  isActiveMember: boolean;
  highlightedItemId?: string | null;
}

export const ScriptureTabPanel = ({
  groupId,
  isActiveMember,
  highlightedItemId,
}: ScriptureTabPanelProps) => {
  const [selectedScriptureId, setSelectedScriptureId] = useState<string | null>(null);
  const scriptureRefs = useRef<Map<string, HTMLElement>>(new Map());

  // Fetch scriptures for this group - disable when viewing a single scripture
  const { data: scripturesData, isLoading } = useScriptures(groupId, {
    enabled: !selectedScriptureId, // Only fetch when on list view
  });

  const scriptures = scripturesData?.results || [];

  // Handle scroll and highlight for deep-linked scripture
  useEffect(() => {
    if (highlightedItemId && scriptureRefs.current.has(highlightedItemId)) {
      const element = scriptureRefs.current.get(highlightedItemId);
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

  // Handle scripture selection
  const handleScriptureClick = (scripture: { id: string }) => {
    setSelectedScriptureId(scripture.id);
  };

  // Handle back to list
  const handleBackToList = () => {
    setSelectedScriptureId(null);
  };

  // Handle scripture deleted
  const handleScriptureDeleted = () => {
    setSelectedScriptureId(null);
  };

  // If not an active member, show message
  if (!isActiveMember) {
    return (
      <div className={styles.container}>
        <div className={styles.notMemberMessage}>
          <Icon name="HandIcon" size={48} />
          <h3>Join the Group to View Scriptures</h3>
          <p>You need to be an active member to view scripture shares.</p>
        </div>
      </div>
    );
  }

  // Show selected scripture detail
  if (selectedScriptureId) {
    return (
      <div className={styles.container}>
        <ContentDetail
          itemId={selectedScriptureId}
          contentType="scripture"
          groupId={groupId}
          onBack={handleBackToList}
          onDeleted={handleScriptureDeleted}
        />
      </div>
    );
  }

  // Show scripture list
  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Scripture Shares</h2>
          <p className={styles.subtitle}>
            Share meaningful verses and reflections with your group
          </p>
        </div>
      </div>

      {/* Scripture List */}
      <ContentList
        items={scriptures}
        contentType="scripture"
        groupId={groupId}
        isLoading={isLoading}
        onItemClick={handleScriptureClick}
        contentRefs={scriptureRefs}
      />
    </div>
  );
};

export default ScriptureTabPanel;
