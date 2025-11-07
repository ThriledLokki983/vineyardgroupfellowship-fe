/**
 * Prayer Request Hooks
 * TanStack Query hooks for prayer request management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messagingApi } from '../../services/messagingApi';
import { feedKeys } from './useFeed';
import type {
  PrayerRequest,
  CreatePrayerRequestPayload,
  MarkPrayerAnsweredPayload,
  PrayerUrgency,
  PrayerCategory,
} from '../../types/messaging';

// Query keys
export const prayerRequestKeys = {
  all: ['prayer-requests'] as const,
  lists: () => [...prayerRequestKeys.all, 'list'] as const,
  list: (groupId: string, filters?: Record<string, unknown>) =>
    [...prayerRequestKeys.lists(), groupId, filters] as const,
};

/**
 * Fetch prayer requests for a group
 */
export const usePrayerRequests = (
  groupId: string,
  options?: {
    urgency?: PrayerUrgency;
    category?: PrayerCategory;
    is_answered?: boolean;
    search?: string;
    ordering?: string;
    page?: number;
    page_size?: number;
    enabled?: boolean;
    refetchInterval?: number;
  }
) => {
  return useQuery({
    queryKey: prayerRequestKeys.list(groupId, {
      urgency: options?.urgency,
      category: options?.category,
      is_answered: options?.is_answered,
      search: options?.search,
      ordering: options?.ordering,
      page: options?.page,
    }),
    queryFn: ({ signal }) =>
      messagingApi.prayerRequests.list({
        group: groupId,
        urgency: options?.urgency,
        category: options?.category,
        is_answered: options?.is_answered,
        search: options?.search,
        ordering: options?.ordering,
        page: options?.page,
        page_size: options?.page_size,
        signal,
      }),
    enabled: options?.enabled !== false && !!groupId,
    staleTime: 20_000,
    refetchInterval: options?.refetchInterval,
  });
};

/**
 * Create a new prayer request
 */
export const useCreatePrayerRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePrayerRequestPayload) =>
      messagingApi.prayerRequests.create(payload),
    onSuccess: () => {
      // Invalidate prayer requests list
      queryClient.invalidateQueries({ queryKey: prayerRequestKeys.lists() });
      // Invalidate feed
      queryClient.invalidateQueries({ queryKey: feedKeys.lists() });
    },
  });
};

/**
 * Mark prayer request as answered
 */
export const useMarkPrayerAnswered = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: MarkPrayerAnsweredPayload }) =>
      messagingApi.prayerRequests.markAnswered(id, payload),
    onSuccess: () => {
      // Invalidate prayer requests lists
      queryClient.invalidateQueries({ queryKey: prayerRequestKeys.lists() });
      // Invalidate feed
      queryClient.invalidateQueries({ queryKey: feedKeys.lists() });
    },
  });
};

/**
 * Increment prayer count ("I prayed" button)
 */
export const usePrayForRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (prayerId: string) =>
      messagingApi.prayerRequests.pray(prayerId),
    onMutate: async (prayerId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: prayerRequestKeys.lists() });

      // Snapshot previous value
      const previousData = queryClient.getQueriesData({ queryKey: prayerRequestKeys.lists() });

      // Optimistically increment prayer count
      queryClient.setQueriesData({ queryKey: prayerRequestKeys.lists() }, (old: unknown) => {
        if (!old || typeof old !== 'object') return old;
        const data = old as { results?: PrayerRequest[] };
        if (!data.results) return old;

        return {
          ...old,
          results: data.results.map((prayer) =>
            prayer.id === prayerId
              ? { ...prayer, prayer_count: prayer.prayer_count + 1 }
              : prayer
          ),
        };
      });

      return { previousData };
    },
    onError: (_err, _prayerId, context) => {
      // Rollback on error
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: prayerRequestKeys.lists() });
    },
  });
};
