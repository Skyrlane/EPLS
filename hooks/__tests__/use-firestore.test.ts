import '@testing-library/jest-dom';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useFirestore } from '../use-firestore';

// Mock de Firebase
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  setDoc: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  onSnapshot: jest.fn(),
  serverTimestamp: jest.fn(() => new Date()),
}));

jest.mock('@/lib/firebase', () => ({
  firestore: { type: 'firestore' },
}));

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';

// Mock data
const mockDocumentSnapshot = {
  id: 'test-doc-id',
  exists: () => true,
  data: () => ({ title: 'Test Document', content: 'Test content' }),
};

const mockQuerySnapshot = {
  docs: [mockDocumentSnapshot],
  empty: false,
  size: 1,
};

describe('useFirestore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Setup default mocks
    (collection as jest.Mock).mockReturnValue({ path: 'test-collection' });
    (doc as jest.Mock).mockReturnValue({ id: 'test-doc-id' });
    (query as jest.Mock).mockImplementation((ref, ...constraints) => ({ ...ref, constraints }));
    (where as jest.Mock).mockImplementation((field, op, value) => ({ type: 'where', field, op, value }));
    (orderBy as jest.Mock).mockImplementation((field, direction) => ({ type: 'orderBy', field, direction }));
    (limit as jest.Mock).mockImplementation((count) => ({ type: 'limit', count }));
  });

  describe('getDocument', () => {
    it('devrait récupérer un document par son ID', async () => {
      (getDoc as jest.Mock).mockResolvedValue(mockDocumentSnapshot);

      const { result } = renderHook(() =>
        useFirestore({ collectionName: 'events' })
      );

      let document: any;
      await act(async () => {
        document = await result.current.getDocument('test-doc-id');
      });

      expect(getDoc).toHaveBeenCalled();
      expect(document).toEqual(
        expect.objectContaining({
          id: 'test-doc-id',
          title: 'Test Document',
        })
      );
      expect(result.current.status).toBe('success');
    });

    it('devrait retourner null si le document n\'existe pas', async () => {
      (getDoc as jest.Mock).mockResolvedValue({
        exists: () => false,
        data: () => null,
      });

      const { result } = renderHook(() =>
        useFirestore({ collectionName: 'events' })
      );

      let document: any;
      await act(async () => {
        document = await result.current.getDocument('nonexistent-id');
      });

      expect(document).toBeNull();
      expect(result.current.status).toBe('success');
    });

    it('devrait gérer les erreurs correctement', async () => {
      const error = { code: 'permission-denied', message: 'Permission denied', name: 'FirebaseError' };
      (getDoc as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() =>
        useFirestore({ collectionName: 'events' })
      );

      await act(async () => {
        await result.current.getDocument('test-doc-id');
      });

      expect(result.current.status).toBe('error');
      expect(result.current.error).toEqual(error);
    });
  });

  describe('getDocuments', () => {
    it('devrait récupérer plusieurs documents', async () => {
      (getDocs as jest.Mock).mockResolvedValue(mockQuerySnapshot);

      const { result } = renderHook(() =>
        useFirestore({ collectionName: 'events' })
      );

      let documents: any[];
      await act(async () => {
        documents = await result.current.getDocuments();
      });

      expect(getDocs).toHaveBeenCalled();
      expect(documents!).toHaveLength(1);
      expect(result.current.status).toBe('success');
    });

    it('devrait retourner un tableau vide en cas d\'erreur', async () => {
      const error = { code: 'unavailable', message: 'Service unavailable', name: 'FirebaseError' };
      (getDocs as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() =>
        useFirestore({ collectionName: 'events' })
      );

      let documents: any[];
      await act(async () => {
        documents = await result.current.getDocuments();
      });

      expect(documents!).toEqual([]);
      expect(result.current.status).toBe('error');
    });
  });

  describe('setDocument', () => {
    it('devrait créer/remplacer un document avec un ID spécifique', async () => {
      (setDoc as jest.Mock).mockResolvedValue(undefined);

      const { result } = renderHook(() =>
        useFirestore<{ title: string; content: string }>({
          collectionName: 'events',
        })
      );

      let newDoc: any;
      await act(async () => {
        newDoc = await result.current.setDocument('custom-id', {
          title: 'New Event',
          content: 'Event content',
        });
      });

      expect(setDoc).toHaveBeenCalled();
      expect(newDoc).toEqual(
        expect.objectContaining({
          id: 'custom-id',
          title: 'New Event',
        })
      );
      expect(result.current.status).toBe('success');
    });

    it('devrait gérer l\'option merge', async () => {
      (setDoc as jest.Mock).mockResolvedValue(undefined);

      const { result } = renderHook(() =>
        useFirestore({ collectionName: 'events' })
      );

      await act(async () => {
        await result.current.setDocument(
          'test-id',
          { title: 'Updated' },
          true // merge = true
        );
      });

      expect(setDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ title: 'Updated' }),
        { merge: true }
      );
    });
  });

  describe('addDocument', () => {
    it('devrait créer un document avec un ID auto-généré', async () => {
      (addDoc as jest.Mock).mockResolvedValue({
        id: 'auto-generated-id',
        path: 'events/auto-generated-id',
      });

      const { result } = renderHook(() =>
        useFirestore<{ title: string }>({ collectionName: 'events' })
      );

      let newDoc: any;
      await act(async () => {
        newDoc = await result.current.addDocument({ title: 'New Event' });
      });

      expect(addDoc).toHaveBeenCalled();
      expect(newDoc).toEqual(
        expect.objectContaining({
          id: 'auto-generated-id',
          title: 'New Event',
        })
      );
      expect(result.current.status).toBe('success');
    });

    it('devrait retourner null en cas d\'erreur', async () => {
      const error = { code: 'permission-denied', message: 'Permission denied', name: 'FirebaseError' };
      (addDoc as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() =>
        useFirestore({ collectionName: 'events' })
      );

      let newDoc: any;
      await act(async () => {
        newDoc = await result.current.addDocument({ title: 'New Event' });
      });

      expect(newDoc).toBeNull();
      expect(result.current.status).toBe('error');
    });
  });

  describe('updateDocument', () => {
    it('devrait mettre à jour un document existant', async () => {
      (updateDoc as jest.Mock).mockResolvedValue(undefined);
      (getDoc as jest.Mock).mockResolvedValue({
        exists: () => true,
        id: 'test-doc-id',
        data: () => ({ title: 'Updated Title', content: 'Original content' }),
      });

      const { result } = renderHook(() =>
        useFirestore({ collectionName: 'events' })
      );

      await act(async () => {
        await result.current.updateDocument('test-doc-id', {
          title: 'Updated Title',
        });
      });

      expect(updateDoc).toHaveBeenCalled();
      expect(result.current.status).toBe('success');
    });

    it('devrait gérer les erreurs de mise à jour', async () => {
      const error = { code: 'not-found', message: 'Document not found', name: 'FirebaseError' };
      (updateDoc as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() =>
        useFirestore({ collectionName: 'events' })
      );

      await act(async () => {
        await result.current.updateDocument('nonexistent-id', { title: 'New' });
      });

      expect(result.current.status).toBe('error');
      expect(result.current.error).toEqual(error);
    });
  });

  describe('deleteDocument', () => {
    it('devrait supprimer un document', async () => {
      (deleteDoc as jest.Mock).mockResolvedValue(undefined);

      const { result } = renderHook(() =>
        useFirestore({ collectionName: 'events' })
      );

      let success: boolean;
      await act(async () => {
        success = await result.current.deleteDocument('test-doc-id');
      });

      expect(deleteDoc).toHaveBeenCalled();
      expect(success!).toBe(true);
      expect(result.current.status).toBe('success');
      expect(result.current.data).toBeNull();
    });

    it('devrait retourner false en cas d\'erreur de suppression', async () => {
      const error = { code: 'permission-denied', message: 'Permission denied', name: 'FirebaseError' };
      (deleteDoc as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() =>
        useFirestore({ collectionName: 'events' })
      );

      let success: boolean;
      await act(async () => {
        success = await result.current.deleteDocument('test-doc-id');
      });

      expect(success!).toBe(false);
      expect(result.current.status).toBe('error');
    });
  });

  describe('subscribeToCollection', () => {
    it('devrait s\'abonner aux changements d\'une collection', async () => {
      const mockUnsubscribe = jest.fn();
      (onSnapshot as jest.Mock).mockImplementation((ref, onNext) => {
        onNext(mockQuerySnapshot);
        return mockUnsubscribe;
      });

      const { result } = renderHook(() =>
        useFirestore({ collectionName: 'events' })
      );

      const mockCallback = jest.fn();

      await act(async () => {
        result.current.subscribeToCollection([], mockCallback);
      });

      expect(onSnapshot).toHaveBeenCalled();
      expect(mockCallback).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ id: 'test-doc-id' }),
        ])
      );
    });
  });

  describe('Helper functions', () => {
    it('devrait créer des contraintes where', () => {
      const { result } = renderHook(() =>
        useFirestore({ collectionName: 'events' })
      );

      const constraint = result.current.createWhereConstraint(
        'status',
        '==',
        'published'
      );

      expect(constraint).toBeDefined();
    });

    it('devrait créer des contraintes orderBy', () => {
      const { result } = renderHook(() =>
        useFirestore({ collectionName: 'events' })
      );

      const constraint = result.current.createOrderConstraint('date', 'desc');

      expect(constraint).toBeDefined();
    });

    it('devrait créer des contraintes limit', () => {
      const { result } = renderHook(() =>
        useFirestore({ collectionName: 'events' })
      );

      const constraint = result.current.createLimitConstraint(10);

      expect(constraint).toBeDefined();
    });
  });
});
