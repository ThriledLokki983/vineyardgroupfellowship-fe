import { useNavigate } from 'react-router-dom'
import { Text } from 'react-aria-components'
import Layout from '../../../components/Layout/Layout';
import ConfigurableForm from '../../../components/ConfigurableForm'
import { useRegistration } from '../../../hooks/useAuth'
import { type RegistrationFormData } from '../../../configs/hooks-interfaces'
import { type FormConfig, type FieldValue } from '../../../components/ConfigurableForm/types'
import { registrationSchema } from '../../../schemas'
import { ApiError } from '../../../services/api'
import { toast } from '../../../components/Toast'
import styles from './RegistrationPage.module.scss'

export const RegistrationPage = () => {
  const navigate = useNavigate()
  const { mutate: registerUser, isPending, error: registrationError } = useRegistration()

  // Extract server-side field errors from the API error
  const serverErrors = registrationError instanceof ApiError
    ? registrationError.errors
    : undefined

  const formConfig: FormConfig = {
    fields: [

      // Username field
      {
        name: 'username',
        label: 'Username',
        type: 'text',
        placeholder: 'Choose a username',
        isRequired: true
      },
      // Email field
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'your.email@example.com',
        isRequired: true
      },
      // Password field with validation feedback
      {
        name: 'password',
        label: 'Password',
        type: 'password',
        placeholder: 'Create a secure password',
        isRequired: true,
        showValidationFeedback: true
      },
      // Confirm password field
      {
        name: 'confirmPassword',
        label: 'Confirm Password',
        type: 'password',
        placeholder: 'Confirm your password',
        isRequired: true
      },
    ],
    submitButton: {
      text: 'Create My Account',
      loadingText: 'Creating Account...',
      variant: 'primary'
    },
    // Add Zod schema for validation
    schema: registrationSchema
  }

  const handleSubmit = (data: Record<string, FieldValue>) => {
    // Transform to the expected RegistrationFormData format
    const registrationData: RegistrationFormData = {
      username: data.username as string,
      email: data.email as string,
      password: data.password as string,
      confirmPassword: data.confirmPassword as string,
    }

    registerUser(registrationData, {
      onSuccess: (response) => {
        // Show success toast
        toast.success(
          'Account Created!',
          `Welcome to Vineyard Group Fellowship! Please check your email to verify your account.`
        )

        // Always navigate to account creation success page first
        // User should verify email before proceeding to onboarding
        navigate('/account-created', {
          state: {
            email: registrationData.email,
            onboardingNextStep: response.onboarding?.next_step
          },
          replace: true
        })
      },
      onError: (error) => {
        // Show error toast with specific error details
        if (error instanceof ApiError) {
          // If there are field-specific errors, show them in the toast
          if (error.errors && Object.keys(error.errors).length > 0) {
            const errorFields = Object.keys(error.errors)

            // If multiple fields have errors, show a summary
            if (errorFields.length > 1) {
              toast.error(
                'Registration Failed',
                `Please fix the errors in the form below (${errorFields.length} issues found).`
              )
            } else {
              // If single field error, show the specific error message
              const firstErrorField = errorFields[0]
              const firstErrorMessage = error.errors[firstErrorField]?.[0]

              // Show the actual error message from the server
              toast.error(
                'Registration Failed',
                firstErrorMessage || 'Please check the form below for errors.'
              )
            }
          } else {
            // Show generic error message
            toast.error(
              'Registration Failed',
              error.message || 'Unable to create account. Please try again.'
            )
          }
        } else {
          toast.error(
            'Registration Failed',
            'An unexpected error occurred. Please try again.'
          )
        }
      }
    })
  }

  return (
    <Layout design="auth" variant="fullscreen">
      <div className={styles.registrationContainer}>
        <div className={styles.registrationHeader}>
          <h4>Become part of a Community</h4>
          <Text className={styles.tagline}>Lets live life together as a Community.</Text>
        </div>

        <ConfigurableForm
          config={formConfig}
          onSubmit={handleSubmit}
          isPending={isPending}
          error={!serverErrors ? registrationError?.message || null : null}
          serverErrors={serverErrors}
          className={styles.registrationForm}
        />

        <div className={styles.privacyNote}>
          <svg className={styles.lockIcon} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 7V5C12 2.79 10.21 1 8 1C5.79 1 4 2.79 4 5V7C2.9 7 2 7.9 2 9V13C2 14.1 2.9 15 4 15H12C13.1 15 14 14.1 14 13V9C14 7.9 13.1 7 12 7ZM8 11.5C7.17 11.5 6.5 10.83 6.5 10C6.5 9.17 7.17 8.5 8 8.5C8.83 8.5 9.5 9.17 9.5 10C9.5 10.83 8.83 11.5 8 11.5ZM10.1 7H5.9V5C5.9 3.84 6.84 2.9 8 2.9C9.16 2.9 10.1 3.84 10.1 5V7Z" fill="currentColor"/>
          </svg>
          <Text>We'll never share your data. Your privacy is our priority.</Text>
        </div>

        <div className={styles.formFooter}>
          <Text>Already have an account?</Text>
          <button
            onClick={() => navigate('/login')}
            className={styles.footerLink}
          >
            Sign In
          </button>
        </div>
      </div>
    </Layout>
  )
};

export default RegistrationPage;