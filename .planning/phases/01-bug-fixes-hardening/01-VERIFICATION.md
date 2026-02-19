---
phase: 01-bug-fixes-hardening
verified: 2026-02-19T22:00:00Z
status: passed
score: 12/12 must-haves verified
re_verification:
  previous_status: passed
  previous_score: 8/8
  gaps_closed:
    - "Cookie auth-token defini apres connexion (plan 01-03 gap closure)"
    - "Cookie rafraichi automatiquement via onIdTokenChanged (plan 01-03)"
    - "Favicon remplace par le vrai logo PNG de l'eglise (plan 01-04 gap closure)"
    - "normalizeRole() convertit les valeurs Firestore francaises vers valeurs canoniques (plan 01-04)"
    - "deleteField() supprime le champ isAdmin lors de saveUserProfile (plan 01-04)"
  gaps_remaining: []
  regressions: []
human_verification:
  - test: "Se connecter au site et observer l'onglet du navigateur"
    expected: "Le logo reel de l'eglise (PNG 28x28 couleur) apparait comme favicon sur toutes les pages"
    why_human: "Impossible de verifier le rendu visuel dans le navigateur programmatiquement"
  - test: "Creer un nouveau compte, observer la console et Firestore"
    expected: "Aucune erreur 'No document to update'. Document users/{uid} cree avec role: 'member', sans champ isAdmin"
    why_human: "Necessite un environnement Firebase live avec un vrai nouvel utilisateur"
  - test: "Se connecter en tant qu'admin, naviguer vers /admin/messages, supprimer un message"
    expected: "Message supprime sans erreur PERMISSION_DENIED ni 'Non authentifie'. Page rafraichie automatiquement"
    why_human: "Necessite Firebase Admin SDK configure avec les vraies variables d'env et un compte admin reel"
  - test: "Se connecter, rester connecte plus d'une heure, tenter une action admin"
    expected: "L'action admin fonctionne toujours — le cookie auth-token est rafraichi automatiquement via onIdTokenChanged"
    why_human: "Necessite d'attendre le renouvellement horaire du token Firebase en conditions reelles"
---

# Phase 01: Bug Fixes & Hardening Verification Report

**Phase Goal:** L'admin peut gerer le contenu sans erreurs, les regles Firestore sont sures et le favicon est en place
**Verified:** 2026-02-19T22:00:00Z
**Status:** passed
**Re-verification:** Yes — after gap closure (plans 01-03 and 01-04 executed after initial verification)

## Summary

This is a re-verification covering all 4 plans (01-01, 01-02, 01-03, 01-04). Plans 01-03 and 01-04 were gap closure plans executed after the initial verification at 2026-02-19T21:00:00Z. The initial verification passed 8/8 truths but missed a functional gap: `deleteMessage` read `cookies().get('auth-token')` but that cookie was never written during login. Plans 01-03 and 01-04 closed that gap and also replaced the generated 143-byte favicon with the real church logo PNG. All 12 must-haves now verify against the actual codebase.

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Un nouvel utilisateur peut creer son profil sans erreur (setDoc avec merge) | VERIFIED | `lib/firebase-helpers.ts` line 119: `setDoc(userRef, {...}, { merge: true })` |
| 2 | Chaque document users/{uid} n'a qu'un seul champ role sans conflit isAdmin | VERIFIED | `lib/firebase-helpers.ts` line 127: `isAdmin: deleteField()` supprime le champ lors de chaque write |
| 3 | Le hook useUserData derive isAdmin depuis role, jamais lu directement de Firestore | VERIFIED | `hooks/use-user-data.tsx` line 115: `useMemo(() => userData?.role === 'admin', [userData])` |
| 4 | Les regles Firestore verifient role == 'admin' avec fallback isAdmin == true | VERIFIED | `firestore.rules` lines 7-11: `data.role == 'admin' \|\| data.isAdmin == true` |
| 5 | L'admin peut supprimer un message sans erreur PERMISSION_DENIED | VERIFIED | `app/admin/messages/actions.ts`: utilise Admin SDK (`adminDb`, `adminAuth`), contourne les regles Firestore |
| 6 | Un utilisateur non-admin recoit "Permission refusee" | VERIFIED | `app/admin/messages/actions.ts` lines 37-39: verifie `role !== 'admin'`, retourne `{ success: false, error: 'Permission refusee' }` |
| 7 | Un token expire retourne une erreur explicite, pas un crash | VERIFIED | `app/admin/messages/actions.ts` lines 28-34: try/catch sur `verifyIdToken`, retourne `'Session expiree, veuillez vous reconnecter'` |
| 8 | Le favicon apparait dans l'onglet du navigateur | VERIFIED | `app/favicon.ico` (747 bytes, PNG 28x28 couleur). `app/layout.tsx` lines 19-22: `icons: { icon: "/favicon.ico", shortcut: "/favicon.ico" }` |
| 9 | Apres connexion, le cookie auth-token est defini | VERIFIED | `components/auth/login-form.tsx` line 53: `await setAuthCookie(idToken)` apres `signInWithEmailAndPassword` |
| 10 | Le cookie est rafraichi automatiquement a chaque renouvellement de token Firebase | VERIFIED | `components/auth-provider.tsx` lines 79-89: `onIdTokenChanged` appelle `setAuthCookie(idToken)` a chaque refresh |
| 11 | deleteMessage peut lire le cookie auth-token et authentifier l'appelant | VERIFIED | `app/admin/messages/actions.ts` line 22: `cookies().get('auth-token')?.value`. Cookie defini par `lib/auth/session.ts` |
| 12 | Les valeurs de role Firestore en casse francaise sont normalisees | VERIFIED | `hooks/use-user-data.tsx` line 79: `normalizeRole(data.role)` convertit 'Membre'->'member', 'Admin'->'admin' |

