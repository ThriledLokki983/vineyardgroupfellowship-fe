/**
 * Group API Service
 * Handles all group-related API calls
 */

import apiClient from '../lib/apiClient';
import type { Group, GroupListItem, CreateGroupData, JoinGroupData, JoinGroupResponse, GroupMember } from '../types/group';
import {
  GROUPS_URL,
  GROUP_DETAIL_URL,
  GROUP_MEMBERS_URL,
  GROUP_JOIN_URL,
  GROUP_LEAVE_URL,
  GROUP_UPLOAD_PHOTO_URL
} from '../configs/api-endpoints';

/**
 * List all groups
 * @param params Optional query parameters for filtering
 */
export const listGroups = async (params?: {
  location?: string;
  is_open?: boolean;
  has_space?: boolean;
}): Promise<GroupListItem[]> => {
  const response = await apiClient.get<GroupListItem[]>(GROUPS_URL, { params });
  return response.data;
};

/**
 * Create a new group
 * Requires leadership permission (leadership_info.can_lead_group: true)
 */
export const createGroup = async (data: CreateGroupData): Promise<Group> => {
  const response = await apiClient.post<Group>(GROUPS_URL, data);
  return response.data;
};

/**
 * Get group details
 */
export const getGroup = async (id: string): Promise<Group> => {
  const response = await apiClient.get<Group>(GROUP_DETAIL_URL(id));
  return response.data;
};

/**
 * Update group (partial update)
 */
export const updateGroup = async (id: string, data: Partial<CreateGroupData>): Promise<Group> => {
  const response = await apiClient.patch<Group>(GROUP_DETAIL_URL(id), data);
  return response.data;
};

/**
 * Delete group (soft delete - sets is_active to false)
 */
export const deleteGroup = async (id: string): Promise<void> => {
  await apiClient.delete(GROUP_DETAIL_URL(id));
};

/**
 * Get group members
 */
export const getGroupMembers = async (id: string): Promise<GroupMember[]> => {
  const response = await apiClient.get<GroupMember[]>(GROUP_MEMBERS_URL(id));
  return response.data;
};

/**
 * Join a group
 */
export const joinGroup = async (id: string, data?: JoinGroupData): Promise<JoinGroupResponse> => {
  const response = await apiClient.post<JoinGroupResponse>(GROUP_JOIN_URL(id), data || {});
  return response.data;
};

/**
 * Leave a group
 */
export const leaveGroup = async (id: string): Promise<{ message: string }> => {
  const response = await apiClient.post<{ message: string }>(GROUP_LEAVE_URL(id));
  return response.data;
};

/**
 * Upload group photo
 */
export const uploadGroupPhoto = async (id: string, photo: File): Promise<Group> => {
  const formData = new FormData();
  formData.append('photo', photo);

  const response = await apiClient.post<Group>(GROUP_UPLOAD_PHOTO_URL(id), formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
