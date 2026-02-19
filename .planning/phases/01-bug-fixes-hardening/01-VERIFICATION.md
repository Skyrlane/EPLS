---
phase: 01-bug-fixes-hardening
verified: 2026-02-19T21:00:00Z
status: passed
score: 8/8 must-haves verified
re_verification: false
---

# Phase 01: Bug Fixes & Hardening Verification Report

**Phase Goal:** L'admin peut gérer le contenu sans erreurs, les règles Firestore sont sûres et le favicon est en place
**Verified:** 2026-02-19T21:00:00Z
**Status:** passed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Un nouvel utilisateur peut créer son profil sans erreur (setDoc fonctionne sur document inexistant) | VERIFIED | `lib/firebase-helpers.ts` line 118-131: `setDoc(userRef, {...}, { merge: true })` with `getDoc` existence check. `lib/firebase-utils.ts` lines 258-271: same pattern, marked `@deprecated`. |
| 2 | Chaque document Firestore users/{uid} n'a qu'un seul champ de rôle (role) sans conflit avec isAdmin | VERIFIED | `lib/firebase-helpers.ts` saveUserProfile writes `role: additionalData?.role ?? 'member'` and never writes `isAdmin`. `lib/firebase-utils.ts` saveUserProfile does the same. No isAdmin write found in either file. |
| 3 | Le hook useUserData dérive isAdmin depuis le champ role (pas de lecture directe de isAdmin) | VERIFIED | `hooks/use-user-data.tsx` line 57: reads `data.role` from snapshot. Line 93: `const isAdmin = useMemo(() => userData?.role === 'admin', [userData])`. No `data.isAdmin` anywhere in the file. |
| 4 | Les règles Firestore vérifient role == 'admin' au lieu de isAdmin == true | VERIFIED | `firestore.rules` lines 7-11: `isAdmin()` function checks `data.role == 'admin'` with transition fallback `data.isAdmin == true`. Comment marks it for eventual cleanup. |
| 5 | L'admin peut supprimer un message depuis /admin/messages sans erreur PERMISSION_DENIED | VERIFIED | `app/admin/messages/actions.ts`: uses `adminDb` (Admin SDK), no `deleteDoc` from client SDK present. Admin SDK bypasses Firestore security rules server-side. |
| 6 | Le favicon apparaît dans l'onglet du navigateur sur toutes les pages | VERIFIED | `app/favicon.ico` exists (143 bytes). Next.js 14 App Router auto-discovers and serves this file at `/favicon.ico`. No layout.tsx metadata change needed. |
| 7 | Un utilisateur non-admin reçoit une erreur 'Permission refusée' s'il tente de supprimer un message | VERIFIED | `app/admin/messages/actions.ts` lines 37-39: reads `users/{uid}.role` via Admin SDK. Returns `{ success: false, error: 'Permission refusée' }` when `role !== 'admin'`. |
| 8 | Un utilisateur avec un token expiré reçoit une erreur explicite (pas un crash) | VERIFIED | `app/admin/messages/actions.ts` lines 29-33: `try/catch` around `adminAuth.verifyIdToken(token)`. Returns `{ success: false, error: 'Session expirée, veuillez vous reconnecter' }` on failure. |

