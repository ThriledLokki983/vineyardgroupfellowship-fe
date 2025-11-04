# DashboardCard Component

A minimal, reusable card component for displaying key information on the Vineyard Group Fellowship dashboard. Follows the wellness-focused design aesthetic with soft colors, generous spacing, and optional illustrations.

## Features

- **Minimal Design**: Clean layout with soft shadows and rounded corners
- **Flexible Content**: Supports title, icon, message, illustration, and action button
- **Two Variants**: Default and accent (highlighted) styles
- **Responsive**: Adapts to mobile, tablet, and desktop screens
- **Accessible**: Semantic HTML with proper button elements
- **Smooth Animations**: Hover effects and transitions for better UX

## Usage

```tsx
import DashboardCard from '@/components/DashboardCard';

<DashboardCard
  title="Your Journey"
  icon="🌱"
  illustration={<span style={{ fontSize: '64px' }}>📊</span>}
  message="14 days clean • 3 goals in progress"
  actionLabel="View Progress"
  onAction={() => console.log('Navigate to progress')}
  variant="default"
/>
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `string` | ✅ | - | Card title displayed in header |
| `icon` | `ReactNode` | ✅ | - | Small icon displayed in header circle |
| `message` | `string` | ✅ | - | Main content text |
| `actionLabel` | `string` | ❌ | - | Label for action button |
| `onAction` | `() => void` | ❌ | - | Click handler for action button |
| `variant` | `'default' \| 'accent'` | ❌ | `'default'` | Visual variant (accent adds warm gradient) |
| `illustration` | `ReactNode` | ❌ | - | Large illustration above content (emoji or SVG) |

## Variants

### Default
Standard card with elevated background color (`--surface-elevated`)

### Accent
Highlighted card with warm gradient background, perfect for primary CTAs or important information

## Design Tokens Used

- Colors: `--surface-elevated`, `--brand`, `--text-primary`, `--text-secondary`, `--accent-warm`
- Spacing: `--size-2` through `--size-6` (4pt system)
- Border radius: `--radius-2`, `--radius-3`
- Typography: `--font-size-0` through `--font-size-5`, `--font-weight-4`, `--font-weight-6`
- Animation: `--animation-duration-fast`

## Responsive Behavior

- **Mobile (<768px)**: Single column, smaller illustration, reduced padding
- **Tablet (768px-1024px)**: 2 columns in grid
- **Desktop (>1024px)**: 4 columns in grid

## Empty State Pattern

Cards adapt their message based on user state:

```tsx
// First-time user
message="You haven't logged any activity yet. Start your journey!"

// Active user
message="14 days clean • 3 goals in progress"
```

## Accessibility

- Semantic `<button>` elements for actions
- Proper heading hierarchy with `<h3>` for titles
- High contrast text colors
- Keyboard navigable
- Screen reader friendly

## Related Components

- **SeekerDashboard**: Uses DashboardCard in grid layout
- **Layout**: Provides page-level container
- **Icon**: Can be used for icon prop

## Examples

### Journey Card (Default)
```tsx
<DashboardCard
  title="Your Journey"
  icon="🌱"
  illustration={<span style={{ fontSize: '64px' }}>📊</span>}
  message="14 days clean • 3 goals in progress"
  actionLabel="View Progress"
  onAction={() => navigate('/progress')}
/>
```

### Goals Card (Accent - Call to Action)
```tsx
<DashboardCard
  title="Goals"
  icon="🎯"
  illustration={<span style={{ fontSize: '64px' }}>✨</span>}
  message="Set your first goal to begin tracking progress."
  actionLabel="Create Goal"
  onAction={() => navigate('/goals/new')}
  variant="accent"
/>
```

### Community Card (No Action)
```tsx
<DashboardCard
  title="Community"
  icon="🤝"
  illustration={<span style={{ fontSize: '64px' }}>💬</span>}
  message="No new posts in your group."
/>
```

## Design Philosophy

Following Vineyard Group Fellowship's premium wellness aesthetic:
- **Calm & Minimal**: No visual noise, just essential information
- **Warm & Supportive**: Soft colors (Bone White, Warm Fog, Soft Amber)
- **Generous Spacing**: 4pt system with ample breathing room
- **Subtle Motion**: Gentle hover effects, no jarring animations
- **Healing Focus**: Psychologically comforting design choices
