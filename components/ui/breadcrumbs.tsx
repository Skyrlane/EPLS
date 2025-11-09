import React from 'react'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface BreadcrumbItem {
  label: string
  href: string
  isCurrent?: boolean
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav className={cn("flex", className)} aria-label="Fil d'Ariane">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground dark:text-slate-300" role="list">
        <li className="flex items-center">
          <Link 
            href="/" 
            className="flex items-center hover:text-foreground dark:hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
            aria-label="Page d'accueil"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Accueil</span>
          </Link>
        </li>
        
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center">
            <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground dark:text-slate-400" aria-hidden="true" />
            {item.isCurrent ? (
              <span className="font-medium text-foreground dark:text-white" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-foreground dark:hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
} 