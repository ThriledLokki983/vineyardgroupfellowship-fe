import { useState, useRef } from 'react';
import { Button, Icon, toast, Avatar, InlineLoader } from 'components';
import type { PendingRequest } from '../../../../types/group';
import { useApproveRequest, useRejectRequest } from '../../../../hooks/usePendingRequests';
import { profileReview, modals } from '../../../../signals/ui-signals';
import { formatRelativeDate } from '../../../../utils/helpers';
import styles from './PendingRequestCard.module.scss';

interface PendingRequestCardProps {
  request: PendingRequest;
  groupId: string;
  groupName: string;
}


/**
 * PendingRequestCard Component
 * Displays a pending join request with approve/reject actions
 */
export const PendingRequestCard = ({ request, groupId }: PendingRequestCardProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);
  const approveRequest = useApproveRequest();
  const rejectRequest = useRejectRequest();

  const handleApprove = async () => {
    setIsProcessing(true);
    setShowActions(false);
    try {
      await approveRequest.mutateAsync({ groupId: groupId, membershipId: request.id });
      toast.success(`${request.display_name} has been approved!`);
    } catch (error) {
      console.error('Failed to approve request:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to approve request. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    setIsProcessing(true);
    setShowActions(false);
    try {
      await rejectRequest.mutateAsync({ groupId: groupId, membershipId: request.id });
      toast.success(`${request.display_name}'s request has been declined.`);
    } catch (error) {
      console.error('Failed to reject request:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to decline request. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const fullName = [request.first_name, request.last_name].filter(Boolean).join(' ') || request.display_name;

  const handleOpenProfile = () => {
    console.log('[PendingRequestCard] Opening profile for:', {
      userId: request.user_id,
      membershipId: request.id,
      groupId: groupId
    });
    profileReview.setRequest(request.user_id, request.id, groupId);
    console.log('[PendingRequestCard] Modal state after setRequest:', modals.profileReview.value.value);
  };

  return (
    <div className={styles.root}>
      {isProcessing && (
        <div className={styles.loadingOverlay}>
          <InlineLoader />
        </div>
      )}

      <div className={styles.content}>
        <Avatar profile={request} size={48} />

        <div className={styles.info}>
          <button type="button" onClick={handleOpenProfile} className={styles.nameLink}>
            <h4 className={styles.fullName}>{fullName}</h4>
            <p className={styles.displayName}>@{request.display_name}</p>
          </button>

          <p className={styles.timestamp}>
            <Icon name="ClockIcon" />
            <span>{formatRelativeDate(request.joined_at)}</span>
          </p>

          {request.message && (
            <div className={styles.message}>
              <Icon name="ChatBubble" />
              <p>{request.message}</p>
            </div>
          )}
        </div>
      </div>

      <div className={styles.actionsWrapper}>
        <button
          type="button"
          className={styles.moreButton}
          onClick={() => setShowActions(!showActions)}
          disabled={isProcessing}
          aria-label="Show actions"
        >
          <Icon name="SettingsDotIcon" />
        </button>

        {showActions && (
          <div ref={actionsRef} className={styles.actionsMenu}>
            <Button
              onPress={handleApprove}
              variant="primary"
              size="small"
              isDisabled={isProcessing}
              className={styles.actionButton}
            >
              <Icon name="CheckMarkIcon" />
              Approve
            </Button>
            <Button
              onPress={handleReject}
              variant="secondary"
              size="small"
              isDisabled={isProcessing}
              className={styles.actionButton}
            >
              <Icon name="MinusIcon" />
              Decline
            </Button>
          </div>
        )}
      </div>
    </div>
  );

};
