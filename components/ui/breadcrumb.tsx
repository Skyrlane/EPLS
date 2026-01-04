import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

// Types pour les éléments du fil d'Ariane
export interface BreadcrumbLink {
  href: string;
  label: string;
}

interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  segments: BreadcrumbLink[];
  separator?: React.ReactNode;
  homeLink?: BreadcrumbLink;
  currentPage: string;
}

interface BreadcrumbItemProps extends React.HTMLAttributes<HTMLLIElement> {
  isLast?: boolean;
}

interface BreadcrumbLinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href: string;
  isActive?: boolean;
}

export function Breadcrumb({
  segments = [],
  separator = <ChevronRight className="h-4 w-4" />,
  homeLink = { href: "/", label: "Accueil" },
  currentPage,
  className,
  ...props
}: BreadcrumbProps) {
  const allSegments = homeLink ? [homeLink, ...segments] : segments;

  return (
    <nav
      aria-label="Fil d'Ariane"
      className={cn("flex", className)}
      {...props}
    >
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {allSegments.map((segment, index) => {
          const isLast = index === allSegments.length - 1;

          return (
            <BreadcrumbItem key={segment.href} isLast={isLast}>
              {isLast ? (
                <div className="flex items-center">
                  {index > 0 && (
                    <span className="mx-2 text-muted-foreground">{separator}</span>
                  )}
                  <span className="text-foreground">{currentPage}</span>
                </div>
              ) : (
                <div className="flex items-center">
                  {index > 0 && (
                    <span className="mx-2 text-muted-foreground">{separator}</span>
                  )}
                  <BreadcrumbLink href={segment.href}>{segment.label}</BreadcrumbLink>
                </div>
              )}
            </BreadcrumbItem>
          );
        })}
      </ol>
    </nav>
  );
}

export function BreadcrumbItem({
  isLast = false,
  className,
  ...props
}: BreadcrumbItemProps) {
  return (
    <li
      className={cn(
        isLast ? "" : "inline-flex items-center",
        className
      )}
      {...props}
    />
  );
}

export function BreadcrumbLink({
  href,
  className,
  isActive = false,
  ...props
}: BreadcrumbLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "text-primary hover:text-primary/80",
        isActive && "text-muted-foreground pointer-events-none",
        className
      )}
      {...props}
    />
  );
} 