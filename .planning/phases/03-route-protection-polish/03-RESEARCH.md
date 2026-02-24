# Phase 3: Route Protection & Polish - Research

**Researched:** 2026-02-24
**Domain:** Client-side role-based route protection + site image integration
**Confidence:** HIGH

---

## Summary

Phase 3 has two independent workstreams: (1) wiring role-based route guards onto three `/infos-docs` pages, and (2) confirming the admin image upload pipeline is visible on the live site.

**Workstream 1 (PROT-01 through PROT-04)** is almost entirely mechanical. All building blocks exist: `AdminGuard` provides the exact guard component pattern to clone, `useUserData` already fetches and normalizes the role from Firestore, `useProtectedRoute` exists but has a bug (`isLoading` instead of `loading`) and is not used anywhere in the app. The plan is to create a `MemberGuard` component following `AdminGuard`'s pattern, with a `minRole` prop that does a hierarchy-aware comparison, and then wrap each of the three protected pages with it. No new libraries or hooks are needed.

**Workstream 2 (SITE-02)** is already architecturally complete. `DynamicImageBlock` reads `site_images/{zone}` from Firestore in real time and falls back to a static URL. The admin page `/admin/images-site` writes to the same collection. The gap is that the `site_images` Firestore collection may not be seeded yet in production — the seed script `scripts/seed-site-images.js` exists but may not have been run. Additionally, several pages in the seed definition (e.g. `/notre-eglise/histoire`) do not yet use `DynamicImageBlock`. The SITE-02 success criterion however is narrow: "Les images uploadées via /admin/images-site apparaissent aux emplacements correspondants sur le site" — meaning the plumbing must work end-to-end, which requires the seed to have run and at least one page to demonstrate the round-trip.

**Primary recommendation:** Create `MemberGuard` modeled on `AdminGuard`, apply it to the three pages, run (or verify) the seed script, and confirm the DynamicImageBlock round-trip works. No new dependencies needed.

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| PROT-01 | Créer composant MemberGuard avec vérification de rôle minimum | AdminGuard pattern exists at `components/auth/admin-guard.tsx`; `useUserData` provides `userData.role`; client-side roleLevel() comparison needed (Firestore roleLevel() is server-side only) |
| PROT-02 | Protéger /infos-docs/membres (accès Conseil+ uniquement) | Page already has `useAuth` redirect for unauthenticated; needs role upgrade: wrap with `<MemberGuard minRole="conseil">`, redirect to `/acces-refuse` |
| PROT-03 | Protéger /infos-docs/anniversaires (accès Membres+ uniquement) | Same as PROT-02 but `minRole="membre"` |
| PROT-04 | Protéger /infos-docs/carnet-adresses (accès Membres+ uniquement) | Same pattern as PROT-03; note: both `carnet-adresse/` and `carnet-adresses/` directories exist — only `carnet-adresses/` has the real page with auth |
| SITE-02 | Intégrer les images uploadées via /admin/images-site aux pages du site | `DynamicImageBlock` + `site_images` collection + admin upload page are all already wired; gap is seeding and verifying round-trip |
</phase_requirements>

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `useUserData` (hook) | existing | Fetch `users/{uid}.role` from Firestore with real-time listener | Already normalizes role with backward compat; used by AdminGuard |
| `AdminGuard` (component) | existing | Wrap pattern for role-gated pages | Exact template to clone for MemberGuard |
| `DynamicImageBlock` (component) | existing | Display images managed via admin panel | Already reads `site_images` with `onSnapshot`; no code changes needed |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `useRouter` (next/navigation) | Next.js 14 | Programmatic redirect | Used in every guard for `router.replace()` |
| `Loader2` (lucide-react) | existing | Loading spinner | Consistent with AdminGuard pattern |
| `ShieldAlert` (lucide-react) | existing | Access-denied visual | Consistent with AdminGuard pattern |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `useUserData` | `useProtectedRoute` with `checkRole:true` | `useProtectedRoute` has a bug (`isLoading` destructure from `useAuth` which returns `loading`) — don't use until fixed |
| Client-side roleLevel() | Firestore `hasRole()` | Firestore rules enforce at DB level; client-side check is UX only — both needed, independent |

