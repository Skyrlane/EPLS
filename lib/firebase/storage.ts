import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
  uploadString as firebaseUploadString,
  uploadBytesResumable,
  UploadTaskSnapshot,
  UploadTask,
  getMetadata,
  updateMetadata
} from 'firebase/storage';
import { storage } from './index';

// Créer une référence à un fichier dans Storage
export const getStorageRef = (path: string) => {
  return ref(storage, path);
};

// Uploader un fichier (Buffer ou Blob)
export const uploadFile = async (
  path: string,
  file: Blob | Uint8Array | ArrayBuffer
): Promise<string> => {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
};

// Uploader un fichier avec statut de progression
export const uploadFileWithProgress = (
  path: string,
  file: Blob | Uint8Array | ArrayBuffer,
  progressCallback: (progress: number) => void,
  errorCallback: (error: Error) => void,
  completionCallback: (url: string) => void
): UploadTask => {
  const storageRef = ref(storage, path);
  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on(
    'state_changed',
    (snapshot: UploadTaskSnapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      progressCallback(progress);
    },
    (error) => {
      errorCallback(error);
    },
    async () => {
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      completionCallback(downloadURL);
    }
  );

  return uploadTask;
};

// Uploader une chaîne de caractères (utile pour les images en base64)
export const uploadStringContent = async (
  path: string,
  data: string,
  format: 'raw' | 'data_url' | 'base64' | 'base64url' = 'raw'
): Promise<string> => {
  const storageRef = ref(storage, path);
  const snapshot = await firebaseUploadString(storageRef, data, format);
  return getDownloadURL(snapshot.ref);
};

// Obtenir l'URL de téléchargement d'un fichier
export const getFileDownloadURL = async (path: string): Promise<string> => {
  const storageRef = ref(storage, path);
  return getDownloadURL(storageRef);
};

// Supprimer un fichier
export const deleteFile = async (path: string): Promise<void> => {
  const storageRef = ref(storage, path);
  return deleteObject(storageRef);
};

// Lister tous les éléments dans un dossier
export const listFiles = async (folderPath: string): Promise<{ items: Array<{name: string, fullPath: string, url: string}>, prefixes: Array<{name: string, fullPath: string}> }> => {
  const folderRef = ref(storage, folderPath);
  const result = await listAll(folderRef);
  
  const items = await Promise.all(
    result.items.map(async (itemRef) => {
      const url = await getDownloadURL(itemRef);
      return { name: itemRef.name, fullPath: itemRef.fullPath, url };
    })
  );
  
  const prefixes = result.prefixes.map((prefixRef) => ({
    name: prefixRef.name,
    fullPath: prefixRef.fullPath
  }));
  
  return { items, prefixes };
};

// Obtenir les métadonnées d'un fichier
export const getFileMetadata = async (path: string) => {
  const storageRef = ref(storage, path);
  return getMetadata(storageRef);
};

// Mettre à jour les métadonnées d'un fichier
export const updateFileMetadata = async (path: string, metadata: any) => {
  const storageRef = ref(storage, path);
  return updateMetadata(storageRef, metadata);
};

// Générer un nom de fichier unique
export const generateUniqueFileName = (fileName: string): string => {
  const extension = fileName.split('.').pop();
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${randomString}.${extension}`;
};

// Construire un chemin complet pour un fichier
export const buildStoragePath = (userId: string, folder: string, fileName: string): string => {
  return `users/${userId}/${folder}/${fileName}`;
}; 