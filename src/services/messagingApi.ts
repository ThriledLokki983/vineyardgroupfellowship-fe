/**
 * Messaging API Service
 * Handles all messaging-related API calls
 */

import { api } from './api';
import type {
  Discussion,
  CreateDiscussionPayload,
  UpdateDiscussionPayload,
  Comment,
  CreateCommentPayload,
  UpdateCommentPayload,
  Reaction,
  CreateReactionPayload,
  PrayerRequest,
  CreatePrayerRequestPayload,
  MarkPrayerAnsweredPayload,
  Testimony,
  CreateTestimonyPayload,
  Scripture,
  CreateScripturePayload,
  VerseLookupResponse,
  FeedItem,
  ContentReport,
  CreateReportPayload,
  NotificationPreferences,
  UpdateNotificationPreferencesPayload,
  PaginatedResponse,
  PinDiscussionResponse,
  PrayCountResponse,
  FeedContentType,
  ReactionType,
  PrayerUrgency,
  PrayerCategory,
  BibleTranslation,
  ReportReason,
  ReportStatus,
} from '../types/messaging';

const BASE_URL = '/messaging';

// ============================================================
// DISCUSSIONS API
// ============================================================

export const discussionsApi = {
  /**
   * List discussions with optional filters
   */
  list: async (params: {
    group: string;
    is_pinned?: boolean;
    search?: string;
    ordering?: string;
    page?: number;
    page_size?: number;
    signal?: AbortSignal;
  }): Promise<PaginatedResponse<Discussion>> => {
    const queryParams = new URLSearchParams();
    queryParams.append('group', params.group);
    if (params.is_pinned !== undefined) queryParams.append('is_pinned', String(params.is_pinned));
    if (params.search) queryParams.append('search', params.search);
    if (params.ordering) queryParams.append('ordering', params.ordering);
    if (params.page) queryParams.append('page', String(params.page));
    if (params.page_size) queryParams.append('page_size', String(params.page_size));

    return api.get(`${BASE_URL}/discussions/?${queryParams.toString()}`, { signal: params.signal });
  },

  /**
   * Create a new discussion (leaders only)
   */
  create: async (payload: CreateDiscussionPayload): Promise<Discussion> => {
    return api.post(`${BASE_URL}/discussions/`, payload);
  },

  /**
   * Get a single discussion by ID
   */
  get: async (id: string, signal?: AbortSignal): Promise<Discussion> => {
    return api.get(`${BASE_URL}/discussions/${id}/`, { signal });
  },

  /**
   * Update a discussion (author only)
   */
  update: async (id: string, payload: UpdateDiscussionPayload): Promise<Discussion> => {
    return api.patch(`${BASE_URL}/discussions/${id}/`, payload);
  },

  /**
   * Delete a discussion (author only)
   */
  delete: async (id: string): Promise<void> => {
    return api.delete(`${BASE_URL}/discussions/${id}/`);
  },

  /**
   * Pin a discussion (leaders only)
   */
  pin: async (id: string): Promise<PinDiscussionResponse> => {
    return api.post(`${BASE_URL}/discussions/${id}/pin/`, {});
  },

  /**
   * Unpin a discussion (leaders only)
   */
  unpin: async (id: string): Promise<PinDiscussionResponse> => {
    return api.post(`${BASE_URL}/discussions/${id}/unpin/`, {});
  },
};

// ============================================================
// COMMENTS API
// ============================================================

export const commentsApi = {
  /**
   * List comments for content (discussion, prayer, testimony, or scripture)
   */
  list: async (params: {
    discussion?: string;
    prayer?: string;
    testimony?: string;
    scripture?: string;
    parent?: string;
    ordering?: string;
    page?: number;
    page_size?: number;
    signal?: AbortSignal;
  }): Promise<PaginatedResponse<Comment>> => {
    const queryParams = new URLSearchParams();

    // Add content type parameter - only one should be present
    if (params.discussion) queryParams.append('discussion', params.discussion);
    if (params.prayer) queryParams.append('prayer', params.prayer);
    if (params.testimony) queryParams.append('testimony', params.testimony);
    if (params.scripture) queryParams.append('scripture', params.scripture);

    if (params.parent) queryParams.append('parent', params.parent);
    if (params.ordering) queryParams.append('ordering', params.ordering);
    if (params.page) queryParams.append('page', String(params.page));
    if (params.page_size) queryParams.append('page_size', String(params.page_size));

    return api.get(`${BASE_URL}/comments/?${queryParams.toString()}`, { signal: params.signal });
  },

  /**
   * Create a new comment
   */
  create: async (payload: CreateCommentPayload): Promise<Comment> => {
    return api.post(`${BASE_URL}/comments/`, payload);
  },

  /**
   * Update a comment (author only, within 15 minutes)
   */
  update: async (id: string, payload: UpdateCommentPayload): Promise<Comment> => {
    return api.patch(`${BASE_URL}/comments/${id}/`, payload);
  },

  /**
   * Delete a comment (author only)
   */
  delete: async (id: string): Promise<void> => {
    return api.delete(`${BASE_URL}/comments/${id}/`);
  },
};

