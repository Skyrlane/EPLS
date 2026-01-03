/**
 * Script d'import des contacts depuis le fichier JSON vers Firestore
 *
 * Usage: npx tsx scripts/import-contacts.ts
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';

// Configuration Firebase Admin
if (!getApps().length) {
  // Vérifier si les variables d'environnement existent
  if (!process.env.FIREBASE_PROJECT_ID) {
    console.error('❌ ERREUR: Variables d\'environnement Firebase non définies');
    console.log('💡 Assurez-vous que le fichier .env.local contient:');
    console.log('   - FIREBASE_PROJECT_ID');
    console.log('   - FIREBASE_CLIENT_EMAIL');
    console.log('   - FIREBASE_PRIVATE_KEY');
    process.exit(1);
  }

  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

interface ContactDataItem {
  lastName: string;
  firstName: string;
  phoneFixed?: string;
  phoneMobile?: string;
  email?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  birthDate?: string;
  isMember: boolean;
}

interface ContactData {
  contacts: ContactDataItem[];
}

async function importContacts() {
  try {
    console.log('📇 === IMPORT DES CONTACTS ===\n');

    // Lire le fichier JSON
    const jsonPath = path.join(process.cwd(), 'contacts-data.json');

    if (!fs.existsSync(jsonPath)) {
      console.error(`❌ Fichier non trouvé: ${jsonPath}`);
      process.exit(1);
    }

    const jsonData = fs.readFileSync(jsonPath, 'utf-8');
    const data: ContactData = JSON.parse(jsonData);

    console.log(`📄 Fichier JSON chargé: ${data.contacts.length} contacts`);
    console.log('');

    // Vérifier les doublons existants dans Firestore
    console.log('🔍 Vérification des doublons dans Firestore...');
    const existingSnapshot = await db.collection('contacts').get();
    const existingSet = new Set(
      existingSnapshot.docs.map((doc) => {
        const d = doc.data();
        return `${d.firstName.toLowerCase()}-${d.lastName.toLowerCase()}`;
      })
    );

    console.log(`   ${existingSnapshot.size} contacts déjà dans Firestore\n`);

    // Import dans Firestore
    console.log('🔄 Import en cours...\n');

    let created = 0;
    let duplicates = 0;
    let errors = 0;

    for (const item of data.contacts) {
      const key = `${item.firstName.toLowerCase()}-${item.lastName.toLowerCase()}`;

      // Vérifier si c'est un doublon
      if (existingSet.has(key)) {
        duplicates++;
        console.log(`   ⚠️  Doublon ignoré: ${item.firstName} ${item.lastName}`);
        continue;
      }

      try {
        await db.collection('contacts').add({
          firstName: item.firstName,
          lastName: item.lastName.toUpperCase(),
          phoneFixed: item.phoneFixed || null,
          phoneMobile: item.phoneMobile || null,
          email: item.email || null,
          address: item.address || null,
          postalCode: item.postalCode || null,
          city: item.city || null,
          birthDate: item.birthDate || null,
          isMember: item.isMember || false,
          isActive: true,
          notes: '',
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });

        created++;

        // Afficher la progression tous les 10 imports
        if (created % 10 === 0) {
          console.log(`   ✓ ${created} contacts importés...`);
        }
      } catch (error) {
        console.error(`   ❌ Erreur pour ${item.firstName} ${item.lastName}:`, error);
        errors++;
      }
    }

    console.log('\n✅ === IMPORT TERMINÉ ===\n');
    console.log(`📊 Statistiques:`);
    console.log(`   - Total dans le fichier : ${data.contacts.length}`);
    console.log(`   - Nouveaux importés     : ${created}`);
    console.log(`   - Doublons ignorés      : ${duplicates}`);
    console.log(`   - Erreurs               : ${errors}`);
    console.log('');

    if (created > 0) {
      console.log('✨ Les contacts ont été importés avec succès dans Firestore!');
    } else if (duplicates === data.contacts.length) {
      console.log('ℹ️  Tous les contacts sont déjà dans Firestore.');
    }

  } catch (error) {
    console.error('❌ Erreur globale:', error);
    process.exit(1);
  }
}

// Exécuter l'import
importContacts()
  .then(() => {
    console.log('\n✓ Script terminé avec succès');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Le script a échoué:', error);
    process.exit(1);
  });
