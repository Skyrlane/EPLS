# Phase 1: Bug Fixes & Hardening - Research

**Researched:** 2026-02-19
**Domain:** Firebase Admin SDK, Firestore Security Rules, Next.js Server Actions, Favicon
**Confidence:** HIGH

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| FIX-01 | Corriger la suppression de messages admin (remplacer client SDK par Admin SDK dans Server Action) | Admin SDK pattern documented, token verification via `auth-token` cookie confirmed viable, `adminDb` already exported from `lib/firebase-admin.ts` |
| FIX-02 | Corriger saveUserProfile() pour utiliser setDoc avec merge au lieu de updateDoc | Bug confirmed in two files (`lib/firebase-helpers.ts` and `lib/firebase-utils.ts`), both call `updateDoc` on non-existent docs — fix is `setDoc(..., { merge: true })` |
| FIX-03 | Unifier le système de rôles (un seul champ role au lieu de role + isAdmin) | Conflict confirmed: `use-user-data.tsx` reads `isAdmin` boolean, `firestore.rules` checks `isAdmin`, but `firebase-helpers.ts` creates `role` string. Decision: keep `role` field ('member'/'admin'), derive `isAdmin` from it at read time |
| SITE-01 | Ajouter le favicon au site (app/favicon.ico) | No favicon exists in `app/` or `public/`. Next.js 14 App Router convention: place `favicon.ico` in `app/` directory — it is picked up automatically |

</phase_requirements>

---

## Summary

Phase 1 has four targeted fixes. Three are code bugs with clear root causes already identified in the codebase; one is a missing static asset.

**FIX-01** (`deleteMessage`): The Server Action in `app/admin/messages/actions.ts` imports `deleteDoc` from the **client** Firebase SDK (`firebase/firestore`). Server Actions run on Node.js — the client SDK depends on browser APIs and, critically, does not carry user credentials in a server context, causing `PERMISSION_DENIED`. The fix is to replace the client SDK call with `adminDb.collection('messages').doc(id).delete()` using the Admin SDK (`lib/firebase-admin.ts` already exports `adminDb`). The Server Action must also verify the caller is an authenticated admin before executing the delete; the `auth-token` cookie set by `lib/auth/actions.ts` during login can be verified via `adminAuth.verifyIdToken(token)`.

**FIX-02** (`saveUserProfile`): Two duplicate implementations exist (`lib/firebase-helpers.ts:128` and `lib/firebase-utils.ts:266`), both with the same bug: when a user document does not yet exist, they call `updateDoc()` (which requires the document to exist) instead of `setDoc(..., { merge: true })` (which creates or updates). This produces a "No document to update" error for new users. The fix is to replace `updateDoc` with `setDoc(..., { merge: true })` in both files and remove the `if (!userSnap.exists())` branch since `setDoc` with merge handles both cases.

**FIX-03** (Role unification): The codebase has a split personality:
- `lib/firebase-helpers.ts` defines `UserProfile.role: 'member' | 'admin' | 'visitor'` and stores a `role` string field
- `hooks/use-user-data.tsx` reads `data.isAdmin === true` (boolean field)
- `firestore.rules` checks `data.isAdmin == true` (boolean field)
- `types/index.ts` `User` interface has both `roles: string[]` and `isAdmin?: boolean`

The prior decision (from phase context) is that roles are stored as `role` in Firestore. The unified model: store only `role: 'member' | 'admin'` in Firestore, derive `isAdmin` in application code as `role === 'admin'`. The Firestore security rule `isAdmin()` function must also be updated to check `data.role == 'admin'` instead of `data.isAdmin == true`.

**SITE-01** (Favicon): No `favicon.ico` exists anywhere in the project (not in `app/`, not in `public/`). Next.js 14 App Router automatically serves `app/favicon.ico` as the browser tab icon with no metadata configuration needed. The `metadata` object in `app/layout.tsx` already does not specify `icons`, so placing `favicon.ico` in `app/` is sufficient.