**Score:** 12/12 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `lib/firebase-helpers.ts` | setDoc avec merge, role uniquement, deleteField sur isAdmin | VERIFIED | Line 119: setDoc avec merge. Line 126: `role: additionalData?.role ?? 'member'`. Line 127: `isAdmin: deleteField()` |
| `lib/firebase-utils.ts` | saveUserProfile avec setDoc merge (deprecated) | VERIFIED | Lines 258-271: setDoc avec merge. Line 251: marque @deprecated |
| `hooks/use-user-data.tsx` | normalizeRole + isAdmin derive de role | VERIFIED | Lines 26-42: `normalizeRole()`. Line 79: `normalizeRole(data.role)`. Line 115: `useMemo(() => userData?.role === 'admin')` |
| `types/index.ts` | User avec champ role uniquement, pas isAdmin stocke | VERIFIED | Line 98: `role: 'admin' \| 'member' \| 'visitor'`. Pas de champ isAdmin dans l'interface |
| `firestore.rules` | isAdmin() verifie role avec fallback de transition | VERIFIED | Lines 7-11: `data.role == 'admin' \|\| data.isAdmin == true` avec commentaire TRANSITION |
| `app/admin/messages/actions.ts` | Server Action deleteMessage via Admin SDK avec verification 4 etapes | VERIFIED | Imports `adminDb`, `adminAuth`. Guard null, cookie, verifyIdToken, role check, puis delete |
| `app/favicon.ico` | Vrai favicon PNG de l'eglise (non genere) | VERIFIED | 747 bytes, PNG 28x28 couleur RGB — remplace le ICO genere de 143 bytes |
| `app/layout.tsx` | icons dans metadata pour decouverte navigateur | VERIFIED | Lines 19-22: `icons: { icon: "/favicon.ico", shortcut: "/favicon.ico" }` |
| `lib/auth/session.ts` | Server Actions setAuthCookie et clearAuthCookie | VERIFIED | Exports `setAuthCookie(idToken)` (httpOnly, secure, sameSite strict, maxAge 3600) et `clearAuthCookie()` |
| `components/auth/login-form.tsx` | Appel setAuthCookie apres connexion Firebase | VERIFIED | Line 10: import. Line 53: `await setAuthCookie(idToken)` apres `signInWithEmailAndPassword` |
| `components/auth-provider.tsx` | onIdTokenChanged appelle setAuthCookie / clearAuthCookie | VERIFIED | Line 6: import `onIdTokenChanged`. Line 79: `onIdTokenChanged(auth as Auth, ...)`. Lines 86, 89: appels setAuthCookie / clearAuthCookie |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `hooks/use-user-data.tsx` | Firestore users/{uid} | `normalizeRole(data.role)` dans onSnapshot | VERIFIED | Line 79 confirme |
| `firestore.rules` | Firestore users/{uid} | `isAdmin()` lit `data.role` | VERIFIED | Line 9: `data.role == 'admin'` |
| `lib/firebase-helpers.ts` | Firestore users/{uid} | setDoc avec merge et deleteField(isAdmin) | VERIFIED | Lines 119-133 confirment |
| `app/admin/messages/actions.ts` | `lib/firebase-admin.ts` | import `adminDb`, `adminAuth` | VERIFIED | Line 5 confirme |
| `app/admin/messages/actions.ts` | Firestore users/{uid} | lit `role` via Admin SDK pour verifier admin | VERIFIED | Lines 37-39 confirment |
| `app/admin/messages/actions.ts` | cookie auth-token | `cookies().get('auth-token')` | VERIFIED | Line 22. Cookie ecrit par `lib/auth/session.ts` |
| `components/auth/login-form.tsx` | `lib/auth/session.ts` | import + appel `setAuthCookie(idToken)` apres login | VERIFIED | Lines 10, 53 confirment |
| `components/auth-provider.tsx` | `lib/auth/session.ts` | import + appel dans `onIdTokenChanged` | VERIFIED | Lines 16, 79-89 confirment |

