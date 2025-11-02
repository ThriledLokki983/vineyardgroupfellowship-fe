/**
 * ProfileReviewModal Component
 * Modal for group leaders to review join request profiles and approve/decline
 */

import { useState, useMemo } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import { Modal, Button, Icon, Avatar, toast } from 'components';
import { useApproveRequest, useRejectRequest, usePendingRequests } from '../../hooks/usePendingRequests';
import { modals, profileReview } from '../../signals/ui-signals';
import { formatRelativeDate } from '../../utils/helpers';
import styles from './ProfileReviewModal.module.scss';

export const ProfileReviewModal = () => {
  useSignals();
  const [isProcessing, setIsProcessing] = useState(false);
  const approveRequest = useApproveRequest();
  const rejectRequest = useRejectRequest();

  // Get the request data from signals
  const userId = profileReview.userId.value;
  const membershipId = profileReview.membershipId.value;
  const groupId = profileReview.groupId.value;
  const isOpen = modals.profileReview.value.value;

  console.log('[ProfileReviewModal] Render:', { userId, membershipId, groupId, isOpen });

  // Fetch pending requests for this specific group
  const { data: requests } = usePendingRequests(groupId || undefined);

  // Find the specific request for this user/membership
  const request = useMemo(() => {
    if (!userId || !membershipId || !requests) return null;
    return requests.find(req =>
      req.user_id === userId && req.id === membershipId
    ) || null;
  }, [userId, membershipId, requests]);

  const handleClose = () => {
    profileReview.reset();
  };

  const handleApprove = async () => {
    if (!groupId || !membershipId || !request) return;

    setIsProcessing(true);
    try {
      await approveRequest.mutateAsync({ groupId, membershipId });
      toast.success(`${request.display_name} has been approved!`);
      handleClose();
    } catch (error) {
      console.error('Failed to approve request:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to approve request. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!groupId || !membershipId || !request) return;

    setIsProcessing(true);
    try {
      await rejectRequest.mutateAsync({ groupId, membershipId });
      toast.success(`${request.display_name}'s request has been declined.`);
      handleClose();
    } catch (error) {
      console.error('Failed to reject request:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to decline request. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  // Don't render if no request
  if (!request) return null;

  const fullName = [request.first_name, request.last_name].filter(Boolean).join(' ') || request.display_name;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Review Join Request"
      size="lg"
    >
      <div className={styles.modalContent}>
        {/* Header with Avatar and Actions */}
        <div className={styles.header}>
          <div className={styles.profileInfo}>
            <Avatar
              profile={request}
              size={80}
            />
            <div className={styles.nameSection}>
              <h2 className={styles.fullName}>{fullName}</h2>
              <p className={styles.displayName}>@{request.display_name}</p>
            </div>
          </div>

          {/* Action Buttons at Top */}
          <div className={styles.actions}>
            <Button
              onPress={handleApprove}
              variant="primary"
              isDisabled={isProcessing}
              className={styles.approveButton}
            >
              <Icon name="CheckMarkIcon" />
              Approve
            </Button>
            <Button
              onPress={handleReject}
              variant="secondary"
              isDisabled={isProcessing}
              className={styles.declineButton}
            >
              <Icon name="MinusIcon" />
              Decline
            </Button>
          </div>
        </div>

        {/* Profile Details */}
        <div className={styles.details}>
          {/* Contact Information */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Contact Information</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <Icon name="EmailIcon" />
                <div>
                  <span className={styles.label}>Email</span>
                  <span className={styles.value}>{request.email}</span>
                </div>
              </div>

              {request.phone_number && (
                <div className={styles.infoItem}>
                  <Icon name="PhoneIcon" />
                  <div>
                    <span className={styles.label}>Phone</span>
                    <span className={styles.value}>{request.phone_number}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Request Details */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Request Details</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <Icon name="ClockIcon" />
                <div>
                  <span className={styles.label}>Requested</span>
                  <span className={styles.value}>{formatRelativeDate(request.joined_at)}</span>
                </div>
              </div>

              <div className={styles.infoItem}>
                <Icon name="AvatarIcon" />
                <div>
                  <span className={styles.label}>Status</span>
                  <span className={styles.value}>
                    <span className={styles.statusBadge}>Pending Review</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Join Message */}
          {request.message && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Message from Applicant</h3>
              <div className={styles.messageBox}>
                <Icon name="ChatBubble" />
                <p className={styles.messageText}>{request.message}</p>
              </div>
            </div>
          )}

          {/* Bio */}
          {request.bio && (
            <div className={`${styles.section} ${styles.bio_section}`}>
              <h3 className={styles.sectionTitle}>About</h3>
              <p className={styles.bioText}>{request.bio}</p>
            </div>
          )}

          {/* Profile Visibility Notice */}
          <div className={styles.notice}>
            <Icon name="ExclamationCircleIcon" />
            <p>
              This member's profile visibility is set to <strong>{request.profile_visibility === 'public' ? 'Public' : request.profile_visibility === 'private' ? 'Private' : 'Community'}</strong>.
              {request.profile_visibility === 'private' && ' Some information may be limited.'}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};
