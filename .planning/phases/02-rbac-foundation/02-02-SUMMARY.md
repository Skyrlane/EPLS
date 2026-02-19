---
phase: 02-rbac-foundation
plan: "02"
subsystem: database
tags: [firestore, security-rules, rbac, role-hierarchy]

# Dependency graph
requires:
  - phase: 02-01
    provides: 4-level role types defined (ami, membre, conseil, admin) with backward-compat in normalizeRole

provides:
  - Firestore security rules with roleLevel() and hasRole() helper functions
  - Role field protected from self-modification on users collection
  - Backward-compatible role mappings for legacy Firestore docs (member->2, visitor->1)
  - hasRole(minRole) ready for Phase 3 to use on protected collections

affects:
  - 03 (Phase 3 that will call hasRole() on restricted collections like membres area)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "hasRole(minRole) pattern: compares numeric role levels for hierarchical access control"
    - "Split allow create / allow update instead of allow write — enables field-level protection"
    - "affectedKeys().hasAny(['role']) to block role field self-modification"

key-files:
  created: []
  modified:
    - firestore.rules

key-decisions:
  - "hasRole() defined but not applied to existing collections yet — Phase 3 will wire it up; avoids a large refactor mid-phase"
  - "Backward-compat in roleLevel(): member=2, visitor=1 — prevents locking out existing Firestore user docs before role migration completes"
  - "Two separate 'allow update' rules for users (self without role + admin) — Firestore ORs multiple allow rules so both work independently"

patterns-established:
  - "Role protection: split allow write into allow create + allow update with affectedKeys check"
  - "Function-based RBAC: roleLevel() numeric comparison enables O(1) hierarchy checks in rules"

requirements-completed:
  - RBAC-05

# Metrics
duration: 2min
completed: 2026-02-19
---

# Phase 02 Plan 02: Firestore Role Hierarchy Rules Summary

**Firestore security rules extended with roleLevel()/hasRole() hierarchy functions and role field self-modification protection on users collection, deployed to production**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-02-19T21:20:00Z
- **Completed:** 2026-02-19T21:20:59Z
- **Tasks:** 2
- **Files modified:** 1

## Accomplishments

- Added `roleLevel()` function mapping 4 role names to numeric levels (ami=1, membre=2, conseil=3, admin=4) with backward-compat for legacy values (member=2, visitor=1)
- Added `hasRole(minRole)` function for Phase 3 to use — reads user's role from Firestore and compares levels
- Replaced old permissive `allow write` on users collection with split `allow create` + two `allow update` rules — users can update their own doc but not the `role` field; admins can update anything
- Deployed updated rules to Firebase project `epls-production` — rules are live

## Task Commits

Each task was committed atomically:

1. **Task 1: Add hasRole() and roleLevel() to Firestore rules, protect role field** - `f8126be` (feat)
2. **Task 2: Deploy Firestore rules to Firebase** - no additional commit (CLI deploy, no code change)

**Plan metadata:** (docs commit pending)

## Files Created/Modified

- `firestore.rules` - Added roleLevel() and hasRole() functions, replaced users match block with split allow create + allow update rules

## Decisions Made

- `hasRole()` is defined but NOT applied to existing collection rules yet — plan explicitly defers that to Phase 3 to avoid a large refactor mid-phase
- `roleLevel()` includes backward-compat: `member` maps to 2 (same as `membre`), `visitor` maps to 1 (same as `ami`) — prevents existing Firestore user documents from being locked out before role migration
- Two separate `allow update` rules in users match block (self-without-role and admin) — Firestore evaluates multiple `allow` statements as OR, so both paths work independently

## Deviations from Plan

None - plan executed exactly as written.

Firebase CLI emitted warnings about `hasRole` being unused (expected — it's defined for future use) and false-positive warnings about `get` and `request` inside the `let` expression. Rules compiled and deployed successfully despite these warnings.

## Issues Encountered

Firebase CLI warnings during deploy (lines 26-28):
- `[W] 26:14 - Unused function: hasRole` — expected, function is defined for Phase 3 use
- `[W] 27:22 - Invalid function name: get` and `[W] 27:67 - Invalid variable name: request` — false positives from static analysis of `let userRole = get(...).data.role` inside hasRole(). Rules compiled successfully.

## User Setup Required

None - no external service configuration required. Firebase deployment was automated.

## Next Phase Readiness

- `hasRole()` is live in Firestore rules and ready for Phase 3 to call on member-only collections
- Role field protection is active — users cannot escalate their own privileges via client SDK
- Existing users with legacy role values (`member`, `visitor`) are not locked out
- No blockers for Phase 3

---
*Phase: 02-rbac-foundation*
*Completed: 2026-02-19*
