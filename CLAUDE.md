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
├── components/        # Reusable UI components
├── hooks/             # Custom React hooks
│   ├── useDebounce.ts     # Search performance optimization
│   └── useTodos.ts        # Wrapper around Zustand store (demonstrates reusability)
├── providers/
│   └── TodoDataProvider.tsx  # Centralized data fetching/clearing
├── screens/           # Screen components
├── stores/            # Zustand state management
│   ├── useAuthStore.ts    # Auth state (user, login, logout)
│   └── useTodoStore.ts    # Todo state (CRUD + filtering + search)
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
- Use color values directly (no theme system for this project)

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

**Key Components:**
- `lib/components/AuthGuard.tsx` - Route protection
- `lib/screens/TodoListScreen.tsx` - Main UI

**Types:**
- `lib/types/Todo.ts` - Domain entity + helper functions
- `lib/types/TodoDTO.ts` - API types + mappers

## Common Patterns

### Adding a New Feature
1. Add types to `lib/types/` if needed
2. Add API method to `TodoRepository` if needed
3. Add action to appropriate Zustand store
4. Update screen/component to use new action
5. Use optimistic updates for mutations

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
