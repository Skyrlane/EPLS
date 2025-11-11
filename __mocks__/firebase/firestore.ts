/**
 * Mocks pour Firestore
 * Utilisé dans les tests des hooks Firestore
 */

export const mockDocumentData = {
  id: 'test-doc-id',
  title: 'Test Document',
  content: 'Test content',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockDocumentSnapshot = {
  id: 'test-doc-id',
  exists: () => true,
  data: () => ({ title: 'Test Document', content: 'Test content' }),
  ref: { id: 'test-doc-id', path: 'collection/test-doc-id' },
};

export const mockQuerySnapshot = {
  docs: [mockDocumentSnapshot],
  empty: false,
  size: 1,
  forEach: (callback: (doc: typeof mockDocumentSnapshot) => void) => {
    [mockDocumentSnapshot].forEach(callback);
  },
};

export const mockFirestoreError = (code: string, message: string) => ({
  code,
  message,
  name: 'FirebaseError',
});

// Mocks des fonctions Firestore
export const collection = jest.fn();
export const doc = jest.fn();
export const getDoc = jest.fn();
export const getDocs = jest.fn();
export const setDoc = jest.fn();
export const addDoc = jest.fn();
export const updateDoc = jest.fn();
export const deleteDoc = jest.fn();
export const query = jest.fn();
export const where = jest.fn();
export const orderBy = jest.fn();
export const limit = jest.fn();
export const onSnapshot = jest.fn();
export const serverTimestamp = jest.fn(() => new Date());

// Configuration par défaut pour les tests
export const setupFirestoreMocks = () => {
  collection.mockReturnValue({ path: 'test-collection' });
  doc.mockReturnValue({ id: 'test-doc-id', path: 'test-collection/test-doc-id' });
  getDoc.mockResolvedValue(mockDocumentSnapshot);
  getDocs.mockResolvedValue(mockQuerySnapshot);
  setDoc.mockResolvedValue(undefined);
  addDoc.mockResolvedValue({ id: 'new-doc-id', path: 'test-collection/new-doc-id' });
  updateDoc.mockResolvedValue(undefined);
  deleteDoc.mockResolvedValue(undefined);
  query.mockImplementation((collectionRef, ...constraints) => ({
    ...collectionRef,
    constraints,
  }));
  where.mockImplementation((field, op, value) => ({ type: 'where', field, op, value }));
  orderBy.mockImplementation((field, direction) => ({ type: 'orderBy', field, direction }));
  limit.mockImplementation((count) => ({ type: 'limit', count }));
  onSnapshot.mockImplementation((ref, onNext) => {
    // Simuler l'appel immédiat du callback
    onNext(mockQuerySnapshot);
    // Retourner une fonction unsubscribe
    return jest.fn();
  });
};

// Réinitialiser tous les mocks
export const resetFirestoreMocks = () => {
  jest.clearAllMocks();
};

// Mock pour les snapshots temps réel avec contrôle manuel
export const createMockSnapshot = (docs: any[] = [mockDocumentSnapshot]) => ({
  docs,
  empty: docs.length === 0,
  size: docs.length,
  forEach: (callback: (doc: any) => void) => {
    docs.forEach(callback);
  },
});

// Helper pour simuler des changements temps réel
export const simulateSnapshotChange = (
  mockCallback: jest.Mock,
  docs: any[]
) => {
  const snapshot = createMockSnapshot(docs);
  mockCallback.mock.calls[0][1](snapshot); // Appelle le onNext callback
};
