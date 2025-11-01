# Create Group Modal - Usage Guide

## Overview

The `CreateGroupModal` component provides a comprehensive form for creating new fellowship groups. It's integrated with the backend API and includes full validation using Zod schemas.

## Features

- ✅ Full form validation with Zod
- ✅ Real-time error feedback
- ✅ Support for all group properties from backend API
- ✅ Focus areas tagging system
- ✅ Meeting schedule configuration
- ✅ Member limit and visibility settings
- ✅ Loading states and error handling
- ✅ Responsive design
- ✅ Toast notifications on success/error

## Usage

### Basic Implementation

```tsx
import { useState } from 'react';
import { CreateGroupModal } from 'components';

function MyComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>
        Create New Group
      </button>

      <CreateGroupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
```

### In Group Leader Dashboard

```tsx
import { CreateGroupModal } from 'components';

export const GroupLeaderDashboard = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div>
      <button onClick={() => setShowCreateModal(true)}>
        <Icon name="PlusIcon" />
        Create Group
      </button>

      <CreateGroupModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
};
```

## Form Fields

### Required Fields
- **Group Name** - String (max 200 chars)

### Optional Fields
- **Description** - Text area for group description
- **Meeting Type** - Dropdown: `in_person`, `virtual`, `hybrid`
- **Location** - String (max 255 chars)
- **Meeting Day** - Dropdown: `monday` through `sunday`
- **Meeting Time** - Time picker (HH:MM format)
- **Meeting Frequency** - Dropdown: `weekly`, `biweekly`, `monthly`
- **Member Limit** - Number (2-100, default: 12)
- **Focus Areas** - Dynamic tag input (array of strings)
- **Visibility** - Dropdown: `public`, `community`, `private`
- **Open for Members** - Checkbox (default: true)

## API Integration

The modal automatically:
1. Validates form data with Zod schema
2. Sends POST request to `/api/v1/groups/`
3. Handles success with toast notification
4. Invalidates TanStack Query cache to refresh group lists
5. Handles errors with user-friendly messages

### Required Permissions

Users must have `leadership_info.can_lead_group: true` to create groups. The backend will return a 400 error if this permission is missing.

## Validation Rules

Based on `createGroupSchema.ts`:

```typescript
{
  name: required, max 200 chars
  description: optional
  location: optional, max 255 chars
  location_type: optional, enum
  member_limit: optional, 2-100, default 12
  is_open: optional, boolean, default true
  meeting_day: optional, enum
  meeting_time: optional, HH:MM:SS format
  meeting_frequency: optional, enum
  focus_areas: optional, array
  visibility: optional, enum, default 'public'
}
```

## Styling

The component uses SCSS modules with design tokens:
- Follows app theme (brand colors, spacing, typography)
- Responsive design with mobile-first approach
- Uses form mixins for consistent input styling
- Supports dark/light mode through CSS variables

## State Management

- **Local state** for form data and validation errors
- **TanStack Query** for API mutations
- **Toast notifications** for user feedback
- Auto-closes and resets on success

## Error Handling

### Validation Errors
- Inline field-level errors
- Toast notification for form-level issues

### API Errors
- Permission errors (no leadership permission)
- Network errors
- Server errors
- Custom backend validation errors

## Example Backend Response

### Success (201 Created)
```json
{
  "id": "uuid",
  "name": "Young Adults Fellowship",
  "member_limit": 12,
  "current_member_count": 1,
  "leader_info": {...},
  "user_membership": {
    "role": "leader",
    "status": "active"
  },
  ...
}
```

### Error (400 Bad Request)
```json
{
  "detail": "You do not have permission to create groups. Please complete leadership onboarding first."
}
```

## Testing the Modal

1. User must be logged in
2. User must have `leadership_info.can_lead_group: true`
3. Click "Create Group" button
4. Fill in at least the group name
5. Submit to create the group

## Future Enhancements

- [ ] Multi-step wizard for complex forms
- [ ] Image upload for group photo
- [ ] Draft saving
- [ ] Template groups
- [ ] Bulk import from CSV
- [ ] Group cloning feature

## Related Components

- `Modal` - Base modal component
- `Button` - Form actions
- `Icon` - UI icons
- `Toast` - Notifications

## Related Files

- `src/components/CreateGroupModal/CreateGroupModal.tsx`
- `src/components/CreateGroupModal/CreateGroupModal.module.scss`
- `src/schemas/createGroupSchema.ts`
- `src/types/group.ts`
- `src/services/groupApi.ts`
- `src/configs/api-endpoints.ts`
