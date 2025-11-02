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
      // Invalidate all-groups pending requests query
      queryClient.invalidateQueries({ queryKey: ['all-groups-pending-requests'] });
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
      // Invalidate all-groups pending requests query
      queryClient.invalidateQueries({ queryKey: ['all-groups-pending-requests'] });
    },
  });
};

/**
 * Extended pending request with group information
 */
export interface PendingRequestWithGroup {
  groupId: string;
  groupName: string;
  request: import('../types/group').PendingRequest;
}

/**
 * Get total count of pending requests across all groups where user is leader
 * Note: This hook should only be used with a small number of groups
 */
export const useAllGroupsPendingRequests = (groups: Array<{ id: string; name: string }>) => {
  const results = useQuery({
    queryKey: ['all-groups-pending-requests', ...groups.map(g => g.id)],
    queryFn: async () => {
      if (!groups || groups.length === 0) {
        return [];
      }

      const promises = groups.map(async (group) => {
        try {
          const requests = await getPendingRequests(group.id);
          return requests.map((request) => ({
            groupId: group.id,
            groupName: group.name,
            request,
          }));
        } catch (error) {
          console.error(`Failed to fetch pending requests for ${group.name}:`, error);
          return [];
        }
      });

      const allResults = await Promise.all(promises);
      return allResults.flat();
    },
    enabled: groups.length > 0,
    staleTime: 30_000,
    refetchInterval: 60_000,
  });

  return {
    totalPending: results.data?.length || 0,
    pendingRequests: results.data || [],
    isLoading: results.isLoading,
    isError: results.isError,
    error: results.error,
  };
};
