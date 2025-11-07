/**
 * CommentSection Component
 * Displays list of comments with add comment form and nested replies
 */

import { useState } from 'react';
import { useComments, useCreateComment, useUpdateComment, useDeleteComment } from 'hooks/messaging';
import { useAuthContext } from 'contexts/Auth/useAuthContext';
import CommentItem from './CommentItem';
import ChildCommentsList from './ChildCommentsList';
import type { Comment } from 'types/messaging';
import styles from './CommentSection.module.scss';

interface CommentSectionProps {
  discussionId: string;
}

const CommentSection = ({ discussionId }: CommentSectionProps) => {
  const { user } = useAuthContext();
  const [newCommentContent, setNewCommentContent] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set()); // Track expanded reply lists

  // Hooks
  const { data: commentsData, isLoading } = useComments(discussionId);
  const { mutate: createComment, isPending: isCreating } = useCreateComment();
  const { mutate: updateComment, isPending: isUpdating } = useUpdateComment();
  const { mutate: deleteComment } = useDeleteComment();

  const comments = commentsData?.results || [];

  // TEMPORARY DEBUG: Log comments when they change
  if (import.meta.env.DEV) {
    console.log('📝 Comments data updated:', {
      total: comments.length,
      totalFromData: commentsData?.count,
      hasParentField: comments.length > 0 && 'parent' in comments[0],
      topLevel: comments.filter((c: Comment) => !c.parent || c.parent === null).length,
      replies: comments.filter((c: Comment) => c.parent).length,
      commentIds: comments.map((c: Comment) => c.id),
    });
  }

  // Build nested comment tree
  interface CommentWithDepth extends Comment {
    depth: number;
    replies: CommentWithDepth[];
  }

  const buildCommentTree = (parentId: string | null = null, depth = 0): CommentWithDepth[] => {
    const filtered = comments.filter((c: Comment) => {
      if (parentId === null) {
        return c.parent === null || c.parent === undefined;
      }
      return c.parent === parentId;
    });

    return filtered
		.map((comment: Comment) => ({
			...comment,
			depth,
			replies: buildCommentTree(comment.id, depth + 1).reverse(), // Reverse child comments - newest first
		}));
  };

  const commentTree = buildCommentTree();

  // Only render top-level comments (depth 0) - ChildCommentsList will handle replies
  const topLevelComments = commentTree;

  // Handlers
  const handleSubmitNewComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentContent.trim()) return;

    createComment(
      {
        discussion: discussionId,
        content: newCommentContent.trim(),
        parent: null,
      },
      {
        onSuccess: () => {
          setNewCommentContent('');
        },
      }
    );
  };

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !replyingToId) return;

    // Capture the parent ID before clearing state
    const parentCommentId = replyingToId;

    createComment(
      {
        discussion: discussionId,
        content: replyContent.trim(),
        parent: parentCommentId,
      },
      {
        onSuccess: () => {
          // Expand the replies list for this comment
          setExpandedReplies((prev) => new Set(prev).add(parentCommentId));
          setReplyContent('');
          setReplyingToId(null);
        },
      }
    );
  };

  const handleSubmitEdit = (commentId: string) => {
    if (!editContent.trim()) return;

    updateComment(
      {
        id: commentId,
        payload: { content: editContent.trim() },
      },
      {
        onSuccess: () => {
          setEditingCommentId(null);
          setEditContent('');
        },
      }
    );
  };

  const handleEdit = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditContent('');
  };

  const handleReply = (comment: Comment) => {
    setReplyingToId(comment.id);
    setReplyContent('');
  };

  const handleCancelReply = () => {
    setReplyingToId(null);
    setReplyContent('');
  };

  const handleDelete = (commentId: string) => {
    deleteComment({ id: commentId, discussionId });
  };

  const handleToggleReplies = (commentId: string) => {
    setExpandedReplies((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <p className={styles.loadingText}>Loading comments...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Comment Count Header */}
      <div className={styles.header}>
        <h3 className={styles.title}>
          {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
        </h3>
      </div>

      {/* Add Comment Form */}
      {user && (
        <form onSubmit={handleSubmitNewComment} className={styles.addCommentForm}>
          <textarea
            value={newCommentContent}
            onChange={(e) => setNewCommentContent(e.target.value)}
            placeholder="Share your thoughts..."
            className={styles.textarea}
            rows={3}
            disabled={isCreating}
          />
          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={!newCommentContent.trim() || isCreating}
            >
              {isCreating ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      )}

      {/* Comments List */}
      <div className={styles.commentsList}>
        {topLevelComments.length === 0 ? (
          <p className={styles.emptyText}>No comments yet. Be the first to share!</p>
        ) : (
          topLevelComments.map((comment: CommentWithDepth) => (
            <div key={comment.id} className={styles.commentThread}>
              {editingCommentId === comment.id ? (
                // Edit Form for top-level comment
                <div className={styles.editForm}>
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
                      onClick={() => handleSubmitEdit(comment.id)}
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
                <CommentItem
                  comment={comment}
                  onReply={handleReply}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  depth={comment.depth}
                />
              )}

              {/* Reply Form */}
              {replyingToId === comment.id && (
                <form onSubmit={handleSubmitReply} className={styles.replyForm}>
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a reply..."
                    className={styles.textarea}
                    rows={2}
                    autoFocus
                    disabled={isCreating}
                  />
                  <div className={styles.formActions}>
                    <button
                      type="submit"
                      className={styles.submitButton}
                      disabled={!replyContent.trim() || isCreating}
                    >
                      {isCreating ? 'Posting...' : 'Reply'}
                    </button>
                    <button type="button" onClick={handleCancelReply} className={styles.cancelButton}>
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Child Comments List - Grouped Container */}
              <ChildCommentsList
                replies={comment.replies || []}
                parentCommentId={comment.id}
                isExpanded={expandedReplies.has(comment.id)}
                onToggle={() => handleToggleReplies(comment.id)}
                onEdit={handleEdit}
                onDelete={handleDelete}
                editingCommentId={editingCommentId}
                editContent={editContent}
                setEditContent={setEditContent}
                handleSubmitEdit={handleSubmitEdit}
                handleCancelEdit={handleCancelEdit}
                isUpdating={isUpdating}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
