import { API_BASE_URL } from '../configs/api-configs';
import {
  CSRF_URL,
  REFRESH_TOKEN_URL,
  TOKEN_EXCHANGE_URL,
  COMPLETE_ONBOARDING_URL,
  ONBOARDING_STEP_URL,
  ONBOARDING_STATUS_URL,
  RECOVERY_APPROACH_URL
} from '../configs/api-endpoints';
import { getCsrfTokenMatch } from '../configs/config-utils';

/**
 * API Service - Django-compatible HTTP client for Vineyard Group Fellowship
 * Uses fetch with CSRF token support and session-based authentication
 */

// API Configuration
const API_TIMEOUT = 30000 // 30 seconds

// CSRF Token Management
let csrfToken: string | null = null

// Access Token Management
// This will be set by AuthProvider after login
let getAccessTokenFn: (() => string | null) | null = null

export const setAccessTokenGetter = (fn: () => string | null) => {
  getAccessTokenFn = fn
}

const getCsrfToken = async (): Promise<string> => {
  // Always check cookies first (fastest)
  const cookieMatch = getCsrfTokenMatch();
  if (cookieMatch) {
    csrfToken = cookieMatch[1]
    return csrfToken
  }

  // If we have a cached token, use it
  if (csrfToken) {
    return csrfToken
  }

  try {

    // Try the dedicated CSRF endpoint first
    const response = await fetch(`${API_BASE_URL}${CSRF_URL}`, {
      method: 'GET',
      credentials: 'include', // CRITICAL for cookies
    })

    if (response.ok) {
      // After request, check cookies again (Django sets it via Set-Cookie header)
      const cookieAfterRequest = getCsrfTokenMatch();
      if (cookieAfterRequest) {
        csrfToken = cookieAfterRequest[1]
        return csrfToken
      }

      // Fallback: try to get from response body
      const data = await response.json()
      csrfToken = data.csrfToken || data.csrf_token
      if (csrfToken) {
        return csrfToken
      }
    }


    // Fallback: try API root endpoint
    const fallbackResponse = await fetch(`${API_BASE_URL.replace('/api/v1', '')}/api/v1/`, {
      method: 'GET',
      credentials: 'include',
    })

    if (fallbackResponse.ok) {
      // Check if CSRF token is now in cookies after the request
      const newCookieMatch = getCsrfTokenMatch();
      if (newCookieMatch) {
        csrfToken = newCookieMatch[1]
        return csrfToken
      }
    }

    throw new Error('Failed to fetch CSRF token from all sources')
  } catch (error) {
    console.error('❌ CSRF Token Error:', error)
    throw error
  }
}

// Fetch wrapper with timeout and AbortController
const fetchWithTimeout = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const timeoutController = new AbortController()
  const timeoutId = setTimeout(() => timeoutController.abort(), API_TIMEOUT)

  // Combine timeout signal with any existing signal
  let combinedSignal: AbortSignal
  if (options.signal) {
    // Create a combined abort controller that responds to both signals
    const combinedController = new AbortController()

    const handleAbort = () => combinedController.abort()
    options.signal.addEventListener('abort', handleAbort, { once: true })
    timeoutController.signal.addEventListener('abort', handleAbort, { once: true })

    combinedSignal = combinedController.signal
  } else {
    combinedSignal = timeoutController.signal
  }

  try {
    const response = await fetch(url, {
      ...options,
      signal: combinedSignal,
    })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    throw error
  }
}

// Base fetch wrapper with common headers and error handling
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`

  try {
    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }

    // Add custom headers if provided
    if (options.headers) {
      Object.assign(headers, options.headers)
    }

    // Add Authorization header with access token if available
    // Skip for token refresh endpoint (uses httpOnly cookie instead)
    if (getAccessTokenFn && endpoint !== REFRESH_TOKEN_URL) {
      const accessToken = getAccessTokenFn()
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`
      }
    }

    // Add CSRF token for unsafe methods
    if (options.method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method)) {
      const token = await getCsrfToken()
      headers['X-CSRFToken'] = token // Django requires exact case: X-CSRFToken
    }

    const response = await fetchWithTimeout(url, {
      ...options,
      headers,
      credentials: 'include', // Always include cookies for session management
    })

    // Handle non-2xx responses
    if (!response.ok) {
      let errorData: unknown
      try {
        errorData = await response.json()
      } catch {
        errorData = { message: response.statusText }
      }

      // Handle specific error cases
      if (response.status === 401) {
        // Unauthorized - clear any cached auth state
        csrfToken = null
        // Don't auto-redirect - let the calling code (AuthProvider) decide
        // This allows silent token refresh failures to be handled gracefully
      }

      if (response.status === 403) {
        // Forbidden - likely CSRF token issue, clear and retry could be implemented
        console.warn('🚫 403 Forbidden - clearing CSRF token cache')
        csrfToken = null
      }

      if (response.status >= 500) {
        console.error('Server error occurred:', response.status, response.statusText)
      }

      // Handle Django-style error responses
      throw ApiError.fromDjangoResponse({
        ...errorData as Record<string, unknown>,
        status: response.status
      })
    }

    // Parse response
    const responseData = await response.json()
    return responseData
  } catch (error) {
    // Log error in development
    if (import.meta.env.DEV) {
      console.error(`❌ API Error: ${options.method || 'GET'} ${endpoint}`, error)
    }

    if (error instanceof ApiError) {
      throw error
    }

    // Handle network errors, timeouts, etc.
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error occurred'
    )
  }
}

