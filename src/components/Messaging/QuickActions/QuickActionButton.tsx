import { useState } from 'react';
import Icon from '../../Icon';
import styles from './QuickActionButton.module.scss';

interface QuickActionButtonProps {
  onCreatePrayer: () => void;
  onCreateTestimony: () => void;
  onCreateScripture: () => void;
}

/**
 * QuickActionButton - Floating Action Button for creating content
 *
 * Fixed position FAB that expands to show three creation options:
 * - Prayer Request
 * - Testimony
 * - Scripture Share
 *
 * Mobile-friendly with touch targets and backdrop click-to-close.
 */
export function QuickActionButton({
  onCreatePrayer,
  onCreateTestimony,
  onCreateScripture,
}: QuickActionButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleBackdropClick = () => {
    if (isExpanded) {
      setIsExpanded(false);
    }
  };

  const handlePrayerClick = () => {
    setIsExpanded(false);
    onCreatePrayer();
  };

  const handleTestimonyClick = () => {
    setIsExpanded(false);
    onCreateTestimony();
  };

  const handleScriptureClick = () => {
    setIsExpanded(false);
    onCreateScripture();
  };

  return (
    <>
      {/* Backdrop - closes menu when clicked */}
      {isExpanded && (
        <div
          className={styles.backdrop}
          onClick={handleBackdropClick}
          aria-hidden="true"
        />
      )}

      <div className={styles.fabContainer}>
        {/* Action Menu - appears when expanded */}
        {isExpanded && (
          <div className={styles.actionMenu} role="menu">
            <button
              type="button"
              className={styles.actionItem}
              onClick={handlePrayerClick}
              role="menuitem"
            >
              <span className={styles.iconWrapper}>
                <Icon name="HandIcon" className={styles.actionIcon} />
              </span>
              <span className={styles.actionLabel}>Prayer Request</span>
            </button>

            <button
              type="button"
              className={styles.actionItem}
              onClick={handleTestimonyClick}
              role="menuitem"
            >
              <span className={styles.iconWrapper}>
                <Icon name="PraiseIcon" className={styles.actionIcon} />
              </span>
              <span className={styles.actionLabel}>Testimony</span>
            </button>

            <button
              type="button"
              className={styles.actionItem}
              onClick={handleScriptureClick}
              role="menuitem"
            >
              <span className={styles.iconWrapper}>
                <Icon name="AgendaCheck" className={styles.actionIcon} />
              </span>
              <span className={styles.actionLabel}>Share Scripture</span>
            </button>
          </div>
        )}

        {/* Main FAB */}
        <button
          type="button"
          className={`${styles.fab} ${isExpanded ? styles.fabExpanded : ''}`}
          onClick={handleToggle}
          aria-label={isExpanded ? 'Close quick actions menu' : 'Open quick actions menu'}
          aria-expanded={isExpanded}
          aria-haspopup="menu"
        >
          <Icon
            name={isExpanded ? 'CrossIcon' : 'PlusIcon'}
            className={styles.fabIcon}
          />
        </button>
      </div>
    </>
  );
}
