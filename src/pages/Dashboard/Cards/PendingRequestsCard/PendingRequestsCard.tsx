/**
 * PendingRequestsCard Component
 *
 * Displays pending group join requests in the dashboard
 * Shows a list of groups where membership is awaiting approval
 */

import { DashboardCard } from '../DashboardCard/DashboardCard';
import { GroupSummaryCard } from '../GroupSummaryCard';
import type { GroupListItem } from '../../../../types';
import styles from './PendingRequestsCard.module.scss';

export interface PendingRequestsCardProps {
  pendingRequests: GroupListItem[];
  isLoading?: boolean;
}

export const PendingRequestsCard = ({
  pendingRequests,
  isLoading = false,
}: PendingRequestsCardProps) => {
  const hasPendingRequests = pendingRequests.length > 0;

  return (
    <DashboardCard
      emptyIconName="EmptyMailboxIcon"
      titleIconName="ClockIcon"
      title="Pending Requests"
      emptyMessage="You have no pending group requests at the moment."
      isEmpty={!hasPendingRequests}
      isLoading={isLoading}
    >
      {hasPendingRequests && (
        <div
          className={styles.requestsList}
          role="list"
          aria-label={`${pendingRequests.length} pending group request${pendingRequests.length === 1 ? '' : 's'}`}
        >
          {pendingRequests.map((group) => (
            <GroupSummaryCard
              key={group.id}
              groupData={group}
              showStatus={true}
            />
          ))}
        </div>
      )}
    </DashboardCard>
  );
};

export default PendingRequestsCard;
