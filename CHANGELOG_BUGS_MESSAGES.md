# 🐛 Correction des bugs critiques - Messages

**Date** : 23 novembre 2025
**Ticket** : Correction de 2 bugs critiques dans le système de messages

---

## 🎯 Problèmes identifiés

### Bug #1 : Erreur lors de la création de message
**Erreur** : `Function addDoc() called with invalid data. Unsupported field value: undefined`

**Cause** : Firestore n'accepte pas les valeurs `undefined` dans les documents. Le code envoyait des champs comme `coverImageUrl: undefined` et `duration: undefined`.

### Bug #2 : Suppression incomplète
**Comportement** :
- Le message disparaît de la page d'accueil ✅
- Mais reste visible sur `/messages` ❌

**Cause** : La page `/messages` est un Server Component qui ne se rafraîchit pas automatiquement après suppression.

---

## ✅ Corrections apportées

### 1. Nouvelle fonction utilitaire pour nettoyer les `undefined`

**Fichier créé** : `lib/firestore-utils.ts`

```typescript
export function cleanFirestoreData<T extends Record<string, any>>(obj: T): Partial<T> {
  const cleaned: Record<string, any> = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      // Ne pas inclure les valeurs undefined
      if (value !== undefined) {
        cleaned[key] = value;
      }
    }
  }

  return cleaned as Partial<T>;
}
```

**Usage** : Filtre automatiquement tous les champs `undefined` d'un objet avant de l'envoyer à Firestore.

---

### 2. Correction de la création/mise à jour de message

**Fichier modifié** : `components/admin/MessageForm.tsx`

**Changements** :
1. Import de la fonction utilitaire :
   ```typescript
   import { cleanFirestoreData } from '@/lib/firestore-utils';
   ```

2. Nettoyage des données avant envoi à Firestore :
   ```typescript
   // Construire l'objet data brut (peut contenir des undefined)
   const rawData = {
     title: title.trim(),
     description: description.trim(),
     youtubeUrl: youtubeUrl.trim(),
     youtubeId,
     embedUrl,
     thumbnailUrl,
     coverImageUrl,              // ← Pas de "|| undefined"
     duration: metadata?.duration,   // ← Pas de "|| undefined"
     date: Timestamp.fromDate(messageDate),
     pastor: pastor.trim(),
     tag,
     tagColor,
     isActive,
     status,
     views: message?.views || 0,
     updatedAt: Timestamp.now()
   };

   // Nettoyer les champs undefined (Firestore ne les accepte pas)
   const data = cleanFirestoreData(rawData);
   ```

3. Application du nettoyage pour la création ET la mise à jour :
   ```typescript
   if (message) {
     // Mise à jour
     const docRef = doc(firestore, 'messages', message.id);
     await updateDoc(docRef, data);
   } else {
     // Création
     const createData = cleanFirestoreData({
       ...rawData,
       createdAt: Timestamp.now()
     });
     await addDoc(collection(firestore, 'messages'), createData);
   }
   ```

---

### 3. Server Action pour la suppression avec revalidation

**Fichier créé** : `app/admin/messages/actions.ts`

```typescript
'use server';

import { revalidatePath } from 'next/cache';
import { doc, deleteDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';

export async function deleteMessage(messageId: string) {
  try {
    // Supprimer le document Firestore
    await deleteDoc(doc(firestore, 'messages', messageId));

    // Forcer le rafraîchissement des pages qui affichent les messages
    revalidatePath('/messages');        // Page liste des messages
    revalidatePath('/');                 // Homepage qui affiche le dernier message

    return { success: true };
  } catch (error) {
    console.error('Erreur suppression message:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
}
```

**Fonctionnement** :
- Supprime le document de Firestore
- Appelle `revalidatePath('/messages')` pour forcer Next.js à regénérer la page `/messages`
- Appelle `revalidatePath('/')` pour forcer la régénération de la homepage
- Les pages se rafraîchissent automatiquement avec les données à jour

---

### 4. Mise à jour de la page admin

**Fichier modifié** : `app/admin/messages/page.tsx`

**Changements** :
1. Import de la Server Action :
   ```typescript
   import { deleteMessage } from './actions';
   ```

2. Modification de `handleDelete` pour utiliser la Server Action :
   ```typescript
   const handleDelete = async (id: string) => {
     try {
       const result = await deleteMessage(id);

       if (result.success) {
         toast({ title: 'Succès', description: 'Message supprimé avec succès' });
         await loadMessages();
       } else {
         throw new Error(result.error || 'Erreur inconnue');
       }
     } catch (error) {
       console.error('Erreur suppression:', error);
       toast({
         title: 'Erreur',
         description: error instanceof Error ? error.message : 'Erreur lors de la suppression',
         variant: 'destructive',
       });
     } finally {
       setDeleteId(null);
     }
   };
   ```

---

## 🧪 Tests effectués

### Build Next.js
```bash
npm run build
```
**Résultat** : ✅ `Compiled successfully`

### Vérification des champs
- ✅ Aucune trace de `coverImageId` (champ invalide mentionné dans l'erreur)
- ✅ Type `MessageItem` correct avec `coverImageUrl` (optionnel)

---

## 📊 Impact des changements

### Avant (Bugs)
- ❌ Impossible de créer un message sans miniature personnalisée
- ❌ Impossible de créer un message sans durée YouTube
- ❌ Messages supprimés restent visibles sur `/messages`

### Après (Corrections)
- ✅ Création de message fonctionne avec champs optionnels
- ✅ Mise à jour de message fonctionne correctement
- ✅ Suppression de message met à jour toutes les pages automatiquement
- ✅ Aucune valeur `undefined` envoyée à Firestore

---

## 🚀 Prochaines étapes

### Pour tester en production :

1. **Déployer sur Vercel** :
   ```bash
   git add .
   git commit -m "fix: corriger bugs création et suppression messages"
   git push
   ```

2. **Tester la création** :
   - Aller sur `/admin/messages`
   - Créer un message avec seulement les champs requis (sans miniature personnalisée)
   - Vérifier qu'il n'y a pas d'erreur `undefined`

3. **Tester la mise à jour** :
   - Modifier un message existant
   - Vérifier la sauvegarde

4. **Tester la suppression** :
   - Supprimer un message
   - Vérifier qu'il disparaît de `/messages` ET de la homepage
   - Rafraîchir `/messages` pour confirmer

---

## 📝 Fichiers modifiés

### Nouveaux fichiers
- ✅ `lib/firestore-utils.ts` (fonction utilitaire)
- ✅ `app/admin/messages/actions.ts` (Server Action suppression)
- ✅ `CHANGELOG_BUGS_MESSAGES.md` (ce fichier)

### Fichiers modifiés
- ✅ `components/admin/MessageForm.tsx` (nettoyage undefined)
- ✅ `app/admin/messages/page.tsx` (utilisation Server Action)

---

## 🎓 Concepts techniques utilisés

1. **Firestore data validation** : Filtrage des valeurs `undefined`
2. **Next.js Server Actions** : Actions serveur pour opérations sensibles
3. **ISR Revalidation** : `revalidatePath()` pour rafraîchir le cache
4. **Type safety** : TypeScript générique pour `cleanFirestoreData`

---

**Développé avec ❤️ par Claude Code**
**Version Sonnet 4.5**