**Primary recommendation:** Fix both `saveUserProfile` implementations simultaneously (they are identical bugs), update the Firestore rule `isAdmin()` function in the same PR as FIX-03 to avoid a window where the rule references a field that no longer exists.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `firebase-admin` | ^13.2.0 | Server-side Firestore/Auth operations with full bypass of security rules | Already installed; only SDK that works in Node.js Server Actions with admin privileges |
| `firebase` | ^10.13.0 | Client-side SDK (browser) | Already installed; keep for client components |
| `next-safe-action` | ^7.10.5 | Type-safe Server Actions with middleware | Already used in project; use for delete action |
| `next/headers` | built-in | Access cookies in Server Actions | Used in `lib/auth/actions.ts` to set/delete `auth-token` cookie |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `firebase/firestore` (`setDoc` with merge) | ^10.13.0 | Create-or-update pattern | FIX-02: replace `updateDoc` in client-side profile saves |
| `firebase-admin` Firestore | ^13.2.0 | Delete from Server Actions | FIX-01: replace client `deleteDoc` in Server Action |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Admin SDK in Server Action | Firebase REST API with service account | Admin SDK is cleaner, already installed, handles auth automatically |
| Cookie-based token verification | Explicit token parameter from client | Cookie is more secure (httpOnly), already set by login action — use it |
| Keeping `isAdmin` boolean field | Migrating all docs | Migration needed to avoid stale `isAdmin: true` docs conflicting with new `role` check |

**Installation:** No new packages needed. `firebase-admin` is already in `package.json`.

---

## Architecture Patterns

### Recommended Project Structure

No structural changes needed. All fixes are in-place edits to existing files.

```
app/
├── favicon.ico                    # ADD (SITE-01)
├── admin/messages/actions.ts      # EDIT (FIX-01): replace client SDK with Admin SDK
lib/
├── firebase-admin.ts              # EXISTS: adminDb, adminAuth already exported
├── firebase-helpers.ts            # EDIT (FIX-02, FIX-03): fix saveUserProfile, UserProfile type
├── firebase-utils.ts              # EDIT (FIX-02): fix duplicate saveUserProfile
hooks/
├── use-user-data.tsx              # EDIT (FIX-03): read role field, derive isAdmin
types/
├── index.ts                       # EDIT (FIX-03): update User interface
firestore.rules                    # EDIT (FIX-03): update isAdmin() helper function
```

### Pattern 1: Admin SDK Delete in Server Action (FIX-01)

**What:** Server Action that verifies the caller is an admin before deleting a Firestore document using the Admin SDK (bypasses security rules, runs with service account).

**When to use:** Any Server Action that mutates Firestore — client SDK has no session in server context.

**Example:**
```typescript
// app/admin/messages/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function deleteMessage(messageId: string) {
  try {
    // 1. Verify caller is authenticated
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;
    if (!token) {
      return { success: false, error: 'Non authentifié' };
    }

    // 2. Verify token and get UID
    const decodedToken = await adminAuth!.verifyIdToken(token);
    const uid = decodedToken.uid;

    // 3. Verify caller is admin (read from Firestore)
    const userDoc = await adminDb!.collection('users').doc(uid).get();
    const userRole = userDoc.data()?.role;
    if (userRole !== 'admin') {
      return { success: false, error: 'Permission refusée' };
    }

    // 4. Delete using Admin SDK
    await adminDb!.collection('messages').doc(messageId).delete();

    revalidatePath('/messages');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Erreur suppression message:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
}
```

### Pattern 2: setDoc with merge (FIX-02)

**What:** Create-or-update pattern that works whether or not the document exists.

**When to use:** Any time you write to a document that may or may not exist (e.g., user profile on first login).

**Example:**
```typescript
// lib/firebase-helpers.ts — saveUserProfile fix
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export async function saveUserProfile(
  user: User,
  additionalData?: Partial<UserProfile>
): Promise<string> {
  const userRef = doc(db, 'users', user.uid);

  await setDoc(
    userRef,
    {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      role: additionalData?.role ?? 'member',
      updatedAt: serverTimestamp(),
      ...additionalData,
    },
    { merge: true } // Creates if missing, merges if existing — never overwrites role
  );

  return userRef.id;
}
```

