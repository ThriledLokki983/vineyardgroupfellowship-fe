// Export all form schemas and their TypeScript types
export { registrationSchema, type RegistrationFormData, UserPurpose, type UserPurposeType } from './registrationSchema'
export { loginSchema, type LoginFormData } from './loginSchema'
export { forgotPasswordSchema, type ForgotPasswordFormData } from './forgotPasswordSchema'
export {
  supporterBackgroundSchema,
  type SupporterBackgroundFormData,
  ADDICTION_TYPES_OPTIONS,
  SPECIALIZATIONS_OPTIONS,
  COMMUNICATION_METHODS_OPTIONS,
  personalStorySchema,
  addictionTypesSchema,
  credentialsSchema,
  availabilitySchema
} from './supporterBackgroundSchema'
export {
  createGroupSchema,
  type CreateGroupFormData,
  recoveryFocusSchema,
  locationTypeSchema,
  privacyLevelSchema,
  groupSettingsSchema,
  createGroupDefaults,
  basicInfoSchema,
  focusAndLocationSchema,
  settingsAndTagsSchema
} from './createGroupSchema'