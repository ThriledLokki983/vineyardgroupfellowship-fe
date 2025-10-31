import { useLayoutEffect, useMemo, useState } from 'react';
import Icon from '../Icon';
import styles from './AlertBar.module.scss';

type IconName = 'ExclamationCircleIcon' | 'CheckMarkFillIcon' | 'ExclamationTriangleIcon' | 'CrossIcon';

const ICON_MAP: Record<string, IconName> = {
  notice: 'ExclamationCircleIcon',
  success: 'CheckMarkFillIcon',
  warning: 'ExclamationTriangleIcon',
};

interface AlertBarProps extends React.HTMLAttributes<HTMLDivElement> {
  hidden?: boolean;
  variation?: 'notice' | 'success' | 'warning';
  possibleToClose?: boolean;
  children: React.ReactNode;
}

const AlertBar = ({
  hidden = false,
  variation = 'notice',
  possibleToClose = true,
  children,
  ...props
}: AlertBarProps) => {

  const [isHiding, setIsHiding] = useState(hidden);
  const [isHidden, setIsHidden] = useState(hidden);

  const iconName = useMemo(() => ICON_MAP[variation], [variation]);

  /**
   * Reset state if there's a unique `id` provided and it changes.
   */
  useLayoutEffect(() => {
    setIsHiding(hidden);
    setIsHidden(hidden);
  }, [hidden, props.id]);

  /**
   * Handle close/remove clicks.
   */
  const removeHandler = () => {
    setIsHiding(true);
    window.setTimeout(() => setIsHidden(true), 500);
  };

  if (isHidden) {
    return null;
  }

  return (
    <div className={styles.root} role="alert" alert-bar="" data-hiding={isHiding} data-variation={variation} {...props}>
      <Icon name={iconName} aria-hidden="true" />
      <div className={styles.root__content}>
        {children}
      </div>
      {possibleToClose ? (
        <button className={styles.root__remove} type="button" onClick={removeHandler} aria-label="Close">
          <Icon name="CrossIcon" aria-hidden="true" />
        </button>
        ) : null}
    </div>
  );

};

export default AlertBar;
