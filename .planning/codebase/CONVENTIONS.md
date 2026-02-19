# Coding Conventions

**Analysis Date:** 2026-02-19

## Naming Patterns

**Files:**
- PascalCase for components: AirtableImporter.tsx, ErrorBoundary.tsx, AuthProvider.tsx
- kebab-case for utilities/hooks: use-firestore.ts, use-firebase-auth.ts, use-realtime-collection.ts
- kebab-case for routes: a-propos/, mot-de-passe-oublie/, infos-docs/
- SCREAMING_SNAKE_CASE for constants: BLOG_TAGS, API_KEY

**Functions:**
- camelCase for all function names: login(), getDocument(), updateDisplayName(), calculateReadingTime(), downloadImage()
- camelCase for exported hook names: useFirestore, useRealtimeCollection, useFirebaseAuth
- Function names descriptive: getUnimportedArticles(), uploadBlogImage(), generateSlug()

**Variables:**
- camelCase for local variables and state: isSubmitting, formData, userData, articles, loading
- Prefix boolean variables: isLoading, hasError, isConfigured, isMock, alreadyExists, isActive
- Collections use plural forms: articles, events, members, documents, contacts

**Types/Interfaces:**
- PascalCase for all type names: AuthUser, AuthContextType, FirestoreStatus, ArticleToImport, UseFirestoreOptions
- Prefix compound types descriptively: MockAuthInterface, UserCredential
- Use JSDoc-style interfaces with properties documented

## Code Style

**Formatting:**
- Project uses .eslintrc.json (extends next/core-web-vitals)
- No .prettierrc file found - relies on ESLint defaults
- Indentation: 2 spaces
- Trailing semicolons required (enforced by ESLint)

**Linting:**
- ESLint configured with Next.js recommended rules (next/core-web-vitals)
- Run with: npm run lint
- TypeScript strict mode enabled (strict: true in tsconfig.json)

**Quote Style:**
- Double quotes for JSX and regular strings
- Backticks for template literals

## Import Organization

**Order:**
1. React/library imports
2. Firebase/3rd-party imports
3. Internal aliases (@/lib, @/hooks)
4. Component imports (@/components)
5. Utility imports
6. Type imports (@/types)

**Path Aliases:**
- All imports use @/ alias for root-relative imports
- Configured in tsconfig.json: "@/*": ["./*"]
- Common patterns: @/lib/*, @/hooks/*, @/components/*, @/types/*

## Error Handling

**Patterns:**
- Try-catch blocks for async operations (Firebase, API calls)
- Console.error() for detailed debugging
- Status tracking with "idle" | "loading" | "success" | "error" state machine
- Toast notifications for user-facing errors
- Server-side actions use structured error responses: { success: false, error: string }

**Firebase-Specific:**
- Errors are typed as FirestoreError for Firestore operations
- Auth errors have code property for translation to user messages
- Error codes mapped to French messages

## Logging

**Framework:** console methods (no logging library)

**Patterns:**
- Use emoji prefixes for readability
- Debug logs with detailed context
- Error logs with full stack
- Server action logs prefixed with task context
- Firestore/HTTP request logging for debugging

## Comments

**When to Comment:**
- JSDoc above functions describing purpose, parameters, and return
- Explain "why" not "what" - code should be self-documenting
- Complex algorithms or non-obvious logic
- Important security or performance notes

## Function Design

**Size:**
- Typical hook functions: 100-400 lines
- Individual functions: keep under 50 lines where reasonable
- Utility functions extracted for reusability

**Parameters:**
- Prefer objects for multiple parameters
- Use generics for type safety
- Optional parameters in interface

**Return Values:**
- Hooks return object with multiple values
- Server actions return structured objects
- Async functions return typed Promises: Promise<T | null>
- Null for missing data (not undefined)

## Module Design

**Exports:**
- Default exports for page components
- Named exports for utilities and hooks
- Use barrel files in lib for consistent import paths

**API Routes:**
- Use Next.js App Router structure: app/api/[endpoint]/route.ts
- Export handler functions
- Return JSON responses with proper status codes

## React Patterns

**Component Types:**
- Server Components by default (no 'use client')
- Client Components: add 'use client' directive at top
- Hooks can only use 'use client' if they use client-side APIs

**Props:**
- Destructure in parameters
- Use TypeScript interfaces for props

**Hooks Usage:**
- Always use custom Firebase hooks from @/hooks/
- Never reimplement useFirestore, useRealtimeCollection, etc.
- Hooks called at top level only

## TypeScript Strictness

**Enforcement:**
- Strict mode enabled
- No implicit any enforced
- Explicit return types on functions recommended
- Type all component props with interfaces
- Use generics for reusable components/hooks

---

*Convention analysis: 2026-02-19*