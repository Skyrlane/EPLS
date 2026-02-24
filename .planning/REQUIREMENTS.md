# Requirements: EPLS

**Defined:** 2026-02-19
**Core Value:** Les membres accèdent à leur espace avec le bon niveau de permissions, et l'admin gère le contenu sans erreurs.

## v1 Requirements

Requirements for current milestone. Each maps to roadmap phases.

### Bug Fixes & Sécurité

- [x] **FIX-01**: Corriger la suppression de messages admin (remplacer client SDK par Admin SDK dans Server Action)
- [x] **FIX-02**: Corriger `saveUserProfile()` pour utiliser `setDoc` avec merge au lieu de `updateDoc`
- [x] **FIX-03**: Unifier le système de rôles (un seul champ `role` au lieu de `role` + `isAdmin`)

### RBAC

- [x] **RBAC-01**: Créer le compte partagé Amis (ami07) avec role `ami`
- [x] **RBAC-02**: Créer le compte partagé Membres (membre07) avec role `membre`
- [x] **RBAC-03**: Créer le compte partagé Conseil (conseil07) avec role `conseil`
- [x] **RBAC-04**: Ajouter le champ `role` aux documents Firestore users avec hiérarchie (ami < membre < conseil < admin)
- [x] **RBAC-05**: Mettre à jour les règles Firestore avec fonction `hasRole(minRole)`

### Route Protection

- [x] **PROT-01**: Créer composant `MemberGuard` avec vérification de rôle minimum
- [x] **PROT-02**: Protéger /infos-docs/membres (accès Conseil+ uniquement)
- [x] **PROT-03**: Protéger /infos-docs/anniversaires (accès Membres+ uniquement)
- [x] **PROT-04**: Protéger /infos-docs/carnet-adresses (accès Membres+ uniquement)

### Site Polish

- [x] **SITE-01**: Ajouter le favicon au site (app/favicon.ico)
- [ ] **SITE-02**: Intégrer les images uploadées via /admin/images-site aux pages du site

## v2 Requirements

Deferred to future. Tracked but not in current roadmap.

### Sécurité avancée

- **SEC-01**: Migration vers Firebase Custom Claims (quand plan Blaze)
- **SEC-02**: Audit log des accès par rôle
- **SEC-03**: Protection field-level pour contacts.notes (données sensibles admin)

### Tests

- **TEST-01**: Tests unitaires et d'intégration
- **TEST-02**: Tests E2E des permissions par rôle

### UX

- **UX-01**: Affichage du rôle dans le profil utilisateur
- **UX-02**: UI conditionnelle selon le rôle (masquer les liens non autorisés)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Comptes individuels par membre | Simplicité pour la communauté, comptes partagés par groupe suffisants |
| Firebase Custom Claims | Nécessite plan Blaze + Admin SDK fiable en prod, pas justifié pour 4 comptes |
| OAuth (Google, etc.) | Pas pertinent pour des comptes partagés d'église |
| Self-service role upgrade | Les rôles sont attribués par l'admin, pas par l'utilisateur |
| Middleware auth (Edge Runtime) | Edge Runtime ne supporte pas firebase-admin, client-side checking suffisant |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FIX-01 | Phase 1 | Complete |
| FIX-02 | Phase 1 | Complete (01-01) |
| FIX-03 | Phase 1 | Complete (01-01) |
| SITE-01 | Phase 1 | Complete |
| RBAC-01 | Phase 2 | Complete |
| RBAC-02 | Phase 2 | Complete |
| RBAC-03 | Phase 2 | Complete |
| RBAC-04 | Phase 2 | Complete |
| RBAC-05 | Phase 2 | Complete |
| PROT-01 | Phase 3 | Complete |
| PROT-02 | Phase 3 | Complete |
| PROT-03 | Phase 3 | Complete |
| PROT-04 | Phase 3 | Complete |
| SITE-02 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 14 total
- Mapped to phases: 14
- Unmapped: 0 ✓

---
*Requirements defined: 2026-02-19*
*Last updated: 2026-02-19 after roadmap creation*
