# Project Research Summary

**Project:** EPLS — Firebase RBAC + Bug Fixes on Church Website
**Domain:** Brownfield Next.js 14 + Firebase — Role-Based Access Control
**Researched:** 2026-02-19
**Confidence:** HIGH

## Executive Summary

EPLS is a production church website (95% complete) built on Next.js 14 App Router + Firebase. The milestone at hand is narrow but precise: add 3 shared group accounts (Amis, Membres, Conseil) with tiered permissions, fix a known PERMISSION_DENIED bug on admin message deletion, and add a favicon. The critical insight from research is that the RBAC skeleton already exists in the codebase — `AdminGuard`, `useProtectedRoute` with role support, `hasRole()` in `firebase-helpers.ts`, and Firestore rules with `isAdmin()` — but these pieces are not wired together consistently. The gap is between client-side guards and the Firestore rules, not a missing architecture.

The recommended approach is deliberate minimalism: store roles as a `role` field (`'ami' | 'membre' | 'conseil' | 'admin'`) in the existing Firestore `users/{uid}` document, use the existing `useProtectedRoute` hook for page-level guards, and keep Firestore security rules as the true enforcement layer. Firebase Auth custom claims are explicitly rejected for this project — they require a Blaze plan or Firebase Admin SDK configured for production (currently disabled), they have a 1-hour propagation delay, and with only 4 accounts the Firestore `get()` read cost is negligible. This approach adds zero new dependencies.

The highest-priority risk is already known: the `deleteMessage` Server Action imports from the Firebase client SDK (`firebase/firestore`) and runs it inside a `'use server'` function without browser auth context. Firestore sees `request.auth == null` and rejects the write. This must be fixed first, before any RBAC expansion, by switching to `adminDb` (Firebase Admin SDK) and verifying the user's session server-side. A secondary data inconsistency — dual role fields (`isAdmin: boolean` vs `role: string`) — must be resolved to prevent client checks passing while Firestore rules deny.

## Key Findings

### Recommended Stack

The existing stack (Next.js 14 App Router, Firebase Auth, Firestore, TypeScript) is already optimal and requires no additions. The RBAC feature is implemented entirely within the existing toolchain. The only new artifact is a `useRole` hook (wrapping the existing `useRealtimeDocument`) and a `MemberGuard` component (mirroring the existing `AdminGuard`).

**Core technologies and their RBAC role:**
- **Firestore `users/{uid}` document**: Single source of truth for role — extends existing `isAdmin` pattern with a unified `role` field
- **`useProtectedRoute` hook** (`hooks/use-protected-route.ts`): Client-side role enforcement — already built and supports `requiredRole`/`checkRole`, underused on infos-docs routes
- **Firestore Security Rules** (`firestore.rules`): Server-side enforcement that cannot be bypassed — already correct for most routes, needs null-safety fix on `isAdmin()` and Admin SDK fix for Server Actions
- **Firebase Admin SDK** (`lib/firebase-admin.ts`): Required for Server Actions that mutate Firestore — currently bypassed in the `deleteMessage` action
- **`app/favicon.ico`** (Next.js 14 App Router convention): Place the file here; no `layout.tsx` changes needed

### Expected Features

**Must have (table stakes):**
- Role-based route protection — 4 routes have differentiated permissions; infrastructure exists, wiring is missing
- Shared group account creation (Amis, Membres, Conseil) — 3 Firebase Auth accounts with `role` field in Firestore
- Permission matrix enforcement — `useProtectedRoute` applied to `/infos-docs/membres`, `/infos-docs/anniversaires`, `/infos-docs/carnet-adresses` (conseil) and base authenticated routes (ami)
- Firestore rules security fix — `isAdmin()` null-safety, `messages` delete via Admin SDK, `blogTags` create rule
- Login redirect-back — `callbackUrl` param already written, needs to be consumed post-login
- Access denied page — already done at `/acces-refuse`

**Should have (competitive/UX):**
- Per-role UI visibility — hide nav items that the current role cannot access (prevents confusion, not a security layer)
- Role display in profile — show current role to confirm which shared session is active
- `MemberGuard` component — centralize the auth redirect pattern currently duplicated across 3 pages

**Defer (v2+):**
- Audit log of access attempts — overkill for a congregation of this size
- Individual accounts per member — deliberately rejected by the client
- Firebase custom claims migration — correct future path if traffic grows; not needed now

### Architecture Approach

The architecture is three enforcement layers in sequence: (1) Next.js middleware for coarse unauthenticated redirects (cookie check only, Edge-compatible), (2) component guards (`AdminGuard`, new `MemberGuard`) for client-side role redirect with skeleton loading state, and (3) Firestore security rules as the true security boundary that cannot be bypassed from the browser console. The only structural change is migrating Server Actions that write to Firestore from the client SDK to the Admin SDK, so they carry service account authority rather than unauthenticated context.

