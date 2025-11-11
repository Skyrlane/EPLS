import '@testing-library/jest-dom';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useFirebaseAuth } from '../use-firebase-auth';

// Mock de Firebase Auth
jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  updateProfile: jest.fn(),
  updateEmail: jest.fn(),
  updatePassword: jest.fn(),
  deleteUser: jest.fn(),
  sendEmailVerification: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

jest.mock('@/lib/firebase', () => ({
  auth: { currentUser: null },
}));

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  updatePassword,
  deleteUser,
  sendEmailVerification,
  onAuthStateChanged,
} from 'firebase/auth';

// Mock data
const mockUser = {
  uid: 'test-uid-123',
  email: 'test@example.com',
  displayName: 'Test User',
  photoURL: null,
  emailVerified: false,
};

const mockUserCredential = {
  user: mockUser,
  providerId: 'password',
  operationType: 'signIn' as const,
};

describe('useFirebaseAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('devrait initialiser avec un état unauthenticated', async () => {
      (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
        callback(null);
        return jest.fn();
      });

      const { result } = renderHook(() => useFirebaseAuth());

      await waitFor(() => {
        expect(result.current.status).toBe('unauthenticated');
        expect(result.current.user).toBeNull();
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('devrait initialiser avec un utilisateur authentifié', async () => {
      (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
        callback(mockUser);
        return jest.fn();
      });

      const { result } = renderHook(() => useFirebaseAuth());

      await waitFor(() => {
        expect(result.current.status).toBe('authenticated');
        expect(result.current.user).toEqual(mockUser);
        expect(result.current.isAuthenticated).toBe(true);
      });
    });

    it('devrait appeler onAuthStateChange callback', async () => {
      const mockCallback = jest.fn();
      (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
        callback(mockUser);
        return jest.fn();
      });

      renderHook(() =>
        useFirebaseAuth({
          onAuthStateChange: mockCallback,
        })
      );

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(mockUser);
      });
    });
  });

  describe('register', () => {
    it('devrait créer un nouvel utilisateur', async () => {
      (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue(
        mockUserCredential
      );
      (updateProfile as jest.Mock).mockResolvedValue(undefined);
      (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
        callback(null);
        return jest.fn();
      });

      const { result } = renderHook(() => useFirebaseAuth());

      let userCredential: any;
      await act(async () => {
        userCredential = await result.current.register(
          'test@example.com',
          'password123',
          'Test User'
        );
      });

      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        'test@example.com',
        'password123'
      );
      expect(updateProfile).toHaveBeenCalledWith(mockUser, {
        displayName: 'Test User',
      });
      expect(userCredential).toEqual(mockUserCredential);
    });

    it('devrait gérer les erreurs d\'inscription', async () => {
      const error = {
        code: 'auth/email-already-in-use',
        message: 'Email already in use',
        name: 'FirebaseError',
      };
      (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue(error);
      (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
        callback(null);
        return jest.fn();
      });

      const { result } = renderHook(() => useFirebaseAuth());

      let userCredential: any;
      await act(async () => {
        userCredential = await result.current.register(
          'existing@example.com',
          'password123'
        );
      });

      expect(userCredential).toBeNull();
      expect(result.current.status).toBe('error');
      expect(result.current.error).toEqual(error);
    });

    it('devrait appeler onError callback en cas d\'erreur', async () => {
      const error = { code: 'auth/weak-password', message: 'Password too weak', name: 'FirebaseError' };
      const mockErrorCallback = jest.fn();
      (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue(error);
      (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
        callback(null);
        return jest.fn();
      });

      const { result } = renderHook(() =>
        useFirebaseAuth({
          onError: mockErrorCallback,
        })
      );

      await act(async () => {
        await result.current.register('test@example.com', 'weak');
      });

      expect(mockErrorCallback).toHaveBeenCalledWith(error);
    });
  });

  describe('login', () => {
    it('devrait connecter un utilisateur', async () => {
      (signInWithEmailAndPassword as jest.Mock).mockResolvedValue(
        mockUserCredential
      );
      (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
        callback(null);
        return jest.fn();
      });

      const { result } = renderHook(() => useFirebaseAuth());

      let userCredential: any;
      await act(async () => {
        userCredential = await result.current.login(
          'test@example.com',
          'password123'
        );
      });

      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        'test@example.com',
        'password123'
      );
      expect(userCredential).toEqual(mockUserCredential);
    });

    it('devrait gérer les erreurs de connexion', async () => {
      const error = { code: 'auth/wrong-password', message: 'Wrong password', name: 'FirebaseError' };
      (signInWithEmailAndPassword as jest.Mock).mockRejectedValue(error);
      (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
        callback(null);
        return jest.fn();
      });

      const { result } = renderHook(() => useFirebaseAuth());

      let userCredential: any;
      await act(async () => {
        userCredential = await result.current.login(
          'test@example.com',
          'wrongpassword'
        );
      });

      expect(userCredential).toBeNull();
      expect(result.current.status).toBe('error');
      expect(result.current.error).toEqual(error);
    });
  });

  describe('logout', () => {
    it('devrait déconnecter un utilisateur', async () => {
      (signOut as jest.Mock).mockResolvedValue(undefined);
      (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
        callback(mockUser);
        return jest.fn();
      });

      const { result } = renderHook(() => useFirebaseAuth());

      let success: boolean;
      await act(async () => {
        success = await result.current.logout();
      });

      expect(signOut).toHaveBeenCalled();
      expect(success!).toBe(true);
    });

    it('devrait gérer les erreurs de déconnexion', async () => {
      const error = { code: 'auth/network-error', message: 'Network error', name: 'FirebaseError' };
      (signOut as jest.Mock).mockRejectedValue(error);
      (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
        callback(mockUser);
        return jest.fn();
      });

      const { result } = renderHook(() => useFirebaseAuth());

      let success: boolean;
      await act(async () => {
        success = await result.current.logout();
      });

      expect(success!).toBe(false);
      expect(result.current.status).toBe('error');
    });
  });

  describe('resetPassword', () => {
    it('devrait envoyer un email de réinitialisation', async () => {
      (sendPasswordResetEmail as jest.Mock).mockResolvedValue(undefined);
      (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
        callback(null);
        return jest.fn();
      });

      const { result } = renderHook(() => useFirebaseAuth());

      let success: boolean;
      await act(async () => {
        success = await result.current.resetPassword('test@example.com');
      });

      expect(sendPasswordResetEmail).toHaveBeenCalledWith(
        expect.anything(),
        'test@example.com'
      );
      expect(success!).toBe(true);
    });

    it('devrait gérer les erreurs de réinitialisation', async () => {
      const error = { code: 'auth/user-not-found', message: 'User not found', name: 'FirebaseError' };
      (sendPasswordResetEmail as jest.Mock).mockRejectedValue(error);
      (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
        callback(null);
        return jest.fn();
      });

      const { result } = renderHook(() => useFirebaseAuth());

      let success: boolean;
      await act(async () => {
        success = await result.current.resetPassword('nonexistent@example.com');
      });

      expect(success!).toBe(false);
      expect(result.current.error).toEqual(error);
    });
  });

  describe('updateUserProfile', () => {
    it('devrait mettre à jour le profil utilisateur', async () => {
      (updateProfile as jest.Mock).mockResolvedValue(undefined);
      (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
        callback(mockUser);
        return jest.fn();
      });

      const { result } = renderHook(() => useFirebaseAuth());

      await waitFor(() => {
        expect(result.current.user).not.toBeNull();
      });

      let success: boolean;
      await act(async () => {
        success = await result.current.updateUserProfile({
          displayName: 'Updated Name',
        });
      });

      expect(updateProfile).toHaveBeenCalledWith(mockUser, {
        displayName: 'Updated Name',
      });
      expect(success!).toBe(true);
    });

    it('devrait lever une erreur si aucun utilisateur n\'est connecté', async () => {
      (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
        callback(null);
        return jest.fn();
      });

      const { result } = renderHook(() => useFirebaseAuth());

      await waitFor(() => {
        expect(result.current.user).toBeNull();
      });

      await expect(async () => {
        await act(async () => {
          await result.current.updateUserProfile({ displayName: 'New Name' });
        });
      }).rejects.toThrow('Aucun utilisateur connecté');
    });
  });

  describe('updateUserEmail', () => {
    it('devrait mettre à jour l\'email de l\'utilisateur', async () => {
      (updateEmail as jest.Mock).mockResolvedValue(undefined);
      (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
        callback(mockUser);
        return jest.fn();
      });

      const { result } = renderHook(() => useFirebaseAuth());

      await waitFor(() => {
        expect(result.current.user).not.toBeNull();
      });

      let success: boolean;
      await act(async () => {
        success = await result.current.updateUserEmail('newemail@example.com');
      });

      expect(updateEmail).toHaveBeenCalledWith(mockUser, 'newemail@example.com');
      expect(success!).toBe(true);
    });
  });

  describe('updateUserPassword', () => {
    it('devrait mettre à jour le mot de passe', async () => {
      (updatePassword as jest.Mock).mockResolvedValue(undefined);
      (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
        callback(mockUser);
        return jest.fn();
      });

      const { result } = renderHook(() => useFirebaseAuth());

      await waitFor(() => {
        expect(result.current.user).not.toBeNull();
      });

      let success: boolean;
      await act(async () => {
        success = await result.current.updateUserPassword('newpassword123');
      });

      expect(updatePassword).toHaveBeenCalledWith(mockUser, 'newpassword123');
      expect(success!).toBe(true);
    });
  });

  describe('deleteUserAccount', () => {
    it('devrait supprimer le compte utilisateur', async () => {
      (deleteUser as jest.Mock).mockResolvedValue(undefined);
      (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
        callback(mockUser);
        return jest.fn();
      });

      const { result } = renderHook(() => useFirebaseAuth());

      await waitFor(() => {
        expect(result.current.user).not.toBeNull();
      });

      let success: boolean;
      await act(async () => {
        success = await result.current.deleteUserAccount();
      });

      expect(deleteUser).toHaveBeenCalledWith(mockUser);
      expect(success!).toBe(true);
    });
  });

  describe('sendVerificationEmail', () => {
    it('devrait envoyer un email de vérification', async () => {
      (sendEmailVerification as jest.Mock).mockResolvedValue(undefined);
      (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
        callback(mockUser);
        return jest.fn();
      });

      const { result } = renderHook(() => useFirebaseAuth());

      await waitFor(() => {
        expect(result.current.user).not.toBeNull();
      });

      let success: boolean;
      await act(async () => {
        success = await result.current.sendVerificationEmail();
      });

      expect(sendEmailVerification).toHaveBeenCalledWith(mockUser);
      expect(success!).toBe(true);
    });
  });

  describe('getErrorMessage', () => {
    it('devrait retourner le message d\'erreur traduit', () => {
      (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
        callback(null);
        return jest.fn();
      });

      const { result } = renderHook(() => useFirebaseAuth());

      const message = result.current.getErrorMessage('auth/user-not-found');
      expect(message).toBe('Aucun utilisateur trouvé avec cet email');
    });

    it('devrait retourner un message par défaut pour les codes inconnus', () => {
      (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
        callback(null);
        return jest.fn();
      });

      const { result } = renderHook(() => useFirebaseAuth());

      const message = result.current.getErrorMessage('auth/unknown-error');
      expect(message).toBe('Erreur: auth/unknown-error');
    });

    it('devrait retourner un message par défaut si aucun code', () => {
      (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
        callback(null);
        return jest.fn();
      });

      const { result } = renderHook(() => useFirebaseAuth());

      const message = result.current.getErrorMessage();
      expect(message).toBe('Une erreur inconnue s\'est produite');
    });
  });
});
