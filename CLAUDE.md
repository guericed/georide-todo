# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Georide Todo App** - A React Native todo list application built for a coding assessment. Demonstrates clean architecture, simplicity, and modern React Native patterns.

**Tech Stack:**
- React Native with Expo Router (file-based routing)
- TypeScript (strict mode enabled)
- Zustand (state management)
- DummyJSON API (backend)
- React Native StyleSheet (manual styling)

**Key Philosophy:** Keep things simple. Avoid over-engineering and unnecessary abstractions.

## Development Commands

```bash
# Start development server
npm start

# Run on specific platform
npm run android
npm run ios
npm run web

# Type checking (no build output)
npx tsc --noEmit
```

## Architecture

### High-Level Structure

```
app/                    # Expo Router (file-based routing)
├── _layout.tsx        # Root navigation config
├── index.tsx          # Login screen route (/)
├── modal.tsx          # Add todo modal route
└── todos/
    ├── _layout.tsx    # Protected routes with AuthGuard + TodoDataProvider
    ├── index.tsx      # Todo list screen (/todos)
    └── [id].tsx       # Edit todo screen (/todos/:id)

lib/                    # Business logic (simplified clean architecture)
├── api/               # Data layer
│   └── TodoRepository.ts   # Direct fetch calls to DummyJSON
├── components/        # React components
│   ├── ui/            # Pure UI components (design system foundation)
│   │   ├── AppHeader.tsx      # App header with user info + logout
│   │   ├── Avatar.tsx         # Emoji avatar with size variants
│   │   ├── Button.tsx         # Primary/Secondary button
│   │   ├── CharacterCount.tsx # Character counter
│   │   ├── ErrorBanner.tsx    # Inline error banner
│   │   ├── FAB.tsx            # Floating Action Button
│   │   ├── Input.tsx          # Text input with label/error
│   │   ├── PageHeader.tsx     # Page header with title/subtitle
│   │   └── UserCard.tsx       # User selection card
│   ├── AuthGuard.tsx      # Route protection (logic)
│   ├── EmptyState.tsx     # Empty state display (logic)
│   ├── ErrorMessage.tsx   # Error message with retry (logic)
│   ├── LoadingSpinner.tsx # Loading indicator
│   ├── SearchBar.tsx      # Search input
│   ├── TodoFilters.tsx    # Filter tabs (All/Active/Completed)
│   └── TodoItem.tsx       # Todo list item
├── hooks/             # Custom React hooks
│   ├── useDebounce.ts     # Search performance optimization
│   └── useTodos.ts        # Wrapper around Zustand store (demonstrates reusability)
├── providers/
│   └── TodoDataProvider.tsx  # Centralized data fetching/clearing
├── screens/           # Screen components
│   ├── LoginScreen.tsx    # User selection screen
│   ├── TodoFormScreen.tsx # Add/Edit todo form
│   └── TodoListScreen.tsx # Main todo list
├── stores/            # Zustand state management
│   ├── useAuthStore.ts    # Auth state (user, login, logout)
│   └── useTodoStore.ts    # Todo state (CRUD + filtering + search)
├── theme/             # Design system
│   └── colors.ts          # Centralized color palette
├── types/             # TypeScript types
│   ├── Todo.ts           # Domain entity
│   ├── TodoDTO.ts        # API types + DTO mappers
│   └── User.ts
└── utils/
    ├── config.ts         # API URL, mock users, constants
    └── validation.ts     # Input validation
```

### Key Architectural Patterns

#### 1. **DTO Mapping Pattern**
API responses (DTOs) are transformed into domain entities to decouple API structure from business logic.

```typescript
// API response (TodoDTO)
{ id: 1, todo: "text", completed: false, userId: 1 }

// Domain entity (Todo)
{ id: 1, text: "text", isCompleted: false, userId: 1 }
```

Mappers live in `lib/types/TodoDTO.ts`. This pattern allows API changes without breaking domain logic.

#### 2. **Optimistic Updates**
All mutations (add/toggle/delete) use optimistic updates for instant UI feedback:
1. Update local state immediately
2. Make API call in background
3. On success: Replace temp data with server response
4. On failure: Rollback and show error