**Major components:**
1. **`users/{uid}` Firestore document** — unified role schema (`role: 'ami' | 'membre' | 'conseil' | 'admin'`, `isAdmin: boolean` kept for backward compat)
2. **`hasRole()` in `lib/firebase-helpers.ts`** — needs `isAdmin` fallback fix so role checking works before document migration
3. **`MemberGuard`** (`components/auth/member-guard.tsx`) — new, mirrors `AdminGuard`, wraps infos-docs pages
4. **Firestore rules `isAdmin()` helper** — needs null-safety via `.get('isAdmin', false)` and role hierarchy functions
5. **`deleteMessage` Server Action** — switch from client `deleteDoc` to `adminDb.collection('messages').doc(id).delete()` with server-side token verification

### Critical Pitfalls

1. **Client SDK in Server Actions runs unauthenticated (CRITICAL)** — `deleteDoc` from `firebase/firestore` inside `'use server'` has no browser auth context; Firestore sees `request.auth == null`. Fix: use `adminDb` in all Server Actions that mutate data.

2. **`get()` in Firestore rules fails silently when user document is missing (HIGH)** — throws inside rule evaluator → PERMISSION_DENIED for legitimate admin. Fix: use `.get('isAdmin', false)` null-safe accessor; fix `saveUserProfile()` to use `setDoc` not `updateDoc` for new documents.

3. **Dual role fields diverge — `role` vs `isAdmin` (HIGH)** — client checks `profile.role`, rules check `isAdmin`. A user can have `role: 'admin'` but `isAdmin: false`, making client UI pass and Firestore operations fail. Fix: unify in a single creation script; add fallback in `hasRole()` to derive from `isAdmin` if `role` field absent.

4. **Client-side role checks are not a security boundary (HIGH)** — `useProtectedRoute` and `hasRole()` redirect in the browser but a motivated user can call Firestore directly. Fix: every piece of sensitive data must have a corresponding Firestore rule; do not rely on UI gating alone for data security. Audit `contacts.notes` field (currently readable by all authenticated users).

5. **`users` collection write rule allows self-role-escalation (HIGH)** — current rule `allow write: if request.auth.uid == userId` lets users overwrite their own `role` field. Fix: add `!request.resource.data.diff(resource.data).affectedKeys().hasAny(['role', 'isAdmin'])` to the update rule.

## Implications for Roadmap

Based on research, the correct phase structure is sequential with strict dependency ordering. Phase 0 must complete before Phase 1 begins because data inconsistencies in Phase 0 will cause Phase 1 tests to produce misleading results.

### Phase 0: Bug Fixes and Security Hardening

**Rationale:** The PERMISSION_DENIED bug is the most reported issue and is caused by a fundamental architecture error (client SDK in Server Actions). This must be fixed in isolation so its resolution is confirmed before RBAC is layered on top. Two additional security holes (blogTags open create, users self-role-escalation) should be closed before shared accounts are created.
**Delivers:** Working admin message deletion; null-safe Firestore rules; correct user document creation; favicon
**Addresses:** Table-stakes features 4 (admin hardcoded), 7 (Firestore rules fix)
**Avoids:** Pitfalls 10 (client SDK in Server Actions), 1 (get() fails on missing doc), 9 (blogTags open write)

**Specific tasks:**
- Switch `deleteMessage` Server Action to Firebase Admin SDK with server-side token verification
- Fix `saveUserProfile()` to use `setDoc` on new-document branch
- Add null-safety to `isAdmin()` rule: `.get('isAdmin', false)`
- Close `blogTags` create rule: `allow create: if isAdmin()`
- Tighten `users` update rule to block `role`/`isAdmin` self-modification
- Place `app/favicon.ico`

### Phase 1: RBAC Foundation — Role Schema and Account Creation

**Rationale:** Before wiring route protection, the role data must exist and be consistent. Creating the 3 shared accounts and unifying the role schema is a prerequisite for all client-side and rules-based enforcement in Phase 2.
**Delivers:** 3 Firebase Auth shared accounts with correct Firestore user documents; unified role schema; `hasRole()` fallback fix; updated Firestore rules with role hierarchy functions
**Addresses:** Table-stakes features 1 (role-based route protection), 2 (shared group accounts), 7 (Firestore rules matching app logic)
**Avoids:** Pitfalls 2 (dual role fields), 3 (audit trail — accepted constraint), 8 (shared password decision — accepted per PROJECT.md)

**Specific tasks:**
- Create 3 Firebase Auth accounts (ami, membre, conseil shared emails)
- Write Firestore `users/{uid}` documents with `role` field and `isAdmin: false`
- Add `role: 'admin'` and `isAdmin: true` to admin's existing Firestore document
- Fix `hasRole()` fallback in `lib/firebase-helpers.ts`
- Update `firestore.rules` with `hasRole(minRole)` hierarchy functions
- Add `lib/permissions.ts` with `ROUTE_PERMISSIONS` constant

