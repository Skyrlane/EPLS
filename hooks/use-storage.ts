"use client";

import { useState, useCallback } from "react";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
  UploadTask,
  uploadBytesResumable,
  StorageError,
  getMetadata,
  updateMetadata,
  UploadTaskSnapshot,
  StorageReference
} from "firebase/storage";
import { storage } from "@/lib/firebase";

type UploadStatus = "idle" | "uploading" | "success" | "error";

/**
 * Métadonnées de stockage Firebase
 */
interface StorageMetadata {
  bucket: string;
  contentType?: string;
  customMetadata?: { [key: string]: string };
  fullPath: string;
  generation?: string;
  md5Hash?: string;
  metageneration?: string;
  name: string;
  size: number;
  timeCreated?: string;
  updated?: string;
}

/**
 * Options pour le hook useStorage
 */
interface UseStorageOptions {
  /** Chemin de base dans Firebase Storage */
  path?: string;
  /** Types de fichiers autorisés */
  acceptedFileTypes?: string[];
  /** Taille maximale de fichier en octets */
  maxFileSize?: number;
}

/**
 * Résultat d'un téléchargement de fichier
 */
interface FileUploadResult {
  url: string;
  path: string;
  fileName: string;
  contentType: string;
}

/**
 * Hook pour gérer les opérations de stockage Firebase
 */
export const useStorage = (options: UseStorageOptions = {}) => {
  const { path = "uploads", acceptedFileTypes, maxFileSize } = options;
  const [files, setFiles] = useState<FileUploadResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [result, setResult] = useState<FileUploadResult | null>(null);

  /**
   * Télécharge un fichier vers Firebase Storage
   */
  const uploadFile = useCallback(
    async (file: File): Promise<FileUploadResult | null> => {
      try {
        if (acceptedFileTypes && !acceptedFileTypes.includes(file.type)) {
          throw new Error(
            `Type de fichier non supporté. Veuillez télécharger l'un des formats suivants: ${acceptedFileTypes.join(
              ", "
            )}`
          );
        }

        if (maxFileSize && file.size > maxFileSize) {
          throw new Error(
            `Fichier trop volumineux. Taille maximale: ${(
              maxFileSize / (1024 * 1024)
            ).toFixed(2)} MB`
          );
        }

        setStatus("uploading");
        setLoading(true);
        setError(null);
        setProgress(0);

        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
        const filePath = `${path}/${fileName}`;
        const storageRef = ref(storage, filePath);
        
        // Créer une tâche de téléchargement avec suivi de progression
        const uploadTask = uploadBytesResumable(storageRef, file);
        
        return new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot: UploadTaskSnapshot) => {
              const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              );
              setProgress(progress);
            },
            (error: StorageError) => {
              setStatus("error");
              setLoading(false);
              setError(error.message);
              reject(error);
            },
            async () => {
              try {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                
                const resultData: FileUploadResult = {
                  url: downloadURL,
                  path: filePath,
                  fileName,
                  contentType: file.type
                };
                
                setResult(resultData);
                setFiles((prev) => [...prev, resultData]);
                setStatus("success");
                setLoading(false);
                resolve(resultData);
              } catch (err) {
                setStatus("error");
                setLoading(false);
                setError((err as Error).message);
                reject(err);
              }
            }
          );
        });
      } catch (err) {
        setStatus("error");
        setLoading(false);
        setError((err as Error).message);
        return null;
      }
    },
    [path, acceptedFileTypes, maxFileSize]
  );

  /**
   * Supprime un fichier de Firebase Storage
   */
  const deleteFile = useCallback(async (filePath: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const storageRef = ref(storage, filePath);
      await deleteObject(storageRef);
      
      setFiles((prev) => prev.filter((file) => file.path !== filePath));
      setLoading(false);
      return true;
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
      return false;
    }
  }, []);

  /**
   * Récupère tous les fichiers d'un répertoire
   */
  const listFiles = useCallback(async (directory: string = path): Promise<FileUploadResult[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const dirRef = ref(storage, directory);
      const listResult = await listAll(dirRef);
      
      const filesData = await Promise.all(
        listResult.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          const metadata = await getMetadata(itemRef) as StorageMetadata;
          
          return {
            url,
            path: itemRef.fullPath,
            fileName: itemRef.name,
            contentType: metadata.contentType || "application/octet-stream"
          };
        })
      );
      
      setFiles(filesData);
      setLoading(false);
      return filesData;
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
      return [];
    }
  }, [path]);

  /**
   * Met à jour les métadonnées d'un fichier
   */
  const updateFileMetadata = useCallback(
    async (
      filePath: string,
      newMetadata: Partial<StorageMetadata>
    ): Promise<StorageMetadata | null> => {
      try {
        setLoading(true);
        setError(null);
        
        const fileRef = ref(storage, filePath);
        const metadata = await updateMetadata(fileRef, newMetadata);
        
        setLoading(false);
        return metadata as StorageMetadata;
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
        return null;
      }
    },
    []
  );

  return {
    files,
    loading,
    error,
    progress,
    status,
    result,
    uploadFile,
    deleteFile,
    listFiles,
    updateFileMetadata,
  };
}; 