/**
 * Authentication API hooks using React Query
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import type { Location } from 'react-router-dom';
import { useAuthContext } from '../contexts/Auth/useAuthContext';
import { api, ApiError } from '../services/api';
import { REGISTER_USER_URL, LOGIN_USER_URL, USER_PROFILE_URL, REFRESH_TOKEN_URL, LOGOUT_USER_URL, RESET_PASSWORD_URL, CHANGE_PASSWORD_URL } from '../configs/api-endpoints';
import type {
	User,
	LoginData,
	AuthResponse,
	RegistrationData,
	RegistrationResponse,
	ResetPasswordData,
	ForgotPasswordData,
	RegistrationFormData,
} from '../configs/hooks-interfaces';

// Location state interface for post-login redirect
interface LocationState {
  from?: Location;
}

/**
 * API functions
 */
const authApi = {
  register: async (formData: RegistrationFormData): Promise<RegistrationResponse> => {
    // Transform form data to API payload format
    const payload: RegistrationData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      password_confirm: formData.confirmPassword,
      // Don't send first_name/last_name since they're not collected
      user_purpose: 'seeking_recovery', // Default to seeking recovery since not collected in form
      terms_accepted: true, // Default to true
      privacy_policy_accepted: true, // Default to true
      terms_of_service_accepted: true, // Default to true
    }

    return api.post<RegistrationResponse, RegistrationData>(REGISTER_USER_URL, payload)
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    // Ensure data conforms to expected structure
    if (!data.email_or_username || !data.password) {
      throw new Error('Email/username and password are required for login')
    }

    // Call the API to log in
    return api.post<AuthResponse, LoginData>(LOGIN_USER_URL, data)
  },

  logout: async (): Promise<void> => {
    return api.post<void>(LOGOUT_USER_URL, {});
  },

  resetPassword: async (data: ForgotPasswordData): Promise<{ message: string }> => {
    return api.post<{ message: string }, ForgotPasswordData>(RESET_PASSWORD_URL, data)
  },

  changePassword: async (data: ResetPasswordData): Promise<{ message: string }> => {
    return api.post<{ message: string }, ResetPasswordData>(CHANGE_PASSWORD_URL, data)
  },

  refreshToken: async (): Promise<{ token: string }> => {
    return api.post<{ token: string }>(REFRESH_TOKEN_URL)
  },

  getCurrentUser: async (): Promise<User> => {
    return api.get<User>(USER_PROFILE_URL)
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    return api.put<User, Partial<User>>('/auth/profile', data)
  },
}

// React Query Keys
export const authKeys = {
  all: ['auth'] as const,
  currentUser: () => [...authKeys.all, 'currentUser'] as const,
} as const

// Custom Hooks

/**
 * Registration hook
 * Note: Navigation is handled by the component to allow flexibility
 * (e.g., redirect to account success page instead of login)
 */
export function useRegistration() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      // Clear any existing auth state since user needs to login
      queryClient.removeQueries({ queryKey: authKeys.currentUser() })

      // Navigation is handled by the component (RegistrationPage)
      // This allows flexibility in where to redirect (success page, login, etc.)
    },
    onError: (error) => {
      console.error('Registration failed:', error)

      // Parse field-specific errors from API response
      if (error instanceof ApiError && error.errors) {
        // Field-specific validation errors handled by component
      }

      // Error handling is done by the component
    },
  })
}

/**
 * Login hook with optimistic navigation
 * Uses AuthContext for secure token management
 */
export function useLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login: authLogin } = useAuthContext() // Use AuthContext login

  return useMutation({
    mutationFn: async (data: LoginData) => {
      // Call AuthContext login (tokens stored in memory)
      await authLogin(
        data.email_or_username,
        data.password,
        data.remember_me,
        data.device_name
      )

      return data // Return for onSuccess
    },
    onSuccess: () => {
      // Navigate to the intended destination or home page
      const state = location.state as LocationState
      const from = state?.from?.pathname || '/'
      navigate(from, { replace: true })
    },
    onError: (error) => {
      console.error('Login failed:', error)
    },
  })
}

/**
 * Logout hook with cache cleanup
 * Uses AuthContext for secure token management
 */
export function useLogout() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { logout: authLogout } = useAuthContext() // Use AuthContext logout

  return useMutation({
    mutationFn: async () => {
      // Call AuthContext logout (clears tokens from memory)
      await authLogout()
    },
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear()

      // Navigate to login
      navigate('/login')
    },
    onError: () => {
      // Even if logout fails on server, clear local data
      queryClient.clear()
      navigate('/login')
    },
  })
}

/**
 * Forgot password hook
 */
export function useForgotPassword() {
  return useMutation({
    mutationFn: authApi.resetPassword,
    onError: (error) => {
      console.error('Forgot password failed:', error)
    },
  })
}

/**
 * Reset password hook
 */
export function useResetPassword() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      // Navigate to login with success message
      navigate('/login?reset=success')
    },
    onError: (error) => {
      console.error('Reset password failed:', error)
    },
  })
}

/**
 * Get current user query
 * Now uses AuthContext instead of localStorage
 */
export function useCurrentUser() {
  const { user, getAccessToken } = useAuthContext()

  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: authApi.getCurrentUser,
    enabled: !!getAccessToken(), // Only fetch if token exists in memory
    initialData: user || undefined, // Use user from context as initial data
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: unknown) => {
      // Don't retry on 401 errors
      const axiosError = error as { response?: { status?: number } }
      if (axiosError?.response?.status === 401) {
        return false
      }
      return failureCount < 3
    },
  })
}

/**
 * Update profile hook with optimistic updates
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.updateProfile,
    onMutate: async (newProfile) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: authKeys.currentUser() })

      // Get current data
      const previousUser = queryClient.getQueryData(authKeys.currentUser())

      // Optimistically update
      if (previousUser) {
        queryClient.setQueryData(authKeys.currentUser(), {
          ...previousUser,
          ...newProfile,
        })
      }

      return { previousUser }
    },
    onError: (error, _variables, context) => {
      // Rollback on error
      if (context?.previousUser) {
        queryClient.setQueryData(authKeys.currentUser(), context.previousUser)
      }
      console.error('Profile update failed:', error)
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: authKeys.currentUser() })
    },
  })
}

/**
 * Change password hook
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: authApi.changePassword,
    onError: (error) => {
      console.error('Password change failed:', error)
    },
  })
}

/**
 * Check if user is authenticated
 * Now uses AuthContext directly
 */
export function useIsAuthenticated(): boolean {
  const { isAuthenticated } = useAuthContext()
  return isAuthenticated
}

export default authApi