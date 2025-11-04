/**
 * Group API Service
 * Handles all group-related API calls
 */

import { api } from './api';
import type { Group, GroupListItem, CreateGroupData, JoinGroupData, JoinGroupResponse, GroupMember, PendingRequest, ApproveRequestResponse, RejectRequestResponse } from '../types/group';
import {
  GROUPS_URL,
  GROUP_DETAIL_URL,
  GROUP_MEMBERS_URL,
  GROUP_JOIN_URL,
  GROUP_LEAVE_URL,
  GROUP_UPLOAD_PHOTO_URL,
  GROUP_PENDING_REQUESTS_URL,
  GROUP_APPROVE_REQUEST_URL,
  GROUP_REJECT_REQUEST_URL
} from '../configs/api-endpoints';

/**
 * List all groups
 * @param params Optional query parameters for filtering
 */
export const listGroups = async (params?: {
  location?: string;
  is_open?: boolean;
  has_space?: boolean;
  my_groups?: boolean;
}): Promise<GroupListItem[]> => {
  // Build query string from params
  const queryParams = params
    ? '?' + new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
          if (value !== undefined) {
            acc[key] = String(value);
          }
          return acc;
        }, {} as Record<string, string>)
      ).toString()
    : '';

  const response = await api.get<{
    count: number;
    next: string | null;
    previous: string | null;
    results: GroupListItem[];
  }>(GROUPS_URL + queryParams);

  // Return the results array from the paginated response
  return response.results || [];
};

/**
 * Create a new group
 * Requires leadership permission (leadership_info.can_lead_group: true)
 */
export const createGroup = async (data: CreateGroupData): Promise<Group> => {
  return api.post<Group>(GROUPS_URL, data);
};

/**
 * Get group details
 */
export const getGroup = async (id: string): Promise<Group> => {
  return api.get<Group>(GROUP_DETAIL_URL(id));
};

/**
 * Update group (partial update)
 */
export const updateGroup = async (id: string, data: Partial<CreateGroupData>): Promise<Group> => {
  return api.patch<Group>(GROUP_DETAIL_URL(id), data);
};

/**
 * Delete group (soft delete - sets is_active to false)
 */
export const deleteGroup = async (id: string): Promise<void> => {
  await api.delete(GROUP_DETAIL_URL(id));
};

/**
 * Get group members
 */
export const getGroupMembers = async (id: string): Promise<GroupMember[]> => {
  return api.get<GroupMember[]>(GROUP_MEMBERS_URL(id));
};

/**
 * Join a group
 */
export const joinGroup = async (id: string, data?: JoinGroupData): Promise<JoinGroupResponse> => {
  return api.post<JoinGroupResponse>(GROUP_JOIN_URL(id), data || {});
};

/**
 * Leave a group
 */
export const leaveGroup = async (id: string): Promise<{ message: string }> => {
  return api.post<{ message: string }>(GROUP_LEAVE_URL(id));
};

/**
 * Upload group photo
 * Note: Uses custom fetch for multipart/form-data (api.ts post() JSON.stringifies body)
 */
export const uploadGroupPhoto = async (id: string, photo: File): Promise<Group> => {
  // Import directly from api.ts since we need base functionality
  const { API_BASE_URL } = await import('../configs/api-configs');

  const formData = new FormData();
  formData.append('photo', photo);

  // Get CSRF token and access token for authentication
  const csrfToken = await api.getCsrfToken();
  const accessToken = api.getAccessToken();

  const headers: Record<string, string> = {
    'X-CSRFToken': csrfToken,
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${GROUP_UPLOAD_PHOTO_URL(id)}`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
    headers,
    // Don't set Content-Type - browser will set multipart/form-data with boundary
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `Failed to upload photo: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Get pending join requests for a group
 * Only accessible by group leaders and co-leaders
 */
export const getPendingRequests = async (id: string): Promise<PendingRequest[]> => {
  return api.get<PendingRequest[]>(GROUP_PENDING_REQUESTS_URL(id));
};

/**
 * Approve a pending join request
 * Only accessible by group leaders and co-leaders
 */
export const approveJoinRequest = async (
  groupId: string,
  membershipId: string
): Promise<ApproveRequestResponse> => {
  return api.post<ApproveRequestResponse>(
    GROUP_APPROVE_REQUEST_URL(groupId, membershipId)
  );
};

/**
 * Reject a pending join request
 * Only accessible by group leaders and co-leaders
 */
export const rejectJoinRequest = async (
  groupId: string,
  membershipId: string
): Promise<RejectRequestResponse> => {
  return api.post<RejectRequestResponse>(
    GROUP_REJECT_REQUEST_URL(groupId, membershipId)
  );
};
