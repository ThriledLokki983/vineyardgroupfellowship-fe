/**
 * Discussion Hooks
 * TanStack Query hooks for discussion management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messagingApi } from '../../services/messagingApi';
import type {
  Discussion,
  CreateDiscussionPayload,
  UpdateDiscussionPayload,
} from '../../types/messaging';

// Query keys
export const discussionKeys = {
  all: ['discussions'] as const,
  lists: () => [...discussionKeys.all, 'list'] as const,
  list: (groupId: string, filters?: Record<string, unknown>) =>
    [...discussionKeys.lists(), groupId, filters] as const,
  details: () => [...discussionKeys.all, 'detail'] as const,
  detail: (id: string) => [...discussionKeys.details(), id] as const,
};

/**
 * Fetch discussions for a group
 */
export const useDiscussions = (
  groupId: string,
  options?: {
    is_pinned?: boolean;
    search?: string;
    ordering?: string;
    page?: number;
    page_size?: number;
    enabled?: boolean;
    refetchInterval?: number;
  }
) => {
  return useQuery({
    queryKey: discussionKeys.list(groupId, {
      is_pinned: options?.is_pinned,
      search: options?.search,
      ordering: options?.ordering,
      page: options?.page,
    }),
    queryFn: ({ signal }) =>
      messagingApi.discussions.list({
        group: groupId,
        is_pinned: options?.is_pinned,
        search: options?.search,
        ordering: options?.ordering,
        page: options?.page,
        page_size: options?.page_size,
        signal,
      }),
    enabled: options?.enabled !== false && !!groupId,
    staleTime: 60_000, // 60 seconds - increased from 30s
    gcTime: 5 * 60_000, // 5 minutes cache retention
    refetchOnWindowFocus: false, // Prevent refetch on tab focus
    refetchOnMount: false, // Only fetch if cache is stale
    refetchInterval: options?.refetchInterval,
  });
};

/**
 * Fetch a single discussion
 */
export const useDiscussion = (discussionId: string, enabled = true) => {
  return useQuery({
    queryKey: discussionKeys.detail(discussionId),
    queryFn: ({ signal }) => messagingApi.discussions.get(discussionId, signal),
    enabled: enabled && !!discussionId,
    staleTime: 60_000, // 60 seconds - increased from 30s
    gcTime: 5 * 60_000, // 5 minutes cache retention
    refetchOnWindowFocus: false, // Prevent refetch on tab focus
    refetchOnMount: false, // Only fetch if cache is stale
  });
};

/**
 * Create a new discussion
 */
export const useCreateDiscussion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDiscussionPayload) =>
      messagingApi.discussions.create(payload),
    onSuccess: (newDiscussion) => {
      // Invalidate discussions list
      queryClient.invalidateQueries({ queryKey: discussionKeys.lists() });
      // Invalidate feed
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      // Set the new discussion in cache
      queryClient.setQueryData(discussionKeys.detail(newDiscussion.id), newDiscussion);
    },
  });
};

/**
 * Update a discussion
 */
export const useUpdateDiscussion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateDiscussionPayload }) =>
      messagingApi.discussions.update(id, payload),
    onMutate: async ({ id, payload }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: discussionKeys.detail(id) });

      // Snapshot previous value
      const previousDiscussion = queryClient.getQueryData<Discussion>(discussionKeys.detail(id));

      // Optimistically update
      if (previousDiscussion) {
        queryClient.setQueryData<Discussion>(discussionKeys.detail(id), {
          ...previousDiscussion,
          ...payload,
          updated_at: new Date().toISOString(),
        });
      }

      return { previousDiscussion };
    },
    onError: (_err, { id }, context) => {
      // Rollback on error
      if (context?.previousDiscussion) {
        queryClient.setQueryData(discussionKeys.detail(id), context.previousDiscussion);
      }
    },
    onSettled: (_data, _error, { id }) => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: discussionKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: discussionKeys.lists() });
    },
  });
};

/**
 * Delete a discussion
 */
export const useDeleteDiscussion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => messagingApi.discussions.delete(id),
    onSuccess: (_data, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: discussionKeys.detail(id) });
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: discussionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
};

/**
 * Pin a discussion
 */
export const usePinDiscussion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => messagingApi.discussions.pin(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: discussionKeys.detail(id) });

      const previousDiscussion = queryClient.getQueryData<Discussion>(discussionKeys.detail(id));

      if (previousDiscussion) {
        queryClient.setQueryData<Discussion>(discussionKeys.detail(id), {
          ...previousDiscussion,
          is_pinned: true,
        });
      }

      return { previousDiscussion };
    },
    onError: (_err, id, context) => {
      if (context?.previousDiscussion) {
        queryClient.setQueryData(discussionKeys.detail(id), context.previousDiscussion);
      }
    },
    onSettled: (_data, _error, id) => {
      queryClient.invalidateQueries({ queryKey: discussionKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: discussionKeys.lists() });
    },
  });
};

/**
 * Unpin a discussion
 */
export const useUnpinDiscussion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => messagingApi.discussions.unpin(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: discussionKeys.detail(id) });

      const previousDiscussion = queryClient.getQueryData<Discussion>(discussionKeys.detail(id));

      if (previousDiscussion) {
        queryClient.setQueryData<Discussion>(discussionKeys.detail(id), {
          ...previousDiscussion,
          is_pinned: false,
        });
      }

      return { previousDiscussion };
    },
    onError: (_err, id, context) => {
      if (context?.previousDiscussion) {
        queryClient.setQueryData(discussionKeys.detail(id), context.previousDiscussion);
      }
    },
    onSettled: (_data, _error, id) => {
      queryClient.invalidateQueries({ queryKey: discussionKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: discussionKeys.lists() });
    },
  });
};
