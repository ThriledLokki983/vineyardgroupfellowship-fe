/**
 * Navigation utilities for routing
 */

import type { NavigateFunction } from 'react-router-dom';
import type { FeedItem, FeedContentType } from '../types/messaging';

/**
 * Navigate to a specific feed item in GroupDetailsPage
 * Routes discussions to discussions tab, other content to feed tab
 *
 * @param item - The feed item to navigate to
 * @param navigate - React Router navigate function
 */
export const navigateToFeedItem = (item: FeedItem, navigate: NavigateFunction): void => {
  const { group, content_type, content_id } = item;

  // Discussions go to discussions tab
  if (content_type === 'discussion') {
    navigate(`/groups/${group}?tab=discussions&id=${content_id}`);
    return;
  }

  // All other content types (prayer, testimony, scripture) go to feed tab
  navigate(`/groups/${group}?tab=feed&type=${content_type}&id=${content_id}`);
};

/**
 * Navigate to group feed tab with optional content type filter
 *
 * @param groupId - The group ID
 * @param navigate - React Router navigate function
 * @param contentType - Optional content type to filter by
 */
export const navigateToGroupFeed = (
  groupId: string,
  navigate: NavigateFunction,
  contentType?: FeedContentType
): void => {
	const formattedContentType = contentType === 'discussion' ? 'discussions' : contentType
  const params = new URLSearchParams({ tab: formattedContentType ? formattedContentType : 'feed' });
  // if (contentType) {
  //   params.append('type', contentType);
  // }
  navigate(`/dashboard/groups/${groupId}?${params.toString()}`);
};