**Installation:** No new packages needed.

---

## Architecture Patterns

### Pattern 1: Guard Component (existing pattern — clone from AdminGuard)

**What:** A client component that wraps page content, checks auth+role via `useUserData`, redirects if insufficient, shows a spinner during check.

**When to use:** Any page that requires minimum role. For MemberGuard, add a `minRole` prop.

```typescript
// Source: components/auth/admin-guard.tsx (existing — clone and extend)
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserData } from '@/hooks/use-user-data';
import { Loader2, ShieldAlert } from 'lucide-react';

// Role hierarchy for client-side comparison (mirrors Firestore roleLevel())
const ROLE_LEVEL: Record<string, number> = {
  admin: 4,
  conseil: 3,
  membre: 2,
  member: 2,   // backward compat
  ami: 1,
  visitor: 1,  // backward compat
};

type MinRole = 'ami' | 'membre' | 'conseil' | 'admin';

interface MemberGuardProps {
  children: React.ReactNode;
  minRole: MinRole;
}

export function MemberGuard({ children, minRole }: MemberGuardProps) {
  const { user, userData, loading } = useUserData();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace(`/connexion?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    const userLevel = ROLE_LEVEL[userData?.role ?? 'ami'] ?? 0;
    const requiredLevel = ROLE_LEVEL[minRole] ?? 0;
    if (userLevel < requiredLevel) {
      router.replace('/acces-refuse');
    }
  }, [user, userData, loading, minRole, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
      </div>
    );
  }

  if (!user) return null;
  const userLevel = ROLE_LEVEL[userData?.role ?? 'ami'] ?? 0;
  if (userLevel < ROLE_LEVEL[minRole]) {
    return null; // redirect in progress
  }

  return <>{children}</>;
}
```

### Pattern 2: Applying MemberGuard to a Page

**What:** Replace manual `useAuth` + `useEffect` redirect with `<MemberGuard>` wrapper.

**When to use:** Any of the three protected /infos-docs pages.

```typescript
// Before (anniversaires/page.tsx — current state):
// Manual useEffect with useAuth, only checks isAuthenticated, no role check

// After:
import { MemberGuard } from '@/components/auth/member-guard';

export default function AnniversairesPage() {
  return (
    <MemberGuard minRole="membre">
      <AnniversairesContent />
    </MemberGuard>
  );
}
```

The page content (the JSX below the guard) should be extracted into a separate component or kept inline — keeping it inline in the page file is fine given current page size.

### Pattern 3: DynamicImageBlock (already working)

**What:** Component reads `site_images/{zone}` with `onSnapshot`, falls back to `fallbackSrc`.

**When to use:** Any page slot managed via `/admin/images-site`.

```typescript
// Source: components/ui/dynamic-image-block.tsx (existing)
<DynamicImageBlock
  zone="cultes-hero"
  fallbackSrc="/placeholder.svg?height=384&width=896"
  alt="Culte à l'EPLS"
  type="hero"
  className="object-cover"
