"use client"

import { BaseImage, type BaseImageProps, type ImagePreset } from '@/components/ui/base-image';

type OptimizedImageSize = "thumbnail" | "card" | "banner" | "fullwidth"

export interface OptimizedImageProps extends Omit<BaseImageProps, 'preset'> {
  /** Taille prédéfinie de l'image */
  size?: OptimizedImageSize
}

// Définition des préréglages pour OptimizedImage
const OPTIMIZED_IMAGE_PRESETS: Record<OptimizedImageSize, ImagePreset> = {
  thumbnail: {
    width: 150,
    height: 150,
    className: "aspect-square object-cover rounded-full",
    containerClassName: "relative overflow-hidden",
  },
  card: {
    width: 350,
    height: 200,
    className: "aspect-video object-cover rounded-md",
    containerClassName: "relative",
  },
  banner: {
    width: 1200,
    height: 400,
    className: "w-full aspect-[3/1] object-cover",
    containerClassName: "relative",
  },
  fullwidth: {
    width: 1920,
    height: 1080,
    className: "w-full object-contain",
    containerClassName: "relative",
  }
}

/**
 * Composant OptimizedImage
 * Version spécialisée avec des préréglages de taille pour les cas d'usage communs
 * Utilise BaseImage comme fondation
 */
export function OptimizedImage({
  size,
  className,
  containerClassName,
  width,
  height,
  ...props
}: OptimizedImageProps) {
  // Sélectionner le préréglage en fonction de la taille
  const basePreset = size ? OPTIMIZED_IMAGE_PRESETS[size] : null;
  
  // Créer un préréglage personnalisé en combinant le préréglage de base et les props spécifiques
  const customPreset: ImagePreset | undefined = basePreset
    ? {
        ...basePreset,
        width: width || basePreset.width,
        height: height || basePreset.height,
        className: className ? `${basePreset.className} ${className}` : basePreset.className,
        containerClassName: containerClassName 
          ? `${basePreset.containerClassName} ${containerClassName}` 
          : basePreset.containerClassName,
      }
    : undefined;

  return (
    <BaseImage
      width={width || 800}
      height={height || 600}
      className={className}
      containerClassName={containerClassName}
      preset={customPreset}
      {...props}
    />
  );
} 