# 🧪 Test Upload Photos - Instructions MAINTENANT

**Date** : 25 novembre 2025
**Commit** : `4ba23b4` - fix: amélioration debug et messages d'erreur upload photos
**Status** : ✅ Prêt pour tests

---

## 🎯 CE QUI A ÉTÉ CORRIGÉ

### ✅ Améliorations Implémentées

1. **Logs de Preview** : Confirme que la preview est créée avec détails (nom, taille, type)
2. **Logs Étape par Étape** : Chaque étape de l'upload est loggée (génération → Storage → Firestore)
3. **Messages d'Erreur Détaillés** : Au lieu de "3 erreur(s)", affiche les détails de chaque erreur
4. **Détection Type d'Erreur** : Identifie si l'erreur vient de Storage, Firestore ou Canvas
5. **Duration Toast Étendue** : 10 secondes au lieu de 5 pour lire les erreurs

### 📄 Fichiers Modifiés

- `components/admin/PhotoUploader.tsx` (8 modifications)
- `lib/image-utils.ts` (4 modifications)
- `docs/FIX_UPLOAD_PHOTOS.md` (documentation complète)

---

## 🚀 TESTS À FAIRE MAINTENANT

### Prérequis

1. **Ouvrir DevTools** :
   - Chrome/Edge : `F12` ou `Ctrl+Shift+I`
   - Onglet **Console**

2. **Aller sur** : http://localhost:3000/admin/photos
   - Se connecter comme admin si besoin

3. **Vérifier que Firebase est configuré** :
   - Règles Storage appliquées ?
   - Vous êtes bien admin ? (Firestore → `users/{uid}` → `role: "admin"`)

---

## 📋 TEST 1 : Vérifier Preview (2 min)

### Étapes

1. Ouvrir **Console DevTools** (F12)
2. Onglet **"Upload"** dans `/admin/photos`
3. **Glisser 1 image** (JPG, < 5 MB) ou cliquer pour sélectionner
4. **Attendre 1 seconde**

### Résultat Attendu

**Console** :
```
✅ Preview créée: {
  fileName: "ma-photo.jpg",
  fileSize: "2048 KB",
  fileType: "image/jpeg",
  previewUrl: "blob:http://localhost:3000/12345678-..."
}
```

**Visuellement** :
- Preview s'affiche à gauche (petite image 128x128px)
- Bouton ❌ en haut à droite pour supprimer

### Si Preview NE s'affiche PAS

**Vérifier** :
1. La console affiche-t-elle "✅ Preview créée" ?
   - ✅ Oui → Problème d'affichage (CSS ou CSP)
   - ❌ Non → Problème de création blob

2. L'URL blob est-elle valide ?
   - Copier l'URL depuis la console
   - Coller dans la barre d'adresse
   - Si image s'affiche → CSP bloque, sinon → blob corrompu

3. **CSP** :
   - Fichier `next.config.js`
   - Chercher `Content-Security-Policy`
   - Vérifier `img-src 'self' blob: data: https:`

**Si toujours bloqué** :
- Essayer en navigation privée
- Essayer avec autre navigateur (Firefox)
- Copier le message d'erreur console complet

---

## 📋 TEST 2 : Upload Simple (5 min)

### Étapes

1. Avec la photo du TEST 1
2. **Remplir** :
   - Titre : "Test Upload Debug"
   - Description : "Photo de test"
   - Sélectionner 1 tag (ex: "Cultes")
3. **Cliquer "Uploader tout"**
4. **Observer la console** pendant 10-30 secondes

### Résultat Attendu

**Console (exemple)** :
```
📤 ===== UPLOAD 1/1 =====
📄 Fichier: test.jpg (2048 KB)
🔄 Génération des versions d'image...
🖼️ Génération des versions d'image pour: test.jpg
  ✅ Image chargée: 4032x3024
📐 Dimensions originales: { width: 4032, height: 3024, orientation: "landscape" }
  ✅ Blob WebP créé: 380 KB
  ✅ Blob WebP créé: 95 KB
  ✅ Blob WebP créé: 28 KB
✅ Versions générées:
  - Original: 1920x1440 380 KB
  - Medium: 800x600 95 KB
  - Thumbnail: 300x225 28 KB
✅ Versions générées avec succès
☁️ Upload vers Storage (3 fichiers)...
  📤 Upload: gallery/original/photo_1732550000_abc123.webp (380 KB)
  🔗 Récupération URL...
  ✅ URL: https://firebasestorage.googleapis.com/v0/b/...
  (x3 pour medium et thumbnail)
✅ Upload Storage réussi
💾 Création document Firestore...
✅ Photo uploadée: Test Upload Debug
```

**Toast** :
```
✅ Succès
1 photo(s) uploadée(s)
```

**Vérifications** :
- [ ] Console affiche tous les logs ci-dessus
- [ ] Toast de succès apparaît
- [ ] Photo disparaît de la liste d'upload
- [ ] Onglet "Gérer" → photo apparaît dans la liste

### Si Upload ÉCHOUE

**Identifier l'étape qui bloque** :

