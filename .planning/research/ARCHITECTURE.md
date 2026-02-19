# ARCHITECTURE: RBAC Integration — Next.js 14 App Router + Firebase

**Research type:** Architecture dimension  
**Date:** 2026-02-19  
**Milestone:** Subsequent — integrating RBAC into existing architecture

---

## Question

How should RBAC be architecturally integrated into a Next.js 14 App Router app with Firebase backend? What are the major components?

---

## Summary

The existing codebase already has the RBAC skeleton in place. Role data lives in Firestore (`users/{uid}.isAdmin`), a `useUserData` hook reads it in real-time, an `AdminGuard` component enforces it client-side for `/admin/*`, and `useProtectedRoute` supports `requiredRole` and `checkRole` options via `hasRole()` in `lib/firebase-helpers.ts`. Firestore security rules enforce `isAdmin` at the data layer. The gaps are: (1) no `role` field unification (`isAdmin: boolean` vs `role: 'member'|'admin'|'visitor'`), (2) `/infos-docs/membres|anniversaires|carnet-adresses` only check authentication, not roles, (3) the middleware is a no-op stub in dev and does no role enforcement in production, (4) `messages` delete permission is already covered by `isAdmin()` in Firestore rules but admin UI may not surface it correctly.

---

## Findings

### 1. Where Role Data Should Live

**Decision: Firestore `users/{uid}` document (already in use) — no Firebase Auth custom claims needed at this stage.**

The existing data model uses `isAdmin: boolean` in `users/{uid}`. The `lib/firebase-helpers.ts` `UserProfile` type defines `role: 'member' | 'admin' | 'visitor'` but actual documents use `isAdmin`. These are inconsistent.

**Recommended unified schema:**

