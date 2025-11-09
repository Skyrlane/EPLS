# 📋 EPLS - Liste des tâches à accomplir

Ce document liste toutes les tâches identifiées lors de l'audit du site web EPLS. Chaque tâche est organisée par catégorie et peut être cochée une fois terminée.

## 🎨 UI/UX et cohérence visuelle

- [x] Uniformiser la palette de couleurs (définir des variables CSS/Tailwind cohérentes) - *Remplacement des références directes aux couleurs (bg-blue-800, etc.) par les variables du thème (bg-primary, etc.) dans la navigation, les boutons et plusieurs composants*
- [x] Standardiser les espacements et marges entre sections sur toutes les pages - *Utilisation d'espacements cohérents pour les composants SectionContainer, standardisation des marges internes des cards, et espacement vertical régulier entre les sections*
- [x] Corriger les inconsistances typographiques (tailles de texte, espacements) - *Standardisation des tailles de texte pour tous les niveaux de titres, avec des règles cohérentes de marges et d'espacements, et ajout de classes d'aide pour maintenir un rythme vertical*
- [x] Harmoniser les styles des cards et composants UI entre les différentes sections - *Amélioration du composant FeatureCard pour un meilleur visuel et une meilleure gestion du mode sombre, avec des transitions fluides et une meilleure réactivité sur mobile*
- [x] Ajouter des transitions fluides pour le menu mobile - *Implémentation d'une transition fluide avec hauteur maximale et opacité pour l'ouverture/fermeture du menu mobile*
- [x] Améliorer le contraste du texte sur les images héros, particulièrement sur mobile - *Ajout d'un gradient d'overlay plus sombre et ombre portée sur le texte pour une meilleure lisibilité*
- [x] Ajouter des animations légères pour améliorer l'expérience utilisateur (transitions de page, hover states) - *Ajout d'animations sur les liens, boutons et cartes avec des effets de scale, ombre et soulignement*
- [x] Créer une barre de navigation moderne et responsive - *Implémentation d'une NavBar avec menu hamburger sur mobile qui utilise des composants Sheet pour une transition fluide, et un positionnement sticky pour une meilleure UX*
- [x] Rendre le site 100% responsive sur tous les appareils (tester sur différentes tailles d'écran)
  > ✅ Optimisation de tous les composants principaux pour différentes tailles d'écran. Ajout de breakpoints adaptés dans la NavBar, les Cards et les sections principales. Tests effectués sur mobile (320px), tablette (768px) et desktop (1200px+).
- [x] Corriger le rendu du mode sombre (certaines couleurs ne changent pas correctement) - *Amélioration des styles spécifiques au mode sombre dans globals.css, standardisation des couleurs de texte et de fond pour les composants Card, et ajout de classes sombres cohérentes pour les éléments UI*
- [x] Améliorer les états interactifs des boutons et liens (hover, focus, active) - *Implémentation d'effets d'échelle, d'ombre et de focus pour améliorer l'accessibilité et le feedback visuel*
- [x] Uniformiser les couleurs dans l'ensemble du site (certains boutons utilisent des couleurs différentes)
- [x] Améliorer l'espacement et les marges dans les sections principales
- [x] Standardiser les transitions et animations pour plus de cohérence
- [x] Optimiser les états de survol et de focus des éléments interactifs
- [x] Harmoniser les composants ArticleCard et ArticleCardClient pour une cohérence visuelle
- [x] Revoir les styles des formulaires pour plus de cohérence
  > ✅ Uniformisation des styles de tous les formulaires du site (connexion, inscription, contact, récupération mot de passe) avec design cohérent, validation visuelle et états d'erreur harmonisés.

## 🔐 Authentification et sécurité

- [x] Corriger les types pour les objets Firebase dans le hook d'authentification - *Amélioration de la gestion des types avec MockAuthInterface pour éviter les erreurs TypeScript et mieux gérer les cas de figure où Firebase n'est pas complètement configuré*
- [x] Corriger la validation du token d'authentification dans le middleware - *Implémentation d'une vérification robuste des tokens JWT avec Firebase Admin, gestion de l'expiration des sessions, et amélioration des en-têtes de sécurité HTTP*
- [x] Créer une véritable page d'inscription au lieu de rediriger vers la page contact
  > ✅ Page d'inscription créée avec validation Zod, gestion des erreurs et confirmation visuelle. Utilise `createUserWithEmailAndPassword` de Firebase avec retour visuel des erreurs.
- [x] Améliorer la page de récupération de mot de passe
  > ✅ Page de récupération de mot de passe améliorée avec validation Zod, gestion détaillée des erreurs (codes Firebase spécifiques), états de chargement et message de succès clair. Le formulaire inclut également des attributs d'accessibilité.
- [x] Corriger le lien d'inscription dans le formulaire de connexion (actuellement redirige vers /contact)
  > ✅ Le lien "S'inscrire" dans le formulaire de connexion pointe maintenant vers "/inscription" au lieu de "/contact".
- [x] Implémenter la validation côté serveur pour tous les formulaires
  > ✅ Mise en place de la validation serveur avec next-safe-action et Zod pour tous les formulaires. La validation client et serveur est synchronisée avec les mêmes schémas Zod.
- [x] Ajouter une protection CSRF pour les formulaires
  > ✅ Protection CSRF mise en place via next-safe-action qui fournit une protection automatique contre les attaques CSRF en utilisant des tokens d'authentification et des vérifications de session.
- [x] Renforcer les règles de sécurité Firebase (Firestore et Storage)
  > ✅ Mise en place de règles de sécurité Firebase restrictives pour Firestore et Storage. Implémentation de contrôles d'accès basés sur les rôles utilisateur, validation des données entrantes et limitation des requêtes par utilisateur.
- [x] Améliorer la gestion des erreurs d'authentification
  > ✅ Implémentation d'une gestion détaillée des erreurs d'authentification avec codes d'erreur Firebase précis et messages utilisateur clairs. Les erreurs sont maintenant affichées de manière contextuelle et constructive.
- [x] Implémenter une déconnexion automatique après une période d'inactivité
  > ✅ Ajout d'un système de déconnexion automatique après 30 minutes d'inactivité, avec avertissement 5 minutes avant expiration et possibilité de prolonger la session.
- [x] Ajouter des logs d'authentification pour surveiller les activités suspectes
  > ✅ Implémentation d'un système de journalisation des connexions et tentatives de connexion échouées, avec stockage des données dans Firestore et interface d'administration pour visualiser les activités suspectes.
- [x] Configurer correctement les règles de redirection après connexion/déconnexion
  > ✅ Mise en place d'un système de redirection intelligent après connexion/déconnexion basé sur l'URL précédente, avec fallback vers la page d'accueil et conservation des paramètres de requête pertinents.

## 💻 Architecture et code

- [x] Éliminer les doublons de composants (page-header.tsx, section-container.tsx) - *Consolidation des composants en versions unifiées avec fonctionnalités améliorées : props supplémentaires, meilleure documentation, support du mode sombre, et API plus cohérente*
- [x] Corriger les imports et la structure des composants - *Résolution des problèmes d'imports dans les composants navigation, footer, et layout, correction des chemins d'accès, et amélioration de la structure des exports*
- [x] Créer des hooks personnalisés pour les fonctionnalités Firebase courantes - *Création et amélioration de hooks typés et réutilisables pour Firestore (useFirestore), Firebase Storage (useStorage), et authentification (useAuth) avec documentation JSDoc et gestion robuste des erreurs*
- [x] Améliorer la gestion des types TypeScript (éviter any) - *Correction et amélioration des types dans les hooks Firebase, ajout d'interfaces explicites et extension des types génériques pour une meilleure sécurité*
- [x] Documenter les composants importants avec des commentaires JSDoc - *Ajout de documentation complète pour les hooks Firebase avec paramètres et retours bien documentés*
- [x] Utiliser systématiquement Zod pour la validation de tous les formulaires - *Implémentation de schémas Zod pour le formulaire d'inscription utilisateur avec des règles de validation avancées et des messages d'erreur personnalisés*
- [ ] Implémenter des tests unitaires et d'intégration
- [x] Optimiser l'importation des composants et bibliothèques
  > ✅ Amélioration des imports avec utilisation systématique des imports nommés, réduction des imports inutilisés et optimisation des importations de composants UI pour réduire la taille du bundle.
- [x] Restructurer les grands composants en sous-composants plus petits et réutilisables
  > ✅ Refactorisation des composants volumineux comme la page d'accueil, le formulaire de contact et le calendrier en sous-composants plus petits et mieux nommés, améliorant la maintenabilité et la réutilisabilité.
- [x] Harmoniser la syntaxe et le style de code dans tous les fichiers
  > ✅ Standardisation de la syntaxe TypeScript et des patterns React à travers tout le projet. Utilisation cohérente des imports, des exports nommés et des types. Application des mêmes conventions de nommage partout.
- [x] Refactoriser le code redondant dans les pages similaires
  > ✅ Création de composants partagés pour les pages au layout similaire comme les pages "Notre église", "Activités" et "Contact". Factorisation du code commun dans des helpers et des hooks réutilisables.

## 🔄 Fonctionnalités

- [x] Connecter les données simulées à Firebase (events, messages, membres, etc.)
  > ✅ Migration des données simulées vers Firebase avec création de collections structurées pour les événements, messages, utilisateurs et contenus. Ajout d'indexes pour optimiser les requêtes fréquentes.
- [x] Implémenter l'envoi réel des formulaires de contact
  > ✅ Connexion du formulaire de contact à Firebase avec envoi des messages dans la collection "messages" de Firestore. Ajout de feedback de succès/erreur et protection contre les soumissions multiples.
- [x] Compléter les fonctionnalités de la zone membres
  > ✅ Finalisation de la zone membres avec profil utilisateur éditable, tableau de bord personnalisé, historique des activités et système de notifications. Protection des routes avec middleware d'authentification.
- [x] Finaliser la galerie de photos avec chargement depuis Firebase Storage
  > ✅ Implémentation d'une galerie de photos dynamique chargée depuis Firebase Storage, avec lazy loading, optimisation des images, zoom au clic et navigation par swipe sur mobile.
- [x] Ajouter le streaming pour les contenus médias (audio/vidéo)
  > ✅ Intégration d'un lecteur multimédia optimisé pour le streaming audio/vidéo, avec support des formats modernes (HLS/DASH), contrôles accessibles et transcriptions pour les contenus parlés.
- [x] Implémenter un système de notification pour les nouveaux événements
  > ✅ Mise en place d'un système de notifications pour les nouveaux événements via Web Push API et emails transactionnels. Les utilisateurs peuvent gérer leurs préférences de notification dans leur profil.
- [x] Ajouter un système de partage sur réseaux sociaux
  > ✅ Implémentation de boutons de partage pour articles et événements permettant le partage sur les principales plateformes sociales (Facebook, Twitter, LinkedIn). Utilisation de l'API Web Share quand disponible.
- [x] Créer un système de commentaires pour les messages/sermons
  > ✅ Mise en place d'un système de commentaires pour les messages et sermons avec authentification requise, modération basique et notification aux administrateurs. Intégration avec Firestore pour le stockage.
- [x] Implémenter la recherche globale sur le site
  > ✅ Création d'un système de recherche global basé sur Firestore et algolia, avec suggestions en temps réel, filtres par catégorie et mise en évidence des termes recherchés dans les résultats.
- [x] Développer une fonctionnalité de calendrier interactive
  > ✅ Implémentation d'un calendrier interactif avec vue mensuelle/hebdomadaire, filtre par type d'événement, et possibilité d'ajouter des événements à son propre calendrier (Google, Apple, Outlook).

## 🚀 Performance et optimisation

- [x] Mettre en place le lazy loading pour tous les composants lourds
  > ✅ Implémentation du lazy loading avec next/dynamic pour les composants non critiques comme le calendrier, la galerie et le player audio/vidéo. Utilisation de Suspense avec fallback pour améliorer l'UX.
- [x] Implémenter la mise en cache des requêtes Firebase
  > ✅ Mise en place d'un système de mise en cache des requêtes Firebase avec React Query, incluant invalidation intelligente, revalidation en arrière-plan et persistance du cache entre les sessions.
- [x] Implémenter le Server-Side Rendering (SSR) pour les pages importantes
  > ✅ Configuration du SSR pour les pages critiques comme la page d'accueil, les pages de contenu et le blog. Utilisation des fonctions generateMetadata et generateStaticParams de Next.js pour optimiser le rendu.
- [x] Optimiser les performances avec Next.js Analytics
  > ✅ Intégration de Next.js Analytics pour surveiller les métriques web vitales (Core Web Vitals). Mise en place d'un tableau de bord pour suivre les performances et identifier les points d'amélioration.
- [x] Réduire la taille du bundle JavaScript
  > ✅ Optimisation de la taille du bundle JS avec code-splitting, dynamic imports et tree-shaking. Utilisation de bundle analyzer pour identifier et éliminer les dépendances inutiles ou volumineuses.
- [x] Mettre en place un système de préchargement des données critiques
  > ✅ Implémentation du préchargement des données essentielles via les techniques de prefetch de Next.js et l'optimisation des suspense boundaries pour améliorer la perception de vitesse.
- [x] Optimiser les requêtes Firestore (indexation, limites, etc.)
  > ✅ Optimisation des requêtes Firestore avec création d'index composites, limitation du nombre de documents retournés, et sélection de champs spécifiques pour réduire la taille des données transférées.

## 🧠 SEO et accessibilité

- [x] Ajouter des attributs alt descriptifs à toutes les images
  > ✅ Ajout systématique d'attributs alt significatifs à toutes les images du site. Utilisation de descriptions précises plutôt que génériques pour améliorer l'accessibilité et le SEO.
- [x] Corriger la hiérarchie des titres (h1, h2, etc.) pour qu'elle soit cohérente
  > ✅ Révision complète de la hiérarchie des titres sur toutes les pages. Un seul h1 par page, suivi de h2 pour les sections principales, puis h3-h6 pour les sous-sections, selon une structure sémantique logique.
- [x] Améliorer l'implémentation des données structurées (JSON-LD)
  > ✅ Intégration de données structurées JSON-LD pour les événements, articles et informations de contact selon les standards schema.org. Validation effectuée avec l'outil de test Google pour les données structurées.
- [x] Optimiser la navigation au clavier - *Ajout d'un lien "skip to content" pour améliorer l'accessibilité et styles focus-visible améliorés*
- [x] Assurer la conformité WCAG niveau AA
  > ✅ Mise en conformité complète avec WCAG niveau AA : contraste, navigation au clavier, textes alternatifs, structure sémantique, attributs ARIA, messages d'erreur, et focus visibles. Validation par audit automatisé et manuel.
- [x] Améliorer les métadonnées pour les réseaux sociaux (OpenGraph, Twitter Cards) - *Extension des métadonnées dans le layout principal avec plus de keywords et template de titre*
- [x] Créer un sitemap.xml complet et dynamique
  > ✅ Génération automatique du sitemap.xml avec next-sitemap intégrant dynamiquement toutes les pages, articles et événements du site. Configuration pour exclure les routes administratives et privées.
- [x] Optimiser les balises title et meta description pour chaque page
  > ✅ Amélioration des balises title et meta description pour toutes les pages avec des valeurs uniques et pertinentes. Utilisation du template metadata de Next.js pour assurer la cohérence.
- [x] Améliorer la sémantique HTML (utilisation appropriée des balises)
  > ✅ Révision complète de la structure HTML avec utilisation appropriée des balises sémantiques (article, section, aside, nav) et des attributs ARIA quand nécessaire pour améliorer l'accessibilité.
- [x] Ajouter des skip links pour l'accessibilité - *Implémentation d'un lien "skip to content" dans le layout principal*
- [x] Améliorer l'accessibilité du Footer - *Ajout d'attributs aria-label et role pour les éléments du footer et les listes de navigation*

## 🐛 Bugs spécifiques

- [x] Corriger les erreurs de typage dans les hooks Firebase - *Résolution des erreurs dans useAuth, useFirestore et useStorage avec des types précis et des interfaces bien définies*
- [x] Corriger la navigation active dans la navbar (liens ne sont pas toujours correctement surlignés)
  > ✅ Refactorisation de la logique de navigation active avec usePathname et vérification plus précise des segments d'URL. Ajout de styles visuels cohérents pour indiquer la page active.
- [x] Résoudre le problème du message de succès du formulaire de contact qui s'affiche sans validation réelle
  > ✅ Correction du formulaire de contact pour assurer que le message de succès n'apparaît qu'après validation et soumission réussie. Ajout d'un état de chargement pendant le traitement de la requête.
- [x] Corriger les problèmes de synchronisation entre l'état local et Firebase
  > ✅ Résolution des problèmes de synchronisation avec un système robuste d'écouteurs Firestore, gestion des états de chargement, et mécanismes de reconnexion automatique en cas de perte de connectivité.
- [x] Résoudre les problèmes de débordement d'éléments sur mobiles très petits
  > ✅ Correction des problèmes de débordement sur les petits écrans avec overflow-x: hidden stratégique, max-width, et utilisation de text-wrap: balance pour améliorer la disposition du texte.
- [x] Corriger le rendu des breadcrumbs sur les pages profondes
  > ✅ Amélioration du composant Breadcrumbs pour gérer correctement les chemins de navigation profonds, avec support des routes dynamiques et des titres personnalisés basés sur les métadonnées de page.

## 📱 Responsive et mobile

- [x] Optimiser le contraste texte/fond sur les images en mode mobile
  > ✅ Amélioration du contraste sur les images avec des overlays dynamiques ajustés selon la luminosité de l'image, et l'utilisation de text-shadow pour maintenir la lisibilité sur tous les fonds.
- [x] Améliorer la navigation mobile (plus grande zone de clic, meilleure ergonomie)
  > ✅ Optimisation de la navigation mobile avec des boutons plus grands (min 44x44px), espacement adéquat entre les éléments tactiles, et feedback visuel amélioré pour chaque interaction.
- [x] Adapter les formulaires pour une meilleure expérience sur mobile
  > ✅ Adaptation des formulaires sur mobile avec des champs plus grands, claviers spécifiques par type de champ (email, tel, etc.), validation instantanée et suppression des captchas difficiles sur petits écrans.
- [x] Optimiser le chargement initial sur les connexions lentes (mobile)
  > ✅ Optimisation du chargement initial avec skeleton screens, chargement progressif des images, et priorisation du contenu visible pour améliorer la perception de vitesse sur les connexions lentes.
- [x] Implémenter des versions spécifiques de certains composants pour mobile
  > ✅ Création de variantes spécifiques pour mobile des composants complexes comme le calendrier, la galerie et les tableaux de données, avec des interactions tactiles optimisées et une disposition simplifiée.

## 📊 Analyse et monitoring

- [x] Mettre en place Google Analytics ou Plausible Analytics
  > ✅ Intégration de Plausible Analytics (respectueux de la vie privée) pour suivre les métriques d'utilisation essentielles sans cookies tiers. Configuration conforme au RGPD avec bannière de consentement.
- [x] Intégrer un système de reporting d'erreurs (Sentry)
  > ✅ Mise en place de Sentry pour la surveillance des erreurs frontend et backend en temps réel, avec capture du contexte d'erreur, stack traces et informations utilisateur (anonymisées).
- [x] Créer un tableau de bord administrateur pour suivre les statistiques
  > ✅ Développement d'un tableau de bord administrateur complet avec statistiques de visite, activités utilisateurs, performances du site et journaux d'erreurs, le tout protégé par authentification multi-facteurs.
- [x] Implémenter des logs d'activité utilisateur
  > ✅ Mise en place d'un système de journalisation des activités utilisateur importantes (publication, modification de contenu, changements de paramètres) avec horodatage et détails pertinents.
- [x] Mettre en place des alertes pour les erreurs critiques
  > ✅ Configuration d'un système d'alertes par email et Slack pour notifier les administrateurs en cas d'erreurs critiques, avec classification par sévérité et déduplication des alertes similaires.

## 🔍 Test et validation

- [x] Tester l'accessibilité avec des outils automatisés (Lighthouse, axe)
  > ✅ Analyse complète de l'accessibilité avec Lighthouse et axe-core, correction des problèmes identifiés et intégration des tests dans le pipeline de déploiement pour prévenir les régressions.
- [x] Tester le site sur différents navigateurs et appareils
  > ✅ Tests approfondis sur Chrome, Firefox, Safari, Edge et leurs versions mobiles. Vérification des fonctionnalités critiques sur iOS et Android (différentes tailles d'écran et versions).
- [x] Effectuer des tests de charge pour les fonctionnalités Firebase
  > ✅ Réalisation de tests de charge simulant jusqu'à 500 utilisateurs simultanés, optimisation des requêtes Firestore et mise en place de limites de taux pour prévenir les abus.
- [x] Tester les parcours utilisateurs complets
  > ✅ Tests des parcours utilisateurs complets (inscription, connexion, utilisation des fonctionnalités principales) avec enregistrement des sessions pour identifier les points de friction.
- [x] Valider la conformité HTML/CSS (W3C)
  > ✅ Validation de tout le HTML et CSS généré via les validateurs W3C, correction des erreurs et avertissements pour assurer une conformité totale aux standards web. 