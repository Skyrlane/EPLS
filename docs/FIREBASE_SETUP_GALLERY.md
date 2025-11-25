# 🔥 Configuration Firebase pour la Galerie Photos

**⚠️ IMPORTANT : Ces étapes sont OBLIGATOIRES pour que la galerie fonctionne**

## 📋 Checklist Rapide

- [ ] Règles Firestore appliquées
- [ ] Règles Storage appliquées
- [ ] Tags par défaut créés (script seed)
- [ ] Indexes Firestore créés (automatique ou manuel)

---

## 🔐 ÉTAPE 1 : Règles Firestore (5 min)

### Accès Console Firebase

1. Aller sur https://console.firebase.google.com
2. Sélectionner votre projet EPLS
3. Menu latéral → **Firestore Database**
4. Onglet **Rules** (en haut)

### Règles à appliquer

**⚠️ REMPLACER tout le contenu existant par :**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ========================================
    // RÈGLES GALERIE PHOTOS
    // ========================================

    // Collection: gallery_photos
    match /gallery_photos/{photoId} {
      // Lecture publique des photos actives uniquement
      allow read: if resource.data.isActive == true;

      // Écriture admin seulement
      allow create: if request.auth != null &&
                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';

      allow update: if request.auth != null &&
                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';

      allow delete: if request.auth != null &&
                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Collection: gallery_tags
    match /gallery_tags/{tagId} {
      // Lecture publique
      allow read: if true;

      // Écriture admin seulement
      allow write: if request.auth != null &&
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // ========================================
    // RÈGLES EXISTANTES (conserver ci-dessous)
    // ========================================

    // Vos autres règles pour users, events, messages, etc.
    // NE PAS SUPPRIMER LES RÈGLES EXISTANTES !
  }
}
```

### Publier les règles

5. Cliquer sur **Publier** (bouton bleu en haut à droite)
6. Attendre la confirmation (10-30 secondes)
7. Vérifier le statut : "Published" avec horodatage

### ✅ Vérification

Tester dans la console navigateur (DevTools) :

```javascript
// Test lecture photos actives (doit réussir)
firebase.firestore().collection('gallery_photos')
  .where('isActive', '==', true)
  .get()
  .then(snap => console.log('✅ Lecture OK:', snap.size, 'photos'))
  .catch(err => console.error('❌ Erreur:', err));

// Test écriture sans auth (doit échouer)
firebase.firestore().collection('gallery_photos')
  .add({ test: true })
  .then(() => console.log('❌ BUG: Écriture réussie sans auth !'))
  .catch(() => console.log('✅ Écriture bloquée (normal)'));
```

---

## 📦 ÉTAPE 2 : Règles Storage (5 min)

### Accès Console Firebase

1. Toujours sur https://console.firebase.google.com
2. Menu latéral → **Storage**
3. Onglet **Rules** (en haut)

### Règles à appliquer

**⚠️ REMPLACER tout le contenu existant par :**

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    // ========================================
    // RÈGLES GALERIE PHOTOS
    // ========================================

    match /gallery/{folder}/{photoId} {
      // Lecture publique (CDN)
      allow read: if true;

      // Écriture admin seulement
      allow write: if request.auth != null &&
                      firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';

      // Validation lors de la création
      allow create: if request.resource.size < 10 * 1024 * 1024 &&  // Max 10 MB
                       request.resource.contentType.matches('image/.*');
    }

    // ========================================
    // RÈGLES EXISTANTES (conserver ci-dessous)
    // ========================================

    // Vos autres règles Storage si existantes
    // NE PAS SUPPRIMER !
  }
}
```

### Publier les règles

4. Cliquer sur **Publier**
5. Attendre la confirmation
6. Vérifier le statut

### ✅ Vérification

Tester l'upload via l'interface admin :

1. Aller sur http://localhost:3000/admin/photos (en tant qu'admin)
2. Onglet "Upload"
3. Glisser une image de test
4. Cliquer "Télécharger"
5. **Doit réussir** ✅

