# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-19)

**Core value:** Les membres accèdent à leur espace avec le bon niveau de permissions, et l'admin gère le contenu sans erreurs.
**Current focus:** Phase 2 — RBAC Foundation

## Current Position

Phase: 2 of 3 (RBAC Foundation)
Plan: 1 of 2 in current phase — Plan 02-01 complete
Status: In progress
Last activity: 2026-02-19 — Completed plan 02-01 (4-level role types + shared test accounts created)

Progress: [█████░░░░░] 55%

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

### Pending Todos

None yet.

### Blockers/Concerns

- [Phase 1 risk]: Vérifier que `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` sont bien configurés en production Vercel avant de considérer Phase 1 terminée
- [Phase 1 risk, RESOLVED]: Mécanisme de vérification token dans Server Actions = cookie auth-token lu par cookies() côté serveur (pattern confirmé dans lib/auth/actions.ts)

## Session Continuity

Last session: 2026-02-19
Stopped at: Completed 02-01-PLAN.md (4-level role types + shared test accounts created in Firebase)
Resume file: None
