"use client";

import { useState } from "react";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { firestore, storage } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Eye,
  Download,
  Edit,
  Trash2,
  Power,
  PowerOff,
  FileText,
  Calendar,
} from "lucide-react";
import { formatFileSize, getMonthName, isCurrentMonth, getAvailableYears } from "@/lib/echo-utils";
import { EchoEditModal } from "./EchoEditModal";
import type { Echo } from "@/types";
import Image from "next/image";

interface EchoListAdminProps {
  echos: Echo[];
  onUpdate: () => void;
}

export function EchoListAdmin({ echos, onUpdate }: EchoListAdminProps) {
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [editingEcho, setEditingEcho] = useState<Echo | null>(null);
  const { toast } = useToast();

  // Filtrer par année
  const filteredEchos = echos.filter((echo) => {
    if (selectedYear === "all") return true;
    return echo.year === parseInt(selectedYear);
  });

  // Trier par date (plus récent en premier)
  const sortedEchos = [...filteredEchos].sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });

  const handleToggleActive = async (echo: Echo) => {
    try {
      const echoRef = doc(firestore, "echos", echo.id);
      await updateDoc(echoRef, {
        isActive: !echo.isActive,
        updatedAt: new Date(),
      });

      toast({
        title: "Succès",
        description: `L'Écho a été ${!echo.isActive ? "activé" : "désactivé"}`,
      });

      onUpdate();
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'écho",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (echo: Echo) => {
    const confirmDelete = confirm(
      `Êtes-vous sûr de vouloir supprimer l'Écho de ${getMonthName(echo.month)} ${echo.year} ?\nCette action est irréversible.`
    );

    if (!confirmDelete) return;

    try {
      // Supprimer les fichiers du storage
      if (echo.pdfUrl) {
        try {
          const pdfRef = ref(storage, echo.pdfUrl);
          await deleteObject(pdfRef);
        } catch (error) {
          console.error("Erreur lors de la suppression du PDF:", error);
        }
      }

      if (echo.coverImageUrl || echo.coverUrl) {
        try {
          const coverRef = ref(storage, echo.coverImageUrl || echo.coverUrl!);
          await deleteObject(coverRef);
        } catch (error) {
          console.error("Erreur lors de la suppression de la couverture:", error);
        }
      }

      // Supprimer le document Firestore
      await deleteDoc(doc(firestore, "echos", echo.id));

      toast({
        title: "Succès",
        description: "L'Écho a été supprimé",
      });

      onUpdate();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'écho",
        variant: "destructive",
      });
    }
  };

  const availableYears = getAvailableYears(2020);

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrer par année" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les années</SelectItem>
              {availableYears.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-muted-foreground">
          {sortedEchos.length} écho{sortedEchos.length > 1 ? "s" : ""}
        </div>
      </div>

      {/* Liste des échos */}
      {sortedEchos.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Aucun écho trouvé pour cette période</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedEchos.map((echo) => (
            <Card key={echo.id} className="flex flex-col">
              {/* Image de couverture */}
              <div className="relative aspect-[210/297] bg-muted">
                {echo.coverImageUrl || echo.coverUrl ? (
                  <Image
                    src={echo.coverImageUrl || echo.coverUrl!}
                    alt={`Couverture ${echo.title}`}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FileText className="h-16 w-16 text-muted-foreground/30" />
                  </div>
                )}
                {/* Badge "Actuel" */}
                {isCurrentMonth(echo.month, echo.year) && (
                  <Badge className="absolute top-2 right-2" variant="default">
                    Actuel
                  </Badge>
                )}
                {/* Badge statut */}
                {!echo.isActive && (
                  <Badge className="absolute top-2 left-2" variant="secondary">
                    Inactif
                  </Badge>
                )}
              </div>

              {/* Contenu */}
              <CardContent className="flex-1 pt-4">
                <h3 className="font-semibold mb-2">{echo.title}</h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {getMonthName(echo.month)} {echo.year}
                  </span>
                </div>
                {echo.fileSize && (
                  <p className="text-xs text-muted-foreground">
                    Taille : {formatFileSize(echo.fileSize)}
                  </p>
                )}
                {echo.description && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {echo.description}
                  </p>
                )}
              </CardContent>

              {/* Actions */}
              <CardFooter className="pt-0 flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="flex-1"
                >
                  <a href={echo.pdfUrl} target="_blank" rel="noopener noreferrer">
                    <Eye className="h-4 w-4 mr-1" />
                    Voir
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="flex-1"
                >
                  <a href={echo.pdfUrl} download>
                    <Download className="h-4 w-4 mr-1" />
                    DL
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingEcho(echo)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleActive(echo)}
                >
                  {echo.isActive ? (
                    <PowerOff className="h-4 w-4" />
                  ) : (
                    <Power className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(echo)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Modal d'édition */}
      {editingEcho && (
        <EchoEditModal
          echo={editingEcho}
          onClose={() => setEditingEcho(null)}
          onUpdate={onUpdate}
        />
      )}
    </div>
  );
}