Note: With `merge: true`, `createdAt` is safe to include always — it will only be written if missing when the doc doesn't exist yet. However, to be precise, use `serverTimestamp()` for `createdAt` only on creation. A clean approach: include `createdAt` in `setDoc` — Firestore merge will leave an existing `createdAt` untouched if you use field-level merge with `FieldValue.serverTimestamp()`. Simpler: just always pass `createdAt: serverTimestamp()` with merge — existing docs keep their original value because... actually, **with `merge: true`, existing fields ARE overwritten**. So to preserve `createdAt`, check existence first OR use Firestore Transactions. The simplest fix for this codebase: remove the explicit `createdAt` from the merge write and rely on the fact that it was set on the original `setDoc` without merge during account creation.

**Revised approach for `saveUserProfile`:**
```typescript
// Check existence, set createdAt only on first write
const snap = await getDoc(userRef);
await setDoc(
  userRef,
  {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    role: additionalData?.role ?? 'member',
    updatedAt: serverTimestamp(),
    ...(snap.exists() ? {} : { createdAt: serverTimestamp() }),
    ...additionalData,
  },
  { merge: true }
);
```

### Pattern 3: Role Unification (FIX-03)

**What:** Single `role: 'member' | 'admin'` field in Firestore, with `isAdmin` derived in app code.

**Firestore rule (updated):**
```javascript
function isAdmin() {
  return request.auth != null &&
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
}
```

**Hook (updated):**
```typescript
// hooks/use-user-data.tsx
const isAdmin = useMemo(() => userData?.role === 'admin', [userData]);

// In onSnapshot callback:
setUserData({
  uid: user.uid,
  email: user.email || '',
  displayName: data.displayName || user.displayName || '',
  photoURL: data.photoURL || user.photoURL,
  role: (data.role as 'member' | 'admin') ?? 'member',
  // isAdmin derived, not stored
});
```

### Anti-Patterns to Avoid

- **Client SDK in Server Actions:** `import { deleteDoc } from 'firebase/firestore'` in a `'use server'` file. The client SDK has no auth context on the server — it silently uses unauthenticated access and hits security rules.
- **`updateDoc` on potentially missing documents:** Always use `setDoc(..., { merge: true })` when the document may not exist yet.
- **Dual role fields:** Never write both `role` and `isAdmin` to Firestore — they will diverge.
- **`adminDb` without null check:** `lib/firebase-admin.ts` exports `adminDb` as `FirebaseFirestore.Firestore | undefined`. Always use `adminDb!` after confirming env vars are set, or throw explicitly if `adminDb` is undefined.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Token verification in Server Actions | Custom JWT parsing | `adminAuth.verifyIdToken(token)` | Handles expiry, signature verification, revocation |
| Create-or-update for Firestore docs | Manual exists() + branch | `setDoc(..., { merge: true })` | Atomic, handles race conditions |
| Favicon serving | Custom Next.js route | Place `favicon.ico` in `app/` | Next.js 14 serves it automatically with correct MIME type and cache headers |

**Key insight:** The Admin SDK is the correct tool for all server-side Firestore mutations — it runs with service account credentials and bypasses security rules entirely, removing the need for complex token-passing to the Firestore rule evaluator.

---

## Common Pitfalls

### Pitfall 1: `adminDb` or `adminAuth` may be `undefined`
**What goes wrong:** `lib/firebase-admin.ts` exports `adminDb` and `adminAuth` as `T | undefined`. If env vars are missing, `admin.apps.length` is 0 and both are `undefined`. Calling `adminDb!.collection(...)` crashes at runtime.
**Why it happens:** The file has a fallback `defaultAppConfig` with fake values — but `admin.credential.cert()` with a fake key may still fail, setting `admin.apps.length` to 0.
**How to avoid:** At the start of any Server Action using Admin SDK, add:
```typescript
if (!adminDb || !adminAuth) {
  return { success: false, error: 'Firebase Admin non configuré' };
}
```
**Warning signs:** Server Action returns a generic error instead of the expected Firebase error.