// API Response Types
export interface ApiResponse<T = unknown> {
  data: T
  message?: string
  success: boolean
}

// Token Exchange Response Type
export interface TokenExchangeResponse {
	access_token: string;
	user_id: number;
	email: string;
	expires_in: number;
	first_login: boolean;
	message: string;
}

// Onboarding step values
export type OnboardingStepValue =
  | "welcome"
  | "profile_setup"
  | "privacy_settings"
  | "recovery_goals"
  | "recovery_approach"
  | "community_preferences"
  | "notifications"
  | "completed";

// Onboarding Response Types
export interface OnboardingCompleteResponse {
  success: boolean;
  message: string;
}

export interface OnboardingStepResponse {
  step: OnboardingStepValue;
  current_step?: number; // For backward compatibility
}

export interface OnboardingStatusResponse {
  is_onboarded: boolean;
  onboarding_step: OnboardingStepValue;
  onboarding_completed_at: string | null;
}

// Recovery Approach Preference Types (aligned with backend)
export type RecoveryApproach = "religious" | "secular" | "mixed" | "undecided";
export type FaithTradition = "christian" | "muslim" | "jewish" | "buddhist" | "hindu" | "other" | "prefer_not_to_say";
export type ReligiousContentPreference = "high" | "moderate" | "minimal" | "none";

export interface RecoveryApproachPreferences {
  recovery_approach: RecoveryApproach;
  faith_tradition?: FaithTradition; // Required if approach is "religious"
  religious_content_preference?: ReligiousContentPreference;
}

export interface UpdateRecoveryApproachRequest {
  recovery_approach: RecoveryApproach;
  faith_tradition?: FaithTradition;
  religious_content_preference?: ReligiousContentPreference;
}

export interface RecoveryApproachResponse {
  message: string;
  recovery_preferences: {
    approach: RecoveryApproach;
    faith_tradition?: FaithTradition;
    content_preference?: ReligiousContentPreference;
    configured_at: string;
  };
  next_step: OnboardingStepValue;
}

// Error class for API errors
export class ApiError extends Error {
  public errors?: Record<string, string[]>
  public status?: number

  constructor(
    message: string,
    errors?: Record<string, string[]>,
    status?: number
  ) {
    super(message)
    this.name = 'ApiError'
    this.errors = errors
    this.status = status
  }

  // Extract field errors from Django response format
  static fromDjangoResponse(response: {
    status?: number
    detail?: string
    title?: string
    error?: string
    details?: Record<string, unknown>
    invalid_params?: Array<{ name: string; reason: string }>
    errors?: Record<string, string | string[]>
    non_field_errors?: string[]
    [key: string]: unknown // Allow additional fields for direct field errors
  }): ApiError {
    const status = response.status || 400
    const message = response.error || response.detail || response.title || 'Validation error'
    const errors: Record<string, string[]> = {}

    // Handle errors nested in 'details' object (common Django pattern)
    const errorSource = response.details || response

    // Handle Django's invalid_params format
    if (errorSource.invalid_params && Array.isArray(errorSource.invalid_params)) {
      (errorSource.invalid_params as Array<{ name: string; reason: string }>).forEach((param) => {
        if (!errors[param.name]) {
          errors[param.name] = []
        }
        errors[param.name].push(param.reason)
      })
    }

    // Handle other common Django error formats
    if (errorSource.errors && typeof errorSource.errors === 'object') {
      Object.keys(errorSource.errors).forEach(field => {
        const fieldErrors = (errorSource.errors as Record<string, string | string[]>)[field]
        if (Array.isArray(fieldErrors)) {
          errors[field] = fieldErrors
        } else if (typeof fieldErrors === 'string') {
          errors[field] = [fieldErrors]
        }
      })
    }

    // Handle non_field_errors (common Django pattern)
    if (errorSource.non_field_errors && Array.isArray(errorSource.non_field_errors)) {
      errors['non_field_errors'] = errorSource.non_field_errors as string[]
    }

    // Handle direct field errors (Django's default ValidationError format)
    // This is when the response directly contains field names as keys
    // e.g., { "password": ["error message"], "email": ["error message"] }
    Object.keys(errorSource).forEach(key => {
      if (['status', 'detail', 'title', 'error', 'details', 'invalid_params', 'errors', 'non_field_errors'].includes(key)) {
        return
      }

      const value = errorSource[key]
      if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
        errors[key] = value as string[]
      } else if (typeof value === 'string') {
        errors[key] = [value]
      }
    })

