/**
 * Reaction Hooks
 * TanStack Query hooks for reaction management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messagingApi } from '../../services/messagingApi';
import { discussionKeys } from './useDiscussions';
import type {
  Reaction,
  CreateReactionPayload,
  ReactionType,
} from '../../types/messaging';

// Query keys
export const reactionKeys = {
  all: ['reactions'] as const,
  lists: () => [...reactionKeys.all, 'list'] as const,
  list: (discussionId: string, reactionType?: ReactionType) =>
    [...reactionKeys.lists(), discussionId, reactionType] as const,
};

/**
 * Fetch reactions for a discussion
 */
export const useReactions = (
  discussionId: string,
  options?: {
    reaction_type?: ReactionType;
    enabled?: boolean;
  }
) => {
  return useQuery({
    queryKey: reactionKeys.list(discussionId, options?.reaction_type),
    queryFn: ({ signal }) =>
      messagingApi.reactions.list({
        discussion: discussionId,
        reaction_type: options?.reaction_type,
        signal,
      }),
    enabled: options?.enabled !== false && !!discussionId,
    staleTime: 30_000,
  });
};

/**
 * Add or update a reaction (replaces existing reaction)
 */
export const useAddReaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateReactionPayload) =>
      messagingApi.reactions.create(payload),
    onMutate: async (payload) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: reactionKeys.list(payload.discussion),
      });

      // Optimistically update reaction count
      const discussionKey = discussionKeys.detail(payload.discussion);
      const previousDiscussion = queryClient.getQueryData(discussionKey);

      queryClient.setQueryData(discussionKey, (old: unknown) => {
        if (!old || typeof old !== 'object') return old;
        const discussion = old as { reaction_count?: number };
        return {
          ...old,
          reaction_count: (discussion.reaction_count || 0) + 1,
        };
      });

      return { previousDiscussion };
    },
    onError: (_err, payload, context) => {
      // Rollback on error
      if (context?.previousDiscussion) {
        queryClient.setQueryData(
          discussionKeys.detail(payload.discussion),
          context.previousDiscussion
        );
      }
    },
    onSettled: (_data, _error, payload) => {
      // Refetch
      queryClient.invalidateQueries({
        queryKey: reactionKeys.list(payload.discussion),
      });
      queryClient.invalidateQueries({
        queryKey: discussionKeys.detail(payload.discussion),
      });
      queryClient.invalidateQueries({ queryKey: discussionKeys.lists() });
    },
  });
};

/**
 * Remove a reaction
 */
export const useRemoveReaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string; discussionId: string }) =>
      messagingApi.reactions.delete(id),
    onMutate: async ({ discussionId }) => {
      await queryClient.cancelQueries({
        queryKey: reactionKeys.list(discussionId),
      });

      // Optimistically update reaction count
      const discussionKey = discussionKeys.detail(discussionId);
      const previousDiscussion = queryClient.getQueryData(discussionKey);

      queryClient.setQueryData(discussionKey, (old: unknown) => {
        if (!old || typeof old !== 'object') return old;
        const discussion = old as { reaction_count?: number };
        return {
          ...old,
          reaction_count: Math.max(0, (discussion.reaction_count || 0) - 1),
        };
      });

      return { previousDiscussion };
    },
    onError: (_err, { discussionId }, context) => {
      if (context?.previousDiscussion) {
        queryClient.setQueryData(
          discussionKeys.detail(discussionId),
          context.previousDiscussion
        );
      }
    },
    onSettled: (_data, _error, { discussionId }) => {
      queryClient.invalidateQueries({
        queryKey: reactionKeys.list(discussionId),
      });
      queryClient.invalidateQueries({
        queryKey: discussionKeys.detail(discussionId),
      });
      queryClient.invalidateQueries({ queryKey: discussionKeys.lists() });
    },
  });
};

/**
 * Toggle reaction - add if not exists, remove if exists
 */
export const useToggleReaction = () => {
  const addReaction = useAddReaction();
  const removeReaction = useRemoveReaction();

  return {
    toggle: async (params: {
      discussionId: string;
      reactionType: ReactionType;
      existingReaction?: Reaction;
    }) => {
      if (params.existingReaction) {
        // Remove existing reaction
        return removeReaction.mutateAsync({
          id: params.existingReaction.id,
          discussionId: params.discussionId,
        });
      } else {
        // Add new reaction
        return addReaction.mutateAsync({
          discussion: params.discussionId,
          reaction_type: params.reactionType,
        });
      }
    },
    isPending: addReaction.isPending || removeReaction.isPending,
  };
};
