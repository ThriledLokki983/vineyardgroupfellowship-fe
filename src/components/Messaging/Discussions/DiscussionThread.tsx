/**
 * DiscussionThread Component
 * Full discussion view with original post, comments, and moderation actions
 */

import { useState, useRef } from 'react';
import { useDiscussion, usePinDiscussion, useDeleteDiscussion, useUpdateDiscussion } from 'hooks/messaging';
import { useAuthContext } from 'contexts/Auth/useAuthContext';
import { useUserPermissions } from 'hooks/useUserPermissions';
import CommentSection from './CommentSection';
import Icon from 'components/Icon';
import ActionMenu, { type ActionMenuItem } from 'components/ActionMenu';
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
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

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

  // Handle clicking on comment stat - scroll to comment input
  const handleCommentClick = () => {
    commentInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    commentInputRef.current?.focus();
  };

  // Check if edit is allowed (within 15 minutes of creation)
  const isEditAllowed = () => {
    if (!discussion) return false;
    const createdAt = new Date(discussion.created_at);
    const now = new Date();
    const diffMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60);
    return diffMinutes <= 15;
  };

  // Build action menu items
  const actionMenuItems: ActionMenuItem[] = [];

  // Edit action - available to author and moderators (both within 15 mins only)
  const canEdit = isEditAllowed();
  if (isAuthor || isGroupLeader) {
    actionMenuItems.push({
      id: 'edit',
      label: 'Edit',
      icon: 'PencilIcon',
      onClick: handleStartEdit,
      disabled: !canEdit, // Disabled for everyone after 15 mins
    });
  }

  // Pin action - available to moderators only
  if (isGroupLeader) {
    actionMenuItems.push({
      id: 'pin',
      label: discussion?.is_pinned ? 'Unpin' : 'Pin',
      icon: discussion?.is_pinned ? 'StarIconFill' : 'StarIconOutline',
      onClick: handleTogglePin,
      disabled: isPinning,
    });
  }

  // Report action - available to moderators only
  if (isGroupLeader) {
    actionMenuItems.push({
      id: 'report',
      label: 'Report (Coming Soon)',
      icon: 'CircleWarning',
      onClick: () => {
        // Report functionality for group content not yet available
        // Future: Implement POST /api/v1/groups/{groupId}/discussions/{id}/report
        alert('Report functionality coming soon. Please contact group administrators directly for now.');
      },
    });
  }

  // Delete action - available to author and moderators
  if (isAuthor || isGroupLeader) {
    actionMenuItems.push({
      id: 'delete',
      label: 'Delete',
      icon: 'CrossIcon',
      onClick: handleDelete,
      variant: 'danger',
      disabled: isDeleting,
    });
  }

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
            {/* Header with Title and Actions */}
            <div className={styles.titleRow}>
              <h1 className={styles.title}>
                {discussion.is_pinned && (
                  <Icon name="StarIconFill" size={22} className={styles.pinnedIcon} />
                )}
                {discussion.title}
              </h1>
              {actionMenuItems.length > 0 && (
                <ActionMenu items={actionMenuItems} ariaLabel="Discussion actions" />
              )}
            </div>

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

            {/* Interactive Stats Footer */}
            <div className={styles.footer}>
              <div className={styles.stats}>
                <button
                  type="button"
                  onClick={handleCommentClick}
                  className={styles.statButton}
                  aria-label={`${discussion.comment_count} comments - click to add comment`}
                >
                  <Icon name="ChatBubbleIcon" size={16} />
                  <span>{discussion.comment_count} {discussion.comment_count === 1 ? 'comment' : 'comments'}</span>
                </button>
                <button
                  type="button"
                  className={styles.statButton}
                  aria-label={`${discussion.reaction_count} reactions - click to add reaction`}
                >
                  <Icon name="PraiseIcon" size={16} />
                  <span>{discussion.reaction_count} {discussion.reaction_count === 1 ? 'reaction' : 'reactions'}</span>
                </button>
              </div>
            </div>
          </>
        )}
      </article>

      {/* Comments Section */}
      <CommentSection discussionId={discussionId} inputRef={commentInputRef} />
    </div>
  );
};

export default DiscussionThread;