    return new ApiError(message, errors, status)
  }
}

// Request configuration for fetch-based API
export interface ApiRequestConfig {
  signal?: AbortSignal
  timeout?: number
  headers?: Record<string, string>
}

// Generic API methods using fetch
export const api = {
  // GET request
  get: async <T>(endpoint: string, config?: ApiRequestConfig): Promise<T> => {
    return apiRequest<T>(endpoint, {
      method: 'GET',
      signal: config?.signal,
      headers: config?.headers,
    })
  },

  // POST request
  post: async <T, D = unknown>(endpoint: string, data?: D, config?: ApiRequestConfig): Promise<T> => {
    return apiRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      signal: config?.signal,
      headers: config?.headers,
    })
  },

  // PUT request
  put: async <T, D = unknown>(endpoint: string, data?: D, config?: ApiRequestConfig): Promise<T> => {
    return apiRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      signal: config?.signal,
      headers: config?.headers,
    })
  },

  // PATCH request
  patch: async <T, D = unknown>(endpoint: string, data?: D, config?: ApiRequestConfig): Promise<T> => {
    return apiRequest<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      signal: config?.signal,
      headers: config?.headers,
    })
  },

  // DELETE request
  delete: async <T>(endpoint: string, config?: ApiRequestConfig): Promise<T> => {
    return apiRequest<T>(endpoint, {
      method: 'DELETE',
      signal: config?.signal,
      headers: config?.headers,
    })
  },

  // File upload
  uploadFile: async <T>(
    endpoint: string,
    file: File,
    config?: ApiRequestConfig
  ): Promise<T> => {
    const formData = new FormData()
    formData.append('file', file)

    // For file uploads, don't set Content-Type (let browser set it with boundary)
    const uploadHeaders = { ...config?.headers }
    delete uploadHeaders['Content-Type']

    return apiRequest<T>(endpoint, {
      method: 'POST',
      body: formData,
      signal: config?.signal,
      headers: uploadHeaders,
    })
  },

  // Token exchange for email verification
  exchangeToken: async (exchangeToken: string, signal?: AbortSignal): Promise<TokenExchangeResponse> => {
    return apiRequest<TokenExchangeResponse>(TOKEN_EXCHANGE_URL, {
      method: 'POST',
      body: JSON.stringify({ exchange_token: exchangeToken }),
      signal,
    })
  },

  // Onboarding API endpoints
  completeOnboarding: async (signal?: AbortSignal): Promise<OnboardingCompleteResponse> => {
    return apiRequest<OnboardingCompleteResponse>(COMPLETE_ONBOARDING_URL, {
      method: 'POST',
      signal,
    })
  },

  updateOnboardingStep: async (
    stepName: OnboardingStepValue,
    timeSpentMinutes: number = 0,
    signal?: AbortSignal
  ): Promise<OnboardingStepResponse> => {
    return apiRequest<OnboardingStepResponse>(ONBOARDING_STEP_URL, {
      method: 'PATCH',
      body: JSON.stringify({
        step: stepName,
        time_spent_minutes: timeSpentMinutes
      }),
      signal,
    })
  },

  updateRecoveryApproach: async (preferences: UpdateRecoveryApproachRequest, signal?: AbortSignal): Promise<RecoveryApproachResponse> => {
    return apiRequest<RecoveryApproachResponse>(RECOVERY_APPROACH_URL, {
      method: 'POST',
      body: JSON.stringify(preferences),
      signal,
    })
  },

  getOnboardingStatus: async (signal?: AbortSignal): Promise<OnboardingStatusResponse> => {
    return apiRequest<OnboardingStatusResponse>(ONBOARDING_STATUS_URL, {
      method: 'GET',
      signal,
    })
  },

  // Get CSRF token (useful for manual fetch calls)
  getCsrfToken: async (): Promise<string> => {
    return getCsrfToken()
  },

  // Get access token (useful for manual fetch calls)
  getAccessToken: (): string | null => {
    return getAccessTokenFn ? getAccessTokenFn() : null
  },
}

// Utility functions
export const clearCsrfToken = (): void => {
  csrfToken = null
}

export const refreshCsrfToken = async (): Promise<string> => {
  csrfToken = null
  return getCsrfToken()
}

export default api