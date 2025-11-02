/**
 * Custom Select Component
 * Built with React Aria Components for accessible, styleable selects
 */

import type { ListBoxItemProps } from 'react-aria-components';
import {
  Select as AriaSelect,
  Label,
  Button,
  SelectValue,
  Popover,
  ListBox,
  ListBoxItem,
  FieldError,
  Text
} from 'react-aria-components';
import Icon from '../Icon';
import type { CustomSelectProps } from 'types';
import styles from './Select.module.scss';

export function Select<T extends object>({
  label,
  description,
  errorMessage,
  children,
  items,
  placeholder = 'Select an option',
  selectedKey,
  onSelectionChange,
  ...props
}: CustomSelectProps<T>) {
  return (
    <AriaSelect
      {...props}
      selectedKey={selectedKey as string | number | null | undefined}
      onSelectionChange={onSelectionChange as ((key: string | number | null) => void) | undefined}
      className={styles.select}
    >
      {label && <Label className={styles.label}>{label}</Label>}
      <Button className={styles.button}>
        <SelectValue className={styles.value}>
          {({ isPlaceholder, selectedText }) => (
            <span className={isPlaceholder ? styles.placeholder : ''}>
              {isPlaceholder ? placeholder : selectedText}
            </span>
          )}
        </SelectValue>
        <span aria-hidden="true" className={styles.icon}>
          <Icon name="SelectDownIcon" />
        </span>
      </Button>
      {description && (
        <Text slot="description" className={styles.description}>
          {description}
        </Text>
      )}
      <FieldError className={styles.error}>{errorMessage}</FieldError>
      <Popover className={styles.popover}>
        <ListBox className={styles.listbox} items={items}>
          {children}
        </ListBox>
      </Popover>
    </AriaSelect>
  );
}

// Export SelectItem for convenience
export function SelectItem(props: ListBoxItemProps) {
  return (
    <ListBoxItem
      {...props}
      className={({ isFocused, isSelected, isDisabled }) =>
        `${styles.item} ${isFocused ? styles.focused : ''} ${
          isSelected ? styles.selected : ''
        } ${isDisabled ? styles.disabled : ''}`
      }
    />
  );
}

export default Select;
