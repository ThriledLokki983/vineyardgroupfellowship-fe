/**
 * Group Details Page Component Type Definitions
 */

import type { Group } from '../group';

export interface GroupDetailsContentProps {
  group: Group;
  isGroupLeader: boolean;
  isActiveMember: boolean;
  hasPendingRequest: boolean;
}
