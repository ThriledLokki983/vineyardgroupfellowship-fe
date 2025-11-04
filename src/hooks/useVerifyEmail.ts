/**
 * Email Verification Hook
 * Handles email verification API call when user clicks verification link
 */

import { useMutation } from '@tanstack/react-query';
import { api } from '../services/api';
import { EMAIL_VERIFY_URL } from '../configs/api-endpoints';

interface VerifyEmailParams {
  uidb64: string;
  token: string;
}

interface VerifyEmailResponse {
  message: string;
  exchange_token?: string; // Added for new email verification flow
  user_id?: number;
  email?: string;
  already_verified?: boolean;
  user?: {
    email: string;
    is_verified: boolean;
  };
}

export const useVerifyEmail = () => {
  return useMutation<VerifyEmailResponse, Error, VerifyEmailParams>({
    mutationFn: async ({ uidb64, token }: VerifyEmailParams) => {
      return api.post(EMAIL_VERIFY_URL, {
        uidb64,
        token,
      });
    },
  });
};
