# Codebase Structure

**Analysis Date:** 2026-02-19

## Directory Layout

```
template-2/
├── app/                          # Next.js 14 App Router - pages and routes
│   ├── layout.tsx               # Root layout (HTML structure, global styles)
│   ├── page.tsx                 # Homepage
│   ├── globals.css              # Global Tailwind styles
│   ├── (feature folders)/       # Feature routes (articles, messages, members, etc.)
│   │   ├── page.tsx            # Feature list/landing page
│   │   ├── [id]/page.tsx       # Detail page (if applicable)
│   │   └── layout.tsx          # Feature-specific layout (optional)
│   └── admin/                   # Admin dashboard and management
│       ├── layout.tsx          # Admin layout with auth protection
│       ├── page.tsx            # Admin home/dashboard
│       ├── carnet-adresses/    # Address book management
│       ├── membres/            # Member management
│       ├── messages/           # Message/sermon management
│       ├── annonces/           # Announcements management
│       ├── anniversaires/      # Birthdays management
│       ├── blog/               # Blog article management
│       ├── echos/              # Echo (journal) management
│       ├── photos/             # Photo gallery management
│       └── actions.ts          # Server Actions for admin operations
├── components/                  # React components (reusable)
│   ├── ui/                     # Shadcn/UI components (Button, Card, Dialog, etc.)
│   ├── auth/                   # Authentication components (LoginForm, RegisterForm)
│   ├── home/                   # Homepage section components
│   ├── members/                # Member-related components
│   ├── messages/               # Message/sermon components
│   ├── articles/               # Article components
│   ├── blog/                   # Blog components
│   ├── admin/                  # Admin management components
│   ├── announcements/          # Announcement display components
│   ├── forms/                  # Reusable form components
│   └── layout.tsx              # Layout wrapper components
├── hooks/                       # React custom hooks
│   ├── use-firestore.ts        # CRUD hook for Firestore collections
│   ├── use-firebase-auth.ts    # Authentication operations hook
│   ├── use-auth.tsx            # Auth context consumer hook
│   ├── use-realtime-collection.ts  # Real-time collection subscription
│   ├── use-realtime-document.ts    # Real-time document subscription
│   ├── use-paginated-collection.ts # Pagination hook
│   ├── use-storage.ts          # Firebase Storage operations hook
│   ├── use-protected-route.ts  # Route protection hook
│   ├── use-theme.ts            # Theme (dark/light mode) hook
│   └── __tests__/              # Hook unit tests
├── lib/                         # Utility functions and helpers
│   ├── firebase/               # Firebase SDK initialization
│   │   ├── config.ts          # Firebase project config
│   │   ├── auth.ts            # Auth helper functions
│   │   ├── firestore.ts       # Firestore helper functions
│   │   └── index.ts           # Firebase exports
│   ├── auth/                  # Authentication utilities
│   │   └── actions.ts         # Server Actions for auth
│   ├── data/                  # Static/hardcoded data
│   │   ├── echos.ts          # Echo data
│   │   ├── messages.ts       # Message data
│   │   ├── events.ts         # Event data
│   │   └── team.ts           # Team member data
│   ├── validations/          # Zod validation schemas
│   │   ├── contact.ts        # Contact form schema
│   │   └── church-member.ts  # Member form schema
│   ├── hooks/                # Context and hook utilities
│   │   └── use-auth.ts       # Auth context provider
│   ├── utils.ts              # General utility functions (cn, formatDate, etc.)
│   ├── firebase.ts           # Main Firebase configuration
│   └── airtable-client.ts    # Airtable API integration
├── types/                       # TypeScript type definitions
│   └── index.ts               # Central type exports (Member, Event, Message, User, Document)
├── public/                      # Static assets
│   ├── images/               # Images
│   ├── videos/               # Videos
│   └── documents/            # PDFs and documents
├── styles/                      # Style files (if not in app/)
├── scripts/                     # Build and utility scripts
│   ├── dev.js                # Safe dev startup
│   ├── verifier-images.js    # Image verification
│   └── import-echos.ts       # Import echos from Airtable
├── __mocks__/                   # Jest mock files
│   └── firebase/             # Firebase mock implementation
├── .planning/                   # GSD planning documents
│   └── codebase/             # Architecture documentation
├── package.json               # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── next.config.js            # Next.js configuration
└── jest.config.js            # Jest test configuration
```

