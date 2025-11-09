"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ReadArticleButtonProps {
  slug: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  className?: string;
}

export function ReadArticleButton({ slug, variant = "link", className = "p-0" }: ReadArticleButtonProps) {
  return (
    <Button asChild variant={variant} className={className}>
      <Link href={`/blog/${slug}`} className="text-primary font-medium">
        Lire l&apos;article
      </Link>
    </Button>
  );
} 