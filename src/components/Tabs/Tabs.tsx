import { Tabs as AriaTabs, TabList as AriaTabList } from 'react-aria-components';
import Tab from '../Tab/Tab';
import TabPanel from '../TabPanel/TabPanel';
import type { TabsProps, TabListProps, TabItemProps, TabPanelProps } from 'types/components';
import styles from './Tabs.module.scss';

/**
 * Custom Tabs component built on React Aria Components
 *
 * Provides accessible tabbed interface with keyboard navigation
 *
 * @example
 * <Tabs defaultSelectedKey="details" aria-label="Group sections">
 *   <Tabs.List>
 *     <Tabs.Tab id="details">Details</Tabs.Tab>
 *     <Tabs.Tab id="messages">Messages</Tabs.Tab>
 *   </Tabs.List>
 *
 *   <Tabs.Panel id="details">
 *     <p>Details content</p>
 *   </Tabs.Panel>
 *
 *   <Tabs.Panel id="messages">
 *     <p>Messages content</p>
 *   </Tabs.Panel>
 * </Tabs>
 */
export function Tabs({
  children,
  className = '',
  ...props
}: TabsProps) {
  return (
    <AriaTabs
      className={`${styles.tabs} ${className}`}
      {...props}
    >
      {children}
    </AriaTabs>
  );
}

// TabList subcomponent
Tabs.List = function TabList({ children, className = '', 'aria-label': ariaLabel }: TabListProps) {
  return (
    <AriaTabList
      className={`${styles.tabList} ${className}`}
      aria-label={ariaLabel}
    >
      {children}
    </AriaTabList>
  );
};

// Tab subcomponent (re-export with custom styling)
Tabs.Tab = function TabItem({ children, className = '', ...props }: TabItemProps) {
  return (
    <Tab className={`${styles.tab} ${className}`} {...props}>
      {children}
    </Tab>
  );
};

// Panel subcomponent (re-export with custom styling)
Tabs.Panel = function TabPanelItem({ children, className = '', ...props }: TabPanelProps) {
  return (
    <TabPanel className={`${styles.tabPanel} ${className}`} {...props}>
      {children}
    </TabPanel>
  );
};

export default Tabs;
