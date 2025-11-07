/**
 * FilterButtonGroup Component
 * Reusable button group for filtering/sorting options
 */

import type { ReactNode } from 'react';
import styles from './FilterButtonGroup.module.scss';

export interface FilterOption<T extends string = string> {
  value: T;
  label: string;
  icon?: ReactNode;
}

interface FilterButtonGroupProps<T extends string = string> {
  label: string;
  options: FilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function FilterButtonGroup<T extends string = string>({
  label,
  options,
  value,
  onChange,
  className = '',
}: FilterButtonGroupProps<T>) {
  return (
    <div className={`${styles.filterGroup} ${className}`}>
      <label className={styles.filterLabel}>{label}</label>
      <div className={styles.filterButtons}>
        {options.map((option) => (
          <button
            key={option.value}
            className={`${styles.filterButton} ${value === option.value ? styles.active : ''}`}
            onClick={() => onChange(option.value)}
            type="button"
          >
            {option.icon && <span className={styles.icon}>{option.icon}</span>}
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default FilterButtonGroup;
