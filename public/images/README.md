# Système d'images 📸

Ce document explique comment ajouter et utiliser des images dans le site.

## Structure des dossiers

```
public/images/
├── hero/             # Images d'en-tête (ratio 5:2, 1920×768px)
├── content/          # Images pour articles (ratio 16:9, 1200×675px)
├── sections/         # Images pour sections (ratio 16:9, 1280×720px)
├── cards/            # Vignettes et cartes (ratio 3:2, 600×400px)
├── team/             # Photos de l'équipe (ratio carré 1:1, 400×400px)
├── messages/         # Images pour les messages/prédications (ratio 16:9)
├── events/           # Images pour les événements (ratio 16:9 ou 3:2)
├── echo/             # Images pour les bulletins (ratio 16:9 ou 3:2)
├── blog/             # Images pour les articles de blog (ratio 16:9)
├── valeurs/          # Images pour la page des valeurs (ratio 16:9)
├── histoire/         # Images pour la page d'histoire (ratio 16:9 ou 3:2)
├── qui-sommes-nous/  # Images pour la section "Qui sommes-nous" (ratio 16:9)
```

## Recommandations par type d'image

### 1. Images d'en-tête (hero)
- **Dimensions recommandées**: 1920×768px
- **Ratio**: 5:2
- **Format**: WebP de préférence, JPG/PNG acceptés
- **Taille de fichier**: 300-500 Ko
- **Utilisation**: Bannières principales, en-têtes

### 2. Images de contenu (content)
- **Dimensions recommandées**: 1200×675px
- **Ratio**: 16:9
- **Format**: WebP de préférence, JPG accepté
- **Taille de fichier**: 200-300 Ko
- **Utilisation**: Articles, témoignages, pages statiques

### 3. Images de section (sections)
- **Dimensions recommandées**: 1280×720px
- **Ratio**: 16:9
- **Format**: WebP de préférence, JPG accepté
- **Taille de fichier**: 250-350 Ko
- **Utilisation**: Sections du site (communauté, louange, etc.)

### 4. Vignettes / Cartes (cards)
- **Dimensions recommandées**: 600×400px
- **Ratio**: 3:2
- **Format**: WebP de préférence, JPG accepté
- **Taille de fichier**: 100-150 Ko
- **Utilisation**: Cartes, vignettes, aperçus

### 5. Photos d'équipe (team)
- **Dimensions recommandées**: 400×400px
- **Ratio**: 1:1 (carré)
- **Format**: WebP de préférence, JPG/PNG acceptés
- **Taille de fichier**: 50-100 Ko
- **Utilisation**: Portraits de l'équipe, profils

### 6. Images de messages (messages)
- **Dimensions recommandées**: 1200×675px
- **Ratio**: 16:9
- **Format**: WebP de préférence, JPG accepté
- **Taille de fichier**: 200-300 Ko
- **Utilisation**: Couverture pour messages et prédications

### 7. Images d'événements (events)
- **Dimensions recommandées**: 1200×675px ou 600×400px
- **Ratio**: 16:9 ou 3:2
- **Format**: WebP de préférence, JPG accepté
- **Taille de fichier**: 100-300 Ko
- **Utilisation**: Visuels pour événements et activités

### 8. Images de bulletins (echo)
- **Dimensions recommandées**: 1200×675px ou 600×400px
- **Ratio**: 16:9 ou 3:2
- **Format**: WebP de préférence, JPG accepté
- **Taille de fichier**: 100-300 Ko
- **Utilisation**: Visuels pour les bulletins d'information "Echo"

### 9. Images d'histoire (histoire)
- **Dimensions recommandées**: 1200×675px ou 800×600px
- **Ratio**: 16:9 ou 4:3
- **Format**: WebP de préférence, JPG accepté
- **Taille de fichier**: 100-300 Ko
- **Utilisation**: Photos historiques, chronologie, rétrospectives

### 10. Images "Qui sommes-nous" (qui-sommes-nous)
- **Dimensions recommandées**: 1280×720px
- **Ratio**: 16:9
- **Format**: WebP de préférence, JPG accepté
- **Taille de fichier**: 200-300 Ko
- **Utilisation**: Présentation de l'église, vision, mission

## Comment ajouter des images

1. Préparez votre image selon les recommandations ci-dessus
2. Convertissez-la en WebP si possible (pour optimiser la performance)
3. Nommez-la de façon descriptive (ex: `louange-groupe-2023.webp`)
4. Placez-la dans le dossier approprié selon son utilisation

