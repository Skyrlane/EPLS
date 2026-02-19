---
phase: 01-bug-fixes-hardening
plan: "02"
subsystem: admin-messages-auth
tags: [firebase-admin, server-action, auth, favicon, fix]
dependency_graph:
  requires: [01-01]
  provides: [admin-sdk-delete-message, favicon]
  affects: [app/admin/messages/actions.ts, app/favicon.ico]
tech_stack:
  added: []
  patterns: [admin-sdk-server-action, cookie-auth-verification, role-check-server-side]
key_files:
  created:
    - app/favicon.ico
  modified:
    - app/admin/messages/actions.ts
decisions:
  - "cookies() used without await — consistent with existing lib/auth/actions.ts pattern (Next.js 14.2.7)"
  - "Admin SDK null guard retained — graceful degradation when env vars missing in development"
  - "PNG embedded in ICO format — valid for modern browsers, simpler than multi-resolution ICO"
metrics:
  duration: "~2 minutes"
  completed: "2026-02-19"
  tasks_completed: 2
  files_modified: 2
---

# Phase 01 Plan 02: deleteMessage Admin SDK Fix & Favicon Summary

**One-liner:** Fixed PERMISSION_DENIED in deleteMessage by switching to Admin SDK with cookie-based auth + role verification, and added a 32x32 ICO favicon for browser tab display.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Replace client SDK with Admin SDK in deleteMessage Server Action | 685fce0 | app/admin/messages/actions.ts |
| 2 | Add favicon.ico to the app directory | 7e0f5db | app/favicon.ico |

## What Was Built

### Task 1 — deleteMessage Admin SDK Fix (FIX-01)

The existing `deleteMessage` Server Action used `deleteDoc` from `firebase/firestore` (client SDK). Client SDK calls in Server Actions run without an authenticated user context, so Firestore security rules rejected them with PERMISSION_DENIED.

**Fix:** Complete rewrite using Firebase Admin SDK:

1. Removed `deleteDoc`, `doc` from `firebase/firestore` and `firestore` from `@/lib/firebase`
2. Added `adminAuth`, `adminDb` from `@/lib/firebase-admin` and `cookies` from `next/headers`
3. Implemented four-step verification before deletion:
   - Admin SDK null guard (graceful if env vars missing)
   - Read `auth-token` cookie — returns "Non authentifié" if missing
   - `adminAuth.verifyIdToken(token)` — returns "Session expirée, veuillez vous reconnecter" on failure
   - Check `users/{uid}.role === 'admin'` — returns "Permission refusée" for non-admins
4. Only after all checks pass, `adminDb.collection('messages').doc(messageId).delete()` is called
5. `revalidatePath('/messages')` and `revalidatePath('/')` kept for cache invalidation

The `role` field check directly leverages the unified role model established in Plan 01-01.

### Task 2 — Favicon (SITE-01)

No favicon existed in `app/` or `public/`. Added `app/favicon.ico` — a 32x32 pixel PNG embedded in ICO container format. Design: blue cross (`#4F6FBF`) on transparent background, matching the site's primary color theme.

Next.js 14 App Router auto-discovers `app/favicon.ico` and serves it at `/favicon.ico` with correct headers. No changes to `app/layout.tsx` metadata were needed.

## Deviations from Plan

None — plan executed exactly as written.

The plan suggested checking whether `cookies()` needed `await` based on existing usage. Confirmed: `lib/auth/actions.ts` uses `cookies()` without await (Next.js 14.2.7 pattern). Implementation matches.

## Key Decisions Made

1. **cookies() without await** — Consistent with existing `lib/auth/actions.ts` pattern for Next.js 14.2.7. Using `await` would cause a type mismatch since the existing code does not.

2. **Admin SDK null guard retained** — `adminAuth` and `adminDb` can be `undefined` when Firebase env vars are not set (dev environment without `.env.local`). The early return prevents crashes.

3. **PNG-in-ICO format** — A single 32x32 PNG embedded in an ICO container is valid for all modern browsers and simpler to generate programmatically than a multi-resolution ICO.

## Self-Check: PASSED

- `app/admin/messages/actions.ts` exists and modified
- `app/favicon.ico` exists (143 bytes)
- Commit 685fce0 verified in git history
- Commit 7e0f5db verified in git history
- No TypeScript errors in app/admin/messages/actions.ts
- `npm run build` passes
