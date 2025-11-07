import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FeedView } from '../../../../../components/Messaging/Feed/FeedView';
import DiscussionList from '../../../../../components/Messaging/Discussions/DiscussionList';
import { QuickActionButton } from '../../../../../components/Messaging/QuickActions/QuickActionButton';
import { PrayerRequestForm } from '../../../../../components/Messaging/QuickActions/PrayerRequestForm';
import { TestimonyForm } from '../../../../../components/Messaging/QuickActions/TestimonyForm';
import { ScriptureShareForm } from '../../../../../components/Messaging/QuickActions/ScriptureShareForm';
import { Modal } from '../../../../../components/Modal';
import { useDiscussions } from '../../../../../hooks/messaging/useDiscussions';
import styles from './GroupMessagesPage.module.scss';

interface GroupMessagesPageProps {
  groupId: string;
  isGroupLeader: boolean;
  isActiveMember: boolean;
}

type ActiveTab = 'feed' | 'discussions';
type ActiveModal = 'prayer' | 'testimony' | 'scripture' | null;

/**
 * GroupMessagesPage - Main messaging interface for groups
 *
 * Features:
 * - Two-tab layout: Feed (all content) and Discussions (threaded conversations)
 * - Floating Action Button for creating content
 * - Modal-based forms for creating prayers, testimonies, and scriptures
 * - URL state management for tab persistence
 */
export function GroupMessagesPage({
  groupId,
  isActiveMember,
}: GroupMessagesPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  // Fetch discussions for the Discussions tab
  const { data: discussionsData, isLoading: isLoadingDiscussions } = useDiscussions(groupId);
  const discussions = discussionsData?.results || [];

  // Get active tab from URL params, default to 'feed'
  const activeTab = (searchParams.get('tab') as ActiveTab) || 'feed';

  const handleTabChange = (tab: ActiveTab) => {
    setSearchParams({ tab });
  };

  const handleOpenPrayerForm = () => {
    setActiveModal('prayer');
  };

  const handleOpenTestimonyForm = () => {
    setActiveModal('testimony');
  };

  const handleOpenScriptureForm = () => {
    setActiveModal('scripture');
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  const handleFormSuccess = () => {
    setActiveModal(null);
    // Feed will auto-refresh via TanStack Query
  };

  return (
    <div className={styles.container}>
      {/* Tab Navigation */}
      <div className={styles.tabNav}>
        <button
          type="button"
          className={`${styles.tab} ${activeTab === 'feed' ? styles.tabActive : ''}`}
          onClick={() => handleTabChange('feed')}
          aria-selected={activeTab === 'feed'}
          role="tab"
        >
          Feed
        </button>
        <button
          type="button"
          className={`${styles.tab} ${activeTab === 'discussions' ? styles.tabActive : ''}`}
          onClick={() => handleTabChange('discussions')}
          aria-selected={activeTab === 'discussions'}
          role="tab"
        >
          Discussions
        </button>
      </div>

      {/* Tab Content */}
      <div className={styles.content}>
        {activeTab === 'feed' && (
          <FeedView groupId={groupId} />
        )}

        {activeTab === 'discussions' && (
          <DiscussionList
            discussions={discussions}
            groupId={groupId}
            isLoading={isLoadingDiscussions}
          />
        )}
      </div>

      {/* Quick Action Button - visible on both tabs */}
      {isActiveMember && (
        <QuickActionButton
          onCreatePrayer={handleOpenPrayerForm}
          onCreateTestimony={handleOpenTestimonyForm}
          onCreateScripture={handleOpenScriptureForm}
        />
      )}

      {/* Prayer Request Modal */}
      {activeModal === 'prayer' && (
        <Modal
          isOpen={true}
          onClose={handleCloseModal}
          title="New Prayer Request"
          size="md"
        >
          <PrayerRequestForm
            groupId={groupId}
            onSuccess={handleFormSuccess}
            onCancel={handleCloseModal}
          />
        </Modal>
      )}

      {/* Testimony Modal */}
      {activeModal === 'testimony' && (
        <Modal
          isOpen={true}
          onClose={handleCloseModal}
          title="Share a Testimony"
          size="md"
        >
          <TestimonyForm
            groupId={groupId}
            onSuccess={handleFormSuccess}
            onCancel={handleCloseModal}
          />
        </Modal>
      )}

      {/* Scripture Modal */}
      {activeModal === 'scripture' && (
        <Modal
          isOpen={true}
          onClose={handleCloseModal}
          title="Share Scripture"
          size="md"
        >
          <ScriptureShareForm
            groupId={groupId}
            onSuccess={handleFormSuccess}
            onCancel={handleCloseModal}
          />
        </Modal>
      )}
    </div>
  );
}
