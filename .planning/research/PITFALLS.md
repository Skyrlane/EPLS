# PITFALLS: Firebase RBAC on Existing Production App

**Research type:** Project Research — Pitfalls dimension
**Scope:** Adding RBAC and fixing bugs on production church website (protestants-libres.fr)
**Date:** 2026-02-19
**Status:** Complete

---

## Context

Adding 3 shared group accounts with tiered permissions to a live Firebase + Next.js 14 app. Known active bug: PERMISSION_DENIED on admin message deletion despite user being admin. Current role system uses a Firestore document field (`users/{uid}.isAdmin`) checked via a `get()` call inside security rules.

---

## Pitfall 1: The `get()` call in `isAdmin()` fails silently when the user document doesn't exist yet

**What goes wrong:**
The current `isAdmin()` rule does:
```
get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true
```
If the `users/{uid}` document does not exist (race condition on first login, shared account with no profile doc, or failed `saveUserProfile()` call), the `get()` throws an exception inside the rule evaluator. Firestore treats this as a rule evaluation failure and **denies** the request — even if the user is legitimately admin. This is the most likely root cause of the existing `PERMISSION_DENIED` bug on message deletion.

**Warning signs:**
- PERMISSION_DENIED errors that appear intermittently for the same admin user
- Errors happen right after login, before the page fully loads
- The `saveUserProfile()` function in `firebase-helpers.ts` uses `updateDoc` when the document doesn't exist (it checks `userSnap.exists()` but then calls `updateDoc` rather than `setDoc` on the new-doc branch — this will throw and silently skip profile creation)

**Prevention strategy:**
- Add a null check in the rule: `get(...).data.get('isAdmin', false) == true` — the `.get(field, default)` method in Firestore rules prevents the exception when the field or document is missing
- Fix `saveUserProfile()` to use `setDoc` (not `updateDoc`) for the new-document branch
- Add a rule-level existence check: `exists(/databases/$(database)/documents/users/$(request.auth.uid)) && get(...).data.isAdmin == true`

**Phase:** Bug fix — Phase 0 (before any RBAC expansion)

---

## Pitfall 2: Role stored in Firestore document is not the same as role enforced in security rules

**What goes wrong:**
The app stores `role: 'member' | 'admin' | 'visitor'` in `UserProfile` (checked by `hasRole()` in client code) AND a separate `isAdmin: boolean` field checked by security rules. These two sources of truth can diverge. A user can have `role: 'admin'` in Firestore (passes client checks) but `isAdmin: false` or missing (fails security rules). Shared group accounts are especially prone to this: whoever creates the account document may set one field but not the other.

**Warning signs:**
- Client-side UI shows admin controls (because `hasRole()` checks `role` field)
- Firestore operations fail with PERMISSION_DENIED (because rules check `isAdmin`)
- Inconsistency only appears on write operations, not reads

**Prevention strategy:**
- Consolidate to one authoritative field. Recommended: use only `isAdmin` in rules and in client code. Remove `role` field as the permission gatekeeper, or keep `role` and derive `isAdmin` from it (`role == 'admin'`) in the rules function
- When creating shared group accounts, write a single creation script/admin action that sets both fields atomically
- Add a Firestore index or admin script to audit documents where `role == 'admin'` but `isAdmin != true`

**Phase:** Phase 1 (RBAC design) — resolve before creating shared accounts

---

## Pitfall 3: Shared accounts bypass per-user audit trails and cannot have individualized permissions

**What goes wrong:**
Shared group accounts (multiple real humans using the same Firebase Auth credentials) lose all per-user audit capability. Firebase Auth `uid` is the same for all users of the account. Documents with `createdBy: uid` become ambiguous. Worse, when you need to give one person in the group a different permission level than another, you cannot — the permission is on the Firebase Auth user, not the human.

**Warning signs:**
- `createdBy`, `uploadedBy`, `updatedBy` fields in collections like `gallery_photos`, `missionaries`, `partner_sites` become meaningless
- One member of the shared group leaves; you cannot revoke their access without changing the shared password
- You need "secretary can edit contacts but not delete" and "treasurer can only see plannings" — this cannot be expressed with shared accounts without sub-account logic

