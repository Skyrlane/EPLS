# Architecture

**Analysis Date:** 2026-02-19

## Pattern Overview

**Overall:** Server-Driven Next.js 14 with Firebase Backend

**Key Characteristics:**
- Next.js 14 App Router with Server Components by default
- Client Components only where interactivity is required
- Firebase (Firestore, Auth, Storage) as primary backend
- Type-safe development with TypeScript strict mode
- Zod validation on client and server
- Shadcn/UI component system based on Radix UI
- Server Actions for form submissions (next-safe-action)
- React Hook Form for client-side form handling

## Layers

**Presentation Layer (UI):**
- Purpose: User interface components and page rendering
- Location: `app/`, `components/`
- Contains: Next.js pages, Server Components, Client Components, Shadcn/UI components
- Depends on: Hooks, Utilities, Firebase SDK
- Used by: End users through browser

**Business Logic Layer:**
- Purpose: Custom hooks, data transformation, Firebase operations
- Location: `hooks/`, `lib/`
- Contains: Custom hooks (useFirestore, useRealtimeCollection), data utilities, validation schemas
- Depends on: Firebase SDK, utilities
- Used by: Presentation layer components

**Data Access Layer:**
- Purpose: Firebase initialization, authentication, data querying
- Location: `lib/firebase/`, Firebase SDK integration
- Contains: Firebase configuration, Auth instance, Firestore reference, Storage configuration
- Depends on: Firebase packages
- Used by: Custom hooks and utilities

**Type & Validation Layer:**
- Purpose: Type definitions and data validation schemas
- Location: `types/`, `lib/validations/`
- Contains: TypeScript interfaces (Member, Event, Message, User), Zod schemas
- Depends on: TypeScript, Zod
- Used by: All layers

## Data Flow

**Page Load (Server Component):**

1. Next.js App Router matches route to `app/[route]/page.tsx`
2. Server Component fetches data (typically from Firebase Firestore)
3. Server Component renders with static/dynamic content
4. Client Components are hydrated for interactive features
5. HTML streamed to browser

**User Interaction (Client Component):**

1. User interacts with form or button in Client Component
2. Event handler triggers (onClick, onSubmit, onChange)
3. useFirestore/useRealtimeCollection hook queries or mutates Firestore
4. Component state updates via useState
5. UI re-renders with updated data
6. Toast/Alert notifications for success/error feedback

**Form Submission (next-safe-action):**

1. Form onSubmit handler calls Server Action
2. Zod schema validates input on client
3. Server Action receives validated data
4. Server Action performs Firestore mutation
5. revalidatePath() updates cache for related pages
6. Component receives result, shows toast

**Real-time Updates (useRealtimeCollection):**

1. Component mounts, hook subscribes to Firestore query
2. onSnapshot listener established with query constraints
3. Firestore updates trigger listener callback
4. Hook updates local state with new documents
5. Component re-renders with fresh data
6. Unsubscribe on component unmount

**State Management:**
- Local component state: useState for form inputs, UI state
- Context: AuthProvider for authentication state across app
- Server state: Firebase Firestore as single source of truth
- No centralized state management (Redux/Zustand) - Firebase handles persistence

## Key Abstractions

**useFirestore<T> Hook:**
- Purpose: Complete CRUD abstraction for any Firestore collection
- Examples: Used in admin pages (`app/admin/*`), member management (`app/membres/`)
- Pattern: Generic hook taking collectionName, returns getAll/getOne/create/update/remove methods
- Location: `hooks/use-firestore.ts`

**useRealtimeCollection<T> Hook:**
- Purpose: Subscribe to live Firestore collection with query constraints
- Examples: Event lists, message feeds, member lists
- Pattern: Pass collectionName + QueryConstraint array, get real-time data array
- Location: `hooks/use-realtime-collection.ts`

**useRealtimeDocument<T> Hook:**
- Purpose: Subscribe to single Firestore document with live updates
- Examples: Member profile, event details, user preferences
- Pattern: Pass collectionName + documentId, get live document data
- Location: `hooks/use-realtime-document.ts`

**usePaginatedCollection<T> Hook:**
- Purpose: Paginate large collections with loadMore() pattern
- Examples: Blog articles, message archives, photo galleries
- Pattern: Pass collectionName + pageSize, returns data/hasMore/loadMore
- Location: `hooks/use-paginated-collection.ts`