### Requirements Coverage

| Requirement | Source Plans | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| FIX-01 | 01-02, 01-03 | Corriger la suppression de messages admin (Admin SDK dans Server Action) | SATISFIED | `app/admin/messages/actions.ts` utilise `adminDb`/`adminAuth`. Cookie auth-token defini par plan 01-03. Commits 685fce0, b2acea8, 4c56c22, 068b111 |
| FIX-02 | 01-01 | Corriger saveUserProfile() pour utiliser setDoc avec merge | SATISFIED | `lib/firebase-helpers.ts` et `lib/firebase-utils.ts` utilisent `setDoc(..., { merge: true })`. Commit 6c74446 |
| FIX-03 | 01-01, 01-04 | Unifier le systeme de roles (un seul champ role) | SATISFIED | Types, hooks et regles utilisent tous `role`. `deleteField()` supprime isAdmin. `normalizeRole()` gere la casse. Commits a36e909, c871599 |
| SITE-01 | 01-02, 01-04 | Ajouter le favicon (app/favicon.ico) | SATISFIED | `app/favicon.ico` (PNG 28x28, 747 bytes). `app/layout.tsx` declare `icons`. Commits 7e0f5db, 320732c, c871599 |

**Orphaned requirements:** Aucun. Les IDs RBAC-01..05, PROT-01..04 et SITE-02 sont affectes aux Phases 2 et 3 dans REQUIREMENTS.md — correctement hors scope de cette phase. Aucun de ces IDs n'est reclame par un plan de la Phase 1.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `lib/firebase-helpers.ts` | 31, 36 | `preferences?: Record<string, any>` et index signature `any` dans UserProfile | Info | Pre-existant, non introduit par cette phase. N'affecte pas la logique role/auth |
| `lib/firebase-utils.ts` | 253 | `Record<string, any>` dans la signature saveUserProfile deprecated | Info | Pre-existant et marque @deprecated. Non bloquant |
| `firestore.rules` | 10 | Fallback `data.isAdmin == true` dans la fonction isAdmin() | Warning | Intentionnel pour la transition — commentaire "TRANSITION: remove after all admin docs have role field set". Non bloquant |

Aucun anti-pattern bloquant. Les `any` sont pre-existants et isoles des chemins critiques de cette phase.

### Human Verification Required

#### 1. Favicon Visual Verification

**Test:** Ouvrir le site dans un navigateur et observer l'onglet.
**Expected:** Le logo reel de l'eglise (PNG 28x28 couleur) apparait comme favicon — pas une croix bleue generee ni une icone generique.
**Why human:** Impossible de verifier le rendu visuel dans l'onglet du navigateur programmatiquement.

#### 2. Nouvel utilisateur — Creation de profil

**Test:** Creer un nouveau compte avec un email/mot de passe sans document Firestore existant.
**Expected:** Profil cree sans erreur "No document to update". Document users/{uid} dans Firestore avec `role: 'member'`, sans champ `isAdmin`.
**Why human:** Necessite un environnement Firebase live et un vrai nouvel utilisateur.

#### 3. Suppression de message admin

**Test:** Se connecter en tant qu'admin, aller sur /admin/messages, supprimer un message.
**Expected:** Message supprime sans erreur PERMISSION_DENIED ni "Non authentifie". La page se rafraichit automatiquement.
**Why human:** Necessite Firebase Admin SDK configure avec les vraies variables d'env et un vrai compte admin.

#### 4. Persistance du cookie apres renouvellement de token

**Test:** Se connecter, rester connecte plus d'une heure, tenter une action admin.
**Expected:** L'action fonctionne toujours — `onIdTokenChanged` a rafraichi le cookie `auth-token` automatiquement.
**Why human:** Necessite d'attendre le renouvellement horaire du token Firebase en conditions reelles.

### Gaps Summary

Aucun gap. Les 12 truths sont verifiees, les 11 artefacts passent les 3 niveaux (existe, substantiel, cable), et les 8 liens cles sont confirmes.

La verification initiale avait une lacune fonctionnelle latente non capturee : bien que `deleteMessage` lisait `cookies().get('auth-token')`, ce cookie n'etait jamais ecrit lors de la connexion, ce qui aurait rendu toute suppression impossible en production. Les plans 01-03 et 01-04 ont corrige cela en cablant `setAuthCookie` dans `login-form.tsx` et en rafraichissant le cookie via `onIdTokenChanged` dans `auth-provider.tsx`. Cette correction est maintenant pleinement verifiee dans le code.

Les 4 requirements (FIX-01, FIX-02, FIX-03, SITE-01) sont satisfaits avec des preuves directes dans le code et des commits verifies.

---

_Verified: 2026-02-19T22:00:00Z_
_Verifier: Claude (gsd-verifier)_