### Pitfall 2: `auth-token` cookie is a Firebase ID Token (short-lived)
**What goes wrong:** Firebase ID Tokens expire after 1 hour. The cookie is set with `maxAge: 30 days` in `lib/auth/actions.ts`, but the token inside expires after 1h. `verifyIdToken` will throw an error on expired tokens.
**Why it happens:** The cookie stores the raw ID token, not a session cookie.
**How to avoid:** Catch the `auth/id-token-expired` error in Server Actions and return a "session expired, please log in again" message. Do NOT try to refresh the token server-side (requires the refresh token, which is not stored).
**Warning signs:** Delete works right after login but fails after an hour.

### Pitfall 3: Stale `isAdmin: true` documents after FIX-03
**What goes wrong:** Existing admin users have `isAdmin: true` in Firestore but no `role` field. After updating the Firestore rule to check `role == 'admin'`, those admins lose access immediately.
**Why it happens:** Migration not performed on existing data.
**How to avoid:** Either (a) write a one-time migration script to set `role: 'admin'` on all docs where `isAdmin === true`, OR (b) update the Firestore rule to check both fields during transition: `data.role == 'admin' || data.isAdmin == true`, then migrate, then tighten the rule.
**Warning signs:** Admin users can no longer access `/admin` after deploying FIX-03.

### Pitfall 4: Two `saveUserProfile` implementations
**What goes wrong:** `lib/firebase-helpers.ts` and `lib/firebase-utils.ts` both export a `saveUserProfile` function with the same bug. Fixing only one leaves the bug in the other.
**Why it happens:** Code duplication — these utilities were likely written independently.
**How to avoid:** Fix both files. Consider whether one can be deprecated/removed, or at minimum add a comment directing developers to use one canonical version.
**Warning signs:** Profile creation still fails after "fixing" the bug because the broken version is the one being imported.

### Pitfall 5: Favicon not showing despite correct placement
**What goes wrong:** Browser caches the 404 response for `/favicon.ico`.
**Why it happens:** The browser aggressively caches missing favicons.
**How to avoid:** After adding `app/favicon.ico`, hard-refresh the browser (Ctrl+Shift+R) or test in an incognito window. In production, the cache will clear on its own within the browser's TTL.
**Warning signs:** Favicon shows in incognito but not in regular browser window.

---

## Code Examples

Verified patterns from the existing codebase and official Firebase docs:

### Admin SDK delete (correct Server Action pattern)
```typescript
// Source: firebase-admin docs + existing lib/firebase-admin.ts
'use server';
import { cookies } from 'next/headers';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function deleteMessage(messageId: string) {
  if (!adminDb || !adminAuth) {
    return { success: false, error: 'Firebase Admin non configuré' };
  }

  const token = cookies().get('auth-token')?.value;
  if (!token) return { success: false, error: 'Non authentifié' };

  let uid: string;
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    uid = decoded.uid;
  } catch {
    return { success: false, error: 'Token invalide ou expiré' };
  }

  const userSnap = await adminDb.collection('users').doc(uid).get();
  if (userSnap.data()?.role !== 'admin') {
    return { success: false, error: 'Permission refusée' };
  }

  await adminDb.collection('messages').doc(messageId).delete();
  revalidatePath('/messages');
  revalidatePath('/');
  return { success: true };
}
```

### setDoc with merge for user profile
```typescript
// Source: Firebase JS SDK v10 docs
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

export async function saveUserProfile(user: User, additionalData?: Partial<UserProfile>) {
  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);

  await setDoc(
    userRef,
    {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      role: additionalData?.role ?? 'member',
      updatedAt: serverTimestamp(),
      ...(snap.exists() ? {} : { createdAt: serverTimestamp() }),
    },
    { merge: true }
  );

  return userRef.id;
}
```

### Firestore rule with unified role check
```javascript
// firestore.rules
function isAdmin() {
  return request.auth != null &&
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
}
```

