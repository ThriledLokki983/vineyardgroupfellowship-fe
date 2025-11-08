/**
 * CommentItem Component
 * Displays a single comment with reactions, edit/delete actions, and reply functionality
 */

import { useAuthContext } from 'contexts/Auth/useAuthContext';
import ActionMenu, { type ActionMenuItem } from 'components/ActionMenu';
import type { Comment } from 'types/messaging';
import styles from './CommentItem.module.scss';

interface CommentItemProps {
  comment: Comment;
  onReply?: (comment: Comment) => void;
  onEdit?: (comment: Comment) => void;
  onDelete?: (commentId: string) => void;
  depth?: number; // For nested comment indentation
}

const MAX_EDIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

const CommentItem = ({
  comment,
  onReply,
  onEdit,
  onDelete,
  depth = 0,
}: CommentItemProps) => {
  const { user } = useAuthContext();

  // Check if user is comment author
  const isOwner = user?.id === comment.author.id;

  // Check if comment is within edit window
  const isWithinEditWindow = () => {
    const createdTime = new Date(comment.created_at).getTime();
    const now = Date.now();
    return now - createdTime < MAX_EDIT_WINDOW_MS;
  };

  const canEdit = isOwner && isWithinEditWindow();
  const canDelete = isOwner;

  // Build action menu items
  const actionMenuItems: ActionMenuItem[] = [];

  // Reply action - available to everyone
  if (onReply) {
    actionMenuItems.push({
      id: 'reply',
      label: 'Reply',
      icon: 'ChatBubbleIcon',
      onClick: () => onReply(comment),
    });
  }

  // Edit action - available to owner within 15 minutes
  if (canEdit && onEdit) {
    actionMenuItems.push({
      id: 'edit',
      label: 'Edit',
      icon: 'PencilIcon',
      onClick: () => onEdit(comment),
    });
  }

  // Delete action - available to owner
  if (canDelete && onDelete) {
    actionMenuItems.push({
      id: 'delete',
      label: 'Delete',
      icon: 'CrossIcon',
      onClick: () => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
          onDelete(comment.id);
        }
      },
      variant: 'danger',
    });
  }

  // Format timestamp as relative time
  const getRelativeTime = () => {
    const now = new Date();
    const commentDate = new Date(comment.created_at);
    const diffMs = now.getTime() - commentDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return commentDate.toLocaleDateString();
  };

  // Get author display name - prefer display_name, fallback to username
  const authorName = comment.author.display_name || comment.author.username;

  return (
    <div
      className={styles.commentItem}
      style={{ marginLeft: depth > 0 ? `${depth * 24}px` : undefined }}
    >
      {/* Author & Timestamp + Action Menu */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.author}>{authorName}</span>
          <span className={styles.separator}>•</span>
          <time className={styles.timestamp} dateTime={comment.created_at}>
            {getRelativeTime()}
          </time>
          {comment.is_edited && <span className={styles.editedBadge}>(edited)</span>}
        </div>
        {actionMenuItems.length > 0 && (
          <ActionMenu items={actionMenuItems} ariaLabel="Comment actions" />
        )}
      </div>

      {/* Content */}
      <p className={styles.content}>{comment.content}</p>
    </div>
  );
};

export default CommentItem;
