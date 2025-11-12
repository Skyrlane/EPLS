# 📣 Guide de configuration des Annonces EPLS

## 🎯 Vue d'ensemble

Le système d'annonces permet d'afficher des événements importants (concerts, cultes, spectacles, formations, etc.) sur le site EPLS. Les annonces sont stockées dans Firebase Firestore et affichées dynamiquement sur la page d'accueil et le calendrier.

## 📋 Étapes de configuration

### 1. Créer la collection Firestore

#### Via la console Firebase

1. Aller sur https://console.firebase.google.com/
2. Sélectionner votre projet
3. Aller dans **Firestore Database**
4. Créer une collection nommée `announcements`
5. Ajouter un premier document avec ces champs :

**Exemple 1 : Spectacle avec tarification**

```
ID du document : (auto-généré)

Champs :
- title (string) : "L'Idégé de Mi : Les trois yeux de Minéloïda"
- date (timestamp) : 15 novembre 2025 20:00
- time (string) : "20h00"
- location (map) :
  - name (string) : "Centre Culturel de Brumath"
  - address (string) : "29 Rue André Malraux, 67380 Brumath"
- pricing (map - optionnel) :
  - free (string) : "Gratuit jusqu'à 8 ans"
  - child (string) : "9-17 ans : 5 €"
  - student (string) : "Étudiants : 10 €"
  - adult (string) : "Adultes : 15 €"
- type (string) : "spectacle"
- tag (string) : "Spectacle"
- tagColor (string) : "#8B5CF6"
- isPinned (boolean) : true
- priority (number) : 1
- isActive (boolean) : true
- status (string) : "published"
- createdAt (timestamp) : maintenant
- updatedAt (timestamp) : maintenant
```

**Exemple 2 : Culte avec détails**

```
Champs :
- title (string) : "CULTE"
- date (timestamp) : 16 novembre 2025 10:00
- time (string) : "10h00"
- location (map) :
  - name (string) : "Église St-Marc"
  - address (string) : "18 Rue de Franche-Comté, 67380 Lingolsheim"
- details (array de strings) :
  - "Chants, Louanges, Prières"
  - "Prédication"
  - "Garderie & École du dimanche"
  - "Communion fraternelle"
- type (string) : "culte"
- tag (string) : "Culte"
- tagColor (string) : "#3B82F6"
- isPinned (boolean) : false
- priority (number) : 2
- isActive (boolean) : true
- status (string) : "published"
- createdAt (timestamp) : maintenant
- updatedAt (timestamp) : maintenant
```

**Exemple 3 : Concert**

```
Champs :
- title (string) : "CONCERT avec les RAINBOW GOSPEL SINGERS"
- date (timestamp) : 30 novembre 2025 17:00
- time (string) : "17h00"
- location (map) :
  - name (string) : "Église Saint-Marc"
  - address (string) : "18 rue de Franche-Comté, 67380 Lingolsheim"
- details (array) :
  - "Entrée libre - plateau"
- type (string) : "concert"
- tag (string) : "Concert"
- tagColor (string) : "#10B981"
- isPinned (boolean) : false
- priority (number) : 3
- isActive (boolean) : true
- status (string) : "published"
- createdAt (timestamp) : maintenant
- updatedAt (timestamp) : maintenant
```

### 2. Configurer les règles Firestore

Dans la console Firebase → Firestore → Règles :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Règles pour la collection 'announcements'
    match /announcements/{announcementId} {
      // Lecture publique
      allow read: if true;

      // Écriture réservée aux admins
      allow write: if request.auth != null
                   && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
  }
}
```

### 3. Couleurs de tags par type d'événement

Utilisez ces couleurs pour une cohérence visuelle :

| Type         | Tag          | Couleur   | Code Hex  |
|--------------|--------------|-----------|-----------|
| culte        | Culte        | Bleu      | #3B82F6   |
| concert      | Concert      | Vert      | #10B981   |
| spectacle    | Spectacle    | Violet    | #8B5CF6   |
| reunion      | Réunion      | Orange    | #F59E0B   |
| formation    | Formation    | Indigo    | #6366F1   |
| autre        | Événement    | Gris      | #6B7280   |

### 4. Champs expliqués

#### Champs obligatoires :

- **title** : Titre de l'annonce (ex: "Concert de Noël")
- **date** : Date et heure de l'événement (Timestamp)
- **time** : Heure formatée (string, ex: "20h00")
- **location** : Objet avec `name` et `address`
- **type** : Type d'événement (culte, concert, spectacle, reunion, formation, autre)
- **tag** : Label du tag affiché (ex: "Concert")
- **tagColor** : Couleur hexadécimale du tag
- **isPinned** : Épingler en haut (true/false)
- **priority** : Ordre d'affichage (1 = plus haut)
- **isActive** : Visible ou masqué (true/false)
- **status** : "published" ou "draft"
- **createdAt** : Date de création (Timestamp)
- **updatedAt** : Date de modification (Timestamp)

#### Champs optionnels :

- **content** : Description longue de l'événement
- **details** : Liste de points clés (array de strings)
- **pricing** : Objet avec `free`, `child`, `student`, `adult`
- **expiresAt** : Date d'expiration automatique (Timestamp)

### 5. Priorités et affichage

Les annonces sont triées par :

1. **isPinned** : Les annonces épinglées apparaissent en premier
2. **priority** : Plus le nombre est petit, plus l'annonce est haute (1 = en haut)
3. **date** : Les événements les plus proches apparaissent en premier

**Exemple de priorités :**

```
priority: 1, isPinned: true  → Affiché en premier (annonce urgente)
priority: 1, isPinned: false → Affiché ensuite
priority: 2, isPinned: false → ...
priority: 3, isPinned: false → Affiché en dernier
```

### 6. Expiration automatique

Les événements sont automatiquement masqués 24h après leur date. Pour forcer une expiration plus tôt, utilisez le champ `expiresAt`.

```
expiresAt: 20 novembre 2025 00:00 → L'annonce disparaît après cette date
```

### 7. États des annonces

- **published + isActive: true** → Visible sur le site
- **published + isActive: false** → Masqué temporairement
- **draft** → Brouillon (jamais affiché)

## 🔧 Ajouter une annonce via code

```typescript
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';

