/**
 * Profile Page Signals
 *
 * Centralized state management for ProfilePage UI and form state.
 * Replaces multiple useState calls with reactive signals.
 */

import { signal, computed } from '@preact/signals-react'
import { createToggleSignal } from './signal-utils'
import type { User } from '../configs/hooks-interfaces'

// Extended profile interface that includes fields not in the base User type
export interface ExtendedProfile extends User {
  recovery_approach?: string
  faith_tradition?: string
  religious_content_preference?: string
  streak_days?: number
  milestones?: number
  support_groups?: number
  followers?: number
}

// Profile form data interface
export interface ProfileFormData {
  id: number | null
  firstName: string
  lastName: string
  username: string
  email: string
  displayName: string
  location: string
  bio: string
  timezone: string
  recoveryStage: string
  sobrietyDate: string | null
  recoveryApproach: string
  faithTradition: string
  religiousContentPreference: string
  profileVisibility: string
  showSobrietyDate: boolean
  allowDirectMessages: boolean
  emailNotifications: boolean
  communityNotifications: boolean
  emergencyNotifications: boolean
  photoVisibility: string
  photoUrl: string | null
  photoThumbnailUrl: string | null
  canUploadPhoto: boolean
  streakDays: number
  milestones: number
  supportGroups: number
  followers: number
}

/**
 * Profile Page State
 */
