/**
 * Modal Component Types
 * Types for all modal components
 */

import type { GroupData } from './dashboard';
import type { GroupListItem } from '../group';

// Group Creation Modal
export interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupData?: GroupData | null;
  mode?: 'create' | 'update';
}

export interface GroupCreationStep {
  id: number;
  title: string;
  description: string;
}

// Browse Groups Modal
export interface BrowseGroupsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface GroupCardProps {
  group: GroupListItem;
  onClick: () => void;
}
