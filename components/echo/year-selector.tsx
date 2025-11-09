"use client";

import Link from "next/link";
import { Button } from "../../components/ui/button";

interface YearSelectorProps {
  years: string[];
  currentYear: string;
}

export function YearSelector({ years, currentYear }: YearSelectorProps) {
  // S'assurer que les années sont triées par ordre décroissant (plus récent d'abord)
  const sortedYears = [...years].sort((a, b) => parseInt(b) - parseInt(a));
  
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <div 
        className="inline-flex rounded-md shadow-sm" 
        role="group"
        aria-label="Sélection d'année"
      >
        {sortedYears.map((year) => (
          <Button
            key={year}
            asChild
            variant={year === currentYear ? "default" : "outline"}
            className={`${
              year === currentYear ? "bg-primary text-white" : "bg-white"
            } ${
              year === sortedYears[0]
                ? "rounded-l-md"
                : year === sortedYears[sortedYears.length - 1]
                ? "rounded-r-md"
                : "rounded-none"
            } border-r-0 last:border-r`}
          >
            <Link href={`/echo/${year}`}>{year}</Link>
          </Button>
        ))}
      </div>
    </div>
  );
} 