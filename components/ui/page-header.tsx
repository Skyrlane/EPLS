import { cn } from "@/lib/utils";
import React from "react";
import { BreadcrumbItem, Breadcrumbs } from "./breadcrumbs";

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  children?: React.ReactNode;
  className?: string;
  bgColor?: string;
}

/**
 * Composant d'en-tête de page combinant titre, description et fil d'Ariane
 * 
 * @param title - Titre principal de la page
 * @param description - Description optionnelle de la page
 * @param breadcrumbs - Éléments du fil d'Ariane (facultatif)
 * @param children - Contenu supplémentaire
 * @param className - Classes CSS supplémentaires
 * @param bgColor - Couleur de fond personnalisée
 */
export function PageHeader({
  title,
  description,
  breadcrumbs,
  children,
  className,
  bgColor = "bg-slate-100 dark:bg-slate-800"
}: PageHeaderProps) {
  return (
    <div className={cn(bgColor, "py-12 transition-colors duration-300", className)}>
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-4 text-foreground">{title}</h1>
        
        {description && (
          <p className="text-lg text-muted-foreground dark:text-gray-300 max-w-3xl mb-6">
            {description}
          </p>
        )}
        
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} className="mb-4" />}
        
        {children}
      </div>
    </div>
  );
} 