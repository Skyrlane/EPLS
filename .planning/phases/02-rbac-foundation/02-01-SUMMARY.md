---
phase: 02-rbac-foundation
plan: 01
subsystem: auth
tags: [firebase, firestore, typescript, rbac, roles]

# Dependency graph
requires:
  - phase: 01-bug-fixes-hardening
    provides: Admin SDK working, normalizeRole pattern established at read boundary
provides:
  - 4-level role hierarchy (ami/membre/conseil/admin) in TypeScript types
  - normalizeRole with backward compat for old values (member, visitor)
  - Script to create 3 shared Firebase Auth accounts with Firestore docs
  - Account creation: ami07@epls.fr, membre07@epls.fr, conseil07@epls.fr
affects: [03-route-guards, 02-02-firestore-rules]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "normalizeRole at read boundary handles French-cased and old English values"
    - "Default role is now ami (lowest privilege), not member"
    - "Admin SDK script uses idempotent set with merge:true for Firestore docs"

key-files:
  created:
    - scripts/create-shared-accounts.ts
  modified:
    - types/index.ts
    - hooks/use-user-data.tsx
    - lib/firebase-helpers.ts
    - lib/firebase-utils.ts
    - app/exemples/components/page.tsx

key-decisions:
  - "4-level hierarchy: ami < membre < conseil < admin (replaces admin|member|visitor)"
  - "Old values member->membre, visitor->ami, visiteur->ami for backward compat"
  - "Default role changed from member to ami (principle of least privilege)"
  - "Script initializes Admin SDK standalone (not from lib/firebase-admin.ts) to avoid Next.js module coupling"
  - "Idempotent script: auth/email-already-exists is caught, Firestore uses merge:true"

patterns-established:
  - "Role normalization: centralised in normalizeRole(), covers all case variants"
  - "Principle of least privilege: default is ami, not membre"

requirements-completed: [RBAC-01, RBAC-02, RBAC-03, RBAC-04]

# Metrics
duration: 15min
completed: 2026-02-19
---

# Phase 02 Plan 01: RBAC Foundation Summary

**4-level role hierarchy (ami/membre/conseil/admin) implemented across codebase with backward-compat normalizeRole and an idempotent Admin SDK script to provision 3 shared test accounts**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-02-19
- **Completed:** 2026-02-19 (Tasks 1-2 auto-complete; Task 3 is human-action checkpoint)
- **Tasks:** 2/3 auto-tasks complete (Task 3 = human-action, pending user execution)
- **Files modified:** 6

## Accomplishments

- Updated role type from 3 levels (admin/member/visitor) to 4 levels (ami/membre/conseil/admin) across all relevant files
- Rewrote normalizeRole with backward compatibility: old Firestore values (member, visitor, Membre, Visiteur) map correctly to new roles
- Created idempotent script `scripts/create-shared-accounts.ts` to provision ami07, membre07, conseil07 accounts

## Task Commits

Each task was committed atomically:

1. **Task 1: Update TypeScript role types and normalizeRole** - `def16ba` (feat)
2. **Task 2: Create Admin SDK script for shared accounts** - `abbd647` (feat)
3. **Task 3: Run account creation script** - _pending human action_

## Files Created/Modified

- `types/index.ts` - User.role updated: `'ami' | 'membre' | 'conseil' | 'admin'`
- `hooks/use-user-data.tsx` - UserData.role updated, normalizeRole rewritten, fallback defaults changed to 'ami'
- `lib/firebase-helpers.ts` - UserProfile.role updated, saveUserProfile default changed to 'ami'
- `lib/firebase-utils.ts` - saveUserProfile default changed to 'ami'
- `app/exemples/components/page.tsx` - SelectItem values updated from member/visitor to membre/ami
- `scripts/create-shared-accounts.ts` - NEW: Admin SDK script to provision 3 shared accounts

## Decisions Made

- 4-level hierarchy chosen: ami (lowest, was visitor) < membre (was member) < conseil (new) < admin
- Old values map: `member` → `membre`, `visitor`/`visiteur` → `ami` (backward compat in normalizeRole)
- Default role changed from `member` to `ami` — principle of least privilege
- Script is standalone (does not import from `lib/firebase-admin.ts`) to avoid Next.js module coupling when running via tsx
- Idempotent by design: catching `auth/email-already-exists` and using `merge:true` on Firestore writes

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

Pre-existing TypeScript errors exist in the codebase (unrelated to role changes). These were present before this plan and are out of scope. The role-specific changes have zero TypeScript errors.

## User Setup Required

**Task 3 requires manual execution.** See checkpoint below.

The user must run the account creation script:

```bash
npx tsx scripts/create-shared-accounts.ts
```

Requirements:
- `.env.local` must contain `FIREBASE_SERVICE_ACCOUNT_BASE64` (base64-encoded service account JSON)
- Alternatively: `FIREBASE_PROJECT_ID` + `FIREBASE_CLIENT_EMAIL` + `FIREBASE_PRIVATE_KEY`

Then verify in Firebase Console:
- Authentication tab: confirm `ami07@epls.fr`, `membre07@epls.fr`, `conseil07@epls.fr` exist
- Firestore > users collection: confirm each has a document with correct `role` field

## Next Phase Readiness

- Role types are ready for Plan 02 (Firestore security rules using role values)
- Script must be executed before verifying the accounts exist
- Pre-existing TS errors in codebase are unrelated to RBAC work and do not block Phase 02

---
*Phase: 02-rbac-foundation*
*Completed: 2026-02-19*
