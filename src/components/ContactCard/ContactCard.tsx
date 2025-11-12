import { useEffect, useState, useRef } from 'react';
import { Avatar, BackLink, Button, Icon, MessageMemberModal } from 'components';
import { useCurrentUser } from '../../hooks/useAuth';
import { canMessageMember } from '../../utils/messaging-permissions';
import type { GroupMember } from '../../types/group';
import styles from './ContactCard.module.scss';

interface ContactCardProps {
  data: GroupMember;
  showActions?: boolean;
  enableNavigation?: boolean;
  groupId?: string; // Optional: enables messaging feature
  groupName?: string; // Optional: context for messaging
  onMessageClick?: () => void;
  hasParentFocus?: boolean;
}

const DEFAULT_TOP_OFFSET = 'calc(1rem + (32px * 0.75))';
const DEFAULT_WIDTH = '340px';
const MARGIN = 20;

/**
 * ContactCard - Card for viewing member contact information
 * Rendered inside React Aria Popover
 * Designed for Vineyard Group Fellowship recovery community
 */
const ContactCard = ({
  data: initialData,
  showActions: _showActions = true,
  groupId,
  groupName,
  onMessageClick,
  hasParentFocus = false
}: ContactCardProps) => {
    const rootRef = useRef<HTMLElement>(null);


    const [data, setData] = useState<GroupMember>(initialData);

  const [hasFocus, setHasFocus] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [topOffset, setTopOffset] = useState(DEFAULT_TOP_OFFSET);
  const [width, setWidth] = useState(DEFAULT_WIDTH)

  const [showMessageModal, setShowMessageModal] = useState(false);
  const { data: currentUser } = useCurrentUser();

  const displayName = `${data.first_name || ''} ${data.last_name || ''}`.trim() ||
                      data.display_name || data.email ||  'Unknown';

  const isViewingDifferentContact =  initialData.id !== data.id;

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

  /**
   * Set visibility based on parent and internal focus.
   */
  useEffect(() => {
    setIsVisible(hasFocus || hasParentFocus);
  }, [hasFocus, hasParentFocus]);



  /**
   * Make sure the card is never out of screen at the bottom or right.
   * Position is reset when the card is hidden again.
   */
  useEffect(() => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    if (!rootRef?.current) return;

    const rect = rootRef?.current?.getBoundingClientRect();
    const x = windowWidth - rect.right;
    const y = windowHeight - rect.bottom;
    if (x < MARGIN) {
      // Adding `10` extra for potential scrollbar.
      setWidth(`calc(${DEFAULT_WIDTH} - (${x + MARGIN + 10}px))`);
    }
    if (y < MARGIN) {
      setTopOffset(`${y + MARGIN}px`);
    }
    if (!isVisible) {
      setWidth(DEFAULT_WIDTH);
      setTopOffset(DEFAULT_TOP_OFFSET);
    }
  }, [isVisible]);


    /**
   * Avatar hover handlers.
   */
  const avatarMouseOverHandler = () => setHasFocus(true);
  const avatarMouseLeaveHandler = () => setHasFocus(false);

  return (
    <>
    <article
      className={styles.root}
      style={{ top: topOffset, width: width }}
      onClick={(e) => e.stopPropagation()}
      ref={rootRef}
      hidden={!isVisible}
      data-is-transitioning={isTransitioning}
      onMouseOver={avatarMouseOverHandler}
      onMouseLeave={avatarMouseLeaveHandler}
    >
      <div className={styles.inner}>
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
        {onMessageClick ? (
          <CardActions
          show={_showActions}
          canMessage={canMessage}
          email={data.email}
          onMessageClick={onMessageClick}
          setShowMessageModal={setShowMessageModal}
        />
        ) : null }

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

interface CardActionsProps {
  show: boolean;
  canMessage: boolean;
  email: string
  onMessageClick: () => void;
  setShowMessageModal: (show: boolean) => void;
}

const CardActions = ({
  show = false,
  canMessage = false,
  email = '',
  onMessageClick,
  setShowMessageModal
}: CardActionsProps) => {
  if (!show && !canMessage && !email) return null;

  return (
    <div className={styles.actions}>
      {show ? (
        <Button href={`mailto:${email}`} className={styles.actionButton} variant='secondary'>
          <Icon name="EmailIcon" />
          Email
        </Button>
      ) : null }

      {/* Message action */}
      {canMessage && (
        <Button
          variant="primary"
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
  );

};
