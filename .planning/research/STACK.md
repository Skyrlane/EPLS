# Stack Research — Firebase RBAC + Next.js 14 Brownfield

**Research Type:** Project Research — Stack dimension
**Research Date:** 2026-02-19
**Milestone:** Adding role-based access control and fixing bugs on existing Next.js 14 + Firebase church website
**Question:** Best 2025 approach for adding RBAC with shared group accounts in a Next.js 14 app using Firebase

---

## Context Summary

EPLS is a live Next.js 14 (App Router) church website using Firebase Auth, Firestore, and Storage. The existing system has:
- A single admin identified by hardcoded email (`samdumay67@gmail.com`)
- `isAdmin` field on the `users` Firestore collection, checked via `get()` in Firestore rules
- Middleware (`middleware.ts`) that currently does zero real auth enforcement in development, and skips Firebase Admin checks in production as well (returns early unconditionally)
- No role field in Auth custom claims — roles are currently checked only in Firestore rules via a Firestore document lookup
- 3 shared group accounts to create: Amis, Membres, Conseil with distinct permission matrices

---

## Recommendation 1: Firebase RBAC Approach

### Decision: Firestore Role Field (NOT Custom Claims)

**Recommended approach:** Store roles in a `role` field on the Firestore `users/{uid}` document. Do NOT use Firebase Auth custom claims for the initial implementation.

**Confidence: HIGH (90%)**

### Rationale

**Why not custom claims:**

1. Custom claims require Firebase Admin SDK server-side calls (`adminAuth.setCustomUserClaims(uid, { role: 'conseil' })`) to set. The existing `firebase-admin.ts` initializes with fake credentials in development and has no guarantee it will function correctly in the current project setup. Introducing a Server Action or API route to set claims adds operational complexity for a brownfield project at 95%.

2. Custom claims propagate with a ~1 hour delay unless the client explicitly refreshes the ID token (`user.getIdToken(true)`). For shared accounts used by a congregation, this lag is confusing.

3. Custom claims are ideal for large-scale apps where Firestore rule `get()` calls would be expensive. With only 3 shared accounts + 1 admin = 4 users total, the Firestore `get()` approach costs near-zero reads.

4. The existing Firestore rules already use a `get()` lookup pattern for `isAdmin`. Adding a `role` field is a natural extension of the exact same pattern — no new infrastructure.

**Why Firestore role field is correct here:**

1. **Already established pattern** — the `isAdmin()` helper in `firestore.rules` already does:
   ```
   get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true
   ```
   Adding `role` follows the same pattern exactly.

2. **Zero new dependencies** — no need to add Firebase Admin calls for claim management. Role assignment happens through the existing admin UI or directly in Firestore console.

3. **Immediately consistent** — when role is written to Firestore, the next Firestore read will see the updated role. No token refresh needed.

4. **Fits the shared account model** — all users sharing the `membre07` account will have the same `role: 'membre'` on their shared UID. This is a direct property of the document, visible immediately.

### Implementation

**Firestore `users` document structure:**
```typescript
// users/{uid}
{
  email: "membre07@epls.fr",    // or the actual email used at creation
  isAdmin: false,
  role: "membre",               // "ami" | "membre" | "conseil" | "admin"
  createdAt: Timestamp,
  displayName: "Membres de l'EPLS"
}
```

**Role hierarchy (least to most privileged):**
```
ami < membre < conseil < admin
```

**Updated Firestore rules helper function:**
```javascript
function getUserRole() {
  return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
}

function hasRole(minRole) {
  let role = getUserRole();
  let hierarchy = ['ami', 'membre', 'conseil', 'admin'];
  // Firestore rules do not support arrays/indexOf — use explicit comparisons
  return (minRole == 'ami' && (role == 'ami' || role == 'membre' || role == 'conseil' || role == 'admin'))
      || (minRole == 'membre' && (role == 'membre' || role == 'conseil' || role == 'admin'))
      || (minRole == 'conseil' && (role == 'conseil' || role == 'admin'))
      || (minRole == 'admin' && role == 'admin');
}

function isAdmin() {
  return request.auth != null && getUserRole() == 'admin';
}

function isAtLeastConseil() {
  return request.auth != null && hasRole('conseil');
}

function isAtLeastMembre() {
  return request.auth != null && hasRole('membre');
}

function isAtLeastAmi() {
  return request.auth != null && hasRole('ami');
}
```

