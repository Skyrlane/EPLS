# 📖 Guide de configuration des Échos EPLS

## 🎯 Vue d'ensemble

Le système d'Échos permet d'afficher les bulletins mensuels de l'église (PDF) sur le site web. Les échos sont stockés dans Firebase Firestore et les PDFs dans Firebase Storage.

## 📋 Étapes de configuration

### 1. Vérifier Firebase est configuré

Assurez-vous que Firebase est bien configuré dans `.env.local` :

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### 2. Créer la collection Firestore

#### Option A : Via la console Firebase (recommandé pour débuter)

1. Aller sur https://console.firebase.google.com/
2. Sélectionner votre projet
3. Aller dans **Firestore Database**
4. Cliquer sur **Démarrer une collection**
5. Nom de la collection : `echos`
6. Ajouter un premier document avec ces champs :

```
ID du document : (auto-généré)

Champs :
- title (string) : "L'Écho - Novembre 2025"
- description (string) : "Édition de novembre avec les dernières nouvelles..."
- month (number) : 11
- year (number) : 2025
- pdfUrl (string) : "https://votrestorage.com/echo-nov-2025.pdf"
- coverImageUrl (string) : "https://votrestorage.com/cover-nov.jpg" (optionnel)
- fileSize (number) : 2500000 (optionnel, en bytes)
- publishedAt (timestamp) : 1er novembre 2025
- status (string) : "published"
```

#### Option B : Via un script Node.js

Créer un fichier `test-add-echo.js` à la racine du projet :

```javascript
const admin = require('firebase-admin');
const serviceAccount = require('./firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function addTestEcho() {
  await db.collection('echos').add({
    title: "L'Écho - Novembre 2025",
    description: "Édition de novembre avec les dernières nouvelles de l'église",
    month: 11,
    year: 2025,
    pdfUrl: "https://example.com/echo-nov-2025.pdf",
    coverImageUrl: "https://example.com/cover-nov.jpg",
    fileSize: 2500000,
    publishedAt: admin.firestore.Timestamp.fromDate(new Date('2025-11-01')),
    status: "published"
  });

  console.log('✅ Écho ajouté !');
}

addTestEcho();
```

Exécuter : `node test-add-echo.js`

### 3. Uploader les PDFs dans Firebase Storage

1. Aller sur https://console.firebase.google.com/
2. Sélectionner votre projet
3. Aller dans **Storage**
4. Créer un dossier `echoes/`
5. Uploader vos PDFs (ex: `echo-epls-novembre-2025.pdf`)
6. Cliquer sur le fichier → Obtenir l'URL de téléchargement
7. Copier cette URL dans le champ `pdfUrl` de Firestore

### 4. Configurer les règles Firestore

Dans la console Firebase → Firestore → Règles, ajouter :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Règles pour la collection 'echos'
    match /echos/{echoId} {
      // Lecture publique (tous les visiteurs peuvent lire)
      allow read: if true;

      // Écriture réservée aux admins
      allow write: if request.auth != null
                   && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
  }
}
```

### 5. Configurer les règles Storage

Dans la console Firebase → Storage → Règles :

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    // Règles pour le dossier 'echoes/'
    match /echoes/{fileName} {
      // Lecture publique
      allow read: if true;

      // Écriture réservée aux admins authentifiés
      allow write: if request.auth != null;
    }
  }
}
```

### 6. Tester le système

1. Lancer le serveur de dev : `npm run dev`
2. Aller sur http://localhost:3000
3. Vérifier que la section "L'Echo mensuel" s'affiche
4. Aller sur http://localhost:3000/echo
5. Vérifier que les échos sont listés avec les filtres

## 🐛 Dépannage

### Erreur : "Impossible de charger les échos"

**Vérifications :**

1. **Firestore est-il configuré ?**
   - Vérifier `.env.local`
   - Ouvrir la console du navigateur (F12) et regarder les erreurs

2. **La collection existe-t-elle ?**
   - Aller sur https://console.firebase.google.com/
   - Vérifier que la collection `echos` existe

3. **Les règles sont-elles correctes ?**
   - Vérifier les règles Firestore (voir étape 4)
   - Tester avec des règles ouvertes temporairement :
     ```javascript
     allow read, write: if true; // ⚠️ Temporaire uniquement !
     ```

4. **Firebase est-il initialisé ?**
   - Vérifier dans la console : "Firebase initialized successfully"

### La section affiche "Aucun écho disponible"

**C'est normal si :**
- Aucun écho n'est publié pour le mois en cours
- Les échos ont `status: "draft"` au lieu de `"published"`

**Solution :**
- Ajouter un écho pour le mois en cours
- Ou attendre le mois suivant si vous avez des échos futurs

### Les PDFs ne s'affichent pas

**Vérifications :**
1. L'URL du PDF est-elle correcte ?
2. Le fichier est-il bien dans Firebase Storage ?
3. Les règles Storage permettent-elles la lecture publique ?

## 📊 Structure des données Firestore

```typescript
Collection: echos
Document ID: (auto-généré)
{
  title: string,              // "L'Écho - Novembre 2025"
  description?: string,       // Court résumé (optionnel)
  month: number,              // 1-12
  year: number,               // 2025
  pdfUrl: string,             // URL Firebase Storage
  coverImageUrl?: string,     // URL image couverture (optionnel)
  fileSize?: number,          // Taille en bytes (optionnel)
  publishedAt: Timestamp,     // Date de publication
  status: "published" | "draft"
}
```

## 🚀 Utilisation avancée

### Ajouter un écho via le code

```typescript
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';

async function addEcho() {
  await addDoc(collection(firestore, 'echos'), {
    title: "L'Écho - Décembre 2025",
    description: "Édition de décembre avec les vœux de Noël",
    month: 12,
    year: 2025,
    pdfUrl: "https://storage.googleapis.com/.../echo-dec-2025.pdf",
    coverImageUrl: "https://storage.googleapis.com/.../cover-dec.jpg",
    fileSize: 3200000,
    publishedAt: Timestamp.fromDate(new Date('2025-12-01')),
    status: "published"
  });
}
```

### Uploader un PDF avec code

```typescript
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

async function uploadPDF(file: File) {
  const storageRef = ref(storage, `echoes/${file.name}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
}
```

## 📝 Notes importantes

- **Mois en cours** : La page d'accueil affiche automatiquement l'écho du mois en cours
- **Archives** : La page `/echo` affiche tous les échos publiés avec filtres par année
- **Performance** : Les queries Firebase sont optimisées pour éviter les index composites
- **Sécurité** : Seuls les admins peuvent créer/modifier/supprimer des échos

## 🎯 Prochaines étapes

1. Créer un panneau admin pour gérer les échos
2. Ajouter un système d'upload de PDF directement depuis le site
3. Générer automatiquement des vignettes de couverture
