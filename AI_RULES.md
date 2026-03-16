# AI Development Rules for CampanhaGov

This document defines the tech stack and development conventions for this application.

## Tech Stack

- **React 18** with TypeScript - Core framework using functional components and hooks
- **Vite** - Build tool and development server with SWC for fast compilation
- **React Router v6** - Client-side routing with lazy-loaded routes for code splitting
- **Tailwind CSS** - Utility-first CSS framework for all styling
- **shadcn/ui** - Component library built on Radix UI primitives
- **Supabase** - Backend-as-a-Service for authentication, database, and real-time features
- **TanStack Query (React Query)** - Server state management and data fetching
- **React Hook Form + Zod** - Form handling and schema validation
- **Capacitor** - Cross-platform native app deployment (iOS/Android)
- **PWA (vite-plugin-pwa)** - Progressive Web App support with offline capabilities

## Library Usage Rules

### UI Components

| Use Case | Library | Notes |
|----------|---------|-------|
| UI primitives | `shadcn/ui` (src/components/ui/) | ALWAYS use existing components first |
| Icons | `lucide-react` | Import directly: `import { IconName } from "lucide-react"` |
| Styling | `Tailwind CSS` | Use utility classes; avoid custom CSS |
| Animations | `tailwindcss-animate` | Use Tailwind animation utilities |
| Class merging | `clsx` + `tailwind-merge` | Use `cn()` helper from `@/lib/utils` |

### State Management

| Use Case | Library | Notes |
|----------|---------|-------|
| Server state | `@tanstack/react-query` | Use for API calls, caching, and synchronization |
| Form state | `react-hook-form` | Combined with Zod for validation |
| Local UI state | React `useState` / `useReducer` | For component-level state only |
| URL state | React Router's `useSearchParams` | For filter/pagination state |

### Data & Validation

| Use Case | Library | Notes |
|----------|---------|-------|
| Form validation | `zod` + `@hookform/resolvers` | Define schemas, use `zodResolver()` |
| Date handling | `date-fns` | All date operations and formatting |
| CSV parsing | `papaparse` | For importing/exporting CSV data |

### Backend Integration

| Use Case | Library | Notes |
|----------|---------|-------|
| Authentication | `@supabase/supabase-js` | Auth provider via `useAuth` hook |
| Database | `@supabase/supabase-js` | PostgreSQL with Row Level Security |
| Real-time | `@supabase/supabase-js` | Use Supabase channels for subscriptions |
| Edge Functions | Supabase Edge Functions | Server-side logic in `supabase/functions/` |

### Maps & Visualization

| Use Case | Library | Notes |
|----------|---------|-------|
| Maps | `leaflet` + `react-leaflet` | Geographic data and map rendering |
| Heatmaps | `leaflet.heat` | For density visualizations |
| Charts | `recharts` | All data visualizations and charts |

### Mobile & PWA

| Use Case | Library | Notes |
|----------|---------|-------|
| Native mobile | `@capacitor/core` + `@capacitor/android` + `@capacitor/ios` | Build native apps |
| PWA features | `vite-plugin-pwa` | Service worker, offline support |
| Push notifications | Custom `sw-push.js` + Supabase | Web push integration |

### UI Patterns

| Use Case | Library | Notes |
|----------|---------|-------|
| Command palette | `cmdk` | Keyboard shortcuts and command menus |
| Drawers/Sheets | `vaul` | Mobile-friendly bottom sheets |
| Carousels | `embla-carousel-react` | Image/content sliders |
| Resizable panels | `react-resizable-panels` | Split view layouts |
| Toasts | `sonner` | Toast notifications (preferred) |
| Date picker | `react-day-picker` | Calendar and date selection |
| OTP input | `input-otp` | One-time password inputs |
| Theme | `next-themes` | Dark/light mode support |

## File Structure Conventions

```
src/
├── components/
│   ├── ui/           # shadcn/ui components (DO NOT EDIT)
│   └── [feature]/    # Feature-specific components
├── pages/            # Route components (one per route)
├── hooks/            # Custom React hooks
├── lib/              # Utility functions and helpers
├── integrations/     # External service clients (Supabase)
├── types/            # TypeScript type definitions
└── assets/           # Static assets (images, fonts)
```

## Coding Standards

### Component Creation
1. **ALWAYS** check if a shadcn/ui component exists before creating new UI components
2. Place reusable components in `src/components/[feature]/`
3. Page components belong in `src/pages/`
4. Use TypeScript with proper type annotations

### Styling Rules
1. Use Tailwind utility classes exclusively
2. Use the `cn()` utility for conditional class merging
3. Follow the color system defined in `tailwind.config.ts` (primary, secondary, muted, etc.)
4. Use CSS variables for theming (defined in `src/index.css`)

### Import Conventions
```typescript
// Use path aliases
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
```

### React Query Usage
```typescript
// Use custom hooks for data fetching
const { data, isLoading, error } = useQuery({
  queryKey: ["resource", id],
  queryFn: () => fetchResource(id),
});
```

### Form Handling
```typescript
// Use react-hook-form with Zod validation
const form = useForm<FormValues>({
  resolver: zodResolver(formSchema),
  defaultValues: { ... }
});
```

### Routing
- All routes are defined in `src/App.tsx`
- Use lazy loading for protected routes
- Wrap protected routes with `<ProtectedRoute>` component

### Database
- Use Supabase client from `@/integrations/supabase/client`
- Database types are in `@/integrations/supabase/types`
- Use Row Level Security (RLS) for data access control

## Key Principles

1. **Keep it simple** - Don't over-engineer solutions
2. **Use existing components** - Check shadcn/ui before building new UI
3. **Type safety** - Use TypeScript types from Supabase for database entities
4. **Performance** - Use React Query caching and lazy loading
5. **Accessibility** - shadcn/ui components are accessible by default
6. **Mobile-first** - Design for mobile, enhance for desktop
7. **Offline-capable** - PWA features should work offline where possible