Temporary todos use negative IDs (`-Date.now()`) to differentiate from server-generated IDs.

#### 3. **Centralized Data Management (TodoDataProvider)**
- Located in `lib/providers/TodoDataProvider.tsx`
- Wraps the todos section in `app/todos/_layout.tsx`
- Automatically fetches todos when user logs in
- Automatically clears todos when user logs out
- Keeps data fetching logic out of screen components

**Why?** So changing the main view (TodoListScreen) won't break data loading.

#### 4. **Store Wrapper Pattern (useTodos)**
The `useTodos` hook wraps `useTodoStore` to:
- Abstract Zustand implementation from components
- Provide computed values (filtered todos, counts)
- Inject current user into actions
- Demonstrate code reusability

**Decision:** Initially considered removing this layer for simplicity, but kept it to demonstrate reusable patterns.

#### 5. **AuthGuard Pattern**
Centralized authentication logic in `lib/components/AuthGuard.tsx`:
- `requireAuth={true}` - Redirects to login if not authenticated
- `requireAuth={false}` - Redirects to todos if already authenticated
- Prevents duplicate auth checks in route files

#### 6. **UI Component Library Pattern**
Separation between pure UI components and components with logic:

**Pure UI Components** (`lib/components/ui/`):
- No business logic, no hooks (except useState for internal UI state)
- Receive all data via props
- Foundation for design system
- Examples: Button, FAB, Input, Avatar, AppHeader, PageHeader, UserCard, ErrorBanner, CharacterCount

**Components with Logic** (`lib/components/`):
- Use hooks (useTodos, useAuthStore, etc.)
- Handle data fetching, state management
- Examples: AuthGuard, TodoItem, TodoFilters, SearchBar, EmptyState, ErrorMessage

**Benefits:**
- Easier to test pure UI components
- Reusable across different contexts
- Clear separation of concerns
- Foundation for Storybook/design system

#### 7. **Centralized Color Palette**
All colors defined in `lib/theme/colors.ts`:

```typescript
export const colors = {
  brand: {
    primary: '#3B82F6',       // Main blue
    primaryDark: '#2563EB',   // Darker blue
    primaryLight: '#DBEAFE',  // Light blue
    primaryPale: '#93C5FD',   // Pale blue (disabled)
  },
  neutral: {
    white: '#FFFFFF',
    black: '#111827',
    gray50: '#F9FAFB',  // Backgrounds
    gray100: '#E5E7EB', // Borders
    gray200: '#D1D5DB', // Input borders
    gray400: '#9CA3AF', // Placeholders
    gray500: '#6B7280', // Secondary text
    gray600: '#374151', // Primary text
  },
  error: {
    main: '#EF4444',
    dark: '#B91C1C',
    light: '#FEF2F2',
    border: '#FECACA',
  },
  shadow: '#000',
}
```

**Usage:**
```typescript
import { colors } from '@/lib/theme/colors';

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.brand.primary,
    color: colors.neutral.white,
  },
});
```

**Benefits:**
- Single source of truth for colors
- Easy to update theme
- Type-safe with `as const`
- Foundation for dark mode support

### State Management (Zustand)

**Two stores:**

1. **useAuthStore** (`lib/stores/useAuthStore.ts`)
   - Simple: user, isAuthenticated
   - Actions: login(user), logout()

