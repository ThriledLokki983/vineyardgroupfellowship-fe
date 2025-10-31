/**
 * Generic API hooks for Vineyard Group Fellowship app
 * Provides common patterns for React Query usage
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, type ApiRequestConfig } from '../services/api'

// Utility function to build query string from filters
const buildQueryString = (filters: Record<string, unknown>): string => {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value))
    }
  })
  const queryString = params.toString()
  return queryString ? `?${queryString}` : ''
}

// Generic query key factory
export const createQueryKeys = (feature: string) => ({
  all: [feature] as const,
  lists: () => [...createQueryKeys(feature).all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...createQueryKeys(feature).lists(), filters] as const,
  details: () => [...createQueryKeys(feature).all, 'detail'] as const,
  detail: (id: string | number) => [...createQueryKeys(feature).details(), id] as const,
})

// Common API request types
export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

export interface ListFilters {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  [key: string]: unknown
}

/**
 * Generic hook for fetching a list of items with pagination and filtering
 */
export function useApiList<T>(
  endpoint: string,
  filters: ListFilters = {},
  options: {
    enabled?: boolean
    staleTime?: number
    refetchInterval?: number
  } = {}
) {
  const queryKey = createQueryKeys(endpoint).list(filters)

  return useQuery({
    queryKey,
    queryFn: () => api.get<PaginatedResponse<T>>(`${endpoint}${buildQueryString(filters)}`),
    enabled: options.enabled ?? true,
    staleTime: options.staleTime ?? 5 * 60 * 1000, // 5 minutes
    refetchInterval: options.refetchInterval,
  })
}

/**
 * Generic hook for fetching a single item by ID
 */
export function useApiDetail<T>(
  endpoint: string,
  id: string | number,
  options: {
    enabled?: boolean
    staleTime?: number
  } = {}
) {
  const queryKey = createQueryKeys(endpoint).detail(id)

  return useQuery({
    queryKey,
    queryFn: () => api.get<T>(`${endpoint}/${id}`),
    enabled: options.enabled ?? !!id,
    staleTime: options.staleTime ?? 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Generic hook for creating new items
 */
export function useApiCreate<T, D = unknown>(
  endpoint: string,
  options: {
    onSuccess?: (data: T) => void
    onError?: (error: unknown) => void
    invalidateQueries?: string[]
  } = {}
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: D) => api.post<T, D>(endpoint, data),
    onSuccess: (data) => {
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: createQueryKeys(endpoint).lists() })

      // Invalidate custom queries if specified
      if (options.invalidateQueries) {
        options.invalidateQueries.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey: [queryKey] })
        })
      }

      options.onSuccess?.(data)
    },
    onError: options.onError,
  })
}

/**
 * Generic hook for updating items with optimistic updates
 */
export function useApiUpdate<T, D = Partial<T>>(
  endpoint: string,
  id: string | number,
  options: {
    onSuccess?: (data: T) => void
    onError?: (error: unknown) => void
    invalidateQueries?: string[]
    optimisticUpdate?: boolean
  } = {}
) {
  const queryClient = useQueryClient()
  const detailQueryKey = createQueryKeys(endpoint).detail(id)

  return useMutation({
    mutationFn: (data: D) => api.put<T, D>(`${endpoint}/${id}`, data),
    onMutate: async (newData) => {
      if (!options.optimisticUpdate) return

      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: detailQueryKey })

      // Get current data
      const previousData = queryClient.getQueryData<T>(detailQueryKey)

      // Optimistically update
      if (previousData) {
        queryClient.setQueryData(detailQueryKey, {
          ...previousData,
          ...newData,
        })
      }

      return { previousData }
    },
    onError: (error, _variables, context) => {
      // Rollback on error if using optimistic updates
      if (options.optimisticUpdate && context?.previousData) {
        queryClient.setQueryData(detailQueryKey, context.previousData)
      }
      options.onError?.(error)
    },
    onSuccess: (data) => {
      // Update the detail query
      queryClient.setQueryData(detailQueryKey, data)

      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: createQueryKeys(endpoint).lists() })

      // Invalidate custom queries if specified
      if (options.invalidateQueries) {
        options.invalidateQueries.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey: [queryKey] })
        })
      }

      options.onSuccess?.(data)
    },
    onSettled: () => {
      // Ensure data consistency
      queryClient.invalidateQueries({ queryKey: detailQueryKey })
    },
  })
}

/**
 * Generic hook for deleting items
 */
export function useApiDelete(
  endpoint: string,
  options: {
    onSuccess?: () => void
    onError?: (error: unknown) => void
    invalidateQueries?: string[]
  } = {}
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string | number) => api.delete(`${endpoint}/${id}`),
    onSuccess: () => {
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: createQueryKeys(endpoint).lists() })

      // Invalidate custom queries if specified
      if (options.invalidateQueries) {
        options.invalidateQueries.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey: [queryKey] })
        })
      }

      options.onSuccess?.()
    },
    onError: options.onError,
  })
}

/**
 * Hook for uploading files
 */
export function useFileUpload<T>(
  endpoint: string,
  options: {
    onSuccess?: (data: T) => void
    onError?: (error: unknown) => void
  } = {}
) {
  return useMutation({
    mutationFn: (file: File) => api.uploadFile<T>(endpoint, file),
    onSuccess: options.onSuccess,
    onError: options.onError,
  })
}

/**
 * Custom hook for infinite queries (pagination with load more)
 */
export function useApiInfinite<T>(
  endpoint: string,
  filters: Omit<ListFilters, 'page'> = {},
  options: {
    enabled?: boolean
    staleTime?: number
  } = {}
) {
  const queryKey = createQueryKeys(endpoint).list(filters)

  return useQuery({
    queryKey,
    queryFn: ({ pageParam = 1 }) =>
      api.get<PaginatedResponse<T>>(`${endpoint}${buildQueryString({ ...filters, page: pageParam })}`),
    enabled: options.enabled ?? true,
    staleTime: options.staleTime ?? 5 * 60 * 1000,
    // Note: For true infinite queries, you'd want to use useInfiniteQuery
    // This is a simplified version for basic pagination
  })
}

/**
 * Hook for making custom API calls with manual control
 */
export function useApiCall<T, D = unknown>(options: {
  onSuccess?: (data: T) => void
  onError?: (error: unknown) => void
} = {}) {
  return useMutation({
    mutationFn: ({
      method,
      endpoint,
      data,
      config
    }: {
      method: 'get' | 'post' | 'put' | 'patch' | 'delete'
      endpoint: string
      data?: D
      config?: ApiRequestConfig
    }) => {
      switch (method) {
        case 'get':
          return api.get<T>(endpoint, config)
        case 'post':
          return api.post<T, D>(endpoint, data, config)
        case 'put':
          return api.put<T, D>(endpoint, data, config)
        case 'patch':
          return api.patch<T, D>(endpoint, data, config)
        case 'delete':
          return api.delete<T>(endpoint, config)
        default:
          throw new Error(`Unsupported method: ${method}`)
      }
    },
    onSuccess: options.onSuccess,
    onError: options.onError,
  })
}