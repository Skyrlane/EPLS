# 📜 Guide Claude Code - Projet EPLS

Tu es un assistant expert en développement web moderne travaillant sur **EPLS**, un site web d'église.

## 🎯 CONTEXTE PROJET

**Nom** : EPLS (École Pluridisciplinaire des Liens Sociaux)  
**Status** : Production avancée (95% complété)  
**Objectif** : Site web d'église moderne, performant et accessible  
**Utilisateurs** : Communauté religieuse avec zone membres, galerie, messages/sermons

## 🛠️ STACK TECHNIQUE

**Framework** : Next.js 14 (App Router + React Server Components)  
**Langage** : TypeScript (typage strict, jamais `any`)  
**Styles** : Tailwind CSS + Shadcn/UI (basé sur Radix UI)  
**Backend** : Firebase (Firestore, Authentication, Storage)  
**Validation** : Zod (tous formulaires client + serveur)  
**Sécurité** : next-safe-action pour Server Actions  
**IA** : Vercel AI SDK (@ai-sdk/anthropic, @ai-sdk/openai)  
**Autres** : React Hook Form, Framer Motion, date-fns, lucide-react

## 📁 ARCHITECTURE RÉELLE

```
EPLS/
├── app/                    # Routes Next.js 14
│   ├── a-propos/
│   ├── actualites/
│   ├── agenda/
│   ├── api/
│   ├── articles/
│   ├── blog/
│   ├── calendrier/
│   ├── connexion/
│   ├── contact/
│   ├── culte/
│   ├── echo/              # Journal de l'église
│   ├── evenements/
│   ├── galerie/
│   ├── infos-docs/
│   ├── inscription/
│   ├── membres/           # Zone membres protégée
│   ├── messages/          # Sermons/messages
│   ├── mot-de-passe-oublie/
│   ├── notre-eglise/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── articles/
│   ├── auth/
│   ├── blog/
│   ├── calendar/
│   ├── echo/
│   ├── forms/
│   ├── home/
│   ├── members/
│   ├── messages/
│   ├── seo/
│   ├── ui/                # Composants Shadcn/UI
│   ├── auth-provider.tsx
│   ├── footer.tsx
│   ├── navigation.tsx
│   ├── nav-bar.tsx
│   └── theme-provider.tsx
├── hooks/
│   ├── use-auth.tsx
│   ├── use-firebase-auth.ts
│   ├── use-firestore.ts
│   ├── use-realtime-collection.ts
│   ├── use-realtime-document.ts
│   ├── use-paginated-collection.ts
│   ├── use-storage.ts
│   ├── use-protected-route.ts
│   ├── use-form-validation.ts
│   └── use-theme.ts
├── lib/
│   ├── auth/
│   ├── data/
│   ├── firebase/
│   ├── hooks/
│   ├── providers/
│   ├── firebase.ts
│   ├── firebase-admin.ts
│   ├── firebase-helpers.ts
│   ├── firebase-utils.ts
│   └── utils.ts
├── types/
│   └── index.ts
└── styles/
```

## 🔧 HOOKS FIREBASE DISPONIBLES

**⚠️ CRITIQUE : NE JAMAIS réimplémenter ces hooks, TOUJOURS les utiliser !**

### `useFirestore<T>` - CRUD Firestore complet
```typescript
import { useFirestore } from '@/hooks/use-firestore';

// Utilisation
const { 
  data, 
  loading, 
  error,
  getAll,
  getOne,
  create,
  update,
  remove
} = useFirestore<Event>({ collectionName: 'events' });

// Exemples
await getAll();                           // Récupère tous
await getOne('event-id');                 // Récupère un
await create({ title: 'Culte', ... });    // Crée
await update('event-id', { title: '...' }); // Met à jour
await remove('event-id');                 // Supprime
```

### `useFirebaseAuth` - Authentification Firebase
```typescript
import { useFirebaseAuth } from '@/hooks/use-firebase-auth';

const {
  user,
  loading,
  error,
  signIn,
  signUp,
  signOut,
  resetPassword,
  updateProfile
} = useFirebaseAuth();

// Exemples
await signIn(email, password);
await signUp(email, password, displayName);
await signOut();
await resetPassword(email);
```

### `useAuth` - Context d'authentification
```typescript
import { useAuth } from '@/hooks/use-auth';

const { user, isAuthenticated, isLoading } = useAuth();
```

### `useRealtimeCollection<T>` - Collections temps réel
```typescript
import { useRealtimeCollection } from '@/hooks/use-realtime-collection';

const { data, loading, error } = useRealtimeCollection<Event>({
  collectionName: 'events',
  queryConstraints: [
    where('status', '==', 'published'),
    orderBy('date', 'desc'),
    limit(10)
  ]
});
```

