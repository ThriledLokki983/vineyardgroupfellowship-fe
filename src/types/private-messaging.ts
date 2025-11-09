/**
 * Type definitions for private messaging feature
 * Matches backend models from PRIVATE_MESSAGING_FEATURE.md
 */

export interface ConversationParticipant {
	id: string;
	email: string;
	username: string;
	first_name: string;
	last_name: string;
	display_name?: string;
	photo_url?: string;
	photo_thumbnail_url?: string;
}

export type ConversationContextType = 'group_inquiry' | 'direct_message';

export interface ConversationContext {
	type: ConversationContextType;
	group?: {
		id: string;
		name: string;
	};
}

export type ConversationStatus = 'active' | 'closed' | 'archived';

export type CloseReason = 'joined_group' | 'not_interested' | 'resolved' | 'other';

export interface PrivateMessage {
	id: string;
	conversation: string;
	sender: ConversationParticipant;
	content: string;
	is_read: boolean;
	created_at: string;
}

export interface LastMessage {
	content: string;
	sender_id: string;
	is_mine: boolean;
	created_at: string;
}

export interface Conversation {
	id: string;
	participants: ConversationParticipant[];
	other_participant?: ConversationParticipant; // Present in list view
	context: ConversationContext;
	status: ConversationStatus;
	last_message?: LastMessage;
	unread_count: number;
	message_count: number;
	messages?: PrivateMessage[]; // Only present in detail view
	created_at: string;
	updated_at: string;
	last_message_at: string;
	closed_at?: string | null;
	closed_by_user?: ConversationParticipant | null;
	close_reason?: CloseReason | null;
}

export interface ConversationListResponse {
	count: number;
	results: Conversation[];
}

export interface CreateGroupInquiryRequest {
	group_id: string;
	message: string;
}

export interface CreateGroupInquiryResponse {
	conversation: Conversation;
	message: PrivateMessage;
	redirect_url: string;
	is_existing_conversation: boolean;
}

export interface SendMessageRequest {
	content: string;
}

export interface SendMessageResponse {
	message: PrivateMessage;
}

export interface CloseConversationRequest {
	reason?: CloseReason;
}

export interface CloseConversationResponse {
	conversation: Conversation;
	message: string;
}

export interface ReopenConversationResponse {
	conversation: Conversation;
	message: string;
}

export interface StartDirectMessageRequest {
	recipient_id: string;
	message: string;
	group_id?: string; // Optional group context
}

export interface StartDirectMessageResponse {
	conversation: Conversation;
	message: PrivateMessage;
	is_existing_conversation: boolean;
}

// Safety & Moderation Types

export type ReportReason = 
	| 'spam'
	| 'harassment'
	| 'inappropriate_content'
	| 'safety_concern'
	| 'other';

export interface BlockUserRequest {
	user_id: string;
	reason?: string;
}

export interface BlockUserResponse {
	blocked_user_id: string;
	blocked_at: string;
	message: string;
}

export interface UnblockUserRequest {
	user_id: string;
}

export interface UnblockUserResponse {
	unblocked_user_id: string;
	message: string;
}

export interface BlockedUser {
	id: string;
	blocked_user: ConversationParticipant;
	blocked_at: string;
	reason?: string;
}

export interface BlockedUsersListResponse {
	count: number;
	results: BlockedUser[];
}

export interface ReportConversationRequest {
	conversation_id: string;
	reason: ReportReason;
	details?: string;
}

export interface ReportMessageRequest {
	message_id: string;
	reason: ReportReason;
	details?: string;
}

export interface ReportResponse {
	report_id: string;
	status: 'submitted' | 'under_review';
	message: string;
}
