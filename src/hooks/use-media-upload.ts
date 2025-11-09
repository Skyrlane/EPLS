import { useState } from "react";
import { uploadFile, getFileDownloadURL, deleteFile } from "@/lib/firebase/storage";

interface UseMediaUploadOptions {
  path: string;
  onSuccess?: (url: string) => void;
  onError?: (error: Error) => void;
}

export function useMediaUpload({ path, onSuccess, onError }: UseMediaUploadOptions) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [url, setUrl] = useState<string | null>(null);

  const upload = async (file: File) => {
    setIsUploading(true);
    setProgress(0);
    setError(null);
    
    try {
      // Dans une implémentation réelle, on pourrait suivre la progression
      setProgress(50);
      
      const filePath = `${path}/${Date.now()}_${file.name}`;
      const downloadUrl = await uploadFile(filePath, file);
      
      setUrl(downloadUrl);
      setProgress(100);
      
      if (onSuccess) {
        onSuccess(downloadUrl);
      }
      
      return downloadUrl;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Une erreur est survenue lors du téléchargement");
      setError(error);
      
      if (onError) {
        onError(error);
      }
      
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const remove = async (fileUrl: string) => {
    try {
      // Extraire le chemin du fichier à partir de l'URL
      // Firebase URLs sont structurées comme: https://firebasestorage.googleapis.com/v0/b/[bucket]/o/[encodedFilePath]?[queryParams]
      const filePath = fileUrl.split('?')[0].split('/o/')[1];
      
      if (filePath) {
        // Décoder le chemin du fichier qui est URL-encoded dans l'URL Firebase
        await deleteFile(decodeURIComponent(filePath));
        setUrl(null);
      } else {
        throw new Error("Impossible d'extraire le chemin du fichier à partir de l'URL");
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Une erreur est survenue lors de la suppression");
      setError(error);
      
      if (onError) {
        onError(error);
      }
      
      throw error;
    }
  };

  return {
    upload,
    remove,
    isUploading,
    progress,
    error,
    url,
  };
} 