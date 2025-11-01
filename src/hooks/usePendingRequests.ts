/**
 * Hook for managing pending group join requests
 * Used by group leaders to view and manage join requests
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPendingRequests, approveJoinRequest, rejectJoinRequest } from '../services/groupApi';

/**
 * Fetch pending join requests for a group
 */
export const usePendingRequests = (groupId: string | undefined) => {
  return useQuery({
    queryKey: ['groups', groupId, 'pending-requests'],
    queryFn: () => {
      if (!groupId) throw new Error('Group ID is required');
      return getPendingRequests(groupId);
    },
    enabled: !!groupId,
    staleTime: 30_000, // 30 seconds
    refetchInterval: 60_000, // Refetch every minute to keep requests fresh
  });
};

/**
 * Approve a pending join request
 */
export const useApproveRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupId, membershipId }: { groupId: string; membershipId: string }) =>
      approveJoinRequest(groupId, membershipId),
    onSuccess: (_data, variables) => {
      // Invalidate pending requests to refresh the list
      queryClient.invalidateQueries({ queryKey: ['groups', variables.groupId, 'pending-requests'] });
      // Invalidate group details to update member count
      queryClient.invalidateQueries({ queryKey: ['groups', variables.groupId] });
      // Invalidate group members list
      queryClient.invalidateQueries({ queryKey: ['groups', variables.groupId, 'members'] });
    },
  });
};

/**
 * Reject a pending join request
 */
export const useRejectRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupId, membershipId }: { groupId: string; membershipId: string }) =>
      rejectJoinRequest(groupId, membershipId),
    onSuccess: (_data, variables) => {
      // Invalidate pending requests to refresh the list
      queryClient.invalidateQueries({ queryKey: ['groups', variables.groupId, 'pending-requests'] });
    },
  });
};

/**
 * Get total count of pending requests across all groups where user is leader
 * Note: This hook should only be used with a small number of groups
 */
export const useAllGroupsPendingRequests = (groupIds: string[]) => {
  // Fetch all pending requests in parallel
  const results = useQuery({
    queryKey: ['all-groups-pending-requests', ...groupIds],
    queryFn: async () => {
      if (!groupIds || groupIds.length === 0) return [];

      const promises = groupIds.map((groupId) => getPendingRequests(groupId));
      const allResults = await Promise.all(promises);

      return allResults.flat(); // Flatten all requests into a single array
    },
    enabled: groupIds.length > 0,
    staleTime: 30_000,
    refetchInterval: 60_000,
  });

  return {
    totalPending: results.data?.length || 0,
    pendingRequests: results.data || [],
    isLoading: results.isLoading,
    isError: results.isError,
  };
};