**useFirebaseAuth Hook:**
- Purpose: Authentication operations (sign in, sign up, sign out, reset password)
- Pattern: Returns user state + methods for auth operations
- Location: `hooks/use-firebase-auth.ts`

**useStorage Hook:**
- Purpose: Firebase Storage file upload/download operations
- Examples: Photo uploads, document downloads, avatar uploads
- Pattern: Returns uploadFile/deleteFile/getDownloadURL with progress tracking
- Location: `hooks/use-storage.ts`

**Auth Context (AuthProvider):**
- Purpose: Global authentication state accessible via useAuth hook
- Pattern: Wraps app with AuthProvider, useAuth returns user/isAuthenticated/isLoading
- Location: `lib/hooks/use-auth`, wrapped in `app/admin/layout.tsx`

**Shadcn/UI Components:**
- Purpose: Consistent, accessible UI component library
- Examples: Button, Card, Dialog, Input, Select, Badge, Toast, Avatar
- Pattern: Import from `@/components/ui/[component]`, compose into pages
- Location: `components/ui/`

## Entry Points

**Root Layout (Server Component):**
- Location: `app/layout.tsx`
- Triggers: All page requests
- Responsibilities: Global HTML structure, fonts, CSS imports, metadata

**Root Page (Server Component):**
- Location: `app/page.tsx`
- Triggers: Homepage request (/)
- Responsibilities: Hero section, announcements, latest messages, events, gallery, blog highlights

**Admin Layout (Hybrid):**
- Location: `app/admin/layout.tsx`
- Triggers: All /admin/* requests
- Responsibilities: Force dynamic rendering, wrap with AuthProvider, AdminLayoutClient

**Feature Routes:**
- `app/[feature]/page.tsx`: Matches routes like `/messages`, `/articles`, `/members`, `/culte`
- Pattern: Server Component with client sub-components for interactivity
- Responsibilities: Fetch collection data, render list/detail views

**Dynamic Routes:**
- `app/articles/[slug]/page.tsx`: Article detail page
- `app/messages/[id]/page.tsx`: Message detail page
- Pattern: generateStaticParams() for static generation, fallback to dynamic
- Responsibilities: Fetch specific document, render detail view with related content

## Error Handling

**Strategy:** Layered error handling with user-facing feedback

**Patterns:**

- **Firestore Queries:** Try-catch in hooks, return error state, display in UI with Alert component
- **Form Submission:** Server Action validation errors collected in result object, displayed with react-hook-form
- **Authentication:** Firebase auth errors translated to user-friendly messages in LoginForm
- **File Upload:** useStorage hook tracks upload errors, displayed with toast notifications
- **Loading States:** Every async operation tracked with loading/isLoading boolean, renders skeleton or spinner
- **Fallbacks:** Missing data gracefully handled (empty states, default values)

## Cross-Cutting Concerns

**Logging:**
- console.log/error for development
- Firebase console for audit logs (future enhancement)
- Error boundaries not yet implemented

**Validation:**
- Client: React Hook Form + zod schema in form components
- Server: next-safe-action validates with same Zod schema
- Database: Firestore security rules enforce validation

**Authentication:**
- Firebase Auth handles credential verification
- AuthProvider context wraps admin routes
- useProtectedRoute() hook for manual route protection
- Firestore security rules check user.uid against documents

**Authorization:**
- Role-based in security rules: admin role grants write access to collections
- User document stores isAdmin flag checked before rendering admin UI
- No granular permission system yet (monolithic admin vs public)

**Styling:**
- Tailwind CSS utility classes throughout
- CSS Modules not used (prefer Tailwind)
- Theme variables via next-themes (light/dark mode)
- Responsive breakpoints: sm, md, lg, xl (mobile-first design)

**Performance Optimizations:**
- Server-side data fetching reduces client bundle
- Image optimization with Next.js Image component
- Lazy loading for heavy components (next/dynamic)
- Firebase .limit() enforced on all queries
- Pagination for large collections (usePaginatedCollection)
- CSS-in-JS minimized (static Tailwind output)

---

*Architecture analysis: 2026-02-19*
