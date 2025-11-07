/**
 * Messaging Feature Type Definitions
 * Based on MESSAGING_FEATURE_FRONTEND_INTEGRATION.md
 */

// ============================================================
// USER & AUTHOR TYPES
// ============================================================

export interface Author {
  id: string;
  username: string;
  first_name?: string;
  last_name?: string;
}

// ============================================================
// DISCUSSION TYPES
// ============================================================

export interface Discussion {
  id: string;
  group: string;
  author: Author;
  title: string;
  content: string;
  is_pinned: boolean;
  comment_count: number;
  reaction_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreateDiscussionPayload {
  group: string;
  title: string;
  content: string;
}

export interface UpdateDiscussionPayload {
  title?: string;
  content?: string;
}

// ============================================================
// COMMENT TYPES
// ============================================================

export interface Comment {
  id: string;
  // Content type reference - only one should be present
  discussion?: string;
  prayer?: string;
  testimony?: string;
  scripture?: string;
  author: Author;
  parent: string | null;
  content: string;
  created_at: string;
  updated_at: string;
  is_edited: boolean;
  is_reported: boolean;
  can_edit: boolean;
  replies?: Comment[];
}

export interface CreateCommentPayload {
  // Content type reference - only one should be present
  discussion?: string;
  prayer?: string;
  testimony?: string;
  scripture?: string;
  content: string;
  parent?: string;
}

export interface UpdateCommentPayload {
  content: string;
}

// ============================================================
// REACTION TYPES
// ============================================================

export type ReactionType = 'like' | 'love' | 'pray' | 'amen';

export interface Reaction {
  id: string;
  user: string | Author;
  discussion: string;
  reaction_type: ReactionType;
  created_at: string;
}

export interface CreateReactionPayload {
  discussion: string;
  reaction_type: ReactionType;
}

// ============================================================
// PRAYER REQUEST TYPES
// ============================================================

export type PrayerUrgency = 'normal' | 'urgent' | 'critical';
export type PrayerCategory = 'personal' | 'family' | 'health' | 'work' | 'ministry' | 'salvation' | 'other';

export interface PrayerRequest {
  id: string;
  group: string;
  author: Author;
  title: string;
  content: string;
  urgency: PrayerUrgency;
  category: PrayerCategory;
  is_answered: boolean;
  answer_description: string | null;
  answered_at: string | null;
  prayer_count: number;
  comment_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreatePrayerRequestPayload {
  group: string;
  title: string;
  content: string;
  urgency: PrayerUrgency;
  category: PrayerCategory;
}

export interface MarkPrayerAnsweredPayload {
  answer_description: string;
}

// ============================================================
// TESTIMONY TYPES
// ============================================================

export interface Testimony {
  id: string;
  group: string;
  author: Author;
  title: string;
  content: string;
  answered_prayer: string | null;
  is_public: boolean;
  is_public_approved: boolean;
  approved_by: Author | null;
  approved_at: string | null;
  comment_count: number;
  created_at: string;
}

export interface CreateTestimonyPayload {
  group: string;
  title: string;
  content: string;
  answered_prayer?: string | null;
}

// ============================================================
// SCRIPTURE TYPES
// ============================================================

export type BibleTranslation = 'KJV' | 'NIV' | 'ESV' | 'NLT' | 'NKJV' | 'NASB' | 'MSG';

export interface Scripture {
  id: string;
  group: string;
  group_name?: string;
  author: Author;
  reference: string;
  verse_text: string;
  translation: BibleTranslation;
  reflection?: string;
  has_reflection: boolean;
  source: string;
  reaction_count: number;
  comment_count: number;
  is_reported: boolean;
  created_at: string;
  updated_at: string;
  can_edit: boolean;
}

export interface CreateScripturePayload {
  group: string;
  reference: string;
  verse_text: string;
  translation: BibleTranslation;
  reflection?: string;
}

export interface VerseLookupResponse {
  reference: string;
  text: string;
  translation: BibleTranslation;
  translation_note?: string;
  source: string;
}

// ============================================================
// FEED TYPES
// ============================================================

export type FeedContentType = 'discussion' | 'prayer' | 'testimony' | 'scripture';

export interface FeedItem {
  id: string;
  group: string;
  content_type: FeedContentType;
  content_id: string;
  author: Author;
  title: string;
  preview: string;
  comment_count: number;
  reaction_count: number;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
  has_viewed?: boolean; // Optional until backend implements
}

// ============================================================
// CONTENT REPORT TYPES
// ============================================================

export type ReportReason = 'spam' | 'harassment' | 'inappropriate' | 'misinformation' | 'other';
export type ReportStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed';

export interface ContentReport {
  id: string;
  reporter: string;
  content_type: string;
  content_id: string;
  reason: ReportReason;
  description: string;
  status: ReportStatus;
  created_at: string;
}

export interface CreateReportPayload {
  content_type: string;
  content_id: string;
  reason: ReportReason;
  description?: string;
}

// ============================================================
// NOTIFICATION PREFERENCES TYPES
// ============================================================

export interface NotificationPreferences {
  id: string;
  user: string;
  email_enabled: boolean;
  email_new_discussion: boolean;
  email_new_comment: boolean;
  email_new_reaction: boolean;
  email_discussion_pinned: boolean;
  email_new_prayer: boolean;
  email_urgent_prayer: boolean;
  email_prayer_answered: boolean;
  email_testimony_shared: boolean;
  email_testimony_approved: boolean;
  email_scripture_shared: boolean;
  quiet_hours_enabled: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
}

export interface UpdateNotificationPreferencesPayload {
  email_enabled?: boolean;
  email_new_discussion?: boolean;
  email_new_comment?: boolean;
  email_new_reaction?: boolean;
  email_discussion_pinned?: boolean;
  email_new_prayer?: boolean;
  email_urgent_prayer?: boolean;
  email_prayer_answered?: boolean;
  email_testimony_shared?: boolean;
  email_testimony_approved?: boolean;
  email_scripture_shared?: boolean;
  quiet_hours_enabled?: boolean;
  quiet_hours_start?: string;
  quiet_hours_end?: string;
}

// ============================================================
// PAGINATED RESPONSE TYPES
// ============================================================

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ============================================================
// API RESPONSE TYPES
// ============================================================

export interface ApiSuccessResponse {
  message: string;
  [key: string]: unknown;
}

export interface PinDiscussionResponse {
  id: string;
  is_pinned: boolean;
  message: string;
}

export interface PrayCountResponse {
  id: string;
  prayer_count: number;
  message: string;
}
