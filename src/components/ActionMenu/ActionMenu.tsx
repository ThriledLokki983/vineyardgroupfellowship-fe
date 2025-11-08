/**
 * ActionMenu Component
 * A reusable vertical 3-dot menu for moderation/content actions
 * Used across discussions, prayers, testimonies, and scriptures
 */

import { useState, useRef, useEffect } from 'react';
import Icon from '../Icon';
import type { IconName } from '../../types';
import styles from './ActionMenu.module.scss';

export interface ActionMenuItem {
  id: string;
  label: string;
  icon?: IconName;
  onClick: () => void;
  variant?: 'default' | 'danger';
  disabled?: boolean;
}

interface ActionMenuProps {
  items: ActionMenuItem[];
  ariaLabel?: string;
}

const ActionMenu = ({ items, ariaLabel = 'Content actions' }: ActionMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleItemClick = (item: ActionMenuItem) => {
    if (!item.disabled) {
      item.onClick();
      setIsOpen(false);
    }
  };

  return (
    <div className={styles.actionMenu}>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className={styles.triggerButton}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Icon name="SettingsDotIcon" size={20} />
      </button>

      {isOpen && (
        <div ref={menuRef} className={styles.menu} role="menu">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleItemClick(item)}
              className={`${styles.menuItem} ${item.variant === 'danger' ? styles.danger : ''}`}
              disabled={item.disabled}
              role="menuitem"
            >
              {item.icon && <Icon name={item.icon} size={16} />}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActionMenu;