**Note on the PERMISSION_DENIED bug for message deletion:** The root cause is that `isAdmin()` performs a Firestore `get()` on the `users` document. If the admin user's `users/{uid}` document does not have `isAdmin: true` set correctly (or the document does not exist), all write operations including delete will fail with PERMISSION_DENIED. The fix is twofold: (1) ensure the admin's `users` document has `isAdmin: true` AND `role: 'admin'`, and (2) optionally simplify the admin check to also accept `role == 'admin'` as a fallback. The `messages` collection rule currently reads:
```javascript
match /messages/{messageId} {
  allow read: if true;
  allow create, update, delete: if isAdmin();
}
```
This is correct in theory — the bug is a data problem, not a rules problem. Verify the admin's Firestore `users` document directly in the Firebase console.

---

## Recommendation 2: Role Checking — Middleware vs Client-Side

### Decision: Client-side role checking with server-side page-level guard via useProtectedRoute

**Recommended approach:** Use client-side role checks in page components (via a new `useRole` hook that reads from Firestore `users` doc), NOT middleware for role enforcement. Reserve middleware for authentication-only checks.

**Confidence: HIGH (85%)**

### Rationale

**Why not middleware for role enforcement:**

1. Next.js `middleware.ts` runs in the Edge Runtime. It cannot use Firebase client SDK or the full `firebase-admin` SDK (the admin SDK is Node.js only, not Edge-compatible unless using a REST API approach). The current `middleware.ts` already acknowledges this limitation — it skips all auth logic and returns immediately.

2. Enforcing roles in middleware would require sending the Firebase ID token as a cookie, verifying it with Firebase Admin REST API (HTTP call per request), and checking the role — this is a significant refactor with latency cost per navigation.

3. The permission matrix for this project is page-level, not API-route-level. Client-side enforcement is acceptable because:
   - Sensitive data (contacts, members) is still protected by Firestore rules (server-enforced)
   - The UI gating prevents casual access
   - This is an internal church site, not a financial application requiring strict server-side enforcement

**Why client-side role check is appropriate here:**

1. The project already has `useProtectedRoute` which handles authentication redirects client-side. The same pattern extends naturally to role-based redirects.

2. Firestore rules are the true security layer — even if someone bypassed the UI, they cannot read `contacts` or `plannings` without being authenticated. Adding role to Firestore rules adds a second layer.

3. Zero new infrastructure — reads the same `users/{uid}` Firestore document that already exists.

### Implementation

**New `useRole` hook:**
```typescript
// hooks/use-role.ts
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRealtimeDocument } from '@/hooks/use-realtime-document';

export type UserRole = 'ami' | 'membre' | 'conseil' | 'admin';

const ROLE_HIERARCHY: Record<UserRole, number> = {
  ami: 1,
  membre: 2,
  conseil: 3,
  admin: 4,
};

interface UseRoleReturn {
  role: UserRole | null;
  loading: boolean;
  hasRole: (minRole: UserRole) => boolean;
  isAdmin: boolean;
}

export function useRole(): UseRoleReturn {
  const { user } = useAuth();
  const { data: userData, loading } = useRealtimeDocument<{ role: UserRole; isAdmin?: boolean }>({
    collectionName: 'users',
    documentId: user?.uid ?? '',
  });

  const role = userData?.role ?? null;

  const hasRole = (minRole: UserRole): boolean => {
    if (!role) return false;
    return ROLE_HIERARCHY[role] >= ROLE_HIERARCHY[minRole];
  };

  return {
    role,
    loading,
    hasRole,
    isAdmin: role === 'admin' || userData?.isAdmin === true,
  };
}
```

**Updated `useProtectedRoute` pattern for role-based protection:**
```typescript
// In a page component
'use client';

import { useRole } from '@/hooks/use-role';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function MembresPage() {
  const { hasRole, loading } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !hasRole('membre')) {
      router.replace('/connexion');
    }
  }, [loading, hasRole, router]);

  if (loading) return <Skeleton />;
  if (!hasRole('membre')) return null;

  return <MembresContent />;
}
```

**Permission matrix implementation:**
```typescript
// lib/permissions.ts
import type { UserRole } from '@/hooks/use-role';

export const ROUTE_PERMISSIONS: Record<string, UserRole> = {
  '/admin': 'admin',
  '/infos-docs/membres': 'conseil',
  '/infos-docs/anniversaires': 'membre',
  '/infos-docs/carnet-adresses': 'membre',
  '/membres': 'ami',
};
```

