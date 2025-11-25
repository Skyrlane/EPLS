# 🔧 Fix Upload Photos - Debugging Amélioré

**Date** : 25 novembre 2025
**Problème** : Upload photos échoue avec messages d'erreur génériques
**Solution** : Ajout de logs détaillés et messages d'erreur précis

---

## 🎯 Modifications Apportées

### 1. **PhotoUploader.tsx** - Logs de Preview

**Ligne 74-85** : Ajout de logs lors de la création des previews

```typescript
const previewUrl = URL.createObjectURL(file);

// 🔍 DEBUG: Log création preview
console.log('✅ Preview créée:', {
  fileName: file.name,
  fileSize: `${(file.size / 1024).toFixed(0)} KB`,
  fileType: file.type,
  previewUrl: previewUrl.substring(0, 50) + '...'
});
```

**Ce que ça fait** :
- Confirme que la preview est bien créée
- Affiche le nom, la taille et le type du fichier
- Affiche les premiers 50 caractères de l'URL blob

### 2. **PhotoUploader.tsx** - Messages d'Erreur Détaillés

**Ligne 199-212** : Amélioration des toasts d'erreur

```typescript
if (errors.length > 0) {
  console.error('❌ Erreurs upload détaillées:', errors);

  // Afficher les erreurs détaillées (max 3 pour ne pas surcharger)
  const errorSummary = errors.slice(0, 3).join('\n');
  const remainingErrors = errors.length > 3 ? `\n... et ${errors.length - 3} autre(s) erreur(s)` : '';

  toast({
    title: `Erreurs (${errors.length} photo(s))`,
    description: errorSummary + remainingErrors,
    variant: 'destructive',
    duration: 10000 // 10 secondes pour lire les erreurs
  });
}
```

**Ce que ça fait** :
- Affiche jusqu'à 3 erreurs détaillées dans le toast
- Indique s'il y a plus d'erreurs
- Durée de 10s pour avoir le temps de lire
- Log complet dans la console

### 3. **PhotoUploader.tsx** - Logs Étape par Étape

**Lignes 137-156** : Logs pour chaque étape de l'upload

```typescript
console.log(`\n📤 ===== UPLOAD ${i + 1}/${photos.length} =====`);
console.log('📄 Fichier:', photo.file.name, `(${(photo.file.size / 1024).toFixed(0)} KB)`);

// Générer les 3 versions
console.log('🔄 Génération des versions d\'image...');
const { original, medium, thumbnail, originalDimensions } = await generateImageVersions(photo.file);
console.log('✅ Versions générées avec succès');

// Upload vers Storage (3 versions)
console.log('☁️ Upload vers Storage (3 fichiers)...');
// ...
console.log('✅ Upload Storage réussi');

// Créer le document Firestore
console.log('💾 Création document Firestore...');
// ...
```

**Ce que ça fait** :
- Séparateur visuel entre chaque photo
- Log pour chaque étape (génération, upload, firestore)
- Permet d'identifier exactement où ça bloque

### 4. **PhotoUploader.tsx** - Meilleure Gestion d'Erreurs

**Lignes 178-201** : Détection du type d'erreur

```typescript
} catch (error) {
  console.error(`❌ ERREUR UPLOAD ${photo.file.name}:`, error);

  // Créer un message d'erreur détaillé
  let errorMessage = `${photo.file.name}: `;

  if (error instanceof Error) {
    // Détecter le type d'erreur
    if (error.message.includes('storage')) {
      errorMessage += `Échec upload Storage (${error.message})`;
    } else if (error.message.includes('firestore')) {
      errorMessage += `Échec création Firestore (${error.message})`;
    } else if (error.message.includes('canvas') || error.message.includes('blob')) {
      errorMessage += `Échec traitement image (${error.message})`;
    } else {
      errorMessage += error.message;
    }
  } else {
    errorMessage += 'Erreur inconnue';
  }

  errors.push(errorMessage);
}
```

**Ce que ça fait** :
- Identifie si l'erreur vient de Storage, Firestore ou Canvas
- Crée un message d'erreur contextualisé
- Plus facile de comprendre d'où vient le problème

### 5. **PhotoUploader.tsx** - uploadToStorage() Amélioré

**Ligne 216-229** : Logs détaillés pour Storage

