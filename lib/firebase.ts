import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { 
  getAuth, 
  Auth,
  connectAuthEmulator,
  User,
  NextOrObserver,
  onAuthStateChanged,
  Unsubscribe,
  ErrorFn,
  CompleteFn
} from "firebase/auth";
import { 
  getFirestore, 
  Firestore,
  connectFirestoreEmulator 
} from "firebase/firestore";
import { 
  getStorage, 
  FirebaseStorage,
  connectStorageEmulator 
} from "firebase/storage";

// Types pour les mocks Firebase
export interface MockAuthInterface {
  currentUser: User | null;
  onAuthStateChanged: (
    nextOrObserver: NextOrObserver<User>,
    error?: ErrorFn,
    completed?: CompleteFn
  ) => Unsubscribe;
}

// Configuration Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Variables pour stocker les instances Firebase
let app: FirebaseApp;
let auth: Auth | MockAuthInterface;
let firestore: Firestore;
let storage: FirebaseStorage;

try {
  // Vérifier si toutes les variables d'environnement sont définies
  if (
    !process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    !process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  ) {
    console.warn(
      "Variables d'environnement Firebase manquantes. L'application fonctionnera avec des objets fictifs."
    );
    
    // Créer des objets mock pour permettre l'exécution sans erreur en développement
    auth = { 
      currentUser: null,
      onAuthStateChanged: (
        nextOrObserver: NextOrObserver<User>,
        error?: ErrorFn,
        completed?: CompleteFn
      ): Unsubscribe => {
        // Appeler immédiatement l'observateur avec null et retourner une fonction de désinscription vide
        if (typeof nextOrObserver === "function") {
          nextOrObserver(null);
        } else {
          nextOrObserver.next(null);
        }
        return () => {};
      }
    } as MockAuthInterface;
    
    firestore = { 
      collection: () => ({}) 
    } as unknown as Firestore;
    
    storage = { 
      ref: () => ({}) 
    } as unknown as FirebaseStorage;
  } else {
    // Initialiser l'application Firebase si elle n'existe pas déjà
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    }
    
    // Initialiser les services Firebase
    auth = getAuth();
    firestore = getFirestore();
    storage = getStorage();
    
    // Connecter aux émulateurs en environnement de développement
    if (process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true") {
      // Émulateurs Firebase (décommentez pour utiliser)
      // connectAuthEmulator(auth, "http://localhost:9099");
      // connectFirestoreEmulator(firestore, "localhost", 8080);
      // connectStorageEmulator(storage, "localhost", 9199);
    }
  }
} catch (error) {
  console.error("Erreur lors de l'initialisation de Firebase:", error);
  
  // Créer des objets mock en cas d'erreur pour éviter les plantages
  auth = { 
    currentUser: null,
    onAuthStateChanged: (
      nextOrObserver: NextOrObserver<User>,
      error?: ErrorFn,
      completed?: CompleteFn
    ): Unsubscribe => {
      // Appeler immédiatement l'observateur avec null et retourner une fonction de désinscription vide
      if (typeof nextOrObserver === "function") {
        nextOrObserver(null);
      } else {
        nextOrObserver.next(null);
      }
      return () => {};
    }
  } as MockAuthInterface;
  
  firestore = { 
    collection: () => ({}) 
  } as unknown as Firestore;
  
  storage = { 
    ref: () => ({}) 
  } as unknown as FirebaseStorage;
}

export { auth, firestore, storage }; 