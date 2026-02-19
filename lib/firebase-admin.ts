import * as admin from "firebase-admin";

// Configuration par défaut pour le développement
const defaultAppConfig = {
  projectId: "fake-project",
  clientEmail: "fake@example.com",
  privateKey: "fake-key",
};

function getCredentials(): admin.ServiceAccount | null {
  // Option 1: Full service account JSON (base64-encoded) — most reliable on Vercel
  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    try {
      const json = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf-8');
      const sa = JSON.parse(json);
      return {
        projectId: sa.project_id,
        clientEmail: sa.client_email,
        privateKey: sa.private_key,
      };
    } catch {
      console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_BASE64");
    }
  }

  // Option 2: Individual env vars
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const rawKey = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && rawKey) {
    return {
      projectId,
      clientEmail,
      privateKey: rawKey.replace(/\\n/g, "\n"),
    };
  }

  return null;
};

// Vérifier si l'application est déjà initialisée
if (!admin.apps.length) {
  try {
    const creds = getCredentials();
    if (!creds) {
      console.warn("Firebase Admin: no credentials found, running in degraded mode");
    } else {
      const options: admin.AppOptions = {
        credential: admin.credential.cert(creds),
      };

      if (process.env.FIREBASE_DATABASE_URL) {
        options.databaseURL = process.env.FIREBASE_DATABASE_URL;
      }

      admin.initializeApp(options);
      console.log("Firebase Admin initialized with project:", creds.projectId);
    }
  } catch (error) {
    console.error("Firebase admin initialization error", error);
  }
}

// Exportation conditionnelle pour éviter les erreurs en cas d'échec d'initialisation
export const adminAuth = admin.apps.length ? admin.auth() : undefined;
export const adminDb = admin.apps.length ? admin.firestore() : undefined;
export const adminStorage = admin.apps.length ? admin.storage() : undefined; 