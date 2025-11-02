# Types Directory

## Purpose

This directory contains all TypeScript interface and type definitions used throughout the Vineyard Group Fellowship frontend application. Centralizing types here ensures consistency, reusability, and maintainability across the codebase.

## Structure

```
types/
├── index.ts              # Main export file - re-exports all types
├── components/           # Component props interfaces
│   └── index.ts
├── hooks/                # Custom hook interfaces
│   └── index.ts
├── utils/                # Utility function interfaces
│   └── index.ts
└── group.ts              # Group-related types
```

## Files Overview

### `index.ts`
Main entry point that re-exports all type definitions. Import types from here rather than individual files.

### `components/`
Interface definitions for all component props including:
- Avatar, Header, Footer
- Dashboard components
- Card components
- Modal components
- Form components

### `hooks/`
Type definitions for custom hooks including:
- API hook return types
- Hook parameter interfaces
- Hook response structures

### `utils/`
Interface definitions for utility functions including:
- Error logging types
- Helper function interfaces
- Common utility types

### `group.ts`
Types related to group functionality including:
- Group data structures
- Membership information
- Group member types

## Usage Guidelines

### ✅ DO

```typescript
// Import from centralized types
import type { AvatarProps, GroupMemberCardProps } from 'types';

// Use existing types instead of creating duplicates
import type { User } from 'types';
```

### ❌ DON'T

```typescript
// Don't define interfaces inline in components
interface MyComponentProps { ... }

// Don't duplicate type definitions
interface User { ... }  // Already exists in types/

// Don't import from deep paths
import type { AvatarProps } from 'types/components';
```

## Best Practices

1. **Single Source of Truth**: All type definitions should live in this directory
2. **Import from Index**: Always import from `types` or `types/[subdirectory]`, not individual files
3. **Naming Conventions**:
   - Component props: `[ComponentName]Props`
   - Hook returns: `[HookName]Return`
   - API responses: `[Entity]Response`
4. **Shared Types**: If a type is used in multiple places, it belongs here
5. **Documentation**: Add JSDoc comments for complex types

## Migration Notes

When moving existing interfaces to this directory:
1. Move the interface definition to the appropriate subdirectory
2. Export it from the subdirectory's `index.ts`
3. Update imports in the original file to use `types`
4. Remove the local interface definition

## Type Organization

- **Component Props** → `types/components/`
- **API Responses** → `types/` (group.ts, etc.)
- **Hook Interfaces** → `types/hooks/`
- **Utility Types** → `types/utils/`
- **Global Types** → `types/` (root level)