```typescript
// users/{uid} document
{
  uid: string;
  email: string;
  displayName: string;
  isAdmin: boolean;        // keep for backward compat with Firestore rules
  role: 'admin' | 'member' | 'visitor';  // canonical role field to add
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

Rationale for Firestore over Auth custom claims:
- The project does not use Firebase Admin SDK in production (middleware stubs it out); setting custom claims requires `firebase-admin` with real credentials
- `useUserData` already subscribes to the Firestore `users` document in real-time via `onSnapshot` — role changes propagate instantly to the UI without token refresh
- Firestore rules already use `get(...users/...).data.isAdmin` — extending to check `role` is straightforward
- Custom claims would require a Cloud Function or Admin SDK endpoint, adding infrastructure overhead not yet present

**Trade-off:** Custom claims would allow the middleware to verify roles without a Firestore read (faster, server-side), but this requires full Firebase Admin SDK integration in middleware (currently disabled). This is a future upgrade path once production Admin SDK credentials are configured.

---

### 2. Permission Checking Layers

Three layers exist; each has a distinct boundary and responsibility.

#### Layer 1: Next.js Middleware (`middleware.ts`) — Coarse-grained, unauthenticated check

**Current state:** Middleware only sets security headers. Protected route list (`/membres`, `/admin`) is defined but enforcement is commented out for dev mode and fully bypassed in production too (returns `response` without any auth check).

**Target state for RBAC:** The middleware cannot easily verify Firestore roles because it runs on the Edge runtime without a Firestore client. The practical approach is:

- Use a **session cookie** that encodes the user's role, set after login via a short-lived HTTP-only cookie
- Middleware reads the cookie to decide: unauthenticated → redirect to `/connexion`, authenticated → pass through (role enforcement happens in layers 2 and 3)
- This does NOT replace layer 2/3 checks; it's defense-in-depth that prevents page load flicker for unauthenticated users

**Routes to protect in middleware:**

```typescript
const protectedRoutes = [
  { path: '/admin', requiredRole: 'admin' },
  { path: '/membres', requiredRole: 'member' },          // any authenticated user
  { path: '/infos-docs/membres', requiredRole: 'member' },
  { path: '/infos-docs/anniversaires', requiredRole: 'member' },
  { path: '/infos-docs/carnet-adresses', requiredRole: 'member' },
];
```

#### Layer 2: Component Guards — Role-aware rendering

**Current state:** `AdminGuard` wraps `/admin/*` layout and checks `isAdmin` via `useUserData`. This is the primary enforcer for admin routes.

**Pattern to replicate for member routes:**

```typescript
// components/auth/member-guard.tsx  (to create)
// mirrors AdminGuard but checks: !!user (any authenticated user)
// redirects to /connexion if unauthenticated
```

Currently, `/infos-docs/membres`, `/infos-docs/anniversaires`, and `/infos-docs/carnet-adresses` each duplicate a `useEffect` redirect pattern inline. They should be wrapped in a `MemberGuard` component (analogous to `AdminGuard`) to centralize this logic.

**Existing `useProtectedRoute` hook** already supports `requiredRole` and calls `hasRole()` from `firebase-helpers.ts`. However, it is not used by any of the three infos-docs pages — they use raw `useAuth` instead. The hook is the right abstraction; the pages need to be migrated to use it.

#### Layer 3: Firestore Security Rules — Enforced server-side, cannot be bypassed

**Current state:** `isAdmin()` helper function correctly gates writes. Member-only reads (contacts, birthdays, plannings) use `request.auth != null`.

**Gap — messages delete:**

```javascript
// Current rule:
match /messages/{messageId} {
  allow read: if true;
  allow create, update, delete: if isAdmin();
}
```

This is correct at the rules level. If admin message deletion is broken in the UI, the issue is in the component calling `delete` without proper auth context, not in the rules.

**No changes needed to rules for the target routes** — they already enforce `request.auth != null` for contacts/birthdays and `isAdmin()` for mutations.

---

### 3. How to Extend `useProtectedRoute` for Role Checking

The hook at `hooks/use-protected-route.ts` is already architected for role checking:

```typescript
// Current signature (already supports roles):
useProtectedRoute({
  redirectTo: '/connexion',
  requiredRole: 'admin',   // string | string[]
  checkRole: true,
})
```

It calls `hasRole(user.uid, requiredRole)` which reads `users/{uid}.role` from Firestore via `getUserProfile()` in `lib/firebase-helpers.ts`.

**Issue:** `hasRole()` checks `profile.role` (the unified role field), but existing documents have `isAdmin: boolean`, not `role: 'admin'`. Until documents are migrated to have the `role` field, `hasRole()` will always return `false` for admin checks.

**Fix required in `lib/firebase-helpers.ts`:**

```typescript
export async function hasRole(userId: string, role: string | string[]): Promise<boolean> {
  const profile = await getUserProfile(userId);
  if (!profile) return false;

  // Fallback: derive role from isAdmin if role field absent
  const effectiveRole = profile.role ?? (profile.isAdmin ? 'admin' : 'member');

  if (Array.isArray(role)) {
    return role.includes(effectiveRole);
  }
  return effectiveRole === role;
}
```

**Usage for member-only pages:**

```typescript
// In /infos-docs/membres, /infos-docs/anniversaires, /infos-docs/carnet-adresses
const { isLoading, isAuthorized } = useProtectedRoute({
  redirectTo: '/connexion',
  requiredRole: ['member', 'admin'],
  checkRole: true,
});
```

**Usage for admin pages** (already handled by `AdminGuard` + `useUserData`, but `useProtectedRoute` can also be used):

```typescript
const { isLoading, isAuthorized } = useProtectedRoute({
  redirectTo: '/connexion',
  requiredRole: 'admin',
  checkRole: true,
});
```

---

### 4. Data Flow for Role Verification

```
User navigates to protected route
          │
          ▼
[Middleware] (Edge, cookie-based)
  Cookie present? → pass through
  No cookie?      → redirect /connexion
          │
          ▼
[Page renders, AuthProvider hydrates]
  onAuthStateChanged fires
  authState.setUser(firebaseUser)
          │
          ▼
[useUserData / useProtectedRoute]
  onSnapshot(db, 'users', uid)
  → reads { isAdmin, role, ... }
  → sets isAdmin, userData in state
          │
          ▼
[Guard component / hook]
  isAdmin === true?  → render /admin content
  !!user === true?   → render /infos-docs content
  else              → redirect /connexion or /acces-refuse
          │
          ▼
[Firestore query]
  Client sends request with Firebase Auth token
  Firestore rules evaluate: isAdmin() / request.auth != null
  → data returned or 403
```

---

## Architecture Components — Boundaries

| Component | File | Responsibility | Build dependency |
|-----------|------|----------------|-----------------|
| Role schema | `users/{uid}` Firestore doc | Single source of truth for role | Must exist before any layer reads it |
| `hasRole()` fix | `lib/firebase-helpers.ts` | Fallback `isAdmin` → `role` derivation | Before `useProtectedRoute` is used for roles |
| `useProtectedRoute` | `hooks/use-protected-route.ts` | Client-side role verification hook | After `hasRole()` fix |
| `MemberGuard` | `components/auth/member-guard.tsx` | Wraps member-only pages, mirrors `AdminGuard` | After `useProtectedRoute` works |
| infos-docs pages | `app/infos-docs/membres|anniversaires|carnet-adresses/page.tsx` | Replace inline auth checks with `MemberGuard` | After `MemberGuard` exists |
| Middleware | `middleware.ts` | Coarse auth-cookie check (not role) | Independent; complements layers 2+3 |
| Firestore rules | `firestore.rules` | Enforce at data layer, already correct | Already deployed; `messages` delete is fine |
| AdminGuard | `components/auth/admin-guard.tsx` | Already works; reads `isAdmin` via `useUserData` | No changes needed if `isAdmin` field preserved |

---

## Build Order Implications

1. **Fix `hasRole()` fallback** (`lib/firebase-helpers.ts`) — unblocks `useProtectedRoute` for role checks without requiring document migration
2. **Create `MemberGuard`** (`components/auth/member-guard.tsx`) — thin wrapper, ~40 lines, mirrors `AdminGuard`
3. **Migrate infos-docs pages** — replace inline `useEffect` + `useAuth` pattern with `<MemberGuard>` wrapper
4. **Optionally migrate Firestore documents** — add `role: 'admin'|'member'` field to `users/{uid}`; until then, fallback in step 1 handles it
5. **Middleware enhancement** — add auth-cookie check; lower priority since layers 2+3 are the real enforcement
6. **Firestore rules** — no changes required for target routes; `messages` delete already gated by `isAdmin()`

---

## Constraints and Risks

- **`useUserData` uses `isAdmin: boolean`**, while `UserProfile` in `firebase-helpers.ts` uses `role: string`. These two sources of truth must converge. Until documents have a `role` field, `useUserData` remains the reliable source for admin checks (`isAdmin === true`).
- **No Firebase Admin SDK in production** (middleware stub). Custom claims are not viable without configuring `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` env vars and removing the dev-mode bypass.
- **`useProtectedRoute` has async role check** — there is a visible loading state while Firestore is queried. The `MemberGuard` should show a skeleton/spinner during this window (same pattern as `AdminGuard`).
- **Firestore rules catch-all** (`match /{document=**}`) defaults to `allow read: if request.auth != null` and `allow write: if isAdmin()` — this is a reasonable safe default that prevents unauthenticated reads of uncategorized collections.

---

## What Is Already Working (Do Not Re-implement)

- `AdminGuard` + `useUserData` for `/admin/*` — fully functional
- `useProtectedRoute` hook with `requiredRole` / `checkRole` options — already built, just underused
- `hasRole()` + `getUserProfile()` in `lib/firebase-helpers.ts` — correct logic, needs minor fallback fix
- Firestore rules — correct for all target collections
- `useUserData` real-time subscription — correct, use as-is