async function addAnnouncement() {
  await addDoc(collection(firestore, 'announcements'), {
    title: "Concert de Noël",
    date: Timestamp.fromDate(new Date('2025-12-20T19:00:00')),
    time: "19h00",
    location: {
      name: "Église EPLS",
      address: "Rue de l'Église, Strasbourg"
    },
    details: [
      "Chorale de l'église",
      "Chants traditionnels",
      "Entrée libre"
    ],
    type: "concert",
    tag: "Concert",
    tagColor: "#10B981",
    isPinned: true,
    priority: 1,
    isActive: true,
    status: "published",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
}
```

## 📊 Structure des données Firestore

```typescript
Collection: announcements
Document ID: (auto-généré)
{
  title: string,
  date: Timestamp,
  time: string,
  location: {
    name: string,
    address: string
  },
  content?: string,
  details?: string[],
  pricing?: {
    free?: string,
    child?: string,
    student?: string,
    adult?: string
  },
  type: "concert" | "culte" | "spectacle" | "reunion" | "formation" | "autre",
  tag: string,
  tagColor: string,
  isPinned: boolean,
  priority: number,
  isActive: boolean,
  expiresAt?: Timestamp,
  status: "published" | "draft",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## 🎨 Apparence sur le site

### Page d'accueil - "Annonces importantes"

- Affiche 3 annonces maximum
- Cards détaillées avec tous les détails
- Tags colorés
- Tarification si présente
- Bouton "Voir tous les événements" vers /culte/calendrier

### Page d'accueil - "Prochains événements"

- Affiche 3 événements maximum
- Cards simplifiées (aperçu)
- Date relative (Aujourd'hui, Demain, ou date)

### Calendrier (/culte/calendrier)

- Affiche le mois actuel (novembre 2025)
- Jours avec événements marqués
- Clic sur un jour → voir les événements du jour

## 🐛 Dépannage

### Aucune annonce n'apparaît

**Vérifications :**

1. La collection `announcements` existe-t-elle ?
2. Les annonces ont `status: "published"` et `isActive: true` ?
3. Les dates des annonces sont-elles dans le futur (ou max 24h passées) ?
4. Les règles Firestore autorisent-elles la lecture ?

### Le calendrier affiche juin 2023

**Correction :** Le calendrier a été corrigé pour afficher le mois actuel automatiquement. Si le problème persiste, vérifiez `app/culte/calendrier/page.tsx` ligne 204.

### Les annonces n'ont pas de couleurs

**Correction :** Vérifiez que chaque annonce a bien le champ `tagColor` avec un code hexadécimal valide (ex: "#3B82F6").

## 🚀 Prochaines étapes

1. Créer un panneau admin pour gérer les annonces via l'interface
2. Ajouter des notifications pour les nouvelles annonces
3. Système d'inscription aux événements
4. Export iCalendar pour synchroniser avec calendriers externes

## 📝 Notes importantes

- Les événements sont automatiquement masqués 24h après leur date
- Utilisez `isPinned: true` pour les annonces urgentes
- Les annonces épinglées apparaissent toujours en premier
- Le système fonctionne même si Firebase n'est pas configuré (ne bloque pas le site)
- Maximum 3 annonces affichées sur la page d'accueil

---

**Version** : 1.0
**Projet** : EPLS
**Dernière mise à jour** : Novembre 2025
