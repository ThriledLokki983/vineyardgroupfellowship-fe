import { useEffect, useMemo } from 'react'
import { useSignals } from '@preact/signals-react/runtime'
import { Form, Text } from 'react-aria-components'
import { z } from 'zod'
import { Button } from 'components'
import { createFormSignal } from 'signals/form-signals'
import type { ConfigurableFormProps, FieldConfig, FieldGroup, FieldValue, PasswordStrengthState } from './types'
import { isFieldGroup } from './types'
import { CheckboxGroup, CheckboxField, RadioGroupField, TextInputField } from './fields'
import styles from './ConfigurableForm.module.scss'

export default function ConfigurableForm({
  config,
  onSubmit,
  isPending = false,
  error = null,
  initialData = {},
  className = '',
  serverErrors = {}
}: ConfigurableFormProps) {
  useSignals();

  const formSignal = useMemo(() => {
    const initial: Record<string, FieldValue> = { ...initialData }

    const initializeFields = (fields: FieldConfig[]) => {
      fields.forEach(field => {
        if (!(field.name in initial)) {
          if (field.type === 'checkbox' && !field.options) {
            initial[field.name] = false
          } else if (field.type === 'checkbox_group' || (field.type === 'checkbox' && field.options)) {
            initial[field.name] = []
          } else if (field.type === 'radio') {
            initial[field.name] = ''
          } else {
            initial[field.name] = ''
          }
        }
      })
    }

    config.fields.forEach(item => {
      if (isFieldGroup(item)) {
        initializeFields(item.fields)
      } else {
        if (!(item.name in initial)) {
          if (item.type === 'checkbox' && !item.options) {
            initial[item.name] = false
          } else if (item.type === 'checkbox_group' || (item.type === 'checkbox' && item.options)) {
            initial[item.name] = []
          } else if (item.type === 'radio') {
            initial[item.name] = ''
          } else {
            initial[item.name] = ''
          }
        }
      }
    })

    return createFormSignal(initial)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update form data when initialData changes (use ref to track previous value)
  useEffect(() => {
    if (Object.keys(initialData).length > 0) {
      Object.entries(initialData).forEach(([key, value]) => {
        formSignal.setFieldValue(key, value)
      })
    }
  }, [initialData, formSignal]);

  useEffect(() => {
    if (serverErrors && Object.keys(serverErrors).length > 0) {
      formSignal.setServerErrors(serverErrors)
    }
  }, [serverErrors, formSignal]);

  const hasServerErrors = serverErrors && Object.keys(serverErrors).length > 0

  // Validate form data with Zod schema
  const validateFormData = (data: Record<string, FieldValue>) => {
    if (!config.schema) {
      formSignal.clearErrors()
      return true
    }

    try {
      config.schema.parse(data)
      formSignal.clearErrors()
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.issues.forEach(issue => {
          if (issue.path.length > 0) {
            formSignal.setFieldError(issue.path[0] as string, issue.message)
          }
        })
      }
      return false
    }
  };

  const handleInputChange = (fieldName: string, value: FieldValue) => {
    formSignal.setFieldValue(fieldName, value)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (config.schema && !validateFormData(formSignal.data.value)) {
      return
    };

    onSubmit(formSignal.data.value);
  };

  // Password strength calculation function
  const calculatePasswordStrength = (password: string): PasswordStrengthState => {
    if (!password || password.length === 0) {
      return {
        score: 0,
        strength: 'very-weak',
        feedback: 'Enter a password',
        percentage: 0
      };
    }

    let score = 0;
    let feedback = '';

    // Length check (0-1 points)
    if (password.length >= 8) score += 1
    else if (password.length >= 6) score += 0.5

    // Character variety checks (0-2 points)
    if (/[a-z]/.test(password)) score += 0.5 // lowercase
    if (/[A-Z]/.test(password)) score += 0.5 // uppercase
    if (/\d/.test(password)) score += 0.5 // numbers
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) score += 0.5 // special chars

    // Common patterns penalty (-0.5 to -1 points)
    if (/^(password|123456|admin|user|test|login)$/i.test(password)) score -= 1
    if (/(.)\1{2,}/.test(password)) score -= 0.5 // repeated characters

    // Calculate final strength
    const finalScore = Math.max(0, Math.min(4, score))
    const percentage = (finalScore / 4) * 100

    if (finalScore < 1) {
      feedback = 'Very weak - add length and variety'
    } else if (finalScore < 2) {
      feedback = 'Weak - needs more character types'
    } else if (finalScore < 3) {
      feedback = 'Fair - getting stronger'
    } else if (finalScore < 4) {
      feedback = 'Strong - excellent password'
    } else {
      feedback = 'Very strong - perfect!'
    }

    const strengthLevels: PasswordStrengthState['strength'][] = ['very-weak', 'weak', 'fair', 'strong', 'very-strong']
    const strengthIndex = Math.min(Math.floor(finalScore), 4)

    return {
      score: finalScore,
      strength: strengthLevels[strengthIndex],
      feedback,
      percentage
    }
  }

  const renderPasswordStrengthMeter = (password: string) => {
    const strength = calculatePasswordStrength(password)

    return (
      <div className={styles.passwordStrengthMeter}>
        <div className={styles.strengthBar}>
          <div
            className={`${styles.strengthFill} ${styles[strength.strength]}`}
            style={{
              width: `${strength.percentage}%`,
              '--strength-percentage': `${strength.percentage}%`
            } as React.CSSProperties}
          />
        </div>
        <div className={styles.strengthFeedback}>
          <span className={`${styles.strengthLabel} ${styles[strength.strength]}`}>
            {strength.feedback}
          </span>
        </div>
      </div>
    );

  };

  const renderField = (field: FieldConfig) => {
    if (field.type === 'checkbox_group' || (field.type === 'checkbox' && field.options)) {
      return (
        <CheckboxGroup
          value={formSignal.data.value[field.name]}
          field={field}
          handleInputChange={handleInputChange}
          formSignal={formSignal}
        />
      );

    };

    if (field.type === 'radio') {
      return (
        <RadioGroupField
          value={formSignal.data.value[field.name]}
          field={field}
          handleInputChange={handleInputChange}
          formSignal={formSignal}
        />
      );

    };

    if (field.type === 'checkbox') {
      return (
        <CheckboxField
          value={formSignal.data.value[field.name]}
          field={field}
          handleInputChange={handleInputChange}
        />
      );

    };

    return (
      <TextInputField
        value={formSignal.data.value[field.name]}
        field={field}
        handleInputChange={handleInputChange}
        formSignal={formSignal}
        renderPasswordStrengthMeter={renderPasswordStrengthMeter}
      />
    );

  };

  const renderFieldGroup = (group: FieldGroup) => {
    return (
      <div
        key={group.fields.map(f => f.name).join('-')}
        className={`${styles.fieldGroup} ${styles[group.layout]} ${group.className || ''}`}
      >
        {group.fields.map(field => (
          <div key={field.name}>
            {renderField(field)}
          </div>
        ))}
      </div>
    );

  };

  return (
    <div className={`${styles.configurableForm} ${className}`}>
      <Form onSubmit={handleSubmit} validationErrors={serverErrors} className={styles.form}>
        {config.fields.map(item =>
          isFieldGroup(item)
            ? renderFieldGroup(item)
            : <div key={(item as FieldConfig).name}>{renderField(item as FieldConfig)}</div>
        )}

        {error && !hasServerErrors && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        {hasServerErrors && (
          <div className={styles.errorMessage}>
            {serverErrors.non_field_errors ? (
              <>
                {serverErrors.non_field_errors.map((err, index) => (
                  <div key={index}>{err}</div>
                ))}
              </>
            ) : (
              'Please fix the errors below and try again.'
            )}
          </div>
        )}

        <Button
          type="submit"
          variant={config.submitButton.variant || 'primary'}
          isDisabled={isPending}
        >
          {isPending
            ? (config.submitButton.loadingText || 'Loading...')
            : config.submitButton.text
          }
        </Button>
      </Form>

      {config.footer && (
        <div className={styles.footer}>
          <Text>{config.footer.text}</Text>
          <Button
            onPress={config.footer.onButtonClick}
            variant={config.footer.buttonVariant || 'tertiary'}
          >
            {config.footer.buttonText}
          </Button>
        </div>
      )}
    </div>
  );

};