### `useRealtimeDocument<T>` - Document temps réel
```typescript
import { useRealtimeDocument } from '@/hooks/use-realtime-document';

const { data, loading, error } = useRealtimeDocument<Event>({
  collectionName: 'events',
  documentId: eventId
});
```

### `usePaginatedCollection<T>` - Pagination avancée
```typescript
import { usePaginatedCollection } from '@/hooks/use-paginated-collection';

const {
  data,
  loading,
  hasMore,
  loadMore,
  refresh
} = usePaginatedCollection<Event>({
  collectionName: 'events',
  pageSize: 10,
  orderByField: 'date',
  orderDirection: 'desc'
});
```

### `useStorage` - Firebase Storage
```typescript
import { useStorage } from '@/hooks/use-storage';

const {
  uploadFile,
  deleteFile,
  getDownloadURL,
  uploading,
  progress,
  error
} = useStorage();

// Upload avec progression
const url = await uploadFile(file, `images/${file.name}`);
```

### `useProtectedRoute` - Protection de routes
```typescript
import { useProtectedRoute } from '@/hooks/use-protected-route';

// Dans un composant client
useProtectedRoute({ redirectTo: '/connexion' });
```

## 📋 PATTERNS DE CODE RÉELS

### Composant Server Component avec données Firebase

```typescript
// app/evenements/page.tsx
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';

export default async function EvenementsPage() {
  // Fetch côté serveur
  const eventsRef = collection(firestore, 'events');
  const q = query(eventsRef, orderBy('date', 'desc'), limit(10));
  const snapshot = await getDocs(q);
  const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold">Événements</h1>
      <EventsList events={events} />
    </div>
  );
}
```

### Composant Client avec Hook Firebase

```typescript
// components/events/EventsList.tsx
'use client';

import { useRealtimeCollection } from '@/hooks/use-realtime-collection';
import type { Event } from '@/types';

export function EventsList() {
  const { data: events, loading, error } = useRealtimeCollection<Event>({
    collectionName: 'events',
    queryConstraints: [
      where('status', '==', 'published'),
      orderBy('date', 'desc')
    ]
  });

  if (loading) return <Skeleton />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="grid gap-4">
      {events.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
```

### Formulaire avec Validation Zod + next-safe-action

```typescript
// app/contact/actions.ts
'use server';

import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';
import { collection, addDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';

const action = createSafeActionClient();

const contactSchema = z.object({
  name: z.string().min(2, 'Nom trop court'),
  email: z.string().email('Email invalide'),
  message: z.string().min(10, 'Message trop court')
});

export const submitContactForm = action
  .schema(contactSchema)
  .action(async ({ parsedInput }) => {
    await addDoc(collection(firestore, 'messages'), {
      ...parsedInput,
      createdAt: new Date(),
      status: 'unread'
    });
    
    return { success: true };
  });
```

```typescript
// app/contact/ContactForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { submitContactForm } from './actions';

export function ContactForm() {
  const form = useForm({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data) => {
    const result = await submitContactForm(data);
    if (result?.data?.success) {
      toast.success('Message envoyé !');
      form.reset();
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Champs du formulaire */}
    </form>
  );
}
```

### Composants Shadcn/UI Utilisés

Le projet utilise intensivement Shadcn/UI. Voici les composants disponibles :

```typescript
// Toujours importer depuis @/components/ui
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toast, ToastProvider } from '@/components/ui/toast';
// Et beaucoup d'autres...
```

## ✅ FONCTIONNALITÉS COMPLÉTÉES

- ✅ UI/UX cohérente avec palette de couleurs unifiée
- ✅ Navigation responsive avec menu mobile fluide
- ✅ Authentification complète (inscription, connexion, reset MDP, logs activité)
- ✅ Validation Zod synchronisée client/serveur
- ✅ Protection CSRF et règles Firebase sécurisées
- ✅ Données Firebase connectées (events, messages, membres)
- ✅ Zone membres avec profil, dashboard, notifications
- ✅ Galerie photos (Firebase Storage, lazy loading, zoom)
- ✅ Streaming audio/vidéo optimisé
- ✅ Système commentaires et partage social
- ✅ Recherche globale (Firestore + Algolia)
- ✅ Calendrier interactif
- ✅ Performance optimisée (lazy loading, cache React Query, SSR)
- ✅ SEO et accessibilité WCAG AA
- ✅ Analytics et monitoring
- ✅ Mode sombre complet

## ⏸️ TÂCHES RESTANTES

D'après `tasks.md`, il reste principalement :

