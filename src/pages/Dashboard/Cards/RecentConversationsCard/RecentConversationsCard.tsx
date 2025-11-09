/**
 * RecentConversationsCard Component
 *
 * Dashboard card displaying recent message conversations
 * Shows latest 5 conversations with unread indicators
 * Provides quick access to messages without leaving dashboard
 */

import { useNavigate } from 'react-router-dom';
import { DashboardCard } from '../DashboardCard/DashboardCard';
import { useConversations } from '../../../../hooks/messaging/useConversations';
import type { Conversation } from '../../../../types/private-messaging';
import styles from './RecentConversationsCard.module.scss';

export interface RecentConversationsCardProps {
  maxItems?: number;
}

export const RecentConversationsCard = ({
  maxItems = 5
}: RecentConversationsCardProps) => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useConversations('active');

  const conversations = data?.results?.slice(0, maxItems) || [];
  const isEmpty = !isLoading && conversations.length === 0;

  const handleViewAll = () => {
    navigate('/messages');
  };

  const handleConversationClick = (conversationId: string) => {
    navigate(`/messages/${conversationId}`);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <DashboardCard
      titleIconName="InboxIcon"
      title="Recent Messages"
      emptyIconName="EmptyMailboxIcon"
      emptyMessage="No messages yet. Start a conversation with a group member!"
      isEmpty={isEmpty}
      isLoading={isLoading}
      showActionButton={!isEmpty && !isLoading}
      actionButtonText="View All"
      onActionClick={handleViewAll}
      isSecondaryBtn={true}
    >
      {error && (
        <div className={styles.error} role="alert" aria-live="polite">
          <p>Unable to load messages. Please try again later.</p>
        </div>
      )}

      {!error && !isEmpty && (
        <div
          className={styles.conversationsList}
          role="list"
          aria-label="Recent conversations"
        >
          {conversations.map((conversation: Conversation) => (
            <button
              key={conversation.id}
              className={styles.conversationItem}
              onClick={() => handleConversationClick(conversation.id)}
              role="listitem"
              aria-label={`Conversation with ${conversation.other_participant?.display_name || 'Unknown'}`}
            >
              {/* Avatar/Initial */}
              <div className={styles.avatar}>
                {conversation.other_participant?.photo_url ? (
                  <img
                    src={conversation.other_participant.photo_url}
                    alt=""
                    className={styles.avatarImage}
                  />
                ) : (
                  <div className={styles.avatarInitial}>
                    {(conversation.other_participant?.display_name ||
                      conversation.other_participant?.first_name ||
                      conversation.other_participant?.email ||
                      '?'
                    ).charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className={styles.conversationContent}>
                <div className={styles.conversationHeader}>
                  <span className={styles.participantName}>
                    {conversation.other_participant?.display_name ||
                     `${conversation.other_participant?.first_name || ''} ${conversation.other_participant?.last_name || ''}`.trim() ||
                     conversation.other_participant?.email ||
                     'Unknown'}
                  </span>
                  <span className={styles.time}>
                    {formatTime(conversation.updated_at)}
                  </span>
                </div>

                <div className={styles.conversationFooter}>
                  {conversation.last_message && (
                    <p className={styles.lastMessage}>
                      {conversation.last_message.is_mine && 'You: '}
                      {conversation.last_message.content.length > 60
                        ? `${conversation.last_message.content.substring(0, 60)}...`
                        : conversation.last_message.content}
                    </p>
                  )}
                  {conversation.unread_count > 0 && (
                    <span className={styles.unreadBadge}>
                      {conversation.unread_count}
                    </span>
                  )}
                </div>

                {/* Context (Group name if available) */}
                {conversation.context?.group?.name && (
                  <span className={styles.context}>
                    Via {conversation.context.group.name}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </DashboardCard>
  );
};

export default RecentConversationsCard;
