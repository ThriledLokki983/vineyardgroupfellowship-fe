/**
 * Messaging Permissions Utility
 * Privacy and permission checks for peer-to-peer messaging
 */

import type { GroupMember } from '../types/group';

export interface MessagePermissionResult {
	canMessage: boolean;
	reason?: string;
}

/**
 * Check if the current user can message a target member
 * @param currentUserId - The current user's ID
 * @param targetMember - The member to potentially message
 * @param sharedGroupIds - Array of group IDs both users are in (optional validation)
 * @returns Object with canMessage boolean and optional reason string
 */
export function canMessageMember(
	currentUserId: string,
	targetMember: GroupMember,
	sharedGroupIds?: string[]
): MessagePermissionResult {
	// Cannot message yourself
	if (targetMember.user_id === currentUserId) {
		return { canMessage: false, reason: 'Cannot message yourself' };
	}

	// Must be active member
	if (targetMember.status !== 'active') {
		return { canMessage: false, reason: 'Member is not active' };
	}

	// Check profile visibility (private profiles opt out of messaging)
	if (targetMember.profile_visibility === 'private') {
		return { canMessage: false, reason: 'Profile is private' };
	}

	// Optional: Validate shared groups if provided
	if (sharedGroupIds && sharedGroupIds.length === 0) {
		return { canMessage: false, reason: 'No shared groups' };
	}

	return { canMessage: true };
}

/**
 * Get user-friendly error message for messaging restrictions
 * @param reason - The reason code from canMessageMember
 * @returns User-friendly error message
 */
export function getMessageErrorMessage(reason?: string): string {
	switch (reason) {
		case 'Cannot message yourself':
			return 'You cannot send messages to yourself';
		case 'Member is not active':
			return 'This member is not currently active in the group';
		case 'Profile is private':
			return 'This user has set their profile to private';
		case 'No shared groups':
			return 'You must be in the same group to message this person';
		default:
			return 'Unable to send message at this time';
	}
}