/>
```

For SITE-02 specifically: the seed script must have run so documents exist to listen to. If `site_images` collection is empty in Firestore, `DynamicImageBlock` silently falls back. Run `node scripts/seed-site-images.js` with proper `.env.local` to seed.

### Anti-Patterns to Avoid

- **Using `useProtectedRoute` for role checks:** The hook uses `isLoading` destructured from `useAuth`, but `useAuth` returns `loading` — so `isLoading` is always `undefined`, meaning `!isLoading` is always `true` and the auth check fires immediately before Firebase responds. Do not use this hook for role-based checks until the destructuring bug is fixed.
- **Removing the existing useEffect from pages before adding MemberGuard:** The pages currently have both a manual `useEffect` auth redirect AND a `if (!user) return null`. Keep consistent pattern — MemberGuard replaces both.
- **Reading role from Firebase Custom Claims:** Roles are stored in Firestore `users/{uid}.role`, not Custom Claims. `useUserData` is the correct hook.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Role comparison | Custom role comparison logic in each page | `ROLE_LEVEL` map in `MemberGuard` | Single source of truth, mirrors Firestore `roleLevel()` |
| Image serving | Custom image serving component | `DynamicImageBlock` | Already handles onSnapshot, fallback, mounting guard |
| Auth state | Manual Firestore reads for user data | `useUserData` | Already normalizes role with backward compat |

**Key insight:** All infrastructure already exists. Phase 3 is purely wiring — not building.

---

## Common Pitfalls

### Pitfall 1: useUserData double-loading state
**What goes wrong:** `useUserData` has two loading states: `authLoading` (from `useAuth`) and `loading` (Firestore doc fetch). It returns `loading: authLoading || loading`. If you check only `userData?.role` without waiting for the combined `loading` to be false, you get `undefined` role and redirect to `/acces-refuse` even for authorized users.
**Why it happens:** Firebase Auth state resolves before Firestore doc fetch.
**How to avoid:** Always gate on `loading` (the combined flag) from `useUserData` before checking role.
**Warning signs:** Authorized users briefly see the access denied redirect before content loads.

### Pitfall 2: useProtectedRoute bug (isLoading vs loading)
**What goes wrong:** `hooks/use-protected-route.ts` line 23: `const { user, isLoading } = useAuth()`. `useAuth` returns `loading`, not `isLoading`. So `isLoading` is `undefined`, the check `if (!isLoading)` is always true, and the redirect fires before Firebase has confirmed the user's auth state.
**Why it happens:** Naming mismatch between `useAuth` API and `useProtectedRoute` destructuring.
**How to avoid:** Do not use `useProtectedRoute` in Phase 3. Use `MemberGuard` (which uses `useUserData`'s combined `loading` state) instead.
**Warning signs:** Logged-in users get redirected to `/connexion` immediately.

### Pitfall 3: carnet-adresse vs carnet-adresses directory
**What goes wrong:** Two directories exist: `app/infos-docs/carnet-adresse/` (no `s`) and `app/infos-docs/carnet-adresses/`. Only `carnet-adresses/page.tsx` has the real auth-guarded page; `carnet-adresse/` appears to be a legacy/empty path.
**Why it happens:** Probable typo during initial creation.
**How to avoid:** Apply MemberGuard only to `app/infos-docs/carnet-adresses/page.tsx`.

### Pitfall 4: site_images collection not seeded
**What goes wrong:** `DynamicImageBlock` silently falls back to `fallbackSrc` if the Firestore doc doesn't exist. Uploading an image via admin panel only works if the document already exists (admin panel does `updateDoc`, not `setDoc`).
**Why it happens:** `seed-site-images.js` needs to be run once to create documents; the admin `handleFileSelect` function calls `updateDoc` which requires a pre-existing document.
**How to avoid:** Verify `site_images` collection exists in Firestore before testing SITE-02. Run `node scripts/seed-site-images.js` if collection is empty.
**Warning signs:** Admin image upload returns Firestore error; images never appear even after upload.

### Pitfall 5: Firestore birthdays/contacts rules only check auth, not role
**What goes wrong:** Even after MemberGuard is applied client-side, `birthdays` and `contacts` Firestore rules only check `request.auth != null`. An `ami` user who bypasses the client guard (e.g. via direct API call) can still read the data.
**Why it happens:** Firestore rules use `hasRole()` for role checks, but the birthday/contacts rules were written before Phase 2 added `hasRole()`.
**How to avoid:** This is a known gap that is OUT OF SCOPE for Phase 3 (Firestore rules hardening of existing collections was deferred). The client-side guard is sufficient for the success criteria. Document in the PLAN for awareness.

---

## Code Examples

### Client-side role hierarchy (mirrors Firestore roleLevel())
```typescript
// To use in MemberGuard — no import needed, define inline
const ROLE_LEVEL: Record<string, number> = {
  admin: 4,
  conseil: 3,
  membre: 2,
  member: 2,   // backward-compat (old Firestore value)
  ami: 1,
  visitor: 1,  // backward-compat (old Firestore value)
};

