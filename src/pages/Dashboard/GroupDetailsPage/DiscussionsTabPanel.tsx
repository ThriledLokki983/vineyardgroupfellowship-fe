/**
 * DiscussionsTabPanel Component
 * Displays discussions for a group with create discussion button for leaders
 */

import { useState } from 'react';
import { useDiscussions } from 'hooks/messaging';
import { DiscussionList, DiscussionThread, CreateDiscussionModal } from 'components/Messaging/Discussions';
import { Button, Icon } from 'components';
import styles from './DiscussionsTabPanel.module.scss';

interface DiscussionsTabPanelProps {
  groupId: string;
  isGroupLeader: boolean;
  isActiveMember: boolean;
}

export const DiscussionsTabPanel = ({
  groupId,
  isGroupLeader,
  isActiveMember,
}: DiscussionsTabPanelProps) => {
  const [selectedDiscussionId, setSelectedDiscussionId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fetch discussions for this group - disable when viewing a single thread
  const { data: discussionsData, isLoading } = useDiscussions(groupId, {
    ordering: '-created_at',
    enabled: !selectedDiscussionId, // Only fetch when on list view
  });

  const discussions = discussionsData?.results || [];

  // Handle discussion selection
  const handleDiscussionClick = (discussionId: string) => {
    setSelectedDiscussionId(discussionId);
  };

  // Handle back to list
  const handleBackToList = () => {
    setSelectedDiscussionId(null);
  };

  // Handle successful discussion creation
  const handleDiscussionCreated = () => {
    // Modal will close automatically
    // Discussion list will refetch automatically via TanStack Query
  };

  // Handle discussion deleted
  const handleDiscussionDeleted = () => {
    // Go back to list
    setSelectedDiscussionId(null);
  };

  // If not an active member, show message
  if (!isActiveMember) {
    return (
      <div className={styles.container}>
        <div className={styles.notMemberMessage}>
          <Icon name="BubbleIcon" size={48} />
          <h3>Join the Group to Participate</h3>
          <p>You need to be an active member to view and participate in group discussions.</p>
        </div>
      </div>
    );
  }

  // Show selected discussion thread
  if (selectedDiscussionId) {
    return (
      <div className={styles.container}>
        <DiscussionThread
          discussionId={selectedDiscussionId}
          groupId={groupId}
          onBack={handleBackToList}
          onDeleted={handleDiscussionDeleted}
        />
      </div>
    );
  }

  // Show discussion list
  return (
    <div className={styles.container}>
      {/* Header with Create Button */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Discussions</h2>
          <p className={styles.subtitle}>
            Share thoughts, ask questions, and connect with your group
          </p>
        </div>
        {isGroupLeader && (
          <Button onPress={() => setIsCreateModalOpen(true)} className={styles.createButton}>
            <Icon name="PlusIcon" size={20} />
            New Discussion
          </Button>
        )}
      </div>

      {/* Discussion List */}
      <DiscussionList
        discussions={discussions}
        groupId={groupId}
        isLoading={isLoading}
        onDiscussionClick={(discussion) => handleDiscussionClick(discussion.id)}
      />

      {/* Create Discussion Modal (Leaders Only) */}
      {isGroupLeader && (
        <CreateDiscussionModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          groupId={groupId}
          onSuccess={handleDiscussionCreated}
        />
      )}
    </div>
  );
};

export default DiscussionsTabPanel;
