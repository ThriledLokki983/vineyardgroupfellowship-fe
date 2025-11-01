/**
 * Group Details Page
 * Displays comprehensive information about a group
 */

import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useRef } from 'react';
import { getGroup, uploadGroupPhoto } from '../../../services/groupApi';
import { Layout, LoadingState, Icon, Button, GroupMemberCard } from 'components';
import { useAuthContext } from '../../../contexts/Auth/useAuthContext';
import { getEditGroupPath } from '../../../configs/paths';
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

  // Check if current user is the group leader
  // Use user_membership.role for more reliable check
  const isGroupLeader = Boolean(
    user &&
    group &&
    group.user_membership &&
    group.user_membership.role === 'leader'
  );

  // Debug logging (development only)
  if (import.meta.env.DEV) {
    console.log('🔍 GroupDetails - Leadership Check:', {
      hasUser: !!user,
      hasGroup: !!group,
      userId: user?.id,
      groupLeaderId: group?.leader,
      userMembership: group?.user_membership,
      isGroupLeader
    });
  }

  const handlePhotoClick = () => {
    if (isGroupLeader && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !group) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.error('❌ Please select an image file');
      // TODO: Show error toast
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      console.error('❌ File size must be less than 5MB');
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

  const handleShareGroup = () => {
    // TODO: Implement share functionality (copy link, native share API, etc.)
    const shareUrl = `${window.location.origin}/groups/${id}`;

    if (navigator.share) {
      navigator.share({
        title: group?.name,
        text: `Join ${group?.name} on Vineyard Group Fellowship`,
        url: shareUrl,
      }).catch((err) => console.log('Error sharing:', err));
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareUrl).then(() => {
        console.log('Link copied to clipboard');
        // TODO: Show toast notification
      });
    }
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
                <span className={styles.detailValue}>{group.location}</span>
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
