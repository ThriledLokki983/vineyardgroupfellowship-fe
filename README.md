# Vineyard Group Fellowship - Frontend

**Modern React 19 application for church fellowship and community connection**

A premium, accessibility-first web application built with React 19, TypeScript, and modern tooling. Designed to connect church members to local fellowship groups for Bible study, discipleship, and doing life together.

---

## 🌟 Overview

The Vineyard Group Fellowship frontend provides:

- **Group Management**: Create, join, and manage fellowship groups
- **Location-Based Matching**: Find groups near your residence for convenient weekly meetings
- **User Dashboards**: Role-based dashboards for group members and leaders
- **Profile Management**: Comprehensive user profiles with location and preferences
- **Authentication**: Secure session-based authentication with CSRF protection
- **Accessibility**: WCAG 2.1 AA compliant with React Aria Components
- **Premium UI**: Clean, modern design with sophisticated community-focused aesthetic

### What is Vineyard Group Fellowship?

Vineyard Group Fellowship helps church members:
- **Connect Locally**: Find and join small groups near their residence
- **Meet Weekly**: Participate in regular Bible study and fellowship gatherings
- **Do Life Together**: Build meaningful relationships through shared faith and community
- **Follow Programs**: Engage in structured study programs and discipleship materials
- **Lead & Serve**: Facilitate groups and serve the church community

---

## 🛠 Tech Stack

### Core Technologies
- **React 19.1.1** - Modern concurrent features with transitions
- **TypeScript 5.9** - Strict mode with comprehensive type safety
- **Vite 7.1.7** - Fast builds with SWC compiler
- **React Router 7.9.3** - Data Router APIs for navigation

### State Management
- **Preact Signals** - Local/page state management
- **TanStack Query 5.90** - Server state management with caching

### UI & Styling
- **React Aria Components** - Accessible, unstyled UI primitives
- **SCSS Modules** - Component-scoped styling
- **Open Props** - Consistent design tokens (4pt spacing system)

### Additional Libraries
- **Zod 4.1.12** - Type-safe schema validation
- **Google Maps API** - Location autocomplete (@vis.gl/react-google-maps)
- **Axios & Fetch** - HTTP client (standardization in progress)
- **DOMPurify** - XSS protection for user-generated content

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: 20.19+ or 22.12+
- **Yarn**: Modern Yarn (Berry) or Classic
- **Backend API**: Django backend running locally or on Railway

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd frontend

# Install dependencies
yarn install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys and configuration
```

### Environment Configuration

Create a `.env` file in the root directory:

```properties
# API Configuration
VITE_USE_LOCAL_ENDPOINT=true  # Use false for production
VITE_LOCAL_API_ENDPOINT=http://localhost:8000/api
VITE_PRODUCTION_API_ENDPOINT=https://your-backend.railway.app/api

# Google Maps API (required for location features)
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key-here

# Optional: Server-side Google API key
GOOGLE_CREDENTIAL_API_KEY=your-credential-api-key-here
```

**⚠️ Security Note**: Never commit `.env` files to Git. The `.env.example` file provides a template with placeholder values only.

### Development

```bash
# Start development server (port 3000)
yarn dev

# Run ESLint
yarn lint

# Type check without building
yarn build --noEmit

# Build for production
yarn build

