# Structure Firebase pour la Galerie Photo

## 📁 Collections Firestore

### Collection: `gallery_photos`

Chaque document représente une photo.

```typescript
{
  id: string,                      // Auto-généré par Firestore
  title: string,                   // "Culte de Noël 2024"
  description: string,             // Description de la photo
  
  originalUrl: string,             // URL Storage (version originale max 1920px)
  mediumUrl: string,               // URL Storage (800px pour galerie)
  thumbnailUrl: string,            // URL Storage (300px pour carousel)
  
  width: number,                   // Largeur originale en pixels
  height: number,                  // Hauteur originale en pixels
  orientation: "landscape" | "portrait" | "square",
  fileSize: number,                // Taille en bytes
  mimeType: string,                // "image/jpeg", "image/png", "image/webp"
  
  tags: string[],                  // ["culte", "noel", "2024"]
  uploadedBy: string,              // UID de l'admin
  uploadedByName: string,          // Nom de l'admin
  
  isActive: boolean,               // Visible publiquement
  isFeatured: boolean,             // Apparaît dans le carousel
  order: number,                   // Ordre d'affichage (1 = premier)
  
  views: number,                   // Compteur de vues
  
  photoDate: Date | null,          // Date de prise de vue (optionnel)
  createdAt: Date,                 // Date d'upload
  updatedAt: Date                  // Dernière modification
}
```

**Indexes nécessaires** :
- `tags` (array) + `isActive` + `order` (composite)
- `isFeatured` + `isActive` + `order` (composite)
- `createdAt` (desc)
- `views` (desc)

---

### Collection: `gallery_tags`

Chaque document représente un tag/catégorie.

```typescript
{
  id: string,                      // Auto-généré ou slug
  name: string,                    // "Culte"
  slug: string,                    // "culte"
  color: string,                   // "#3B82F6" (bleu)
  count: number,                   // Nombre de photos (calculé)
  createdAt: Date,
  updatedAt: Date
}
```

**Tags par défaut à créer** :
```json
[
  { "name": "Cultes", "slug": "cultes", "color": "#3B82F6" },
  { "name": "Événements", "slug": "evenements", "color": "#10B981" },
  { "name": "Jeunesse", "slug": "jeunesse", "color": "#F59E0B" },
  { "name": "Baptêmes", "slug": "baptemes", "color": "#8B5CF6" },
  { "name": "Mariages", "slug": "mariages", "color": "#EC4899" },
  { "name": "Bâtiment", "slug": "batiment", "color": "#6B7280" },
  { "name": "Équipe", "slug": "equipe", "color": "#14B8A6" }
]
```

---

## 🗂️ Firebase Storage

### Structure des dossiers :

```
gs://votre-bucket.appspot.com/
└── gallery/
    ├── original/
    │   └── {photoId}.webp         # Version originale (max 1920px)
    ├── medium/
    │   └── {photoId}.webp         # Version moyenne (800px)
    └── thumbnail/
        └── {photoId}.webp         # Miniature (300px)
```

**Exemple** :
```
gallery/original/abc123.webp       (1920x1080, ~500 KB)
gallery/medium/abc123.webp         (800x450, ~150 KB)
gallery/thumbnail/abc123.webp      (300x169, ~30 KB)
```

---

## 🔒 Règles de sécurité Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Fonction helper : vérifier si admin
    function isAdmin() {
      return request.auth != null && 
             exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Collection: gallery_photos
    match /gallery_photos/{photoId} {
      // Lecture publique si active
      allow read: if resource.data.isActive == true || isAdmin();
      
      // Écriture admin uniquement
      allow create: if isAdmin();
      allow update: if isAdmin();
      allow delete: if isAdmin();
      
      // Incrémenter le compteur de vues (permettre sans auth)
      allow update: if request.resource.data.diff(resource.data).affectedKeys().hasOnly(['views']) &&
                       request.resource.data.views == resource.data.views + 1;
    }
    
    // Collection: gallery_tags
    match /gallery_tags/{tagId} {
      // Lecture publique
      allow read: if true;
      
      // Écriture admin uniquement
      allow create, update, delete: if isAdmin();
    }
  }
}
```

---

## 🗄️ Règles de sécurité Storage

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Fonction helper : vérifier si admin
    function isAdmin() {
      return request.auth != null && 
             firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Dossier galerie
    match /gallery/{allPaths=**} {
      // Lecture publique
      allow read: if true;
      
      // Upload admin uniquement
      allow write: if isAdmin();
      
      // Suppression admin uniquement
      allow delete: if isAdmin();
    }
  }
}
```

---

## 📊 Estimations de stockage

| Nombre de photos | Taille moyenne/photo | Total (3 versions) | Marge Firebase gratuit |
|------------------|----------------------|--------------------|------------------------|
| 100 photos       | 500 KB               | ~150 MB            | 5 GB (97% libre)       |
| 500 photos       | 500 KB               | ~750 MB            | 5 GB (85% libre)       |
| 800 photos       | 500 KB               | ~1.2 GB            | 5 GB (76% libre)       |

**Conclusion** : 800 photos rentrent largement dans le plan gratuit.

---

## 🚀 Initialisation

Pour créer la structure Firebase :

1. **Créer les tags par défaut** :
   ```bash
   npm run seed:gallery-tags
   ```

2. **Appliquer les règles de sécurité** :
   - Copier les règles Firestore ci-dessus dans Firebase Console
   - Copier les règles Storage ci-dessus dans Firebase Console

3. **Créer les indexes** :
   - L'interface admin créera automatiquement les indexes nécessaires
   - Ou créer manuellement dans Firebase Console

---

## 📝 Notes importantes

- **Format WebP** : Meilleure compression que JPEG/PNG (30-50% plus petit)
- **3 versions** : Économise la bande passante (serve la bonne taille selon le contexte)
- **Lazy loading** : Charger d'abord les thumbnails, puis medium au scroll
- **CDN Firebase** : Les images sont automatiquement distribuées via CDN global
- **Limite 800 photos** : Configurable dans l'interface admin
