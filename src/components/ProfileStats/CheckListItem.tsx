/**
 * CheckListItem - Profile completion checklist item
 */

import Icon from '../Icon';
import Button from '../Button';
import styles from './CheckListItem.module.scss';

interface CheckListItemProps {
  complete: boolean;
  label: string;
  action?: string;
  onAction?: () => void;
}

export default function CheckListItem({
  complete,
  label,
  action,
  onAction
}: CheckListItemProps) {
  return (
    <div className={`${styles.checkListItem} ${complete ? styles.complete : ''}`}>
      <div className={styles.checkIcon}>
        {complete ? (
          <Icon name="CheckMarkFillIcon" width={20} height={20} aria-label="Complete" />
        ) : (
          <Icon name="CrossIcon" width={20} height={20} aria-label="Incomplete" />
        )}
      </div>
      <span className={styles.checkLabel}>{label}</span>
      {!complete && action && onAction && (
        <Button
          variant="tertiary"
          onPress={onAction}
          className={styles.actionButton}
        >
          {action}
        </Button>
      )}
    </div>
  );
}
