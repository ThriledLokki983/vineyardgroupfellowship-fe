# Tabs Component

A custom tabbed interface component built on React Aria Components, providing accessible navigation with keyboard support and ARIA compliance.

## Features

- ✅ **Accessible**: Built on React Aria Components with full ARIA support
- ✅ **Keyboard Navigation**: Arrow keys, Home, End, Tab navigation
- ✅ **Compound Component**: Clean API with `Tabs.List`, `Tabs.Tab`, `Tabs.Panel`
- ✅ **Animated Transitions**: Smooth fade-in animations when switching tabs
- ✅ **Responsive**: Mobile-friendly with horizontal scrolling
- ✅ **Customizable**: Accepts className props for custom styling

## Usage

### Basic Example

```tsx
import { Tabs } from 'components';

function MyComponent() {
  return (
    <Tabs defaultSelectedKey="details" aria-label="Group sections">
      <Tabs.List>
        <Tabs.Tab id="details">Details</Tabs.Tab>
        <Tabs.Tab id="messages">Messages</Tabs.Tab>
        <Tabs.Tab id="settings">Settings</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel id="details">
        <h2>Details Content</h2>
        <p>This is the details panel.</p>
      </Tabs.Panel>

      <Tabs.Panel id="messages">
        <h2>Messages Content</h2>
        <p>This is the messages panel.</p>
      </Tabs.Panel>

      <Tabs.Panel id="settings">
        <h2>Settings Content</h2>
        <p>This is the settings panel.</p>
      </Tabs.Panel>
    </Tabs>
  );
}
```

### Controlled Tabs

```tsx
import { Tabs } from 'components';
import { useState } from 'react';

function ControlledTabs() {
  const [selectedTab, setSelectedTab] = useState('tab1');

  return (
    <Tabs
      selectedKey={selectedTab}
      onSelectionChange={setSelectedTab}
      aria-label="Controlled tabs"
    >
      <Tabs.List>
        <Tabs.Tab id="tab1">Tab 1</Tabs.Tab>
        <Tabs.Tab id="tab2">Tab 2</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel id="tab1">Content 1</Tabs.Panel>
      <Tabs.Panel id="tab2">Content 2</Tabs.Panel>
    </Tabs>
  );
}
```

### Disabled Tabs

```tsx
<Tabs defaultSelectedKey="active" aria-label="Example with disabled tab">
  <Tabs.List>
    <Tabs.Tab id="active">Active Tab</Tabs.Tab>
    <Tabs.Tab id="disabled" isDisabled>Disabled Tab</Tabs.Tab>
  </Tabs.List>

  <Tabs.Panel id="active">Active content</Tabs.Panel>
  <Tabs.Panel id="disabled">This won't be shown</Tabs.Panel>
</Tabs>
```

### Custom Styling

```tsx
<Tabs
  defaultSelectedKey="tab1"
  className="myCustomTabs"
  aria-label="Custom styled tabs"
>
  <Tabs.List className="myCustomTabList">
    <Tabs.Tab id="tab1" className="myCustomTab">Tab 1</Tabs.Tab>
    <Tabs.Tab id="tab2" className="myCustomTab">Tab 2</Tabs.Tab>
  </Tabs.List>

  <Tabs.Panel id="tab1" className="myCustomPanel">Content 1</Tabs.Panel>
  <Tabs.Panel id="tab2" className="myCustomPanel">Content 2</Tabs.Panel>
</Tabs>
```

## API

### Tabs Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultSelectedKey` | `Key` | - | The default selected tab (uncontrolled) |
| `selectedKey` | `Key` | - | The currently selected tab (controlled) |
| `onSelectionChange` | `(key: Key) => void` | - | Callback when tab selection changes |
| `aria-label` | `string` | - | Accessible label for the tabs |
| `className` | `string` | `''` | Custom CSS class |
| `children` | `ReactNode` | - | Tab list and panels |

### Tabs.List Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `aria-label` | `string` | - | Accessible label for the tab list |
| `className` | `string` | `''` | Custom CSS class |
| `children` | `ReactNode` | - | Tab items |

### Tabs.Tab Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | - | **Required.** Unique identifier for the tab |
| `isDisabled` | `boolean` | `false` | Whether the tab is disabled |
| `className` | `string` | `''` | Custom CSS class |
| `children` | `ReactNode` | - | Tab label content |

### Tabs.Panel Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | - | **Required.** Must match a tab's id |
| `className` | `string` | `''` | Custom CSS class |
| `children` | `ReactNode` | - | Panel content |

## Keyboard Navigation

- **Arrow Left/Right**: Navigate between tabs
- **Home**: Jump to first tab
- **End**: Jump to last tab
- **Tab**: Move focus in/out of tab list
- **Enter/Space**: Activate focused tab

## Accessibility

- Full ARIA support with `role="tablist"`, `role="tab"`, `role="tabpanel"`
- Keyboard navigation following WAI-ARIA best practices
- Focus management and visible focus indicators
- Screen reader announcements for tab changes
- Proper labeling with `aria-label` and `aria-labelledby`

## Styling

The component uses CSS modules with design tokens from Open Props:

- **Colors**: `--brand-primary`, `--text-2`, `--surface-2`, `--border-subtle`
- **Spacing**: `--size-*` tokens
- **Typography**: `--font-size-*`, `--font-weight-*`
- **Animation**: Smooth fade-in with `translateY` on panel change

### Data Attributes for Custom Styling

```css
/* Selected tab */
[data-selected="true"] { }

/* Disabled tab */
[data-disabled="true"] { }

/* Focused tab */
[data-focus-visible] { }

/* Hovered tab */
[data-hovered="true"] { }
```

## Examples in Codebase

- **GroupDetailsPage**: Details and Messages tabs
- **BackgroundFormWizard**: Multi-step form with wizard-style tabs

## Related Components

- **Tab**: Individual tab item (used internally)
- **TabPanel**: Individual panel (used internally)

## Notes

- Always provide an `aria-label` for accessibility
- Tab IDs must match between `Tabs.Tab` and `Tabs.Panel`
- Panels are automatically shown/hidden based on selected tab
- Mobile-friendly with horizontal scroll for many tabs
