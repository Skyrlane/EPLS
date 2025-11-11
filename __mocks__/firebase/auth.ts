/**
 * Mocks pour Firebase Authentication
 * Utilisé dans les tests des hooks d'authentification
 */

export const mockUser = {
  uid: 'test-uid-123',
  email: 'test@example.com',
  displayName: 'Test User',
  photoURL: null,
  emailVerified: false,
  phoneNumber: null,
  providerData: [],
  metadata: {
    creationTime: new Date().toISOString(),
    lastSignInTime: new Date().toISOString(),
  },
};

export const mockUserCredential = {
  user: mockUser,
  providerId: 'password',
  operationType: 'signIn' as const,
};

export const mockAuthError = (code: string, message: string) => ({
  code,
  message,
  name: 'FirebaseError',
});

// Mocks des fonctions Firebase Auth
export const createUserWithEmailAndPassword = jest.fn();
export const signInWithEmailAndPassword = jest.fn();
export const signOut = jest.fn();
export const sendPasswordResetEmail = jest.fn();
export const updateProfile = jest.fn();
export const updateEmail = jest.fn();
export const updatePassword = jest.fn();
export const deleteUser = jest.fn();
export const sendEmailVerification = jest.fn();
export const onAuthStateChanged = jest.fn();

// Configuration par défaut pour les tests
export const setupAuthMocks = () => {
  createUserWithEmailAndPassword.mockResolvedValue(mockUserCredential);
  signInWithEmailAndPassword.mockResolvedValue(mockUserCredential);
  signOut.mockResolvedValue(undefined);
  sendPasswordResetEmail.mockResolvedValue(undefined);
  updateProfile.mockResolvedValue(undefined);
  updateEmail.mockResolvedValue(undefined);
  updatePassword.mockResolvedValue(undefined);
  deleteUser.mockResolvedValue(undefined);
  sendEmailVerification.mockResolvedValue(undefined);
  onAuthStateChanged.mockImplementation((auth, callback) => {
    callback(null);
    return jest.fn(); // unsubscribe function
  });
};

// Réinitialiser tous les mocks
export const resetAuthMocks = () => {
  jest.clearAllMocks();
};
