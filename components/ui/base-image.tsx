"use client"

import Image from 'next/image'
import { cn } from '@/lib/utils'

// Interface pour les préréglages d'image
export interface ImagePreset {
  /** Largeur de l'image (en px) */
  width: number
  /** Hauteur de l'image (en px) */
  height: number
  /** Classes CSS pour l'image */
  className?: string
  /** Classes CSS pour le conteneur de l'image */
  containerClassName?: string
}

// Préréglages d'image prédéfinis
export const IMAGE_PRESETS: Record<string, ImagePreset> = {
  // Préréglages par défaut
  default: {
    width: 800,
    height: 600,
    className: "w-full",
  },
  // Image de grande taille (type Hero)
  large: {
    width: 1920,
    height: 768,
    className: "w-full",
  },
  // Image de taille moyenne (type Content)
  medium: {
    width: 1200,
    height: 675,
    className: "w-full",
  },
  // Image vignette (type Card)
  thumbnail: {
    width: 600,
    height: 400,
    className: "w-full",
  }
}

// Props de base pour l'image
export interface BaseImageProps {
  /** Source de l'image (URL ou chemin) */
  src: string
  /** Texte alternatif pour l'accessibilité */
  alt: string
  /** Préréglage ou nom de préréglage */
  preset?: ImagePreset | string
  /** Largeur de l'image (remplace celle du préréglage) */
  width?: number
  /** Hauteur de l'image (remplace celle du préréglage) */
  height?: number
  /** Classes CSS supplémentaires pour l'image */
  className?: string
  /** Classes CSS supplémentaires pour le conteneur */
  containerClassName?: string
  /** Charger l'image en priorité (pour les éléments visibles dès le chargement) */
  priority?: boolean
  /** Niveau d'arrondi des coins (ex: "none", "sm", "md", "lg", "xl", "full") */
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "full"
  /** Afficher un placeholder pendant le chargement */
  showPlaceholder?: boolean
  /** Style d'ajustement de l'image */
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down"
  /** Position de l'image */
  objectPosition?: string
  /** Qualité de l'image (1-100) */
  quality?: number
}

/**
 * Composant d'image de base avec optimisation Next.js
 * Utilise des préréglages et gère les proportions, formats et chargements optimisés
 */
export function BaseImage({
  src,
  alt,
  preset: presetProp = "default",
  width,
  height,
  className,
  containerClassName,
  priority = false,
  rounded = "lg",
  showPlaceholder = false,
  objectFit = "cover",
  objectPosition = "center",
  quality = 85,
  ...props
}: BaseImageProps) {
  // Déterminer le préréglage à utiliser
  const preset = typeof presetProp === 'string' 
    ? IMAGE_PRESETS[presetProp] || IMAGE_PRESETS.default
    : presetProp
  
  // Largeur et hauteur finales (props ont priorité sur le préréglage)
  const finalWidth = width || preset.width
  const finalHeight = height || preset.height
  
  // Classes d'arrondi selon le niveau spécifié
  const roundedClasses = rounded !== "none" ? `rounded-${rounded}` : ""
  
  // Classes d'image combinées
  const imageClasses = cn(
    // Classes de base
    "transition-opacity duration-300",
    // Classes d'arrondi
    roundedClasses,
    // Classes du préréglage
    preset.className,
    // Classes personnalisées
    className
  )
  
  // Classes pour le conteneur
  const containerClasses = cn(
    // Conteneur de base
    "relative",
    // Classes du conteneur du préréglage
    preset.containerClassName,
    // Classes personnalisées pour le conteneur
    containerClassName
  )

  // Déterminer les sizes pour le responsive
  const sizes = getSizesByWidth(finalWidth)

  return (
    <div className={containerClasses}>
      <Image
        src={src}
        alt={alt}
        width={finalWidth}
        height={finalHeight}
        className={imageClasses}
        priority={priority}
        placeholder={showPlaceholder ? "blur" : "empty"}
        blurDataURL={showPlaceholder ? "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='100%25' height='100%25' fill='%23f1f5f9'/%3E%3C/svg%3E" : undefined}
        unoptimized={src.startsWith("https://source.unsplash.com/")}
        quality={quality}
        sizes={sizes}
        style={{
          objectFit,
          objectPosition
        }}
        {...props}
      />
    </div>
  )
}

/**
 * Détermine les valeurs de l'attribut sizes en fonction de la largeur de l'image
 */
function getSizesByWidth(width: number): string {
  if (width >= 1600) {
    return "(max-width: 768px) 100vw, (max-width: 1200px) 85vw, 1200px"
  } else if (width >= 1200) {
    return "(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 1000px"
  } else if (width >= 800) {
    return "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
  } else {
    return "(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 500px"
  }
} 