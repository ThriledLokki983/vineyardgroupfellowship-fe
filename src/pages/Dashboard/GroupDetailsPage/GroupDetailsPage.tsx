/**
 * Group Details Page
 * Displays comprehensive information about a group
 */

import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useRef } from 'react';
import { getGroup, uploadGroupPhoto, joinGroup } from 'services/groupApi';
import { Layout, LoadingState, Icon, Button, Tabs, Modal } from 'components';
import { toast } from 'components/Toast';
import { useAuthContext } from 'contexts/Auth/useAuthContext';
import { useMyGroups } from 'hooks/useMyGroups';
import { getEditGroupPath } from 'configs/paths';
import { validateImageFile, shareGroup } from './helpers';
import { GroupDetailsContent } from './GroupDetailsContent';
import { DiscussionsTabPanel } from './DiscussionsTabPanel';
import { ScriptureTabPanel } from './ScriptureTabPanel';
import { PrayerTabPanel } from './PrayerTabPanel';
import { TestimonyTabPanel } from './TestimonyTabPanel';
import { FeedView } from 'components/Messaging/Feed/FeedView';
import { QuickActionButton } from 'components/Messaging/QuickActions/QuickActionButton';
import { PrayerRequestForm } from 'components/Messaging/QuickActions/PrayerRequestForm';
import { TestimonyForm } from 'components/Messaging/QuickActions/TestimonyForm';
import { ScriptureShareForm } from 'components/Messaging/QuickActions/ScriptureShareForm';
import styles from './GroupDetailsPage.module.scss';

type ActiveModal = 'prayer' | 'testimony' | 'scripture' | null;

