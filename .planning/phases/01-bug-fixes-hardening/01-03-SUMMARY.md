---
phase: 01-bug-fixes-hardening
plan: 03
subsystem: auth
tags: [firebase, cookies, httpOnly, auth-token, onIdTokenChanged, server-actions]

# Dependency graph
requires:
  - phase: 01-bug-fixes-hardening
    provides: deleteMessage Server Action using Admin SDK with cookies().get('auth-token')
provides:
  - httpOnly auth-token cookie set on login via setAuthCookie Server Action
  - automatic cookie refresh on Firebase token renewal (onIdTokenChanged)
  - clearAuthCookie called on logout
affects: [app/admin/messages/actions.ts, any Server Action reading auth-token cookie]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Client Components call Server Actions (setAuthCookie) to write httpOnly cookies after Firebase auth"
    - "onIdTokenChanged used instead of onAuthStateChanged for automatic cookie refresh every hour"

key-files:
  created:
    - lib/auth/session.ts
  modified:
    - components/auth/login-form.tsx
    - components/auth-provider.tsx

key-decisions:
  - "Separate session.ts from actions.ts — avoids bundling conflicts when importing from Client Components"
  - "onIdTokenChanged replaces onAuthStateChanged — fires on both login and hourly token renewals"
  - "maxAge 3600s matches Firebase ID token TTL; onIdTokenChanged keeps cookie current"

patterns-established:
  - "Pattern: Client auth flow = Firebase signIn → getIdToken() → setAuthCookie(idToken) Server Action"
  - "Pattern: Auth provider uses onIdTokenChanged for persistent server-side cookie sync"

requirements-completed:
  - FIX-01

# Metrics
duration: 8min
completed: 2026-02-19
---

# Phase 1 Plan 03: Auth Cookie Fix Summary

**httpOnly auth-token cookie set via Server Action on Firebase login and refreshed hourly via onIdTokenChanged, enabling deleteMessage Server Action to authenticate users.**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-02-19T00:00:00Z
- **Completed:** 2026-02-19T00:08:00Z
- **Tasks:** 3
- **Files modified:** 3

## Accomplishments
- Created `lib/auth/session.ts` with `setAuthCookie` and `clearAuthCookie` Server Actions
- Modified `login-form.tsx` to call `setAuthCookie(idToken)` after `signInWithEmailAndPassword`
- Replaced `onAuthStateChanged` with `onIdTokenChanged` in `auth-provider.tsx` to sync cookie on every token renewal
- Fixed redirect logic from `userData?.isAdmin` to `userData?.role === 'admin'`

## Task Commits

Each task was committed atomically:

1. **Task 1: Créer lib/auth/session.ts** - `b2acea8` (feat)
2. **Task 2: Appeler setAuthCookie dans login-form.tsx** - `4c56c22` (feat)
3. **Task 3: Rafraîchir le cookie sur onIdTokenChanged** - `068b111` (feat)

## Files Created/Modified
- `lib/auth/session.ts` - Server Actions setAuthCookie and clearAuthCookie using next/headers cookies()
- `components/auth/login-form.tsx` - Calls setAuthCookie(idToken) post-login; uses role === 'admin' for redirect
- `components/auth-provider.tsx` - Uses onIdTokenChanged to keep auth-token cookie in sync with Firebase token lifecycle

## Decisions Made
- Kept `lib/auth/session.ts` separate from `lib/auth/actions.ts` to avoid next-safe-action bundling conflicts when importing from Client Components
- Used `onIdTokenChanged` (not `onAuthStateChanged`) because it fires on both initial login and hourly token renewals — ensures cookie never expires while user is active

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- Pre-existing TypeScript errors in `auth-provider.tsx` lines 179 and 213 (`auth as Auth` type conflicts with `MockAuthInterface`) — these existed before this plan and are out of scope. No new errors introduced.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- auth-token cookie is now set on login and refreshed hourly
- `deleteMessage` Server Action should no longer return "Non authentifié" for authenticated users
- Manual verification needed: login in browser, check DevTools cookies panel for `auth-token`, attempt deleteMessage
- Plan 01-04 (role-based redirects and admin detection) can proceed

## Self-Check: PASSED

- FOUND: lib/auth/session.ts
- FOUND: components/auth/login-form.tsx
- FOUND: components/auth-provider.tsx
- FOUND: .planning/phases/01-bug-fixes-hardening/01-03-SUMMARY.md
- Commits b2acea8, 4c56c22, 068b111 all verified in git log

---
*Phase: 01-bug-fixes-hardening*
*Completed: 2026-02-19*
