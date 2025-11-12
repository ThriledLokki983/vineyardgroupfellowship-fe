import { useState, useRef } from 'react';
import { Popover } from 'react-aria-components';
import Avatar from '../Avatar/Avatar';
import ContactCard from '../ContactCard/ContactCard';
import { Button, Icon, MessageMemberModal } from 'components';
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
export const GroupMemberCard = ({ member, groupId, groupName }: GroupMemberCardProps) => {
  const { first_name, last_name, role, status } = member;
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);
  const popoverTimeoutRef = useRef<number | null>(null);
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

  // Clear any pending timeout
  const clearPopoverTimeout = () => {
    if (popoverTimeoutRef.current) {
      window.clearTimeout(popoverTimeoutRef.current);
      popoverTimeoutRef.current = null;
    }
  };

  // Show popover immediately on avatar hover
  const handleAvatarMouseEnter = () => {
    clearPopoverTimeout();
    setShowPopover(true);
  };

  // Delay hiding to allow moving to popover
  const handleAvatarMouseLeave = () => {
    clearPopoverTimeout();
    popoverTimeoutRef.current = window.setTimeout(() => {
      setShowPopover(false);
    }, 150);
  };

  // Keep popover open when hovering on it
  const handlePopoverMouseEnter = () => {
    clearPopoverTimeout();
    setShowPopover(true);
  };

  // Hide popover when leaving it
  const handlePopoverMouseLeave = () => {
    clearPopoverTimeout();
    setShowPopover(false);
  };

  return (
    <>
      <div className={styles.card}>
        {/* Avatar with Popover on hover */}
        <div
          ref={avatarRef}
          className={styles.avatarWrapper}
          onMouseEnter={handleAvatarMouseEnter}
          onMouseLeave={handleAvatarMouseLeave}
        >
          <Avatar
            profile={member}
            size="48px"
          />
        </div>

        {/* Popover positioned relative to avatar */}
        <Popover
          triggerRef={avatarRef}
          isOpen={showPopover}
          onOpenChange={setShowPopover}
          placement="right"
          offset={12}
          shouldFlip={true}
          containerPadding={12}
          className={styles.contactPopover}
          onMouseEnter={handlePopoverMouseEnter}
          onMouseLeave={handlePopoverMouseLeave}
        >
          <ContactCard
            data={contactData}
            groupId={groupId}
            groupName={groupName}
            onMessageClick={handleOpenMessageModal}
          />
        </Popover>

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
        {canMessage && (
          <Button
            variant="secondary"
            onPress={handleOpenMessageModal}
            className={styles.messageButton}
            aria-label={`Message ${fullName}`}
          >
            <Icon name="ChatBubbleIcon" width={16} height={16} />
            <span className={styles.messageButtonText}>Message</span>
          </Button>
        )}
      </div>

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
};
