# Modal Component

A reusable modal component built with React Aria Components that provides accessible modal dialogs with proper focus management.

## Features

- ✅ **Accessible**: Built with React Aria for WCAG compliance
- ✅ **Focus Management**: Automatic focus trapping and restoration
- ✅ **Keyboard Navigation**: Escape key support and keyboard dismiss options
- ✅ **Click Outside**: Optional click-outside-to-close functionality
- ✅ **Animations**: Smooth enter/exit animations
- ✅ **Responsive**: Mobile-friendly with multiple size variants
- ✅ **Customizable**: Flexible styling with SCSS modules

## Usage

### Basic Modal

```tsx
import { Modal } from 'components/Modal';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="My Modal"
    >
      <p>Modal content goes here</p>
    </Modal>
  );
}
```

### Advanced Configuration

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Custom Modal"
  size="lg"
  isDismissable={true}
  isKeyboardDismissDisabled={false}
  showCloseButton={true}
  className="my-custom-modal"
  id="custom-modal-id"
>
  <div>
    <p>Custom content</p>
    <button>Action Button</button>
  </div>
</Modal>
```

### Without Title (Custom ARIA Label)

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  aria-label="Settings dialog"
  showCloseButton={false}
>
  <h2>Custom Settings</h2>
  <p>Content without using the built-in title</p>
</Modal>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | - | Whether the modal is open *(required)* |
| `onClose` | `() => void` | - | Called when modal should close *(required)* |
| `title` | `string` | - | Modal title (creates accessible heading) |
| `children` | `React.ReactNode` | - | Modal content *(required)* |
| `isDismissable` | `boolean` | `true` | Whether clicking outside closes modal |
| `isKeyboardDismissDisabled` | `boolean` | `false` | Whether escape key closes modal |
| `showCloseButton` | `boolean` | `true` | Whether to show close button |
| `className` | `string` | - | Custom CSS class for modal |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'fullscreen'` | `'md'` | Modal size variant |
| `aria-label` | `string` | - | ARIA label when no title provided |
| `id` | `string` | - | ID for the dialog element |

## Size Variants

- **`sm`**: 400px max width - for simple confirmations
- **`md`**: 500px max width - default for most dialogs
- **`lg`**: 700px max width - for forms and detailed content
- **`xl`**: 900px max width - for complex interfaces
- **`fullscreen`**: Full viewport - for immersive experiences

## Accessibility

This component follows WCAG 2.1 AA guidelines:

- ✅ Focus is trapped within the modal when open
- ✅ Focus returns to trigger element when closed
- ✅ Escape key closes modal (unless disabled)
- ✅ Content behind modal is hidden from screen readers
- ✅ Proper ARIA roles and labels
- ✅ Keyboard navigation support

## Styling

The component uses SCSS modules with CSS custom properties from our design system:

```scss
// Override modal styles
.myCustomModal {
  .modal {
    background: var(--surface-elevated);
    border: 2px solid var(--accent-warm);
  }

  .title {
    color: var(--brand-primary);
  }
}
```

## Animation

Entry and exit animations are included by default:

- **Overlay**: Fade in/out
- **Modal**: Scale and slide up/down

Animations respect `prefers-reduced-motion` settings.

## Related Components

- **OnboardingModal**: Pre-built onboarding flow modal
- **Button**: For modal triggers and actions
- **Icon**: For close buttons and decorative elements