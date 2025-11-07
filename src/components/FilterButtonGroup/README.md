# FilterButtonGroup Component

A reusable button-based filter/sort control component that provides a clean, accessible alternative to select dropdowns.

## Features

- **Accessible**: Proper button semantics with clear visual states
- **Type-safe**: Full TypeScript support with generic types
- **Flexible**: Supports icons alongside labels
- **Reusable**: Used across multiple features (Browse Groups, Discussions)
- **Responsive**: Buttons wrap gracefully on smaller screens

## Usage

```tsx
import { FilterButtonGroup } from 'components';
import type { FilterOption } from 'components';
import { Icon } from 'components';

type SortOption = 'recent' | 'popular' | 'oldest';

const sortOptions: FilterOption<SortOption>[] = [
  {
    value: 'recent',
    label: 'Most Recent',
    icon: <Icon name="ClockIcon" size={16} />,
  },
  {
    value: 'popular',
    label: 'Most Popular',
    icon: <Icon name="StarIconFill" size={16} />,
  },
  {
    value: 'oldest',
    label: 'Oldest First',
    icon: <Icon name="CalendarIcon" size={16} />,
  },
];

function MyComponent() {
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  return (
    <FilterButtonGroup
      label="Sort by:"
      options={sortOptions}
      value={sortBy}
      onChange={setSortBy}
    />
  );
}
```

## Props

### `FilterButtonGroupProps<T>`

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `label` | `string` | Yes | Label text displayed above the button group |
| `options` | `FilterOption<T>[]` | Yes | Array of filter options |
| `value` | `T` | Yes | Currently selected value |
| `onChange` | `(value: T) => void` | Yes | Callback when selection changes |
| `className` | `string` | No | Additional CSS class names |

### `FilterOption<T>`

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `value` | `T` | Yes | Unique value for this option |
| `label` | `string` | Yes | Display text for the button |
| `icon` | `ReactNode` | No | Optional icon to display before the label |

## Examples

### Simple Text Buttons

```tsx
const statusOptions: FilterOption<'all' | 'active' | 'archived'>[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'archived', label: 'Archived' },
];

<FilterButtonGroup
  label="Status:"
  options={statusOptions}
  value={status}
  onChange={setStatus}
/>
```

### Buttons with Icons

```tsx
const locationOptions: FilterOption<LocationType>[] = [
  { value: 'all', label: 'All' },
  { value: 'in_person', label: 'In-Person', icon: <Icon name="LocationIcon" size={16} /> },
  { value: 'virtual', label: 'Virtual', icon: <Icon name="PhoneIcon" size={16} /> },
  { value: 'hybrid', label: 'Hybrid', icon: <Icon name="MeetingIcon" size={16} /> },
];

<FilterButtonGroup
  label="Location Type:"
  options={locationOptions}
  value={locationType}
  onChange={setLocationType}
/>
```

## Styling

The component uses SCSS modules with design tokens from the global design system:

- **Active state**: Uses `@include base` mixin with brand color border
- **Hover state**: Brand color border with lighter background
- **Spacing**: Consistent with 4pt spacing system
- **Typography**: Uses Open Props size and weight tokens
- **Colors**: Uses design system color variables

## Accessibility

- Proper `<button>` elements for keyboard navigation
- Clear visual states for active/hover/focus
- Label associated with button group
- Icons use appropriate sizing for legibility

## Design Philosophy

This component replaces traditional select dropdowns with a more intuitive button-based approach:

- **Visual clarity**: All options visible at once
- **No hidden states**: Users can see what's available without clicking
- **Better mobile UX**: Buttons are easier to tap than dropdown options
- **Consistent patterns**: Reusable across filtering and sorting scenarios

## Related Components

- **BrowseGroupsModal**: Uses for location type filtering
- **DiscussionList**: Uses for discussion sorting
