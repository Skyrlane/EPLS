"use client";

import Link from "next/link";

interface ArticleLinkProps {
  slug: string;
  section?: "blog" | "articles";
  className?: string;
  variant?: "default" | "text" | "button";
}

export function ArticleLinkClient({ 
  slug, 
  section = "blog", 
  className = "", 
  variant = "text" 
}: ArticleLinkProps) {
  let computedClassName = "text-primary font-medium";
  
  if (variant === "default") {
    computedClassName = "bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded shadow-md inline-block";
  } else if (variant === "text") {
    computedClassName = "text-primary font-medium hover:underline";
  }
  
  return (
    <Link 
      href={`/${section}/${slug}`} 
      className={`${computedClassName} ${className}`}
    >
      Lire l&apos;article
    </Link>
  );
} 