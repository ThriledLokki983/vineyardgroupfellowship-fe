/**
 * Scripture Hooks
 * TanStack Query hooks for scripture sharing
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messagingApi } from '../../services/messagingApi';
import { feedKeys } from './useFeed';
import type { CreateScripturePayload, BibleTranslation } from '../../types/messaging';

// Query keys
export const scriptureKeys = {
  all: ['scriptures'] as const,
  lists: () => [...scriptureKeys.all, 'list'] as const,
  list: (groupId: string, filters?: Record<string, unknown>) =>
    [...scriptureKeys.lists(), groupId, filters] as const,
  details: () => [...scriptureKeys.all, 'detail'] as const,
  detail: (id: string) => [...scriptureKeys.details(), id] as const,
  lookup: (reference: string, translation: BibleTranslation) =>
    [...scriptureKeys.all, 'lookup', reference, translation] as const,
};

/**
 * Fetch scriptures for a group
 */
export const useScriptures = (
  groupId: string,
  options?: {
    translation?: BibleTranslation;
    search?: string;
    page?: number;
    page_size?: number;
    enabled?: boolean;
  }
) => {
  return useQuery({
    queryKey: scriptureKeys.list(groupId, {
      translation: options?.translation,
      search: options?.search,
      page: options?.page,
    }),
    queryFn: ({ signal }) =>
      messagingApi.scriptures.list({
        group: groupId,
        translation: options?.translation,
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
 * Fetch a single scripture by ID
 */
export const useScripture = (id: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: scriptureKeys.detail(id),
    queryFn: ({ signal }) => messagingApi.scriptures.get(id, signal),
    enabled: options?.enabled !== false && !!id,
    staleTime: 30_000,
  });
};

/**
 * Create a new scripture share
 */
export const useCreateScripture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateScripturePayload) =>
      messagingApi.scriptures.create(payload),
    onSuccess: () => {
      // Invalidate scriptures list
      queryClient.invalidateQueries({ queryKey: scriptureKeys.lists() });
      // Invalidate feed
      queryClient.invalidateQueries({ queryKey: feedKeys.lists() });
    },
  });
};

/**
 * Look up a Bible verse
 */
export const useVerseLookup = (reference: string, translation: BibleTranslation, enabled = false) => {
  return useQuery({
    queryKey: scriptureKeys.lookup(reference, translation),
    queryFn: () =>
      messagingApi.scriptures.verseLookup(reference, translation),
    enabled: enabled && !!reference && !!translation,
    staleTime: Infinity, // Verses don't change
    gcTime: 60 * 60 * 1000, // Cache for 1 hour
  });
};
