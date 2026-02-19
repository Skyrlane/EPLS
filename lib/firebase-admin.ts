import * as admin from "firebase-admin";

// Configuration par défaut pour le développement
const defaultAppConfig = {
  projectId: "fake-project",
  clientEmail: "fake@example.com",
  privateKey: "fake-key",
};

// Vérifier si l'application est déjà initialisée
if (!admin.apps.length) {
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || defaultAppConfig.projectId;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || defaultAppConfig.clientEmail;
    // Utiliser une clé privée factice en développement si non spécifiée
    const privateKey = process.env.FIREBASE_PRIVATE_KEY 
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n") 
      : defaultAppConfig.privateKey;
    
    // Options d'initialisation
    const options = {
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    };
    
    // Ajouter l'URL de la base de données si disponible
    if (process.env.FIREBASE_DATABASE_URL) {
      Object.assign(options, { databaseURL: process.env.FIREBASE_DATABASE_URL });
    }
    
    // Initialiser l'application
    admin.initializeApp(options);
    console.log("Firebase Admin initialized");
  } catch (error) {
    console.error("Firebase admin initialization error", error);
  }
}

// Exportation conditionnelle pour éviter les erreurs en cas d'échec d'initialisation
export const adminAuth = admin.apps.length ? admin.auth() : undefined;
export const adminDb = admin.apps.length ? admin.firestore() : undefined;
export const adminStorage = admin.apps.length ? admin.storage() : undefined; 