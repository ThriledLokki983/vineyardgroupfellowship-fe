/**
 * Feed Hooks
 * TanStack Query hooks for activity feed
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

/**
 * Fetch unviewed feed items for a group (for dashboard)
 * Shows recent activity that user hasn't interacted with yet
 * Filters for items where has_viewed is false
 */
export const useUnviewedFeed = (
  groupId: string,
  options?: {
    maxItems?: number;
    enabled?: boolean;
  }
) => {
  return useQuery({
    queryKey: [...feedKeys.list(groupId, { unviewed: true }), options?.maxItems] as const,
    queryFn: ({ signal }) =>
      messagingApi.feed.list({
        group: groupId,
        has_viewed: false, // Only fetch unviewed items
        page_size: options?.maxItems || 5,
        signal,
      }),
    enabled: options?.enabled !== false && !!groupId,
    staleTime: 30_000, // 30 seconds - keep fresh for dashboard
    refetchOnWindowFocus: true, // Refresh when user returns to dashboard
  });
};

/**
 * Mark a feed item as viewed
 * Updates user's viewed status for a specific feed item
 * Invalidates unviewed feed queries to refresh dashboard
 */
export const useMarkFeedViewed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (feedItemId: string) => messagingApi.feed.markViewed(feedItemId),
    onSuccess: () => {
      // Invalidate unviewed feed queries to refresh dashboard
      queryClient.invalidateQueries({ queryKey: feedKeys.all });
    },
  });
};
