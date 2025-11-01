import { useCallback, useState, useEffect } from 'react';
import { canResendRequest, getRelativeTime } from '../../../utils/utils';

import { ButtonSet, Button, Icon } from '../..';
import { useUser } from '../../../hooks/useUser';
import type { GroupMember } from 'src/types/group';

import styles from './Actions.module.scss';

interface Profile {
  id: string | number;
  updated_at?: string | Date;
  created_at?: string | Date;
  email?: string;
  requestSentAt?: string | Date;
}

interface ActionsProps {
  profile: GroupMember;
  revokeCalendarAccessRequest: (id: string | number) => void;
  resendRequest: (profile: Profile, email?: string) => void;
}

const Actions = ({
  profile,
  revokeCalendarAccessRequest,
  resendRequest,
 }: ActionsProps) => {
  const [time, setTime] = useState(getRelativeTime(profile?.updated_at || `${new Date()}`, { includeTime: false }));
  const {value: timeValue, label: timeLabel } = time as { value: number; label: string };
  const { user } = useUser();

  // recall the getRelativeTime function every 1 minute to update the time
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getRelativeTime(profile?.updated_at || `${new Date()}`, { includeTime: false }));
    }, 60000);
    return () => clearInterval(interval);
  }, [profile?.updated_at]);

  const handleRevokeAccessRequest = useCallback(() => {
    revokeCalendarAccessRequest(profile.id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleResendRequest = useCallback(() => {
    resendRequest(profile, user?.email);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className={styles.root}>
      <span>Request sent <strong>{timeValue} {timeLabel}</strong> ago.</span>
      <ButtonSet className={styles.root__actions}>
        <Button
          variant="tertiary"
          isDisabled={!canResendRequest(profile, 1440)} // 1440 minutes = 24 hours
          onPress={handleResendRequest}
        >
          <Icon name="ResendIcon" />
        </Button>
        <Button
          variant="tertiary"
          onPress={handleRevokeAccessRequest}
        >
          <Icon name="TrashIcon" />
        </Button>
      </ButtonSet>
    </section>
  )
};

export default Actions;

interface RevokeActionsProps {
  revokeExistingCalendarAccess: (email?: string) => void;
  profile: Profile;
}

export const RevokeActions = ({ revokeExistingCalendarAccess, profile }: RevokeActionsProps) => {
  const createdAt = profile?.created_at
    ? (typeof profile.created_at === 'string' ? profile.created_at : profile.created_at.toISOString())
    : new Date().toISOString();
  const {value: timeValue, label: timeLabel } = getRelativeTime(createdAt, { includeTime: false }) as { value: number; label: string };

  const handleRevokeExistingCalendarAccess = useCallback(() => {
    revokeExistingCalendarAccess(profile.email);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className={styles.root}>
      <span>Access granted <strong>{timeValue} {timeLabel}</strong> ago.</span>
      <ButtonSet className={styles.root__actions}>
        <Button variant="tertiary" onPress={handleRevokeExistingCalendarAccess}>
          <Icon name="TrashIcon" />
        </Button>
      </ButtonSet>
    </section>
  );
};
