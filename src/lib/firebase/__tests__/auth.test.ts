import '@testing-library/jest-dom';
import { signIn, signUp, signOut, resetPassword } from '../auth';
import { auth } from '../config';

// Mock des fonctions Firebase
jest.mock('../config', () => ({
  auth: {
    currentUser: null,
  },
}));

jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  updateProfile: jest.fn(),
}));

import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';

describe('Service Auth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('signIn appelle Firebase signInWithEmailAndPassword', async () => {
    const mockUserCredential = { user: { uid: '123' } };
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValue(mockUserCredential);

    const result = await signIn('test@example.com', 'password');

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', 'password');
    expect(result).toEqual(mockUserCredential);
  });

  it('signIn gère les erreurs correctement', async () => {
    const mockError = new Error('auth/invalid-credential');
    (signInWithEmailAndPassword as jest.Mock).mockRejectedValue(mockError);

    await expect(signIn('test@example.com', 'wrong-password')).rejects.toThrow('auth/invalid-credential');
  });

  it('signUp appelle Firebase createUserWithEmailAndPassword et updateProfile', async () => {
    const mockUser = { uid: '123' };
    const mockUserCredential = { user: mockUser };
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue(mockUserCredential);
    (updateProfile as jest.Mock).mockResolvedValue(undefined);

    const result = await signUp('test@example.com', 'password', 'Test User');

    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', 'password');
    expect(updateProfile).toHaveBeenCalledWith(mockUser, { displayName: 'Test User' });
    expect(result).toEqual(mockUser);
  });

  it('signUp gère les erreurs correctement', async () => {
    const mockError = new Error('auth/email-already-in-use');
    (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue(mockError);

    await expect(signUp('existing@example.com', 'password', 'Test User')).rejects.toThrow('auth/email-already-in-use');
  });

  it('signOut appelle Firebase signOut', async () => {
    (firebaseSignOut as jest.Mock).mockResolvedValue(undefined);

    await signOut();

    expect(firebaseSignOut).toHaveBeenCalledWith(auth);
  });

  it('resetPassword appelle Firebase sendPasswordResetEmail', async () => {
    (sendPasswordResetEmail as jest.Mock).mockResolvedValue(undefined);

    await resetPassword('test@example.com');

    expect(sendPasswordResetEmail).toHaveBeenCalledWith(auth, 'test@example.com');
  });

  it('resetPassword gère les erreurs correctement', async () => {
    const mockError = new Error('auth/user-not-found');
    (sendPasswordResetEmail as jest.Mock).mockRejectedValue(mockError);

    await expect(resetPassword('nonexistent@example.com')).rejects.toThrow('auth/user-not-found');
  });
}); 