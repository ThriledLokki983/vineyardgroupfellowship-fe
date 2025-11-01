# BrowseGroupsModal Component

A modal component for browsing and searching available fellowship groups. Matches the design pattern of the CreateGroupModal with a focus on discovery and filtering.

## Features

### Search & Filter
- **Text Search**: Search by group name, description, or location
- **Location Type Filter**: Filter by In-Person, Virtual, or Hybrid meetings
- **Toggle Filters**:
  - Open groups only
  - Available spots only
- **Reset Filters**: Clear all filters with one click

### Group Cards
Each group card displays:
- Group name and status badges (Closed, Full, spots remaining)
- Description (truncated to 120 characters)
- Location type with appropriate icon
- Meeting location
- Meeting time
- Member count (current/limit)

### Actions
- Click on any group card to navigate to group details page
- Modal automatically closes on navigation
- Clean close button to dismiss without action

## Usage

```tsx
import { BrowseGroupsModal } from 'components';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Browse Groups
      </button>

      <BrowseGroupsModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `isOpen` | boolean | Yes | Controls modal visibility |
| `onClose` | () => void | Yes | Callback when modal should close |

## Data Fetching

The modal uses TanStack Query to fetch groups:
- Query key: `['groups', 'browse']`
- Only fetches when modal is open (`enabled: isOpen`)
- Uses the `listGroups()` API function from `services/groupApi`

## Filtering Logic

Filters are applied in this order:
1. **Text search** - Case-insensitive search across name, description, location
2. **Location type** - Exact match for in_person, virtual, or hybrid
3. **Open only** - Filters out closed groups
4. **Available spots** - Filters out groups with 0 available spots

All filters work together (AND logic).

## States

### Loading State
Shows loading spinner and "Loading groups..." message.

### Error State
Shows error icon and "Failed to load groups" message if fetch fails.

### Empty State
Shows empty icon and "No groups found" message when no groups match filters.
Includes button to clear filters.

## Design Tokens

Follows the same design system as CreateGroupModal:
- **Max width**: 900px (larger than create modal for better card display)
- **Min height**: 600px
- **Border radius**: `var(--radius-2)` for inputs, `var(--radius-3)` for cards
- **Spacing**: 4pt system using Open Props size tokens
- **Colors**: Brand primary for active states, accent colors for badges

## Responsive Behavior

### Mobile (<768px)
- Filters stack vertically
- Meta items in cards displayed in single column
- Reduced padding

### Tablet (768-1024px)
- Default 2-column grid for filter buttons
- Cards maintain full width

### Desktop (>1024px)
- Full filter layout with wrapping
- Optimal card display with hover effects

## Accessibility

- Semantic HTML structure
- Keyboard navigation support through React Aria Button
- Focus management handled by Modal component
- Screen reader friendly labels
- Clear search button with aria-label

## Performance

- Uses `useMemo` for filtered results to prevent unnecessary recalculations
- Query enabled only when modal is open
- Efficient list rendering (no virtualization needed for typical group counts)

## Integration

Used in:
- GroupMemberDashboard (all states: first-visit, active, returning)
- Any component where users need to discover and join groups

## Future Enhancements

- [ ] Sort options (alphabetical, newest, most members, etc.)
- [ ] Pagination for large group lists
- [ ] Save favorite groups
- [ ] Advanced filters (meeting day, focus areas, member limit range)
- [ ] Map view for in-person groups
- [ ] Group recommendations based on user profile
