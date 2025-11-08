/**
 * Navigation utilities for routing
 */

import type { NavigateFunction } from 'react-router-dom';
import type { FeedItem, FeedContentType } from '../types/messaging';

/**
 * Navigate to a specific feed item in GroupDetailsPage
 * Routes each content type to its dedicated tab with the item ID for highlighting
 *
 * @param item - The feed item to navigate to
 * @param navigate - React Router navigate function
 */
export const navigateToFeedItem = (item: FeedItem, navigate: NavigateFunction): void => {
  const { group, content_type, content_id } = item;

  // Map content type to tab name
  // discussion -> discussions tab
  // prayer -> prayer_request tab
  // testimony -> testimony tab
  // scripture -> scripture tab
  let tabName: string;
  if (content_type === 'discussion') {
    tabName = 'discussions';
  } else if (content_type === 'prayer') {
    tabName = 'prayer_request';
  } else {
    tabName = content_type;
  }

  navigate(`/dashboard/groups/${group}?tab=${tabName}&id=${content_id}`);
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
