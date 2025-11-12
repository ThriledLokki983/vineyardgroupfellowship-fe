import { useState } from 'react';
import { Avatar, BackLink, Button, Icon, MessageMemberModal } from 'components';
import { useCurrentUser } from '../../hooks/useAuth';
import { canMessageMember } from '../../utils/messaging-permissions';
import type { GroupMember } from '../../types/group';
import styles from './ContactCard.module.scss';

interface ContactCardProps {
  data: GroupMember;
  showActions?: boolean;
  enableNavigation?: boolean; // Allow navigating between related contacts
  groupId?: string; // Optional: enables messaging feature
  groupName?: string; // Optional: context for messaging
  onMessageClick?: () => void; // Optional: callback when message button clicked (for lifting state)
}

/**
 * ContactCard - Card for viewing member contact information
 * Rendered inside React Aria Popover
 * Designed for Vineyard Group Fellowship recovery community
 */
const ContactCard = ({
  data: initialData,
  showActions: _showActions = true,
  enableNavigation = false,
  groupId,
  groupName,
  onMessageClick
}: ContactCardProps) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [data, setData] = useState<GroupMember>(initialData);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const { data: currentUser } = useCurrentUser();

  const displayName = `${data.first_name || ''} ${data.last_name || ''}`.trim() ||
                      data.display_name || data.email ||  'Unknown';

  const isViewingDifferentContact = enableNavigation && initialData.id !== data.id;

  // Check if current user can message this member
  const messagingEnabled = groupId && currentUser;
  const { canMessage } = messagingEnabled
    ? canMessageMember(currentUser.id, data, [groupId])
    : { canMessage: false };

  /**
   * Swap to view a different contact with transition
   */
  const swapData = (newData: GroupMember) => {
    // if (!enableNavigation) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setData(newData);
      setIsTransitioning(false);
    }, 200);
  };

  /**
   * Return to original contact
   */
  const handleBackClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    swapData(initialData);
  };

  return (
    <>
    <article
      className={styles.root}
      onClick={(e) => e.stopPropagation()}
      data-is-transitioning={isTransitioning}
    >
      <div className={styles.inner}>
        {/* Back navigation - shown when viewing a different contact */}
        {isViewingDifferentContact && (
          <div className={styles.nav}>
            <BackLink onClick={handleBackClick}>Back</BackLink>
          </div>
        )}

        {/* Header with avatar and name */}
        <header className={styles.header}>
          <Avatar profile={initialData} size="56px" />
          <div className={styles.nameSection}>
            <h3 className={styles.name}>{displayName}</h3>
            {data.role && (
              <span className={styles.role} data-role={data.role}>
                {data.role === 'leader' ? 'Group Leader' :
                 data.role === 'co_leader' ? 'Co-Leader' :
                 'Member'}
              </span>
            )}
          </div>
        </header>

        {/* Contact metadata */}
        <ul className={styles.metadata}>
          {data.email && (
            <li>
              <Icon name="EmailIcon" />
              <a
                href={`mailto:${data.email}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {data.email}
              </a>
            </li>
          )}
          {data.phone_number && (
            <li>
              <Icon name="PhoneIcon" />
              <a href={`tel:${data.phone_number}`}>
                {data.phone_number}
              </a>
            </li>
          )}
          {data.status && (
            <li>
              <Icon name="CheckMarkIcon" />
              <span
                className={styles.status}
                data-status={data.status}
              >
                {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
              </span>
            </li>
          )}
          {data.profile_visibility && (
            <li>
              <Icon name="EyeIcon" />
              <span
                className={styles.profileVisibility}
                data-visibility={data.profile_visibility}
              >
                {data.profile_visibility === 'public' ? 'Public Profile' : 'Private Profile'}
              </span>
            </li>
          )}
        </ul>

        {/* Optional divider before actions */}
        {(_showActions || canMessage) && <hr className={styles.divider} />}

        {/* Actions section */}
        {(_showActions || canMessage) && (
          <div className={styles.actions}>
            {/* Email action */}
            {_showActions && data.email && (
              <a
                href={`mailto:${data.email}`}
                className={styles.actionButton}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="EmailIcon" />
                Email
              </a>
            )}

            {/* Message action */}
            {canMessage && (
              <Button
                variant="secondary"
                onPress={() => {
                  if (onMessageClick) {
                    onMessageClick();
                  } else {
                    setShowMessageModal(true);
                  }
                }}
                className={styles.actionButton}
              >
                <Icon name="ChatBubbleIcon" width={16} height={16} />
                Message
              </Button>
            )}
          </div>
        )}
      </div>
    </article>

    {/* Message Modal - only render when not using external callback (standalone mode) */}
    {canMessage && groupId && !onMessageClick && (
      <MessageMemberModal
        isOpen={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        recipientName={displayName}
        recipientId={data.user_id}
        groupId={groupId}
        groupName={groupName}
      />
    )}
  </>
  );

};

export default ContactCard;
