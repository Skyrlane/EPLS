# Requirements: EPLS

**Defined:** 2026-02-19
**Core Value:** Les membres accèdent à leur espace avec le bon niveau de permissions, et l'admin gère le contenu sans erreurs.

## v1 Requirements

Requirements for current milestone. Each maps to roadmap phases.

### Bug Fixes & Sécurité

- [ ] **FIX-01**: Corriger la suppression de messages admin (remplacer client SDK par Admin SDK dans Server Action)
- [ ] **FIX-02**: Corriger `saveUserProfile()` pour utiliser `setDoc` avec merge au lieu de `updateDoc`
- [ ] **FIX-03**: Unifier le système de rôles (un seul champ `role` au lieu de `role` + `isAdmin`)

### RBAC

- [ ] **RBAC-01**: Créer le compte partagé Amis (ami07 / 1chemin9) avec role `ami`
- [ ] **RBAC-02**: Créer le compte partagé Membres (membre07 / chemin67) avec role `membre`
- [ ] **RBAC-03**: Créer le compte partagé Conseil (conseil07 / EPL18Lingo) avec role `conseil`
- [ ] **RBAC-04**: Ajouter le champ `role` aux documents Firestore users avec hiérarchie (ami < membre < conseil < admin)
- [ ] **RBAC-05**: Mettre à jour les règles Firestore avec fonction `hasRole(minRole)`

### Route Protection

- [ ] **PROT-01**: Créer composant `MemberGuard` avec vérification de rôle minimum
- [ ] **PROT-02**: Protéger /infos-docs/membres (accès Conseil+ uniquement)
- [ ] **PROT-03**: Protéger /infos-docs/anniversaires (accès Membres+ uniquement)
- [ ] **PROT-04**: Protéger /infos-docs/carnet-adresses (accès Membres+ uniquement)

### Site Polish

- [ ] **SITE-01**: Ajouter le favicon au site (app/favicon.ico)
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
| FIX-01 | Phase 1 | Pending |
| FIX-02 | Phase 1 | Pending |
| FIX-03 | Phase 1 | Pending |
| SITE-01 | Phase 1 | Pending |
| RBAC-01 | Phase 2 | Pending |
| RBAC-02 | Phase 2 | Pending |
| RBAC-03 | Phase 2 | Pending |
| RBAC-04 | Phase 2 | Pending |
| RBAC-05 | Phase 2 | Pending |
| PROT-01 | Phase 3 | Pending |
| PROT-02 | Phase 3 | Pending |
| PROT-03 | Phase 3 | Pending |
| PROT-04 | Phase 3 | Pending |
| SITE-02 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 14 total
- Mapped to phases: 14
- Unmapped: 0 ✓

---
*Requirements defined: 2026-02-19*
*Last updated: 2026-02-19 after roadmap creation*
