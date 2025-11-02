/**
 * Modal Component Types
 * Types for all modal components
 */

import type { GroupData } from './dashboard';

// Group Creation Modal
export interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupData?: GroupData | null;
  mode?: 'create' | 'update';
}

export interface GroupCreationStep {
  id: string;
  title: string;
  description?: string;
  isOptional?: boolean;
}

// Browse Groups Modal
export interface BrowseGroupsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface GroupCardProps {
  group: {
    id: string;
    name: string;
    description: string;
    location: string;
    location_type: string;
    member_count: number;
    max_members: number;
    is_open: boolean;
    meeting_time?: string;
    meeting_frequency?: string;
  };
  onSelect?: (groupId: string) => void;
}
