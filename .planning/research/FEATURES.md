# FEATURES — RBAC & Access Control for Church/Community Websites

**Research type:** Project Research — Features dimension
**Date:** 2026-02-19
**Context:** EPLS church website, 3 shared group accounts with tiered access (Amis, Membres, Conseil), single hardcoded admin email, permission matrix enforced across specific routes.

---

## What This Answers

> What features do church/community websites with member areas typically have for access control? What's table stakes vs differentiating?

---

## Table Stakes (Must-Have for RBAC)

These are baseline behaviors any tiered access system requires to be functional and trustworthy.

### 1. Role-based route protection
**What:** Server-enforced gates that prevent lower roles from accessing higher-tier routes. Both client-side redirect (UX) and server-side check (security).
**Complexity:** Low-medium. Next.js middleware + Firestore role lookup.
**Dependencies:** Role storage model (Firestore `users` collection), middleware token verification.
**EPLS specifics:** Current middleware is a stub (dev mode bypasses all checks). Must be filled with real role evaluation for production. Existing `useProtectedRoute` + `hasRole` hooks already handle client-side; middleware handles server-side.

### 2. Shared group accounts with single login per tier
**What:** One Firebase Auth account per tier (Amis, Membres, Conseil). All members in that group use the same email+password. No per-person registration required.
**Complexity:** Low. Standard Firebase Auth accounts. The simplicity is intentional for a small congregation.
**Dependencies:** Firebase Auth, a way to tag these accounts with their role in Firestore users collection.
**EPLS specifics:** Credentials already defined in PROJECT.md. Accounts need to be created in Firebase Auth and their role stored in Firestore `users/{uid}` as `role: 'ami' | 'membre' | 'conseil'`.

### 3. Permission matrix enforcement
**What:** Each protected page checks the authenticated user's role against a known permission table. Access denied → redirect to `/acces-refuse`.
**Complexity:** Low if roles are stored correctly. The matrix is small (4 routes differ in permissions).
**Dependencies:** Role storage, middleware, `hasRole` utility, `useProtectedRoute` hook.
**EPLS specifics:**

| Route | Admin | Conseil | Membres | Amis |
|-------|-------|---------|---------|------|
| `/admin/*` | ✓ | ✗ | ✗ | ✗ |
| `/infos-docs/membres` | ✓ | ✓ | ✗ | ✗ |
| `/infos-docs/anniversaires` | ✓ | ✓ | ✓ | ✗ |
| `/infos-docs/carnet-adresses` | ✓ | ✓ | ✓ | ✗ |
| All other protected routes | ✓ | ✓ | ✓ | ✓ |

### 4. Admin hardcoded by email
**What:** A single email (`samdumay67@gmail.com`) is treated as admin. This is checked against `isAdmin` field or by email comparison, not through the role-tier hierarchy.
**Complexity:** Near-zero. Already implemented via `useUserData.isAdmin`. Bug: Firestore rules don't recognize this for delete operations on `messages` collection → PERMISSION_DENIED.
**Dependencies:** Firestore security rules must match application logic.

### 5. Access denied page with context
**What:** When a user lands on a route they are not allowed, they see a clear "access denied" message with their current identity shown and a way to go back or to home.
**Complexity:** None — already implemented at `/acces-refuse`.
**Dependencies:** None.

### 6. Login page with redirect-back
**What:** Unauthenticated users redirected to `/connexion?callbackUrl=...` and returned to original destination after login.
**Complexity:** Low — already partially implemented. The `callbackUrl` query param is written but must be consumed post-login.
**Dependencies:** Login form reading `callbackUrl` from query string.

### 7. Firestore security rules matching application logic
**What:** Server-side rules must mirror the RBAC matrix. Client-side guards alone are insufficient — malicious requests can bypass them. Rules must check role from user document.
**Complexity:** Medium. Firestore rules have a known pattern (get user doc, check field). There is an existing bug where admin delete on `messages` fails.
**Dependencies:** Role stored as readable field in `users/{uid}`. Rules must be deployed to Firebase.

---

## Differentiators (Nice-to-Have)

These features are found on some church/community sites but are not required for a functioning RBAC system.

### 8. Per-role UI visibility (show/hide menu items)
**What:** Navigation items for restricted pages are hidden from users who can't access them, reducing confusion without blocking. Example: Amis don't see "Carnet d'adresses" in the sidebar.
**Complexity:** Low. Conditional rendering based on `useAuth` + role.
**Dependencies:** Role available in client context.
**Note:** This is UX polish on top of the real enforcement. Nice to have but not the security layer.

### 9. Role display in profile / session indicator
**What:** A user sees their current role displayed ("Connecté en tant que : Membre EPLS") in their profile or in the header. Useful for shared accounts to confirm which session is active.
**Complexity:** Low. Add role label to profile card.
**Dependencies:** Role stored in Firestore user document.

