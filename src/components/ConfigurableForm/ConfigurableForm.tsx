import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, Text } from 'react-aria-components'
import { Button } from 'components'
import { calculatePasswordStrength } from '../../utils/utils'
import type { ConfigurableFormProps, FieldConfig, FieldGroup, FieldValue } from './types'
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
  // Initialize default values for all fields
  const getDefaultValues = (): Record<string, FieldValue> => {
    const defaults: Record<string, FieldValue> = { ...initialData }

    const initializeFields = (fields: FieldConfig[]) => {
      fields.forEach(field => {
        if (!(field.name in defaults)) {
          if (field.type === 'checkbox' && !field.options) {
            defaults[field.name] = false
          } else if (field.type === 'checkbox_group' || (field.type === 'checkbox' && field.options)) {
            defaults[field.name] = []
          } else if (field.type === 'radio') {
            defaults[field.name] = ''
          } else {
            defaults[field.name] = ''
          }
        }
      })
    }

    config.fields.forEach(item => {
      if (isFieldGroup(item)) {
        initializeFields(item.fields)
      } else {
        if (!(item.name in defaults)) {
          if (item.type === 'checkbox' && !item.options) {
            defaults[item.name] = false
          } else if (item.type === 'checkbox_group' || (item.type === 'checkbox' && item.options)) {
            defaults[item.name] = []
          } else if (item.type === 'radio') {
            defaults[item.name] = ''
          } else {
            defaults[item.name] = ''
          }
        }
      }
    })

    return defaults
  }

  // Initialize React Hook Form with Zod resolver if schema is provided
  const {
    control,
    handleSubmit: handleFormSubmit,
    setError,
    clearErrors,
    reset
  } = useForm<Record<string, FieldValue>>({
    defaultValues: getDefaultValues(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: config.schema ? zodResolver(config.schema as any) : undefined,
    mode: 'onChange'
  })

  // Update form when initialData changes
  useEffect(() => {
    if (Object.keys(initialData).length > 0) {
      reset(initialData)
    }
  }, [initialData, reset])

  // Handle server-side errors
  useEffect(() => {
    if (serverErrors && Object.keys(serverErrors).length > 0) {
      Object.entries(serverErrors).forEach(([field, messages]) => {
        if (field !== 'non_field_errors') {
          setError(field, {
            type: 'server',
            message: Array.isArray(messages) ? messages[0] : messages
          })
        }
      })
    } else {
      clearErrors()
    }
  }, [serverErrors, setError, clearErrors])

  const hasServerErrors = serverErrors && Object.keys(serverErrors).length > 0

  const handleSubmit = (data: Record<string, FieldValue>) => {
    onSubmit(data)
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
    return (
      <Controller
        name={field.name}
        control={control}
        render={({ field: controllerField, fieldState }) => {
          const errorMessage = fieldState.error?.message

          if (field.type === 'checkbox_group' || (field.type === 'checkbox' && field.options)) {
            return (
              <CheckboxGroup
                value={controllerField.value}
                field={field}
                onChange={controllerField.onChange}
                error={errorMessage}
              />
            )
          }

          if (field.type === 'radio') {
            return (
              <RadioGroupField
                value={controllerField.value}
                field={field}
                onChange={controllerField.onChange}
                error={errorMessage}
              />
            )
          }

          if (field.type === 'checkbox') {
            return (
              <CheckboxField
                value={controllerField.value}
                field={field}
                onChange={controllerField.onChange}
              />
            )
          }

          return (
            <TextInputField
              value={controllerField.value}
              field={field}
              onChange={controllerField.onChange}
              onBlur={controllerField.onBlur}
              error={errorMessage}
              renderPasswordStrengthMeter={renderPasswordStrengthMeter}
            />
          )
        }}
      />
    )
  }

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
      <Form onSubmit={handleFormSubmit(handleSubmit)} validationErrors={serverErrors} className={styles.form}>
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
