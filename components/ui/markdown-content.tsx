"use client"

import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { ImageBlock } from '@/components/ui/image-block'

interface MarkdownContentProps {
  /** Contenu HTML ou Markdown parsé en HTML */
  content: string
  /** Classes CSS supplémentaires */
  className?: string
  /** Activer le mode article (marges et styles améliorés) */
  isArticle?: boolean
  /** Ajouter des classes à toutes les images */
  imageClassName?: string
}

/**
 * Composant MarkdownContent
 * Affiche du contenu Markdown ou HTML avec style prose de Tailwind
 * et enrichissement pour les images.
 */
export function MarkdownContent({
  content,
  className,
  isArticle = false,
  imageClassName,
}: MarkdownContentProps) {
  // Enrichir le contenu HTML pour les images
  const processedContent = useMemo(() => {
    if (!content) return ''
    
    // Utiliser une div temporaire pour parser le HTML
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = content
    
    // Traiter toutes les images pour les remplacer par notre composant optimisé
    const imgElements = tempDiv.querySelectorAll('img')
    
    imgElements.forEach((img) => {
      const src = img.getAttribute('src') || ''
      const alt = img.getAttribute('alt') || ''
      const title = img.getAttribute('title') || ''
      const width = img.getAttribute('width') ? parseInt(img.getAttribute('width') || '0', 10) : undefined
      const height = img.getAttribute('height') ? parseInt(img.getAttribute('height') || '0', 10) : undefined
      
      // Déterminer le type d'image en fonction des attributs ou du chemin
      let type = img.getAttribute('data-type') || 'content'
      
      // Vérifier si l'image est de type hero, section ou card via son chemin
      if (src.includes('/hero/') || src.includes('-hero')) {
        type = 'hero'
      } else if (src.includes('/sections/')) {
        type = 'section'
      } else if (src.includes('/cards/')) {
        type = 'card'
      }
      
      // Créer un wrapper pour l'image optimisée
      const figure = document.createElement('figure')
      figure.className = 'markdown-image-wrapper my-6'
      
      // Créer un nœud pour le placeholder de ImageBlock
      // Ce sera remplacé côté client par le vrai composant
      const imageBlockPlaceholder = document.createElement('div')
      imageBlockPlaceholder.className = cn('image-block-placeholder', imageClassName)
      imageBlockPlaceholder.setAttribute('data-src', src)
      imageBlockPlaceholder.setAttribute('data-alt', alt)
      imageBlockPlaceholder.setAttribute('data-type', type)
      
      // Ajouter les attributs supplémentaires si disponibles
      if (title) imageBlockPlaceholder.setAttribute('data-caption', title)
      if (width) imageBlockPlaceholder.setAttribute('data-width', width.toString())
      if (height) imageBlockPlaceholder.setAttribute('data-height', height.toString())
      
      // Créer l'image standard comme fallback
      const standardImg = document.createElement('img')
      standardImg.src = src
      standardImg.alt = alt
      standardImg.className = cn('rounded-lg mx-auto', imageClassName)
      if (width) standardImg.width = width
      if (height) standardImg.height = height
      
      // Ajouter l'image au placeholder
      imageBlockPlaceholder.appendChild(standardImg)
      
      // Ajouter la légende si présente
      if (title) {
        const figcaption = document.createElement('figcaption')
        figcaption.className = 'text-center text-sm text-muted-foreground mt-2'
        figcaption.textContent = title
        figure.appendChild(imageBlockPlaceholder)
        figure.appendChild(figcaption)
      } else {
        figure.appendChild(imageBlockPlaceholder)
      }
      
      // Remplacer l'image originale par notre figure
      img.parentNode?.replaceChild(figure, img)
    })
    
    return tempDiv.innerHTML
  }, [content, imageClassName])
  
  // Côté client, remplacer les placeholders par des vrais ImageBlock
  useMemo(() => {
    if (typeof window === 'undefined') return
    
    // Attendre que le DOM soit chargé
    setTimeout(() => {
      const placeholders = document.querySelectorAll('.image-block-placeholder')
      
      placeholders.forEach((placeholder) => {
        const element = placeholder as HTMLElement
        const src = element.getAttribute('data-src') || ''
        const alt = element.getAttribute('data-alt') || ''
        const type = element.getAttribute('data-type') as any || 'content'
        const caption = element.getAttribute('data-caption') || ''
        const width = element.getAttribute('data-width') ? parseInt(element.getAttribute('data-width') || '0', 10) : undefined
        const height = element.getAttribute('data-height') ? parseInt(element.getAttribute('data-height') || '0', 10) : undefined
        
        // Créer le vrai composant ImageBlock
        const imageBlockContainer = document.createElement('div')
        imageBlockContainer.className = 'image-block-container'
        
        // Utiliser une render prop ou hydration pour le composant React serait mieux
        // Mais pour la simplicité, nous mettons en place l'élément div avec les attributs nécessaires
        // qui sera traité par l'hydrateur de React
        
        imageBlockContainer.innerHTML = `
          <div 
            class="optimized-image ${type}" 
            data-src="${src}" 
            data-alt="${alt}" 
            data-caption="${caption}"
            style="
              position: relative;
              overflow: hidden;
              border-radius: 0.5rem;
              margin: 1.5rem auto;
              max-width: 100%;
              aspect-ratio: ${type === 'hero' ? '5/2' : type === 'content' || type === 'section' ? '16/9' : '3/2'};
            "
          >
            <img 
              src="${src}" 
              alt="${alt}" 
              class="object-cover w-full h-full rounded-lg"
              width="${width || ''}" 
              height="${height || ''}"
            />
            ${caption ? `<figcaption class="mt-2 text-center text-sm text-muted-foreground">${caption}</figcaption>` : ''}
          </div>
        `
        
        // Remplacer le placeholder par le vrai composant
        element.parentNode?.replaceChild(imageBlockContainer, element)
      })
    }, 100)
  }, [processedContent])
  
  return (
    <div 
      className={cn(
        'prose prose-slate max-w-none dark:prose-invert prose-headings:font-bold',
        'prose-img:rounded-lg prose-img:mx-auto prose-img:my-8',
        isArticle && 'prose-lg',
        className
      )}
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  )
} 