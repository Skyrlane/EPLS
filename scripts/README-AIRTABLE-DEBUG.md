# Guide de Debug Airtable - Erreur 400

## 🎯 Objectif

Ce guide vous aide à résoudre l'erreur 400 lors de la synchronisation avec Airtable "Articles Publiés".

## 📋 Diagnostic

### Étape 1: Exécuter le script de test

```bash
npm run test-airtable
```

Ce script va :
1. ✅ Vérifier la connexion à Airtable
2. 📋 Lister les colonnes disponibles dans votre table
3. 🔍 Comparer avec les colonnes configurées dans le code
4. ⚠️ Identifier les colonnes manquantes ou mal nommées
5. 🧪 Tester la création d'un record minimal

### Étape 2: Analyser les résultats

Le script affichera :

```
📝 Colonnes disponibles dans Airtable:
  - "Auteur"
  - "Contenu Complet"
  - "Date de Publication"
  - ...

🔧 Colonnes configurées dans le code:
  - "Auteur"
  - "Contenu Complet"
  - "Date de Publication"
  - ...

🔍 Vérification des correspondances:
⚠️  Colonnes manquantes dans Airtable:
  ❌ "Ligne Éditoriale"  ← Cette colonne est dans le code mais pas dans Airtable!
```

### Étape 3: Corriger les colonnes

Si des colonnes sont manquantes dans Airtable :

1. **Aller sur Airtable.com**
2. **Ouvrir la table "Articles Publiés"**
3. **Créer les colonnes manquantes** avec les **noms EXACTS** :
   - `Ligne Éditoriale` (type: Single line text)
   - `Temps de Lecture` (type: Number)
   - `Nombre de Vues` (type: Number)
   - etc.

**⚠️ IMPORTANT** :
- Respectez les **majuscules**, **accents** et **espaces** !
- "Ligne Éditoriale" ≠ "ligne éditoriale" ≠ "Ligne editoriale"

### Étape 4: Vérifier les types de champs

| Colonne | Type Airtable |
|---------|---------------|
| Titre | Single line text |
| Auteur | Single line text |
| URL | URL |
| Contenu Complet | Long text |
| Thème Théologique | Single line text |
| Passage Biblique | Single line text |
| Plateforme | Single line text |
| Date de Publication | Date |
| ID Firestore | Single line text |
| Temps de Lecture | Number |
| Nombre de Vues | Number |
| Ligne Éditoriale | Single line text |

## 🐛 Debug en direct

### Publier un article avec logs détaillés

1. **Ouvrir la console navigateur** (F12)
2. **Aller sur** `/admin/blog`
3. **Publier un article**
4. **Observer les logs** :

```javascript
⚙️ Configuration Airtable:
  baseId: "appSR5QciyUJsgoht"
  tableId: "tbl5gJPpg0Z6s6By0"
  tableName: "Articles Publiés"

🔑 Mapping des colonnes:
  {
    titre: "Titre",
    url: "URL",
    contenu: "Contenu Complet",
    ...
  }

📦 Données préparées pour Airtable:
  {
    "Titre": "Mon article",
    "URL": "https://epls.fr/blog/mon-article",
    ...
  }

📡 Réponse Airtable:
  status: 400
  statusText: "Bad Request"

❌ ERREUR AIRTABLE DÉTAILLÉE:
  {
    error: {
      type: "INVALID_REQUEST_UNKNOWN",
      message: "Unknown field name: 'Ligne Éditoriale'"
    }
  }
```

Le message d'erreur vous dira **exactement** quelle colonne pose problème !

## 🔧 Solutions aux erreurs courantes

### Erreur: "Unknown field name: 'X'"

**Problème** : La colonne n'existe pas dans Airtable
**Solution** : Créer la colonne dans Airtable avec le nom exact

### Erreur: "Field 'X' cannot accept value 'Y'"

**Problème** : Type de données incompatible
**Solution** : Vérifier le type du champ dans Airtable

### Erreur: "Field 'X' is required"

**Problème** : Une colonne requise n'est pas envoyée
**Solution** : S'assurer que la valeur n'est pas `undefined` ou `null`

## 📝 Modification de la configuration

Si vous voulez changer les noms de colonnes dans le code :

**Fichier** : `lib/airtable-client.ts`

```typescript
const AIRTABLE_CONFIG = {
  // ...
  tables: {
    published: {
      columns: {
        titre: "Titre",  // ← Nom de la colonne dans Airtable
        url: "URL",
        // ... modifier ici
      }
    }
  }
};
```

## ✅ Test réussi

Quand tout fonctionne, vous verrez :

```
✅ Article pushé vers Airtable avec succès!
  recordId: "recXXXXXXXXXXXX"
  createdTime: "2025-01-19T..."
```

Et dans Airtable, l'article apparaîtra avec toutes les données remplies !

## 🆘 Besoin d'aide ?

1. Lancer `npm run test-airtable`
2. Copier les logs
3. Vérifier les noms de colonnes dans Airtable
4. Créer les colonnes manquantes

**Astuce** : Créez un record manuellement dans Airtable pour voir quelles colonnes sont disponibles.
