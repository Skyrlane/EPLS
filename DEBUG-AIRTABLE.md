# 🐛 Guide de Debug - Erreur Airtable 400

## 🎯 Objectif

Identifier exactement quel champ cause l'erreur 400 lors de la publication d'un article vers Airtable.

---

## 📋 Procédure de Debug

### Étape 1: Préparer le test

1. **Ouvrir la console du navigateur** (F12)
2. **Aller dans l'onglet "Console"**
3. **Activer "Preserve log"** pour garder tous les logs

### Étape 2: Tenter une publication

1. **Aller sur** `http://localhost:3000/admin/blog` ou `/admin/blog` en prod
2. **Sélectionner un article** à publier
3. **Cliquer sur "Publier"**

### Étape 3: Analyser les logs

Vous allez voir une séquence détaillée de logs :

```javascript
🚀 === DÉBUT PUSH VERS AIRTABLE ===
Article: {
  id: "abc123",
  title: "Mon article",
  slug: "mon-article"
}

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
  ✓ [Passage Biblique] = "Jean 3:16"
  ✓ [Plateforme] = "Site Web EPLS"
  ✓ [Date de Publication] = "2025-01-19"
  ✓ [Ligne Éditoriale] = "Blog EPLS"
  ✓ [ID Firestore] = "abc123"
  ✓ [Nombre de Vues] = 0

📦 === PAYLOAD COMPLET ===
Nombre de champs: 11
Noms des champs: ["Titre", "URL", "Auteur", ...]
Payload JSON: {
  "fields": {
    "Titre": "Mon article",
    "URL": "https://...",
    ...
  }
}

🌐 === REQUÊTE HTTP ===
  Method: POST
  URL: https://api.airtable.com/v0/appSR5QciyUJsgoht/tbl5gJPpg0Z6s6By0
  Headers: { ... }

📡 === RÉPONSE HTTP ===
  Status: 400 Bad Request
  OK: false
```

---

## 🔍 Interpréter l'erreur

### Si erreur 400, vous verrez :

```javascript
❌ === ERREUR AIRTABLE DÉTAILLÉE ===
Status Code: 400
Status Text: Bad Request
Error Data: {
  error: {
    type: "INVALID_REQUEST_UNKNOWN",
    message: "Unknown field name: 'Ligne Éditoriale'"
  }
}
Error Type: INVALID_REQUEST_UNKNOWN
Error Message: Unknown field name: 'Ligne Éditoriale'

⚠️  ERREUR 400 - BAD REQUEST
Cela signifie généralement:
  1. Un nom de colonne est incorrect dans Airtable
  2. Un type de données est incompatible
  3. Un champ requis est manquant

Vérifiez que ces colonnes existent dans Airtable:
  - "Titre"
  - "URL"
  - "Auteur"
  - "Temps de Lecture"
  - "Contenu Complet"
  - "Thème Théologique"
  - "Passage Biblique"
  - "Plateforme"
  - "Date de Publication"
  - "Ligne Éditoriale"
  - "ID Firestore"
  - "Nombre de Vues"
```

---

## 🛠️ Solutions selon le type d'erreur

### Erreur: "Unknown field name: 'X'"

**Problème** : La colonne n'existe pas dans Airtable

**Solution** :
1. Aller sur [airtable.com](https://airtable.com)
2. Ouvrir la base "AI Blog EPLS"
3. Ouvrir la table "Articles Publiés"
4. Créer la colonne manquante avec le **nom EXACT** (respecter majuscules, accents, espaces)

**Exemple** :
- ❌ "ligne éditoriale"
- ❌ "Ligne editoriale"
- ✅ "Ligne Éditoriale"

### Erreur: "Field 'X' cannot accept value 'Y'"

**Problème** : Le type de données est incompatible

**Solution** : Vérifier le type de la colonne dans Airtable

| Colonne | Type requis |
|---------|-------------|
| Titre | Single line text |
| URL | URL |
| Auteur | Single line text |
| Temps de Lecture | Number |
| Contenu Complet | Long text |
| Thème Théologique | Single line text |
| Passage Biblique | Single line text |
| Plateforme | Single line text |
| Date de Publication | Date |
| Ligne Éditoriale | Single line text |
| ID Firestore | Single line text |
| Nombre de Vues | Number |

### Erreur: "Field 'X' is required"

**Problème** : Un champ requis dans Airtable n'est pas envoyé

**Solution** :
1. Vérifier dans Airtable si la colonne est marquée comme "Required"
2. Soit enlever le "Required" dans Airtable
3. Soit s'assurer que le champ est toujours rempli dans le code

---

## ✅ Succès

Quand tout fonctionne, vous verrez :

```javascript
✅ === SUCCÈS ===
Record créé avec succès!
  Record ID: recXXXXXXXXXXXX
  Created Time: 2025-01-19T10:30:00.000Z
```

Et dans Airtable, l'article apparaîtra avec toutes les données !

---

## 📝 Checklist de vérification

- [ ] La clé API est présente dans `.env.local` : `NEXT_PUBLIC_AIRTABLE_API_KEY=pat...`
- [ ] Le Base ID est correct : `appSR5QciyUJsgoht`
- [ ] Toutes les colonnes existent dans Airtable avec les noms EXACTS
- [ ] Les types de colonnes correspondent au tableau ci-dessus
- [ ] Aucune colonne n'est marquée "Required" dans Airtable (sauf si vous êtes sûr qu'elle est toujours remplie)

---

## 🆘 Si le problème persiste

1. **Copier TOUS les logs** de la console
2. **Identifier le message d'erreur exact** d'Airtable
3. **Vérifier le nom de la colonne problématique** dans Airtable
4. **Comparer caractère par caractère** : majuscules, accents, espaces

**Astuce** : Copiez-collez le nom de la colonne depuis les logs vers Airtable pour éviter les erreurs de frappe !

---

## 🔧 Script de test alternatif

Si vous voulez tester la connexion sans publier un article :

```bash
npm run test-airtable
```

Ce script va :
- ✅ Vérifier la connexion
- 📋 Lister les colonnes disponibles dans Airtable
- 🔍 Identifier les colonnes manquantes

---

**Date** : 2025-01-19
**Version** : 1.0
**Auteur** : Claude Code
