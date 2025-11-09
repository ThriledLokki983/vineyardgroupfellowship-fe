/**
 * Private Messaging / Conversation Hooks
 * TanStack Query hooks for private messaging between users
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import type {
	Conversation,
	ConversationStatus,
	CreateGroupInquiryRequest,
	CloseReason,
} from '../../types/private-messaging';

// Query keys factory
export const conversationKeys = {
	all: ['conversations'] as const,
	lists: () => [...conversationKeys.all, 'list'] as const,
	list: (status?: ConversationStatus) => [...conversationKeys.lists(), { status }] as const,
	details: () => [...conversationKeys.all, 'detail'] as const,
	detail: (id: string) => [...conversationKeys.details(), id] as const,
};

/**
 * Fetch list of conversations for the authenticated user
 * @param status - Optional filter by conversation status (active, closed, archived)
 */
export const useConversations = (status?: ConversationStatus) => {
	return useQuery({
		queryKey: conversationKeys.list(status),
		queryFn: ({ signal }) => api.listConversations(status, signal),
		staleTime: 30_000, // 30 seconds
		refetchOnWindowFocus: true, // Refetch when user returns to tab
	});
};

/**
 * Fetch a single conversation with full message history
 * Auto-marks messages as read when retrieved
 * @param id - Conversation UUID
 */
export const useConversation = (id: string) => {
	const queryClient = useQueryClient();

	return useQuery({
		queryKey: conversationKeys.detail(id),
		queryFn: ({ signal }) => api.getConversation(id, signal),
		enabled: !!id,
		staleTime: 10_000, // 10 seconds
		refetchInterval: 30_000, // Poll every 30 seconds for new messages
		refetchOnWindowFocus: true,
		select: (data) => {
			// After fetching, the backend has marked messages as read
			// Update the conversation list to reflect 0 unread count
			queryClient.setQueriesData<{ count: number; results: Conversation[] }>(
				{ queryKey: conversationKeys.lists() },
				(old) => {
					if (!old) return old;
					return {
						...old,
						results: old.results.map((conv) =>
							conv.id === id ? { ...conv, unread_count: 0 } : conv
						),
					};
				}
			);
			return data;
		},
	});
};

/**
 * Create or retrieve a conversation with a group leader
 * Automatically redirects to the conversation page on success
 */
export const useCreateGroupInquiry = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: (data: CreateGroupInquiryRequest) => 
			api.createGroupInquiry(data),
		onSuccess: (response) => {
			// Add/update conversation in the list cache
			queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });

			// Cache the full conversation detail
			queryClient.setQueryData(
				conversationKeys.detail(response.conversation.id),
				response.conversation
			);

			// Navigate to the conversation
			// Use redirect_url from response, or construct it
			const conversationId = response.conversation.id;
			navigate(`/messages/${conversationId}`);

			return response;
		},
	});
};

/**
 * Send a message in an existing conversation
 * Includes optimistic updates for immediate UI feedback
 */
export const useSendMessage = (conversationId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (content: string) => 
			api.sendMessage(conversationId, content),
		onMutate: async (content) => {
			// Cancel any outgoing refetches
			await queryClient.cancelQueries({ 
				queryKey: conversationKeys.detail(conversationId) 
			});

			// Snapshot the previous value
			const previous = queryClient.getQueryData<Conversation>(
				conversationKeys.detail(conversationId)
			);

			// Optimistically update with a temporary message
			if (previous) {
				queryClient.setQueryData<Conversation>(
					conversationKeys.detail(conversationId),
					(old) => {
						if (!old) return old;
						
						// Create temporary message (will be replaced by real one from server)
						const tempMessage = {
							id: `temp-${Date.now()}`,
							conversation: conversationId,
							sender: old.participants.find(p => p.id === 'current-user') || old.participants[0],
							content,
							is_read: false,
							created_at: new Date().toISOString(),
						};

						return {
							...old,
							messages: [...(old.messages || []), tempMessage],
							last_message_at: tempMessage.created_at,
						};
					}
				);
			}

			return { previous };
		},
		onError: (_err, _content, context) => {
			// Rollback on error
			if (context?.previous) {
				queryClient.setQueryData(
					conversationKeys.detail(conversationId),
					context.previous
				);
			}
		},
		onSuccess: () => {
			// Refresh the conversation to get the real message from server
			queryClient.invalidateQueries({ 
				queryKey: conversationKeys.detail(conversationId) 
			});

			// Update the conversation list (last_message, last_message_at)
			queryClient.invalidateQueries({ 
				queryKey: conversationKeys.lists() 
			});
		},
	});
};

/**
 * Close a conversation
 * @param onSuccess - Optional callback after successful close
 */
export const useCloseConversation = (onSuccess?: () => void) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, reason }: { id: string; reason?: CloseReason }) =>
			api.closeConversation(id, reason),
		onSuccess: (data, variables) => {
			// Update the conversation detail cache
			queryClient.setQueryData<Conversation>(
				conversationKeys.detail(variables.id),
				(old) => {
					if (!old) return old;
					return {
						...old,
						status: 'closed',
						closed_at: data.conversation.closed_at,
						closed_by_user: data.conversation.closed_by_user,
						close_reason: data.conversation.close_reason,
					};
				}
			);

			// Invalidate lists to move conversation to correct status filter
			queryClient.invalidateQueries({ 
				queryKey: conversationKeys.lists() 
			});

			// Call optional callback
			if (onSuccess) {
				onSuccess();
			}
		},
	});
};

/**
 * Reopen a closed conversation
 * @param onSuccess - Optional callback after successful reopen
 */
export const useReopenConversation = (onSuccess?: () => void) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => api.reopenConversation(id),
		onSuccess: (_data, id) => {
			// Update the conversation detail cache
			queryClient.setQueryData<Conversation>(
				conversationKeys.detail(id),
				(old) => {
					if (!old) return old;
					return {
						...old,
						status: 'active',
						closed_at: null,
						closed_by_user: null,
						close_reason: null,
					};
				}
			);

			// Invalidate lists to move conversation to correct status filter
			queryClient.invalidateQueries({ 
				queryKey: conversationKeys.lists() 
			});

			// Call optional callback
			if (onSuccess) {
				onSuccess();
			}
		},
	});
};

/**
 * Get total unread message count across all conversations
 * Useful for navigation badges
 */
export const useTotalUnreadCount = () => {
	const { data: conversations } = useConversations('active');

	return conversations?.results.reduce(
		(sum, conv) => sum + conv.unread_count,
		0
	) || 0;
};
