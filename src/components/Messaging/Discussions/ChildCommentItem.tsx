/**
 * ChildCommentItem Component
 * Displays a child comment (reply) with compact styling
 */

import { useAuthContext } from 'contexts/Auth/useAuthContext';
import type { Comment } from 'types/messaging';
import styles from './ChildCommentItem.module.scss';

interface ChildCommentItemProps {
  comment: Comment & { depth: number };
  onEdit: (comment: Comment) => void;
  onDelete: (commentId: string) => void;
  depth: number;
}

const ChildCommentItem = ({ comment, onEdit, onDelete, depth }: ChildCommentItemProps) => {
  const { user } = useAuthContext();
  const isAuthor = user?.id === comment.author.id;

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

  const formattedTime = getRelativeTime();

  return (
    <div className={styles.childComment} style={{ marginLeft: depth * 24 }}>
      {/* Inline layout on desktop: author • time • content */}
      <div className={styles.inlineContent}>
        {/* Author and timestamp */}
        <div className={styles.meta}>
          <span className={styles.author}>@{comment.author.display_name || comment.author.username}</span>
          <span className={styles.separator}>•</span>
          <span className={styles.timestamp}>{formattedTime}</span>
          {comment.is_edited && (
            <>
              <span className={styles.separator}>•</span>
              <span className={styles.editedLabel}>(edited)</span>
            </>
          )}
        </div>

        {/* Content */}
        <div className={styles.content}>{comment.content}</div>
      </div>

      {/* Actions for author */}
      {isAuthor && (
        <div className={styles.actions}>
          <button onClick={() => onEdit(comment)} className={styles.actionButton} type="button">
            Edit
          </button>
          <button onClick={() => onDelete(comment.id)} className={styles.actionButton} type="button">
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ChildCommentItem;
