/**
 * Group Creation Schema
 * Zod validation for creating new recovery groups
 */

import { z } from 'zod';

// Recovery focus options
export const recoveryFocusSchema = z.enum(['substance', 'behavioral', 'mental_health'], {
  message: 'Please select a recovery focus type',
});

// Location type options
export const locationTypeSchema = z.enum(['online', 'hybrid', 'in_person'], {
  message: 'Please select a location type',
});

// Privacy level options
export const privacyLevelSchema = z.enum(['public', 'private', 'invite_only'], {
  message: 'Please select a privacy level',
});

// Location details schema
export const locationDetailsSchema = z.object({
  timezone: z.string().optional(),
  meeting_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  city: z.string().min(1, 'City is required for in-person groups').optional(),
  state: z.string().min(1, 'State is required for in-person groups').optional(),
});

// Group settings schema
export const groupSettingsSchema = z.object({
  allow_public_posts: z.boolean({
    message: 'Please specify post visibility settings',
  }),
  require_approval: z.boolean({
    message: 'Please specify approval requirements',
  }),
  max_members: z.number()
    .min(2, 'Group must allow at least 2 members')
    .max(500, 'Group cannot exceed 500 members')
    .int('Member limit must be a whole number'),
});

// Tags schema
export const tagsSchema = z.array(z.string().min(1, 'Tags cannot be empty'))
  .min(1, 'Please add at least one tag to help others discover your group')
  .max(10, 'Please limit to 10 tags maximum');

// Main group creation schema
export const createGroupSchema = z.object({
  name: z.string()
    .min(3, 'Group name must be at least 3 characters')
    .max(100, 'Group name cannot exceed 100 characters')
    .regex(/^[a-zA-Z0-9\s\-'.,&]+$/, 'Group name contains invalid characters'),

  description: z.string()
    .min(20, 'Description must be at least 20 characters to help members understand the group')
    .max(1000, 'Description cannot exceed 1000 characters'),

  privacy_level: privacyLevelSchema,
  recovery_focus: recoveryFocusSchema,
  location_type: locationTypeSchema,
  location_details: locationDetailsSchema,
  group_settings: groupSettingsSchema,
  tags: tagsSchema,
}).refine((data) => {
  // Conditional validation for location details based on location_type
  if (data.location_type === 'online' && !data.location_details.meeting_url) {
    return false;
  }
  if (data.location_type === 'in_person' && (!data.location_details.city || !data.location_details.state)) {
    return false;
  }
  if (data.location_type === 'hybrid' && !data.location_details.meeting_url) {
    return false;
  }
  return true;
}, {
  message: 'Location details must match the selected location type',
  path: ['location_details'],
});

// Export the inferred type
export type CreateGroupFormData = z.infer<typeof createGroupSchema>;

// Helper schemas for form steps (if using multi-step form)
export const basicInfoSchema = createGroupSchema.pick({
  name: true,
  description: true,
  privacy_level: true,
});

export const focusAndLocationSchema = createGroupSchema.pick({
  recovery_focus: true,
  location_type: true,
  location_details: true,
});

export const settingsAndTagsSchema = createGroupSchema.pick({
  group_settings: true,
  tags: true,
});

// Default values for the form
export const createGroupDefaults: Partial<CreateGroupFormData> = {
  privacy_level: 'public',
  recovery_focus: 'substance',
  location_type: 'online',
  location_details: {
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    meeting_url: '',
    city: '',
    state: '',
  },
  group_settings: {
    allow_public_posts: true,
    require_approval: false,
    max_members: 50,
  },
  tags: [],
};

export default createGroupSchema;