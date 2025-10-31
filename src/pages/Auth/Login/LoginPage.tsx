import { useNavigate, useLocation } from 'react-router-dom'
import { Text } from 'react-aria-components'
import Layout from '../../../components/Layout/Layout';
import ConfigurableForm from '../../../components/ConfigurableForm'
import { useLogin } from '../../../hooks/useAuth'
import type { LoginData } from '../../../configs/hooks-interfaces'
import { type FormConfig, type FieldValue } from '../../../components/ConfigurableForm/types'
import { loginSchema } from '../../../schemas'
import { ApiError } from '../../../services/api'
import { toast } from '../../../components/Toast'
import styles from './LoginPage.module.scss'

export const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { mutate: loginUser, isPending, error: loginError } = useLogin()

  // Extract server-side field errors from the API error
  const serverErrors = loginError instanceof ApiError
    ? loginError.errors
    : undefined

  const formConfig: FormConfig = {
    fields: [
      {
        name: 'email_or_username',
        label: 'Email or Username',
        type: 'text',
        placeholder: 'Enter your email or username',
        isRequired: true
      },
      {
        name: 'password',
        label: 'Password',
        type: 'password',
        placeholder: 'Enter your password',
        isRequired: true
      },
      {
        name: 'remember_me',
        label: 'Remember Me',
        type: 'checkbox',
        checkboxLabel: 'Keep me signed in for 30 days'
      }
    ],
    submitButton: {
      text: 'Sign In',
      loadingText: 'Signing In...',
      variant: 'primary'
    },
    // Add Zod schema for validation
    schema: loginSchema
    // Remove footer to create custom links section below
  }

  const handleSubmit = (data: Record<string, FieldValue>) => {
    // Transform to the expected LoginData format
    const loginPayload: LoginData = {
      email_or_username: data.email_or_username as string,
      password: data.password as string,
      remember_me: data.remember_me as boolean,
      device_name: 'Web Browser'
    }

    loginUser(loginPayload, {
      onSuccess: () => {
        toast.success('Welcome back!', 'You have successfully signed in.')
      },
      onError: (error) => {
        if (error instanceof ApiError) {
          if (error.errors && Object.keys(error.errors).length > 0) {
            // Get the first field error to display in toast
            const firstErrorField = Object.keys(error.errors)[0]
            const firstErrorMessage = error.errors[firstErrorField]?.[0]

            toast.error(
              'Sign In Failed',
              firstErrorMessage || 'Please check your credentials and try again.'
            )
          } else {
            toast.error(
              'Sign In Failed',
              error.message || 'Unable to sign in. Please check your credentials.'
            )
          }
        } else {
          toast.error('Sign In Failed', 'An unexpected error occurred. Please try again.')
        }
      }
    })
  }

  // Get initial data for pre-filling email from registration success
  const getInitialData = (): Record<string, FieldValue> => {
    const initialData: Record<string, FieldValue> = {
      email_or_username: '',
      password: '',
      remember_me: false
    }

    // Pre-fill email if coming from registration (optional)
    if (location.state?.registrationSuccess && location.state?.email) {
      initialData.email_or_username = location.state.email
    }

    return initialData
  }

  return (
    <Layout design="auth" variant="fullscreen">
      <div className={styles.loginContainer}>
        <div className={styles.loginHeader}>
          <h4>Sign in to Continue</h4>
          <Text>Lets keep going ...</Text>
        </div>

        {/* Registration success message */}
        {location.state?.registrationSuccess && (
          <div className={styles.successMessage}>
            <Text>
              🎉 Account created successfully! Please sign in with your new credentials.
            </Text>
          </div>
        )}

        <ConfigurableForm
          config={formConfig}
          onSubmit={handleSubmit}
          isPending={isPending}
          error={!serverErrors ? loginError?.message || null : null}
          serverErrors={serverErrors}
          initialData={getInitialData()}
          className={styles.loginForm}
        />

        <div className={styles.actionLinks}>
          <button
            onClick={() => navigate('/register')}
            className={styles.linkButton}
          >
            Create Account
          </button>
          <button
            onClick={() => navigate('/forgot-password')}
            className={styles.linkButton}
          >
            Reset Password
          </button>
        </div>
      </div>
    </Layout>
  )
};

export default LoginPage;