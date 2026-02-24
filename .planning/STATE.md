# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-19)

**Core value:** Les membres accèdent à leur espace avec le bon niveau de permissions, et l'admin gère le contenu sans erreurs.
**Current focus:** All phases complete — Milestone delivered

## Current Position

Phase: 3 of 3 (Route Protection Polish)
Plan: 2 of 2 in current phase — Plan 03-02 complete
Status: ALL PHASES COMPLETE — Milestone delivered
Last activity: 2026-02-24 — Completed plan 03-02 (setDoc fix + site images population)

Progress: [██████████] 100%

## Performance Metrics

**Velocity:**
- Total plans completed: 5
- Average duration: ~16 min
- Total execution time: 1.3 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-bug-fixes-hardening | 4 | ~35 min | ~9 min |
| 02-rbac-foundation | 1 | ~45 min | ~45 min |

**Recent Trend:**
- Last 5 plans: 01-01, 01-02, 01-03, 01-04, 02-01
- Trend: 02-01 longer due to human-action checkpoint for account creation

*Updated after each plan completion*

| Phase 02-rbac-foundation P02 | 2min | 2 tasks | 1 file |
| Phase 03-route-protection-polish P01 | 3min | 2 tasks | 4 files |
| Phase 03-route-protection-polish P02 | 30 | 2 tasks | 2 files |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [Roadmap]: Rôles stockés dans Firestore `users/{uid}` (champ `role`), pas Firebase Custom Claims — zero nouvelle dépendance, coût de lecture négligeable pour 4 comptes
- [Roadmap]: Server Actions doivent utiliser Admin SDK pour les mutations Firestore — client SDK n'a pas de contexte auth en `'use server'`
- [Roadmap]: Phase 1 avant Phase 2 — le bug Admin SDK doit être confirmé corrigé avant de créer les comptes partagés
- [01-01]: setDoc avec merge choisi pour saveUserProfile — fonctionne pour les nouveaux et anciens documents sans split logique
- [01-01]: isAdmin dérivé de role === 'admin' dans le code applicatif, jamais stocké dans Firestore
- [01-01]: Règles Firestore avec double vérification (role == 'admin' OU isAdmin == true) pour transition sans interruption
- [Phase 01-bug-fixes-hardening]: cookies() without await — consistent with Next.js 14.2.7 existing pattern
- [Phase 01-bug-fixes-hardening]: Admin SDK null guard retained — graceful degradation when env vars missing
- [Phase 01-bug-fixes-hardening]: Separate session.ts from actions.ts to avoid next-safe-action bundling conflicts when importing from Client Components
- [Phase 01-bug-fixes-hardening]: onIdTokenChanged replaces onAuthStateChanged — fires on hourly token renewals to keep auth-token cookie fresh
- [Phase 01-bug-fixes-hardening]: normalizeRole at read boundary in use-user-data.tsx — handles French-cased Firestore docs without migration
- [Phase 01-bug-fixes-hardening]: deleteField() with merge:true for lazy isAdmin cleanup — zero-cost for small user base, no batch migration needed
- [Phase 02-rbac-foundation]: 4-level role hierarchy: ami < membre < conseil < admin replaces old admin|member|visitor
- [Phase 02-rbac-foundation]: Default role changed from member to ami — principle of least privilege
- [Phase 02-rbac-foundation]: Backward compat in normalizeRole: member->membre, visitor->ami, visiteur->ami
- [02-01]: Script standalone (not from lib/firebase-admin.ts) to avoid Next.js module coupling when running via tsx
- [02-01]: Idempotent account creation: catch email-already-exists + Firestore merge:true — safe to re-run
- [02-01]: Shared accounts use 07 suffix to avoid conflicts with real community members
- [Phase 02-rbac-foundation]: hasRole() defined but not applied to existing collections yet — Phase 3 will wire it up; avoids large refactor mid-phase
- [Phase 02-rbac-foundation]: Backward-compat in roleLevel(): member=2, visitor=1 — prevents locking out existing Firestore user docs before role migration
- [Phase 02-rbac-foundation]: Two separate allow update rules for users (self without role + admin) — Firestore ORs multiple allow rules so both work independently
- [03-01]: MemberGuard uses useUserData() not useAuth() — combined loading flag avoids premature redirects before Firestore doc fetch completes
- [03-01]: Insufficient-role redirect goes to /acces-refuse, not / — explicit access denied page for better UX
- [03-01]: ROLE_LEVEL map duplicated client-side from Firestore roleLevel() — zero-dependency, works in React components
- [03-01]: Inner component pattern for membres/page.tsx — page logic in MembresPageContent, default export wraps with MemberGuard
- [Phase 03-route-protection-polish]: setDoc+merge:true for admin image writes — works on non-existent documents, no pre-seeding required
- [Phase 03-route-protection-polish]: 52/87 zones seeded (21 Unsplash + 31 official logos); 18 portrait/logo zones deferred for manual upload

### Pending Todos

None yet.

### Blockers/Concerns

- [Phase 1 risk]: Vérifier que `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` sont bien configurés en production Vercel avant de considérer Phase 1 terminée
- [Phase 1 risk, RESOLVED]: Mécanisme de vérification token dans Server Actions = cookie auth-token lu par cookies() côté serveur (pattern confirmé dans lib/auth/actions.ts)

## Session Continuity

Last session: 2026-02-24
Stopped at: Completed 03-02-PLAN.md (setDoc fix + site images population — Phase 03 and full milestone complete)
Resume file: None
