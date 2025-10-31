import React from 'react';
import {
  Modal as AriaModal,
  Dialog,
  Heading,
  ModalOverlay
} from 'react-aria-components';
import Button from '../Button/Button'
import Icon from '../Icon';
import styles from './Modal.module.scss';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  isDismissable?: boolean;
  isKeyboardDismissDisabled?: boolean;
  showCloseButton?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';
  'aria-label'?: string;
  id?: string;
}

/**
 * Reusable Modal component built with React Aria
 * Provides accessible modal dialogs with proper focus management
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  isDismissable = true,
  isKeyboardDismissDisabled = false,
  showCloseButton = true,
  className,
  size = 'md',
  'aria-label': ariaLabel,
  id,
}) => {
  return (
    <ModalOverlay
      className={styles.overlay}
      isOpen={isOpen}
      onOpenChange={onClose}
      isDismissable={isDismissable}
      isKeyboardDismissDisabled={isKeyboardDismissDisabled}
    >
      <AriaModal
        className={`${styles.modal} ${styles[`modal--${size}`]} ${className || ''}`}
      >
        <Dialog
          aria-label={!title ? ariaLabel : undefined}
          className={styles.dialog}
          id={id}
        >
          {({ close }) => (
            <>
              {/* Header */}
              {(title || showCloseButton) && (
                <header className={styles.header}>
                  {title && (
                    <Heading slot="title" className={styles.title}>
                      {title}
                    </Heading>
                  )}
                  {showCloseButton && (
                    <Button
                      slot="close"
                      className={styles.closeButton}
                      onPress={close}
                      aria-label="Close modal"
                    >
                      <Icon name="CrossIcon" />
                    </Button>
                  )}
                </header>
              )}

              {/* Content */}
              <div className={styles.content}>
                {children}
              </div>
            </>
          )}
        </Dialog>
      </AriaModal>
    </ModalOverlay>
  );
};

export default Modal;