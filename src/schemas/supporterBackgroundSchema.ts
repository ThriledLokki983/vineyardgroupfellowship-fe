import { z } from 'zod';

// Supporter Background Schema matching backend requirements
export const supporterBackgroundSchema = z.object({
  // Personal Recovery Story - Required, min 50 characters
  personal_recovery_story: z.string()
    .min(50, 'Personal story must be at least 50 characters')
    .max(2000, 'Personal story must be less than 2000 characters'),

  // Addiction Types Experienced - Required, at least one selection
  addiction_types_experienced: z.array(z.string())
    .min(1, 'Please select at least one addiction type you have experience with'),

  // Professional Credentials - Boolean + conditional array of objects
  has_professional_credentials: z.boolean(),
  professional_credentials: z.array(z.object({
    name: z.string(),
    document: z.string().optional(), // Base64 encoded document data
    document_url: z.string().nullable().optional(),
    document_filename: z.string().nullable().optional(),
    uploaded_at: z.string().nullable().optional()
  })).optional(),

  // Specializations - Optional array
  specializations: z.array(z.string()).optional(),

  // Availability preferences - Required
  available_for_one_on_one: z.boolean(),
  available_for_group_leadership: z.boolean(),

  // Maximum mentees - Conditional on one_on_one availability
  max_mentees: z.number()
    .min(1, 'Maximum mentees must be at least 1')
    .max(50, 'Maximum mentees must be 50 or less')
    .optional(),

  // Communication preferences - Optional
  time_zone_availability: z.string().optional(),
  preferred_communication_methods: z.array(z.string()).optional(),
}).refine((data) => {
  // If has professional credentials, must provide at least one credential
  if (data.has_professional_credentials && (!data.professional_credentials || data.professional_credentials.length === 0)) {
    return false;
  }
  return true;
}, {
  message: 'Professional credentials are required when you indicate having them',
  path: ['professional_credentials']
}).refine((data) => {
  // If available for one-on-one, must provide max_mentees
  if (data.available_for_one_on_one && !data.max_mentees) {
    return false;
  }
  return true;
}, {
  message: 'Maximum mentees is required when available for one-on-one mentoring',
  path: ['max_mentees']
});

// Export TypeScript type
export type SupporterBackgroundFormData = z.infer<typeof supporterBackgroundSchema>;

// Addiction types options for form
export const ADDICTION_TYPES_OPTIONS = [
  { value: 'alcohol', label: 'Alcohol' },
  { value: 'opioids', label: 'Opioids' },
  { value: 'cocaine', label: 'Cocaine' },
  { value: 'methamphetamine', label: 'Methamphetamine' },
  { value: 'cannabis', label: 'Cannabis' },
  { value: 'prescription_drugs', label: 'Prescription Drugs' },
  { value: 'gambling', label: 'Gambling' },
  { value: 'nicotine', label: 'Nicotine/Tobacco' },
  { value: 'sex_addiction', label: 'Sex Addiction' },
  { value: 'food_addiction', label: 'Food/Eating Disorders' },
  { value: 'shopping', label: 'Shopping/Spending' },
  { value: 'internet_gaming', label: 'Internet/Gaming' },
  { value: 'other', label: 'Other' },
] as const;

// Specialization options for form
export const SPECIALIZATIONS_OPTIONS = [
  { value: 'group_therapy', label: 'Group Therapy', description: 'Leading and facilitating group sessions' },
  { value: 'family_counseling', label: 'Family Counseling', description: 'Supporting families affected by addiction' },
  { value: 'trauma_informed_care', label: 'Trauma-Informed Care', description: 'Supporting trauma survivors in recovery' },
  { value: 'lgbtq_support', label: 'LGBTQ+ Support', description: 'Supporting LGBTQ+ individuals in recovery' },
  { value: 'young_adults', label: 'Young Adults', description: 'Supporting people in their teens and twenties' },
  { value: 'dual_diagnosis', label: 'Dual Diagnosis', description: 'Supporting people with addiction and mental health conditions' },
  { value: 'relapse_prevention', label: 'Relapse Prevention', description: 'Helping prevent and manage relapse situations' },
  { value: 'newcomer_support', label: 'Newcomer Support', description: 'Helping people in early recovery (first 90 days)' },
  { value: 'workplace_issues', label: 'Workplace Issues', description: 'Recovery in professional settings' },
  { value: 'spiritual_recovery', label: 'Spiritual Recovery', description: 'Faith-based and spiritual approaches' },
] as const;

// Communication methods options
export const COMMUNICATION_METHODS_OPTIONS = [
  { value: 'video_call', label: 'Video Calls', description: 'Face-to-face video conversations' },
  { value: 'text_chat', label: 'Text Chat', description: 'Written messaging and chat' },
  { value: 'voice_call', label: 'Voice Calls', description: 'Audio-only phone conversations' },
  { value: 'email', label: 'Email', description: 'Email correspondence' },
  { value: 'forum_messaging', label: 'Forum Messaging', description: 'Group discussions and forums' },
] as const;

// Form step validation schemas for individual steps
export const personalStorySchema = supporterBackgroundSchema.pick({
  personal_recovery_story: true
});

export const addictionTypesSchema = supporterBackgroundSchema.pick({
  addiction_types_experienced: true
});

export const credentialsSchema = supporterBackgroundSchema.pick({
  has_professional_credentials: true,
  professional_credentials: true
}).refine((data) => {
  if (data.has_professional_credentials && (!data.professional_credentials || data.professional_credentials.length === 0)) {
    return false;
  }
  return true;
}, {
  message: 'Professional credentials are required when you indicate having them',
  path: ['professional_credentials']
});

export const availabilitySchema = supporterBackgroundSchema.pick({
  available_for_one_on_one: true,
  available_for_group_leadership: true,
  max_mentees: true
}).refine((data) => {
  if (data.available_for_one_on_one && !data.max_mentees) {
    return false;
  }
  return true;
}, {
  message: 'Maximum mentees is required when available for one-on-one mentoring',
  path: ['max_mentees']
});