**Prevention strategy:**
- Use Firebase Auth custom claims OR Firestore role documents to encode granular permissions, not just `isAdmin: true/false`
- Model permissions as capability sets: `{ canDeleteMessages: true, canEditContacts: true, canManageGallery: false }` stored in the user document or as custom claims
- For shared accounts: create one real Firebase Auth user per group, but implement an activity log collection that captures the human's display name at write time (passed from the client) — accepting this is self-reported and not cryptographically trustworthy
- Prefer individual accounts with role assignments over shared accounts; shared accounts are a red flag for church volunteer management

**Phase:** Phase 1 (RBAC design) — foundational decision before implementation

---

## Pitfall 4: Firebase custom claims require a token refresh to take effect — users see stale permissions

**What goes wrong:**
If you move to custom claims (via Firebase Admin SDK) to encode roles, the claims are embedded in the ID token. The token is valid for 1 hour. After you set a custom claim via `admin.auth().setCustomUserClaims(uid, { isAdmin: true })`, the **currently logged-in user** does not get the new claim until their token refreshes. On a production site, this means:
- You promote a user to admin; they try to delete a message immediately; it fails
- You revoke admin rights; the ex-admin can still perform admin operations for up to 1 hour

**Warning signs:**
- PERMISSION_DENIED errors right after granting a new role
- Newly created shared accounts work in the console but fail in the app
- Forced logout/login "fixes" the permission problem

**Prevention strategy:**
- After setting custom claims server-side, force a token refresh on the client: `await user.getIdToken(true)` then re-read `user.getIdTokenResult()`
- For the admin panel, add a "refresh session" mechanism or redirect to sign-in after role changes
- Document that role changes are not instant if using custom claims
- If using Firestore-document-based roles (current approach), this pitfall does not apply — but the `get()` cost per rule evaluation does (see Pitfall 5)

**Phase:** Phase 2 (implementation) — address in account creation/role-change flows

---

## Pitfall 5: The `isAdmin()` function performs a Firestore `get()` on every rule evaluation — costs multiply fast

**What goes wrong:**
The current `isAdmin()` rule does a `get()` to read the user document on every single Firestore operation. Each `get()` in a security rule counts as one document read. A single page load in the admin panel may trigger 10–30 Firestore operations (reading messages, gallery photos, plannings, etc.). Each of those operations evaluates `isAdmin()`, each costs 1 extra read. On a free Spark plan, the daily read limit (50,000) can be consumed significantly faster than expected once admin operations become frequent.

**Warning signs:**
- Firebase console shows unexpectedly high read counts
- Costs appear after admin activity, not public visitor activity
- The pattern scales with `O(admin_operations * 2)` reads instead of `O(admin_operations)`

**Prevention strategy:**
- Migrate to Firebase custom claims: `request.auth.token.isAdmin == true` costs zero extra reads and is the recommended production pattern for role checks in rules
- If keeping Firestore-document roles, cache the admin status in the client and minimize admin page reloads; consider a single server-side check with `firebase-admin` in a Next.js Server Action or Route Handler instead of repeated client-side Firestore calls

**Phase:** Phase 2 (implementation) — important for Spark plan sustainability

---

## Pitfall 6: The catch-all rule `allow write: if isAdmin()` protects unknown collections but also protects against legitimate future non-admin writes

**What goes wrong:**
The current rules end with:
```
match /{document=**} {
  allow read: if request.auth != null;
  allow write: if isAdmin();
}
```
This is a safe default but has two consequences:
1. Any new collection (e.g., `user_preferences`, `notifications`, `group_permissions`) is locked to admin-only writes until an explicit rule is added — developers will hit PERMISSION_DENIED on new features and wonder why
2. If a future tiered-permission role (e.g., "secretary") needs to write to a new collection, the catch-all blocks them unless that collection gets an explicit rule

