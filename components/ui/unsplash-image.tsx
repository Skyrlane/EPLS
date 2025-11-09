"use client"

import { useState, useEffect } from "react"
import { BaseImage, type BaseImageProps } from "@/components/ui/base-image"

interface UnsplashImageProps extends BaseImageProps {
  /** ID d'image Unsplash */
  unsplashId: string
  /** Utiliser l'image Unsplash comme fallback uniquement */
  asBackup?: boolean 
  fallbackSrc?: string
}

/**
 * Composant UnsplashImage
 * Utilise directement les images d'Unsplash via leur API
 */
export function UnsplashImage({
  unsplashId,
  asBackup = false,
  src: providedSrc,
  fallbackSrc = "/placeholder.svg",
  ...props
}: UnsplashImageProps) {
  // Générer l'URL Unsplash avec une dimension spécifique pour éviter le redimensionnement aléatoire
  const unsplashUrl = `https://source.unsplash.com/${unsplashId}/1200x800`
  
  // Utiliser l'URL Unsplash directement ou comme fallback
  const [src, setSrc] = useState(asBackup && providedSrc ? providedSrc : unsplashUrl)
  const [hasError, setHasError] = useState(false)

  // Si le src change, mettre à jour
  useEffect(() => {
    if (asBackup && providedSrc) {
      setSrc(providedSrc)
      setHasError(false)
    }
  }, [providedSrc, asBackup])

  // Gestion d'erreur pour basculer sur Unsplash si nécessaire
  const handleError = () => {
    if (asBackup && !hasError) {
      console.log(`Basculement vers l'image Unsplash (ID: ${unsplashId})`)
      setSrc(unsplashUrl)
      setHasError(true)
    } else if (hasError) {
      // Si l'image Unsplash échoue également, utiliser le fallback final
      console.error(`L'image Unsplash a échoué, utilisation du fallback: ${fallbackSrc}`)
    }
    
    // Appeler le gestionnaire d'erreur externe si fourni
    if (props.onError) {
      props.onError()
    }
  }

  return (
    <BaseImage
      src={src}
      onError={handleError}
      fallbackSrc={fallbackSrc}
      {...props}
    />
  )
} 