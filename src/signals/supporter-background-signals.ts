/**
 * Supporter Background Signals
 *
 * Centralized state management for SupporterBackground page and wizard flow.
 * Replaces 25+ useState calls across main component and all step components.
 */

import { signal, computed } from '@preact/signals-react'
import { createToggleSignal } from './signal-utils'
import type { SupporterBackgroundFormData } from '../schemas/supporterBackgroundSchema'

// Document type for credentials display
export interface SupporterDocument {
  id: string
  name: string
  type: string
  url: string
  uploadedAt: string
  size?: number
}

// Mode types
export type SupporterBackgroundMode = 'setup' | 'edit' | 'review' | 'display'
export type SupporterBackgroundTab = 'details' | 'documents'
export type WizardStepId = 'personal-story' | 'addiction-types' | 'credentials' | 'specializations' | 'availability' | 'communication' | 'review'

/**
 * Supporter Background Page State
 */
export const supporterBackgroundPage = {
  // Page-level UI state
  mode: signal<SupporterBackgroundMode>('setup'),
  activeTab: signal<SupporterBackgroundTab>('details'),
  documents: signal<SupporterDocument[]>([]),
  isUploadingDocument: createToggleSignal(false),

  // Wizard state
  wizard: {
    selectedTab: signal<WizardStepId>('personal-story'),
    completedSteps: signal<Set<WizardStepId>>(new Set()),

    // Form data for all wizard steps
    formData: signal<Partial<SupporterBackgroundFormData>>({
      personal_recovery_story: '',
      addiction_types_experienced: [],
      has_professional_credentials: false,
      professional_credentials: [],
      specializations: [],
      available_for_one_on_one: false,
      available_for_group_leadership: false,
      max_mentees: undefined,
      time_zone_availability: '',
      preferred_communication_methods: [],
    }),

    // Computed: Check if all required steps are completed
    allRequiredStepsComplete: computed((): boolean => {
      const completed = supporterBackgroundPage.wizard.completedSteps.value
      const requiredSteps: WizardStepId[] = ['personal-story', 'addiction-types', 'availability']
      return requiredSteps.every(step => completed.has(step))
    }),

    // Computed: Check if specific step is accessible
    canAccessStep: (stepId: WizardStepId, mode: SupporterBackgroundMode): boolean => {
      if (mode === 'review') return true // All steps accessible in review mode

      const stepOrder: WizardStepId[] = [
        'personal-story',
        'addiction-types',
        'credentials',
        'specializations',
        'availability',
        'communication',
        'review',
      ]

      const stepIndex = stepOrder.indexOf(stepId)
      if (stepIndex === 0) return true // First step always accessible

      const completed = supporterBackgroundPage.wizard.completedSteps.value
      const requiredSteps: WizardStepId[] = ['personal-story', 'addiction-types', 'availability']

      // Check if previous required steps are completed
      for (let i = 0; i < stepIndex; i++) {
        const prevStep = stepOrder[i]
        if (requiredSteps.includes(prevStep) && !completed.has(prevStep)) {
          return false
        }
      }
      return true
    },

    // Actions
    updateFormData: (data: Partial<SupporterBackgroundFormData>) => {
      supporterBackgroundPage.wizard.formData.value = {
        ...supporterBackgroundPage.wizard.formData.value,
        ...data,
      }
    },

    markStepComplete: (stepId: WizardStepId) => {
      const newCompleted = new Set(supporterBackgroundPage.wizard.completedSteps.value)
      newCompleted.add(stepId)
      supporterBackgroundPage.wizard.completedSteps.value = newCompleted

      // Auto-advance to next step
      const stepOrder: WizardStepId[] = [
        'personal-story',
        'addiction-types',
        'credentials',
        'specializations',
        'availability',
        'communication',
        'review',
      ]
      const currentIndex = stepOrder.indexOf(stepId)
      if (currentIndex < stepOrder.length - 1) {
        supporterBackgroundPage.wizard.selectedTab.value = stepOrder[currentIndex + 1]
      }
    },

    selectTab: (stepId: WizardStepId) => {
      supporterBackgroundPage.wizard.selectedTab.value = stepId
    },

    loadInitialData: (data: Partial<SupporterBackgroundFormData>) => {
      supporterBackgroundPage.wizard.formData.value = data

      // Initialize completed steps based on data
      const completed = new Set<WizardStepId>()
      if (data.personal_recovery_story) completed.add('personal-story')
      if (data.addiction_types_experienced?.length) completed.add('addiction-types')
      if (data.has_professional_credentials !== undefined) completed.add('credentials')
      if (data.specializations?.length) completed.add('specializations')
      if (data.available_for_one_on_one !== undefined) completed.add('availability')
      if (data.preferred_communication_methods?.length) completed.add('communication')

      supporterBackgroundPage.wizard.completedSteps.value = completed
    },

    reset: () => {
      supporterBackgroundPage.wizard.selectedTab.value = 'personal-story'
      supporterBackgroundPage.wizard.completedSteps.value = new Set()
      supporterBackgroundPage.wizard.formData.value = {
        personal_recovery_story: '',
        addiction_types_experienced: [],
        has_professional_credentials: false,
        professional_credentials: [],
        specializations: [],
        available_for_one_on_one: false,
        available_for_group_leadership: false,
        max_mentees: undefined,
        time_zone_availability: '',
        preferred_communication_methods: [],
      }
    },
  },

  // Step-specific state
  steps: {
    // Personal Story Step
    personalStory: {
      story: signal<string>(''),
      errors: signal<string[]>([]),
      touched: createToggleSignal(false),
    },

    // Addiction Types Step
    addictionTypes: {
      selectedTypes: signal<string[]>([]),
      otherText: signal<string>(''),
      errors: signal<string[]>([]),
      touched: createToggleSignal(false),
    },

    // Credentials Step
    credentials: {
      hasCredentials: createToggleSignal(false),
      credentials: signal<Array<{
        name: string
        document?: string
        document_url?: string | null
        document_filename?: string | null
        uploaded_at?: string | null
      }>>([]),
      credentialFiles: signal<(File | null)[]>([null]),
      uploadingFiles: signal<boolean[]>([false]),
    },

    // Specializations Step
    specializations: {
      selectedSpecs: signal<string[]>([]),
    },

    // Availability Step
    availability: {
      oneOnOne: createToggleSignal(false),
      groupLeadership: createToggleSignal(false),
      maxMentees: signal<number | undefined>(undefined),
    },

    // Communication Step
    communication: {
      timeZone: signal<string>(''),
      commMethods: signal<string[]>([]),
    },
  },

  // Page actions
  setMode: (mode: SupporterBackgroundMode) => {
    supporterBackgroundPage.mode.value = mode
  },

  setActiveTab: (tab: SupporterBackgroundTab) => {
    supporterBackgroundPage.activeTab.value = tab
  },

  setDocuments: (docs: SupporterDocument[]) => {
    supporterBackgroundPage.documents.value = docs
  },

  addDocument: (doc: SupporterDocument) => {
    supporterBackgroundPage.documents.value = [
      ...supporterBackgroundPage.documents.value,
      doc,
    ]
  },

  removeDocument: (docId: string) => {
    supporterBackgroundPage.documents.value = supporterBackgroundPage.documents.value.filter(
      doc => doc.id !== docId
    )
  },

  startDocumentUpload: () => {
    supporterBackgroundPage.isUploadingDocument.setTrue()
  },

  finishDocumentUpload: () => {
    supporterBackgroundPage.isUploadingDocument.setFalse()
  },

  // Initialize from API data
  loadFromApi: (backgroundData: { professional_credentials?: Array<{
    name?: string
    document?: string
    document_url?: string | null
    document_filename?: string | null
    uploaded_at?: string | null
  }> } | null) => {
    // Transform professional credentials into documents format
    if (backgroundData?.professional_credentials) {
      const transformedDocuments: SupporterDocument[] = backgroundData.professional_credentials
        .filter((credential) => credential.document_url || credential.document)
        .map((credential, index: number) => ({
          id: `credential-${index}`,
          name: credential.document_filename || credential.name || 'Document',
          type: credential.document_filename?.split('.').pop()?.toLowerCase() || 'pdf',
          url: credential.document_url || '#',
          uploadedAt: credential.uploaded_at || new Date().toISOString(),
          size: undefined,
        }))

      supporterBackgroundPage.setDocuments(transformedDocuments)
    }

    // Set mode based on data
    if (backgroundData) {
      supporterBackgroundPage.setMode('display')
    }
  },

  // Reset all state
  reset: () => {
    supporterBackgroundPage.mode.value = 'setup'
    supporterBackgroundPage.activeTab.value = 'details'
    supporterBackgroundPage.documents.value = []
    supporterBackgroundPage.isUploadingDocument.setFalse()
    supporterBackgroundPage.wizard.reset()

    // Reset step-specific state
    supporterBackgroundPage.steps.personalStory.story.value = ''
    supporterBackgroundPage.steps.personalStory.errors.value = []
    supporterBackgroundPage.steps.personalStory.touched.setFalse()

    supporterBackgroundPage.steps.addictionTypes.selectedTypes.value = []
    supporterBackgroundPage.steps.addictionTypes.otherText.value = ''
    supporterBackgroundPage.steps.addictionTypes.errors.value = []
    supporterBackgroundPage.steps.addictionTypes.touched.setFalse()

    supporterBackgroundPage.steps.credentials.hasCredentials.setFalse()
    supporterBackgroundPage.steps.credentials.credentials.value = []
    supporterBackgroundPage.steps.credentials.credentialFiles.value = [null]
    supporterBackgroundPage.steps.credentials.uploadingFiles.value = [false]

    supporterBackgroundPage.steps.specializations.selectedSpecs.value = []

    supporterBackgroundPage.steps.availability.oneOnOne.setFalse()
    supporterBackgroundPage.steps.availability.groupLeadership.setFalse()
    supporterBackgroundPage.steps.availability.maxMentees.value = undefined

    supporterBackgroundPage.steps.communication.timeZone.value = ''
    supporterBackgroundPage.steps.communication.commMethods.value = []
  },
}