function hasMinRole(userRole: string | undefined, minRole: string): boolean {
  return (ROLE_LEVEL[userRole ?? 'ami'] ?? 0) >= (ROLE_LEVEL[minRole] ?? 0);
}
```

### useUserData pattern (already used by AdminGuard)
```typescript
// Source: hooks/use-user-data.tsx
const { user, userData, loading } = useUserData();
// userData.role is one of: 'ami' | 'membre' | 'conseil' | 'admin'
// loading combines authLoading + Firestore fetch
```

### Page wrapping pattern
```typescript
// Replace the existing auth check in each protected page:
// BEFORE — each page has manual useEffect + useAuth:
export default function ProtectedPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && !user) router.push('/connexion?redirect=...');
  }, [user, loading, router]);
  if (loading || !user) return <Spinner />;
  return <PageContent />;
}

// AFTER — wrap with MemberGuard:
import { MemberGuard } from '@/components/auth/member-guard';
export default function ProtectedPage() {
  return (
    <MemberGuard minRole="membre">
      <PageContent />
    </MemberGuard>
  );
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual `useEffect` + `useAuth` | `MemberGuard` component | Phase 3 (now) | Centralized, testable, reusable |
| `isAdmin` boolean field | `role` string field | Phase 1 | Enables hierarchy checks beyond admin/not-admin |
| `member` / `visitor` role values | `membre` / `ami` | Phase 1 | French-canonical values with backward-compat in normalizeRole |

**Deprecated/outdated:**
- `useProtectedRoute`: Has `isLoading` bug; not currently used anywhere in the app; do not adopt for Phase 3.
- `isAdmin` boolean field on Firestore users doc: Cleaned up lazily in Phase 1 via `deleteField()` on write.

---

## Open Questions

1. **Is `site_images` collection seeded in production Firestore?**
   - What we know: Seed script exists at `scripts/seed-site-images.js`. Admin `updateDoc` call requires documents to pre-exist.
   - What's unclear: Whether the seed was run after Phase 1/2 completion.
   - Recommendation: SITE-02 plan must include a verification step — check Firestore console or run seed script if empty. Mark as a human-action checkpoint.

2. **Should `carnet-adresse/` (no s) be deleted or left as-is?**
   - What we know: Both directories exist; `carnet-adresse/` appears empty (no auth page).
   - What's unclear: Whether it serves a redirect purpose.
   - Recommendation: Leave it alone in Phase 3 — out of scope, no risk.

3. **Should Firestore rules for `birthdays` and `contacts` be upgraded to use `hasRole('membre')`?**
   - What we know: Currently only check `request.auth != null`, which allows any authenticated user (including `ami`) to read.
   - What's unclear: Whether this is intentional or an oversight from Phase 2.
   - Recommendation: Out of scope for Phase 3 (not in requirements). Document in PLAN as a known gap. Client-side MemberGuard is the enforcement layer.

---

## Sources

### Primary (HIGH confidence)
- Codebase inspection — `components/auth/admin-guard.tsx` (AdminGuard pattern)
- Codebase inspection — `hooks/use-user-data.tsx` (role fetch implementation + normalizeRole)
- Codebase inspection — `hooks/use-protected-route.ts` (bug confirmed: line 23 `isLoading` vs `loading`)
- Codebase inspection — `components/ui/dynamic-image-block.tsx` (DynamicImageBlock implementation)
- Codebase inspection — `app/admin/images-site/page.tsx` (admin upload uses `updateDoc`)
- Codebase inspection — `firestore.rules` (role hierarchy functions `roleLevel()`, `hasRole()`)
- Codebase inspection — `app/infos-docs/anniversaires/page.tsx`, `membres/page.tsx`, `carnet-adresses/page.tsx` (current auth state)

### Secondary (MEDIUM confidence)
- `.planning/ROADMAP.md` — phase goals and success criteria
- `.planning/PROJECT.md` — permission matrix, scope definition
- `.planning/STATE.md` — current position (Phase 2 complete, Phase 3 not started)

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all components exist and were read directly
- Architecture: HIGH — AdminGuard is a proven template; MemberGuard is a direct adaptation
- Pitfalls: HIGH — useProtectedRoute bug confirmed by code inspection; seed requirement confirmed by updateDoc usage in admin page

**Research date:** 2026-02-24
**Valid until:** 2026-03-24 (stable codebase, no fast-moving dependencies)
