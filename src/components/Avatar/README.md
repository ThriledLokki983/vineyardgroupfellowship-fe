# Avatar Component

A circular avatar component for displaying user/member profile pictures or initials.

## Features

- ✅ **Image support** - Displays profile photo when available
- ✅ **Initials fallback** - Shows initials when no image
- ✅ **External user indicator** - Special icon for external members
- ✅ **Customizable size** - Flexible sizing with CSS variable
- ✅ **Lazy loading** - Images load lazily for performance
- ✅ **Responsive** - Scales properly at any size
- ✅ **Accessible** - Proper alt text and semantic HTML

## Usage

```tsx
import { Avatar } from 'components';

// With image
<Avatar
  profile={{
    image: 'https://...',
    name: 'John Doe',
    initials: 'JD'
  }}
  size="48px"
/>

// With initials only
<Avatar
  profile={{
    initials: 'JD',
    display_name: 'John Doe'
  }}
  size={64}
/>

// Numeric size (converted to px)
<Avatar
  profile={member}
  size={32}
/>
```

## Props

### `profile` (AvatarProfile)
User/member profile information:
- `image` or `photo_url` - Profile picture URL
- `name` or `display_name` - Display name for alt text
- `initials` - Fallback initials (sanitized automatically)
- `is_external` - Shows icon for external users

### `size` (string | number, default: '32px')
Avatar size. Can be:
- String with units: `'48px'`, `'3rem'`, `'100%'`
- Number (converted to px): `32`, `64`, `128`

### Other Props
Accepts all standard `HTMLSpanElement` attributes via spread props.

## Design

### Styling
- **Circular** - Perfect circle with `border-radius: 50%`
- **Subtle border** - 1px border for better definition
- **Centered content** - Flexbox centering for initials/icons
- **Background** - Uses `--surface-elevated` token
- **Font sizing** - Automatically scales text to ~40% of avatar size

### States
- **With image** - Displays full-size photo
- **Without image** - Shows initials in uppercase
- **External user** - Shows AvatarIcon instead of initials

### Image Handling
- Uses `normalizeImageUrl` from utils to handle URL formatting
- Supports both `image` and `photo_url` fields
- Lazy loading enabled for performance
- Object-fit cover to prevent distortion

## Examples

### Small Avatar (32px)
```tsx
<Avatar profile={user} size={32} />
```

### Medium Avatar (48px) - Default for cards
```tsx
<Avatar profile={member} size="48px" />
```

### Large Avatar (64px+) - Profile headers
```tsx
<Avatar profile={user} size="64px" />
```

### Extra Large (128px) - Profile pages
```tsx
<Avatar profile={user} size={128} />
```

## CSS Variables

The component sets `--avatar-size` internally based on the `size` prop:
```css
.root {
  width: var(--avatar-size);
  height: var(--avatar-size);
  font-size: calc(var(--avatar-size) / 2.5);
}
```

## Integration

Works seamlessly with:
- **ContactCard** - Hover cards for member info
- **GroupMemberCard** - Member list displays
- **ProfileCard** - User profile displays
- **Header** - User menu/navigation

## Accessibility

- ✅ Proper `alt` text from display name
- ✅ Semantic HTML structure
- ✅ No interactive elements (unless wrapped)
- ✅ High contrast initials
- ✅ Screen reader friendly

## Performance

- Lazy image loading
- Memoized URL normalization
- Efficient re-renders with useMemo
- No unnecessary DOM updates
