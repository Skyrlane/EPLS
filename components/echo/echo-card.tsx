"use client";

import Image from "next/image";
import Link from "next/link";
import { FileText, Download, Calendar } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardFooter } from "../../components/ui/card";
import type { Echo } from "../../types";

interface EchoCardProps {
  echo: Echo;
}

export function EchoCard({ echo }: EchoCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden">
      <div className="relative aspect-[210/297] bg-gray-100">
        {echo.coverUrl ? (
          <Image 
            src={echo.coverUrl}
            alt={`Couverture de ${echo.title}`}
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FileText className="h-16 w-16 text-gray-300" />
          </div>
        )}
      </div>
      
      <CardContent className="flex-grow py-4">
        <h3 className="text-lg font-bold mb-2">{echo.title}</h3>
        
        <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
          <Calendar className="h-4 w-4" />
          <span>{echo.edition || `${echo.month || ''} ${echo.year}`}</span>
        </div>
        
        {echo.description && (
          <p className="text-gray-600 text-sm line-clamp-3">
            {echo.description}
          </p>
        )}
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button asChild variant="outline" className="w-full gap-1">
          <a 
            href={echo.pdfUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label={`Télécharger ${echo.title} (Ouvre dans un nouvel onglet)`}
          >
            <Download className="h-4 w-4" />
            Télécharger le PDF
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
} 