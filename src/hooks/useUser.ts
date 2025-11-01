import { useAuthContext } from '../contexts/Auth/useAuthContext';

/**
 * Adapter hook for ProfileCard compatibility
 * Maps our auth context to the expected user structure
 */
export const useUser = () => {
  const { user, isLoading } = useAuthContext();

  return {
    user,
    isLoading,
  };
};
