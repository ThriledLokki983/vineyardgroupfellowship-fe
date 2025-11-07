/**
 * Feed Hooks
 * TanStack Query hooks for activity feed
 */

import { useQuery } from '@tanstack/react-query';
import { messagingApi } from '../../services/messagingApi';
import type { FeedContentType } from '../../types/messaging';

// Query keys
export const feedKeys = {
  all: ['feed'] as const,
  lists: () => [...feedKeys.all, 'list'] as const,
  list: (groupId: string, filters?: Record<string, unknown>) =>
    [...feedKeys.lists(), groupId, filters] as const,
};

/**
 * Fetch activity feed for a group
 * Supports auto-refresh with refetchInterval
 */
export const useFeed = (
  groupId: string,
  options?: {
    content_type?: FeedContentType;
    page?: number;
    page_size?: number;
    enabled?: boolean;
    refetchInterval?: number | false;
  }
) => {
  return useQuery({
    queryKey: feedKeys.list(groupId, {
      content_type: options?.content_type,
      page: options?.page,
    }),
    queryFn: ({ signal }) =>
      messagingApi.feed.list({
        group: groupId,
        content_type: options?.content_type,
        page: options?.page,
        page_size: options?.page_size,
        signal,
      }),
    enabled: options?.enabled !== false && !!groupId,
    staleTime: 25_000, // 25 seconds
    refetchInterval: options?.refetchInterval ?? 30_000, // Default: 30 seconds polling
  });
};
