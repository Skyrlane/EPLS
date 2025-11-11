import { renderHook, act, waitFor } from '@testing-library/react';
import { useStorage } from '../use-storage';

// Mock de Firebase Storage
jest.mock('firebase/storage', () => ({
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  uploadBytesResumable: jest.fn(),
  getDownloadURL: jest.fn(),
  deleteObject: jest.fn(),
  listAll: jest.fn(),
  getMetadata: jest.fn(),
  updateMetadata: jest.fn(),
}));

jest.mock('@/lib/firebase', () => ({
  storage: { type: 'storage' },
}));

import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  getMetadata,
  updateMetadata,
} from 'firebase/storage';

// Mock data
const createMockFile = (
  name: string = 'test.jpg',
  size: number = 1024,
  type: string = 'image/jpeg'
): File => {
  const file = new File(['test content'], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
};

const mockStorageRef = { fullPath: 'uploads/test.jpg', name: 'test.jpg' };
const mockDownloadURL = 'https://firebasestorage.googleapis.com/test.jpg';

describe('useStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default mocks
    (ref as jest.Mock).mockReturnValue(mockStorageRef);
    (getDownloadURL as jest.Mock).mockResolvedValue(mockDownloadURL);
  });

  describe('Initialization', () => {
    it('devrait initialiser avec des valeurs par défaut', () => {
      const { result } = renderHook(() => useStorage());

      expect(result.current.files).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(result.current.progress).toBe(0);
      expect(result.current.status).toBe('idle');
      expect(result.current.result).toBe(null);
    });

    it('devrait initialiser avec des options personnalisées', () => {
      const { result } = renderHook(() =>
        useStorage({
          path: 'custom-path',
          acceptedFileTypes: ['image/jpeg', 'image/png'],
          maxFileSize: 5 * 1024 * 1024, // 5MB
        })
      );

      expect(result.current.files).toEqual([]);
      expect(result.current.status).toBe('idle');
    });
  });

  describe('uploadFile', () => {
    it('devrait télécharger un fichier avec succès', async () => {
      const file = createMockFile();
      const mockUploadTask = {
        on: jest.fn((event, onProgress, onError, onComplete) => {
          // Simuler la progression
          onProgress({ bytesTransferred: 512, totalBytes: 1024 });
          onProgress({ bytesTransferred: 1024, totalBytes: 1024 });
          // Simuler la completion
          setTimeout(() => onComplete(), 0);
        }),
        snapshot: { ref: mockStorageRef },
      };

      (uploadBytesResumable as jest.Mock).mockReturnValue(mockUploadTask);

      const { result } = renderHook(() => useStorage());

      let uploadResult: any;
      await act(async () => {
        uploadResult = await result.current.uploadFile(file);
      });

      expect(uploadBytesResumable).toHaveBeenCalled();
      expect(uploadResult).toEqual(
        expect.objectContaining({
          url: mockDownloadURL,
          contentType: 'image/jpeg',
        })
      );
      expect(result.current.status).toBe('success');
      expect(result.current.files).toHaveLength(1);
    });

    it('devrait suivre la progression du téléchargement', async () => {
      const file = createMockFile();
      const progressValues: number[] = [];

      const mockUploadTask = {
        on: jest.fn((event, onProgress, onError, onComplete) => {
          onProgress({ bytesTransferred: 256, totalBytes: 1024 });
          onProgress({ bytesTransferred: 512, totalBytes: 1024 });
          onProgress({ bytesTransferred: 1024, totalBytes: 1024 });
          setTimeout(() => onComplete(), 0);
        }),
        snapshot: { ref: mockStorageRef },
      };

      (uploadBytesResumable as jest.Mock).mockReturnValue(mockUploadTask);

      const { result } = renderHook(() => useStorage());

      await act(async () => {
        const uploadPromise = result.current.uploadFile(file);
        await uploadPromise;
      });

      // Le dernier appel devrait être à 100%
      await waitFor(() => {
        expect(result.current.progress).toBeGreaterThan(0);
      });
    });

    it('devrait rejeter les fichiers avec un type non accepté', async () => {
      const file = createMockFile('test.pdf', 1024, 'application/pdf');

      const { result } = renderHook(() =>
        useStorage({
          acceptedFileTypes: ['image/jpeg', 'image/png'],
        })
      );

      let uploadResult: any;
      await act(async () => {
        uploadResult = await result.current.uploadFile(file);
      });

      expect(uploadResult).toBe(null);
      expect(result.current.error).toContain('Type de fichier non supporté');
      expect(result.current.status).toBe('error');
    });

    it('devrait rejeter les fichiers trop volumineux', async () => {
      const file = createMockFile('large.jpg', 10 * 1024 * 1024); // 10MB

      const { result } = renderHook(() =>
        useStorage({
          maxFileSize: 5 * 1024 * 1024, // 5MB max
        })
      );

      let uploadResult: any;
      await act(async () => {
        uploadResult = await result.current.uploadFile(file);
      });

      expect(uploadResult).toBe(null);
      expect(result.current.error).toContain('Fichier trop volumineux');
      expect(result.current.status).toBe('error');
    });

    it('devrait gérer les erreurs de téléchargement', async () => {
      const file = createMockFile();
      const mockError = new Error('Upload failed');

      const mockUploadTask = {
        on: jest.fn((event, onProgress, onError, onComplete) => {
          onError(mockError);
        }),
        snapshot: { ref: mockStorageRef },
      };

      (uploadBytesResumable as jest.Mock).mockReturnValue(mockUploadTask);

      const { result } = renderHook(() => useStorage());

      let uploadResult: any;
      await act(async () => {
        try {
          uploadResult = await result.current.uploadFile(file);
        } catch (err) {
          // Erreur attendue
        }
      });

      expect(result.current.status).toBe('error');
      expect(result.current.error).toBe('Upload failed');
    });

    it('devrait nettoyer les noms de fichiers avec espaces', async () => {
      const file = createMockFile('test file with spaces.jpg');

      const mockUploadTask = {
        on: jest.fn((event, onProgress, onError, onComplete) => {
          setTimeout(() => onComplete(), 0);
        }),
        snapshot: { ref: mockStorageRef },
      };

      (uploadBytesResumable as jest.Mock).mockReturnValue(mockUploadTask);

      const { result } = renderHook(() => useStorage());

      await act(async () => {
        await result.current.uploadFile(file);
      });

      const refCall = (ref as jest.Mock).mock.calls[0];
      expect(refCall[1]).toMatch(/test-file-with-spaces\.jpg/);
    });
  });

  describe('deleteFile', () => {
    it('devrait supprimer un fichier avec succès', async () => {
      (deleteObject as jest.Mock).mockResolvedValue(undefined);

      const { result } = renderHook(() => useStorage());

      // Ajouter un fichier à la liste d'abord
      act(() => {
        result.current['files'] = [{
          url: mockDownloadURL,
          path: 'uploads/test.jpg',
          fileName: 'test.jpg',
          contentType: 'image/jpeg',
        }];
      });

      let deleteResult: boolean = false;
      await act(async () => {
        deleteResult = await result.current.deleteFile('uploads/test.jpg');
      });

      expect(deleteObject).toHaveBeenCalled();
      expect(deleteResult).toBe(true);
      expect(result.current.error).toBe(null);
    });

    it('devrait gérer les erreurs de suppression', async () => {
      const mockError = new Error('Delete failed');
      (deleteObject as jest.Mock).mockRejectedValue(mockError);

      const { result } = renderHook(() => useStorage());

      let deleteResult: boolean = true;
      await act(async () => {
        deleteResult = await result.current.deleteFile('uploads/test.jpg');
      });

      expect(deleteResult).toBe(false);
      expect(result.current.error).toBe('Delete failed');
    });
  });

  describe('listFiles', () => {
    it('devrait lister tous les fichiers d\'un répertoire', async () => {
      const mockItems = [
        {
          fullPath: 'uploads/file1.jpg',
          name: 'file1.jpg',
        },
        {
          fullPath: 'uploads/file2.jpg',
          name: 'file2.jpg',
        },
      ];

      const mockMetadata = {
        contentType: 'image/jpeg',
      };

      (listAll as jest.Mock).mockResolvedValue({ items: mockItems });
      (getDownloadURL as jest.Mock).mockResolvedValue(mockDownloadURL);
      (getMetadata as jest.Mock).mockResolvedValue(mockMetadata);

      const { result } = renderHook(() => useStorage());

      let files: any[] = [];
      await act(async () => {
        files = await result.current.listFiles();
      });

      expect(listAll).toHaveBeenCalled();
      expect(files).toHaveLength(2);
      expect(files[0]).toEqual(
        expect.objectContaining({
          url: mockDownloadURL,
          fileName: 'file1.jpg',
          contentType: 'image/jpeg',
        })
      );
      expect(result.current.files).toHaveLength(2);
    });

    it('devrait gérer les erreurs lors du listing', async () => {
      const mockError = new Error('List failed');
      (listAll as jest.Mock).mockRejectedValue(mockError);

      const { result } = renderHook(() => useStorage());

      let files: any[] = [];
      await act(async () => {
        files = await result.current.listFiles();
      });

      expect(files).toEqual([]);
      expect(result.current.error).toBe('List failed');
    });

    it('devrait utiliser le répertoire par défaut si aucun n\'est fourni', async () => {
      (listAll as jest.Mock).mockResolvedValue({ items: [] });

      const { result } = renderHook(() => useStorage({ path: 'custom-uploads' }));

      await act(async () => {
        await result.current.listFiles();
      });

      expect(listAll).toHaveBeenCalled();
      const refCall = (ref as jest.Mock).mock.calls[0];
      expect(refCall[1]).toBe('custom-uploads');
    });
  });

  describe('updateFileMetadata', () => {
    it('devrait mettre à jour les métadonnées d\'un fichier', async () => {
      const mockMetadata = {
        customMetadata: { description: 'Updated file' },
        contentType: 'image/jpeg',
      };

      (updateMetadata as jest.Mock).mockResolvedValue(mockMetadata);

      const { result } = renderHook(() => useStorage());

      let metadata: any;
      await act(async () => {
        metadata = await result.current.updateFileMetadata('uploads/test.jpg', {
          customMetadata: { description: 'Updated file' },
        });
      });

      expect(updateMetadata).toHaveBeenCalled();
      expect(metadata).toEqual(mockMetadata);
      expect(result.current.error).toBe(null);
    });

    it('devrait gérer les erreurs lors de la mise à jour des métadonnées', async () => {
      const mockError = new Error('Update failed');
      (updateMetadata as jest.Mock).mockRejectedValue(mockError);

      const { result } = renderHook(() => useStorage());

      let metadata: any;
      await act(async () => {
        metadata = await result.current.updateFileMetadata('uploads/test.jpg', {
          customMetadata: { description: 'Updated file' },
        });
      });

      expect(metadata).toBe(null);
      expect(result.current.error).toBe('Update failed');
    });
  });

  describe('États et gestion du loading', () => {
    it('devrait mettre loading à true pendant le téléchargement', async () => {
      const file = createMockFile();

      const mockUploadTask = {
        on: jest.fn((event, onProgress, onError, onComplete) => {
          // Simuler un délai avant completion
          setTimeout(() => onComplete(), 50);
        }),
        snapshot: { ref: mockStorageRef },
      };

      (uploadBytesResumable as jest.Mock).mockReturnValue(mockUploadTask);

      const { result } = renderHook(() => useStorage());

      // Démarrer l'upload
      act(() => {
        result.current.uploadFile(file);
      });

      // Vérifier que loading devient true
      await waitFor(() => {
        expect(result.current.loading).toBe(true);
      });

      // Attendre la fin de l'upload
      await waitFor(() => {
        expect(result.current.status).toBe('success');
      }, { timeout: 1000 });
    });

    it('devrait réinitialiser l\'erreur lors d\'une nouvelle opération', async () => {
      const file = createMockFile();

      const { result } = renderHook(() =>
        useStorage({ acceptedFileTypes: ['image/png'] })
      );

      // Première tentative avec erreur
      await act(async () => {
        await result.current.uploadFile(file); // Type non accepté
      });

      expect(result.current.error).not.toBe(null);

      // Simuler une nouvelle tentative
      const mockUploadTask = {
        on: jest.fn((event, onProgress, onError, onComplete) => {
          setTimeout(() => onComplete(), 0);
        }),
        snapshot: { ref: mockStorageRef },
      };

      (uploadBytesResumable as jest.Mock).mockReturnValue(mockUploadTask);

      const validFile = createMockFile('test.png', 1024, 'image/png');

      await act(async () => {
        await result.current.uploadFile(validFile);
      });

      // L'erreur devrait être réinitialisée
      expect(result.current.error).toBe(null);
    });
  });

  describe('Gestion des fichiers multiples', () => {
    it('devrait gérer plusieurs téléchargements successifs', async () => {
      const mockUploadTask = {
        on: jest.fn((event, onProgress, onError, onComplete) => {
          setTimeout(() => onComplete(), 0);
        }),
        snapshot: { ref: mockStorageRef },
      };

      (uploadBytesResumable as jest.Mock).mockReturnValue(mockUploadTask);

      const { result } = renderHook(() => useStorage());

      const file1 = createMockFile('file1.jpg');
      const file2 = createMockFile('file2.jpg');

      await act(async () => {
        await result.current.uploadFile(file1);
      });

      await act(async () => {
        await result.current.uploadFile(file2);
      });

      expect(result.current.files).toHaveLength(2);
    });
  });
});
