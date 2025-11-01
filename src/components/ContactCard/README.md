# ContactCard Component

A hover card component for displaying member contact information in the Vineyard Group Fellowship app.

## Overview

The ContactCard is a floating card that appears on hover, showing detailed contact information for a group member. It's designed specifically for the recovery/wellness context of the app.

## Features

- ✅ **Hover activation** - Appears when hovering over Avatar components
- ✅ **Smart positioning** - Automatically adjusts to stay within viewport
- ✅ **Contact information** - Email, phone, role, status
- ✅ **Bio display** - Optional member bio/about section
- ✅ **Recovery context** - Shows purpose (supporter/recovery seeker)
- ✅ **Navigation support** - Optional back navigation for viewing related contacts
- ✅ **Smooth transitions** - Animated data swapping between contacts
- ✅ **Accessibility** - Proper semantic HTML and ARIA support
- ✅ **Premium design** - Follows wellness aesthetic with Open Props

## Usage

```tsx
import { ContactCard } from 'components';

<ContactCard
  data={{
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    phone_number: '555-1234',
    photo_url: 'https://...',
    role: 'leader',
    status: 'active',
    bio: 'Passionate about supporting recovery journey...',
    purpose: 'supporter'
  }}
  hasParentFocus={isHovering}
  showActions={true}
/>
```

## Props

### `data` (ContactCardData)
Member information to display:
- `first_name`, `last_name`, `display_name`, `name` - Name fields (flexible)
- `email` - Email address (required for actions)
- `phone_number` - Phone number (optional)
- `photo_url`, `image` - Avatar image URL
- `initials` - Fallback initials for avatar
- `role` - Member role: `'leader' | 'co_leader' | 'member'`
- `status` - Member status: `'active' | 'pending' | 'inactive'`
- `bio` - Optional bio/about text
- `purpose` - User purpose: `'supporter' | 'seeker'`

### `hasParentFocus` (boolean)
Controls visibility based on parent hover state. Typically controlled by Avatar component hover.

### `showActions` (boolean, default: true)
Whether to show action buttons (e.g., "Send Message").

### `enableNavigation` (boolean, default: false)
Enables navigation between related contacts with back button support. When enabled:
- Allows swapping to view different contact data
- Shows BackLink to return to original contact
- Includes smooth transition animations
- Useful for viewing related members (e.g., group leader's co-leaders)

## Design Features

### Layout
- **320px wide** card with responsive max-width
- **Smart positioning** - Adjusts to stay in viewport
- **Elevated surface** with shadow and subtle border
- **Rounded corners** (16px radius)

### Styling
- **Role badges** - Color-coded by role type
  - Leader: Brand primary background
  - Co-Leader: Accent warm background
  - Member: Neutral background

- **Status indicators** - Color-coded status badges
  - Active: Green
  - Pending: Orange
  - Inactive: Gray

- **Bio section** - Highlighted with left border accent

### Interactions
- **Smooth transitions** - Fade in/out on hover
- **Hover effects** - Action buttons lift on hover
- **Link styling** - Underline on hover for accessibility

## Integration with Avatar

The ContactCard is designed to work with the Avatar component:

```tsx
<div onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
  <Avatar profile={member} size="48px" />
  <ContactCard data={member} hasParentFocus={hovering} />
</div>
```

## Accessibility

- ✅ Semantic HTML structure
- ✅ Proper heading hierarchy
- ✅ Link accessibility with focus states
- ✅ Keyboard navigable actions
- ✅ Screen reader friendly

## Removed Features

Compared to the original corporate version, we removed:
- ❌ Office/department information
- ❌ Line of service details
- ❌ Assistant management
- ❌ Chat service integration (Teams/Google)
- ❌ Country/location details
- ❌ Back navigation between contacts

These were replaced with recovery/wellness-appropriate features like bio, purpose, and simpler contact actions.

## Design Philosophy

The ContactCard follows the Vineyard Group Fellowship premium wellness aesthetic:
- Warm, inviting colors
- Generous spacing
- Clean typography
- Subtle shadows and borders
- Healing-focused visual language