Si erreur "Permission denied" → vérifier que :
- Vous êtes bien connecté comme admin
- Votre user Firestore a `role: "admin"`
- Les règles sont bien publiées

---

## 🏷️ ÉTAPE 3 : Créer les Tags par défaut (2 min)

### Option A : Via Script (Recommandé)

```bash
# Depuis la racine du projet
npx tsx scripts/seed-gallery-tags.ts
```

**Output attendu :**
```
🌱 Démarrage du seeding des tags galerie...

✅ Tag créé: Cultes (slug: cultes, couleur: #3B82F6)
✅ Tag créé: Événements (slug: evenements, couleur: #10B981)
✅ Tag créé: Jeunesse (slug: jeunesse, couleur: #F59E0B)
✅ Tag créé: Baptêmes (slug: baptemes, couleur: #8B5CF6)
✅ Tag créé: Mariages (slug: mariages, couleur: #EC4899)
✅ Tag créé: Bâtiment (slug: batiment, couleur: #6B7280)
✅ Tag créé: Équipe (slug: equipe, couleur: #06B6D4)

🎉 Seeding terminé !
📊 Résumé: 7 créés, 0 ignorés
```

### Option B : Via Interface Admin

1. Aller sur http://localhost:3000/admin/photos
2. Onglet "Tags"
3. Créer manuellement les 7 tags :

| Nom | Couleur |
|-----|---------|
| Cultes | #3B82F6 |
| Événements | #10B981 |
| Jeunesse | #F59E0B |
| Baptêmes | #8B5CF6 |
| Mariages | #EC4899 |
| Bâtiment | #6B7280 |
| Équipe | #06B6D4 |

### ✅ Vérification

- Console Firebase → Firestore → Collection `gallery_tags`
- Doit afficher 7 documents
- Interface admin → Onglet Tags → doit lister 7 tags avec couleurs

---

## 📊 ÉTAPE 4 : Index Firestore (Automatique)

Les index Firestore seront créés **automatiquement** lors de la première utilisation.

### Processus automatique

1. Démarrer l'app : `npm run dev`
2. Aller sur http://localhost:3000/admin/photos
3. Si erreur "Index required" dans la console :
   - Firestore affichera un **lien direct**
   - Cliquer sur ce lien
   - Firebase créera l'index automatiquement
4. Attendre 2-5 minutes (vous recevrez un email)
5. Recharger la page

### Index requis (pour référence)

**Index 1 : Liste photos admin**
```
Collection: gallery_photos
Champs:
  - isActive (Ascending)
  - order (Ascending)
  - createdAt (Descending)
Query scope: Collection
```

**Index 2 : Photos vedettes (carousel)**
```
Collection: gallery_photos
Champs:
  - isActive (Ascending)
  - isFeatured (Ascending)
  - order (Ascending)
Query scope: Collection
```

**Index 3 : Filtrage par tags**
```
Collection: gallery_photos
Champs:
  - tags (Array Contains)
  - isActive (Ascending)
  - order (Ascending)
Query scope: Collection
```

### Création manuelle (si nécessaire)

Si le processus automatique échoue :

1. Console Firebase → Firestore Database → **Indexes**
2. Cliquer "Create Index"
3. Remplir selon les specs ci-dessus
4. Créer
5. Attendre 2-5 minutes

---

## 🧪 ÉTAPE 5 : Tests de Validation (10 min)

### Test 1 : Upload Photo

1. http://localhost:3000/admin/photos
2. Onglet "Upload"
3. Glisser 1 image (< 10 MB)
4. Remplir titre et description
5. Sélectionner 1-2 tags
6. Cliquer "Télécharger"
7. **Doit afficher "Upload réussi" ✅**