# Preview production build
yarn preview
```

Development server runs on **http://localhost:3000** (standardized across environments).

---

## 📁 Project Structure

```
src/
├── main.tsx              # Entry point with providers (QueryClient, Router)
├── App.tsx               # Root layout component
├── components/           # Reusable UI components
│   ├── ConfigurableForm/ # Generic form system with Zod validation
│   ├── Layout/           # Page layout with variants (default, centered, fullscreen)
│   ├── Modal/            # Accessible modal components
│   ├── Authentication/   # Auth-related components
│   └── ...
├── pages/                # Route components (lazy loaded)
│   ├── Auth/             # Login, Registration, Password Reset
│   ├── Dashboard/        # Role-based dashboards
│   ├── Profile/          # User profile and settings
│   └── ...
├── hooks/                # Custom React hooks
│   ├── useAuth.ts        # Authentication hooks
│   ├── useMyGroups.ts    # Group management
│   └── ...
├── services/             # API clients
│   ├── api.ts            # Fetch-based API wrapper (primary HTTP client)
│   └── groupApi.ts       # Group-specific API methods
├── contexts/             # React contexts
│   └── Auth/             # Authentication context
├── signals/              # Preact Signals for state
│   ├── auth-signals.ts   # Auth state signals
│   ├── form-signals.ts   # Form state signals
│   └── ...
├── schemas/              # Zod validation schemas
│   ├── loginSchema.ts
│   ├── registrationSchema.ts
│   └── ...
├── configs/              # Configuration files
│   ├── routes.tsx        # Route definitions
│   ├── api-endpoints.ts  # API endpoint constants
│   └── ...
├── styles/               # Global styles and design system
│   ├── __theme.scss      # Design tokens
│   ├── mixins/           # Reusable SCSS mixins
│   └── ...
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
```

---

## 🎨 Design System

### Color Palette

Our premium community-focused color palette:

| Purpose             | Variable              | Hex       | Usage                                    |
| ------------------- | --------------------- | --------- | ---------------------------------------- |
| Brand Primary       | `--brand`     | `#3A4F41` | Primary actions, headings                |
| Accent Warm         | `--brand`       | `#F4C77B` | Call-to-action buttons, highlights       |
| Accent Danger       | `--error-color`     | `#C25A5A` | Alerts, destructive actions              |
| Surface Canvas      | `--surface-1`    | `#F8F5F0` | Page background                          |
| Surface Elevated    | `--surface-2`  | `#EAE6E1` | Cards, elevated surfaces                 |
| Text Primary        | `--text-1`      | `#2A2A2A` | Body text                                |
| Text Secondary      | `--text-2`    | `#6E7673` | Secondary text, labels                   |

### Spacing System

Uses **4pt spacing system** via Open Props:

```scss
var(--size-1) // 4px
var(--size-2) // 8px
var(--size-3) // 12px
var(--size-4) // 16px
var(--size-5) // 20px
var(--size-6) // 24px
// ... and so on
```

### Typography

- **Font Stack**: `var(--font-sans)` from Open Props
- **Titles**: `var(--font-size-6)` + `var(--font-weight-7)`
- **Section Headers**: `var(--font-size-4)` + `var(--font-weight-6)`
- **Body Text**: `var(--font-size-1)` + `var(--font-weight-4)`
- **Line Height**: `var(--font-lineheight-3)` (1.5)

---

## 🔐 Authentication

### Session-Based Authentication

The application uses Django session-based authentication with CSRF token protection:

1. **Login**: `POST /api/accounts/login/`
2. **Registration**: `POST /api/accounts/register/`
3. **Logout**: `POST /api/accounts/logout/`
4. **Token Refresh**: Automatic via API interceptors

### Auth Flow

```typescript
// Example: Using auth hooks
import { useAuth } from 'hooks/useAuth';

function MyComponent() {
  const { login, logout, user } = useAuth();

  const handleLogin = async (credentials) => {
    await login.mutateAsync(credentials);
  };

  return <div>{user?.first_name}</div>;
}
```

### Protected Routes

Routes are protected using the `ProtectedRoutes` component:

```tsx
<Route element={<ProtectedRoutes />}>
  <Route path="/dashboard" element={<Dashboard />} />
</Route>
```

---

## 📡 API Integration

### TanStack Query Patterns

All server state is managed with TanStack Query:

```typescript
// Example query
export function useMyGroups() {
  return useQuery({
    queryKey: ['my-groups'],
    queryFn: ({ signal }) => api.get('/groups/my-groups/', { signal }),
    staleTime: 60_000,
  });
}

// Example mutation with optimistic updates
export function useUpdateProfile() {
  return useMutation({
    mutationFn: (data) => api.patch('/me/', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}
```

### API Client

The application uses a single, standardized **fetch-based** HTTP client:

**`services/api.ts`** - Primary HTTP client with:
- CSRF token management
- Session-based authentication
- Automatic access token handling
- AbortSignal support for request cancellation
- Comprehensive error handling with Django compatibility

