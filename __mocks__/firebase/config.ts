/**
 * Mock de la configuration Firebase
 * Utilisé dans tous les tests nécessitant Firebase
 */

export const mockFirebaseApp = {
  name: '[DEFAULT]',
  options: {},
  automaticDataCollectionEnabled: false,
};

export const mockAuth = {
  app: mockFirebaseApp,
  currentUser: null,
  config: {
    apiKey: 'mock-api-key',
    authDomain: 'mock-project.firebaseapp.com',
  },
};

export const mockFirestore = {
  app: mockFirebaseApp,
  type: 'firestore',
};

export const mockStorage = {
  app: mockFirebaseApp,
  maxOperationRetryTime: 120000,
  maxUploadRetryTime: 600000,
};

// Mock de l'instance app
export const app = mockFirebaseApp;

// Mock de l'instance auth
export const auth = mockAuth;

// Mock de l'instance firestore
export const firestore = mockFirestore;

// Mock de l'instance storage
export const storage = mockStorage;
