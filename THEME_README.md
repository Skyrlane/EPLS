# Guide du mode jour/nuit (Dark Mode)

Ce document explique comment utiliser et personnaliser le système de thème clair/sombre dans l'application.

## 🌗 Fonctionnalités

- **Basculement thème clair/sombre** : Permutation intuitive entre les modes avec animation de transition
- **Préférences système** : Synchronisation automatique avec le thème du système d'exploitation
- **Persistance** : Sauvegarde des préférences utilisateur via local storage
- **Accessibilité** : Implémentation respectant les normes WCAG
- **Transitions fluides** : Animations douces entre les modes

## 🧩 Composants disponibles

### 1. ThemeToggle - Menu déroulant complet

```jsx
import { ThemeToggle } from "@/components/theme-toggle";

export default function MyComponent() {
  return (
    <div>
      <ThemeToggle />
    </div>
  );
}
```

Ce composant affiche un menu déroulant avec options Clair, Sombre et Système.

### 2. ThemeSwitch - Bouton simple

```jsx
import { ThemeSwitch } from "@/components/theme-switch";

export default function MyComponent() {
  return (
    <div>
      <ThemeSwitch />
    </div>
  );
}
```

Ce composant affiche un bouton simple qui bascule directement entre les modes clair et sombre.

## 🪝 Utilisation du hook personnalisé

```jsx
import { useTheme } from "@/hooks/use-theme";

export default function MyComponent() {
  const { 
    theme,          // Le thème actuel ('light', 'dark', 'system')
    setTheme,       // Fonction pour définir le thème
    isDark,         // Boolean: si le thème actuel est sombre
    isLight,        // Boolean: si le thème actuel est clair
    toggleTheme,    // Fonction pour basculer entre clair et sombre
    mounted,        // Boolean: si le composant est monté (pour éviter l'hydratation)
    resolvedTheme   // Le thème résolu (si theme est 'system', renvoie 'light' ou 'dark')
  } = useTheme();
  
  // Exemple d'utilisation
  if (!mounted) return null; // Éviter les problèmes d'hydratation
  
  return (
    <div>
      <p>Thème actuel : {theme}</p>
      <button onClick={toggleTheme}>
        Passer en mode {isDark ? "clair" : "sombre"}
      </button>
      <button onClick={() => setTheme("system")}>
        Utiliser le thème système
      </button>
    </div>
  );
}
```

## 🎨 Styles conditionnels basés sur le thème

### 1. Avec les utilitaires

```jsx
import { themeClasses, darkMode } from "@/lib/theme-utils";

export default function MyComponent() {
  return (
    <div className={themeClasses(
      "p-4 rounded", // Classes de base
      "bg-white text-black", // Classes en mode clair
      "bg-gray-900 text-white" // Classes en mode sombre
    )}>
      <h1 className={darkMode("text-black", "text-white")}>
        Titre adapté au thème
      </h1>
    </div>
  );
}
```

### 2. Directement avec Tailwind

Tailwind CSS supporte nativement le préfixe `dark:` pour appliquer des styles en mode sombre :

```jsx
export default function MyComponent() {
  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white">
      Contenu avec styles adaptés
    </div>
  );
}
```

## 🧠 Bonnes pratiques

1. **Éviter l'effet de clignotement** : Utilisez toujours la vérification `mounted` pour éviter les problèmes d'hydratation.

2. **Contraste adéquat** : Assurez-vous que les couleurs choisies pour les deux modes respectent les ratios de contraste WCAG.

3. **Cohérence** : Maintenez une expérience cohérente entre les modes clair et sombre.

4. **Images adaptatives** : Utilisez des images différentes ou ajustez leur luminosité/contraste selon le mode :

```jsx
<img 
  src={isDark ? "/dark-logo.png" : "/light-logo.png"} 
  alt="Logo" 
  className="dark:brightness-90 dark:contrast-105"
/>
```

5. **États interactifs** : N'oubliez pas d'adapter les états hover, focus et active dans les deux modes.

## 🔧 Personnalisation

Vous pouvez personnaliser les couleurs du thème dans `app/globals.css` en modifiant les variables CSS :

```css
:root {
  /* Variables du mode clair */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  /* ... */
}

.dark {
  /* Variables du mode sombre */
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... */
}
``` 