/**
 * Safety & Moderation Hooks
 * TanStack Query hooks for blocking users and reporting content
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { toast } from '../../components/Toast';
import type {
  BlockUserRequest,
  BlockUserResponse,
  UnblockUserResponse,
  BlockedUsersListResponse,
  ReportConversationRequest,
  ReportMessageRequest,
  ReportResponse,
} from '../../types/private-messaging';

/**
 * Query key factory for safety-related queries
 */
export const safetyKeys = {
  all: ['safety'] as const,
  blockedUsers: () => [...safetyKeys.all, 'blockedUsers'] as const,
};

/**
 * Hook to get list of blocked users
 */
export function useBlockedUsers() {
  return useQuery({
    queryKey: safetyKeys.blockedUsers(),
    queryFn: ({ signal }) => api.getBlockedUsers(signal),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to block a user
 * Optimistically updates the UI and invalidates relevant queries
 */
export function useBlockUser() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: BlockUserRequest) => api.blockUser(data),
    onMutate: async (_data) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: safetyKeys.blockedUsers() });
      
      // Snapshot previous value
      const previousBlocked = queryClient.getQueryData<BlockedUsersListResponse>(
        safetyKeys.blockedUsers()
      );
      
      return { previousBlocked };
    },
    onError: (error: Error, _variables, context) => {
      // Rollback on error
      if (context?.previousBlocked) {
        queryClient.setQueryData(safetyKeys.blockedUsers(), context.previousBlocked);
      }
      
      toast.error(error.message || 'Failed to block user');
    },
    onSuccess: (_data: BlockUserResponse) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: safetyKeys.blockedUsers() });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      
      toast.success('User blocked successfully');
      
      // Navigate away from conversation if currently viewing
      navigate('/messages');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: safetyKeys.blockedUsers() });
    },
  });
}

/**
 * Hook to unblock a user
 */
export function useUnblockUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => api.unblockUser(userId),
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to unblock user');
    },
    onSuccess: (_data: UnblockUserResponse) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: safetyKeys.blockedUsers() });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      
      toast.success('User unblocked successfully');
    },
  });
}

/**
 * Hook to report a conversation
 */
export function useReportConversation() {
  return useMutation({
    mutationFn: (data: ReportConversationRequest) => api.reportConversation(data),
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to submit report');
    },
    onSuccess: (_data: ReportResponse) => {
      toast.success('Report submitted. Thank you for helping keep our community safe.');
    },
  });
}

/**
 * Hook to report a specific message
 */
export function useReportMessage() {
  return useMutation({
    mutationFn: (data: ReportMessageRequest) => api.reportMessage(data),
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to submit report');
    },
    onSuccess: (_data: ReportResponse) => {
      toast.success('Report submitted. Thank you for helping keep our community safe.');
    },
  });
}
