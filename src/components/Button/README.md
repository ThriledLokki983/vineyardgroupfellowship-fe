# Custom Button Component

A reusable Button component based on React Aria Components with consistent styling across the app. Supports both button and link functionality.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'tertiary'` | `'primary'` | Button style variant |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Button size |
| `isFullWidth` | `boolean` | `false` | Whether button takes full width |
| `className` | `string` | `''` | Additional CSS class |
| `href` | `string` | `undefined` | URL for link functionality |
| `external` | `boolean` | `false` | If true, opens external links in new tab |

## Variants

### Primary
- **Use for**: Main actions, form submissions, primary navigation
- **Style**: Filled with brand primary color
- **Example**: Submit buttons, CTA buttons, main navigation links

### Secondary
- **Use for**: Secondary actions, alternative choices
- **Style**: Outlined with brand primary color
- **Example**: Cancel buttons, alternative actions

### Tertiary
- **Use for**: Minor actions, navigation links
- **Style**: Text-only with underline
- **Example**: "Forgot Password?", "Learn More"

## Usage Examples

### Button Usage
```tsx
// Primary submit button
<Button variant="primary" size="large" type="submit" isFullWidth>
  Sign In
</Button>

// Secondary action
<Button variant="secondary" size="medium" onPress={handleCancel}>
  Cancel
</Button>

// Tertiary action
<Button variant="tertiary" size="small" onPress={handleLearnMore}>
  Learn More
</Button>
```

### Link Usage
```tsx
// Internal navigation link (uses React Router)
<Button variant="primary" href="/dashboard">
  Go to Dashboard
</Button>

// External link (opens in new tab)
<Button variant="secondary" href="https://example.com" external>
  Visit Website
</Button>

// Navigation link with tertiary style
<Button variant="tertiary" href="/forgot-password">
  Forgot Password?
</Button>
```

### Advanced Examples
```tsx
// Full-width navigation button
<Button
  variant="primary"
  href="/supporter-background"
  size="large"
  isFullWidth
>
  Complete Background Setup →
</Button>

// External link button with custom styling
<Button
  variant="secondary"
  href="https://docs.example.com"
  external
  className="customClass"
>
  Read Documentation
</Button>
```

## Migration from old buttons

Replace React Aria Button imports and custom button classes:

```tsx
// Old way
import { Button } from 'react-aria-components'
<Button className={styles.submitButton}>Submit</Button>

// New way
import Button from '../components/Button'
<Button variant="primary" size="large">Submit</Button>
```

## Focus & Accessibility

Focus styles are handled globally and automatically applied to all button variants. The component inherits all React Aria accessibility features including:

- Keyboard navigation
- Screen reader support
- Focus management
- ARIA attributes