// ============================================================
// REACTIONS API
// ============================================================

export const reactionsApi = {
  /**
   * List reactions for a discussion
   */
  list: async (params: {
    discussion: string;
    reaction_type?: ReactionType;
    signal?: AbortSignal;
  }): Promise<PaginatedResponse<Reaction>> => {
    const queryParams = new URLSearchParams();
    queryParams.append('discussion', params.discussion);
    if (params.reaction_type) queryParams.append('reaction_type', params.reaction_type);

    return api.get(`${BASE_URL}/reactions/?${queryParams.toString()}`, { signal: params.signal });
  },

  /**
   * Add a reaction (replaces existing reaction if any)
   */
  create: async (payload: CreateReactionPayload): Promise<Reaction> => {
    return api.post(`${BASE_URL}/reactions/`, payload);
  },

  /**
   * Remove a reaction
   */
  delete: async (id: string): Promise<void> => {
    return api.delete(`${BASE_URL}/reactions/${id}/`);
  },
};

// ============================================================
// FEED API
// ============================================================

export const feedApi = {
  /**
   * Get activity feed for a group
   */
  list: async (params: {
    group: string;
    content_type?: FeedContentType;
    has_viewed?: boolean;
    page?: number;
    page_size?: number;
    signal?: AbortSignal;
  }): Promise<PaginatedResponse<FeedItem>> => {
    const queryParams = new URLSearchParams();
    queryParams.append('group', params.group);
    if (params.content_type) queryParams.append('content_type', params.content_type);
    if (params.has_viewed !== undefined) queryParams.append('has_viewed', String(params.has_viewed));
    if (params.page) queryParams.append('page', String(params.page));
    if (params.page_size) queryParams.append('page_size', String(params.page_size));

    return api.get(`${BASE_URL}/feed/?${queryParams.toString()}`, { signal: params.signal });
  },

  /**
   * Mark a feed item as viewed
   */
  markViewed: async (feedItemId: string): Promise<void> => {
    return api.post(`${BASE_URL}/feed/${feedItemId}/mark-viewed/`, {});
  },
};

// ============================================================
// PRAYER REQUESTS API
// ============================================================

export const prayerRequestsApi = {
  /**
   * List prayer requests with optional filters
   */
  list: async (params: {
    group: string;
    urgency?: PrayerUrgency;
    category?: PrayerCategory;
    is_answered?: boolean;
    search?: string;
    ordering?: string;
    page?: number;
    page_size?: number;
    signal?: AbortSignal;
  }): Promise<PaginatedResponse<PrayerRequest>> => {
    const queryParams = new URLSearchParams();
    queryParams.append('group', params.group);
    if (params.urgency) queryParams.append('urgency', params.urgency);
    if (params.category) queryParams.append('category', params.category);
    if (params.is_answered !== undefined) queryParams.append('is_answered', String(params.is_answered));
    if (params.search) queryParams.append('search', params.search);
    if (params.ordering) queryParams.append('ordering', params.ordering);
    if (params.page) queryParams.append('page', String(params.page));
    if (params.page_size) queryParams.append('page_size', String(params.page_size));

    return api.get(`${BASE_URL}/prayer-requests/?${queryParams.toString()}`, { signal: params.signal });
  },

  /**
   * Create a new prayer request
   */
  create: async (payload: CreatePrayerRequestPayload): Promise<PrayerRequest> => {
    return api.post(`${BASE_URL}/prayer-requests/`, payload);
  },

  /**
   * Get a single prayer request by ID
   */
  get: async (id: string, signal?: AbortSignal): Promise<PrayerRequest> => {
    return api.get(`${BASE_URL}/prayer-requests/${id}/`, { signal });
  },

  /**
   * Mark a prayer request as answered (author only)
   */
  markAnswered: async (id: string, payload: MarkPrayerAnsweredPayload): Promise<PrayerRequest> => {
    return api.patch(`${BASE_URL}/prayer-requests/${id}/mark_answered/`, payload);
  },

  /**
   * Increment prayer count
   */
  pray: async (id: string): Promise<PrayCountResponse> => {
    return api.post(`${BASE_URL}/prayer-requests/${id}/pray/`, {});
  },
};

// ============================================================
// TESTIMONIES API
// ============================================================

