import { TabPanel as AriaTabPanel, type TabPanelProps as AriaTabPanelProps } from 'react-aria-components';
import styles from './TabPanel.module.scss';

export interface TabPanelProps extends AriaTabPanelProps {
  children: React.ReactNode;
}

export default function TabPanel({ children, className = '', ...props }: TabPanelProps) {
  return (
    <AriaTabPanel
      className={`${styles.tabPanel} ${className}`}
      {...props}
    >
      {children}
    </AriaTabPanel>
  );
}