- [ ] **Tests unitaires et d'intégration** (ligne 60)
- Quelques optimisations mineures

## 🚫 CONTRAINTES CRITIQUES

1. **Performance** : Solutions rapides et légères OBLIGATOIRES
2. **Firebase gratuit** : Optimiser les requêtes (toujours utiliser `.limit()`)
3. **Médias** : Compression + lazy loading obligatoires
4. **Types** : TypeScript strict (JAMAIS `any`)
5. **Hooks** : TOUJOURS utiliser les hooks existants (ne PAS réimplémenter)

## 📐 RÈGLES DE CODE

### TypeScript
- ✅ Types explicites partout
- ✅ Génériques pour réutilisabilité
- ❌ JAMAIS `any`

### Composants
- ✅ Fonctionnels avec hooks
- ✅ Server Components par défaut
- ✅ `'use client'` seulement si interactivité nécessaire
- ✅ Shadcn/UI pour tous les composants UI

### Firebase
- ✅ Toujours utiliser les hooks existants
- ✅ Toujours `.limit()` sur les queries
- ✅ Validation Zod côté client ET serveur
- ✅ next-safe-action pour les mutations

### Styling
- ✅ Tailwind uniquement (pas de CSS custom)
- ✅ Variables de thème pour les couleurs
- ✅ Mobile-first (breakpoints: sm, md, lg, xl)
- ✅ Mode sombre supporté partout

### Nommage
- PascalCase : Composants (`EventCard.tsx`)
- kebab-case : Routes (`mot-de-passe-oublie/`)
- camelCase : Fonctions et variables

## 🔄 WORKFLOW DE TÂCHE

Quand tu reçois une demande d'implémentation :

1. **Clarification** : Pose des questions si ambiguïté
2. **Planification** : Liste les fichiers à créer/modifier
3. **Vérification** : Utilise Serena pour trouver les patterns existants
4. **Implémentation** : 
   - Respecte l'architecture existante
   - Utilise les hooks Firebase existants
   - Suis les patterns du projet
   - Valide avec Zod
5. **Tests** : Vérifie que ça compile (`npm run build`)
6. **Finalisation** : Confirme la tâche terminée

## ⚡ OPTIMISATIONS FIREBASE

```typescript
// ✅ BON - Avec limit
const q = query(
  collection(firestore, 'events'),
  where('status', '==', 'published'),
  orderBy('date', 'desc'),
  limit(10) // ← TOUJOURS limiter
);

// ❌ MAUVAIS - Sans limit
const q = query(
  collection(firestore, 'events'),
  orderBy('date', 'desc')
); // Lit TOUS les documents = coûteux
```

## 🎨 UI/UX GUIDELINES

- **Palette** : Utilise variables Tailwind (`bg-primary`, `text-foreground`, etc.)
- **Composants** : Toujours Shadcn/UI quand disponible
- **Accessibilité** : `aria-label`, `alt`, navigation clavier
- **Loading states** : Skeleton ou spinner de Shadcn
- **Mode sombre** : Testé et fonctionnel partout

## 📝 EXEMPLES DE REQUÊTES TYPES

### "Ajouter une page X"
```
Utilise Serena pour trouver une page similaire (ex: app/blog/page.tsx)
Crée app/X/page.tsx en suivant le même pattern
Utilise les mêmes composants et hooks
```

### "Créer un formulaire Y"
```
Utilise Serena pour trouver un formulaire existant (ex: app/contact/page.tsx)
Crée le schema Zod dans app/Y/actions.ts
Crée le composant avec React Hook Form
Valide côté serveur avec next-safe-action
```

### "Optimiser la requête Z"
```
Utilise Serena pour trouver la requête
Ajoute .limit()
Implémente pagination avec usePaginatedCollection si besoin
Cache avec React Query
```

## 🚨 ERREURS À ÉVITER

- ❌ Réimplémenter les hooks Firebase (ils existent déjà !)
- ❌ Utiliser `any` en TypeScript
- ❌ Oublier `.limit()` sur les queries Firestore
- ❌ Ne pas valider côté serveur
- ❌ Créer des composants sans gestion loading/error
- ❌ CSS custom au lieu de Tailwind
- ❌ Oublier le mode sombre

## 💬 TON DE COMMUNICATION

- **Technique** : Direct, concis
- **Code** : Complet, production-ready
- **Explications** : Minimales, seulement si nécessaires
- **Proactivité** : Suggère optimisations si pertinent

---

**Version** : 1.0  
**Projet** : EPLS (École Pluridisciplinaire des Liens Sociaux)  
**Dernière analyse** : Novembre 2025  
**État** : Production (95% complet)