#### Étape 1 : Génération versions (Canvas)

**Symptôme** : Bloque à "🔄 Génération des versions..."

**Logs à chercher** :
```
❌ Échec chargement image
OU
❌ Échec création blob WebP
```

**Causes possibles** :
1. Image corrompue → Essayer avec autre photo
2. Format non supporté → Vérifier type MIME
3. Canvas non supporté → Mettre à jour navigateur

#### Étape 2 : Upload Storage

**Symptôme** : Bloque à "☁️ Upload vers Storage..."

**Logs à chercher** :
```
❌ Échec upload gallery/original/...
Error: Upload Storage échoué: ...
```

**Causes possibles** :
1. **Règles Storage** → Suivre `docs/FIREBASE_SETUP_GALLERY.md`
   - Console Firebase → Storage → Rules
   - Publier les règles

2. **Pas admin** → Firestore
   - Collection `users` → Votre document (UID)
   - Ajouter/vérifier `role: "admin"`

3. **Quota dépassé** → Console Firebase
   - Storage → Usage
   - Vérifier < 5 GB

#### Étape 3 : Création Firestore

**Symptôme** : Upload Storage OK mais Firestore échoue

**Logs à chercher** :
```
❌ ERREUR UPLOAD test.jpg:
Error: Échec création Firestore (...)
```

**Causes possibles** :
1. **Règles Firestore** → Console Firebase
   - Firestore Database → Rules
   - Publier les règles

2. **Index manquant** → Cliquer sur le lien dans l'erreur
   - Firebase créera l'index automatiquement
   - Attendre 2-5 min

---

## 📋 TEST 3 : Tester Erreur (3 min)

### Objectif

Vérifier que les messages d'erreur sont bien détaillés.

### Étapes

1. **Créer un fichier corrompu** :
   - Créer un fichier texte : `test-corrupt.txt`
   - Écrire "ceci n'est pas une image"
   - Renommer en `test-corrupt.jpg`

2. **Uploader ce fichier**
3. **Observer les logs**

### Résultat Attendu

**Console** :
```
✅ Preview créée: { fileName: "test-corrupt.jpg", ... }

[Clic "Uploader tout"]

📤 ===== UPLOAD 1/1 =====
📄 Fichier: test-corrupt.jpg (25 KB)
🔄 Génération des versions d'image...
🖼️ Génération des versions d'image pour: test-corrupt.jpg
  ❌ Échec chargement image: Event { ... }
❌ ERREUR UPLOAD test-corrupt.jpg: Error: Impossible de charger l'image (format corrompu ?)
❌ Erreurs upload détaillées: ["test-corrupt.jpg: Échec traitement image (Impossible de charger l'image...)"]
```

**Toast** :
```
❌ Erreurs (1 photo(s))
test-corrupt.jpg: Échec traitement image (Impossible de charger l'image...)
```

**Vérifications** :
- [ ] Toast affiche le **nom du fichier**
- [ ] Toast affiche le **type d'erreur** ("Échec traitement image")
- [ ] Toast affiche le **message détaillé**
- [ ] Console affiche "❌ Échec chargement image"

---

## 📋 TEST 4 : Upload Multiple (5 min)

### Étapes

1. Sélectionner **3 photos** :
   - Photo 1 : Image valide (JPG)
   - Photo 2 : Fichier corrompu (du TEST 3)
   - Photo 3 : Image valide (JPG)

2. Remplir les infos pour les 3

3. **Cliquer "Uploader tout"**

### Résultat Attendu

**Console** :
```
📤 ===== UPLOAD 1/3 =====
[... succès ...]
✅ Photo uploadée: Photo 1

📤 ===== UPLOAD 2/3 =====
[... erreur ...]
❌ ERREUR UPLOAD photo2.jpg

📤 ===== UPLOAD 3/3 =====
[... succès ...]
✅ Photo uploadée: Photo 3
```

**Toasts (2 toasts)** :
```
1️⃣ ✅ Succès
2 photo(s) uploadée(s)

2️⃣ ❌ Erreurs (1 photo(s))
photo2.jpg: Échec traitement image (...)
```

**Vérifications** :
- [ ] Photos 1 et 3 uploadées avec succès
- [ ] Photo 2 a échoué avec message détaillé
- [ ] Onglet "Gérer" → 2 photos visibles

---

## 🔍 DIAGNOSTIC RAPIDE

### Problème : Preview ne s'affiche pas

**Checklist** :
- [ ] Console affiche "✅ Preview créée" ?
- [ ] URL blob commence par `blob:http` ?
- [ ] CSP permet `img-src blob:` ?
- [ ] Navigation privée fonctionne ?

### Problème : Upload échoue à "Génération versions"

**Checklist** :
- [ ] Image < 10 MB ?
- [ ] Format JPG/PNG/WebP ?
- [ ] Navigateur récent ?
- [ ] Autre photo fonctionne ?

### Problème : Upload échoue à "Upload Storage"

**Checklist** :
- [ ] Règles Storage appliquées ?
- [ ] Vous êtes admin ?
- [ ] Firebase Quota OK (<5GB) ?
- [ ] Internet OK ?