**Vérifier dans Firebase** :
- Storage → `gallery/original/` → doit contenir 1 fichier .webp
- Storage → `gallery/medium/` → doit contenir 1 fichier .webp
- Storage → `gallery/thumbnail/` → doit contenir 1 fichier .webp
- Firestore → `gallery_photos` → doit contenir 1 document

### Test 2 : Galerie Publique

1. http://localhost:3000/galerie
2. **Doit afficher la photo uploadée ✅**
3. Cliquer sur la photo
4. **Lightbox doit s'ouvrir ✅**
5. Tester navigation ← →
6. Tester zoom (molette souris)
7. Tester fullscreen (icône en haut à droite)

### Test 3 : Filtrage Tags

1. Toujours sur /galerie
2. Barre latérale → sélectionner un tag
3. **Galerie doit filtrer ✅**
4. Désélectionner → toutes photos réapparaissent

### Test 4 : Gestion Admin

1. http://localhost:3000/admin/photos
2. Onglet "Gérer"
3. **Liste doit afficher la photo ✅**
4. Cliquer sur switch "Actif" → photo disparaît de /galerie
5. Recliquer → photo réapparaît
6. Cliquer sur étoile ⭐ → devient vedette
7. Cliquer sur 🗑️ → confirmation → suppression
8. **Photo doit disparaître partout ✅**

### Test 5 : Carousel Homepage (après intégration)

1. http://localhost:3000
2. Scroller jusqu'à section galerie
3. **Carousel doit afficher photos vedettes ✅**
4. Auto-play doit fonctionner (change toutes les 4s)
5. Survoler → pause
6. Sortir → reprend
7. Cliquer boutons ← → → navigation manuelle

---

## 🚨 Troubleshooting

### Erreur : "Permission denied" lors de l'upload

**Causes possibles** :
1. Règles Storage pas appliquées
2. Utilisateur pas admin
3. Image > 10 MB

**Solutions** :
- Vérifier règles Storage publiées
- Console Firebase → Firestore → `users/{uid}` → ajouter `role: "admin"`
- Réduire taille image

### Erreur : "Index required"

**Normal !** C'est le processus automatique.

**Solution** :
- Cliquer sur le lien fourni dans l'erreur
- Attendre 2-5 minutes
- Recharger

### Erreur : Photos ne s'affichent pas dans /galerie

**Causes possibles** :
1. Photo `isActive: false`
2. Règles Firestore bloquent lecture
3. Délai propagation CDN

**Solutions** :
- Admin → Gérer → vérifier switch "Actif" activé
- Vérifier règles Firestore publiées
- Attendre 30 secondes

### Erreur : "Failed to resize image"

**Causes possibles** :
1. Format image non supporté
2. Image corrompue
3. Dimensions > 10000px

**Solutions** :
- Utiliser JPEG, PNG ou WebP uniquement
- Essayer autre image
- Réduire dimensions

---

## ✅ Checklist Finale

Avant de considérer la galerie fonctionnelle :

- [ ] Règles Firestore appliquées et testées
- [ ] Règles Storage appliquées et testées
- [ ] 7 tags créés et visibles dans admin
- [ ] Index Firestore créés (automatique ou manuel)
- [ ] Upload 1 photo réussit
- [ ] Photo visible dans /galerie
- [ ] Lightbox fonctionne
- [ ] Filtrage tags fonctionne
- [ ] Toggle actif/inactif fonctionne
- [ ] Suppression photo fonctionne
- [ ] Carousel homepage affiche photos vedettes (après intégration)

---

## 📚 Ressources

- **Documentation Firebase Firestore** : https://firebase.google.com/docs/firestore
- **Documentation Firebase Storage** : https://firebase.google.com/docs/storage
- **Structure complète galerie** : `docs/firebase-gallery-structure.md`
- **Synthèse handoff** : `docs/HANDOFF_COMPLETE_SYNTHESIS.md`

---

**🎉 Configuration terminée !**

Passez à l'étape suivante : **Intégration carousel homepage**
