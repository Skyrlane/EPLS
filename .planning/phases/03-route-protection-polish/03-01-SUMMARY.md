---
phase: 03-route-protection-polish
plan: 01
subsystem: auth
tags: [role-based-access, firebase, react, nextjs, guard-component]

# Dependency graph
requires:
  - phase: 02-rbac-foundation
    provides: 4-level role hierarchy (ami/membre/conseil/admin) in Firestore users/{uid}.role + normalizeRole() in use-user-data.tsx
provides:
  - MemberGuard component with minRole prop and ROLE_LEVEL map for client-side role enforcement
  - /infos-docs/membres protected at conseil+ level
  - /infos-docs/anniversaires protected at membre+ level
  - /infos-docs/carnet-adresses protected at membre+ level
affects:
  - 03-route-protection-polish (subsequent plans in this phase)
  - Any future protected pages following same pattern

# Tech tracking
tech-stack:
  added: []
  patterns:
    - MemberGuard wrapper component pattern for role-gated pages
    - useUserData() (not useAuth) for combined auth+Firestore loading state

key-files:
  created:
    - components/auth/member-guard.tsx
  modified:
    - app/infos-docs/membres/page.tsx
    - app/infos-docs/anniversaires/page.tsx
    - app/infos-docs/carnet-adresses/page.tsx

key-decisions:
  - "MemberGuard uses useUserData() not useAuth() — combined loading flag avoids premature redirects before Firestore doc fetch completes"
  - "Insufficient-role redirect goes to /acces-refuse, not / — explicit access denied page for better UX"
  - "Page content extracted to MembresPageContent inner component for membres/page.tsx to keep MemberGuard at top-level default export"
  - "ROLE_LEVEL map duplicated client-side from Firestore roleLevel() function — zero-dependency, works in React components"

patterns-established:
  - "MemberGuard pattern: wrap page JSX with <MemberGuard minRole='X'> to enforce role-based access without manual useAuth+useEffect boilerplate"
  - "Inner component pattern: extract page logic to PageContent component when default export needs wrapping"

requirements-completed: [PROT-01, PROT-02, PROT-03, PROT-04]

# Metrics
duration: 3min
completed: 2026-02-24
---

# Phase 03 Plan 01: MemberGuard Role-Based Access Control Summary

**MemberGuard component with ROLE_LEVEL hierarchy (ami<membre<conseil<admin) applied to three /infos-docs pages, replacing manual useAuth+useEffect redirects**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-02-24T19:19:53Z
- **Completed:** 2026-02-24T19:22:18Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Created `components/auth/member-guard.tsx` with `minRole` prop, `ROLE_LEVEL` map, and `useUserData()` integration
- Applied `MemberGuard minRole="conseil"` to `/infos-docs/membres` — conseil+ only
- Applied `MemberGuard minRole="membre"` to `/infos-docs/anniversaires` and `/infos-docs/carnet-adresses` — membre+ only
- Removed all manual `useAuth` + `useEffect` redirect boilerplate from all three pages
- Build passes without errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Create MemberGuard component** - `b2f9b0e` (feat)
2. **Task 2: Apply MemberGuard to trois pages /infos-docs protégées** - `e194e0f` (feat)

## Files Created/Modified

- `components/auth/member-guard.tsx` - Role-gated guard component with ROLE_LEVEL map and minRole prop; uses useUserData() for combined auth+Firestore loading; redirects unauthenticated to /connexion?callbackUrl={path} and insufficient-role to /acces-refuse
- `app/infos-docs/membres/page.tsx` - Wrapped with MemberGuard minRole="conseil"; extracted page logic to MembresPageContent inner component; removed useAuth/useRouter/useEffect auth redirect
- `app/infos-docs/anniversaires/page.tsx` - Wrapped with MemberGuard minRole="membre"; removed useAuth/useRouter/useEffect auth redirect; simplified to functional component with no auth state
- `app/infos-docs/carnet-adresses/page.tsx` - Wrapped with MemberGuard minRole="membre"; removed useAuth/useRouter/useEffect auth redirect; simplified to functional component with no auth state

## Decisions Made

- **useUserData() vs useAuth():** MemberGuard uses `useUserData()` which returns a combined `loading` flag (authLoading || firestoreLoading). This prevents premature redirects during the window where Firebase Auth resolves but the Firestore user document hasn't loaded yet — which would cause brief flashes or wrong redirects.
- **Redirect targets:** Unauthenticated → `/connexion?callbackUrl={path}` (with encodeURIComponent). Insufficient role → `/acces-refuse` (not root `/`). This matches the plan spec and provides better UX context.
- **Inner component pattern for membres/page.tsx:** The default export wraps `<MembresPageContent />` with `<MemberGuard minRole="conseil">`. This keeps the guard at the top level while allowing hooks (useState, useMemo) inside the inner component per React rules.
- **Known gap (documented, not fixed per plan):** Firestore rules for `birthdays` and `contacts` collections only check `request.auth != null`, not role. Client-side MemberGuard is the enforcement layer for Phase 3. Firestore-level role enforcement is out of scope.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

Pre-existing TypeScript errors in unrelated files (admin pages, connexion page) were detected by `npx tsc --noEmit` — none are in the files modified by this plan. These are out-of-scope per deviation rule boundary and were not fixed.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- MemberGuard component is ready to apply to any future protected page
- /acces-refuse page must exist for redirects to work (verify in Phase 03 follow-up plans)
- Firestore security rules for `birthdays` and `contacts` collections still only check auth, not role — Phase 3 subsequent plans should address if needed
