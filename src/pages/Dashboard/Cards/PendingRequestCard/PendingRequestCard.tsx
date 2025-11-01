/**
 * PendingRequestCard Component
 * Displays a pending join request with approve/reject actions
 */

import { useState } from 'react';
import { Button, Icon } from 'components';
import type { PendingRequest } from '../../../../types/group';
import { useApproveRequest, useRejectRequest } from '../../../../hooks/usePendingRequests';
import styles from './PendingRequestCard.module.scss';

interface PendingRequestCardProps {
  request: PendingRequest;
  groupId: string;
  groupName: string;
}

export const PendingRequestCard = ({ request, groupId, groupName }: PendingRequestCardProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const approveRequest = useApproveRequest();
  const rejectRequest = useRejectRequest();

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      await approveRequest.mutateAsync({ groupId, membershipId: request.id });
      // Success - show toast notification (TODO: implement toast)
      console.log(`Approved ${request.display_name} for ${groupName}`);
    } catch (error) {
      console.error('Failed to approve request:', error);
      // Error - show error toast (TODO: implement toast)
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    setIsProcessing(true);
    try {
      await rejectRequest.mutateAsync({ groupId, membershipId: request.id });
      // Success - show toast notification (TODO: implement toast)
      console.log(`Rejected ${request.display_name} for ${groupName}`);
    } catch (error) {
      console.error('Failed to reject request:', error);
      // Error - show error toast (TODO: implement toast)
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

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            {request.photo_url ? (
              <img src={request.photo_url} alt={request.display_name} />
            ) : (
              <Icon name="AvatarIcon" />
            )}
          </div>
          <div className={styles.details}>
            <h4 className={styles.name}>{request.display_name}</h4>
            <p className={styles.meta}>
              <Icon name="ClockIcon" />
              <span>{formatDate(request.joined_at)}</span>
            </p>
          </div>
        </div>
        <div className={styles.groupBadge}>
          <Icon name="HandIcon" />
          <span>{groupName}</span>
        </div>
      </div>

      {request.message && (
        <div className={styles.message}>
          <Icon name="ChatBubble" />
          <p>{request.message}</p>
        </div>
      )}

      <div className={styles.actions}>
        <Button
          onPress={handleApprove}
          variant="primary"
          size="small"
          isDisabled={isProcessing}
        >
          {approveRequest.isPending ? 'Approving...' : (
            <>
              <Icon name="CheckMarkIcon" />
              Approve
            </>
          )}
        </Button>
        <Button
          onPress={handleReject}
          variant="secondary"
          size="small"
          isDisabled={isProcessing}
        >
          {rejectRequest.isPending ? 'Declining...' : (
            <>
              <Icon name="MinusIcon" />
              Decline
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
