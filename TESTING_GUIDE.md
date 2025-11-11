# 🧪 Guide des Tests - EPLS

Ce guide explique comment exécuter les tests unitaires du projet EPLS.

---

## 🚀 Démarrage Rapide

### Lancer TOUS les tests
```bash
npm test
```

### Lancer les tests des hooks Firebase
```bash
npm test -- --testPathPattern="hooks/__tests__"
```

### Mode watch (re-exécution automatique)
```bash
npm run test:watch
```

### Avec couverture de code
```bash
npm run test:coverage
```

---

## 📂 Structure des Tests

```
hooks/
├── __tests__/
│   ├── use-firebase-auth.test.ts    ✅ 21 tests (PASS)
│   ├── use-firestore.test.ts        ✅ 17 tests (PASS)
│   └── use-realtime-collection.test.ts  ⚠️  (Bug à corriger)
│
__mocks__/
├── firebase/
│   ├── auth.ts          # Mocks Firebase Auth
│   ├── firestore.ts     # Mocks Firestore
│   └── config.ts        # Mocks Config Firebase
│
jest.config.js           # Configuration Jest
jest.setup.js            # Setup des tests
```

---

## ✅ Tests par Hook

### 1. `use-firebase-auth` (21 tests)

Teste toutes les fonctionnalités d'authentification :

```bash
npm test -- --testPathPattern="use-firebase-auth"
```

**Fonctions testées :**
- ✓ register (inscription)
- ✓ login (connexion)
- ✓ logout (déconnexion)
- ✓ resetPassword (réinitialisation mot de passe)
- ✓ updateUserProfile (mise à jour profil)
- ✓ updateUserEmail (changement email)
- ✓ updateUserPassword (changement mot de passe)
- ✓ deleteUserAccount (suppression compte)
- ✓ sendVerificationEmail (envoi email vérification)
- ✓ getErrorMessage (traduction erreurs)

**Temps d'exécution :** ~200ms

---

### 2. `use-firestore` (17 tests)

Teste toutes les opérations CRUD Firestore :

```bash
npm test -- --testPathPattern="use-firestore"
```

**Fonctions testées :**
- ✓ getDocument (récupération document unique)
- ✓ getDocuments (récupération multi-documents)
- ✓ setDocument (création/remplacement)
- ✓ addDocument (création avec ID auto)
- ✓ updateDocument (mise à jour partielle)
- ✓ deleteDocument (suppression)
- ✓ subscribeToCollection (abonnement temps réel)
- ✓ createWhereConstraint (helpers de requêtes)
- ✓ createOrderConstraint
- ✓ createLimitConstraint

**Temps d'exécution :** ~150ms

---

### 3. `use-realtime-collection` ⚠️ En cours

**Problème connu :** Boucle infinie dans les tests

⚠️ **NE PAS LANCER** ce test pour le moment (cause timeout)

```bash
# ❌ Ne pas exécuter :
# npm test -- --testPathPattern="use-realtime-collection"
```

**Bug identifié :** `hooks/use-realtime-collection.ts:48`
- Dépendances circulaires dans `useEffect`
- Solution : utiliser `useRef` au lieu de `useState` pour `subscription`

---

## 📊 Rapport de Couverture

### Générer le rapport complet

```bash
npm run test:coverage
```

**Note :** La génération de couverture peut prendre plusieurs minutes et consommer beaucoup de mémoire.

### Lire le rapport

Le rapport HTML est généré dans :
```
coverage/lcov-report/index.html
```

Ouvrez ce fichier dans un navigateur pour voir les détails de couverture ligne par ligne.

---

## 🛠️ Troubleshooting

### Problème : "Out of Memory"

**Symptôme :** Tests crashent avec `FATAL ERROR: ... heap out of memory`

**Solutions :**

1. Lancer les tests un par un :
```bash
npm test -- --testPathPattern="use-firebase-auth" --maxWorkers=1
npm test -- --testPathPattern="use-firestore" --maxWorkers=1
```

2. Augmenter la mémoire Node.js :
```bash
set NODE_OPTIONS=--max-old-space-size=4096
npm test
```

3. Ne pas lancer la couverture (plus rapide) :
```bash
npm test -- --testPathPattern="hooks/__tests__" --watchAll=false
```

---

### Problème : "Cannot find module '@/lib/firebase'"

**Symptôme :** Erreurs d'import dans les tests

**Solution :** Vérifier que `jest.config.js` contient le mapping des alias :

```javascript
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/$1',
}
```

---

### Problème : Tests s'exécutent en boucle

**Symptôme :** Les tests ne se terminent jamais

**Solution :**
- Utiliser `--watchAll=false` pour désactiver le mode watch
- Vérifier qu'il n'y a pas de `console.log` infinis dans les hooks

```bash
npm test -- --watchAll=false --maxWorkers=1
```

---

## 📝 Écrire de Nouveaux Tests

### Template de test pour un hook Firebase

```typescript
import '@testing-library/jest-dom';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useVotreHook } from '../use-votre-hook';

// 1. Mock Firebase
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  // Autres fonctions...
}));

jest.mock('@/lib/firebase', () => ({
  firestore: { type: 'firestore' },
}));

// 2. Import des mocks
import { collection } from 'firebase/firestore';

describe('useVotreHook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait faire quelque chose', async () => {
    // 3. Setup des mocks
    (collection as jest.Mock).mockReturnValue({ path: 'test' });

    // 4. Render du hook
    const { result } = renderHook(() => useVotreHook());

    // 5. Action
    await act(async () => {
      await result.current.votreMethode();
    });

    // 6. Assertions
    expect(result.current.data).toBeDefined();
  });
});
```

---

## 🎯 Objectifs de Couverture

| Composant | Objectif | Actuel |
|-----------|----------|--------|
| Hooks Firebase | 80% | ✅ 75% (38 tests) |
| Composants UI | 70% | 🔄 En cours |
| Utils | 70% | ⏳ À faire |
| Server Actions | 60% | ⏳ À faire |

---

## 📚 Ressources

### Documentation Jest
- [Jest Docs](https://jestjs.io/docs/getting-started)
- [Testing Library React](https://testing-library.com/docs/react-testing-library/intro/)

### Guides Spécifiques EPLS
- `TEST_REPORT.md` - Rapport détaillé des tests
- `CLAUDE.md` - Instructions pour Claude Code
- `tasks.md` - Liste des tâches du projet

---

## 🤝 Contribution

Avant de créer une Pull Request, assurez-vous que :

✅ Tous les tests passent
```bash
npm test -- --watchAll=false
```

✅ Pas d'erreurs TypeScript
```bash
npm run type-check
```

✅ Code formaté
```bash
npm run format
```

---

**Dernière mise à jour** : Novembre 2025
**Maintenu par** : Claude Code 🤖
