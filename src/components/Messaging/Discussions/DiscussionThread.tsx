/**
 * DiscussionThread Component
 * Full discussion view with original post, comments, and moderation actions
 */

import { useState } from 'react';
import { useDiscussion, usePinDiscussion, useDeleteDiscussion, useUpdateDiscussion } from 'hooks/messaging';
import { useAuthContext } from 'contexts/Auth/useAuthContext';
import { useUserPermissions } from 'hooks/useUserPermissions';
import CommentSection from './CommentSection';
import Icon from 'components/Icon';
import styles from './DiscussionThread.module.scss';

interface DiscussionThreadProps {
  discussionId: string;
  groupId: string;
  onBack?: () => void;
  onDeleted?: () => void;
}

const DiscussionThread = ({ discussionId, groupId: _groupId, onBack, onDeleted }: DiscussionThreadProps) => {
  const { user } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const { data: discussion, isLoading } = useDiscussion(discussionId);
  const { mutate: pinDiscussion, isPending: isPinning } = usePinDiscussion();
  const { mutate: deleteDiscussion, isPending: isDeleting } = useDeleteDiscussion();
  const { mutate: updateDiscussion, isPending: isUpdating } = useUpdateDiscussion();
  const permissions = useUserPermissions();

  // For now, check if user is group leader (you may need to fetch group membership separately)
  const isGroupLeader = permissions.canLeadGroups;

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <p>Loading discussion...</p>
        </div>
      </div>
    );
  }

  if (!discussion) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <p>Discussion not found</p>
        </div>
      </div>
    );
  }

  const isAuthor = user?.id === discussion.author.id;
  const canModerate = isGroupLeader || isAuthor;

  // Format timestamp
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  // Get author display name
  const authorName =
    discussion.author.first_name && discussion.author.last_name
      ? `${discussion.author.first_name} ${discussion.author.last_name}`
      : discussion.author.username;

  // Handlers
  const handleTogglePin = () => {
    pinDiscussion(discussionId, {
      onSuccess: () => {
        // Success feedback could be shown via toast
      },
    });
  };

  const handleDelete = () => {
    if (
      window.confirm(
        'Are you sure you want to delete this discussion? This action cannot be undone.'
      )
    ) {
      deleteDiscussion(discussionId, {
        onSuccess: () => {
          onDeleted?.();
        },
      });
    }
  };

  const handleStartEdit = () => {
    setEditTitle(discussion?.title || '');
    setEditContent(discussion?.content || '');
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTitle('');
    setEditContent('');
  };

  const handleSaveEdit = () => {
    if (!editTitle.trim() || !editContent.trim()) return;

    updateDiscussion(
      {
        id: discussionId,
        payload: {
          title: editTitle.trim(),
          content: editContent.trim(),
        },
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          setEditTitle('');
          setEditContent('');
        },
      }
    );
  };

  return (
    <div className={styles.container}>
      {/* Back Button */}
      {onBack && (
        <button type="button" onClick={onBack} className={styles.backButton}>
          <Icon name="ArrowLeftIcon" size={20} />
          <span>Back to Discussions</span>
        </button>
      )}

      {/* Discussion Header */}
      <article className={styles.discussion}>
        {isEditing ? (
          /* Edit Form */
          <div className={styles.editForm}>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className={styles.editTitleInput}
              placeholder="Discussion title"
              maxLength={100}
              disabled={isUpdating}
            />
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className={styles.editContentTextarea}
              placeholder="Share your thoughts..."
              rows={6}
              maxLength={1000}
              disabled={isUpdating}
            />
            <div className={styles.editActions}>
              <button
                type="button"
                onClick={handleSaveEdit}
                className={styles.saveButton}
                disabled={!editTitle.trim() || !editContent.trim() || isUpdating}
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className={styles.cancelButton}
                disabled={isUpdating}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          /* View Mode */
          <>
            {/* Title */}
            <h1 className={styles.title}>
              {discussion.is_pinned && (
                <Icon name="StarIconFill" size={22} className={styles.pinnedIcon} />
              )}
              {discussion.title}
            </h1>

            {/* Meta Info */}
            <div className={styles.meta}>
              <span className={styles.author}>by {authorName}</span>
              <span className={styles.separator}>•</span>
              <time className={styles.timestamp} dateTime={discussion.created_at}>
                {formatDate(discussion.created_at)}
              </time>
              {discussion.updated_at !== discussion.created_at && (
                <>
                  <span className={styles.separator}>•</span>
                  <span className={styles.edited}>edited</span>
                </>
              )}
            </div>

            {/* Content */}
            <div className={styles.content}>{discussion.content}</div>

            {/* Stats & Actions Footer */}
            <div className={styles.footer}>
              <div className={styles.stats}>
                <span className={styles.stat}>
                  <Icon name="ChatBubbleIcon" size={16} />
                  {discussion.comment_count} {discussion.comment_count === 1 ? 'comment' : 'comments'}
                </span>
                <span className={styles.stat}>
                  <Icon name="PraiseIcon" size={16} />
                  {discussion.reaction_count} {discussion.reaction_count === 1 ? 'reaction' : 'reactions'}
                </span>
              </div>

              {/* Moderation Actions */}
              {canModerate && (
                <div className={styles.moderationActions}>
                  {isAuthor && (
                    <button
                      type="button"
                      onClick={handleStartEdit}
                      className={styles.moderationButton}
                    >
                      <Icon name="PencilIcon" size={16} />
                      Edit
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleTogglePin}
                    className={styles.moderationButton}
                    disabled={isPinning}
                  >
                    <Icon name={discussion.is_pinned ? 'StarIconFill' : 'StarIconOutline'} size={16} />
                    {discussion.is_pinned ? 'Unpin' : 'Pin'}
                  </button>
                  {isAuthor && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      className={`${styles.moderationButton} ${styles.deleteButton}`}
                      disabled={isDeleting}
                    >
                      <Icon name="CrossIcon" size={16} />
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </article>

      {/* Comments Section */}
      <CommentSection discussionId={discussionId} />
    </div>
  );
};

export default DiscussionThread;
