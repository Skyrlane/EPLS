"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Theme = "Foi" | "Grâce" | "Évangile" | "Espérance" | "Adoration" | "Famille" | "Vie Chrétienne" | "Série d'été";
type Predicateur = "Pasteur A. Martin" | "Pasteur B. Dubois" | "Pasteur C. Lambert" | "Ancien D. Petit" | "Invité E. Richard" | "Pasteur Robert";

interface MessageFilterProps {
  themes: Theme[];
  predicateurs: Predicateur[];
  années: string[];
}

export function MessageFilter({ themes, predicateurs, années }: MessageFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const theme = searchParams.get("theme") || "";
  const predicateur = searchParams.get("predicateur") || "";
  const année = searchParams.get("année") || "";
  const tri = searchParams.get("tri") || "recent";
  
  // Fonction pour mettre à jour les filtres
  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    
    router.push(`/messages?${params.toString()}`);
  };
  
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="w-full sm:w-auto">
        <label htmlFor="filter-theme" className="block text-sm font-medium text-foreground">Thème</label>
        <Select value={theme || "all"} onValueChange={(value) => updateFilter("theme", value)}>
          <SelectTrigger id="filter-theme" className="w-full sm:w-[180px]">
            <SelectValue placeholder="Tous les thèmes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les thèmes</SelectItem>
            {themes.map((theme) => (
              <SelectItem key={theme} value={theme}>{theme}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="w-full sm:w-auto">
        <label htmlFor="filter-predicateur" className="block text-sm font-medium text-foreground">Prédicateur</label>
        <Select value={predicateur || "all"} onValueChange={(value) => updateFilter("predicateur", value)}>
          <SelectTrigger id="filter-predicateur" className="w-full sm:w-[180px]">
            <SelectValue placeholder="Tous les prédicateurs" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les prédicateurs</SelectItem>
            {predicateurs.map((predicateur) => (
              <SelectItem key={predicateur} value={predicateur}>{predicateur}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="w-full sm:w-auto">
        <label htmlFor="filter-date" className="block text-sm font-medium text-foreground">Année</label>
        <Select value={année || "all"} onValueChange={(value) => updateFilter("année", value)}>
          <SelectTrigger id="filter-date" className="w-full sm:w-[180px]">
            <SelectValue placeholder="Toutes les années" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les années</SelectItem>
            {années.map((année) => (
              <SelectItem key={année} value={année}>{année}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="w-full sm:w-auto ml-auto">
        <label htmlFor="filter-sort" className="block text-sm font-medium text-foreground">Trier par</label>
        <Select value={tri} onValueChange={(value) => updateFilter("tri", value)}>
          <SelectTrigger id="filter-sort" className="w-full sm:w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Plus récents</SelectItem>
            <SelectItem value="oldest">Plus anciens</SelectItem>
            <SelectItem value="views">Plus vues</SelectItem>
            <SelectItem value="title">Titre (A-Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
} 