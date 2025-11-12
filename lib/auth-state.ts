/**
 * État d'authentification global - singleton
 * Évite les problèmes de synchronisation du Context API
 */

import { User } from 'firebase/auth';

type Listener = (user: User | null, loading: boolean) => void;

class AuthState {
  private user: User | null = null;
  private loading: boolean = true;
  private listeners: Set<Listener> = new Set();

  getUser(): User | null {
    return this.user;
  }

  isLoading(): boolean {
    return this.loading;
  }

  setUser(user: User | null) {
    this.user = user;
    this.notifyListeners();
  }

  setLoading(loading: boolean) {
    this.loading = loading;
    this.notifyListeners();
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    // Appeler immédiatement le listener avec l'état actuel
    listener(this.user, this.loading);

    // Retourner une fonction de désinscription
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => {
      listener(this.user, this.loading);
    });
  }
}

// Instance singleton
export const authState = new AuthState();
