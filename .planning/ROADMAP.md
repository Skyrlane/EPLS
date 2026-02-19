# Roadmap: EPLS — Firebase RBAC + Bug Fixes

## Overview

Ce milestone transforme le site EPLS de son état actuel (auth fonctionnelle, permissions non appliquées, bug de suppression admin) vers un état où trois comptes partagés existent avec des accès différenciés par rôle, les pages protégées refusent réellement les accès non autorisés, et l'admin peut supprimer des messages sans erreur. L'approche est séquentielle : corriger d'abord les bugs structurels, ensuite créer les données de rôles, enfin câbler les gardes de route.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [x] **Phase 1: Bug Fixes & Hardening** - Corriger le bug PERMISSION_DENIED, unifier les rôles, sécuriser les règles Firestore et ajouter le favicon (gap closure en cours) (completed 2026-02-19)
- [ ] **Phase 2: RBAC Foundation** - Créer les 3 comptes partagés, unifier le schéma de rôles dans Firestore et mettre à jour les règles avec hiérarchie
- [ ] **Phase 3: Route Protection & Polish** - Câbler MemberGuard sur les pages protégées et intégrer les images uploadées

## Phase Details

### Phase 1: Bug Fixes & Hardening
**Goal**: L'admin peut gérer le contenu sans erreurs, les règles Firestore sont sûres et le favicon est en place
**Depends on**: Nothing (first phase)
**Requirements**: FIX-01, FIX-02, FIX-03, SITE-01
**Success Criteria** (what must be TRUE):
  1. L'admin peut supprimer un message depuis /admin/messages sans erreur PERMISSION_DENIED
  2. Un nouvel utilisateur peut créer son profil sans erreur (setDoc fonctionne sur document inexistant)
  3. Chaque document Firestore users/{uid} n'a qu'un seul champ de rôle (`role`) sans conflit avec `isAdmin`
  4. Le favicon apparaît dans l'onglet du navigateur sur toutes les pages
**Plans**: 4 plans

Plans:
- [x] 01-01-PLAN.md — Fix saveUserProfile (setDoc+merge) et unifier le système de rôles (role vs isAdmin)
- [x] 01-02-PLAN.md — Fix deleteMessage (Admin SDK) et ajouter favicon
- [x] 01-03-PLAN.md — Fix cookie auth-token manquant (setAuthCookie dans login-form + onIdTokenChanged dans auth-provider)
- [x] 01-04-PLAN.md — Favicon réel (fichier utilisateur) + normalizeRole + nettoyage lazy isAdmin

### Phase 2: RBAC Foundation
**Goal**: Les 3 comptes partagés existent dans Firebase Auth avec leurs documents Firestore et le système de rôles est unifié et appliqué dans les règles
**Depends on**: Phase 1
**Requirements**: RBAC-01, RBAC-02, RBAC-03, RBAC-04, RBAC-05
**Success Criteria** (what must be TRUE):
  1. Le compte ami07 peut se connecter et accède à la zone membres de base
  2. Le compte membre07 peut se connecter et son rôle `membre` est lisible dans Firestore
  3. Le compte conseil07 peut se connecter et son rôle `conseil` est lisible dans Firestore
  4. Les règles Firestore refusent une modification du champ `role` par un utilisateur sur son propre document
  5. La fonction `hasRole(minRole)` est définie dans les règles Firestore et correspond à la hiérarchie ami < membre < conseil < admin
**Plans**: 2 plans

Plans:
- [ ] 02-01-PLAN.md — Créer les 3 comptes Firebase Auth + documents Firestore users + mettre à jour les types TypeScript pour la hiérarchie à 4 niveaux
- [ ] 02-02-PLAN.md — Mettre à jour firestore.rules avec hasRole() et protéger l'auto-modification du rôle

### Phase 3: Route Protection & Polish
**Goal**: Les pages /infos-docs protégées redirigent les rôles insuffisants et les images uploadées apparaissent sur le site
**Depends on**: Phase 2
**Requirements**: PROT-01, PROT-02, PROT-03, PROT-04, SITE-02
**Success Criteria** (what must be TRUE):
  1. Le compte ami07 est redirigé vers /acces-refuse quand il tente d'accéder à /infos-docs/membres
  2. Le compte ami07 est redirigé vers /acces-refuse quand il tente d'accéder à /infos-docs/anniversaires
  3. Le compte membre07 peut accéder à /infos-docs/anniversaires et /infos-docs/carnet-adresses
  4. Le compte conseil07 peut accéder à /infos-docs/membres
  5. Les images uploadées via /admin/images-site apparaissent aux emplacements correspondants sur le site
**Plans**: TBD

Plans:
- [ ] 03-01: Créer MemberGuard et l'appliquer aux 3 pages /infos-docs protégées
- [ ] 03-02: Intégrer les images /admin/images-site aux pages du site

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Bug Fixes & Hardening | 4/4 | Complete    | 2026-02-19 |
| 2. RBAC Foundation | 0/2 | Not started | - |
| 3. Route Protection & Polish | 0/2 | Not started | - |
