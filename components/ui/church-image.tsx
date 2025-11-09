"use client"

import { UnsplashImage } from "@/components/ui/unsplash-image"
import { BaseImage, type BaseImageProps, type ImagePreset } from "@/components/ui/base-image"

type ChurchImageSize = "small" | "medium" | "large" | "cover"

export interface ChurchImageProps extends Omit<BaseImageProps, 'preset'> {
  /** Taille de l'image d'église */
  size?: ChurchImageSize
  /** ID d'image Unsplash à utiliser comme secours */
  unsplashId?: string
  /** URL de l'image de secours à utiliser si la principale n'est pas disponible */
  fallbackSrc?: string
}

// Définition des préréglages pour ChurchImage
const CHURCH_IMAGE_PRESETS: Record<ChurchImageSize, ImagePreset> = {
  small: {
    className: "w-full object-cover transition-all h-40",
  },
  medium: {
    className: "w-full object-cover transition-all h-64",
  },
  large: {
    className: "w-full object-cover transition-all h-96",
  },
  cover: {
    className: "w-full object-cover transition-all h-[60vh]",
  }
}

/**
 * Composant d'image optimisé pour les églises
 */
export function ChurchImage({
  size = "medium",
  unsplashId,
  className,
  fallbackSrc = "/placeholder.svg",
  ...props
}: ChurchImageProps) {
  // Sélectionner le préréglage en fonction de la taille
  const basePreset = CHURCH_IMAGE_PRESETS[size];
  
  // Créer un préréglage personnalisé en combinant le préréglage de base et les props spécifiques
  const customPreset: ImagePreset = {
    ...basePreset,
    className: className ? `${basePreset.className} ${className}` : basePreset.className,
  };

  // Si un unsplashId est fourni, utiliser UnsplashImage avec fallback
  if (unsplashId) {
    return (
      <UnsplashImage
        unsplashId={unsplashId}
        asBackup={!!props.src}
        preset={customPreset}
        fallbackSrc={fallbackSrc}
        {...props}
      />
    )
  }

  // Sinon, utiliser l'image de base avec une image fallback par défaut
  return (
    <BaseImage
      preset={customPreset}
      fallbackSrc={fallbackSrc}
      {...props}
    />
  )
} 