## Directory Purposes

**`app/`** - Next.js App Router
- Purpose: Define application routes and pages
- Contains: Page components, layouts, server actions
- Key concept: Each folder = route segment; `page.tsx` = rendered page

**`components/`** - React Components
- Purpose: Reusable UI components
- Contains: Shadcn/UI base components, custom components for features
- Key concept: Prefer Server Components; use Client Components only for interactivity

**`hooks/`** - React Custom Hooks
- Purpose: Encapsulate React logic and Firebase integration
- Contains: State management hooks, Firebase CRUD hooks, context consumers
- Key concept: Hooks are the primary way to interact with Firestore and Auth

**`lib/`** - Utilities and Libraries
- Purpose: Non-React utilities, Firebase setup, data helpers
- Contains: Firebase initialization, validation schemas, utility functions
- Key concept: Separate concerns: auth logic, data transforms, firebase config

**`types/`** - TypeScript Definitions
- Purpose: Central type definitions for entire application
- Contains: Interfaces for domain objects (Member, Event, Message, User, Document)
- Key concept: Single source of truth for types; enables type safety across app

**`public/`** - Static Assets
- Purpose: Files served directly by Next.js
- Contains: Images, videos, documents, icons
- Key concept: Referenced as `/filename` in code

**`.planning/`** - GSD Documentation
- Purpose: Architecture and planning documents
- Contains: ARCHITECTURE.md, STRUCTURE.md, CONVENTIONS.md, TESTING.md, CONCERNS.md

## Key File Locations

**Entry Points:**
- `app/layout.tsx`: Root HTML layout (fonts, global styles, metadata)
- `app/page.tsx`: Homepage entry point
- `app/admin/layout.tsx`: Admin section with auth protection
- `package.json`: Build scripts (dev, build, start, test)