### 10. Grace period for expired/changed passwords
**What:** If the shared account password is rotated (e.g., annually), users who are still mid-session continue until token expires. Re-login prompts are graceful.
**Complexity:** Low — Firebase handles token expiry automatically. Ensure UI handles re-auth gracefully.
**Dependencies:** Firebase Auth token refresh flow.

### 11. Audit log of role-gated access attempts
**What:** Admin can see a log of access-denied events (who tried to reach what). Useful for small congregations to detect unauthorized sharing of passwords.
**Complexity:** Medium. Requires writing to a Firestore `access_logs` collection on each denied access attempt.
**Dependencies:** Server-side middleware writing to Firestore.
**Note:** Probably overkill for a congregation of this size. Log it only if there's a real moderation need.

### 12. Role change without account recreation
**What:** Admin can change a user's role by updating the Firestore document, without deleting/recreating the Firebase Auth account.
**Complexity:** Low-medium. Requires an admin UI input to update `users/{uid}.role`. Already possible with existing admin patterns.
**Dependencies:** Admin page for user management. Existing `/admin/membres` page could expose this.

---

## Anti-Features (Deliberately NOT Build)

These are patterns common in RBAC systems that would be wrong for EPLS's specific context.

### A. Individual user accounts per congregation member
**Why not:** The client explicitly chose shared group accounts for simplicity. The congregation is not tech-savvy; per-person login with email verification would create support burden.
**What to do instead:** Keep 3 shared accounts. Password sharing within the group is intentional.

### B. Firebase Custom Claims for roles
**Why not:** Custom claims require a server-side function (Cloud Functions) to set, which requires Blaze plan (paid) or a backend process outside Next.js. The project is on Firebase free tier. Custom claims are the "correct" enterprise pattern but overkill here.
**What to do instead:** Store role as a Firestore field in `users/{uid}`. Already in codebase (`role: string` in `firebase-helpers.ts`). Read it on demand in rules and in client.
**Tradeoff:** Slightly slower (1 extra Firestore read per rule evaluation) but works on free tier.

### C. OAuth / social login for shared accounts
**Why not:** Shared accounts can't use Google/Apple OAuth — those tie to individual identities. Email+password is the only viable method for shared accounts.
**What to do instead:** Keep email+password for the 3 tier accounts.

### D. Self-service registration for role upgrades
**Why not:** There is no workflow for a user to "apply" to become a Membre or Conseil. Role assignment is by the pastor/admin providing credentials directly.
**What to do instead:** Admin hands out credentials. No in-app request flow needed.

### E. JWT-based stateless role checks in middleware
**Why not:** Would require Firebase Admin SDK in the Edge Runtime, which is not trivially set up on Vercel free tier. The current middleware explicitly documents this limitation.
**What to do instead:** Use client-side `useProtectedRoute` hook for UX protection, and Firestore security rules for data protection. These two layers cover the actual attack surface.

### F. Fine-grained per-document permissions
**Why not:** The permission matrix is route-level, not document-level. No document in EPLS requires "User X can see document Y but not Z within the same collection."
**What to do instead:** Route-level access control only. Simpler to reason about, implement, and debug.

---

## Feature Dependencies Map

```
Role storage (Firestore users/{uid}.role)
  └── hasRole() utility                     [existing]
        └── useProtectedRoute hook          [existing]
              └── Per-route access check    [to implement on each route]
        └── Firestore security rules        [to fix — bug on messages]
              └── Admin delete on messages  [blocked by this]
  └── useUserData.role                      [needs role field populated]
        └── UI visibility per role          [differentiator]
        └── Profile role display            [differentiator]

Firebase Auth shared accounts              [to create]
  └── Role tagged in users collection       [to do at account creation]
        └── All of the above works
```

---

## Complexity Summary

| Feature | Complexity | Status |
|---------|------------|--------|
| Route protection (server middleware) | Medium | Stub exists, needs implementation |
| Shared account creation | Low | Pending (credentials defined) |
| Permission matrix enforcement | Low | Infrastructure exists, need wiring |
| Admin by email | Low | Exists, bug in Firestore rules |
| Access denied page | None | Done |
| Login with redirect-back | Low | Partially done |
| Firestore rules fix (messages delete) | Low-Medium | Known bug |
| Per-role UI visibility | Low | Differentiator |
| Role in profile display | Low | Differentiator |
| Custom claims | High | Anti-feature for this project |
| Per-user accounts | High | Anti-feature by design |

---

## Key Insight for Requirements

The EPLS RBAC is deliberately minimal: 3 tiers + 1 hardcoded admin, route-level only, no self-service. The implementation risk is not in feature complexity — it's in the gap between the client-side guards (already built) and the Firestore rules (partially broken). The critical path is:

1. Create 3 Firebase Auth accounts with correct role field in Firestore
2. Wire permission matrix to existing `useProtectedRoute` on the 4 differentiated routes
3. Fix Firestore rules so admin can delete messages
4. Optionally: fill the middleware stub for server-side enforcement (defense in depth)

Everything else is polish.

---

*Research by: Claude Code project researcher*
*Last updated: 2026-02-19*
