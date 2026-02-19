# EPLS - Site Web Protestants Libres

## What This Is

Site web d'église pour l'EPLS (Église Protestante Libre du Sud), construit avec Next.js 14, Firebase et Tailwind/Shadcn. Le site est en production à protestants-libres.fr avec authentification, zone membres, galerie photos, sermons/messages, calendrier et recherche. Il est à ~95% complété — le travail restant concerne les permissions par rôle, corrections de bugs, ajout d'images et maintenance continue.

## Core Value

Les membres de l'église peuvent accéder à leur espace protégé avec le bon niveau de permissions selon leur rôle (Amis, Membres, Conseil), et l'admin peut gérer le contenu sans erreurs.

## Requirements

### Validated

- ✓ Authentification complète (inscription, connexion, reset MDP) — existing
- ✓ Zone membres avec profil, dashboard, notifications — existing
- ✓ Galerie photos (Firebase Storage, lazy loading, zoom) — existing
- ✓ Streaming audio/vidéo optimisé — existing
- ✓ Système commentaires et partage social — existing
- ✓ Recherche globale (Firestore + Algolia) — existing
- ✓ Calendrier interactif — existing
- ✓ Mode sombre complet — existing
- ✓ SEO et accessibilité WCAG AA — existing
- ✓ Navigation responsive — existing
- ✓ Page admin (gestion contenu) — existing
- ✓ Système d'upload images admin (/admin/images-site) — existing

### Active

- [ ] Créer 3 comptes partagés avec rôles (Amis, Membres, Conseil)
- [ ] Système de permissions par rôle sur les pages protégées
- [ ] Ajouter un favicon au site
- [ ] Corriger le bug de suppression de messages admin (PERMISSION_DENIED)
- [ ] Intégrer les images uploadées via /admin/images-site aux pages du site
- [ ] Maintenance et debug continus

### Out of Scope

- Tests unitaires/intégration — reportés, pas prioritaires pour l'instant
- Nouvelles fonctionnalités majeures — stabilisation d'abord

## Context

### Comptes partagés et rôles

3 comptes partagés à créer dans Firebase Auth :
- **Amis de l'EPLS** : login `ami07` / mdp `1chemin9`
- **Membres de l'EPLS** : login `membre07` / mdp `chemin67`
- **Conseil de l'EPLS** : login `conseil07` / mdp `EPL18Lingo`

### Matrice de permissions

| Page | Admin (samdumay67@gmail.com) | Conseil | Membres | Amis |
|------|------------------------------|---------|---------|------|
| /admin/* | ✓ | ✗ | ✗ | ✗ |
| /infos-docs/membres | ✓ | ✓ | ✗ | ✗ |
| /infos-docs/anniversaires | ✓ | ✓ | ✓ | ✗ |
| /infos-docs/carnet-adresses | ✓ | ✓ | ✓ | ✗ |
| Reste zone membres | ✓ | ✓ | ✓ | ✓ |

### Bug connu — suppression messages

Sur /admin/messages, erreur `PERMISSION_DENIED` (code 7) lors de la suppression. L'utilisateur est admin. Probablement un problème de règles Firestore qui ne reconnaissent pas le rôle admin pour les opérations de suppression sur la collection messages.

### Images du site

Le système /admin/images-site permet d'uploader des images. Ces images doivent être affichées aux bons endroits du site :
- Sites amis → logos (images propres à chaque entité)
- Autres sections → illustrations contextuelles

### Déploiement

- **Hosting** : Vercel (protestants-libres.fr)
- **Backend** : Firebase (Firestore, Auth, Storage)
- Le propriétaire a accès Firebase et Vercel

## Constraints

- **Firebase gratuit** : Optimiser les requêtes, toujours `.limit()`
- **Stack existante** : Next.js 14, TypeScript strict, Tailwind, Shadcn/UI — ne pas changer
- **Hooks existants** : Toujours utiliser les hooks Firebase du projet, ne jamais réimplémenter
- **Production** : Le site est live, toute modification doit être rétrocompatible
- **Sécurité** : Les credentials des comptes partagés sont volontairement simples (usage interne église)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Comptes partagés par groupe | Simplicité pour la communauté, pas besoin de comptes individuels | — Pending |
| Rôles stockés dans Firestore | Firebase Auth custom claims ou champ role dans la collection users | — Pending |
| Admin = email hardcodé | Seul samdumay67@gmail.com est admin pour l'instant | — Pending |

---
*Last updated: 2026-02-19 after initialization*
