"use client";

import Link from "next/link";
import { Archive } from "lucide-react";

interface EchoYearsBannerProps {
  years: string[];
  title?: string;
}

export function EchoYearsBanner({ years, title = "Archives des Echos EPLS" }: EchoYearsBannerProps) {
  // S'assurer que les années sont triées par ordre décroissant (plus récent d'abord)
  const sortedYears = [...years].sort((a, b) => parseInt(b) - parseInt(a));
  
  return (
    <div className="bg-primary/10 rounded-lg p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Archive className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold text-primary">{title}</h2>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {sortedYears.map((year) => (
          <Link
            key={year}
            href={`/echo/${year}`}
            className="px-3 py-1 bg-card rounded-md border border-border hover:bg-muted hover:border-border transition-colors"
          >
            {year}
          </Link>
        ))}
      </div>
    </div>
  );
} 