/**
 * Hook for fetching groups where user is a leader
 */

import { useQuery } from '@tanstack/react-query';
import { listGroups } from '../services/groupApi';

/**
 * Fetch groups where user is a member/leader
 */
export const useMyGroups = () => {
  return useQuery({
    queryKey: ['my-groups'],
    queryFn: () => listGroups({ my_groups: true }),
    staleTime: 60_000, // 1 minute
  });
};

/**
 * Extract groups where user is a leader or co-leader
 */
export const useLeaderGroups = () => {
  const { data: myGroups, ...rest } = useMyGroups();

  const leaderGroups = myGroups?.filter((group) => 
    group.membership_status === 'leader' || group.membership_status === 'co_leader'
  ) || [];

  return {
    data: leaderGroups,
    ...rest,
  };
};