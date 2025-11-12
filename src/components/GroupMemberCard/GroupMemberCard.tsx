import { useState, memo, useRef } from 'react';
import Avatar from '../Avatar/Avatar';
import ContactCard from '../ContactCard/ContactCard';
import { MessageMemberModal } from 'components';
import { useCurrentUser } from '../../hooks/useAuth';
import { canMessageMember } from '../../utils/messaging-permissions';
import type { GroupMemberCardProps } from 'types';
import styles from './GroupMemberCard.module.scss';

/**
 * GroupMemberCard - Display card for a group member
 * Shows avatar, name, role, and status
 * Displays ContactCard in Popover on avatar hover
 * Shows message button for eligible members (when groupId provided)
 */
export const GroupMemberCard = memo(({ member, groupId, groupName }: GroupMemberCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const hideTimeoutRef = useRef<number | null>(null);

  const { first_name, last_name, role, status } = member;
  const [showMessageModal, setShowMessageModal] = useState(false);
  const { data: currentUser } = useCurrentUser();

  const fullName = `${first_name || ''} ${last_name || ''}`.trim() || 'Unknown Member';

  // Check if current user can message this member
  const messagingEnabled = groupId && currentUser;
  const { canMessage } = messagingEnabled
    ? canMessageMember(currentUser.id, member, [groupId])
    : { canMessage: false };

  // Map member data to ContactCard format (handle null values)
  const contactData = {
    ...member,
    photo_url: member.photo_url || undefined,
  };

  const handleOpenMessageModal = () => {
    setShowMessageModal(true);
  };

  // Clear any pending hide timeout
  const clearHideTimeout = () => {
    if (hideTimeoutRef.current) {
      window.clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  // Show contact card immediately
  const handleShowContact = () => {
    clearHideTimeout();
    setIsHovered(true);
  };

  // Delay hiding to allow moving to ContactCard
  const handleHideContact = () => {
    clearHideTimeout();
    hideTimeoutRef.current = window.setTimeout(() => {
      setIsHovered(false);
    }, 200); // 200ms delay
  };

  return (
    <>
      <li
        className={styles.root}
        data-contact-open={isHovered ? 'true' : 'false'}
        data-member-card
      >
        <article>
          <div
            className={styles.avatarWrapper}
            onMouseEnter={handleShowContact}
            onMouseLeave={handleHideContact}
          >
            <Avatar profile={member} size="48px" />
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

        {/* Message Button - always visible for eligible members */}
        {/* {canMessage && (
          <Button
            variant="secondary"
            onPress={handleOpenMessageModal}
            className={styles.messageButton}
            aria-label={`Message ${fullName}`}
          >
            <Icon name="ChatBubbleIcon" width={16} height={16} />
            <span className={styles.messageButtonText}>Message</span>
            </Button>
        )} */}
        </article>

        {/* ContactCard rendered inside article */}
        {member.id && isHovered ? (
          <div
            onMouseEnter={handleShowContact}
            onMouseLeave={handleHideContact}
          >
            <ContactCard
              data={contactData}
              groupId={groupId}
              groupName={groupName}
              onMessageClick={handleOpenMessageModal}
              hasParentFocus={isHovered}
            />
          </div>
        ) : null}
      </li>

      {/* Message Modal */}
      {canMessage && groupId && (
        <MessageMemberModal
          isOpen={showMessageModal}
          onClose={() => setShowMessageModal(false)}
          recipientName={fullName}
          recipientId={member.user_id}
          groupId={groupId}
          groupName={groupName}
        />
      )}
    </>
  );

});
