/**
 * Comment Hooks
 * TanStack Query hooks for comment management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messagingApi } from '../../services/messagingApi';
import { discussionKeys } from './useDiscussions';
import type {
  Comment,
  CreateCommentPayload,
  UpdateCommentPayload,
} from '../../types/messaging';

// Query keys
export const commentKeys = {
  all: ['comments'] as const,
  lists: () => [...commentKeys.all, 'list'] as const,
  list: (discussionId: string, filters?: Record<string, unknown>) =>
    [...commentKeys.lists(), discussionId, filters] as const,
};

/**
 * Fetch comments for a discussion
 */
export const useComments = (
  discussionId: string,
  options?: {
    parent?: string;
    ordering?: string;
    page?: number;
    page_size?: number;
    enabled?: boolean;
  }
) => {
  return useQuery({
    queryKey: commentKeys.list(discussionId, {
      parent: options?.parent,
      ordering: options?.ordering,
      page: options?.page,
    }),
    queryFn: ({ signal }) =>
      messagingApi.comments.list({
        discussion: discussionId,
        parent: options?.parent,
        ordering: options?.ordering,
        page: options?.page,
        page_size: options?.page_size,
        signal,
      }),
    enabled: options?.enabled !== false && !!discussionId,
    staleTime: 30_000, // 30 seconds
    gcTime: 5 * 60_000, // 5 minutes cache retention
    refetchOnWindowFocus: false, // Prevent refetch on tab focus
    refetchOnMount: true, // Refetch on mount to ensure fresh data
  });
};

/**
 * Create a new comment
 */
export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCommentPayload) =>
      messagingApi.comments.create(payload),
    onMutate: async (payload) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: commentKeys.list(payload.discussion),
      });

      // Snapshot current value
      const previousComments = queryClient.getQueryData(
        commentKeys.list(payload.discussion)
      );

      // Return context for rollback
      return { previousComments };
    },
    onSuccess: (newComment) => {
      // Invalidate and REFETCH comments list immediately with exact match
      queryClient.invalidateQueries({
        queryKey: commentKeys.lists(),
        refetchType: 'active', // Force immediate refetch of active queries
        exact: false, // Match all comment queries for this discussion
      });

      // Also invalidate with exact discussion ID
      queryClient.invalidateQueries({
        queryKey: commentKeys.list(newComment.discussion),
        refetchType: 'active',
      });

      // Update discussion comment count optimistically
      const discussionKey = discussionKeys.detail(newComment.discussion);
      queryClient.setQueryData(discussionKey, (old: unknown) => {
        if (!old || typeof old !== 'object') return old;
        const discussion = old as { comment_count?: number };
        return {
          ...old,
          comment_count: (discussion.comment_count || 0) + 1,
        };
      });

      // Invalidate discussion lists and feed
      queryClient.invalidateQueries({ queryKey: discussionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
    onError: (_err, payload, context) => {
      // Rollback on error
      if (context?.previousComments) {
        queryClient.setQueryData(
          commentKeys.list(payload.discussion),
          context.previousComments
        );
      }
    },
  });
};

/**
 * Update a comment (within 15 minutes)
 */
export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCommentPayload }) =>
      messagingApi.comments.update(id, payload),
    onSuccess: (updatedComment) => {
      // Invalidate and REFETCH comments list immediately
      queryClient.invalidateQueries({
        queryKey: commentKeys.list(updatedComment.discussion),
        refetchType: 'active',
      });
    },
  });
};

/**
 * Delete a comment
 */
export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string; discussionId: string }) =>
      messagingApi.comments.delete(id),
    onSuccess: (_data, { discussionId }) => {
      // Invalidate and REFETCH comments list immediately
      queryClient.invalidateQueries({
        queryKey: commentKeys.list(discussionId),
        refetchType: 'active',
      });

      // Update discussion comment count optimistically
      const discussionKey = discussionKeys.detail(discussionId);
      queryClient.setQueryData(discussionKey, (old: unknown) => {
        if (!old || typeof old !== 'object') return old;
        const discussion = old as { comment_count?: number };
        return {
          ...old,
          comment_count: Math.max(0, (discussion.comment_count || 0) - 1),
        };
      });

      // Invalidate discussion lists
      queryClient.invalidateQueries({ queryKey: discussionKeys.lists() });
    },
  });
};

/**
 * Check if comment is still editable (within 15 minutes)
 */
export const useCanEditComment = (comment: Comment): boolean => {
  const createdAt = new Date(comment.created_at);
  const now = new Date();
  const minutesElapsed = (now.getTime() - createdAt.getTime()) / 1000 / 60;
  return minutesElapsed < 15 && !comment.is_edited;
};
