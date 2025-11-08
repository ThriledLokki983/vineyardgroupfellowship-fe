import { useNavigate } from 'react-router-dom';
import { useSignals } from '@preact/signals-react/runtime';
import { Text } from 'react-aria-components';
import { Layout, ConfigurableForm, Button } from 'components';
import { type FormConfig, type FieldValue } from 'components/ConfigurableForm/types';
import { forgotPasswordSchema } from 'schemas';
import { useForgotPassword } from 'hooks/useAuth';
import { ApiError } from 'services/api';
import { type ForgotPasswordData } from 'configs/hooks-interfaces';
import { forgotPasswordPage } from 'signals/auth-signals';
import styles from './ForgotPasswordPage.module.scss'

export const ForgotPasswordPage = () => {

  useSignals()
  const navigate = useNavigate()
  const mutation = useForgotPassword()

  // Extract server errors from ApiError
  const serverErrors = mutation.error instanceof ApiError ? mutation.error.errors : undefined

  const formConfig: FormConfig = {
    fields: [
      {
        name: 'email',
        label: 'Email Address',
        type: 'email',
        placeholder: 'Enter your email address',
        isRequired: true
      }
    ],
    submitButton: {
      text: 'Send Reset Instructions',
      loadingText: 'Sending...',
      variant: 'primary'
    },
    // Add Zod schema for validation
    schema: forgotPasswordSchema
  }

  const handleSubmit = (data: Record<string, FieldValue>) => {
    const resetData: ForgotPasswordData = {
      email: data.email as string
    }
    mutation.mutate(resetData, {
      onSuccess: () => {
        forgotPasswordPage.isEmailSent.setTrue()
      }
    })
  }

  const isEmailSent = forgotPasswordPage.isEmailSent.value.value

  // Success state after email is sent
  if (isEmailSent) {
    return (
      <Layout design="auth" variant="fullscreen">
        <div className={styles.forgotPasswordContainer}>
          <div className={styles.successState}>
            <div className={styles.successIcon}>✓</div>
            <h1>Check Your Email</h1>
            <Text>
              We've sent password reset instructions to your email address.
              Please check your inbox and follow the link to reset your password.
            </Text>
            <Text className={styles.additionalInfo}>
              Didn't receive the email? Check your spam folder or try again.
            </Text>

            <div className={styles.actionButtons}>
              <Button
                onPress={() => forgotPasswordPage.isEmailSent.setFalse()}
                variant="secondary"
              >
                Try Different Email
              </Button>
              <Button
                onPress={() => navigate('/login')}
                variant="primary"
              >
                Back to Sign In
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  // Form state
  return (
    <Layout design="auth" variant="fullscreen">
      <div className={styles.forgotPasswordContainer}>
        <div className={styles.forgotPasswordHeader}>
          <h4>Reset Your Password</h4>
          <Text>
            Enter your email address and we'll send you instructions to reset your password.
          </Text>
        </div>

        <ConfigurableForm
          config={formConfig}
          onSubmit={handleSubmit}
          isPending={mutation.isPending}
          error={mutation.error?.message || null}
          serverErrors={serverErrors}
          className={styles.forgotPasswordForm}
        />

        <div className={styles.backToLogin}>
          <Text>Remember your password? </Text>
          <Button onPress={() => navigate('/login')} variant="tertiary">
            Back to Sign In
          </Button>
        </div>
      </div>
    </Layout>
  )
};

export default ForgotPasswordPage;