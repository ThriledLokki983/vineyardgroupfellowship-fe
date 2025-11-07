/**
 * ChildCommentsList Component
 * Container for child comments with collapsible toggle
 */

import Icon from 'components/Icon';
import ChildCommentItem from './ChildCommentItem';
import type { Comment } from 'types/messaging';
import styles from './ChildCommentsList.module.scss';

interface CommentWithDepth extends Comment {
  depth: number;
  replies: CommentWithDepth[];
}

interface ChildCommentsListProps {
  replies: CommentWithDepth[];
  parentCommentId: string;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: (comment: Comment) => void;
  onDelete: (commentId: string) => void;
  editingCommentId: string | null;
  editContent: string;
  setEditContent: (content: string) => void;
  handleSubmitEdit: (commentId: string) => void;
  handleCancelEdit: () => void;
  isUpdating: boolean;
}

const ChildCommentsList = ({
  replies,
  parentCommentId: _parentCommentId, // Keep for future use
  isExpanded,
  onToggle,
  onEdit,
  onDelete,
  editingCommentId,
  editContent,
  setEditContent,
  handleSubmitEdit,
  handleCancelEdit,
  isUpdating,
}: ChildCommentsListProps) => {
  if (replies.length === 0) return null;

  return (
    <div className={styles.container}>
      {/* Toggle Button */}
      <button
        type="button"
        onClick={onToggle}
        className={styles.toggleButton}
      >
        <Icon
          name="ChevronDownIcon"
          size={14}
          className={isExpanded ? styles.iconRotated : ''}
        />
        {isExpanded ? 'Hide' : 'Show'} {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
      </button>

      {/* Child Comments - Only visible when expanded */}
      {isExpanded && (
        <div className={styles.repliesList}>
          {replies.map((reply) => (
            <div key={reply.id}>
              {editingCommentId === reply.id ? (
                // Edit Form
                <div className={styles.editForm} style={{ marginLeft: reply.depth * 24 }}>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className={styles.textarea}
                    rows={3}
                    disabled={isUpdating}
                  />
                  <div className={styles.formActions}>
                    <button
                      type="button"
                      onClick={() => handleSubmitEdit(reply.id)}
                      className={styles.submitButton}
                      disabled={!editContent.trim() || isUpdating}
                    >
                      {isUpdating ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className={styles.cancelButton}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <ChildCommentItem
                  comment={reply}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  depth={reply.depth}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChildCommentsList;
