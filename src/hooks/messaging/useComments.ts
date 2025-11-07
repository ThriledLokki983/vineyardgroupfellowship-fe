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

type ContentType = 'discussion' | 'prayer' | 'testimony' | 'scripture';

// Query keys
export const commentKeys = {
  all: ['comments'] as const,
  lists: () => [...commentKeys.all, 'list'] as const,
  list: (contentId: string, contentType: ContentType, filters?: {
    parent?: string;
    ordering?: string;
    page?: number;
    page_size?: number;
  }) => [...commentKeys.lists(), contentType, contentId, filters] as const,
};

/**
 * Fetch comments for a content item (discussion, prayer, testimony, or scripture)
 */
export const useComments = (
  contentId: string,
  contentType: ContentType = 'discussion',
  options?: {
    parent?: string;
    ordering?: string;
    page?: number;
    page_size?: number;
    enabled?: boolean;
  }
) => {
  return useQuery({
    queryKey: commentKeys.list(contentId, contentType, {
      parent: options?.parent,
      ordering: options?.ordering,
      page: options?.page,
      page_size: options?.page_size,
    }),
    queryFn: ({ signal }) => {
      // Build the query parameters dynamically based on content type
      const params: Parameters<typeof messagingApi.comments.list>[0] = {
        [contentType]: contentId, // discussion=id or prayer=id or testimony=id or scripture=id
        parent: options?.parent,
        ordering: options?.ordering,
        page: options?.page,
        page_size: options?.page_size,
        signal,
      };

      return messagingApi.comments.list(params);
    },
    enabled: options?.enabled !== false && !!contentId,
    staleTime: 30_000, // 30 seconds
    gcTime: 5 * 60_000, // 5 minutes cache retention
    refetchOnWindowFocus: false, // Prevent refetch on tab focus
    refetchOnMount: true, // Refetch on mount to ensure fresh data
  });
};

/**
 * Helper to get content type and ID from comment or payload
 */
const getContentInfo = (obj: CreateCommentPayload | Comment): { type: ContentType; id: string } | null => {
  if (obj.discussion) return { type: 'discussion', id: obj.discussion };
  if (obj.prayer) return { type: 'prayer', id: obj.prayer };
  if (obj.testimony) return { type: 'testimony', id: obj.testimony };
  if (obj.scripture) return { type: 'scripture', id: obj.scripture };
  return null;
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
      const contentInfo = getContentInfo(payload);
      if (!contentInfo) return {};

      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: commentKeys.list(contentInfo.id, contentInfo.type),
      });

      // Snapshot current value
      const previousComments = queryClient.getQueryData(
        commentKeys.list(contentInfo.id, contentInfo.type)
      );

      // Return context for rollback
      return { previousComments, contentInfo };
    },
    onSuccess: (newComment, _payload, context) => {
      const contentInfo = context?.contentInfo || getContentInfo(newComment);
      if (!contentInfo) return;

      // Invalidate and REFETCH comments list immediately with exact match
      queryClient.invalidateQueries({
        queryKey: commentKeys.lists(),
        refetchType: 'active', // Force immediate refetch of active queries
        exact: false, // Match all comment queries
      });

      // Also invalidate with exact content ID
      queryClient.invalidateQueries({
        queryKey: commentKeys.list(contentInfo.id, contentInfo.type),
        refetchType: 'active',
      });

      // Update discussion comment count optimistically (only for discussions)
      if (contentInfo.type === 'discussion') {
        const discussionKey = discussionKeys.detail(contentInfo.id);
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
      }

      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
    onError: (_err, _payload, context) => {
      // Rollback on error
      if (context?.previousComments && context?.contentInfo) {
        queryClient.setQueryData(
          commentKeys.list(context.contentInfo.id, context.contentInfo.type),
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
      const contentInfo = getContentInfo(updatedComment);
      if (!contentInfo) return;

      // Invalidate and REFETCH comments list immediately
      queryClient.invalidateQueries({
        queryKey: commentKeys.list(contentInfo.id, contentInfo.type),
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
    mutationFn: ({ id }: {
      id: string;
      contentId: string;
      contentType: ContentType;
    }) => messagingApi.comments.delete(id),
    onSuccess: (_data, { contentId, contentType }) => {
      // Invalidate and REFETCH comments list immediately
      queryClient.invalidateQueries({
        queryKey: commentKeys.list(contentId, contentType),
        refetchType: 'active',
      });

      // Update discussion comment count optimistically (only for discussions)
      if (contentType === 'discussion') {
        const discussionKey = discussionKeys.detail(contentId);
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
      }
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
