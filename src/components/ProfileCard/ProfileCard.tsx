import { useState, memo, Fragment, useMemo } from 'react';

import { Avatar, ContactCard, Icon, Button } from 'components';
import { Actions, RevokeActions } from '.';

import styles from './ProfileCard.module.scss';
import type { GroupMember } from 'src/types/group';

interface Profile {
    id: string;
    user_id: string;
    email: string;
    first_name: string
    last_name: string
    display_name: string
    photo_url: string
    role: string;
    status: string;
    joined_at: string;
    // Calendar access properties (optional for recovery app context)
    is_accepted?: boolean;
    is_accepted_by_requester?: boolean;
    allowedAccess?: boolean;
    just_sent?: boolean;
    just_in?: boolean;
}

interface ProfileCardProps {
  profile: Profile;
  revokeCalendarAccessRequest?: () => void;
  revokeExistingCalendarAccess?: () => void;
  resendRequest?: () => void;
}

/**
 * ProfileCard - Card component for displaying user profile information
 * with actions for managing calendar access requests
 */
const ProfileCard = ({
  revokeCalendarAccessRequest,
  revokeExistingCalendarAccess,
  resendRequest,
  profile,
}: ProfileCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isHoveredItem, setIsHoveredItem] = useState(false);

  console.log({ profile });


  const showActions = isHoveredItem;

  // Toggle Hover state
  const hoverToggleHandler = (state: boolean) => () => setIsHovered(state);

  /**
   * Toggle hover on the main item
   */
  const hoverToggleItemHandler = (state: boolean) => () => setIsHoveredItem(state);

  return (
    <li
      className={styles.root}
      onMouseEnter={hoverToggleItemHandler(true)}
      onMouseLeave={hoverToggleItemHandler(false)}
      data-pending={false}
    >
      <article>
        <div
          onMouseEnter={hoverToggleHandler(true)}
          onMouseLeave={hoverToggleHandler(false)}
        >
          <Avatar profile={profile as GroupMember} size="35px" />
        </div>
        <div className={styles.root__details}>
          <h3>{profile.display_name ? profile.display_name : profile.email}</h3>
          <span>{profile?.role || ''}</span>
        </div>
        <ProfileActions
          profile={profile}
          show={showActions}
          revokeCalendarAccessRequest={revokeCalendarAccessRequest}
          revokeExistingCalendarAccess={revokeExistingCalendarAccess}
          resendRequest={resendRequest}
        />
      </article>
      {profile?.display_name ? (
        <ContactCard data={profile as GroupMember} hasParentFocus={isHovered} />
      ) : null}
    </li>
  )
};

export default memo(ProfileCard);


interface ProfileActionsProps {
  profile: Profile;
  revokeCalendarAccessRequest?: () => void;
  revokeExistingCalendarAccess?: () => void;
  resendRequest?: () => void;
  show?: boolean;
}

const ProfileActions = ({
  revokeCalendarAccessRequest,
  resendRequest,
  profile,
  show = false,
}: ProfileActionsProps) => {

  const {
    is_accepted: isAccepted,
    is_accepted_by_requester: requesterAccepted,
    allowedAccess,
    just_sent: justSent,
    just_in: justIn,
  } = profile;

  // Create wrapper functions that match the expected signatures
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  const handleResendRequest = (..._args: any[]) => {
    if (resendRequest) {
      resendRequest();
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  const handleRevokeRequest = (..._args: any[]) => {
    if (revokeCalendarAccessRequest) {
      revokeCalendarAccessRequest();
    }
  };

  const content = useMemo(() => {
    if (isAccepted && !allowedAccess && !requesterAccepted) {
      return (
        <div className={styles.root__actions} data-just-sent>
          <Actions
            profile={profile as GroupMember}
            revokeCalendarAccessRequest={handleRevokeRequest}
            resendRequest={handleResendRequest}
          />
        </div>
      );
    }

    if (requesterAccepted && isAccepted) {
      return (
        <RevokeActions
          profile={profile}
          revokeExistingCalendarAccess={() => {}}
        />
      );
    }

    return (
      <Button variant="tertiary" isDisabled>
        <Icon name="CrossIcon" />
      </Button>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAccepted, allowedAccess, requesterAccepted, profile]);


  if (justSent) {
    return (
      <div className={styles.root__actions} data-just-sent>
        <Actions
          profile={profile as GroupMember}
          revokeCalendarAccessRequest={handleRevokeRequest}
          resendRequest={handleResendRequest}
        />
      </div>
    );
  }

  if (justIn) {
    return (
      <div className={styles.root__actions} data-just-sent>
        <Fragment>
          <span>New request received!</span>
        </Fragment>
      </div>
    );
  }

  return (
    <div className={styles.root__actions} data-hidden={!show && !isAccepted}>
      {content}
    </div>
  )
};
