# 🏫 EPLS - Site Web Officiel

Bienvenue dans le dépôt du site web de l'École Pluridisciplinaire des Liens Sociaux (EPLS).

## 📚 Pile technologique

Ce projet utilise les technologies suivantes:

- **Framework**: [Next.js 14](https://nextjs.org/) avec App Router et React Server Components
- **Langage**: [TypeScript](https://www.typescriptlang.org/)
- **Styles**: [Tailwind CSS](https://tailwindcss.com/)
- **Composants UI**: [Shadcn/UI](https://ui.shadcn.com/) basé sur [Radix UI](https://www.radix-ui.com/)
- **Base de données & Authentification**: [Firebase](https://firebase.google.com/) (Firestore, Authentication, Storage)
- **Validation**: [Zod](https://github.com/colinhacks/zod)
- **Sécurité**: [next-safe-action](https://next-safe-action.dev/) pour les Server Actions sécurisées
- **IA**: [Vercel AI SDK](https://sdk.vercel.ai/docs) pour l'intégration d'IA

## 🚀 Démarrage rapide

Pour lancer le projet en développement:

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Le site sera disponible à l'adresse [http://localhost:3000](http://localhost:3000).

## 🧪 Tests

```bash
# Lancer les tests unitaires
npm test

# Lancer les tests e2e
npm run test:e2e
```

## 📁 Structure du projet

```
├── app/            # Routes et pages (Next.js App Router)
├── components/     # Composants React réutilisables
├── hooks/          # Hooks React personnalisés
│   ├── use-firestore.ts             # Hook pour les opérations CRUD sur Firestore
│   ├── use-firebase-auth.ts         # Hook pour l'authentification Firebase
│   ├── use-realtime-collection.ts   # Hook pour les collections en temps réel
│   ├── use-realtime-document.ts     # Hook pour les documents en temps réel
│   ├── use-paginated-collection.ts  # Hook pour la pagination de collections
│   └── use-storage.ts               # Hook pour Firebase Storage
├── lib/            # Utilitaires et configuration
├── public/         # Ressources statiques
├── styles/         # Styles globaux et configuration Tailwind
└── types/          # Types TypeScript partagés
```

## 📋 Gestion des tâches

Le fichier [tasks.md](./tasks.md) contient la liste complète des tâches à réaliser pour améliorer le site. Consultez également le [CHANGELOG.md](./CHANGELOG.md) pour voir les modifications récentes.

## 🔐 Authentification et Firebase

Le projet utilise Firebase pour la base de données, le stockage et l'authentification:

- **Authentification simplifiée**: Hooks personnalisés pour gérer toutes les opérations d'auth
- **Temps réel**: Abonnements optimisés aux changements de données
- **Pagination**: Support avancé de pagination pour les collections
- **Stockage de fichiers**: Upload avec progression et gestion des métadonnées
- **Typage fort**: Tous les hooks Firebase utilisent les génériques TypeScript

Pour démarrer avec Firebase, configurez vos variables d'environnement dans un fichier `.env.local` :

```
NEXT_PUBLIC_FIREBASE_API_KEY=votre-clé-api
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=votre-domaine
NEXT_PUBLIC_FIREBASE_PROJECT_ID=votre-id-projet
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=votre-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=votre-id-expediteur
NEXT_PUBLIC_FIREBASE_APP_ID=votre-id-app
```

## 🌐 Déploiement

Le site est configuré pour être déployé sur [Vercel](https://vercel.com/) avec des environnements de prévisualisation pour chaque pull request.

## 🤝 Contribution

Pour contribuer au projet, veuillez suivre ces étapes:

1. Créez une branche à partir de `main`
2. Implémentez vos modifications
3. Soumettez une pull request avec une description détaillée

## 📄 License

Ce projet est sous licence propriétaire © EPLS 2024.