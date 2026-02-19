---
phase: 01-bug-fixes-hardening
plan: "01"
subsystem: auth-role-system
tags: [firebase, firestore, auth, roles, bugfix]
dependency_graph:
  requires: []
  provides: [unified-role-model, setDoc-merge-saveUserProfile]
  affects: [hooks/use-user-data, lib/firebase-helpers, lib/firebase-utils, types/index, firestore.rules]
tech_stack:
  added: []
  patterns: [setDoc-with-merge, role-field-derivation, transition-rules]
key_files:
  created: []
  modified:
    - lib/firebase-helpers.ts
    - lib/firebase-utils.ts
    - hooks/use-user-data.tsx
    - types/index.ts
    - firestore.rules
    - components/auth/profile-card.tsx
decisions:
  - "setDoc with merge chosen over addDoc/updateDoc split to handle both new and existing user docs atomically"
  - "isAdmin remains as a derived value (role === 'admin') in application code — never stored in Firestore"
  - "Firestore rules use dual-check (role == 'admin' OR isAdmin == true) for backward compatibility during transition"
metrics:
  duration: "~20 minutes"
  completed: "2026-02-19"
  tasks_completed: 2
  files_modified: 6
---

# Phase 01 Plan 01: saveUserProfile Bug Fix & Role Unification Summary

**One-liner:** Fixed "No document to update" error for new users by switching to setDoc+merge, and unified authorization to single `role` field eliminating isAdmin boolean conflicts.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Fix saveUserProfile to use setDoc with merge | 6c74446 | lib/firebase-helpers.ts, lib/firebase-utils.ts |
| 2 | Unify role system across types, hooks, and Firestore rules | a36e909 | types/index.ts, hooks/use-user-data.tsx, firestore.rules, components/auth/profile-card.tsx |

## What Was Built

### Task 1 — saveUserProfile Bug Fix (FIX-02)

Both `lib/firebase-helpers.ts` and `lib/firebase-utils.ts` had `saveUserProfile` functions that called `updateDoc` when creating a new user document. `updateDoc` requires the document to already exist — so new users got "No document to update" errors.

**Fix:** Replaced `updateDoc` with `setDoc(..., { merge: true })` in both files. With `merge: true`, setDoc creates the document if it doesn't exist or merges fields if it does. The `createdAt` field is only added when the document doesn't exist (checked via `getDoc` before writing).

`lib/firebase-utils.ts`'s `saveUserProfile` was marked `@deprecated` pointing to the canonical version in `lib/firebase-helpers.ts`.

**Call site audit:** Neither `saveUserProfile` function is called from outside the two helper files — no call sites needed updating.

### Task 2 — Role System Unification (FIX-03)

The codebase had conflicting role representations:
- `User` interface had `roles: string[]` + `isAdmin?: boolean`
- `hooks/use-user-data.tsx` read `data.isAdmin === true` from Firestore
- `firestore.rules` checked `data.isAdmin == true`

**Fixes applied:**

**`types/index.ts`:** Replaced `roles: string[]` and `isAdmin?: boolean` with a single `role: 'admin' | 'member' | 'visitor'` field.

**`hooks/use-user-data.tsx`:** Updated `UserData` interface to use `role` field. The `onSnapshot` callback now reads `data.role` (not `data.isAdmin`). The exported `isAdmin` value is derived as `userData?.role === 'admin'` — it is never read directly from Firestore.

**`firestore.rules`:** Updated `isAdmin()` function to check `data.role == 'admin'` with a fallback to `data.isAdmin == true` for existing admin documents that haven't been migrated yet. Comment marks this as a transition rule.

**`lib/firebase-helpers.ts`:** The `saveUserProfile` function writes `role` field (defaulting to `'member'`), never `isAdmin`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed profile-card.tsx broken by User type change**
- **Found during:** Task 2 verification (TypeScript check)
- **Issue:** `components/auth/profile-card.tsx` referenced `user.roles` (old plural array) and `user.memberInfo.ministries` (typo, should be `ministry`), both of which no longer existed after type update
- **Fix:** Updated to `user.role` (single Badge display) and `user.memberInfo.ministry`
- **Files modified:** `components/auth/profile-card.tsx`
- **Commit:** a36e909

## Key Decisions Made

1. **setDoc with merge** — Atomic solution that handles both create and update without conditional branches or separate addDoc/updateDoc calls.

2. **isAdmin derived, not stored** — The `isAdmin` boolean remains available to consumers (it's returned by `useUserData`) but is computed from `role === 'admin'` rather than read from Firestore. This eliminates the risk of the stored boolean getting out of sync with the role field.

3. **Transition support in Firestore rules** — Rather than requiring all admin documents to be migrated before the rules update goes live, the dual-check `(role == 'admin' || isAdmin == true)` ensures existing admin users remain functional. The comment marks it for eventual cleanup.

## Pre-existing Errors (Out of Scope)

The TypeScript compiler reported ~50 pre-existing errors across the codebase (duplicate exports in firebase-utils.ts, missing type properties in blog/echo components, etc.). These are not caused by this plan's changes and are logged for awareness. They should be addressed in a separate plan.

## Self-Check: PASSED

All modified files exist on disk. Both task commits verified in git history. Key artifact patterns confirmed:
- `setDoc` appears 3 times in lib/firebase-helpers.ts
- `role === 'admin'` appears 2 times in hooks/use-user-data.tsx
- `data.role` appears in firestore.rules isAdmin() function
