import '@testing-library/jest-dom';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useRealtimeCollection } from '../use-realtime-collection';

// Mock de Firestore
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  onSnapshot: jest.fn(),
  orderBy: jest.fn(),
  where: jest.fn(),
  limit: jest.fn(),
}));

jest.mock('@/lib/firebase', () => ({
  firestore: { type: 'firestore' },
}));

import { collection, query, onSnapshot, orderBy, where, limit } from 'firebase/firestore';

// Mock data
const mockDocumentSnapshot = {
  id: 'test-doc-id',
  data: () => ({ title: 'Test Document' }),
};

const mockQuerySnapshot = {
  docs: [mockDocumentSnapshot],
  empty: false,
  size: 1,
};

const createMockSnapshot = (docs: any[]) => ({
  docs,
  empty: docs.length === 0,
  size: docs.length,
});

describe('useRealtimeCollection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (collection as jest.Mock).mockReturnValue({ path: 'test-collection' });
    (query as jest.Mock).mockImplementation((ref, ...constraints) => ({ ...ref, constraints }));
    (where as jest.Mock).mockImplementation((field, op, value) => ({ type: 'where', field, op, value }));
    (orderBy as jest.Mock).mockImplementation((field, direction) => ({ type: 'orderBy', field, direction }));
    (limit as jest.Mock).mockImplementation((count) => ({ type: 'limit', count }));
  });

  describe('Initialization', () => {
    it('devrait initialiser et s\'abonner automatiquement', async () => {
      const mockUnsubscribe = jest.fn();
      (onSnapshot as jest.Mock).mockImplementation((ref, onNext) => {
        onNext(mockQuerySnapshot);
        return mockUnsubscribe;
      });

      const { result } = renderHook(() =>
        useRealtimeCollection({ collectionName: 'events' })
      );

      await waitFor(() => {
        expect(result.current.status).toBe('success');
        expect(result.current.data).toHaveLength(1);
        expect(result.current.isSubscribed).toBe(true);
      });

      expect(onSnapshot).toHaveBeenCalled();
    });

    it('ne devrait pas s\'abonner si disabled=true', () => {
      const { result } = renderHook(() =>
        useRealtimeCollection({
          collectionName: 'events',
          disabled: true,
        })
      );

      expect(result.current.status).toBe('idle');
      expect(result.current.isSubscribed).toBe(false);
      expect(onSnapshot).not.toHaveBeenCalled();
    });

    it('devrait utiliser le champ ID personnalisé', async () => {
      const customMockSnapshot = {
        docs: [
          {
            id: 'custom-id',
            data: () => ({ title: 'Custom Document' }),
          },
        ],
      };

      (onSnapshot as jest.Mock).mockImplementation((ref, onNext) => {
        onNext(customMockSnapshot);
        return jest.fn();
      });

      const { result } = renderHook(() =>
        useRealtimeCollection<{ customId: string; title: string }>({
          collectionName: 'events',
          idField: 'customId',
        })
      );

      await waitFor(() => {
        expect(result.current.data[0]).toEqual(
          expect.objectContaining({
            customId: 'custom-id',
            title: 'Custom Document',
          })
        );
      });
    });
  });

  describe('Query Constraints', () => {
    it('devrait appliquer les contraintes de requête', async () => {
      const mockConstraints = [
        where('status', '==', 'published'),
        orderBy('date', 'desc'),
        limit(10),
      ];

      (onSnapshot as jest.Mock).mockImplementation((ref, onNext) => {
        onNext(mockQuerySnapshot);
        return jest.fn();
      });

      renderHook(() =>
        useRealtimeCollection({
          collectionName: 'events',
          queryConstraints: mockConstraints,
        })
      );

      await waitFor(() => {
        expect(query).toHaveBeenCalledWith(
          expect.anything(),
          ...mockConstraints
        );
      });
    });

    it('devrait fonctionner sans contraintes de requête', async () => {
      (onSnapshot as jest.Mock).mockImplementation((ref, onNext) => {
        onNext(mockQuerySnapshot);
        return jest.fn();
      });

      const { result } = renderHook(() =>
        useRealtimeCollection({ collectionName: 'events' })
      );

      await waitFor(() => {
        expect(result.current.status).toBe('success');
      });

      expect(query).toHaveBeenCalledWith(expect.anything());
    });
  });

  describe('Realtime Updates', () => {
    it('devrait mettre à jour les données lors des changements', async () => {
      let snapshotCallback: any;

      (onSnapshot as jest.Mock).mockImplementation((ref, onNext) => {
        snapshotCallback = onNext;
        onNext(mockQuerySnapshot);
        return jest.fn();
      });

      const { result } = renderHook(() =>
        useRealtimeCollection({ collectionName: 'events' })
      );

      await waitFor(() => {
        expect(result.current.data).toHaveLength(1);
      });

      // Simuler un changement avec de nouvelles données
      const newSnapshot = createMockSnapshot([
        {
          id: 'doc-1',
          data: () => ({ title: 'Doc 1' }),
        },
        {
          id: 'doc-2',
          data: () => ({ title: 'Doc 2' }),
        },
      ]);

      act(() => {
        snapshotCallback(newSnapshot);
      });

      expect(result.current.data).toHaveLength(2);
      expect(result.current.data[1]).toEqual(
        expect.objectContaining({
          id: 'doc-2',
          title: 'Doc 2',
        })
      );
    });

    it('devrait appeler onData callback lors des changements', async () => {
      const mockOnData = jest.fn();
      let snapshotCallback: any;

      (onSnapshot as jest.Mock).mockImplementation((ref, onNext) => {
        snapshotCallback = onNext;
        onNext(mockQuerySnapshot);
        return jest.fn();
      });

      renderHook(() =>
        useRealtimeCollection({
          collectionName: 'events',
          onData: mockOnData,
        })
      );

      await waitFor(() => {
        expect(mockOnData).toHaveBeenCalled();
      });

      const firstCallData = mockOnData.mock.calls[0][0];
      expect(firstCallData).toHaveLength(1);
    });

    it('devrait gérer les collections vides', async () => {
      const emptySnapshot = createMockSnapshot([]);

      (onSnapshot as jest.Mock).mockImplementation((ref, onNext) => {
        onNext(emptySnapshot);
        return jest.fn();
      });

      const { result } = renderHook(() =>
        useRealtimeCollection({ collectionName: 'events' })
      );

      await waitFor(() => {
        expect(result.current.status).toBe('success');
        expect(result.current.data).toHaveLength(0);
      });
    });
  });

  describe('Error Handling', () => {
    it('devrait gérer les erreurs Firestore', async () => {
      const error = { code: 'permission-denied', message: 'Permission denied', name: 'FirebaseError' };

      (onSnapshot as jest.Mock).mockImplementation((ref, onNext, onError) => {
        onError(error);
        return jest.fn();
      });

      const { result } = renderHook(() =>
        useRealtimeCollection({ collectionName: 'events' })
      );

      await waitFor(() => {
        expect(result.current.status).toBe('error');
        expect(result.current.error).toEqual(error);
      });
    });

    it('devrait appeler onError callback en cas d\'erreur', async () => {
      const error = { code: 'unavailable', message: 'Service unavailable', name: 'FirebaseError' };
      const mockOnError = jest.fn();

      (onSnapshot as jest.Mock).mockImplementation((ref, onNext, onError) => {
        onError(error);
        return jest.fn();
      });

      renderHook(() =>
        useRealtimeCollection({
          collectionName: 'events',
          onError: mockOnError,
        })
      );

      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalledWith(error);
      });
    });
  });

  describe('Subscription Management', () => {
    it('devrait se désabonner lors du démontage', async () => {
      const mockUnsubscribe = jest.fn();

      (onSnapshot as jest.Mock).mockImplementation((ref, onNext) => {
        onNext(mockQuerySnapshot);
        return mockUnsubscribe;
      });

      const { unmount } = renderHook(() =>
        useRealtimeCollection({ collectionName: 'events' })
      );

      await waitFor(() => {
        expect(onSnapshot).toHaveBeenCalled();
      });

      unmount();

      expect(mockUnsubscribe).toHaveBeenCalled();
    });

    it('devrait permettre de se désabonner manuellement', async () => {
      const mockUnsubscribe = jest.fn();

      (onSnapshot as jest.Mock).mockImplementation((ref, onNext) => {
        onNext(mockQuerySnapshot);
        return mockUnsubscribe;
      });

      const { result } = renderHook(() =>
        useRealtimeCollection({ collectionName: 'events' })
      );

      await waitFor(() => {
        expect(result.current.isSubscribed).toBe(true);
      });

      act(() => {
        result.current.unsubscribe();
      });

      expect(mockUnsubscribe).toHaveBeenCalled();
    });

    it('devrait permettre de se réabonner manuellement', async () => {
      const mockUnsubscribe = jest.fn();

      (onSnapshot as jest.Mock).mockImplementation((ref, onNext) => {
        onNext(mockQuerySnapshot);
        return mockUnsubscribe;
      });

      const { result } = renderHook(() =>
        useRealtimeCollection({
          collectionName: 'events',
          disabled: true,
        })
      );

      expect(result.current.isSubscribed).toBe(false);

      await act(async () => {
        result.current.subscribe();
      });

      await waitFor(() => {
        expect(result.current.isSubscribed).toBe(true);
      });
    });
  });

  describe('updateQueryConstraints', () => {
    it('devrait mettre à jour les contraintes de requête', async () => {
      const mockUnsubscribe = jest.fn();

      (onSnapshot as jest.Mock).mockImplementation((ref, onNext) => {
        onNext(mockQuerySnapshot);
        return mockUnsubscribe;
      });

      const { result } = renderHook(() =>
        useRealtimeCollection({ collectionName: 'events' })
      );

      await waitFor(() => {
        expect(result.current.isSubscribed).toBe(true);
      });

      const newConstraints = [where('status', '==', 'draft')];

      await act(async () => {
        result.current.updateQueryConstraints(newConstraints);
      });

      // Devrait désabonner l'ancien et créer un nouvel abonnement
      expect(mockUnsubscribe).toHaveBeenCalled();
      expect(onSnapshot).toHaveBeenCalledTimes(2);
    });

    it('devrait mettre à jour les données avec les nouvelles contraintes', async () => {
      let callCount = 0;

      (onSnapshot as jest.Mock).mockImplementation((ref, onNext) => {
        callCount++;
        if (callCount === 1) {
          onNext(mockQuerySnapshot);
        } else {
          const newSnapshot = createMockSnapshot([
            {
              id: 'draft-doc',
              data: () => ({ title: 'Draft Document', status: 'draft' }),
            },
          ]);
          onNext(newSnapshot);
        }
        return jest.fn();
      });

      const { result } = renderHook(() =>
        useRealtimeCollection({ collectionName: 'events' })
      );

      await waitFor(() => {
        expect(result.current.data).toHaveLength(1);
      });

      const newConstraints = [where('status', '==', 'draft')];

      await act(async () => {
        result.current.updateQueryConstraints(newConstraints);
      });

      await waitFor(() => {
        expect(result.current.data[0]).toEqual(
          expect.objectContaining({
            id: 'draft-doc',
            status: 'draft',
          })
        );
      });
    });
  });

  describe('getDocumentById', () => {
    it('devrait retourner un document par son ID', async () => {
      const customSnapshot = createMockSnapshot([
        {
          id: 'doc-1',
          data: () => ({ title: 'Document 1' }),
        },
        {
          id: 'doc-2',
          data: () => ({ title: 'Document 2' }),
        },
      ]);

      (onSnapshot as jest.Mock).mockImplementation((ref, onNext) => {
        onNext(customSnapshot);
        return jest.fn();
      });

      const { result } = renderHook(() =>
        useRealtimeCollection({ collectionName: 'events' })
      );

      await waitFor(() => {
        expect(result.current.data).toHaveLength(2);
      });

      const doc = result.current.getDocumentById('doc-2');

      expect(doc).toEqual(
        expect.objectContaining({
          id: 'doc-2',
          title: 'Document 2',
        })
      );
    });

    it('devrait retourner undefined si le document n\'existe pas', async () => {
      (onSnapshot as jest.Mock).mockImplementation((ref, onNext) => {
        onNext(mockQuerySnapshot);
        return jest.fn();
      });

      const { result } = renderHook(() =>
        useRealtimeCollection({ collectionName: 'events' })
      );

      await waitFor(() => {
        expect(result.current.data).toHaveLength(1);
      });

      const doc = result.current.getDocumentById('nonexistent-id');

      expect(doc).toBeUndefined();
    });
  });
});