export const testimoniesApi = {
  /**
   * List testimonies with optional filters
   */
  list: async (params: {
    group: string;
    is_public?: boolean;
    is_public_approved?: boolean;
    answered_prayer?: string;
    search?: string;
    page?: number;
    page_size?: number;
    signal?: AbortSignal;
  }): Promise<PaginatedResponse<Testimony>> => {
    const queryParams = new URLSearchParams();
    queryParams.append('group', params.group);
    if (params.is_public !== undefined) queryParams.append('is_public', String(params.is_public));
    if (params.is_public_approved !== undefined) queryParams.append('is_public_approved', String(params.is_public_approved));
    if (params.answered_prayer) queryParams.append('answered_prayer', params.answered_prayer);
    if (params.search) queryParams.append('search', params.search);
    if (params.page) queryParams.append('page', String(params.page));
    if (params.page_size) queryParams.append('page_size', String(params.page_size));

    return api.get(`${BASE_URL}/testimonies/?${queryParams.toString()}`, { signal: params.signal });
  },

  /**
   * Create a new testimony
   */
  create: async (payload: CreateTestimonyPayload): Promise<Testimony> => {
    return api.post(`${BASE_URL}/testimonies/`, payload);
  },

  /**
   * Get a single testimony by ID
   */
  get: async (id: string, signal?: AbortSignal): Promise<Testimony> => {
    return api.get(`${BASE_URL}/testimonies/${id}/`, { signal });
  },

  /**
   * Request public sharing (author only)
   */
  sharePublic: async (id: string): Promise<Testimony> => {
    return api.patch(`${BASE_URL}/testimonies/${id}/share_public/`, {});
  },

  /**
   * Approve for public sharing (leaders only)
   */
  approvePublic: async (id: string): Promise<Testimony> => {
    return api.patch(`${BASE_URL}/testimonies/${id}/approve_public/`, {});
  },
};

// ============================================================
// SCRIPTURES API
// ============================================================

export const scripturesApi = {
  /**
   * List scripture shares with optional filters
   */
  list: async (params: {
    group: string;
    translation?: BibleTranslation;
    search?: string;
    page?: number;
    page_size?: number;
    signal?: AbortSignal;
  }): Promise<PaginatedResponse<Scripture>> => {
    const queryParams = new URLSearchParams();
    queryParams.append('group', params.group);
    if (params.translation) queryParams.append('translation', params.translation);
    if (params.search) queryParams.append('search', params.search);
    if (params.page) queryParams.append('page', String(params.page));
    if (params.page_size) queryParams.append('page_size', String(params.page_size));

    return api.get(`${BASE_URL}/scriptures/?${queryParams.toString()}`, { signal: params.signal });
  },

  /**
   * Create a new scripture share
   */
  create: async (payload: CreateScripturePayload): Promise<Scripture> => {
    return api.post(`${BASE_URL}/scriptures/`, payload);
  },

  /**
   * Get a single scripture share by ID
   */
  get: async (id: string, signal?: AbortSignal): Promise<Scripture> => {
    return api.get(`${BASE_URL}/scriptures/${id}/`, { signal });
  },

  /**
   * Lookup a Bible verse
   */
  verseLookup: async (reference: string, translation: BibleTranslation = 'KJV'): Promise<VerseLookupResponse> => {
    const queryParams = new URLSearchParams();
    queryParams.append('reference', reference);
    queryParams.append('translation', translation);

    const response = await api.get<{ detail: string; verse: VerseLookupResponse }>(
      `${BASE_URL}/scriptures/verse-lookup/?${queryParams.toString()}`
    );

    // Extract and return the verse object from the nested response
    return response.verse;
  },
};

// ============================================================
// CONTENT REPORTS API
// ============================================================

export const reportsApi = {
  /**
   * Create a content report
   */
  create: async (payload: CreateReportPayload): Promise<ContentReport> => {
    return api.post(`${BASE_URL}/reports/`, payload);
  },

  /**
   * List reports (leaders only)
   */
  list: async (params: {
    status?: ReportStatus;
    reason?: ReportReason;
    page?: number;
    page_size?: number;
    signal?: AbortSignal;
  }): Promise<PaginatedResponse<ContentReport>> => {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    if (params.reason) queryParams.append('reason', params.reason);
    if (params.page) queryParams.append('page', String(params.page));
    if (params.page_size) queryParams.append('page_size', String(params.page_size));

    return api.get(`${BASE_URL}/reports/?${queryParams.toString()}`, { signal: params.signal });
  },
};

// ============================================================
// NOTIFICATION PREFERENCES API
// ============================================================

export const notificationPreferencesApi = {
  /**
   * Get user's notification preferences
   */
  get: async (signal?: AbortSignal): Promise<NotificationPreferences> => {
    return api.get(`${BASE_URL}/preferences/`, { signal });
  },

  /**
   * Update notification preferences
   */
  update: async (payload: UpdateNotificationPreferencesPayload): Promise<NotificationPreferences> => {
    return api.patch(`${BASE_URL}/preferences/`, payload);
  },
};

// ============================================================
// EXPORT ALL
// ============================================================

export const messagingApi = {
  discussions: discussionsApi,
  comments: commentsApi,
  reactions: reactionsApi,
  feed: feedApi,
  prayerRequests: prayerRequestsApi,
  testimonies: testimoniesApi,
  scriptures: scripturesApi,
  reports: reportsApi,
  notificationPreferences: notificationPreferencesApi,
};
