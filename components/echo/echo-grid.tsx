"use client";

import { EchoCard } from "./echo-card";
import type { Echo } from "../../types";

interface EchoGridProps {
  echos: Echo[];
  limit?: number;
}

export function EchoGrid({ echos, limit }: EchoGridProps) {
  const displayedEchos = limit ? echos.slice(0, limit) : echos;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayedEchos.length === 0 ? (
        <div className="col-span-full text-center py-12 text-gray-500">
          Aucun écho à afficher
        </div>
      ) : (
        displayedEchos.map((echo) => (
          <EchoCard key={echo.id} echo={echo} />
        ))
      )}
    </div>
  );
} 