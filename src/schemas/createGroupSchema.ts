/**
 * Group Creation Schema
 * Zod validation for creating new fellowship groups
 * Based on backend API structure from FRONTEND_INTEGRATION.md
 */

import { z } from 'zod';

// Main group creation schema matching backend API
export const createGroupSchema = z.object({
  name: z
    .string()
    .min(1, 'Group name is required')
    .max(200, 'Group name must be 200 characters or less'),

  description: z
    .string()
    .optional(),

  location: z
    .string()
    .max(255, 'Location must be 255 characters or less')
    .optional(),

  location_type: z
    .enum(['in_person', 'virtual', 'hybrid'])
    .optional(),

  member_limit: z
    .number()
    .int()
    .min(2, 'Group must allow at least 2 members')
    .max(100, 'Group cannot exceed 100 members')
    .optional()
    .default(12),

  is_open: z
    .boolean()
    .optional()
    .default(true),

  meeting_day: z
    .enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])
    .optional(),

  meeting_time: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, 'Invalid time format. Use HH:MM or HH:MM:SS')
    .optional(),

  meeting_frequency: z
    .enum(['weekly', 'biweekly', 'monthly'])
    .optional(),

  focus_areas: z
    .array(z.string())
    .optional()
    .default([]),

  visibility: z
    .enum(['public', 'community', 'private'])
    .optional()
    .default('public'),
});

export type CreateGroupFormData = z.infer<typeof createGroupSchema>;

// Default values for the form
export const createGroupDefaults: Partial<CreateGroupFormData> = {
  member_limit: 12,
  is_open: true,
  visibility: 'public',
  focus_areas: [],
};

export default createGroupSchema;