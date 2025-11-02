/**
 * Helper functions for ProfileCard component
 */

/**
 * Check if a friend request can be resent based on hours elapsed
 * @param profile - The user profile
 * @param hours - Number of hours to wait before allowing resend
 * @returns boolean indicating if request can be resent
 */
export const canResendRequest = (profile: { requestSentAt?: string | Date }, hours: number = 24): boolean => {
  if (!profile?.requestSentAt) {
    return false;
  }

  const sentAt = new Date(profile.requestSentAt).getTime();
  const now = new Date().getTime();
  const hoursPassed = (now - sentAt) / (1000 * 60 * 60);

  return hoursPassed >= hours;
};

/**
 * Get relative time string from timestamp
 * @param timestamp - ISO timestamp string or Date object
 * @returns Object with value and label for relative time display
 */
export const getRelativeTime = (timestamp: string | Date): { value: number; label: string } => {
  if (!timestamp) {
    return { value: 0, label: 'moments' };
  }

  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSecs < 60) {
    return { value: diffSecs, label: 'second' + (diffSecs !== 1 ? 's' : '') };
  } else if (diffMins < 60) {
    return { value: diffMins, label: 'minute' + (diffMins !== 1 ? 's' : '') };
  } else if (diffHours < 24) {
    return { value: diffHours, label: 'hour' + (diffHours !== 1 ? 's' : '') };
  } else if (diffDays < 7) {
    return { value: diffDays, label: 'day' + (diffDays !== 1 ? 's' : '') };
  } else if (diffWeeks < 4) {
    return { value: diffWeeks, label: 'week' + (diffWeeks !== 1 ? 's' : '') };
  } else if (diffMonths < 12) {
    return { value: diffMonths, label: 'month' + (diffMonths !== 1 ? 's' : '') };
  } else {
    return { value: diffYears, label: 'year' + (diffYears !== 1 ? 's' : '') };
  }
};

/**
 * Format a date string into a human-readable relative time format
 * @param dateString - ISO date string
 * @returns Formatted relative time string (e.g., "Just now", "5m ago", "2d ago")
 */
export const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};
