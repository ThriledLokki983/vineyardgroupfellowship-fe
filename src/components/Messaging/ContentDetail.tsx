/**
 * ContentDetail Component
 * Reusable detail view component for content items
 * Works for discussions, prayers, testimonies, and scriptures
 * Includes full content display, comments section, and moderation actions
 */

import { useState, useRef } from 'react';
import { useAuthContext } from 'contexts/Auth/useAuthContext';
import { useUserPermissions } from 'hooks/useUserPermissions';
import {
  useDiscussion,
  usePinDiscussion,
  useDeleteDiscussion,
  useUpdateDiscussion,
  usePrayerRequest,
  useMarkPrayerAnswered,
  usePrayForRequest,
  useTestimony,
  useScripture,
} from 'hooks/messaging';
import CommentSection from './Discussions/CommentSection';
import Icon from 'components/Icon';
import ActionMenu, { type ActionMenuItem } from 'components/ActionMenu';
import type { Discussion, PrayerRequest, Testimony, Scripture } from '../../types/messaging';
import styles from './ContentDetail.module.scss';

type ContentItem = Discussion | PrayerRequest | Testimony | Scripture;
type ContentType = 'discussion' | 'prayer' | 'testimony' | 'scripture';

interface ContentDetailProps {
  itemId: string;
  contentType: ContentType;
  groupId: string;
  onBack?: () => void;
  onDeleted?: () => void;
}

