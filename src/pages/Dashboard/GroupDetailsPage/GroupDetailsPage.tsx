/**
 * Group Details Page
 * Displays comprehensive information about a group
 */

import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useRef } from 'react';
import { getGroup, uploadGroupPhoto, joinGroup } from '../../../services/groupApi';
import { Layout, LoadingState, Icon, Button, GroupMemberCard } from 'components';
import { useAuthContext } from '../../../contexts/Auth/useAuthContext';
import { getEditGroupPath } from '../../../configs/paths';
import { getDisplayLocation, validateImageFile, shareGroup } from './helpers';
import styles from './GroupDetailsPage.module.scss';

export const GroupDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const queryClient = useQueryClient();
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: group, isLoading, error } = useQuery({
    queryKey: ['group', id],
    queryFn: () => getGroup(id!),
    enabled: !!id,
  });

  // Mutation for uploading group photo
  const uploadPhotoMutation = useMutation({
    mutationFn: (file: File) => uploadGroupPhoto(id!, file),
    onSuccess: (updatedGroup) => {
      // Update the cache with the new group data
      queryClient.setQueryData(['group', id], updatedGroup);
      queryClient.invalidateQueries({ queryKey: ['group', id] });
      console.log('✅ Photo uploaded successfully');
    },
    onError: (error) => {
      console.error('❌ Failed to upload photo:', error);
      // TODO: Show error toast notification
    },
  });

  // Mutation for joining a group
  const joinGroupMutation = useMutation({
    mutationFn: () => joinGroup(id!),
    onSuccess: () => {
      // Refresh group data to get updated membership status
      queryClient.invalidateQueries({ queryKey: ['group', id] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      console.log('✅ Join request sent successfully');
      // TODO: Show success toast notification
    },
    onError: (error) => {
      console.error('❌ Failed to join group:', error);
      // TODO: Show error toast notification
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
  const hasPendingRequest = membershipStatus === 'pending';
  const isActiveMember = membershipStatus === 'active' || membershipStatus === 'leader' || membershipStatus === 'co_leader';

  // Debug logging (development only)
  if (import.meta.env.DEV) {
    console.log('🔍 GroupDetails - Leadership Check:', {
      hasUser: !!user,
      hasGroup: !!group,
      userId: user?.id,
      canLeadGroups,
      membershipStatus: group?.membership_status,
      userMembership: group?.user_membership,
      myRole: group?.user_membership?.role,
      isGroupLeader,
      hasPendingRequest,
      isActiveMember,
      shouldShowJoinButton: !isActiveMember && !!user,
      shouldShowLeaderButtons: isGroupLeader
    });
  }  const handlePhotoClick = () => {
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
      // TODO: Show error toast
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
        console.log('Link copied to clipboard');
        // TODO: Show toast notification
      }
    }
  };

  const handleJoinGroup = async () => {
    if (!group) return;
    await joinGroupMutation.mutateAsync();
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
        </div>
      </Layout>
    );
  }

  return (
    <Layout variant="default">
      <div className={styles.groupDetailsPage}>
        {/* Group Info Header */}
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
          {/* Shows "Request Pending" (disabled) if user has pending request */}
          {/* Shows "Request to Join" if user has no membership */}
          {!isActiveMember && user && (
            <div className={styles.groupActions}>
              <Button
                variant="primary"
                onPress={handleJoinGroup}
                className={styles.actionButton}
                isDisabled={
                  hasPendingRequest ||
                  joinGroupMutation.isPending ||
                  !group.is_open ||
                  group.available_spots === 0
                }
              >
                <Icon
                  name={hasPendingRequest ? "ClockIcon" : "HandIcon"}
                  width={18}
                  height={18}
                />
                {hasPendingRequest
                  ? 'Request Pending'
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

        {/* Main Content */}
        <div className={styles.content}>
          {/* Description Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Icon name="BubbleIcon" />
              About This Group
            </h2>
            <p className={styles.description}>{group.description}</p>
          </section>

          {/* Meeting Details */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Icon name="CalendarIcon" />
              Meeting Information
            </h2>
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Meeting Day</span>
                <span className={styles.detailValue}>
                  <Icon name="CalendarTimeIcon" />
                  {group.meeting_day ? group.meeting_day.charAt(0).toUpperCase() + group.meeting_day.slice(1) : 'Not set'}
                </span>
              </div>

              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Meeting Time</span>
                <span className={styles.detailValue}>
                  <Icon name="ClockIcon" />
                  {group.meeting_time}
                </span>
              </div>

              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Location</span>
                <span className={styles.detailValue}>
                  {getDisplayLocation(group.location, isGroupLeader, isActiveMember || hasPendingRequest)}
                </span>
              </div>

              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Location Type</span>
                <span className={styles.detailValue}>
                  <Icon name="LocationIcon" />
                  {group.location_type === 'in_person' ? 'In Person' : group.location_type === 'virtual' ? 'Virtual' : 'Hybrid'}
                </span>
              </div>

              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Frequency</span>
                <span className={styles.detailValue}>
                  {group.meeting_frequency ? group.meeting_frequency.charAt(0).toUpperCase() + group.meeting_frequency.slice(1) : 'Not set'}
                </span>
              </div>
            </div>
          </section>

          {/* Focus Areas */}
          {group.focus_areas && group.focus_areas.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <Icon name="HandIcon" />
                Focus Areas
              </h2>
              <div className={styles.focusAreas}>
                {group.focus_areas.map((area, index) => (
                  <span key={index} className={styles.focusArea}>
                    {area}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Leadership */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Icon name="PersonOutlineIcon" />
              Leadership
            </h2>
            <div className={styles.leadership}>
              <div className={styles.leader}>
                <strong>Group Leader:</strong> {group.leader_info.display_name}
              </div>
              {group.co_leaders_info && group.co_leaders_info.length > 0 && (
                <div className={styles.coLeaders}>
                  <strong>Co-Leaders:</strong>
                  <ul>
                    {group.co_leaders_info.map((coLeader) => (
                      <li key={coLeader.id}>{coLeader.display_name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>

          {/* Group Members */}
          {group.group_members && group.group_members.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <Icon name="PeopleIcon" />
                Group Members ({group.group_members.length})
              </h2>
              <div className={styles.membersList}>
                {group.group_members.map((member) => (
                  <GroupMemberCard key={member.id} member={member} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default GroupDetailsPage;