export const GroupDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuthContext();
  const queryClient = useQueryClient();
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get current tab from URL or default to 'details'
  const currentTab = searchParams.get('tab') || 'details';
  const contentType = searchParams.get('type'); // Content type filter for feed
  const contentId = searchParams.get('id'); // Specific item to highlight

  const { data: group, isLoading, error } = useQuery({
    queryKey: ['group', id],
    queryFn: () => getGroup(id!),
    enabled: !!id,
  });

  // Fetch user's groups to check for any pending requests
  const { data: myGroups } = useMyGroups();

  // Check if user has ANY pending join requests across all groups
  const hasAnyPendingRequest = myGroups?.some(
    (g) => g.membership_status === 'pending'
  ) || false;

  // Mutation for uploading group photo
  const uploadPhotoMutation = useMutation({
    mutationFn: (file: File) => uploadGroupPhoto(id!, file),
    onSuccess: (updatedGroup) => {
      // Update the cache with the new group data
      queryClient.setQueryData(['group', id], updatedGroup);
      queryClient.invalidateQueries({ queryKey: ['group', id] });
      toast.success('Photo uploaded successfully!');
    },
    onError: (error) => {
      console.error('❌ Failed to upload photo:', error);
      toast.error('Failed to upload photo. Please try again.');
    },
  });

  // Mutation for joining a group
  const joinGroupMutation = useMutation({
    mutationFn: () => joinGroup(id!),
    onSuccess: () => {
      // Refresh group data to get updated membership status
      queryClient.invalidateQueries({ queryKey: ['group', id] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      toast.success('Join request sent successfully!');
    },
    onError: (error) => {
      console.error('❌ Failed to join group:', error);
      toast.error('Failed to join group. Please try again.');
    },
  });

  // Check if current user is the group leader
  // SINGLE SOURCE OF TRUTH: user.leadership_info.can_lead_group
  // This determines if the user has permission to perform any leader actions
  const canLeadGroups = Boolean(user?.leadership_info?.can_lead_group);

  // Check if user is the leader of THIS specific group
  const isGroupLeader = Boolean(
    canLeadGroups && group &&
    group.user_membership && group.user_membership.role === 'leader'
  );

  // Check membership status using both membership_status (list view) and user_membership (detail view)
  const membershipStatus = group?.membership_status || group?.user_membership?.status;
  const hasPendingRequest = membershipStatus === 'pending'; // This group specifically
  const isActiveMember = membershipStatus === 'active' || membershipStatus === 'leader' || membershipStatus === 'co_leader';

  // Check if user has a pending request to a DIFFERENT group (not this one)
  const hasPendingRequestElsewhere = hasAnyPendingRequest && !hasPendingRequest;

  const handlePhotoClick = () => {
    if (isGroupLeader && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !group) return;

    // Validate file using helper function
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      console.error(`❌ ${validation.error}`);
      toast.error(validation.error || 'Invalid image file');
      return;
    }

    setUploadingPhoto(true);
    try {
      await uploadPhotoMutation.mutateAsync(file);
    } catch (err) {
      console.error('Failed to upload photo:', err);
    } finally {
      setUploadingPhoto(false);
      // Clear the file input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleEditGroup = () => {
    // Navigate to edit group page
    navigate(getEditGroupPath(id!));
  };

  const handleShareGroup = async () => {
    if (!group) return;

    const result = await shareGroup(group.name, id!);

    if (result.success) {
      if (result.method === 'clipboard') {
        toast.success('Group link copied to clipboard!');
      } else {
        toast.success('Share dialog opened');
      }
    } else {
      toast.error('Failed to share group');
    }
  };

  const handleJoinGroup = async () => {
    if (!group) return;
    await joinGroupMutation.mutateAsync();
  };

  // Handle tab change and update URL
  const handleTabChange = (tabId: string) => {
    setSearchParams({ tab: tabId });
  };

  if (isLoading) {
    return (
      <Layout variant="default">
        <LoadingState message="Loading group details..." />
      </Layout>
    );
  }

  if (error || !group) {
    return (
      <Layout variant="default">
        <div className={styles.error}>
          <Icon name="ExclamationCircleIcon" />
          <h2>Group Not Found</h2>
          <p>The group you're looking for doesn't exist or you don't have permission to view it.</p>
          <span>Try refreshing the page and if the problem persis, contact the admin on <a href='mailto:info@vineyardgroupfellowship.org'>vineyardgroupfellowship.org</a></span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout variant="default">
      <div className={styles.groupDetailsPage}>
        <header className={styles.groupInfoHeader}>
          <div
            className={`${styles.groupAvatar} ${isGroupLeader ? styles.groupAvatarEditable : ''}`}
            onClick={handlePhotoClick}
            role={isGroupLeader ? 'button' : undefined}
            tabIndex={isGroupLeader ? 0 : undefined}
            onKeyDown={(e) => {
              if (isGroupLeader && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                handlePhotoClick();
              }
            }}
          >
            {group.photo_url ? (
              <img
                src={group.photo_url}
                alt={group.name}
                className={styles.groupAvatarImage}
              />
            ) : (
              <span className={styles.groupAvatarPlaceholder}>
                {group.name?.[0] || 'G'}
              </span>
            )}
            {isGroupLeader && (
              <div className={styles.photoUploadOverlay}>
                <Icon name="PencilIcon" width={24} height={24} />
                <span>{uploadingPhoto ? 'Uploading...' : 'Change Photo'}</span>
              </div>
            )}
          </div>
          <div className={styles.groupDetails}>
            <h1 className={styles.groupName}>{group.name}</h1>
            <p className={styles.groupLeader}>
              Led by {group.leader_info.display_name}
            </p>
            <div className={styles.badges}>
              <span className={`${styles.badge} ${group.is_open ? styles.badgeOpen : styles.badgeClosed}`}>
                <Icon name={group.is_open ? 'CheckMarkFillIcon' : 'CrossIcon'} />
                {group.is_open ? 'Open' : 'Closed'}
              </span>
              <span className={styles.badge}>
                <Icon name="PersonOutlineIcon" />
                {group.current_member_count}/{group.member_limit} Members
              </span>
            </div>
          </div>

          {/* Group Actions - Only visible to group leaders */}
          {isGroupLeader && (
            <div className={styles.groupActions}>
              <Button
                variant="secondary"
                onPress={handleShareGroup}
                className={styles.actionButton}
              >
                <Icon name="PaperAirplane" width={18} height={18} />
                Share
              </Button>
              <Button
                variant="primary"
                onPress={handleEditGroup}
                className={styles.actionButton}
              >
                <Icon name="PencilIcon" width={18} height={18} />
                Edit Group
              </Button>
            </div>
          )}

          {/* Join Group Button - Visible to authenticated users who are not active members */}
          {/* Shows "Request Pending" (disabled) if user has pending request to THIS group */}
          {/* Shows "Request to Join" (disabled) if user has pending request to ANOTHER group */}
          {!isActiveMember && user && (
            <div className={styles.groupActions}>
              <Button
                variant="primary"
                onPress={handleJoinGroup}
                className={styles.actionButton}
                isDisabled={
                  hasAnyPendingRequest ||
                  joinGroupMutation.isPending ||
                  !group.is_open ||
                  group.available_spots === 0
                }
              >
                <Icon
                  name={hasPendingRequest ? "ClockIcon" : hasPendingRequestElsewhere ? "HandIcon" : "HandIcon"}
                  width={18}
                  height={18}
                />
                {hasPendingRequest
                  ? 'Request Pending'
                  : hasPendingRequestElsewhere
                    ? 'Request to Join'
                    : joinGroupMutation.isPending
                      ? 'Requesting...'
                      : !group.is_open
                        ? 'Group Closed'
                        : group.available_spots === 0
                          ? 'Group Full'
                          : 'Request to Join'}
              </Button>
            </div>
          )}

          {/* Hidden file input for photo upload */}
          {isGroupLeader && (
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              style={{ display: 'none' }}
              aria-label="Upload group photo"
            />
          )}
        </header>

        {/* Tabs Navigation */}
        <Tabs
          selectedKey={currentTab}
          onSelectionChange={(key) => handleTabChange(key as string)}
          aria-label="Group sections"
        >
          <Tabs.List>
            <Tabs.Tab id="details">Details</Tabs.Tab>
            <Tabs.Tab id="discussions">Discussions</Tabs.Tab>
            <Tabs.Tab id="scripture">Scripture</Tabs.Tab>
            <Tabs.Tab id="prayer">Prayers</Tabs.Tab>
            <Tabs.Tab id="testimony">Testimonies</Tabs.Tab>
            <Tabs.Tab id="feed">Feed</Tabs.Tab>
          </Tabs.List>

          {/* Details Tab Panel */}
          <Tabs.Panel id="details">
            <GroupDetailsContent
              group={group}
              isGroupLeader={isGroupLeader}
              isActiveMember={isActiveMember}
              hasPendingRequest={hasPendingRequest}
            />
          </Tabs.Panel>

          {/* Discussions Tab Panel */}
          <Tabs.Panel id="discussions">
            <DiscussionsTabPanel
              groupId={id!}
              isGroupLeader={isGroupLeader}
              isActiveMember={isActiveMember}
              highlightedDiscussionId={currentTab === 'discussions' ? contentId : undefined}
            />
          </Tabs.Panel>

          {/* Scripture Tab Panel */}
          <Tabs.Panel id="scripture">
            <ScriptureTabPanel
              groupId={id!}
              isActiveMember={isActiveMember}
              highlightedItemId={currentTab === 'scripture' ? contentId : undefined}
            />
          </Tabs.Panel>

          {/* Prayer Tab Panel */}
          <Tabs.Panel id="prayer">
            <PrayerTabPanel
              groupId={id!}
              isActiveMember={isActiveMember}
              highlightedItemId={currentTab === 'prayer' ? contentId : undefined}
            />
          </Tabs.Panel>

          {/* Testimony Tab Panel */}
          <Tabs.Panel id="testimony">
            <TestimonyTabPanel
              groupId={id!}
              isActiveMember={isActiveMember}
              highlightedItemId={currentTab === 'testimony' ? contentId : undefined}
            />
          </Tabs.Panel>

          {/* Feed Tab Panel */}
          <Tabs.Panel id="feed">
            <FeedView
              groupId={id!}
              initialContentType={contentType}
              highlightedItemId={currentTab === 'feed' ? contentId : undefined}
            />
          </Tabs.Panel>
        </Tabs>

        {/* Quick Action Button - visible on Discussions and Feed tabs only */}
        {isActiveMember && (
          <QuickActionButton
            onCreatePrayer={() => setActiveModal('prayer')}
            onCreateTestimony={() => setActiveModal('testimony')}
            onCreateScripture={() => setActiveModal('scripture')}
          />
        )}

        {/* Prayer Request Modal */}
        {activeModal === 'prayer' && (
          <Modal
            isOpen={true}
            onClose={() => setActiveModal(null)}
            title="New Prayer Request"
            size="md"
          >
            <PrayerRequestForm
              groupId={id!}
              onSuccess={() => setActiveModal(null)}
              onCancel={() => setActiveModal(null)}
            />
          </Modal>
        )}

        {/* Testimony Modal */}
        {activeModal === 'testimony' && (
          <Modal
            isOpen={true}
            onClose={() => setActiveModal(null)}
            title="Share a Testimony"
            size="md"
          >
            <TestimonyForm
              groupId={id!}
              onSuccess={() => setActiveModal(null)}
              onCancel={() => setActiveModal(null)}
            />
          </Modal>
        )}

        {/* Scripture Modal */}
        {activeModal === 'scripture' && (
          <Modal
            isOpen={true}
            onClose={() => setActiveModal(null)}
            title="Share Scripture"
            size="md"
          >
            <ScriptureShareForm
              groupId={id!}
              onSuccess={() => setActiveModal(null)}
              onCancel={() => setActiveModal(null)}
            />
          </Modal>
        )}
      </div>
    </Layout>
  );
};

export default GroupDetailsPage;