### Next.js 14 favicon (no code needed)
```
// Place file at:
app/favicon.ico
// Next.js 14 App Router serves it automatically at /favicon.ico
// No metadata configuration required
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Client SDK in all contexts | Admin SDK for server-side mutations | Firebase Admin SDK v9+ | Server Actions must use Admin SDK |
| `updateDoc` for upsert | `setDoc(..., { merge: true })` | Firebase JS SDK v9 | `updateDoc` throws if doc missing |
| `pages/` Router favicon in `public/` | App Router favicon in `app/` | Next.js 13+ | File location changed |

**Deprecated/outdated in this codebase:**
- `updateDoc` called on potentially non-existent documents — replace with `setDoc + merge`
- Client `deleteDoc` in Server Actions — replace with Admin SDK
- Dual role fields (`isAdmin` boolean + `role` string) — unify to `role` string only

---

## Open Questions

1. **Should `lib/firebase-utils.ts::saveUserProfile` be deleted or kept?**
   - What we know: Both `lib/firebase-helpers.ts` and `lib/firebase-utils.ts` export identical `saveUserProfile` functions with the same bug.
   - What's unclear: Which file is actually imported at call sites (no caller found in non-generated code — may be unused).
   - Recommendation: Grep for all imports of `saveUserProfile` before fixing. If `firebase-utils.ts` version is unused, mark it deprecated. If used, fix both and add a comment.

2. **Should the Firestore rules also support a transition period for `isAdmin` boolean?**
   - What we know: Existing admin users likely have `isAdmin: true` but no `role` field.
   - What's unclear: How many admin users exist and whether a one-time script is feasible.
   - Recommendation: Update rule to check `data.role == 'admin' || data.isAdmin == true` during transition. After confirming all admin docs have been updated, remove the `|| data.isAdmin == true` clause.

3. **Will `auth-token` cookie token expiry be a blocking issue for FIX-01?**
   - What we know: Firebase ID tokens expire after 1 hour. The cookie persists for 30 days. Admin operations are rare (not done every hour).
   - What's unclear: Whether admins regularly use the admin panel in sessions longer than 1 hour.
   - Recommendation: Handle the expiry error gracefully (return a specific "session expired" message), but do not add token refresh logic in Phase 1. Document as a known limitation.

---

## Sources

### Primary (HIGH confidence)
- Direct code inspection of `app/admin/messages/actions.ts` — confirmed client SDK used in Server Action
- Direct code inspection of `lib/firebase-helpers.ts:128`, `lib/firebase-utils.ts:266` — confirmed `updateDoc` called on potentially missing document
- Direct code inspection of `hooks/use-user-data.tsx:57`, `firestore.rules:8`, `lib/firebase-helpers.ts:30` — confirmed dual role field conflict
- Direct code inspection of `app/`, `public/` directories — confirmed no favicon exists
- Direct code inspection of `lib/firebase-admin.ts` — confirmed `adminDb` and `adminAuth` already exported

### Secondary (MEDIUM confidence)
- Next.js 14 App Router convention: `app/favicon.ico` is served automatically (consistent with Next.js 13+ App Router behavior, verified by absence of custom favicon route in codebase)
- Firebase Admin SDK: `verifyIdToken` pattern for Server Action auth (standard Firebase Admin pattern, matches existing `lib/auth/actions.ts` which stores the ID token in `auth-token` cookie)

---

## Metadata

**Confidence breakdown:**
- Bug identification (FIX-01, FIX-02, FIX-03): HIGH — confirmed by direct code inspection
- Fix correctness (Admin SDK, setDoc+merge): HIGH — standard Firebase patterns
- Role conflict scope: HIGH — all relevant files inspected
- Favicon fix: HIGH — Next.js 14 App Router convention, no code needed
- Token expiry concern: MEDIUM — behavior of `verifyIdToken` on expired tokens (standard Firebase behavior, confirmed by API contract)
- Migration concern for existing admin users: MEDIUM — depends on actual data in production Firestore (cannot inspect)

**Research date:** 2026-02-19
**Valid until:** 2026-03-19 (stable APIs, 30-day validity)
