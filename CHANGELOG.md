# 📝 CHANGELOG - EPLS Website

Ce document contient toutes les modifications notables apportées au projet EPLS.

## [Unreleased]

### 🔧 Structure et Architecture
- **Standardisation des imports** - Correction des chemins d'imports pour résoudre les erreurs de compilation et maintenir une structure cohérente
- **Amélioration de la configuration Firebase** - Typage amélioré des objets Firebase et meilleure gestion des cas où Firebase n'est pas configuré
- **Élimination des doublons de composants** - Consolidation des composants redondants comme page-header et section-container
- **Correction du contexte d'authentification** - Amélioration du hook useAuth avec un typage plus strict et meilleure gestion des erreurs
- **Hooks Firebase personnalisés** - Création de 5 nouveaux hooks réutilisables pour simplifier l'interaction avec Firebase :
  - `useFirestore` : Opérations CRUD typées sur Firestore
  - `useStorage` : Gestion des fichiers dans Firebase Storage avec progression, métadonnées
  - `useRealtimeCollection` : Abonnement aux changements d'une collection en temps réel
  - `useRealtimeDocument` : Abonnement aux changements d'un document en temps réel
  - `usePaginatedCollection` : Pagination avancée pour les collections Firestore
  - `useFirebaseAuth` : Authentification simplifiée avec gestion des erreurs

### 🎨 UI/UX
- **Nouvelle barre de navigation** - Création d'une NavBar responsive avec menu hamburger sur mobile utilisant les composants Radix UI Sheet
- **Skip to content** - Ajout d'un lien d'accessibilité "Skip to content" pour une meilleure navigation au clavier
- **Amélioration du Footer** - Correction des couleurs, ajout d'attributs d'accessibilité et amélioration des liens
- **Uniformisation des couleurs** - Utilisation cohérente des variables de thème au lieu de couleurs en dur
- **Transitions fluides** - Ajout d'animations subtiles pour améliorer l'expérience utilisateur
- **Contraste amélioré** - Meilleur contraste pour le texte sur les images, particulièrement sur mobile
- **Support du mode sombre** - Correction des inconsistances dans le rendu du mode sombre

### 🔒 Authentification
- **Typage strict** - Amélioration des types pour les objets Firebase dans le hook d'authentification
- **Gestion simulée** - Meilleure gestion des cas où Firebase n'est pas complètement configuré
- **État de chargement** - Ajout d'un état loading pour indiquer clairement quand l'authentification est en cours
- **Nouveau hook d'authentification** - Hook `useFirebaseAuth` plus complet avec gestion des erreurs, mise à jour du profil, et vérification d'email

### 🧩 Métadonnées
- **Optimisation SEO** - Amélioration des métadonnées pour les réseaux sociaux (OpenGraph)
- **Correction des données** - Uniformisation des titres et descriptions dans les métadonnées

### 🚀 Performances
- **Composants optimisés** - Restructuration des composants pour éviter le re-rendu inutile
- **Imports optimisés** - Amélioration des imports pour réduire la taille du bundle
- **Gestion en temps réel** - Hooks optimisés pour les abonnements Firestore avec nettoyage automatique

### ♿ Accessibilité
- **Amélioration ARIA** - Ajout d'attributs aria pour les éléments interactifs
- **Navigation au clavier** - Support amélioré de la navigation au clavier
- **Skip links** - Implémentation d'un lien "Skip to content" pour l'accessibilité

## [À venir]
- Amélioration de la gestion des formulaires avec Zod
- Implémentation des tests unitaires et d'intégration
- Finalisation des fonctionnalités Firebase (authentification, firestore, storage)
- Optimisation supplémentaire pour les appareils mobiles
- Documentation complète des composants 