2. **useTodoStore** (`lib/stores/useTodoStore.ts`)
   - State: todos[], filter, searchQuery, isLoading, error
   - Actions: fetchTodos, addTodo, updateTodo, deleteTodo, toggleTodo
   - All mutation actions return `Promise<Todo | null>` (explicit null on failure)
   - Silent error handling for update/delete/toggle (DummyJSON API doesn't persist mutations)

**Why Zustand?** Simple, performant, no boilerplate. Perfect for this scale.

### API Integration (DummyJSON)

**Base URL:** `https://dummyjson.com`

**Endpoints:**
- `GET /todos/user/{userId}` - Fetch user's todos
- `POST /todos/add` - Create todo (simulated)
- `PUT /todos/{id}` - Update todo (simulated)
- `DELETE /todos/{id}` - Delete todo (simulated)

**Important:** DummyJSON mutations are simulated (don't persist). Use optimistic updates to make it feel real.

**Repository:** `lib/api/TodoRepository.ts` uses native `fetch` directly (no abstraction layers).

### Type Conventions

**Return Types:**
- Use `null` for explicit "no value" from operations (e.g., `Promise<Todo | null>`)
- Use `undefined` for optional parameters or uninitialized state
- All async operations return explicit types (no `Promise<void>` unless truly void)

**TypeScript Config:**
- Strict mode enabled (`tsconfig.json`)
- Path alias: `@/*` maps to root (e.g., `@/lib/hooks/useTodos`)

### Routing (Expo Router)

**File-based routing:**
- `app/index.tsx` → `/`
- `app/todos/index.tsx` → `/todos`
- `app/todos/[id].tsx` → `/todos/:id`
- `app/modal.tsx` → `/modal` (presentation: modal)

**Navigation:**
```typescript
import { useRouter } from 'expo-router';

const router = useRouter();
router.push('/todos');      // Navigate
router.replace('/');        // Replace (no back)
```

### Mock Authentication

No real auth server. User selection screen (`LoginScreen`) allows choosing from 5 mock users (lib/utils/config.ts). Each user ID corresponds to real data in DummyJSON API.

## Code Style & Patterns

### Styling
- Use React Native `StyleSheet.create()` (manual styling, no NativeWind)
- Keep styles at bottom of component files
- **Always import colors from `@/lib/theme/colors`** - Never hardcode color values
- All UI components use centralized color palette

### Debouncing
Search input uses `useDebounce` hook (300ms delay) to prevent excessive re-filtering on every keystroke.

### Error Handling
- Store errors in Zustand state (`error: string | null`)
- Display error banners in UI with dismiss action
- Silent catches in update/delete/toggle due to DummyJSON API limitations (see WARNING comments)

### Data Flow
```
User Action → Component → useTodos Hook → useTodoStore → TodoRepository → API
                                ↓
                         Optimistic Update
```

## Important Files

**Core Logic:**
- `lib/stores/useTodoStore.ts` - All todo state and mutations
- `lib/providers/TodoDataProvider.tsx` - Data lifecycle management
- `lib/hooks/useTodos.ts` - Store wrapper with computed values
- `lib/api/TodoRepository.ts` - API integration

**Design System:**
- `lib/theme/colors.ts` - Centralized color palette (brand, neutral, error, semantic)
- `lib/components/ui/` - Pure UI components library (9 components)

**Key Components:**
- `lib/components/AuthGuard.tsx` - Route protection
- `lib/screens/TodoListScreen.tsx` - Main UI
- `lib/components/ui/FAB.tsx` - Floating Action Button
- `lib/components/ui/Button.tsx` - Primary/Secondary button variants

**Types:**
- `lib/types/Todo.ts` - Domain entity + helper functions
- `lib/types/TodoDTO.ts` - API types + mappers

## Common Patterns

### Adding a New UI Component
1. Create component in `lib/components/ui/` for pure UI
2. Use centralized colors: `import { colors } from '@/lib/theme/colors'`
3. Accept all data via props (no hooks for pure UI)
4. Export from component file (no index.ts files)

### Adding a New Feature
1. Add types to `lib/types/` if needed
2. Add API method to `TodoRepository` if needed
3. Add action to appropriate Zustand store
4. Create/update UI components in `lib/components/ui/` if needed
5. Update screen/component to use new action
6. Use optimistic updates for mutations

### Modifying API Structure
1. Update `TodoDTO` types in `lib/types/TodoDTO.ts`
2. Update mappers (mapDTOToEntity/mapDTOsToEntities)
3. Domain entities (`Todo`) remain unchanged

### Adding a New Screen
1. Create screen component in `lib/screens/`
2. Add route file in `app/` directory
3. Wrap with `AuthGuard` if authentication required
4. Access stores via `useTodos` or `useAuthStore` hooks

## Project Context

This is a **coding assessment** demonstrating:
- Clean code organization
- Separation of concerns
- Simple, maintainable patterns
- Modern React Native practices
- TypeScript best practices
- Performance optimizations (debouncing, optimistic updates)
