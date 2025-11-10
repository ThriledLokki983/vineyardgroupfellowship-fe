import { useEffect, useRef, useState } from 'react';
import { Avatar, BackLink, Button, Icon, MessageMemberModal } from 'components';
import { useCurrentUser } from '../../hooks/useAuth';
import { canMessageMember } from '../../utils/messaging-permissions';
import type { GroupMember } from '../../types/group';
import styles from './ContactCard.module.scss';

interface ContactCardProps {
  data: GroupMember;
  hasParentFocus?: boolean;
  showActions?: boolean;
  enableNavigation?: boolean; // Allow navigating between related contacts
  groupId?: string; // Optional: enables messaging feature
  groupName?: string; // Optional: context for messaging
}

const DEFAULT_TOP_OFFSET = 'calc(1rem + (48px * 0.75))';
const DEFAULT_WIDTH = '320px';
const MARGIN = 20;

/**
 * ContactCard - Hover card for viewing member contact information
 * Designed for Vineyard Group Fellowship recovery community
 */
const ContactCard = ({
  data: initialData,
  hasParentFocus = false,
  showActions: _showActions = true,
  enableNavigation = false,
  groupId,
  groupName
}: ContactCardProps) => {
  const rootRef = useRef<HTMLElement>(null);
  const [hasFocus, setHasFocus] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [topOffset, setTopOffset] = useState(DEFAULT_TOP_OFFSET);
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [data, setData] = useState<GroupMember>(initialData);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const showTimeoutRef = useRef<number | null>(null);
  const hideTimeoutRef = useRef<number | null>(null);
  const { data: currentUser } = useCurrentUser();

  // Update data when initialData changes
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

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
    if (!enableNavigation) return;

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
   * Set visibility based on parent and internal focus
   * Add slight delay to prevent flickering on quick mouse movements
   */
  useEffect(() => {
    // Clear any existing timeouts
    if (showTimeoutRef.current) {
      window.clearTimeout(showTimeoutRef.current);
    }
    if (hideTimeoutRef.current) {
      window.clearTimeout(hideTimeoutRef.current);
    }

    const shouldShow = hasFocus || hasParentFocus;

    if (shouldShow) {
      // Show immediately or with tiny delay
      showTimeoutRef.current = window.setTimeout(() => {
        setIsVisible(true);
      }, 50); // 50ms delay for smoother feel
    } else {
      // Hide with slight delay to allow moving between avatar and card
      hideTimeoutRef.current = window.setTimeout(() => {
        setIsVisible(false);
      }, 100); // 100ms delay before hiding
    }

    // Cleanup timeouts on unmount
    return () => {
      if (showTimeoutRef.current) {
        window.clearTimeout(showTimeoutRef.current);
      }
      if (hideTimeoutRef.current) {
        window.clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [hasFocus, hasParentFocus]);

  /**
   * Make sure the card is never out of screen at the bottom or right
   * Position is reset when the card is hidden again
   * Intelligently positions the card relative to the avatar
   */
  useEffect(() => {
    if (!rootRef.current || !isVisible) {
      if (!isVisible) {
        setWidth(DEFAULT_WIDTH);
        setTopOffset(DEFAULT_TOP_OFFSET);
      }
      return;
    }

    const card = rootRef.current;
    const parent = card.parentElement;
    if (!parent) return;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const parentRect = parent.getBoundingClientRect();

    // Default position: to the right of avatar
    let leftPos = parentRect.width + 12; // 12px gap from avatar
    let topPos = 0;
    let cardWidth = 320;

    // Calculate if card would go off the right edge
    const wouldOverflowRight = parentRect.left + leftPos + cardWidth > windowWidth - MARGIN;

    // If it would overflow right, try positioning to the left
    if (wouldOverflowRight) {
      leftPos = -(cardWidth + 12); // Position to the left of avatar

      // If left position would go off screen, position to the right with adjusted width
      if (parentRect.left + leftPos < MARGIN) {
        leftPos = parentRect.width + 12; // Back to right side
        cardWidth = windowWidth - (parentRect.left + leftPos) - MARGIN - 10;
      }
    }

    // Check vertical positioning
    const cardRect = card.getBoundingClientRect();
    const wouldOverflowBottom = parentRect.top + cardRect.height > windowHeight - MARGIN;

    if (wouldOverflowBottom) {
      // Position above if it would overflow bottom
      const spaceAbove = parentRect.top - MARGIN;
      const spaceBelow = windowHeight - parentRect.bottom - MARGIN;

      if (spaceAbove > spaceBelow) {
        topPos = -(cardRect.height - parentRect.height);
      }
    }

    // Apply positioning
    card.style.left = `${leftPos}px`;
    card.style.top = `${topPos}px`;
    setWidth(`${cardWidth}px`);
  }, [isVisible]);

  /**
   * Hover handlers
   */
  const handleMouseOver = () => setHasFocus(true);
  const handleMouseLeave = () => setHasFocus(false);

  return (
    <>
    <article
      className={styles.root}
      style={{ top: topOffset, width }}
      ref={rootRef}
      hidden={!isVisible}
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
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
                onPress={() => setShowMessageModal(true)}
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

    {/* Message Modal */}
    {canMessage && groupId && (
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
