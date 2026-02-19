# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-19)

**Core value:** Les membres accèdent à leur espace avec le bon niveau de permissions, et l'admin gère le contenu sans erreurs.
**Current focus:** Phase 1 — Bug Fixes & Hardening

## Current Position

Phase: 1 of 3 (Bug Fixes & Hardening)
Plan: 0 of 3 in current phase
Status: Ready to plan
Last activity: 2026-02-19 — Roadmap created, phases derived from 14 v1 requirements

Progress: [░░░░░░░░░░] 0%

## Performance Metrics

**Velocity:**
- Total plans completed: 0
- Average duration: —
- Total execution time: 0 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| - | - | - | - |

**Recent Trend:**
- Last 5 plans: —
- Trend: —

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [Roadmap]: Rôles stockés dans Firestore `users/{uid}` (champ `role`), pas Firebase Custom Claims — zero nouvelle dépendance, coût de lecture négligeable pour 4 comptes
- [Roadmap]: Server Actions doivent utiliser Admin SDK pour les mutations Firestore — client SDK n'a pas de contexte auth en `'use server'`
- [Roadmap]: Phase 1 avant Phase 2 — le bug Admin SDK doit être confirmé corrigé avant de créer les comptes partagés

### Pending Todos

None yet.

### Blockers/Concerns

- [Phase 1 risk]: Vérifier que `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` sont bien configurés en production Vercel avant de considérer Phase 1 terminée
- [Phase 1 risk]: Décider du mécanisme de vérification token dans Server Actions (cookie vs token param explicite) avant d'implémenter le fix deleteMessage

## Session Continuity

Last session: 2026-02-19
Stopped at: Roadmap créé, prêt à planifier Phase 1
Resume file: None
