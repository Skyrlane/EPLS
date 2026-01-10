"use client";

import { useState, useCallback, useEffect } from "react";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { collection, addDoc, query, where, getDocs, deleteDoc, Timestamp } from "firebase/firestore";
import { firestore, storage } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, Image as ImageIcon, X, CheckCircle2 } from "lucide-react";
import {
  getMonthName,
  generateEchoTitle,
  generateEchoDescription,
  isPdfFile,
  isImageFile,
  validateFileSize,
  generateEchoStoragePath,
} from "@/lib/echo-utils";
import type { Echo } from "@/types";

const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: getMonthName(i + 1),
}));

const YEARS = Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - i + 1);

export function EchoUploader() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [description, setDescription] = useState(() => generateEchoDescription(new Date().getMonth() + 1));
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [descriptionModified, setDescriptionModified] = useState(false);
  const { toast } = useToast();

  // Mettre à jour la description quand le mois change (si non modifiée manuellement)
  useEffect(() => {
    if (!descriptionModified) {
      setDescription(generateEchoDescription(month));
    }
  }, [month, descriptionModified]);

  const handlePdfSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isPdfFile(file)) {
      toast({
        title: "Erreur",
        description: "Seuls les fichiers PDF sont acceptés",
        variant: "destructive",
      });
      return;
    }

    const validation = validateFileSize(file, 10);
    if (!validation.valid) {
      toast({
        title: "Erreur",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    setPdfFile(file);
  }, [toast]);

  const handleCoverSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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

    setCoverImage(file);
  }, [toast]);

  const handleUpload = async () => {
    if (!pdfFile) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier PDF",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      setProgress(0);

      // Vérifier si un écho existe déjà pour ce mois/année
      const echoQuery = query(
        collection(firestore, "echos"),
        where("month", "==", month),
        where("year", "==", year)
      );
      const existingEchos = await getDocs(echoQuery);

      if (!existingEchos.empty) {
        const shouldReplace = confirm(
          `Un écho existe déjà pour ${getMonthName(month)} ${year}. Voulez-vous le remplacer ?`
        );

        if (!shouldReplace) {
          setUploading(false);
          return;
        }

        // Supprimer l'ancien écho
        const oldEcho = existingEchos.docs[0];
        const oldData = oldEcho.data() as Echo;

        // Supprimer les anciens fichiers du storage
        if (oldData.pdfUrl) {
          try {
            const oldPdfRef = ref(storage, oldData.pdfUrl);
            await deleteObject(oldPdfRef);
          } catch (error) {
            console.error("Erreur lors de la suppression de l'ancien PDF:", error);
          }
        }

        if (oldData.coverImageUrl) {
          try {
            const oldCoverRef = ref(storage, oldData.coverImageUrl);
            await deleteObject(oldCoverRef);
          } catch (error) {
            console.error("Erreur lors de la suppression de l'ancienne couverture:", error);
          }
        }

        // Supprimer le document Firestore
        await deleteDoc(oldEcho.ref);
      }

      // Upload du PDF
      const pdfPath = generateEchoStoragePath(year, month, pdfFile.name);
      const pdfRef = ref(storage, pdfPath);
      const pdfUploadTask = uploadBytesResumable(pdfRef, pdfFile);

      const pdfUrl = await new Promise<string>((resolve, reject) => {
        pdfUploadTask.on(
          "state_changed",
          (snapshot) => {
            const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 50;
            setProgress(Math.round(prog));
          },
          reject,
          async () => {
            const url = await getDownloadURL(pdfUploadTask.snapshot.ref);
            resolve(url);
          }
        );
      });

      // Upload de l'image de couverture si fournie
      let coverImageUrl = null;
      if (coverImage) {
        const coverPath = generateEchoStoragePath(year, month, `cover-${coverImage.name}`);
        const coverRef = ref(storage, coverPath);
        const coverUploadTask = uploadBytesResumable(coverRef, coverImage);

        coverImageUrl = await new Promise<string>((resolve, reject) => {
          coverUploadTask.on(
            "state_changed",
            (snapshot) => {
              const prog = 50 + (snapshot.bytesTransferred / snapshot.totalBytes) * 50;
              setProgress(Math.round(prog));
            },
            reject,
            async () => {
              const url = await getDownloadURL(coverUploadTask.snapshot.ref);
              resolve(url);
            }
          );
        });
      } else {
        setProgress(100);
      }

      // Sauvegarder dans Firestore
      const echoData = {
        title: generateEchoTitle(month, year),
        month,
        year,
        description: description.trim() || null,
        pdfUrl,
        pdfFileName: pdfFile.name,
        fileSize: pdfFile.size,
        coverImageUrl,
        coverUrl: coverImageUrl, // Alias pour compatibilité
        isActive: true,
        status: "published" as const,
        publishedAt: Timestamp.now(),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      await addDoc(collection(firestore, "echos"), echoData);

      toast({
        title: "Succès",
        description: `L'Écho de ${getMonthName(month)} ${year} a été publié !`,
      });

      // Reset du formulaire
      setPdfFile(null);
      setCoverImage(null);
      setDescriptionModified(false);
      setDescription(generateEchoDescription(new Date().getMonth() + 1));
      setMonth(new Date().getMonth() + 1);
      setYear(new Date().getFullYear());
      setProgress(0);
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la publication",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sélection Mois/Année */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="month">Mois</Label>
          <Select
            value={month.toString()}
            onValueChange={(value) => setMonth(parseInt(value))}
            disabled={uploading}
          >
            <SelectTrigger id="month">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((m) => (
                <SelectItem key={m.value} value={m.value.toString()}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="year">Année</Label>
          <Select
            value={year.toString()}
            onValueChange={(value) => setYear(parseInt(value))}
            disabled={uploading}
          >
            <SelectTrigger id="year">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {YEARS.map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Titre et description générés automatiquement */}
      <div className="p-4 bg-muted rounded-lg space-y-3">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Titre généré :</p>
          <p className="font-semibold">{generateEchoTitle(month, year)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">Description par défaut :</p>
          <p className="text-sm">{generateEchoDescription(month)}</p>
        </div>
      </div>

      {/* Upload PDF */}
      <div className="space-y-2">
        <Label htmlFor="pdf">Fichier PDF *</Label>
        <div className="flex items-center gap-2">
          <Input
            id="pdf"
            type="file"
            accept=".pdf,application/pdf"
            onChange={handlePdfSelect}
            disabled={uploading}
            className="flex-1"
          />
          {pdfFile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPdfFile(null)}
              disabled={uploading}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        {pdfFile && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="h-4 w-4" />
            <span>{pdfFile.name}</span>
            <span>({(pdfFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
          </div>
        )}
        <p className="text-xs text-muted-foreground">Format PDF uniquement, max 10 MB</p>
      </div>

      {/* Upload Image de couverture */}
      <div className="space-y-2">
        <Label htmlFor="cover">Image de couverture (optionnel)</Label>
        <div className="flex items-center gap-2">
          <Input
            id="cover"
            type="file"
            accept="image/*"
            onChange={handleCoverSelect}
            disabled={uploading}
            className="flex-1"
          />
          {coverImage && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCoverImage(null)}
              disabled={uploading}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        {coverImage && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ImageIcon className="h-4 w-4" />
            <span>{coverImage.name}</span>
            <span>({(coverImage.size / 1024).toFixed(2)} KB)</span>
          </div>
        )}
        <p className="text-xs text-muted-foreground">Format JPG ou PNG, max 2 MB</p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description (optionnel)</Label>
        <Textarea
          id="description"
          placeholder="Ajoutez un court résumé de ce numéro..."
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            setDescriptionModified(true);
          }}
          disabled={uploading}
          rows={3}
        />
      </div>

      {/* Progress bar */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Upload en cours...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>
      )}

      {/* Bouton de publication */}
      <Button
        onClick={handleUpload}
        disabled={!pdfFile || uploading}
        className="w-full"
        size="lg"
      >
        {uploading ? (
          <>Envoi en cours...</>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Publier l&apos;Écho
          </>
        )}
      </Button>
    </div>
  );
}