---

## 🧩 Key Components

### ConfigurableForm

Reusable form component eliminating duplication across auth flows:

```tsx
<ConfigurableForm
  schema={loginSchema}
  onSubmit={handleLogin}
  fieldGroups={loginFieldGroups}
  submitText="Sign In"
  isLoading={isLoading}
  serverError={error}
/>
```

### Layout Component

Controls page-level layout instead of manual containers:

```tsx
// Standard page
<Layout variant="default">{children}</Layout>

// Auth pages with split-screen
<Layout design="auth" variant="fullscreen" authImageSrc="/image.jpg">
  {children}
</Layout>

// Full-screen content
<Layout variant="fullscreen">{children}</Layout>
```

---

## 🧪 Testing & Quality

### Code Quality Tools

- **ESLint 9**: Flat config with TypeScript-aware rules
- **TypeScript**: Strict mode with `noUnusedLocals`, `noUnusedParameters`
- **Prettier**: Code formatting (configured via ESLint)

### Running Linters

```bash
# Run ESLint
yarn lint

# Type check
tsc --noEmit
```

---

## 🚢 Deployment

### Railway Deployment

The application is configured for Railway deployment with Docker:

```bash
# Build production bundle
yarn build

# Preview production build locally
yarn preview
```

### Docker Build

Multi-stage Docker build configured in `Dockerfile`:

1. **Build stage**: TypeScript compilation + Vite build
2. **Production stage**: Nginx serving static files

### Environment Variables (Railway)

Set these in Railway dashboard:

- `VITE_USE_LOCAL_ENDPOINT=false`
- `VITE_PRODUCTION_API_ENDPOINT=https://your-backend.railway.app/api`
- `VITE_GOOGLE_MAPS_API_KEY=your-production-key`

---

## 🤝 Contributing

### Development Workflow

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes following our coding standards
3. Run linters: `yarn lint`
4. Build to verify: `yarn build`
5. Commit with descriptive messages
6. Push and create a pull request

### Coding Standards

- **TypeScript**: Strict mode, no `any` types without justification
- **Components**: Functional components with hooks
- **Styling**: SCSS modules with BEM-inspired naming
- **Accessibility**: Follow React Aria patterns
- **State**: Use Preact Signals for local state, TanStack Query for server state
- **Imports**: Use path aliases where configured

### Code Review Checklist

- [ ] TypeScript strict mode compliance
- [ ] No console.log statements (use proper error logging)
- [ ] Accessibility verified (keyboard navigation, ARIA labels)
- [ ] Responsive design tested
- [ ] Loading and error states handled
- [ ] API calls use TanStack Query
- [ ] Styles use design tokens (no hardcoded values)

---

## 📝 Known Issues & TODOs

See `CODEBASE_ANALYSIS_REPORT.md` for comprehensive issue tracking.

### Active TODOs

- ~~Consolidate HTTP clients (api.ts vs apiClient.ts)~~ ✅ Completed
- Remove debug console.log statements
- Migrate Icon.jsx to TypeScript
- Fix color naming in design tokens
- Complete pending feature implementations

---

## 📚 Additional Documentation

- **GitHub Copilot Instructions**: `.github/copilot-instructions.md`
- **Codebase Analysis**: `CODEBASE_ANALYSIS_REPORT.md`
- **Security Notice**: `SECURITY_API_KEYS_NOTICE.md`
- **Component Usage**: `src/components/USAGE_EXAMPLES.md`
- **Schema Documentation**: `src/schemas/README.md`

---

## 🆘 Support & Resources

### Development Resources

- **React 19 Docs**: https://react.dev
- **Vite Documentation**: https://vite.dev
- **React Aria Components**: https://react-spectrum.adobe.com/react-aria/
- **TanStack Query**: https://tanstack.com/query/latest
- **Open Props**: https://open-props.style

### Project Links

- **Repository**: https://github.com/ThriledLokki983/vineyardgroupfellowship-fe
- **Deployment**: Railway (configured via `railway.toml`)
- **Backend API**: Django REST Framework

---

## 📄 License

[Add your license information here]

---

**Built with ❤️ for faith, fellowship, and community**
