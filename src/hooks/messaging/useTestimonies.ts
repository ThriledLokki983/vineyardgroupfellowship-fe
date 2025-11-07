/**
 * Testimony Hooks
 * TanStack Query hooks for testimony management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messagingApi } from '../../services/messagingApi';
import { feedKeys } from './useFeed';
import type { CreateTestimonyPayload } from '../../types/messaging';

// Query keys
export const testimonyKeys = {
  all: ['testimonies'] as const,
  lists: () => [...testimonyKeys.all, 'list'] as const,
  list: (groupId: string, filters?: Record<string, unknown>) =>
    [...testimonyKeys.lists(), groupId, filters] as const,
  details: () => [...testimonyKeys.all, 'detail'] as const,
  detail: (id: string) => [...testimonyKeys.details(), id] as const,
};

/**
 * Fetch testimonies for a group
 */
export const useTestimonies = (
  groupId: string,
  options?: {
    is_public?: boolean;
    search?: string;
    ordering?: string;
    page?: number;
    page_size?: number;
    enabled?: boolean;
  }
) => {
  return useQuery({
    queryKey: testimonyKeys.list(groupId, {
      is_public: options?.is_public,
      search: options?.search,
      ordering: options?.ordering,
      page: options?.page,
    }),
    queryFn: ({ signal }) =>
      messagingApi.testimonies.list({
        group: groupId,
        is_public: options?.is_public,
        search: options?.search,
        page: options?.page,
        page_size: options?.page_size,
        signal,
      }),
    enabled: options?.enabled !== false && !!groupId,
    staleTime: 30_000,
  });
};

/**
 * Fetch a single testimony by ID
 */
export const useTestimony = (id: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: testimonyKeys.detail(id),
    queryFn: ({ signal }) => messagingApi.testimonies.get(id, signal),
    enabled: options?.enabled !== false && !!id,
    staleTime: 30_000,
  });
};

/**
 * Create a new testimony
 */
export const useCreateTestimony = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTestimonyPayload) =>
      messagingApi.testimonies.create(payload),
    onSuccess: () => {
      // Invalidate testimonies list
      queryClient.invalidateQueries({ queryKey: testimonyKeys.lists() });
      // Invalidate feed
      queryClient.invalidateQueries({ queryKey: feedKeys.lists() });
    },
  });
};

/**
 * Request to share testimony publicly
 */
export const useRequestPublicTestimony = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (testimonyId: string) =>
      messagingApi.testimonies.sharePublic(testimonyId),
    onSuccess: () => {
      // Invalidate testimonies lists
      queryClient.invalidateQueries({ queryKey: testimonyKeys.lists() });
    },
  });
};
