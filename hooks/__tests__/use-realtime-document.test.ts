import { renderHook, act, waitFor } from '@testing-library/react';
import { useRealtimeDocument } from '../use-realtime-document';

// Mock de Firebase Firestore
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  onSnapshot: jest.fn(),
  serverTimestamp: jest.fn(() => new Date()),
}));

jest.mock('@/lib/firebase', () => ({
  firestore: { type: 'firestore' },
}));

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';

// Mock data
const mockDocumentRef = { id: 'test-doc-id', path: 'events/test-doc-id' };

const mockDocumentSnapshot = {
  id: 'test-doc-id',
  exists: () => true,
  data: () => ({ title: 'Test Event', date: '2025-01-01' }),
};

const mockUnsubscribe = jest.fn();

describe('useRealtimeDocument', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default mocks
    (doc as jest.Mock).mockReturnValue(mockDocumentRef);
    (getDoc as jest.Mock).mockResolvedValue(mockDocumentSnapshot);
    (setDoc as jest.Mock).mockResolvedValue(undefined);
    (updateDoc as jest.Mock).mockResolvedValue(undefined);
    (deleteDoc as jest.Mock).mockResolvedValue(undefined);
    (onSnapshot as jest.Mock).mockImplementation((ref, onNext, onError) => {
      onNext(mockDocumentSnapshot);
      return mockUnsubscribe;
    });
  });

  describe('Initialization', () => {
    it('devrait initialiser avec des valeurs par défaut', async () => {
      const { result } = renderHook(() =>
        useRealtimeDocument({
          collectionName: 'events',
          documentId: 'test-doc-id',
        })
      );

      // Vérifier que l'abonnement a été appelé
      expect(onSnapshot).toHaveBeenCalled();
      
      // Les données devraient être disponibles après l'abonnement
      await waitFor(() => {
        expect(result.current.data).not.toBe(null);
        expect(result.current.status).toBe('success');
      });
      
      expect(result.current.error).toBe(null);
    });

    it('devrait initialiser en mode idle si disabled', () => {
      const { result } = renderHook(() =>
        useRealtimeDocument({
          collectionName: 'events',
          documentId: 'test-doc-id',
          disabled: true,
        })
      );

      expect(result.current.status).toBe('idle');
      expect(onSnapshot).not.toHaveBeenCalled();
    });

    it('devrait initialiser en mode idle si pas de documentId', () => {
      const { result } = renderHook(() =>
        useRealtimeDocument({
          collectionName: 'events',
        })
      );

      expect(result.current.status).toBe('idle');
      expect(onSnapshot).not.toHaveBeenCalled();
    });

    it('devrait utiliser le champ ID personnalisé', async () => {
      (onSnapshot as jest.Mock).mockImplementation((ref, onNext) => {
        onNext(mockDocumentSnapshot);
        return mockUnsubscribe;
      });

      const { result } = renderHook(() =>
        useRealtimeDocument({
          collectionName: 'events',
          documentId: 'test-doc-id',
          idField: 'customId',
        })
      );

      await waitFor(() => {
        expect(result.current.data).toHaveProperty('customId', 'test-doc-id');
      });
    });
  });

  describe('Subscription', () => {
    it('devrait s\'abonner automatiquement au document', async () => {
      const { result } = renderHook(() =>
        useRealtimeDocument({
          collectionName: 'events',
          documentId: 'test-doc-id',
        })
      );

      await waitFor(() => {
        expect(onSnapshot).toHaveBeenCalled();
        expect(result.current.isSubscribed).toBe(true);
      });
    });

    it('devrait recevoir les données du document', async () => {
      const { result } = renderHook(() =>
        useRealtimeDocument({
          collectionName: 'events',
          documentId: 'test-doc-id',
        })
      );

      await waitFor(() => {
        expect(result.current.data).toEqual(
          expect.objectContaining({
            id: 'test-doc-id',
            title: 'Test Event',
            date: '2025-01-01',
          })
        );
        expect(result.current.status).toBe('success');
      });
    });

    it('devrait retourner null si le document n\'existe pas', async () => {
      (onSnapshot as jest.Mock).mockImplementation((ref, onNext) => {
        onNext({ exists: () => false, data: () => null });
        return mockUnsubscribe;
      });

      const { result } = renderHook(() =>
        useRealtimeDocument({
          collectionName: 'events',
          documentId: 'non-existent',
        })
      );

      await waitFor(() => {
        expect(result.current.data).toBe(null);
        expect(result.current.status).toBe('success');
      });
    });

    it('devrait se désabonner lors du démontage', async () => {
      const { unmount } = renderHook(() =>
        useRealtimeDocument({
          collectionName: 'events',
          documentId: 'test-doc-id',
        })
      );

      await waitFor(() => {
        expect(onSnapshot).toHaveBeenCalled();
      });

      unmount();

      expect(mockUnsubscribe).toHaveBeenCalled();
    });

    it('devrait permettre de se désabonner manuellement', async () => {
      const { result } = renderHook(() =>
        useRealtimeDocument({
          collectionName: 'events',
          documentId: 'test-doc-id',
        })
      );

      await waitFor(() => {
        expect(result.current.isSubscribed).toBe(true);
      });

      act(() => {
        result.current.unsubscribe();
      });

      expect(mockUnsubscribe).toHaveBeenCalled();
    });

    it('devrait appeler onData callback lors de la réception des données', async () => {
      const onDataMock = jest.fn();

      renderHook(() =>
        useRealtimeDocument({
          collectionName: 'events',
          documentId: 'test-doc-id',
          onData: onDataMock,
        })
      );

      await waitFor(() => {
        expect(onDataMock).toHaveBeenCalledWith(
          expect.objectContaining({
            id: 'test-doc-id',
            title: 'Test Event',
          })
        );
      });
    });
  });

  describe('Error Handling', () => {
    it('devrait gérer les erreurs lors de l\'abonnement', async () => {
      const mockError = { message: 'Subscription error' };

      (onSnapshot as jest.Mock).mockImplementation((ref, onNext, onError) => {
        onError(mockError);
        return mockUnsubscribe;
      });

      const { result } = renderHook(() =>
        useRealtimeDocument({
          collectionName: 'events',
          documentId: 'test-doc-id',
        })
      );

      await waitFor(() => {
        expect(result.current.error).toEqual(mockError);
        expect(result.current.status).toBe('error');
      });
    });

    it('devrait appeler onError callback en cas d\'erreur', async () => {
      const mockError = { message: 'Subscription error' };
      const onErrorMock = jest.fn();

      (onSnapshot as jest.Mock).mockImplementation((ref, onNext, onError) => {
        onError(mockError);
        return mockUnsubscribe;
      });

      renderHook(() =>
        useRealtimeDocument({
          collectionName: 'events',
          documentId: 'test-doc-id',
          onError: onErrorMock,
        })
      );

      await waitFor(() => {
        expect(onErrorMock).toHaveBeenCalledWith(mockError);
      });
    });
  });

  describe('fetchDocument', () => {
    it('devrait récupérer un document manuellement', async () => {
      const { result } = renderHook(() =>
        useRealtimeDocument({
          collectionName: 'events',
          documentId: 'test-doc-id',
          disabled: true,
        })
      );

      let doc: any;
      await act(async () => {
        doc = await result.current.fetchDocument();
      });

      expect(getDoc).toHaveBeenCalled();
      expect(doc).toEqual(
        expect.objectContaining({
          id: 'test-doc-id',
          title: 'Test Event',
        })
      );
    });

    it('devrait retourner null si le document n\'existe pas', async () => {
      (getDoc as jest.Mock).mockResolvedValue({
        exists: () => false,
        data: () => null,
      });

      const { result } = renderHook(() =>
        useRealtimeDocument({
          collectionName: 'events',
          documentId: 'non-existent',
          disabled: true,
        })
      );

      let doc: any;
      await act(async () => {
        doc = await result.current.fetchDocument();
      });

      expect(doc).toBe(null);
    });

    it('devrait gérer les erreurs lors de la récupération', async () => {
      const mockError = new Error('Fetch error');
      (getDoc as jest.Mock).mockRejectedValue(mockError);

      const { result } = renderHook(() =>
        useRealtimeDocument({
          collectionName: 'events',
          documentId: 'test-doc-id',
          disabled: true,
        })
      );

      await act(async () => {
        await result.current.fetchDocument();
      });

      expect(result.current.error).toBeTruthy();
      expect(result.current.status).toBe('error');
    });
  });

  describe('saveDocument', () => {
    it('devrait créer ou mettre à jour un document', async () => {
      const { result } = renderHook(() =>
        useRealtimeDocument({
          collectionName: 'events',
          documentId: 'test-doc-id',
          disabled: true,
        })
      );

      await act(async () => {
        await result.current.saveDocument({ title: 'Updated Event' });
      });

      expect(setDoc).toHaveBeenCalled();
    });

    it('devrait créer un nouveau document sans merge', async () => {
      const { result } = renderHook(() =>
        useRealtimeDocument({
          collectionName: 'events',
          documentId: 'new-doc',
          disabled: true,
        })
      );

      await act(async () => {
        await result.current.saveDocument(
          { title: 'New Event' },
          undefined,
          false
        );
      });

      expect(setDoc).toHaveBeenCalled();
      const setDocCall = (setDoc as jest.Mock).mock.calls[0];
      expect(setDocCall[1]).toHaveProperty('createdAt');
    });

    it('devrait gérer les erreurs lors de la sauvegarde', async () => {
      const mockError = new Error('Save error');
      (setDoc as jest.Mock).mockRejectedValue(mockError);

      const { result } = renderHook(() =>
        useRealtimeDocument({
          collectionName: 'events',
          documentId: 'test-doc-id',
          disabled: true,
        })
      );

      let saveResult: any;
      await act(async () => {
        saveResult = await result.current.saveDocument({ title: 'Test' });
      });

      expect(saveResult).toBe(null);
      expect(result.current.error).toBeTruthy();
    });
  });

  describe('updateDocument', () => {
    it('devrait mettre à jour partiellement un document', async () => {
      const { result } = renderHook(() =>
        useRealtimeDocument({
          collectionName: 'events',
          documentId: 'test-doc-id',
          disabled: true,
        })
      );

      await act(async () => {
        await result.current.updateDocument({ title: 'Updated Title' });
      });

      expect(updateDoc).toHaveBeenCalled();
    });

    it('devrait ajouter un timestamp lors de la mise à jour', async () => {
      const { result } = renderHook(() =>
        useRealtimeDocument({
          collectionName: 'events',
          documentId: 'test-doc-id',
          disabled: true,
        })
      );

      await act(async () => {
        await result.current.updateDocument({ title: 'Updated' });
      });

      const updateCall = (updateDoc as jest.Mock).mock.calls[0];
      expect(updateCall[1]).toHaveProperty('updatedAt');
    });

    it('devrait gérer les erreurs lors de la mise à jour', async () => {
      const mockError = new Error('Update error');
      (updateDoc as jest.Mock).mockRejectedValue(mockError);

      const { result } = renderHook(() =>
        useRealtimeDocument({
          collectionName: 'events',
          documentId: 'test-doc-id',
          disabled: true,
        })
      );

      let updateResult: any;
      await act(async () => {
        updateResult = await result.current.updateDocument({ title: 'Test' });
      });

      expect(updateResult).toBe(null);
      expect(result.current.error).toBeTruthy();
    });
  });

  describe('deleteDocument', () => {
    it('devrait supprimer un document', async () => {
      const { result } = renderHook(() =>
        useRealtimeDocument({
          collectionName: 'events',
          documentId: 'test-doc-id',
          disabled: true,
        })
      );

      let deleteResult: boolean = false;
      await act(async () => {
        deleteResult = await result.current.deleteDocument();
      });

      expect(deleteDoc).toHaveBeenCalled();
      expect(deleteResult).toBe(true);
      expect(result.current.data).toBe(null);
    });

    it('devrait gérer les erreurs lors de la suppression', async () => {
      const mockError = new Error('Delete error');
      (deleteDoc as jest.Mock).mockRejectedValue(mockError);

      const { result } = renderHook(() =>
        useRealtimeDocument({
          collectionName: 'events',
          documentId: 'test-doc-id',
          disabled: true,
        })
      );

      let deleteResult: boolean = true;
      await act(async () => {
        deleteResult = await result.current.deleteDocument();
      });

      expect(deleteResult).toBe(false);
      expect(result.current.error).toBeTruthy();
    });
  });

  describe('Realtime Updates', () => {
    it('devrait mettre à jour les données lors des changements', async () => {
      let onNext: any;

      (onSnapshot as jest.Mock).mockImplementation((ref, nextFn) => {
        onNext = nextFn;
        return mockUnsubscribe;
      });

      const { result } = renderHook(() =>
        useRealtimeDocument({
          collectionName: 'events',
          documentId: 'test-doc-id',
        })
      );

      // Simuler un changement de données
      act(() => {
        onNext({
          id: 'test-doc-id',
          exists: () => true,
          data: () => ({ title: 'Updated Title', date: '2025-02-01' }),
        });
      });

      await waitFor(() => {
        expect(result.current.data?.title).toBe('Updated Title');
      });
    });

    it('devrait mettre à jour data à null si le document est supprimé', async () => {
      let onNext: any;

      (onSnapshot as jest.Mock).mockImplementation((ref, nextFn) => {
        onNext = nextFn;
        return mockUnsubscribe;
      });

      const { result } = renderHook(() =>
        useRealtimeDocument({
          collectionName: 'events',
          documentId: 'test-doc-id',
        })
      );

      // D'abord simuler un document existant
      act(() => {
        onNext(mockDocumentSnapshot);
      });

      await waitFor(() => {
        expect(result.current.data).not.toBe(null);
      });

      // Puis simuler sa suppression
      act(() => {
        onNext({
          id: 'test-doc-id',
          exists: () => false,
          data: () => null,
        });
      });

      await waitFor(() => {
        expect(result.current.data).toBe(null);
      });
    });
  });
});
