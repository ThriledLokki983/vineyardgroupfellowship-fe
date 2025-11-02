# Configs Directory

## Purpose

This directory contains centralized configuration files that define application-wide constants, API endpoints, routing, and utility functions used throughout the Vineyard Group Fellowship frontend.

## Files Overview

### `api-configs.ts`
Defines the base API configuration and endpoint URLs. Handles environment-specific settings to determine whether to use local development endpoints or production endpoints based on environment variables.

### `api-endpoints.ts`
Contains all API endpoint paths organized by domain (authentication, user management, groups, etc.). This provides a single source of truth for all backend API routes, making it easy to update endpoints across the entire application.

### `constants.ts`
Houses application-wide constants including:
- Recovery approach options
- Faith tradition choices
- Religious content preferences
- Profile visibility settings
- User role definitions
- Other enums and constant values

These constants ensure consistency across forms, validation, and UI components.

### `hooks-interfaces.ts`
TypeScript interfaces and type definitions for:
- User profiles and authentication state
- API response structures
- Hook return types
- Shared data models

This file acts as the central type registry for data structures used across multiple components and hooks.

### `paths.ts`
Application route path constants. Defines all frontend navigation routes in one place, making it easy to:
- Update route paths without searching the entire codebase
- Ensure consistent navigation throughout the app
- Provide TypeScript autocomplete for route strings

### `routes.tsx`
The main routing configuration using React Router v7. Defines:
- Route structure and hierarchy
- Lazy-loaded page components
- Protected route wrappers
- Error boundaries per route

### `config-utils.ts`
Utility functions for working with configuration data, such as formatting options, validating settings, and transforming config values for use in components.

## Usage Guidelines

- **Import from configs**: Always import configuration values, endpoints, and types from this directory rather than hardcoding them
- **Single source of truth**: When adding new constants or endpoints, add them here first
- **Type safety**: Use the interfaces from `hooks-interfaces.ts` to ensure type safety across the application
- **Environment awareness**: Leverage the environment detection in `api-configs.ts` for seamless dev/prod transitions

## Best Practices

✅ **DO**: Import constants and types from this directory
✅ **DO**: Update endpoint definitions here when backend routes change
✅ **DO**: Add new enums and constants to `constants.ts`

❌ **DON'T**: Hardcode API URLs in components
❌ **DON'T**: Duplicate type definitions elsewhere
❌ **DON'T**: Define routes directly in components
