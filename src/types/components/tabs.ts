/**
 * Tabs Component Type Definitions
 */

import type { TabsProps as AriaTabsProps } from 'react-aria-components';

export interface TabsProps extends Omit<AriaTabsProps, 'children'> {
  children: React.ReactNode;
  className?: string;
  tabListClassName?: string;
  'aria-label'?: string;
}

export interface TabListProps {
  children: React.ReactNode;
  className?: string;
  'aria-label'?: string;
}

export interface TabItemProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  isDisabled?: boolean;
}

export interface TabPanelProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}
