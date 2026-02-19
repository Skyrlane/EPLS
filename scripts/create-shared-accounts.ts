// Run: npx tsx scripts/create-shared-accounts.ts

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import * as admin from 'firebase-admin';

// ---------------------------------------------------------------------------
// Initialize Firebase Admin SDK directly (not from lib/firebase-admin.ts
// because that module is a Next.js module with Next.js-specific patterns).
// ---------------------------------------------------------------------------
function initAdmin(): void {
  if (admin.apps.length > 0) return;

  const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  if (base64) {
    try {
      const json = Buffer.from(base64, 'base64').toString('utf-8');
      const sa = JSON.parse(json);
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: sa.project_id,
          clientEmail: sa.client_email,
          privateKey: sa.private_key,
        }),
      });
      console.log(`Firebase Admin initialized (project: ${sa.project_id})`);
      return;
    } catch (err) {
      console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_BASE64:', err);
    }
  }

  // Fallback: individual env vars
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const rawKey = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && rawKey) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: rawKey.replace(/\\n/g, '\n'),
      }),
    });
    console.log(`Firebase Admin initialized (project: ${projectId})`);
    return;
  }

  throw new Error(
    'No Firebase credentials found. Set FIREBASE_SERVICE_ACCOUNT_BASE64 or ' +
      'FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY in .env.local'
  );
}

// ---------------------------------------------------------------------------
// Account definitions
// ---------------------------------------------------------------------------
interface AccountDef {
  email: string;
  password: string;
  displayName: string;
  role: 'ami' | 'membre' | 'conseil';
}

const ACCOUNTS: AccountDef[] = [
  {
    email: 'ami07@epls.fr',
    password: '1chemin9',
    displayName: 'Ami EPLS',
    role: 'ami',
  },
  {
    email: 'membre07@epls.fr',
    password: 'chemin67',
    displayName: 'Membre EPLS',
    role: 'membre',
  },
  {
    email: 'conseil07@epls.fr',
    password: 'EPL18Lingo',
    displayName: 'Conseil EPLS',
    role: 'conseil',
  },
];

// ---------------------------------------------------------------------------
// Core logic
// ---------------------------------------------------------------------------
async function createOrUpdateAccount(account: AccountDef): Promise<void> {
  const authClient = admin.auth();
  const db = admin.firestore();

  let uid: string;

  try {
    const userRecord = await authClient.createUser({
      email: account.email,
      password: account.password,
      displayName: account.displayName,
    });
    uid = userRecord.uid;
    console.log(`  Created new Firebase Auth account: ${account.email} (uid: ${uid})`);
  } catch (err: unknown) {
    const firebaseErr = err as { code?: string; message?: string };
    if (firebaseErr.code === 'auth/email-already-exists') {
      // Account already exists — fetch the existing UID
      const existing = await authClient.getUserByEmail(account.email);
      uid = existing.uid;
      console.log(`  Account already exists: ${account.email} (uid: ${uid})`);
    } else {
      throw err;
    }
  }

  // Create or merge the Firestore user document
  await db.doc(`users/${uid}`).set(
    {
      uid,
      email: account.email,
      displayName: account.displayName,
      role: account.role,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  console.log(`  Created/updated account: ${account.email} (uid: ${uid}, role: ${account.role})`);
}

async function main(): Promise<void> {
  console.log('=== Creating shared EPLS test accounts ===\n');

  initAdmin();

  for (const account of ACCOUNTS) {
    console.log(`\nProcessing: ${account.email}`);
    try {
      await createOrUpdateAccount(account);
    } catch (err) {
      console.error(`  ERROR processing ${account.email}:`, err);
      process.exit(1);
    }
  }

  console.log('\n=== All accounts created/updated successfully ===');
  process.exit(0);
}

main();
