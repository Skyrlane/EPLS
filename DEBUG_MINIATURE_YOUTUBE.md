# 🔍 Guide de diagnostic - Miniature YouTube

**Date** : 23 novembre 2025  
**Problème** : La miniature YouTube ne s'affiche pas sur la page d'accueil

---

## 🎯 Modifications apportées

### 1. ✅ Logs de diagnostic détaillés

**Fichier** : `app/page.tsx`

Des logs ont été ajoutés pour diagnostiquer exactement quelle miniature est chargée depuis Firestore :

```typescript
console.log('📸 Miniatures disponibles dans Firestore:');
console.log('  - coverImageUrl:', data.coverImageUrl || '❌ NON DÉFINI');
console.log('  - thumbnailUrl:', data.thumbnailUrl || '❌ NON DÉFINI');
console.log('  - youtubeUrl:', data.youtubeUrl || '❌ NON DÉFINI');
console.log('  - youtubeId:', data.youtubeId || '❌ NON DÉFINI');
```

### 2. ✅ Génération automatique (fallback)

Si `coverImageUrl` et `thumbnailUrl` ne sont pas définis dans Firestore, le code génère automatiquement l'URL de la miniature YouTube :

**Priorité 1** : Si `youtubeId` est présent
```typescript
thumbnailUrl = `https://img.youtube.com/vi/${data.youtubeId}/maxresdefault.jpg`;
```

**Priorité 2** : Si seulement `youtubeUrl` est présent
```typescript
const youtubeIdMatch = data.youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?\/]+)/);
if (youtubeIdMatch && youtubeIdMatch[1]) {
  thumbnailUrl = `https://img.youtube.com/vi/${youtubeIdMatch[1]}/maxresdefault.jpg`;
}
```

### 3. ✅ Logs dans le formulaire admin

**Fichier** : `components/admin/MessageForm.tsx`

Des logs ont été ajoutés lors de la sauvegarde d'un message :

```typescript
console.log('💾 === SAUVEGARDE MESSAGE ===');
console.log('  - youtubeId:', youtubeId);
console.log('  - thumbnailUrl:', thumbnailUrl);
console.log('  - coverImageUrl:', coverImageUrl || 'NON DÉFINI');
```

---

## 🧪 Tests à effectuer

### Étape 1 : Vérifier les logs sur la page d'accueil

1. **Attendre que le déploiement Vercel soit terminé** (2-3 minutes)
2. **Aller sur la page d'accueil** de votre site
3. **Ouvrir la console du navigateur** (F12 → Console)
4. **Rafraîchir la page** (Ctrl+R ou Cmd+R)
5. **Chercher les logs** suivants :

```
🎥 === CHARGEMENT DERNIER MESSAGE (Page d'accueil) ===
✅ Dernier message trouvé: { id: "...", title: "...", pastor: "...", date: "..." }
📸 Miniatures disponibles dans Firestore:
  - coverImageUrl: ❌ NON DÉFINI (ou URL si défini)
  - thumbnailUrl: ❌ NON DÉFINI (ou URL si défini)
  - youtubeUrl: https://youtu.be/cNRlzD32FxeJ3sr+J48YwDMrB9PXeAVl
  - youtubeId: cNRlzD32FxeJ3sr+J48YwDMrB9PXeAVl
🔧 Miniature YouTube générée depuis youtubeId: https://img.youtube.com/vi/.../maxresdefault.jpg
🖼️ Miniature finale utilisée: https://img.youtube.com/vi/.../maxresdefault.jpg
```

### Étape 2 : Interpréter les logs

#### Scénario A : `thumbnailUrl` est défini ✅

```
  - thumbnailUrl: https://img.youtube.com/vi/cNRlzD32FxeJ3sr+J48YwDMrB9PXeAVl/maxresdefault.jpg
```

**Signification** : Le champ existe dans Firestore  
**Action** : La miniature devrait s'afficher. Si elle ne s'affiche pas, vérifier :
- Que l'URL est correcte (ouvrir l'URL dans un nouvel onglet)
- Qu'il n'y a pas d'erreur de chargement d'image (onglet Network dans DevTools)

#### Scénario B : `thumbnailUrl` est ❌ NON DÉFINI

```
  - thumbnailUrl: ❌ NON DÉFINI
  - youtubeId: cNRlzD32FxeJ3sr+J48YwDMrB9PXeAVl
🔧 Miniature YouTube générée depuis youtubeId: https://img.youtube.com/vi/.../maxresdefault.jpg
```

**Signification** : Le champ manque dans Firestore, mais la génération fallback fonctionne  
**Action** : 
1. Vérifier si la miniature s'affiche maintenant avec le fallback
2. **Rééditer le message** pour que `thumbnailUrl` soit enregistré en base de données

#### Scénario C : `youtubeId` ET `thumbnailUrl` sont ❌ NON DÉFINIS

```
  - thumbnailUrl: ❌ NON DÉFINI
  - youtubeId: ❌ NON DÉFINI
  - youtubeUrl: https://youtu.be/...
🔧 Miniature YouTube générée depuis youtubeUrl: https://img.youtube.com/vi/.../maxresdefault.jpg
```

**Signification** : Extraction depuis `youtubeUrl` utilisée  
**Action** : **Rééditer le message** pour que tous les champs soient corrects

### Étape 3 : Rééditer le message si nécessaire

Si `thumbnailUrl` manque dans Firestore :

1. **Aller sur** `/admin/messages`
2. **Se connecter** si nécessaire
3. **Cliquer sur "Modifier"** (icône crayon) pour le message
4. **Ne rien changer**, juste cliquer sur **"Mettre à jour"**
5. Vérifier les logs dans la console :
   ```
   💾 === SAUVEGARDE MESSAGE ===
     - youtubeId: cNRlzD32FxeJ3sr+J48YwDMrB9PXeAVl
     - thumbnailUrl: https://img.youtube.com/vi/.../maxresdefault.jpg
     - coverImageUrl: NON DÉFINI (ou URL si uploadée)
   ```
6. **Retourner sur la page d'accueil** et **rafraîchir**
7. La miniature devrait maintenant s'afficher ! ✨

---

## 🛠️ Résolution des problèmes courants

### Problème 1 : URL YouTube invalide

**Symptôme** :
```
  - youtubeUrl: https://youtu.be/cNRlzD32FxeJ3sr+J48YwDMrB9PXeAVl
  - youtubeId: ❌ NON DÉFINI
🖼️ Miniature finale utilisée: ❌ AUCUNE
```

**Cause** : L'URL YouTube contient des caractères spéciaux ou est malformée

**Solution** :
1. Copier l'URL YouTube correcte depuis le navigateur
2. Format attendu : `https://www.youtube.com/watch?v=VIDEO_ID` ou `https://youtu.be/VIDEO_ID`
3. Rééditer le message avec la bonne URL

### Problème 2 : Miniature maxresdefault inexistante

**Symptôme** : La miniature ne se charge pas (erreur 404)

**Cause** : Certaines vidéos YouTube n'ont pas de miniature en haute résolution (`maxresdefault`)

**Solution** : Le code utilise déjà `maxresdefault` par défaut. YouTube fournit automatiquement une miniature de remplacement si elle n'existe pas.

Si le problème persiste, modifier manuellement dans `app/page.tsx` ligne ~365 :
```typescript
// Changer de maxresdefault à hqdefault
thumbnailUrl = `https://img.youtube.com/vi/${data.youtubeId}/hqdefault.jpg`;
```

### Problème 3 : Image cassée même avec URL correcte

**Symptôme** : L'URL de la miniature est correcte dans les logs, mais l'image est cassée

**Vérifications** :
1. **Ouvrir l'URL** dans un nouvel onglet pour vérifier qu'elle fonctionne
2. **Vérifier la console Network** (F12 → Network) pour voir si le chargement échoue
3. **Vider le cache** du navigateur (Ctrl+Shift+R)
4. **Vérifier les CSP** (Content Security Policy) dans les headers HTTP

---

## 📝 Structure du document Firestore attendue

Voici comment le document `messages/{messageId}` devrait être structuré dans Firestore :

```json
{
  "title": "Pourquoi 90% des Freelances IA RESTENT PAUVRES...",
  "description": "Description du message",
  "youtubeUrl": "https://youtu.be/cNRlzD32FxeJ3sr+J48YwDMrB9PXeAVl",
  "youtubeId": "cNRlzD32FxeJ3sr+J48YwDMrB9PXeAVl",
  "embedUrl": "https://www.youtube.com/embed/cNRlzD32FxeJ3sr+J48YwDMrB9PXeAVl",
  "thumbnailUrl": "https://img.youtube.com/vi/cNRlzD32FxeJ3sr+J48YwDMrB9PXeAVl/maxresdefault.jpg",
  "coverImageUrl": null,  // ou URL d'une miniature uploadée
  "pastor": "Samuel Test",
  "date": Timestamp,  // Firestore Timestamp
  "tag": "Foi",
  "tagColor": "#3B82F6",
  "status": "published",
  "isActive": true,
  "createdAt": Timestamp,
  "updatedAt": Timestamp
}
```

### Champs pour la miniature (par ordre de priorité)

1. **`coverImageUrl`** ⭐ (Haute priorité)
   - Miniature personnalisée uploadée par l'utilisateur
   - Utilisée en premier si elle existe

2. **`thumbnailUrl`** (Priorité normale)
   - Miniature YouTube générée automatiquement
   - Format : `https://img.youtube.com/vi/{youtubeId}/maxresdefault.jpg`

3. **Génération fallback** (Si les 2 premiers manquent)
   - Générée automatiquement depuis `youtubeId` ou `youtubeUrl`
   - Ne persiste pas en base, recalculée à chaque chargement

---

## ✅ Checklist de vérification

- [ ] Déploiement Vercel terminé
- [ ] Page d'accueil ouverte avec console (F12)
- [ ] Logs `📸 Miniatures disponibles` visibles
- [ ] `youtubeId` est défini dans les logs
- [ ] `thumbnailUrl` est généré (fallback ou depuis Firestore)
- [ ] `🖼️ Miniature finale utilisée` affiche une URL valide
- [ ] Miniature s'affiche sur la page d'accueil
- [ ] Si miniature manque : message réédité dans `/admin/messages`
- [ ] Logs `💾 === SAUVEGARDE MESSAGE ===` visibles après sauvegarde
- [ ] `thumbnailUrl` enregistré dans Firestore

---

## 🚀 Résumé

### Ce qui a été fait
- ✅ Logs de diagnostic détaillés ajoutés
- ✅ Génération fallback automatique de la miniature
- ✅ Logs dans le formulaire admin
- ✅ Build Next.js réussi
- ✅ Code déployé sur Vercel

### Ce qu'il faut faire
1. **Attendre 2-3 minutes** que Vercel déploie
2. **Ouvrir la console** (F12) sur la page d'accueil
3. **Analyser les logs** pour identifier le problème
4. **Rééditer le message** si `thumbnailUrl` manque dans Firestore
5. La miniature devrait s'afficher ! 🎉

---

**Développé avec ❤️ par Claude Code**  
**Version Sonnet 4.5**