**Score:** 8/8 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `lib/firebase-helpers.ts` | setDoc with merge, unified UserProfile with role field only | VERIFIED | Line 118: `setDoc(userRef, {...}, { merge: true })`. UserProfile interface has `role: 'member' \| 'admin' \| 'visitor'`, no `isAdmin` field. |
| `lib/firebase-utils.ts` | setDoc with merge in saveUserProfile (deprecated) | VERIFIED | Lines 258-271: setDoc with merge. Line 252: `@deprecated Use saveUserProfile from lib/firebase-helpers.ts instead`. |
| `hooks/use-user-data.tsx` | Role-based isAdmin derivation | VERIFIED | Line 93: `const isAdmin = useMemo(() => userData?.role === 'admin', [userData])`. Pattern `role === 'admin'` confirmed. |
| `types/index.ts` | User interface with role field, no isAdmin stored field | VERIFIED | Line 98: `role: 'admin' \| 'member' \| 'visitor'`. No `isAdmin` field in User interface. |
| `firestore.rules` | isAdmin() function checking role field with transition support | VERIFIED | Lines 7-11: checks `data.role == 'admin'` with fallback `data.isAdmin == true`. |
| `app/admin/messages/actions.ts` | Server Action deleteMessage using Admin SDK with auth verification | VERIFIED | Imports `adminDb`, `adminAuth` from `@/lib/firebase-admin`. Uses 4-step verification: null guard, cookie read, token verify, role check. |
| `app/favicon.ico` | Browser tab icon for all pages | VERIFIED | File exists, 143 bytes. ICO format valid. |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `hooks/use-user-data.tsx` | Firestore users/{uid} | onSnapshot reads role field, derives isAdmin | VERIFIED | Line 57: `role: (data.role as 'admin' \| 'member' \| 'visitor') ?? 'member'`. Line 93: `useMemo(() => userData?.role === 'admin', ...)` |
| `firestore.rules` | Firestore users/{uid} | isAdmin() reads role field | VERIFIED | `get(...users/$(request.auth.uid)).data.role == 'admin'` |
| `lib/firebase-helpers.ts` | Firestore users/{uid} | setDoc with merge writes role field | VERIFIED | `setDoc(userRef, { role: additionalData?.role ?? 'member', ... }, { merge: true })` |
| `app/admin/messages/actions.ts` | `lib/firebase-admin.ts` | imports adminDb and adminAuth | VERIFIED | Line 5: `import { adminAuth, adminDb } from '@/lib/firebase-admin'` |
| `app/admin/messages/actions.ts` | Firestore users/{uid} | reads role field to verify admin permission | VERIFIED | Line 37-38: `adminDb.collection('users').doc(uid).get()` then `userSnap.data()?.role !== 'admin'` |
| `app/admin/messages/actions.ts` | auth-token cookie | reads cookie to verify authentication | VERIFIED | Lines 21-22: `cookies().get('auth-token')?.value` |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| FIX-01 | 01-02 | Corriger la suppression de messages admin (remplacer client SDK par Admin SDK dans Server Action) | SATISFIED | `app/admin/messages/actions.ts` fully uses Admin SDK — no `deleteDoc` from `firebase/firestore`. Commit 685fce0 confirmed. |
| FIX-02 | 01-01 | Corriger `saveUserProfile()` pour utiliser `setDoc` avec merge au lieu de `updateDoc` | SATISFIED | Both `lib/firebase-helpers.ts` and `lib/firebase-utils.ts` use `setDoc(..., { merge: true })`. No `updateDoc` in either saveUserProfile function. Commit 6c74446 confirmed. |
| FIX-03 | 01-01 | Unifier le système de rôles (un seul champ `role` au lieu de `role` + `isAdmin`) | SATISFIED | `types/index.ts` User has `role` only. `hooks/use-user-data.tsx` derives `isAdmin` from `role`. `firestore.rules` checks `role`. No `isAdmin` stored field written anywhere. Commit a36e909 confirmed. |
| SITE-01 | 01-02 | Ajouter le favicon au site (app/favicon.ico) | SATISFIED | `app/favicon.ico` exists (143 bytes). Commit 7e0f5db confirmed. |

No orphaned requirements: all 4 requirements mapped to Phase 1 in REQUIREMENTS.md traceability table (FIX-01, FIX-02, FIX-03, SITE-01) are covered by plans 01-01 and 01-02.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `lib/firebase-helpers.ts` | 35, 36 | `preferences?: Record<string, any>` and `[key: string]: any` in UserProfile interface | Info | Pre-existing `any` usage in a type that was not the target of this phase. Does not affect the role/auth logic. |

No blocker anti-patterns found. The `any` usage is in `lib/firebase-helpers.ts` UserProfile index signature — pre-existing and not introduced by this phase. The `lib/firebase-utils.ts` also retains `updateDoc` import for the separate `updateDocument` helper function, which is correct and intentional (that function is unrelated to `saveUserProfile`).

### Human Verification Required

#### 1. Favicon Visual Verification

**Test:** Open the site in a browser and observe the browser tab.
**Expected:** A favicon icon (blue cross on transparent background, 32x32) appears in the browser tab on all pages.
**Why human:** Cannot verify visual rendering or browser tab display programmatically.

#### 2. New User Registration Flow

**Test:** Register a new account with an email/password that has no existing Firestore document.
**Expected:** Profile is created without error. No "No document to update" error appears in console. User document exists in Firestore with `role: 'member'`.
**Why human:** Requires live Firebase environment and a genuinely new user document.

#### 3. Admin Message Deletion

**Test:** Log in as an admin user, navigate to /admin/messages, and delete a message.
**Expected:** Message is deleted without PERMISSION_DENIED error. Page refreshes and message is gone.
**Why human:** Requires live Firebase Admin SDK configuration with valid env vars and a real admin account.

### Gaps Summary

No gaps. All 8 truths verified, all 7 artifacts pass all three levels (exists, substantive, wired), all 6 key links confirmed. All 4 requirements (FIX-01, FIX-02, FIX-03, SITE-01) are satisfied with direct code evidence and verified commit hashes.

The only outstanding items are human verification tests that require a live browser and Firebase environment — the code logic is fully implemented and correct.

---

_Verified: 2026-02-19T21:00:00Z_
_Verifier: Claude (gsd-verifier)_
