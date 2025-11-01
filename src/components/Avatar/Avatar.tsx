import { useLayoutEffect, useMemo, useRef } from 'react';
import { normalizeImageUrl } from '../../lib/utils';
import type { GroupMember } from '../../types/group';

import styles from './Avatar.module.scss';

interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: string | number;
  profile?: GroupMember;
}

/**
 * Avatar - Display user/member avatar with image or initials
 * Designed for Vineyard Group Fellowship
 */
const Avatar = ({ size = '32px', profile, ...props }: AvatarProps) => {
  const rootRef = useRef<HTMLSpanElement>(null);

  /**
   * Set size CSS variable
   */
  useLayoutEffect(() => {
    const normalized = typeof size === 'number' ? `${size}px` : size;
    if (rootRef.current) {
      rootRef.current.style.setProperty('--avatar-size', normalized);
    }
  }, [size]);

  /**
   * Compose avatar image URL
   */
  const avatarUrl = useMemo(
    () => normalizeImageUrl(profile?.photo_url || ''),
    [profile?.photo_url],
  );

  const getInitials = (name: string) => {
    const namesArray = name.trim().split(' ');
    if (namesArray.length === 0) return '?';

    if (namesArray.length === 1) {
      return namesArray[0].charAt(0).toUpperCase();
    }

    const firstInitial = namesArray[0].charAt(0).toUpperCase();
    const lastInitial = namesArray[namesArray.length - 1].charAt(0).toUpperCase();

    return `${firstInitial + lastInitial}`.replace(/[^a-zA-Z0-9 ]/g, '');
  }

  const displayName = profile?.display_name || 'User';
  const initials = getInitials(`${profile?.first_name} ${profile?.last_name}`.trim() || displayName);

  return (
    <span
      className={styles.root}
      data-has-image={Boolean(avatarUrl)}
      ref={rootRef}
      {...props}
    >
      {avatarUrl ? (
        <img src={avatarUrl} alt={displayName} loading="lazy" />
      ) : (
        <span>{initials}</span>
      )}
    </span>
  );
};

export default Avatar;
