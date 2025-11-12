import { useState, memo, Fragment, useMemo } from 'react';

import { Avatar, ContactCard, Icon, Button } from 'components';
import { Actions, RevokeActions } from '.';
import type { ProfileCardProps, ProfileActionsProps } from 'types';
import type { GroupMember } from 'src/types/group';

import styles from './ProfileCard.module.scss';

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
  const [isHoveredItem, setIsHoveredItem] = useState(false);

  const showActions = isHoveredItem;

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
        <div>
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
        <ContactCard data={profile as GroupMember} />
      ) : null}
    </li>
  )
};

export default memo(ProfileCard);

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

  // Wrapper functions that match the Actions component signatures
  const handleResendRequest = (
    _profileData: { id: string | number; email?: string; updated_at?: string | Date },
    _email?: string
  ) => {
    if (resendRequest) {
      resendRequest();
    }
  };

  const handleRevokeRequest = (_id: string | number) => {
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
