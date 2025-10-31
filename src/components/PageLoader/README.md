# PageLoader Component

Loading fallback component for lazy-loaded routes and async operations.

## Features

- **Centered Spinner**: Clean, animated spinner with brand colors
- **Loading Text**: Accessible "Loading..." text for screen readers
- **Responsive**: Works on all screen sizes
- **Branded**: Uses Open Props design tokens for consistency

## Usage

### With React Router (Lazy Loading)

```tsx
import { lazy, Suspense } from 'react';
import { PageLoader } from '../components/PageLoader';

const SomePage = lazy(() => import('./SomePage'));

<Suspense fallback={<PageLoader />}>
  <SomePage />
</Suspense>
```

### With Code Splitting

```tsx
import { PageLoader } from '../components/PageLoader';

function App() {
  if (isLoading) {
    return <PageLoader />;
  }

  return <div>Content</div>;
}
```

## Design

- **Min Height**: 400px to prevent layout shift
- **Spinner Size**: 48px × 48px
- **Animation**: 0.8s linear infinite rotation
- **Colors**:
  - Border: `--border-subtle` (#DAD5CF)
  - Active: `--brand-primary` (#3A4F41)
  - Text: `--text-secondary` (#6E7673)

## Accessibility

- Semantic HTML structure
- Color contrast meets WCAG AA
- Loading text is screen-reader accessible
- Animation can be disabled via `prefers-reduced-motion`

## Performance

- Minimal CSS (no external dependencies)
- Pure CSS animation (no JavaScript)
- Lazy-loaded with routes (not in main bundle)
