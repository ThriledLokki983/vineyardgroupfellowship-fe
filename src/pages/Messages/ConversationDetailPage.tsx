/**
 * Conversation Detail Page
 * Chat interface for a single conversation
 */

import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout, LoadingState, Icon, Button, BackLink } from 'components';
import { useConversation, useSendMessage, useCloseConversation, useReopenConversation } from 'hooks/messaging/useConversations';
import { useCurrentUser } from 'hooks/useAuth';
import type { CloseReason } from 'types/private-messaging';
import styles from './ConversationDetailPage.module.scss';

export const ConversationDetailPage = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { data: user } = useCurrentUser();
	const [messageText, setMessageText] = useState('');
	const [showCloseModal, setShowCloseModal] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const { data: conversation, isLoading, error } = useConversation(id!);
	const sendMessage = useSendMessage(id!);
	const closeConversation = useCloseConversation(() => setShowCloseModal(false));
	const reopenConversation = useReopenConversation();

	// Auto-scroll to bottom when messages change
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [conversation?.messages]);

	const handleSendMessage = (e: React.FormEvent) => {
		e.preventDefault();
		if (!messageText.trim() || sendMessage.isPending) return;

		sendMessage.mutate(messageText.trim(), {
			onSuccess: () => {
				setMessageText('');
			},
		});
	};

	const handleCloseConversation = (reason?: CloseReason) => {
		if (!id) return;
		closeConversation.mutate({ id, reason });
	};

	const handleReopenConversation = () => {
		if (!id) return;
		reopenConversation.mutate(id);
	};

	if (isLoading) {
		return (
			<Layout variant="default">
				<LoadingState message="Loading conversation..." />
			</Layout>
		);
	}

	if (error || !conversation) {
		return (
			<Layout variant="default">
				<div className={styles.error}>
					<Icon name="ExclamationCircleIcon" width={24} height={24} />
					<p>Failed to load conversation. Please try again.</p>
					<Button variant="secondary" onPress={() => navigate('/messages')} className={styles.backButton}>
						Back to Messages
					</Button>
				</div>
			</Layout>
		);
	}

	const otherParticipant = conversation.participants.find((p) => p.email !== user?.email) || conversation.participants[0];
	const isClosed = conversation.status === 'closed';
	console.log('CurrentUser:', user?.email);
	console.log('OtherUser', conversation.participants[0].email);



	return (
		<Layout variant="default">
			<div className={styles.container}>
				{/* Header */}
				<div className={styles.header}>
					<div className={styles.headerLeft}>
						<BackLink to="/messages">Back to messages</BackLink>
						<div className={styles.participantInfo}>
							<div className={styles.avatar}>
								{otherParticipant.photo_thumbnail_url || otherParticipant.photo_url ? (
									<img
										src={(otherParticipant.photo_thumbnail_url || otherParticipant.photo_url) as string}
										alt={otherParticipant.display_name || otherParticipant.username}
										className={styles.avatarImage}
									/>
								) : (
									<span>
										{otherParticipant.display_name?.[0]?.toUpperCase() ||
										 otherParticipant.first_name?.[0]?.toUpperCase() ||
										 otherParticipant.username?.[0]?.toUpperCase() ||
										 '?'}
									</span>
								)}
							</div>
							<div>
								<h1 className={styles.participantName}>
									{otherParticipant.display_name ||
									 `${otherParticipant.first_name} ${otherParticipant.last_name}`.trim() ||
									 otherParticipant.username}
								</h1>
								{conversation.context.type === 'group_inquiry' && conversation.context.group && (
									<p className={styles.contextLabel}>
										<Icon name="PeopleIcon" width={14} height={14} />
										Re: {conversation.context.group.name}
									</p>
								)}
							</div>
						</div>
					</div>

					{/* Conversation Actions */}
					<div className={styles.headerActions}>
						{isClosed ? (
							<Button
								variant="secondary"
								onPress={handleReopenConversation}
								isDisabled={reopenConversation.isPending}
							>
								Reopen Conversation
							</Button>
						) : (
							<Button
								variant="secondary"
								onPress={() => setShowCloseModal(true)}
							>
								Close Conversation
							</Button>
						)}
					</div>
				</div>

				{/* Closed Banner */}
				{isClosed && (
					<div className={styles.closedBanner}>
						<Icon name="CheckMarkIcon" width={16} height={16} />
						<span>
							This conversation was closed
							{conversation.close_reason && ` (${formatCloseReason(conversation.close_reason)})`}
						</span>
					</div>
				)}

				{/* Messages List */}
				<div className={styles.messagesContainer}>
					{conversation.messages && conversation.messages.length > 0 ? (
						<div className={styles.messagesList}>
							{conversation.messages.map((message) => {
								const isOwn = message.sender.email === user?.email;

								return (
									<div
										key={message.id}
										className={`${styles.messageWrapper} ${isOwn ? styles.own : styles.other}`}
									>
										{!isOwn && (
											<div className={styles.messageAvatar}>
												{message.sender.photo_thumbnail_url || message.sender.photo_url ? (
													<img
														src={(message.sender.photo_thumbnail_url || message.sender.photo_url) as string}
														alt={message.sender.display_name || message.sender.username}
														className={styles.messageAvatarImage}
													/>
												) : (
													<span>
														{message.sender.display_name?.[0]?.toUpperCase() ||
														 message.sender.first_name?.[0]?.toUpperCase() ||
														 message.sender.username?.[0]?.toUpperCase() ||
														 '?'}
													</span>
												)}
											</div>
										)}

										<div className={styles.messageBubble}>
											<div className={styles.messageContent}>
												{message.content}
											</div>
											<div className={styles.messageTimestamp}>
												{formatMessageTime(message.created_at)}
											</div>
										</div>
									</div>
								);
							})}
							<div ref={messagesEndRef} />
						</div>
					) : (
						<div className={styles.emptyMessages}>
							<Icon name="EmailIcon" width={32} height={32} />
							<p>No messages yet. Start the conversation!</p>
						</div>
					)}
				</div>

				{/* Message Input */}
				{!isClosed && (
					<form onSubmit={handleSendMessage} className={styles.messageForm}>
						<textarea
							value={messageText}
							onChange={(e) => setMessageText(e.target.value)}
							placeholder="Type your message..."
							className={styles.messageInput}
							rows={3}
							disabled={sendMessage.isPending}
							onKeyDown={(e) => {
								// Submit on Enter (but allow Shift+Enter for new line)
								if (e.key === 'Enter' && !e.shiftKey) {
									e.preventDefault();
									handleSendMessage(e);
								}
							}}
						/>
						<Button
							type="submit"
							variant="primary"
							isDisabled={!messageText.trim() || sendMessage.isPending}
							className={styles.sendButton}
						>
							{sendMessage.isPending ? 'Sending...' : 'Send'}
						</Button>
					</form>
				)}

				{/* Close Conversation Modal */}
				{showCloseModal && (
					<div className={styles.modal}>
						<div className={styles.modalContent}>
							<h2>Close Conversation</h2>
							<p>Why are you closing this conversation?</p>

							<div className={styles.reasonButtons}>
								<Button
									variant="secondary"
									onPress={() => handleCloseConversation('joined_group')}
									isDisabled={closeConversation.isPending}
								>
									I joined the group
								</Button>
								<Button
									variant="secondary"
									onPress={() => handleCloseConversation('not_interested')}
									isDisabled={closeConversation.isPending}
								>
									Not interested
								</Button>
								<Button
									variant="secondary"
									onPress={() => handleCloseConversation('resolved')}
									isDisabled={closeConversation.isPending}
								>
									Question answered
								</Button>
								<Button
									variant="secondary"
									onPress={() => handleCloseConversation('other')}
									isDisabled={closeConversation.isPending}
								>
									Other reason
								</Button>
							</div>

							<Button
								variant="tertiary"
								onPress={() => setShowCloseModal(false)}
								isDisabled={closeConversation.isPending}
							>
								Cancel
							</Button>
						</div>
					</div>
				)}
			</div>
		</Layout>
	);
};

/**
 * Format message timestamp
 */
function formatMessageTime(timestamp: string): string {
	const date = new Date(timestamp);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffMins = Math.floor(diffMs / 60000);

	if (diffMins < 1) return 'Just now';
	if (diffMins < 60) return `${diffMins}m ago`;

	const isToday = date.toDateString() === now.toDateString();
	if (isToday) {
		return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
	}

	return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

/**
 * Format close reason for display
 */
function formatCloseReason(reason: CloseReason): string {
	const reasons: Record<CloseReason, string> = {
		joined_group: 'Joined group',
		not_interested: 'Not interested',
		resolved: 'Resolved',
		other: 'Other',
	};
	return reasons[reason] || reason;
}