**Middleware — keep simple, authentication-only:**
The existing `middleware.ts` should remain as authentication detection only (checking `auth-token` cookie presence for redirect logic), not role enforcement. This is consistent with its current design intent.

---

## Recommendation 3: Favicon — Next.js 14 App Router

### Decision: Place `favicon.ico` in the `app/` directory (App Router convention)

**Recommended approach:** Add `favicon.ico` to `app/favicon.ico`. Optionally add PNG variants via the `icons` metadata API for modern browsers.

**Confidence: HIGH (95%)**

### Rationale

In Next.js 14 App Router, the favicon is served through one of two mechanisms:

1. **Static file:** `app/favicon.ico` is automatically served as `/favicon.ico` with no configuration needed. This is the simplest approach and is recognized by Next.js automatically — no `<link>` tag needed in `layout.tsx`.

2. **Metadata API icons:** For modern PWA-style icons with multiple sizes, declare in `layout.tsx` metadata:
```typescript
export const metadata: Metadata = {
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon-16x16.png',
  },
};
```

**For EPLS, the minimum viable approach is:**
1. Place `favicon.ico` at `app/favicon.ico`
2. Next.js 14 will automatically detect and serve it — no `layout.tsx` changes required

**For complete browser coverage (recommended):**
1. Place `favicon.ico` at `app/favicon.ico` (32x32, ICO format)
2. Place `icon.png` at `app/icon.png` (192x192, PNG) — served as `/icon.png` automatically
3. Place `apple-icon.png` at `app/apple-icon.png` (180x180) — served as `/apple-icon.png`

These file names are Next.js 14 App Router conventions that trigger automatic `<link>` tag generation in `<head>`. No manual configuration in `layout.tsx` is needed for any of these.

**Current state:** `app/layout.tsx` has no favicon declaration and no `app/favicon.ico` exists. The middleware matcher already excludes `favicon.ico` from processing (`'/((?!_next/static|_next/image|favicon.ico).*)'`), so the plumbing is in place — only the file is missing.

---

## Summary Table

| Topic | Recommended Approach | Alternative Rejected | Confidence |
|-------|---------------------|---------------------|------------|
| Firebase RBAC storage | Firestore `role` field on `users/{uid}` | Firebase Auth custom claims | HIGH (90%) |
| Role checking layer | Client-side hook (`useRole`) + Firestore rules | Next.js middleware + Firebase Admin | HIGH (85%) |
| Firestore rules update | Extend existing `get()` pattern with role hierarchy functions | Rewrite with custom claims check | HIGH (90%) |
| PERMISSION_DENIED bug | Data fix: ensure admin `users` doc has `isAdmin: true` + `role: 'admin'` | Rules rewrite | HIGH (85%) |
| Favicon | `app/favicon.ico` (Next.js 14 App Router convention) | Manual `<link>` in `layout.tsx` | HIGH (95%) |

---

## Risks and Caveats

1. **Firestore `get()` cost per rule evaluation:** Each `isAdmin()` / `hasRole()` call in Firestore rules performs one document read. With 4 users and moderate traffic, this is within the free tier. If concurrent traffic grows significantly, consider migrating to custom claims at that point.

2. **Shared accounts and logout:** Multiple people sharing the same Firebase Auth account means one person logging out logs out all. This is a known UX limitation of the shared account model and is outside scope of this RBAC research — it is an accepted constraint per `PROJECT.md`.

3. **Role field initialization:** Each of the 3 shared accounts must have their `users/{uid}` document created with the correct `role` value when the Firebase Auth accounts are created. An admin setup script or one-time Firestore console operation is required.

4. **The `users` collection write rule:** Current rule is:
   ```javascript
   allow write: if request.auth != null && request.auth.uid == userId;
   ```
   This means users can overwrite their own role. This must be tightened to:
   ```javascript
   allow update: if request.auth != null && request.auth.uid == userId
                 && !request.resource.data.diff(resource.data).affectedKeys().hasAny(['role', 'isAdmin']);
   allow create: if request.auth != null;
   allow delete: if isAdmin();
   ```

---

*Research completed: 2026-02-19*
*Feeds into: Milestone roadmap for RBAC + bug fixes*