export const profilePage: {
  activeTab: ReturnType<typeof signal<string>>
  isEditing: ReturnType<typeof createToggleSignal>
  isSaving: ReturnType<typeof createToggleSignal>
  isUploadingPhoto: ReturnType<typeof createToggleSignal>
  uploadError: ReturnType<typeof signal<string | null>>
  formData: ReturnType<typeof signal<ProfileFormData>>
  originalData: ReturnType<typeof signal<ProfileFormData | null>>
  touchedFields: ReturnType<typeof signal<Set<string>>>
  hasChanges: ReturnType<typeof computed<boolean>>
  isValid: ReturnType<typeof computed<boolean>>
  isSaveDisabled: ReturnType<typeof computed<boolean>>
  updateField: (field: keyof ProfileFormData, value: unknown) => void
  loadProfile: (data: ExtendedProfile) => void
  startEditing: () => void
  cancelEditing: () => void
  startSaving: () => void
  finishSaving: () => void
  savingError: () => void
  startPhotoUpload: () => void
  finishPhotoUpload: (photoUrl: string, thumbnailUrl?: string) => void
  photoUploadError: (error: string) => void
  reset: () => void
} = {
  // Active tab (sidebar navigation)
  activeTab: signal<string>('profile'),

  // Editing mode
  isEditing: createToggleSignal(false),

  // Saving state
  isSaving: createToggleSignal(false),

  // Photo upload state
  isUploadingPhoto: createToggleSignal(false),
  uploadError: signal<string | null>(null),

  // Current form data (working copy)
  formData: signal<ProfileFormData>({
    id: null,
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    displayName: '',
    location: '',
    bio: '',
    timezone: 'UTC',
    recoveryStage: '',
    sobrietyDate: null,
    recoveryApproach: 'religious',
    faithTradition: 'christian',
    religiousContentPreference: 'moderate',
    profileVisibility: 'private',
    showSobrietyDate: false,
    allowDirectMessages: true,
    emailNotifications: true,
    communityNotifications: true,
    emergencyNotifications: true,
    photoVisibility: 'community',
    photoUrl: null,
    photoThumbnailUrl: null,
    canUploadPhoto: true,
    streakDays: 0,
    milestones: 0,
    supportGroups: 0,
    followers: 0,
  }),

  // Original profile data (for change detection)
  originalData: signal<ProfileFormData | null>(null),

  // Touched fields (for dirty state tracking)
  touchedFields: signal<Set<string>>(new Set()),

  // Computed: Check if form has unsaved changes
  hasChanges: computed((): boolean => {
    return (profilePage.touchedFields.value?.size || 0) > 0
  }),

  // Computed: Check if form is valid
  isValid: computed((): boolean => {
    const data = profilePage.formData.value
    if (!data) return false
    // Basic validation rules
    return (
      data.firstName.trim().length > 0 &&
      data.lastName.trim().length > 0 &&
      data.email.trim().length > 0 &&
      data.username.trim().length > 0
    )
  }),

  // Computed: Save button disabled state
  isSaveDisabled: computed((): boolean => {
    return (
      !profilePage.hasChanges.value ||
      !profilePage.isValid.value ||
      profilePage.isSaving.value.value
    )
  }),

  /**
   * Actions
   */

  // Update a single field and mark as touched
  updateField: (field: keyof ProfileFormData, value: unknown) => {
    profilePage.formData.value = {
      ...profilePage.formData.value!,
      [field]: value,
    } as ProfileFormData
    const newTouched = new Set(profilePage.touchedFields.value)
    newTouched.add(field)
    profilePage.touchedFields.value = newTouched
  },

  // Load profile data from API response
  loadProfile: (data: ExtendedProfile) => {
    const profileData: ProfileFormData = {
      id: data.id ? Number(data.id) : null,
      firstName: data.first_name || '',
      lastName: data.last_name || '',
      username: data.username || '',
      email: data.email || '',
      displayName: data.display_name || '',
      location: data.location || '',
      bio: data.bio || '',
      timezone: data.timezone || 'UTC',
      recoveryStage: data.recovery_stage || '',
      sobrietyDate: data.sobriety_date || null,
      recoveryApproach: data.recovery_approach || 'religious',
      faithTradition: data.faith_tradition || 'christian',
      religiousContentPreference: data.religious_content_preference || 'moderate',
      profileVisibility: data.profile_visibility || 'private',
      showSobrietyDate: data.show_sobriety_date || false,
      allowDirectMessages: data.allow_direct_messages !== false,
      emailNotifications: data.email_notifications !== false,
      communityNotifications: data.community_notifications !== false,
      emergencyNotifications: data.emergency_notifications !== false,
      photoVisibility: data.photo_visibility || 'community',
      photoUrl: data.photo_url || null,
      photoThumbnailUrl: data.photo_thumbnail_url || null,
      canUploadPhoto: data.can_upload_photo !== false,
      streakDays: data.streak_days || 0,
      milestones: data.milestones || 0,
      supportGroups: data.support_groups || 0,
      followers: data.followers || 0,
    }

    profilePage.formData.value = profileData
    profilePage.originalData.value = { ...profileData }
    profilePage.touchedFields.value = new Set()
  },

  // Enter edit mode
  startEditing: () => {
    profilePage.isEditing.setTrue()
  },

  // Cancel editing and revert changes
  cancelEditing: () => {
    if (profilePage.originalData.value) {
      profilePage.formData.value = { ...profilePage.originalData.value }
      profilePage.touchedFields.value = new Set()
    }
    profilePage.isEditing.setFalse()
  },

  // Start saving process
  startSaving: () => {
    profilePage.isSaving.setTrue()
  },

  // Finish saving (success)
  finishSaving: () => {
    profilePage.isSaving.setFalse()
    profilePage.isEditing.setFalse()
    profilePage.originalData.value = { ...profilePage.formData.value! } as ProfileFormData
    profilePage.touchedFields.value = new Set()
  },

  // Finish saving (error - keep editing mode)
  savingError: () => {
    profilePage.isSaving.setFalse()
  },

  // Photo upload actions
  startPhotoUpload: () => {
    profilePage.isUploadingPhoto.setTrue()
    profilePage.uploadError.value = null
  },

  finishPhotoUpload: (photoUrl: string, thumbnailUrl?: string) => {
    profilePage.isUploadingPhoto.setFalse()
    profilePage.updateField('photoUrl', photoUrl)
    if (thumbnailUrl) {
      profilePage.updateField('photoThumbnailUrl', thumbnailUrl)
    }
    profilePage.uploadError.value = null
  },

  photoUploadError: (error: string) => {
    profilePage.isUploadingPhoto.setFalse()
    profilePage.uploadError.value = error
  },

  // Reset all state
  reset: () => {
    profilePage.activeTab.value = 'profile'
    profilePage.isEditing.setFalse()
    profilePage.isSaving.setFalse()
    profilePage.isUploadingPhoto.setFalse()
    profilePage.uploadError.value = null
    profilePage.touchedFields.value = new Set()
    profilePage.formData.value = {
      id: null,
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      displayName: '',
      location: '',
      bio: '',
      timezone: 'UTC',
      recoveryStage: '',
      sobrietyDate: null,
      recoveryApproach: 'religious',
      faithTradition: 'christian',
      religiousContentPreference: 'moderate',
      profileVisibility: 'private',
      showSobrietyDate: false,
      allowDirectMessages: true,
      emailNotifications: true,
      communityNotifications: true,
      emergencyNotifications: true,
      photoVisibility: 'community',
      photoUrl: null,
      photoThumbnailUrl: null,
      canUploadPhoto: true,
      streakDays: 0,
      milestones: 0,
      supportGroups: 0,
      followers: 0,
    }
    profilePage.originalData.value = null
  },
}
