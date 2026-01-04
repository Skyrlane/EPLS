import React from 'react';
import { cn } from '@/lib/utils';

export interface SectionContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  id?: string;
  background?: 'white' | 'light' | 'primary' | 'secondary' | string;
  as?: React.ElementType;
  fullWidth?: boolean;
}

/**
 * Conteneur de section responsive avec prise en charge de différents arrière-plans
 * 
 * @param children - Contenu de la section
 * @param className - Classes CSS supplémentaires
 * @param id - ID HTML pour la section (utile pour les ancres)
 * @param background - Couleur d'arrière-plan prédéfinie ou classe Tailwind
 * @param as - Élément HTML à utiliser (par défaut 'section')
 * @param fullWidth - Si true, la section prend 100% de la largeur sans conteneur intérieur
 * @param props - Autres propriétés HTML div
 */
export function SectionContainer({ 
  children, 
  className, 
  id,
  background = 'white',
  as: Component = 'section',
  fullWidth = false,
  ...props
}: SectionContainerProps) {
  // Gestion des couleurs de fond
  const getBgClass = () => {
    switch (background) {
      case 'white':
        return 'bg-background';
      case 'light':
        return 'bg-muted/50';
      case 'primary':
        return 'bg-primary text-primary-foreground';
      case 'secondary':
        return 'bg-secondary text-secondary-foreground';
      default:
        return background; // Pour permettre une classe Tailwind personnalisee
    }
  };

  return (
    <Component 
      id={id}
      className={cn("py-12 w-full transition-colors duration-300", getBgClass(), className)}
      {...props}
    >
      {fullWidth ? (
        children
      ) : (
        <div className="container px-4 mx-auto">
          {children}
        </div>
      )}
    </Component>
  );
} 