```typescript
async function uploadToStorage(blob: Blob, path: string): Promise<string> {
  try {
    const storageRef = ref(storage, path);

    console.log(`  📤 Upload: ${path} (${(blob.size / 1024).toFixed(0)} KB)`);
    await uploadBytes(storageRef, blob);

    console.log(`  🔗 Récupération URL...`);
    const url = await getDownloadURL(storageRef);

    console.log(`  ✅ URL: ${url.substring(0, 60)}...`);
    return url;
  } catch (error) {
    console.error(`  ❌ Échec upload ${path}:`, error);
    throw new Error(`Upload Storage échoué: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
}
```

**Ce que ça fait** :
- Log du chemin et de la taille avant upload
- Log de la récupération de l'URL
- Try/catch avec message d'erreur personnalisé

### 6. **image-utils.ts** - loadImage() Amélioré

**Lignes 27-37** : Logs de chargement d'image

```typescript
img.onload = () => {
  console.log('  ✅ Image chargée:', `${img.width}x${img.height}`);
  URL.revokeObjectURL(url);
  resolve(img);
};

img.onerror = (error) => {
  console.error('  ❌ Échec chargement image:', error);
  URL.revokeObjectURL(url);
  reject(new Error(`Impossible de charger l'image (format corrompu ?)`));
};
```

**Ce que ça fait** :
- Affiche les dimensions de l'image chargée
- Message d'erreur plus explicite si échec

### 7. **image-utils.ts** - resizeImage() Amélioré

**Lignes 95-104** : Logs de conversion WebP

```typescript
canvas.toBlob(
  (blob) => {
    if (blob) {
      console.log(`  ✅ Blob WebP créé: ${(blob.size / 1024).toFixed(0)} KB`);
      resolve(blob);
    } else {
      console.error('  ❌ Échec création blob WebP');
      reject(new Error('Impossible de créer le blob WebP (navigateur non compatible ?)'));
    }
  },
  'image/webp',
  quality
);
```

**Ce que ça fait** :
- Confirme la taille du blob WebP créé
- Indique si le navigateur ne supporte pas WebP

### 8. **image-utils.ts** - Vérification Canvas Context

**Lignes 82-86** : Message d'erreur amélioré

```typescript
const ctx = canvas.getContext('2d');
if (!ctx) {
  console.error('  ❌ Échec création contexte Canvas 2D');
  throw new Error('Impossible de créer le contexte canvas (problème navigateur ?)');
}
```

**Ce que ça fait** :
- Détecte si Canvas 2D n'est pas supporté
- Message d'erreur plus explicite

---

## 🧪 Tests à Effectuer

### Test 1 : Vérifier les Previews

1. Ouvrir la console navigateur (F12)
2. Aller sur `/admin/photos`
3. Glisser 1 image (JPG, < 5 MB)
4. **Vérifier dans la console** :
   ```
   ✅ Preview créée: {
     fileName: "photo.jpg",
     fileSize: "1234 KB",
     fileType: "image/jpeg",
     previewUrl: "blob:http://localhost:3000/..."
   }
   ```
5. **Vérifier visuellement** : La preview doit s'afficher à gauche du formulaire

**Si la preview ne s'affiche pas** :
- Vérifier la CSP (Content Security Policy)
- Vérifier les règles CORS
- Vérifier l'URL blob dans la console

### Test 2 : Upload Simple

1. Avec la photo du Test 1
2. Remplir titre + sélectionner 1 tag
3. Cliquer "Uploader tout"
4. **Observer la console** : Doit afficher :
   ```
   📤 ===== UPLOAD 1/1 =====
   📄 Fichier: photo.jpg (1234 KB)
   🔄 Génération des versions d'image...
     ✅ Image chargée: 2048x1536
     ✅ Blob WebP créé: 450 KB
     ✅ Blob WebP créé: 120 KB
     ✅ Blob WebP créé: 30 KB
   ✅ Versions générées avec succès
   ☁️ Upload vers Storage (3 fichiers)...
     📤 Upload: gallery/original/... (450 KB)
     🔗 Récupération URL...
     ✅ URL: https://firebasestorage...
   (x3 pour les 3 versions)
   ✅ Upload Storage réussi
   💾 Création document Firestore...
   ✅ Photo uploadée: photo
   ```

5. **Vérifier le toast** : "Succès - 1 photo(s) uploadée(s)"

### Test 3 : Upload avec Erreur

1. Essayer d'uploader une image corrompue (ou créer un fichier .txt renommé en .jpg)
2. **Observer la console** : Doit afficher :
   ```
   ❌ ERREUR UPLOAD fichier.jpg:
   Error: Impossible de charger l'image (format corrompu ?)
   ```
3. **Vérifier le toast** : Doit afficher :
   ```
   Erreurs (1 photo(s))
   fichier.jpg: Échec traitement image (Impossible de charger l'image...)
   ```

### Test 4 : Upload Multiple avec Erreurs Mixtes

1. Uploader 3 photos :
   - Photo 1 : Image valide
   - Photo 2 : Fichier corrompu
   - Photo 3 : Image valide
2. **Résultat attendu** :
   - Toast succès : "1 photo(s) uploadée(s)" (après les 3 tentatives)
   - Toast erreur : Affiche les détails de la photo 2

---

## 🔍 Diagnostic des Erreurs Courantes

### Erreur : "Failed to load resource"

**Symptôme** : Preview ne s'affiche pas, erreur dans Network tab

**Causes possibles** :
1. **CSP bloquant les blob URLs**
   - Solution : Vérifier `next.config.js` → CSP doit inclure `img-src 'self' blob: data:`
2. **Fichier corrompu**
   - Solution : Essayer avec une autre image

### Erreur : "Upload Storage échoué"

**Symptôme** : Versions générées mais upload Firebase échoue

**Causes possibles** :
1. **Règles Storage non appliquées**
   - Solution : Suivre `docs/FIREBASE_SETUP_GALLERY.md`
2. **Pas admin**
   - Solution : Firestore → `users/{uid}` → ajouter `role: "admin"`
3. **Quota Storage dépassé**
   - Solution : Vérifier Firebase Console → Storage Usage

### Erreur : "Échec traitement image"

**Symptôme** : Échec lors de la génération des versions

**Causes possibles** :
1. **Canvas 2D non supporté**
   - Solution : Mettre à jour le navigateur
2. **Image trop grande** (> 10000px)
   - Solution : Redimensionner l'image avant upload
3. **Format WebP non supporté**
   - Solution : Utiliser Chrome/Edge/Firefox récent

### Erreur : "Échec création Firestore"

**Symptôme** : Upload Storage réussit mais Firestore échoue

**Causes possibles** :
1. **Règles Firestore non appliquées**
   - Solution : Suivre `docs/FIREBASE_SETUP_GALLERY.md`
2. **Index manquant**
   - Solution : Cliquer sur le lien d'erreur Firebase (création auto)

---

## 📊 Logs Console Attendus (Exemple Complet)

### Upload Réussi :

```
✅ Preview créée: { fileName: "culte-2024.jpg", fileSize: "2048 KB", ... }

[Clic "Uploader tout"]

📤 ===== UPLOAD 1/1 =====
📄 Fichier: culte-2024.jpg (2048 KB)
🔄 Génération des versions d'image...
🖼️ Génération des versions d'image pour: culte-2024.jpg
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
  📤 Upload: gallery/medium/photo_1732550000_abc123.webp (95 KB)
  🔗 Récupération URL...
  ✅ URL: https://firebasestorage.googleapis.com/v0/b/...
  📤 Upload: gallery/thumbnail/photo_1732550000_abc123.webp (28 KB)
  🔗 Récupération URL...
  ✅ URL: https://firebasestorage.googleapis.com/v0/b/...
✅ Upload Storage réussi
💾 Création document Firestore...
✅ Photo uploadée: Culte de Noël 2024
```

**Toast** : ✅ Succès - 1 photo(s) uploadée(s)

### Upload Échoué :

```
✅ Preview créée: { fileName: "corrupt.jpg", ... }

[Clic "Uploader tout"]

📤 ===== UPLOAD 1/1 =====
📄 Fichier: corrupt.jpg (150 KB)
🔄 Génération des versions d'image...
🖼️ Génération des versions d'image pour: corrupt.jpg
  ❌ Échec chargement image: Event { ... }
❌ ERREUR UPLOAD corrupt.jpg: Error: Impossible de charger l'image (format corrompu ?)
❌ Erreurs upload détaillées: ["corrupt.jpg: Échec traitement image (Impossible de charger l'image...)"]
```

**Toast** : ❌ Erreurs (1 photo(s)) - corrupt.jpg: Échec traitement image (Impossible de charger l'image...)

---

## ✅ Prochaines Étapes

1. **Build et test local** :
   ```bash
   npm run build
   npm run dev
   ```

2. **Tester les 4 scénarios** ci-dessus

3. **Si tout fonctionne** :
   - Commit + push
   - Déployer sur Vercel
   - Uploader 10-20 photos réelles

4. **Si problème persiste** :
   - Copier les logs console complets
   - Vérifier règles Firebase
   - Vérifier CSP `next.config.js`

---

## 📝 Récapitulatif des Changements

**Fichiers modifiés** : 2
- `components/admin/PhotoUploader.tsx` (8 modifications)
- `lib/image-utils.ts` (4 modifications)

**Lignes ajoutées** : ~80 lignes de logs et gestion d'erreurs

**Avantages** :
- ✅ Diagnostic précis des erreurs
- ✅ Visibilité sur chaque étape
- ✅ Messages utilisateur clairs
- ✅ Debug facilité pour futures erreurs

---

**Créé le** : 25 novembre 2025
**Auteur** : Claude Code
**Status** : ✅ Prêt pour tests