**Warning signs:**
- New features work in development (Firebase emulator may have permissive rules) but fail in production
- Developers add `allow write: if true` to unstick themselves — security holes accumulate
- PERMISSION_DENIED errors on new collections with no obvious cause

**Prevention strategy:**
- Add a comment to the catch-all rule explicitly flagging it as a safety net, not a permanent solution
- Establish a rule-first development practice: define the Firestore rule for any new collection before writing client code that writes to it
- Consider changing the catch-all `write` to `allow write: if false` after all collections are explicitly covered — makes unintended access fail loudly rather than silently succeeding

**Phase:** Phase 3 (ongoing) — codify as a team convention

---

## Pitfall 7: Client-side role checks (`hasRole()`, `useProtectedRoute`) can be bypassed — they are not a security boundary

**What goes wrong:**
`hasRole()` in `firebase-helpers.ts` reads the `users/{uid}` document from Firestore client-side and checks `profile.role`. `useProtectedRoute` uses this to redirect unauthorized users. Both are UI conveniences, not security. A malicious or curious user can:
- Call Firestore operations directly from the browser console
- Bypass Next.js client-side routing to reach "protected" pages
- Read data that the Firestore rules allow them to read regardless of what the UI shows

The only real security boundary is Firestore security rules.

**Warning signs:**
- Admin pages that are "protected" by `useProtectedRoute` but have no corresponding Firestore rule restriction
- `checkRole: false` (the default in `useProtectedRoute`) — most routes skip the role check entirely
- Data visible in the Firestore console that members should not be able to read via client SDK (e.g., private notes in `contacts.notes`)

**Prevention strategy:**
- For every piece of sensitive data, verify the Firestore rule restricts reads at the collection/document level, not just in the UI
- The `contacts` collection has a `notes` field (private admin notes) — currently `allow read: if request.auth != null` means any logged-in member can read these notes. Add field-level restrictions or move private fields to a subcollection with separate rules
- Audit which collections contain fields that authenticated members should not see, then add appropriate read restrictions

**Phase:** Phase 1 (RBAC design) — security audit before adding more roles

---

## Pitfall 8: Shared password accounts cannot be secured against credential leakage

**What goes wrong:**
Shared accounts (multiple people, one password) for admin functions create an irrecoverable security state: if the password leaks, you must rotate it and notify all users. Firebase Auth has no concept of "sessions for this account" that you can selectively revoke. `admin.auth().revokeRefreshTokens(uid)` revokes ALL sessions for that uid — every person sharing the account is signed out simultaneously, potentially disrupting ongoing work.

**Warning signs:**
- "The treasurer knows the password, the secretary doesn't" — the distinction erodes over time
- A volunteer leaves the church; you're not sure if they know the shared admin password
- Password reset emails go to a shared inbox that multiple people monitor

**Prevention strategy:**
- Use Firebase Auth with individual accounts + role fields, not shared passwords
- If shared accounts are a hard requirement (e.g., a communal tablet in the office), create a dedicated Firebase Auth account for that device with the minimum required permissions, separate from any human's personal account
- Implement `admin.auth().revokeRefreshTokens(uid)` in an admin panel action so credential rotation can be triggered immediately when a volunteer leaves

**Phase:** Phase 0 (pre-implementation decision) — architectural, must decide before creating shared accounts

---

## Pitfall 9: The `blogTags` collection has `allow create: if true` (missing from rules) — unauthenticated writes possible

**What goes wrong:**
The current rule for `blogTags` is:
```
match /blogTags/{tagId} {
  allow read: if true;
  allow update, delete: if isAdmin();
}
```
`create` is not listed, so it falls through to the catch-all `allow write: if isAdmin()`. This appears safe, BUT the comment says "TEMPORAIRE : écriture ouverte" — suggesting it was intended to allow open writes at some point. If a developer adds `allow create: if true` to "fix" a perceived issue, any unauthenticated user can spam the tag collection.

**Warning signs:**
- The word "TEMPORAIRE" in a security rule that is still present months later
- Any rule with `if true` on a write operation

