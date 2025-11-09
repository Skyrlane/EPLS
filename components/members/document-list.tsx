"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, FileText, Download, Calendar, Tag, FileIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Document } from "@/types";

interface DocumentListProps {
  documents: Document[];
  title?: string;
  description?: string;
  className?: string;
  onDownload?: (document: Document) => void;
}

export function DocumentList({
  documents,
  title = "Documents partagés",
  description,
  className,
  onDownload
}: DocumentListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Simuler un temps de chargement pour une meilleure UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Filtrer les documents avec useMemo pour optimiser les performances
  const filteredDocuments = useMemo(() => {
    if (!searchTerm.trim()) return documents;
    
    const normalizedSearchTerm = searchTerm.toLowerCase();
    return documents.filter(
      (doc) =>
        doc.title.toLowerCase().includes(normalizedSearchTerm) ||
        doc.category.toLowerCase().includes(normalizedSearchTerm) ||
        (doc.description && doc.description.toLowerCase().includes(normalizedSearchTerm))
    );
  }, [documents, searchTerm]);

  // Gérer le téléchargement des documents
  const handleDownload = (doc: Document) => {
    if (onDownload) {
      onDownload(doc);
    } else {
      // Comportement par défaut: redirection vers l'URL
      window.open(doc.url, '_blank');
    }
  };

  // Obtenir l'icône appropriée selon le type de fichier
  const getFileIcon = (fileType?: string) => {
    if (!fileType) return <FileText className="h-5 w-5" />;
    
    const type = fileType.toLowerCase();
    
    if (type.includes('pdf')) return <FileIcon className="h-5 w-5" />;
    if (type.includes('word') || type.includes('doc')) return <FileText className="h-5 w-5" />;
    if (type.includes('excel') || type.includes('xls')) return <FileText className="h-5 w-5" />;
    if (type.includes('powerpoint') || type.includes('ppt')) return <FileText className="h-5 w-5" />;
    
    return <FileText className="h-5 w-5" />;
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        <div className="mt-4 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="searchDocuments"
            placeholder="Rechercher par titre, catégorie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-8 flex items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {filteredDocuments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDocuments.map((doc) => (
                  <div 
                    key={doc.id} 
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-md bg-primary/10 text-primary">
                        {getFileIcon(doc.fileType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{doc.title}</h4>
                        {doc.description && (
                          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                            {doc.description}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            {doc.category}
                          </Badge>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {doc.date}
                          </span>
                          <span>{doc.size}</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="mt-2 h-8 px-2 text-primary"
                          onClick={() => handleDownload(doc)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Télécharger
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Aucun document ne correspond à votre recherche.
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
} 