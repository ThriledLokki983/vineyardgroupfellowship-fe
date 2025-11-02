/**
 * PendingRequestCard Component
 * Displays a pending join request with approve/reject actions
 */

import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon, toast, Avatar } from 'components';
import type { PendingRequest } from '../../../../types/group';
import { useApproveRequest, useRejectRequest } from '../../../../hooks/usePendingRequests';
import styles from './PendingRequestCard.module.scss';

interface PendingRequestCardProps {
  request: PendingRequest;
  groupId: string;
  groupName: string;
}

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
      await approveRequest.mutateAsync({ groupId, membershipId: request.id });
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
      await rejectRequest.mutateAsync({ groupId, membershipId: request.id });
      toast.success(`${request.display_name}'s request has been declined.`);
    } catch (error) {
      console.error('Failed to reject request:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to decline request. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const fullName = [request.first_name, request.last_name].filter(Boolean).join(' ') || request.display_name;

  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <Avatar profile={request} size={48} />

        <div className={styles.info}>
          <Link to={`/profile/${request.user_id}`} className={styles.nameLink}>
            <h4 className={styles.fullName}>{fullName}</h4>
            <p className={styles.displayName}>@{request.display_name}</p>
          </Link>

          <p className={styles.timestamp}>
            <Icon name="ClockIcon" />
            <span>{formatDate(request.joined_at)}</span>
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
