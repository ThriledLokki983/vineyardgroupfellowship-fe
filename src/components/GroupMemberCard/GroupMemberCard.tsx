import { useState } from 'react';
import Avatar from '../Avatar/Avatar';
import ContactCard from '../ContactCard/ContactCard';
import type { GroupMemberCardProps } from 'types';
import styles from './GroupMemberCard.module.scss';

/**
 * GroupMemberCard - Display card for a group member
 * Shows avatar, name, role, and status
 * Displays ContactCard on avatar hover
 */
export const GroupMemberCard = ({ member }: GroupMemberCardProps) => {
  const { first_name, last_name, role, status } = member;
  const [isHovered, setIsHovered] = useState(false);

  const fullName = `${first_name || ''} ${last_name || ''}`.trim() || 'Unknown Member';

  // Toggle Hover state
  const hoverToggleHandler = (state: boolean) => () => setIsHovered(state);

  // Map member data to ContactCard format (handle null values)
  const contactData = {
    ...member,
    photo_url: member.photo_url || undefined,
  };

  return (
    <div className={styles.card}>
      <div
        className={styles.avatarWrapper}
        onMouseEnter={hoverToggleHandler(true)}
        onMouseLeave={hoverToggleHandler(false)}
      >
        <Avatar
          profile={member}
          size="48px"
        />
        <ContactCard data={contactData} hasParentFocus={isHovered} />
      </div>
      <div className={styles.info}>
        <h4 className={styles.name}>{fullName}</h4>
        <div className={styles.meta}>
          <span className={styles.role} data-role={role}>
            {role === 'leader' ? 'Leader' : role === 'co_leader' ? 'Co-Leader' : 'Member'}
          </span>
          {status && (
            <span
              className={styles.status}
              data-status={status}
            >
              {status === 'active' ? 'Active' :
               status === 'pending' ? 'Pending' :
               status === 'inactive' ? 'Inactive' : status}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