**Configuration:**
- `tsconfig.json`: TypeScript strict mode, path aliases (@/*)
- `next.config.js`: Next.js settings
- `jest.config.js`: Test framework configuration
- `lib/firebase.ts`: Firebase SDK initialization with mock fallback

**Core Logic:**
- `hooks/use-firestore.ts`: Main CRUD hook for all collections
- `hooks/use-realtime-collection.ts`: Real-time data subscription
- `lib/validations/`: Zod schemas for form validation
- `lib/auth/actions.ts`: Server-side authentication logic

**Testing:**
- `hooks/__tests__/`: Hook unit tests
- `__mocks__/firebase/`: Firebase mock for Jest
- `jest.config.js`: Test runner configuration

## Naming Conventions

**Files:**
- Server Components: `page.tsx`, `layout.tsx`
- Client Components: `kebab-case.tsx` (e.g., `login-form.tsx`, `event-card.tsx`)
- Hooks: `use-kebab-case.ts` (e.g., `use-firestore.ts`, `use-auth.tsx`)
- Utilities: `kebab-case.ts` (e.g., `firebase-utils.ts`)
- Types: `index.ts` in type folder, or `kebab-case.ts` (e.g., `contact.ts`)

**Directories:**
- Feature routes: `kebab-case/` (e.g., `carnet-adresses/`, `mot-de-passe-oublie/`)
- Component categories: `kebab-case/` (e.g., `home/`, `auth/`, `admin/`)
- Utilities: `kebab-case/` (e.g., `firebase/`, `validations/`, `data/`)

**Functions & Variables:**
- camelCase: Function names, variables, hook names
- PascalCase: Component names, Class names, Types
- SCREAMING_SNAKE_CASE: Constants (if any)

**Example paths:**
- `components/auth/login-form.tsx` → LoginForm component
- `hooks/use-firestore.ts` → useFirestore hook
- `app/messages/[id]/page.tsx` → Dynamic route for message detail
- `lib/validations/contact.ts` → Contact validation schema

## Where to Add New Code

**New Feature Route:**
1. Create folder: `app/[feature-name]/`
2. Create page: `app/[feature-name]/page.tsx` (Server Component)
3. Create components: `components/[feature-name]/` for sub-components
4. Create layout: `app/[feature-name]/layout.tsx` (if feature needs custom layout)
5. Add hooks: `hooks/use-[feature-name].ts` (if custom logic needed)

**New Component:**
1. If UI component: `components/ui/[component-name].tsx`
2. If feature component: `components/[feature-folder]/[component-name].tsx`
3. Import Shadcn/UI or create client component with 'use client' directive

**New Hook:**
1. Create: `hooks/use-[hook-name].ts`
2. Export from hook file
3. Import via `import { useHookName } from '@/hooks/use-hook-name'`

**New Utility/Helper:**
1. Create: `lib/[utility-name].ts` or `lib/[category]/[utility-name].ts`
2. Export functions
3. Import via `import { helperFunction } from '@/lib/[category]/[utility-name]'`

**New Type:**
1. Add interface to: `types/index.ts` (if domain type)
2. Or create: `types/[feature].ts` and re-export from index

**Admin Feature:**
1. Create page: `app/admin/[feature-name]/page.tsx`
2. Create component: `components/admin/[feature-name]*.tsx`
3. Create hook: `hooks/use-[feature-name].ts` (if Firestore CRUD)
4. Create form: `components/admin/[feature-name]-form.tsx` or form in page
5. Use useFirestore for CRUD operations

**Form Validation:**
1. Create schema: `lib/validations/[form-name].ts` with Zod
2. Use in component: `react-hook-form` + `zodResolver`
3. Use in Server Action: `next-safe-action` with same schema

## Special Directories

**`app/admin/`:**
- Purpose: Admin dashboard and management interfaces
- Generated: No (source code)
- Committed: Yes
- Protected: Routes wrapped with AuthProvider, useAuth() checks isAdmin
- Key files: `layout.tsx` (force-dynamic), each feature has `page.tsx`

**`app/api/`:**
- Purpose: API routes (if any)
- Currently: Minimal/empty - Firebase handles backend
- Pattern: Would be `app/api/[route]/route.ts` for REST endpoints

**`components/ui/`:**
- Purpose: Shadcn/UI component library
- Generated: No (handwritten)
- Committed: Yes
- Pattern: Each component in own file, re-exported for import
- Do NOT modify: Use these as-is; customize via props and Tailwind

**`__mocks__/`:**
- Purpose: Jest mock implementations
- Generated: No (manually maintained)
- Committed: Yes
- Usage: Jest automatically uses mocks when importing from modules

**`public/`:**
- Purpose: Static files served as `/[filename]`
- Generated: Partially (some images might be uploaded)
- Committed: Yes (for version-controlled assets)
- Subdirs: `images/`, `videos/`, `documents/`

**`.next/`:**
- Purpose: Next.js build output
- Generated: Yes (build artifact)
- Committed: No (.gitignore)
- Do NOT edit: Regenerated on each build

## Route Structure Summary

**Public Routes:**
- `/` → Homepage
- `/a-propos` → About page
- `/articles` → Article listing
- `/articles/[slug]` → Article detail
- `/messages` → Sermon/message listing
- `/messages/[id]` → Message detail
- `/culte` → Service information
- `/galerie` → Photo gallery
- `/agenda` → Calendar/events
- `/contact` → Contact form
- `/connexion` → Login page
- `/inscription` → Registration page
- `/mot-de-passe-oublie` → Password reset

**Member Routes (protected):**
- `/membres` → Member listing (requires auth)
- `/profil` → User profile

**Admin Routes (protected):**
- `/admin` → Admin dashboard
- `/admin/membres` → Member management
- `/admin/carnet-adresses` → Contact management
- `/admin/messages` → Message management
- `/admin/annonces` → Announcement management
- `/admin/anniversaires` → Birthday management
- `/admin/blog` → Blog article management
- `/admin/echos` → Echo/journal management
- `/admin/photos` → Photo management

---

*Structure analysis: 2026-02-19*
