/**
 * Conversations List Page
 * Displays inbox of all private conversations
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, LoadingState, Icon } from 'components';
import { useConversations } from 'hooks/messaging/useConversations';
import type { ConversationStatus } from 'types/private-messaging';
import styles from './ConversationsListPage.module.scss';

export const ConversationsListPage = () => {
	const navigate = useNavigate();
	const [statusFilter, setStatusFilter] = useState<ConversationStatus | undefined>('active');

	const { data, isLoading, error } = useConversations(statusFilter);

	if (isLoading) {
		return (
			<Layout variant="default">
				<LoadingState message="Loading conversations..." />
			</Layout>
		);
	}

	if (error) {
		return (
			<Layout variant="default">
				<div className={styles.error}>
					<Icon name="ExclamationCircleIcon" width={24} height={24} />
					<p>Failed to load conversations. Please try again.</p>
				</div>
			</Layout>
		);
	}

	const conversations = data?.results || [];

	return (
		<Layout variant="default">
			<div className={styles.container}>
				<div className={styles.header}>
					<h1 className={styles.title}>Messages</h1>
					<p className={styles.subtitle}>
						{data?.count || 0} {data?.count === 1 ? 'conversation' : 'conversations'}
					</p>
				</div>

				{/* Status Filter Tabs */}
				<div className={styles.filterTabs}>
					<button
						className={`${styles.tab} ${!statusFilter ? styles.active : ''}`}
						onClick={() => setStatusFilter(undefined)}
					>
						All
						{!statusFilter && data?.count !== undefined && (
							<span className={styles.count}>{data.count}</span>
						)}
					</button>
					<button
						className={`${styles.tab} ${statusFilter === 'active' ? styles.active : ''}`}
						onClick={() => setStatusFilter('active')}
					>
						Active
						{statusFilter === 'active' && data?.count !== undefined && (
							<span className={styles.count}>{data.count}</span>
						)}
					</button>
					<button
						className={`${styles.tab} ${statusFilter === 'closed' ? styles.active : ''}`}
						onClick={() => setStatusFilter('closed')}
					>
						Closed
						{statusFilter === 'closed' && data?.count !== undefined && (
							<span className={styles.count}>{data.count}</span>
						)}
					</button>
				</div>

				{/* Conversations List */}
				{conversations.length === 0 ? (
					<div className={styles.emptyState}>
						<Icon name="EmailIcon" width={48} height={48} />
						<h2>No conversations yet</h2>
						<p>
							{statusFilter === 'active'
								? 'Start a conversation by messaging a group leader.'
								: statusFilter === 'closed'
									? 'No closed conversations.'
									: 'You have no messages.'}
						</p>
					</div>
				) : (
					<div className={styles.conversationsList}>
						{conversations.map((conversation) => {
							const otherPerson = conversation.other_participant;
							const lastMessage = conversation.last_message;
							const hasUnread = conversation.unread_count > 0;

							return (
								<button
									key={conversation.id}
									className={`${styles.conversationCard} ${hasUnread ? styles.unread : ''}`}
									onClick={() => navigate(`/messages/${conversation.id}`)}
								>
									{/* Avatar placeholder */}
									<div className={styles.avatar}>
										{otherPerson?.display_name?.[0]?.toUpperCase() ||
										 otherPerson?.first_name?.[0]?.toUpperCase() ||
										 otherPerson?.username?.[0]?.toUpperCase() ||
										 '?'}
									</div>

									<div className={styles.conversationContent}>
										{/* Header: Name and timestamp */}
										<div className={styles.conversationHeader}>
											<span className={styles.participantName}>
												{otherPerson?.display_name ||
												 `${otherPerson?.first_name} ${otherPerson?.last_name}`.trim() ||
												 otherPerson?.username}
											</span>
											{lastMessage && (
												<span className={styles.timestamp}>
													{formatTimestamp(lastMessage.created_at)}
												</span>
											)}
										</div>

					{/* Group context */}
					{conversation.context.type === 'group_inquiry' && conversation.context.group && (
						<div className={styles.contextChip}>
							<Icon name="PeopleIcon" width={12} height={12} />
							<span>Re: {conversation.context.group.name}</span>
						</div>
					)}										{/* Last message preview */}
										{lastMessage && (
											<div className={styles.lastMessage}>
												{lastMessage.is_mine && <span className={styles.youPrefix}>You: </span>}
												{lastMessage.content}
											</div>
										)}

										{/* Status and unread indicator */}
										<div className={styles.conversationFooter}>
											{conversation.status === 'closed' && (
												<span className={styles.statusBadge}>Closed</span>
											)}
											{hasUnread && (
												<span className={styles.unreadBadge}>
													{conversation.unread_count}
												</span>
											)}
										</div>
									</div>
								</button>
							);
						})}
					</div>
				)}
			</div>
		</Layout>
	);
};

/**
 * Format timestamp to relative time or date
 */
function formatTimestamp(timestamp: string): string {
	const date = new Date(timestamp);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffMins = Math.floor(diffMs / 60000);
	const diffHours = Math.floor(diffMs / 3600000);
	const diffDays = Math.floor(diffMs / 86400000);

	if (diffMins < 1) return 'Just now';
	if (diffMins < 60) return `${diffMins}m ago`;
	if (diffHours < 24) return `${diffHours}h ago`;
	if (diffDays === 1) return 'Yesterday';
	if (diffDays < 7) return `${diffDays}d ago`;

	// Format as date
	return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
