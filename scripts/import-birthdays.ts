/**
 * Script d'import des anniversaires depuis le fichier JSON vers Firestore
 * 
 * Usage: npx tsx scripts/import-birthdays.ts
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

interface BirthdayDataItem {
  jour: number;
  mois: number;
  nom: string;
  prenom: string;
}

interface BirthdayData {
  anniversaires: BirthdayDataItem[];
}

async function importBirthdays() {
  try {
    console.log('🎂 === IMPORT DES ANNIVERSAIRES ===\n');

    // Lire le fichier JSON
    const jsonPath = path.join(process.cwd(), 'anniversaires-data.json');
    
    if (!fs.existsSync(jsonPath)) {
      console.error(`❌ Fichier non trouvé: ${jsonPath}`);
      process.exit(1);
    }

    const jsonData = fs.readFileSync(jsonPath, 'utf-8');
    const data: BirthdayData = JSON.parse(jsonData);
    
    console.log(`📄 Fichier JSON chargé: ${data.anniversaires.length} anniversaires`);
    console.log('');

    // Vérifier les doublons existants dans Firestore
    console.log('🔍 Vérification des doublons dans Firestore...');
    const existingSnapshot = await db.collection('birthdays').get();
    const existingSet = new Set(
      existingSnapshot.docs.map((doc) => {
        const d = doc.data();
        return `${d.firstName.toLowerCase()}-${d.lastName.toLowerCase()}-${d.day}-${d.month}`;
      })
    );

    console.log(`   ${existingSnapshot.size} anniversaires déjà dans Firestore\n`);

    // Import dans Firestore
    console.log('🔄 Import en cours...\n');
    
    let created = 0;
    let duplicates = 0;
    let errors = 0;

    for (const item of data.anniversaires) {
      const key = `${item.prenom.toLowerCase()}-${item.nom.toLowerCase()}-${item.jour}-${item.mois}`;
      
      // Vérifier si c'est un doublon
      if (existingSet.has(key)) {
        duplicates++;
        continue;
      }

      try {
        await db.collection('birthdays').add({
          firstName: item.prenom,
          lastName: item.nom,
          day: item.jour,
          month: item.mois,
          isActive: true,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
        
        created++;
        
        // Afficher la progression tous les 10 imports
        if (created % 10 === 0) {
          console.log(`   ✓ ${created} anniversaires importés...`);
        }
      } catch (error) {
        console.error(`   ❌ Erreur pour ${item.prenom} ${item.nom}:`, error);
        errors++;
      }
    }

    console.log('\n✅ === IMPORT TERMINÉ ===\n');
    console.log(`📊 Statistiques:`);
    console.log(`   - Total dans le fichier : ${data.anniversaires.length}`);
    console.log(`   - Nouveaux importés     : ${created}`);
    console.log(`   - Doublons ignorés      : ${duplicates}`);
    console.log(`   - Erreurs               : ${errors}`);
    console.log('');
    
    if (created > 0) {
      console.log('✨ Les anniversaires ont été importés avec succès dans Firestore!');
    } else if (duplicates === data.anniversaires.length) {
      console.log('ℹ️  Tous les anniversaires sont déjà dans Firestore.');
    }

  } catch (error) {
    console.error('❌ Erreur globale:', error);
    process.exit(1);
  }
}

// Exécuter l'import
importBirthdays()
  .then(() => {
    console.log('\n✓ Script terminé avec succès');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Le script a échoué:', error);
    process.exit(1);
  });
