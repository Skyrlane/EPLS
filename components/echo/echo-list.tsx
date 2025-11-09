"use client";

import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import type { Echo } from "../../types";

interface EchoListProps {
  year: string;
  echos: Echo[];
}

export function EchoList({ year, echos }: EchoListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Echos EPLS de l'année {year}</CardTitle>
      </CardHeader>
      <CardContent>
        {echos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Aucun écho disponible pour cette année
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {echos.map((echo) => (
              <div
                key={echo.id}
                className="border-l-4 border-primary pl-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <a
                  href={echo.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium block"
                  aria-label={`Télécharger ${echo.title} (Ouvre dans un nouvel onglet)`}
                >
                  {echo.title}
                </a>
                {echo.edition && (
                  <span className="text-sm text-gray-500 block mt-1">
                    {echo.edition}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 