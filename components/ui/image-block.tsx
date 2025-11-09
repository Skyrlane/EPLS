"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { useState } from "react"

// Types d'images gérés par le système
export type ImageType = "hero" | "content" | "card" | "avatar" | "thumbnail" | "gallery" | "section"

// Configuration de bloc d'image
export interface ImageBlockProps {
  // Chemin de l'image (relatif à /public ou URL)
  src: string
  // Texte alternatif pour l'accessibilité
  alt: string
  // Type/usage de l'image
  type?: ImageType
  // Classes CSS supplémentaires pour l'image
  className?: string
  // Classes CSS supplémentaires pour le conteneur
  containerClassName?: string
  // Priorité de chargement (pour les éléments visibles dès le chargement)
  priority?: boolean
  // Arrondi des coins (ex: none, sm, md, lg, xl, full)
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "full"
  // Largeur personnalisée (prioritaire sur les préréglages)
  width?: number
  // Hauteur personnalisée (prioritaire sur les préréglages)
  height?: number
  // Objectif d'affichage (comment l'image doit être redimensionnée)
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down"
}

// Préréglages pour les différents types d'images
export const IMAGE_BLOCK_PRESETS = {
  hero: {
    className: "object-cover", 
    containerClassName: "relative", 
    rounded: "none" as const,
  },
  content: {
    className: "object-cover", 
    containerClassName: "relative my-4", 
    rounded: "md" as const,
  },
  card: {
    className: "object-cover", 
    containerClassName: "relative", 
    rounded: "lg" as const,
  },
  thumbnail: {
    className: "object-cover", 
    containerClassName: "relative", 
    rounded: "md" as const,
  },
  avatar: {
    className: "object-cover", 
    containerClassName: "relative", 
    rounded: "full" as const,
  },
  gallery: {
    className: "object-cover transition-transform duration-300 hover:scale-105", 
    containerClassName: "relative", 
    rounded: "lg" as const,
  },
  section: {
    className: "object-cover", 
    containerClassName: "relative", 
    rounded: "lg" as const,
  },
}

// Image de fallback par défaut pour chaque type
const DEFAULT_FALLBACKS = {
  hero: "/images/placeholder/hero-placeholder.jpg",
  content: "/images/placeholder/content-placeholder.jpg",
  card: "/images/placeholder/card-placeholder.jpg",
  avatar: "/images/placeholder/avatar-placeholder.jpg",
  thumbnail: "/images/placeholder/thumbnail-placeholder.jpg",
  gallery: "/images/placeholder/gallery-placeholder.jpg",
  section: "/images/placeholder/section-placeholder.jpg",
}

/**
 * Composant de bloc d'image avec préréglages
 * Facilite l'utilisation cohérente des images sur le site
 */
export function ImageBlock({
  src,
  alt,
  type = "content",
  className,
  containerClassName,
  priority = false,
  rounded,
  width,
  height,
  objectFit,
}: ImageBlockProps) {
  // État pour gérer les erreurs de chargement d'image
  const [imgSrc, setImgSrc] = useState(src);
  const [imgError, setImgError] = useState(false);

  // Récupérer le préréglage correspondant au type
  const preset = IMAGE_BLOCK_PRESETS[type]
  
  // Obtenir la taille de préréglage selon le type
  const presetSize = getImagePresetSize(type)
  
  // Utiliser les dimensions spécifiées ou celles du préréglage
  const finalWidth = width || presetSize.width
  const finalHeight = height || presetSize.height
  
  // Utiliser l'arrondi spécifié ou celui du préréglage
  const finalRounded = rounded || preset.rounded
  const roundedClass = finalRounded !== "none" ? `rounded-${finalRounded}` : ""

  // Fonction pour gérer les erreurs de chargement d'image
  const handleError = () => {
    if (!imgError) {
      // Utiliser l'image de fallback correspondant au type
      setImgSrc(DEFAULT_FALLBACKS[type] || "/images/placeholder.svg");
      setImgError(true);
    }
  };

  return (
    <div className={cn("image-block", preset.containerClassName, containerClassName)}>
      <Image
        src={imgSrc}
        alt={alt}
        width={finalWidth}
        height={finalHeight}
        className={cn(preset.className, roundedClass, className)}
        priority={priority}
        style={{
          objectFit: objectFit || "cover"
        }}
        onError={handleError}
        unoptimized={imgError} // Ne pas optimiser les images de fallback
      />
    </div>
  )
}

/**
 * Détermine les dimensions d'image recommandées selon le type
 */
function getImagePresetSize(type: ImageType): { width: number; height: number } {
  switch (type) {
    case "hero":
      return { width: 1920, height: 780 }
    case "content":
      return { width: 1200, height: 675 } // 16:9
    case "card":
      return { width: 800, height: 600 } // 4:3
    case "thumbnail":
      return { width: 600, height: 600 } // 1:1
    case "avatar":
      return { width: 300, height: 300 } // 1:1
    case "gallery":
      return { width: 900, height: 675 } // 4:3
    case "section":
      return { width: 1260, height: 540 } // 21:9
    default:
      return { width: 800, height: 600 }
  }
} 