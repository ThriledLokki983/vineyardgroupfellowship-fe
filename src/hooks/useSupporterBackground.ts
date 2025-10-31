import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from 'src/services/api';
import { useAuthContext } from 'contexts/Auth/useAuthContext';
import type { SupporterBackgroundFormData } from 'src/schemas/supporterBackgroundSchema';

export function useSupporterBackground() {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  // GET existing background data
  const backgroundQuery = useQuery({
    queryKey: ['supporter-background'],
    queryFn: async () => {
      console.log('🔍 Fetching supporter background data');
      const data = await api.get('/supporter-background/');
      console.log('✅ Supporter background data received:', data);
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!user && user.user_purpose === 'providing_support', // Fetch for all supporters
  });

  // Get status from user profile (already loaded in auth context)
  const supporterInfo = user?.supporter_info;

  // POST/PATCH background data
  const updateMutation = useMutation({
    mutationFn: (data: Partial<SupporterBackgroundFormData>) =>
      api.post('/supporter-background/', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supporter-background'] });
      queryClient.invalidateQueries({ queryKey: ['me'] }); // Update user profile with new status
    },
  });

  // Submit for review
  const submitMutation = useMutation({
    mutationFn: (data: SupporterBackgroundFormData) =>
      api.post('/supporter-background/', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] }); // Update supporter_status
      queryClient.invalidateQueries({ queryKey: ['supporter-background'] });
    },
  });

  return {
    // Data
    background: backgroundQuery.data,
    supporterStatus: supporterInfo, // From user profile: background_required, background_completed, etc.

    // Loading states
    isLoading: backgroundQuery.isLoading,
    isUpdating: updateMutation.isPending,
    isSubmitting: submitMutation.isPending,

    // Error states
    error: backgroundQuery.error,
    updateError: updateMutation.error,
    submitError: submitMutation.error,

    // Actions
    updateBackground: updateMutation.mutate,
    submitBackground: submitMutation.mutate,

    // Helper methods
    needsBackgroundSetup: () =>
      supporterInfo?.background_required && !supporterInfo?.background_completed,
    isBackgroundPending: () =>
      supporterInfo?.background_completed && !supporterInfo?.background_approved,
    canLeadGroups: () =>
      supporterInfo?.can_lead_groups,

    // Refetch
    refetch: () => {
      backgroundQuery.refetch();
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  };
}

// Helper hook for checking supporter status across the app
export const useSupporterStatus = () => {
  const { user } = useAuthContext();
  const supporterInfo = user?.supporter_info;

  return {
    // Core status checks
    backgroundRequired: supporterInfo?.background_required ?? false,
    backgroundCompleted: supporterInfo?.background_completed ?? false,
    backgroundApproved: supporterInfo?.background_approved ?? false,
    canLeadGroups: supporterInfo?.can_lead_groups ?? false,

    // New availability fields
    canProvideSupport: supporterInfo?.can_provide_support ?? false,
    availableForOneOnOne: supporterInfo?.available_for_one_on_one ?? false,
    availableForGroupLeadership: supporterInfo?.available_for_group_leadership ?? false,

    // Training and credentials
    hasProfessionalCredentials: supporterInfo?.has_professional_credentials ?? false,
    completedTraining: supporterInfo?.completed_training ?? false,

    // Capacity and specializations
    maxMentees: supporterInfo?.max_mentees,
    specializations: supporterInfo?.specializations ?? [],

    // Status values
    status: supporterInfo?.supporter_status ?? 'pending',
    nextRequiredStep: supporterInfo?.next_required_step,
    nextSteps: supporterInfo?.next_steps ?? [],

    // Computed states
    needsBackgroundSetup: supporterInfo?.background_required && !supporterInfo?.background_completed,
    isPendingApproval: supporterInfo?.background_completed && !supporterInfo?.background_approved,
    isFullyApproved: supporterInfo?.background_approved && supporterInfo?.supporter_status === 'approved',
    needsTraining: supporterInfo?.next_required_step === 'complete_training',
    isActive: supporterInfo?.supporter_status === 'approved' && supporterInfo?.can_provide_support,
  };
};