**Prevention strategy:**
- Close the `blogTags` rule immediately: `allow create: if isAdmin()`
- Audit all rules for `if true` on write operations — these are almost always mistakes
- Remove the "TEMPORAIRE" comment or convert it to a tracked issue

**Phase:** Phase 0 (bug fix) — security hardening before any RBAC work

---

## Pitfall 10: Next.js Server Actions run without Firebase Auth context — admin checks must use Admin SDK, not client SDK rules

**What goes wrong:**
The `deleteMessage` Server Action in `app/admin/messages/actions.ts` uses the **client Firebase SDK** (`deleteDoc` from `firebase/firestore`) inside a Server Action. Server Actions run on the server, but the client Firebase SDK is designed to use the browser user's auth token to authenticate requests. In a Server Action, there is no browser auth context — the request goes to Firestore unauthenticated (or with stale credentials), which is why `PERMISSION_DENIED` occurs even for admin users.

The client SDK in a Server Action does not carry the logged-in user's ID token. Firestore rules see `request.auth == null` and deny the write.

**Warning signs:**
- `deleteDoc`, `addDoc`, `updateDoc` imported from `firebase/firestore` (client SDK) used inside `'use server'` functions
- PERMISSION_DENIED errors that only occur on write operations triggered from the admin panel
- The error disappears when the same operation is performed directly in the browser console (where the client SDK has auth context)

**Prevention strategy:**
- Server Actions that write to Firestore must use **Firebase Admin SDK** (`adminDb` from `lib/firebase-admin.ts`) which bypasses security rules with service account credentials
- The security check in Server Actions must be done explicitly in application code: verify the user's session/token server-side (via `admin.auth().verifyIdToken(token)`) and check their role before calling `adminDb`
- Alternative: pass the Firebase ID token from the client to the Server Action and verify it server-side
- This is the confirmed root cause of the existing PERMISSION_DENIED bug on message deletion

**Phase:** Phase 0 (bug fix) — highest priority, fix before any other RBAC work

---

## Summary Table

| # | Pitfall | Severity | Phase |
|---|---------|----------|-------|
| 1 | `get()` in rules fails if user doc missing | HIGH | Phase 0 (bug fix) |
| 2 | Dual role fields (`role` vs `isAdmin`) diverge | HIGH | Phase 1 |
| 3 | Shared accounts lose audit trail + granularity | MEDIUM | Phase 1 |
| 4 | Custom claims require token refresh | MEDIUM | Phase 2 |
| 5 | `get()` in rules doubles read costs | MEDIUM | Phase 2 |
| 6 | Catch-all rule blocks future non-admin writes | LOW | Phase 3 |
| 7 | Client-side role checks are not a security boundary | HIGH | Phase 1 |
| 8 | Shared passwords cannot be selectively revoked | HIGH | Phase 0 (decision) |
| 9 | `blogTags` open write risk | MEDIUM | Phase 0 (hardening) |
| 10 | Client SDK in Server Actions runs unauthenticated | CRITICAL | Phase 0 (bug fix) |

---

## Immediate Actions (Phase 0)

Before designing any RBAC system, fix these in order:

1. **Fix `deleteMessage` Server Action** — switch from client `deleteDoc` to `adminDb.collection('messages').doc(id).delete()` and add server-side auth verification
2. **Fix `saveUserProfile()`** — the new-document branch calls `updateDoc` instead of `setDoc`; this silently fails and leaves users without a profile document, causing the `get()` in rules to throw
3. **Add null safety to `isAdmin()` rule** — use `.get('isAdmin', false)` instead of `.data.isAdmin`
4. **Close `blogTags` create rule** — add `allow create: if isAdmin()`

---

*Sources: Direct analysis of project codebase (firestore.rules, lib/firebase-helpers.ts, app/admin/messages/actions.ts, hooks/use-protected-route.ts, lib/firebase-admin.ts). Firebase documentation knowledge (custom claims propagation, security rule evaluation costs, Admin SDK vs client SDK auth context).*
