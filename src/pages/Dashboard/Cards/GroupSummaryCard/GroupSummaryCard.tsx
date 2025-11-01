import { Link } from 'react-router-dom';
import { Icon } from 'components';
import { getGroupDetailsPath } from 'configs/paths';

import styles from './GroupSummaryCard.module.scss';

interface GroupSummaryCardProps {
  groupData: {
    id: string;
    name: string;
    description: string;
    location: string;
    location_type: 'in_person' | 'virtual' | 'hybrid';
    meeting_time: string;
    is_open: boolean;
    current_member_count: number;
    member_limit: number;
    available_spots: number;
    photo_url: string | null;
    membership_status?: 'pending' | 'active' | 'inactive' | 'removed' | 'leader' | 'co_leader' | null;
  };
  showStatus?: boolean; // Whether to show pending/active status badge
}

/**
 * Format time string from HH:MM:SS to HH:MM
 */
const formatTime = (time: string): string => {
  if (!time) return '';
  // Remove seconds if present (e.g., "19:30:00" -> "19:30")
  return time.substring(0, 5);
};

export const GroupSummaryCard = ({ groupData, showStatus = false }: GroupSummaryCardProps) => {
  const isPending = groupData.membership_status === 'pending';
  const isLeader = groupData.membership_status === 'leader' || groupData.membership_status === 'co_leader';

  return (
    <article className={styles.groupSummaryCard}>
      {/* Status Badge for Pending Requests */}
      {showStatus && isPending && (
        <div className={styles.pendingBadge}>
          <Icon name="ClockIcon" width={16} height={16} />
          <span>Pending Approval</span>
        </div>
      )}

      {/* Status Badge for Leaders */}
      {showStatus && isLeader && (
        <div className={styles.leaderBadge}>
          <Icon name="PersonOutlineIcon" width={16} height={16} />
          <span>{groupData.membership_status === 'leader' ? 'Leader' : 'Co-Leader'}</span>
        </div>
      )}

      {/* Group Header */}
      <div className={styles.groupHeader}>
        <h3 className={styles.groupName}>{groupData.name}</h3>
        <span className={`${styles.groupStatus} ${groupData.is_open ? styles.statusOpen : styles.statusClosed}`}>
          {groupData.is_open ? 'Open' : 'Closed'}
        </span>
      </div>

      {/* Group Description */}
      <p className={styles.groupDescription}>
        {groupData.description.length > 150
          ? `${groupData.description.substring(0, 150)}...`
          : groupData.description}
      </p>

      {/* Group Details */}
      <div className={styles.groupDetails}>
        <div className={styles.groupDetail}>
          <Icon name="LocationIcon" width={18} height={18} />
          <span>
            {groupData.location_type === 'in_person'
              ? 'In Person'
              : groupData.location_type === 'virtual'
                ? 'Virtual'
                : 'Hybrid'}
          </span>
        </div>
        <div className={styles.groupDetail}>
          <Icon name="ClockIcon" width={18} height={18} />
          <span>{formatTime(groupData.meeting_time)}</span>
        </div>
        <div className={styles.groupDetail}>
          <Icon name="PersonOutlineIcon" width={18} height={18} />
          <span>
            {groupData.current_member_count}/{groupData.member_limit} members
          </span>
        </div>
      </div>

      {/* View Details Link */}
      <Link to={getGroupDetailsPath(groupData.id)} className={styles.viewDetailsLink}>
        <span>View Full Details</span>
        <Icon name="ArrowRight" width={18} height={18} />
      </Link>
    </article>
  );
};

export default GroupSummaryCard;
