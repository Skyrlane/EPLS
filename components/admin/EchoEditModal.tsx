"use client";

import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { firestore, storage } from "@/lib/firebase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Image as ImageIcon, X, Upload } from "lucide-react";
import { isImageFile, validateFileSize, generateEchoStoragePath } from "@/lib/echo-utils";
import type { Echo } from "@/types";

interface EchoEditModalProps {
  echo: Echo;
  onClose: () => void;
  onUpdate: () => void;
}

export function EchoEditModal({ echo, onClose, onUpdate }: EchoEditModalProps) {
  const [description, setDescription] = useState(echo.description || "");
  const [newCoverImage, setNewCoverImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isImageFile(file)) {
      toast({
        title: "Erreur",
        description: "Seuls les fichiers image sont acceptés",
        variant: "destructive",
      });
      return;
    }

    const validation = validateFileSize(file, 2);
    if (!validation.valid) {
      toast({
        title: "Erreur",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    setNewCoverImage(file);
  };

  const handleSave = async () => {
    try {
      setUploading(true);
      setProgress(0);

      let coverImageUrl = echo.coverImageUrl || echo.coverUrl;

      // Upload nouvelle image de couverture si fournie
      if (newCoverImage) {
        // Supprimer l'ancienne image si elle existe
        if (coverImageUrl) {
          try {
            const oldCoverRef = ref(storage, coverImageUrl);
            await deleteObject(oldCoverRef);
          } catch (error) {
            console.error("Erreur lors de la suppression de l'ancienne couverture:", error);
          }
        }

        // Upload nouvelle image
        const coverPath = generateEchoStoragePath(echo.year, echo.month, `cover-${newCoverImage.name}`);
        const coverRef = ref(storage, coverPath);
        const coverUploadTask = uploadBytesResumable(coverRef, newCoverImage);

        coverImageUrl = await new Promise<string>((resolve, reject) => {
          coverUploadTask.on(
            "state_changed",
            (snapshot) => {
              const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setProgress(Math.round(prog));
            },
            reject,
            async () => {
              const url = await getDownloadURL(coverUploadTask.snapshot.ref);
              resolve(url);
            }
          );
        });
      }

      // Mettre à jour dans Firestore
      const echoRef = doc(firestore, "echos", echo.id);
      await updateDoc(echoRef, {
        description: description.trim() || null,
        coverImageUrl,
        coverUrl: coverImageUrl, // Alias pour compatibilité
        updatedAt: new Date(),
      });

      toast({
        title: "Succès",
        description: "L'Écho a été mis à jour",
      });

      onUpdate();
      onClose();
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'écho",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier l&apos;Écho</DialogTitle>
          <DialogDescription>{echo.title}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              placeholder="Ajoutez un court résumé de ce numéro..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={uploading}
              rows={3}
            />
          </div>

          {/* Image de couverture actuelle */}
          {(echo.coverImageUrl || echo.coverUrl) && !newCoverImage && (
            <div className="space-y-2">
              <Label>Image de couverture actuelle</Label>
              <div className="relative aspect-[210/297] max-w-[150px] bg-muted rounded-lg overflow-hidden">
                <img
                  src={echo.coverImageUrl || echo.coverUrl}
                  alt="Couverture actuelle"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Nouvelle image de couverture */}
          <div className="space-y-2">
            <Label htmlFor="edit-cover">
              {echo.coverImageUrl || echo.coverUrl
                ? "Remplacer l'image de couverture"
                : "Ajouter une image de couverture"}
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="edit-cover"
                type="file"
                accept="image/*"
                onChange={handleCoverSelect}
                disabled={uploading}
                className="flex-1"
              />
              {newCoverImage && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setNewCoverImage(null)}
                  disabled={uploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            {newCoverImage && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ImageIcon className="h-4 w-4" />
                <span>{newCoverImage.name}</span>
                <span>({(newCoverImage.size / 1024).toFixed(2)} KB)</span>
              </div>
            )}
          </div>

          {/* Progress bar */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Mise à jour en cours...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={uploading}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={uploading}>
            {uploading ? (
              <>
                <Upload className="mr-2 h-4 w-4 animate-spin" />
                Mise à jour...
              </>
            ) : (
              "Enregistrer"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
