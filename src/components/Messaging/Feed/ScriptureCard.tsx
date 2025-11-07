/**
 * ScriptureCard Component
 * Displays a shared scripture with verse reference, translation, and personal reflection
 */

import Icon from '../../Icon';
import type { Scripture, BibleTranslation } from '../../../types/messaging';
import styles from './ScriptureCard.module.scss';

interface ScriptureCardProps {
  scripture: Scripture;
  onClick?: () => void;
  showFullContent?: boolean;
}

export const ScriptureCard = ({
  scripture,
  onClick,
  showFullContent = false,
}: ScriptureCardProps) => {
  // Get translation badge color
  const getTranslationClass = (translation: BibleTranslation) => {
    // Different colors for different translations
    const colorMap: Record<BibleTranslation, string> = {
      KJV: styles.kjv,
      NIV: styles.niv,
      ESV: styles.esv,
      NLT: styles.nlt,
      NKJV: styles.nkjv,
      NASB: styles.nasb,
      MSG: styles.msg,
    };
    return colorMap[translation] || styles.default;
  };

  // Format date
  const formatDate = (dateString: string) => {
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
    return date.toLocaleDateString();
  };

  return (
    <article className={styles.scriptureCard} onClick={onClick}>
      {/* Header with badge */}
      <div className={styles.header}>
        <div className={styles.badges}>
          <span className={styles.scriptureBadge}>
            <Icon name="AgendaCheck" size={14} />
            <span>Scripture</span>
          </span>

          {/* Translation Badge */}
          <span className={`${styles.translationBadge} ${getTranslationClass(scripture.translation)}`}>
            {scripture.translation}
          </span>
        </div>
      </div>

      {/* Reference */}
      <h3 className={styles.reference}>{scripture.reference}</h3>

      {/* Verse Text */}
      <blockquote className={styles.verseText}>
        "{scripture.verse_text}"
      </blockquote>

      {/* Reflection Section */}
      {scripture.reflection && scripture.has_reflection && (
        <div className={styles.reflectionSection}>
          <div className={styles.reflectionHeader}>
            <Icon name="PencilIcon" size={14} />
            <span>Personal Reflection</span>
          </div>
          <p className={showFullContent ? styles.reflection : styles.reflectionPreview}>
            {scripture.reflection}
          </p>
        </div>
      )}

      {/* Source Attribution */}
      {scripture.source && (
        <p className={styles.source}>
          Source: {scripture.source}
        </p>
      )}

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.meta}>
          <span className={styles.author}>
            {scripture.author.first_name && scripture.author.last_name
              ? `${scripture.author.first_name} ${scripture.author.last_name}`
              : scripture.author.username}
          </span>
          <span className={styles.separator}>•</span>
          <time dateTime={scripture.created_at}>{formatDate(scripture.created_at)}</time>
          {scripture.comment_count > 0 && (
            <>
              <span className={styles.separator}>•</span>
              <div className={styles.metaItem}>
                <Icon name="ChatBubbleIcon" size={14} />
                <span>{scripture.comment_count}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </article>
  );
};
