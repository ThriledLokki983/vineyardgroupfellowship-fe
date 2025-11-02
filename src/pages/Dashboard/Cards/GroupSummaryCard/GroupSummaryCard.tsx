import { Link } from 'react-router-dom';
import { Icon } from 'components';
import { getGroupDetailsPath } from 'configs/paths';
import type { GroupSummaryCardProps } from 'types';
import styles from './GroupSummaryCard.module.scss';

/**
 * Format time string from HH:MM:SS to HH:MM
 */
const formatTime = (time: string): string => {
  if (!time) return '';
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
        {groupData.description && groupData.description.length > 150
          ? `${groupData.description.substring(0, 150)}...`
          : groupData.description || 'No description available'}
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
          <span>{groupData.meeting_time ? formatTime(groupData.meeting_time) : 'Not set'}</span>
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