### Phase 2: Route Protection Wiring

**Rationale:** With role data correct and rules updated, the client-side guards can be wired. This phase is mechanical — the hooks and patterns exist; it is migration and application of existing abstractions.
**Delivers:** All 4 differentiated routes protected by correct role; `MemberGuard` component; login redirect-back consuming `callbackUrl`; per-role nav visibility
**Addresses:** Table-stakes features 3 (permission matrix), 5 (access denied page already done), 6 (login redirect-back)
**Avoids:** Pitfall 7 (client-side not a security boundary — Firestore rules handle real security)

**Specific tasks:**
- Create `components/auth/member-guard.tsx` mirroring `AdminGuard`
- Migrate `infos-docs/membres`, `infos-docs/anniversaires`, `infos-docs/carnet-adresses` to `MemberGuard`
- Apply `useProtectedRoute` with `requiredRole: 'conseil'` to `/infos-docs/membres`
- Apply `useProtectedRoute` with `requiredRole: 'membre'` to `/infos-docs/anniversaires` and `/infos-docs/carnet-adresses`
- Consume `callbackUrl` in `connexion` page post-login redirect
- Add role display to profile card
- Conditionally hide nav items based on role

### Phase 3: Hardening and Audit (Optional)

**Rationale:** After RBAC is functional, a security audit of Firestore rules and a review of the catch-all rule prepares the codebase for future features without accumulating security debt.
**Delivers:** Documented rule-first development convention; `contacts.notes` field access reviewed; catch-all rule annotated
**Avoids:** Pitfall 5 (read cost multiplication), 6 (catch-all blocks future writes)

### Phase Ordering Rationale

- Phase 0 before Phase 1: The PERMISSION_DENIED bug proof-of-fix requires Admin SDK working. If Admin SDK is broken in production, Phase 1 account creation scripts may also silently fail.
- Phase 1 before Phase 2: Route guards that check `role` return `false` until the role field exists in Firestore documents. Testing Phase 2 without Phase 1 data produces false negatives.
- Phase 2 before Phase 3: Hardening an incorrect implementation wastes effort. Get it working, then tighten.

### Research Flags

Phases needing no additional research (well-documented patterns):
- **Phase 0:** All fixes are concrete and codebase-specific — no external research needed
- **Phase 1:** Firestore role schema and rule syntax are well-documented; implementation is direct
- **Phase 2:** `AdminGuard` / `useProtectedRoute` patterns already exist in the codebase — mirror them

No phase in this milestone requires a `/gsd:research-phase` call. All decisions are resolved with HIGH confidence.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | No new dependencies; entire implementation uses existing codebase tools |
| Features | HIGH | Permission matrix is explicitly defined in PROJECT.md; scope is fixed |
| Architecture | HIGH | Based on direct codebase analysis — existing components identified, gaps confirmed |
| Pitfalls | HIGH | Root causes confirmed through code analysis (client SDK in Server Actions is the confirmed bug cause) |

**Overall confidence:** HIGH

### Gaps to Address

- **Firebase Admin SDK production configuration:** `lib/firebase-admin.ts` uses fake credentials in development and may have issues in production. Before Phase 0 is considered complete, verify that `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` env vars are set in production. If they are not, the Server Action fix (Phase 0) will not work in production.

- **Server-side ID token verification method:** The `deleteMessage` Server Action fix requires obtaining the user's Firebase ID token from the client and passing it to the Server Action, or using a session cookie. The exact mechanism (cookie vs explicit token param) should be decided before implementation. Both work; the cookie approach is cleaner but requires additional cookie management.

- **`contacts.notes` field sensitivity:** Research flags that the `contacts` collection uses `allow read: if request.auth != null`, meaning any logged-in user (including Amis) can read private admin notes in the `notes` field. Whether this is acceptable is a product decision. If notes are sensitive, a subcollection with `isAdmin()` read restriction is needed.

## Sources

### Primary (HIGH confidence)
- Direct codebase analysis (`firestore.rules`, `lib/firebase-helpers.ts`, `app/admin/messages/actions.ts`, `hooks/use-protected-route.ts`, `lib/firebase-admin.ts`, `middleware.ts`) — all pitfalls and architecture findings
- Next.js 14 App Router documentation knowledge — favicon convention (`app/favicon.ico`), middleware Edge runtime limitations
- Firebase documentation knowledge — custom claims propagation delay, Firestore rule `get()` cost, Admin SDK vs client SDK auth context

### Secondary (MEDIUM confidence)
- Firebase security rules `.get(field, default)` null-safe accessor — standard documented pattern for missing field safety

### Tertiary (LOW confidence)
- Read cost projections for `isAdmin()` `get()` calls under Spark plan — estimated from documented 50,000 reads/day limit; actual impact depends on admin activity volume

---
*Research completed: 2026-02-19*
*Ready for roadmap: yes*