### Problème : Upload échoue à "Firestore"

**Checklist** :
- [ ] Règles Firestore appliquées ?
- [ ] Index créés ?
- [ ] Collection `gallery_photos` existe ?

---

## 📊 INTERPRÉTATION DES LOGS

### Logs Normaux (Succès)

```
✅ Preview créée              → Preview OK
📤 ===== UPLOAD X/Y =====     → Début upload photo X
🔄 Génération versions...     → Début traitement
  ✅ Image chargée           → Fichier valide
  ✅ Blob WebP créé (x3)     → Conversion réussie
✅ Versions générées          → Traitement OK
☁️ Upload Storage...          → Début upload Firebase
  📤 Upload: gallery/...     → Upload 1/3 fichiers
  ✅ URL: https://...        → URL récupérée
✅ Upload Storage réussi      → 3 fichiers uploadés
💾 Création Firestore...      → Début document
✅ Photo uploadée             → Tout OK !
```

### Logs d'Erreur (Échec Canvas)

```
✅ Preview créée
📤 ===== UPLOAD 1/1 =====
🔄 Génération versions...
  ❌ Échec chargement image   → Fichier corrompu
❌ ERREUR UPLOAD              → Abandon
```

**Action** : Changer de fichier

### Logs d'Erreur (Échec Storage)

```
✅ Preview créée
📤 ===== UPLOAD 1/1 =====
🔄 Génération versions...
✅ Versions générées
☁️ Upload Storage...
  ❌ Échec upload gallery/... → Règles ou admin
❌ ERREUR UPLOAD              → Abandon
```

**Action** : Vérifier règles Firebase

### Logs d'Erreur (Échec Firestore)

```
✅ Preview créée
📤 ===== UPLOAD 1/1 =====
🔄 Génération versions...
✅ Versions générées
☁️ Upload Storage...
✅ Upload Storage réussi       → Storage OK
💾 Création Firestore...
  ❌ Erreur Firestore         → Règles ou index
❌ ERREUR UPLOAD
```

**Action** : Vérifier règles Firestore + index

---

## ✅ CHECKLIST FINALE

### Avant de tester

- [ ] Build réussi (`npm run build`)
- [ ] Dev server lancé (`npm run dev`)
- [ ] Connecté comme admin
- [ ] DevTools Console ouverte
- [ ] Firebase configuré (règles + tags)

### Après TEST 1 (Preview)

- [ ] Preview s'affiche visuellement
- [ ] Console log "✅ Preview créée"
- [ ] Bouton ❌ fonctionne (suppression)

### Après TEST 2 (Upload simple)

- [ ] Tous les logs étape par étape OK
- [ ] Toast succès affiché
- [ ] Photo dans onglet "Gérer"
- [ ] Photo visible sur `/galerie` publique

### Après TEST 3 (Erreur)

- [ ] Message d'erreur détaillé dans toast
- [ ] Nom fichier + type erreur + détail
- [ ] Console log "❌ Échec chargement image"

### Après TEST 4 (Multiple)

- [ ] 2 photos uploadées avec succès
- [ ] 1 photo erreur avec détails
- [ ] 2 toasts (1 succès, 1 erreur)

---

## 🎯 PROCHAINES ÉTAPES

### Si TOUS les tests passent ✅

1. **Upload 10-20 photos réelles**
   - Événements, cultes, bâtiment
   - Marquer 3-5 comme "vedettes"
   - Assigner tags appropriés

2. **Vérifier carousel homepage**
   - Aller sur `/`
   - Section "Nos Moments en Images"
   - Photos vedettes doivent apparaître

3. **Vérifier galerie publique**
   - Aller sur `/galerie`
   - Toutes photos actives visibles
   - Filtrage par tag fonctionne
   - Lightbox fonctionne

4. **Déployer sur Vercel**
   - Commit déjà fait (4ba23b4)
   - Push déjà fait
   - Vérifier dashboard Vercel
   - Tester en production

### Si certains tests échouent ❌

1. **Copier les logs console complets**
   - Tout le bloc depuis "📤 ====="
   - Jusqu'à "❌ ERREUR" ou "✅ Photo uploadée"

2. **Vérifier la configuration**
   - `docs/FIREBASE_SETUP_GALLERY.md`
   - Règles Firestore + Storage
   - Votre rôle admin

3. **Me recontacter avec** :
   - Logs console complets
   - Quel TEST échoue
   - Screenshot de l'erreur toast
   - Règles Firebase actuelles

---

## 📚 Documentation Complète

- **Guide détaillé** : `docs/FIX_UPLOAD_PHOTOS.md`
- **Configuration Firebase** : `docs/FIREBASE_SETUP_GALLERY.md`
- **Synthèse handoff** : `docs/HANDOFF_COMPLETE_SYNTHESIS.md`

---

**Créé le** : 25 novembre 2025
**Commit** : 4ba23b4
**Status** : ✅ Prêt pour tests

🚀 **Bon test ! Les logs devraient maintenant être très clairs sur ce qui se passe.**
