/**
 * ContentDetail Component
 * Reusable detail view component for content items
 * Works for discussions, prayers, testimonies, and scriptures
 * Includes full content display, comments section, and moderation actions
 */

import { useState } from 'react';
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
    content.author.first_name && content.author.last_name
      ? `${content.author.first_name} ${content.author.last_name}`
      : content.author.username;

  // Get title based on content type
  const getTitle = () => {
    if ('title' in content) return content.title;
    if (contentType === 'scripture' && 'reference' in content) return content.reference;
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

  // Get stats
  const commentCount = 'comment_count' in content ? content.comment_count : 0;
  const prayerCount = 'prayer_count' in content ? content.prayer_count : undefined;
  const isPinned = 'is_pinned' in content ? content.is_pinned : false;
  const isAnswered = 'is_answered' in content ? content.is_answered : false;
  const urgency = 'urgency' in content ? content.urgency : undefined;
  const translation = 'translation' in content ? content.translation : undefined;

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
            {/* Title */}
            <h1 className={styles.title}>
              {isPinned && <Icon name="StarIconFill" size={22} className={styles.pinnedIcon} />}
              {isAnswered && <Icon name="CheckMarkIcon" size={22} className={styles.answeredIcon} />}
              {getTitle()}
            </h1>

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
              {translation && (
                <>
                  <span className={styles.separator}>•</span>
                  <span className={styles.badge}>{translation}</span>
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

            {/* Stats & Actions Footer */}
            <div className={styles.footer}>
              <div className={styles.stats}>
                <span className={styles.stat}>
                  <Icon name="ChatBubbleIcon" size={16} />
                  {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
                </span>
                {prayerCount !== undefined && (
                  <span className={styles.stat}>
                    <Icon name="PraiseIcon" size={16} />
                    {prayerCount} {prayerCount === 1 ? 'prayer' : 'prayers'}
                  </span>
                )}
              </div>

              {/* Prayer-Specific Actions */}
              {contentType === 'prayer' && !isAnswered && (
                <div className={styles.prayerActions}>
                  <button
                    type="button"
                    onClick={handlePray}
                    className={styles.prayButton}
                    disabled={isPraying}
                  >
                    <Icon name="PraiseIcon" size={16} />
                    {isPraying ? 'Praying...' : 'I Prayed'}
                  </button>
                  {isAuthor && (
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
              )}

              {/* Moderation Actions */}
              {canModerate && (
                <div className={styles.moderationActions}>
                  {isAuthor && (
                    <button type="button" onClick={handleStartEdit} className={styles.moderationButton}>
                      <Icon name="PencilIcon" size={16} />
                      Edit
                    </button>
                  )}
                  {contentType === 'discussion' && (
                    <button
                      type="button"
                      onClick={handleTogglePin}
                      className={styles.moderationButton}
                      disabled={isPinning}
                    >
                      <Icon name={isPinned ? 'StarIconFill' : 'StarIconOutline'} size={16} />
                      {isPinned ? 'Unpin' : 'Pin'}
                    </button>
                  )}
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
      <CommentSection discussionId={itemId} contentType={contentType} />
    </div>
  );
};

export default ContentDetail;