## Utilisation dans le code

### Composant ImageBlock

Pour afficher une image optimisée et responsive:

```tsx
import { ImageBlock } from '@/components/ui/image-block'

export default function MaPage() {
  return (
    <div>
      <h1>Titre de la page</h1>
      
      <p>Lorem ipsum dolor sit amet...</p>
      
      <ImageBlock
        type="content"
        src="/images/content/mon-image.webp"
        alt="Description de l'image"
        caption="Légende optionnelle sous l'image"
        credit="Crédit photo: Nom du photographe"
      />
      
      <p>Suite du texte...</p>
    </div>
  )
}
```

### Dans du contenu Markdown/HTML

Lorsque vous utilisez le composant `MarkdownContent`, les images sont automatiquement optimisées:

```tsx
import { MarkdownContent } from '@/components/ui/markdown-content'

const contenuHtml = `
  <h2>Mon article</h2>
  <p>Voici un paragraphe...</p>
  
  <img 
    src="/images/content/mon-image.webp" 
    alt="Description de l'image" 
    title="Légende optionnelle"
    data-type="content"
  />
  
  <p>Suite du texte...</p>
`

export default function Article() {
  return (
    <MarkdownContent content={contenuHtml} isArticle />
  )
}
```

Le type d'image est automatiquement détecté selon le chemin, mais peut être forcé avec l'attribut `data-type`.

## Options disponibles pour ImageBlock

| Prop | Type | Description |
|------|------|-------------|
| `type` | `"hero" \| "content" \| "section" \| "card"` | Type d'image (détermine dimensions et styles) |
| `src` | `string` | Chemin vers l'image |
| `alt` | `string` | Texte alternatif (obligatoire pour l'accessibilité) |
| `caption` | `string` | Légende affichée sous l'image |
| `credit` | `string` | Crédit photo (photographe, source) |
| `width` | `number` | Largeur personnalisée (px) |
| `height` | `number` | Hauteur personnalisée (px) |
| `rounded` | `"none" \| "sm" \| "md" \| "lg" \| "full"` | Niveau d'arrondi des coins |
| `priority` | `boolean` | Priorité de chargement (pour LCP) |
| `quality` | `number` | Qualité de l'image (1-100) |
| `showCredits` | `boolean` | Afficher les crédits dans la légende plutôt que sur l'image |

## Autres composants d'image disponibles

### BaseImage
Composant fondamental pour toutes les images optimisées:

```tsx
import { BaseImage } from '@/components/ui/base-image'

<BaseImage
  src="/images/mon-image.webp"
  alt="Description de l'image"
  width={800}
  height={600}
  fallbackSrc="/images/placeholder.webp"
  rounded="md"
/>
```

### OptimizedImage
Composant avec préréglages pour des cas d'usage spécifiques:

```tsx
import { OptimizedImage } from '@/components/ui/optimized-image'

<OptimizedImage
  src="/images/team/pasteur.webp"
  alt="Portrait du pasteur"
  size="thumbnail"
/>
```

### ChurchImage
Composant spécialisé pour les images d'église avec options de secours:

```tsx
import { ChurchImage } from '@/components/ui/church-image'

<ChurchImage
  src="/images/eglise-facade.webp"
  alt="Façade de l'église"
  size="large"
  unsplashId="abc123" // ID d'image Unsplash utilisée comme secours
/>
```

## Cascade de fallback

Les images utilisent un système de cascade pour gérer les erreurs :

1. **Image principale** : Chargée depuis le chemin spécifié dans `src`
2. **Fallback personnalisé** : Utilisé si l'image principale échoue (prop `fallbackSrc`)
3. **Image Unsplash** : Utilisée comme secours (avec le composant ChurchImage et `unsplashId`)
4. **Placeholder par défaut** : Utilisé en dernier recours (`/placeholder.svg`)

## Bonnes pratiques

- Utilisez toujours l'attribut `alt` pour l'accessibilité
- Respectez les dimensions et ratios recommandés pour une cohérence visuelle
- Optimisez vos images avant de les ajouter (compression, WebP)
- Utilisez des noms de fichiers descriptifs et cohérents
- Pour les images importantes visibles dès le chargement, utilisez `priority={true}`
- Privilégiez le format WebP pour un meilleur équilibre poids/qualité
- Adaptez le niveau de détail et la compression selon l'importance de l'image
- Organisez vos images dans le dossier correspondant à leur usage principal
- Testez le rendu de vos images sur mobile et desktop 