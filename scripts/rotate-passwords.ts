// Run: npx tsx scripts/rotate-passwords.ts
// Rotates passwords for the 3 shared accounts after a credential leak.
// New passwords are read from environment variables in .env.local:
//   EPLS_AMI_PASSWORD=<new password>
//   EPLS_MEMBRE_PASSWORD=<new password>
//   EPLS_CONSEIL_PASSWORD=<new password>

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import * as admin from 'firebase-admin';

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

  throw new Error('Set FIREBASE_SERVICE_ACCOUNT_BASE64 in .env.local');
}

interface AccountRotation {
  email: string;
  envVar: string;
}

const ACCOUNTS: AccountRotation[] = [
  { email: 'ami07@epls.fr', envVar: 'EPLS_AMI_PASSWORD' },
  { email: 'membre07@epls.fr', envVar: 'EPLS_MEMBRE_PASSWORD' },
  { email: 'conseil07@epls.fr', envVar: 'EPLS_CONSEIL_PASSWORD' },
];

async function main(): Promise<void> {
  console.log('=== Rotating passwords for shared EPLS accounts ===\n');

  initAdmin();

  const authClient = admin.auth();

  for (const account of ACCOUNTS) {
    const newPassword = process.env[account.envVar];
    if (!newPassword) {
      console.error(`  ERROR: ${account.envVar} not set in .env.local — skipping ${account.email}`);
      continue;
    }

    try {
      const user = await authClient.getUserByEmail(account.email);
      await authClient.updateUser(user.uid, { password: newPassword });
      console.log(`  ✓ Password rotated: ${account.email} (uid: ${user.uid})`);
    } catch (err) {
      console.error(`  ERROR rotating ${account.email}:`, err);
      process.exit(1);
    }
  }

  console.log('\n=== All passwords rotated successfully ===');
  console.log('IMPORTANT: Update your local notes with the new passwords.');
  process.exit(0);
}

main();