const ContentDetail = ({ itemId, contentType, groupId: _groupId, onBack, onDeleted }: ContentDetailProps) => {
  const { user } = useAuthContext();
  const permissions = useUserPermissions();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  // Fetch content based on type
  const {
    data: discussion,
    isLoading: isLoadingDiscussion,
  } = useDiscussion(itemId, contentType === 'discussion');

  const {
    data: prayer,
    isLoading: isLoadingPrayer,
  } = usePrayerRequest(itemId, { enabled: contentType === 'prayer' });

  const {
    data: testimony,
    isLoading: isLoadingTestimony,
  } = useTestimony(itemId, { enabled: contentType === 'testimony' });

  const {
    data: scripture,
    isLoading: isLoadingScripture,
  } = useScripture(itemId, { enabled: contentType === 'scripture' });

  // Get the active content item
  const content: ContentItem | undefined = discussion || prayer || testimony || scripture;
  const isLoading = isLoadingDiscussion || isLoadingPrayer || isLoadingTestimony || isLoadingScripture;

  // Mutations (only available for discussions and prayers currently)
  const { mutate: pinDiscussion, isPending: isPinning } = usePinDiscussion();
  const { mutate: deleteDiscussion, isPending: isDeleting } = useDeleteDiscussion();
  const { mutate: updateDiscussion, isPending: isUpdating } = useUpdateDiscussion();
  const { mutate: markAnswered, isPending: isMarkingAnswered } = useMarkPrayerAnswered();
  const { mutate: prayForRequest, isPending: isPraying } = usePrayForRequest();

  const isGroupLeader = permissions.canLeadGroups;

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <p>Loading {contentType}...</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <p>{contentType.charAt(0).toUpperCase() + contentType.slice(1)} not found</p>
        </div>
      </div>
    );
  }

  const isAuthor = user?.id === content.author.id;

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
    content.author.first_name && content.author.last_name
      ? `${content.author.first_name} ${content.author.last_name}`
      : content.author.username;

  // Get title based on content type
  const getTitle = () => {
    if ('title' in content) return content.title;
    if (contentType === 'scripture' && 'reference' in content) {
      const translationText = 'translation' in content ? ` (${content.translation})` : '';
      return `${content.reference}${translationText}`;
    }
    return 'Untitled';
  };

  // Get main content text
  const getContentText = () => {
    if ('content' in content) return content.content;
    if ('verse_text' in content) return content.verse_text;
    return '';
  };

  // Get secondary content (for scripture reflection)
  const getSecondaryContent = () => {
    if (contentType === 'scripture' && 'reflection' in content) {
      return content.reflection;
    }
    return null;
  };

  // Handlers
  const handleTogglePin = () => {
    if (contentType === 'discussion') {
      pinDiscussion(itemId);
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete this ${contentType}? This action cannot be undone.`)) {
      // Only discussions support delete for now
      if (contentType === 'discussion') {
        deleteDiscussion(itemId, { onSuccess: onDeleted });
      } else {
        console.warn(`Delete not yet implemented for ${contentType}`);
      }
    }
  };

  const handleStartEdit = () => {
    setEditTitle(getTitle());
    setEditContent(getContentText());
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTitle('');
    setEditContent('');
  };

  const handleSaveEdit = () => {
    if (!editTitle.trim() || !editContent.trim()) return;

    const payload = {
      title: editTitle.trim(),
      content: editContent.trim(),
    };

    // Only discussions support update for now
    if (contentType === 'discussion') {
      updateDiscussion({ id: itemId, payload }, { onSuccess: () => setIsEditing(false) });
    } else {
      console.warn(`Update not yet implemented for ${contentType}`);
    }
  };

  // Prayer-specific handlers
  const handlePray = () => {
    prayForRequest(itemId);
  };

  const handleMarkAnswered = () => {
    // This will prompt for answer description in the future
    markAnswered({ id: itemId, payload: { answer_description: 'Answered' } });
  };

  // Handle clicking on comment stat - scroll to comment input
  const handleCommentClick = () => {
    commentInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    commentInputRef.current?.focus();
  };

  // Check if edit is allowed (within 15 minutes of creation)
  const isEditAllowed = () => {
    if (!content) return false;
    const createdAt = new Date(content.created_at);
    const now = new Date();
    const diffMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60);
    return diffMinutes <= 15;
  };

  // Get stats
  const commentCount = 'comment_count' in content ? content.comment_count : 0;
  const prayerCount = 'prayer_count' in content ? content.prayer_count : undefined;
  const isPinned = 'is_pinned' in content ? content.is_pinned : false;
  const isAnswered = 'is_answered' in content ? content.is_answered : false;
  const urgency = 'urgency' in content ? content.urgency : undefined;

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

  // Pin action - available to moderators only (all content types)
  if (isGroupLeader) {
    actionMenuItems.push({
      id: 'pin',
      label: isPinned ? 'Unpin' : 'Pin',
      icon: isPinned ? 'StarIconFill' : 'StarIconOutline',
      onClick: handleTogglePin,
      disabled: isPinning || contentType !== 'discussion', // Only discussions support pin for now
    });
  }

  // Report action - available to moderators only
  if (isGroupLeader) {
    actionMenuItems.push({
      id: 'report',
      label: 'Report',
      icon: 'CircleWarning',
      onClick: () => {
        // TODO: Implement report functionality
        console.log('Report functionality to be implemented');
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
          <span>Back to {contentType}s</span>
        </button>
      )}

      {/* Content Article */}
      <article className={`${styles.content} ${isAnswered ? styles.answered : ''}`}>
        {isEditing ? (
          /* Edit Form */
          <div className={styles.editForm}>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className={styles.editTitleInput}
              placeholder={`${contentType} title`}
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
          <>
            {/* Header with Title and Actions */}
            <div className={styles.titleRow}>
              <h1 className={styles.title}>
                {isPinned && <Icon name="StarIconFill" size={22} className={styles.pinnedIcon} />}
                {isAnswered && <Icon name="CheckMarkIcon" size={22} className={styles.answeredIcon} />}
                {contentType === 'scripture' && 'reference' in content && 'translation' in content ? (
                  <>
                    {content.reference}{' '}
                    <span className={styles.translationBadge}>({content.translation})</span>
                  </>
                ) : (
                  getTitle()
                )}
              </h1>
              {actionMenuItems.length > 0 && (
                <ActionMenu items={actionMenuItems} ariaLabel={`${contentType} actions`} />
              )}
            </div>

            {/* Meta Info */}
            <div className={styles.meta}>
              <span className={styles.author}>by {authorName}</span>
              <span className={styles.separator}>•</span>
              <time className={styles.timestamp} dateTime={content.created_at}>
                {formatDate(content.created_at)}
              </time>
              {'updated_at' in content && content.updated_at !== content.created_at && (
                <>
                  <span className={styles.separator}>•</span>
                  <span className={styles.edited}>edited</span>
                </>
              )}
              {urgency && (
                <>
                  <span className={styles.separator}>•</span>
                  <span className={`${styles.badge} ${styles[urgency]}`}>{urgency}</span>
                </>
              )}
            </div>

            {/* Main Content */}
            <div className={styles.mainContent}>{getContentText()}</div>

            {/* Secondary Content (Scripture Reflection) */}
            {getSecondaryContent() && (
              <div className={styles.secondaryContent}>
                <h3>Reflection</h3>
                <p>{getSecondaryContent()}</p>
              </div>
            )}

            {/* Interactive Stats & Actions Footer */}
            <div className={styles.footer}>
              <div className={styles.stats}>
                <button
                  type="button"
                  onClick={handleCommentClick}
                  className={styles.statButton}
                  aria-label={`${commentCount} comments - click to add comment`}
                >
                  <Icon name="ChatBubbleIcon" size={16} />
                  <span>{commentCount} {commentCount === 1 ? 'comment' : 'comments'}</span>
                </button>
                {'reaction_count' in content && (
                  <button
                    type="button"
                    className={styles.statButton}
                    aria-label={`${content.reaction_count} reactions - click to add reaction`}
                  >
                    <Icon name="PraiseIcon" size={16} />
                    <span>{content.reaction_count} {content.reaction_count === 1 ? 'reaction' : 'reactions'}</span>
                  </button>
                )}
                {prayerCount !== undefined && (
                  <button
                    type="button"
                    onClick={handlePray}
                    className={styles.statButton}
                    disabled={isPraying}
                    aria-label={`${prayerCount} prayers - click to pray`}
                  >
                    <Icon name="PraiseIcon" size={16} />
                    <span>{prayerCount} {prayerCount === 1 ? 'prayer' : 'prayers'}</span>
                  </button>
                )}
              </div>

              {/* Prayer-Specific Action */}
              {contentType === 'prayer' && !isAnswered && isAuthor && (
                <button
                  type="button"
                  onClick={handleMarkAnswered}
                  className={styles.answeredButton}
                  disabled={isMarkingAnswered}
                >
                  <Icon name="CheckMarkIcon" size={16} />
                  Mark as Answered
                </button>
              )}
            </div>
          </>
        )}
      </article>

      {/* Comments Section */}
      <CommentSection discussionId={itemId} contentType={contentType} inputRef={commentInputRef} />
    </div>
  );
};

export default ContentDetail;
