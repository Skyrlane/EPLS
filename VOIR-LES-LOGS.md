# 🔍 Comment voir les logs dans la console

## ⚠️ Problème résolu

J'ai corrigé le code pour que tous les logs s'affichent dans la console du navigateur.

---

## 📋 Procédure pour voir les logs

### Étape 1: Redémarrer le serveur de développement

```bash
# Arrêter le serveur si il tourne (Ctrl+C)
npm run dev
```

Attendez que le serveur démarre complètement.

### Étape 2: Ouvrir la console du navigateur

1. Ouvrir le navigateur (Chrome, Firefox, Edge, etc.)
2. Appuyer sur **F12** (ou Cmd+Option+I sur Mac)
3. Cliquer sur l'onglet **"Console"**
4. **Important** : Cocher "Preserve log" pour garder tous les logs

![Console](https://i.imgur.com/xyz.png)

### Étape 3: Aller sur la page admin

```
http://localhost:3000/admin/blog
```

### Étape 4: Publier un article

1. Sélectionner un article dans la liste
2. Cliquer sur "Publier" (ou modifier un article et mettre le status sur "Publié")
3. **Regarder la console immédiatement**

---

## 📊 Logs attendus

Vous devriez voir cette séquence dans la console :

```javascript
🚀 handlePublish appelé...
  articleId: "abc123"
  title: "Mon article"
  airtableKey: "patXXXXXXX..."
  airtableBase: "appSR5QciyUJsgoht"

📝 Appel publishArticle du hook...

🎯 === DÉBUT PUBLICATION ARTICLE ===
  Article ID: abc123
  Titre: Mon article
  Scheduled: Non (publication immédiate)

🚀 Synchronisation Airtable...
  articleId: "abc123"
  title: "Mon article"
  syncedBefore: false

➕ Création d'un nouveau record dans Airtable...

🚀 === DÉBUT PUSH VERS AIRTABLE ===
  Article: { id: "abc123", title: "Mon article", slug: "mon-article" }

✅ Configuration Airtable:
  - Clé API: patXXXXXXX...
  - Base ID: appSR5QciyUJsgoht
  - Table ID: tbl5gJPpg0Z6s6By0
  - Table Name: Articles Publiés

📋 === CONSTRUCTION DES CHAMPS ===
  ✓ [Titre] = "Mon article"
  ✓ [URL] = "https://epls.fr/blog/mon-article"
  ✓ [Auteur] = "John Doe"
  ✓ [Temps de Lecture] = 5
  ✓ [Contenu Complet] = "Lorem ipsum..." (1234 caractères)
  ✓ [Thème Théologique] = "Espérance"
  ✓ [Passage Biblique] = ""
  ✓ [Plateforme] = "Site Web EPLS"
  ✓ [Date de Publication] = "2025-01-19"
  ✓ [Ligne Éditoriale] = "Blog EPLS"
  ✓ [ID Firestore] = "abc123"
  ✓ [Nombre de Vues] = 0

📦 === PAYLOAD COMPLET ===
  Nombre de champs: 12
  Noms des champs: ["Titre", "URL", "Auteur", ...]
  Payload JSON: { ... }

🌐 === REQUÊTE HTTP ===
  Method: POST
  URL: https://api.airtable.com/v0/appSR5QciyUJsgoht/tbl5gJPpg0Z6s6By0

📡 === RÉPONSE HTTP ===
  Status: 200 OK ✅
  OK: true

✅ === SUCCÈS ===
  Record créé avec succès!
  Record ID: recXXXXXXXXXXXX
  Created Time: 2025-01-19T...
```

---

## ❌ Si vous voyez une erreur

### Erreur 400 - Bad Request

```javascript
📡 === RÉPONSE HTTP ===
  Status: 400 Bad Request
  OK: false

❌ === ERREUR AIRTABLE DÉTAILLÉE ===
  Error Message: Unknown field name: 'Ligne Éditoriale'
                                      ^^^^^^^^^^^^^^^^^^^
```

**Solution** : Cette colonne n'existe pas dans Airtable !
1. Aller sur [airtable.com](https://airtable.com)
2. Ouvrir la table "Articles Publiés"
3. Créer la colonne "Ligne Éditoriale" (Single line text)

### Erreur 401 - Unauthorized

```javascript
❌ === ERREUR AIRTABLE DÉTAILLÉE ===
  Error Message: Authentication required
```

**Solution** : La clé API est invalide ou manquante
1. Vérifier `.env.local` : `NEXT_PUBLIC_AIRTABLE_API_KEY=pat...`
2. Redémarrer le serveur après modification

### Aucun log ne s'affiche

**Causes possibles** :

1. **Le serveur n'a pas été redémarré**
   ```bash
   # Arrêter avec Ctrl+C puis
   npm run dev
   ```

2. **La console n'est pas sur le bon onglet**
   - Vérifier que vous êtes sur l'onglet "Console" (pas "Network" ou "Elements")

3. **Les logs sont filtrés**
   - Dans la console, vérifier qu'il n'y a pas de filtre actif
   - Effacer le filtre de recherche si présent

4. **Le code ne s'exécute pas**
   - Vérifier qu'il n'y a pas d'erreur JavaScript avant
   - Regarder dans l'onglet "Console" s'il y a des erreurs rouges

---

## 🔧 Vérifications

### Vérifier que le fichier est bien modifié

Ouvrir `hooks/use-article-publish.ts` et vérifier qu'il contient :

```typescript
import { createPublishedArticle, updatePublishedArticle, pushArticleToAirtable } from '@/lib/airtable-client';
```

Et plus bas :

```typescript
const recordId = await pushArticleToAirtable({
  id: articleId,
  title: article.title,
  // ...
});
```

### Vérifier les variables d'environnement

```bash
# Dans .env.local
NEXT_PUBLIC_AIRTABLE_API_KEY=patXXXXXXXXXXXXXXX
NEXT_PUBLIC_AIRTABLE_BASE_ID=appSR5QciyUJsgoht
```

**⚠️ Important** : Redémarrer le serveur après modification du `.env.local` !

---

## 🆘 Si ça ne marche toujours pas

1. **Copier TOUTE la console** (Ctrl+A dans la console, Ctrl+C)
2. **Envoyer les logs** pour analyse
3. **Vérifier les erreurs** dans la console du terminal où tourne `npm run dev`

---

## ✅ Succès

Quand tout fonctionne, vous verrez :

```javascript
✅ === SUCCÈS ===
Record créé avec succès!
  Record ID: recXXXXXXXXXXXX
```

Et l'article apparaîtra dans Airtable ! 🎉

---

**Dernière mise à jour** : 2025-01-19
