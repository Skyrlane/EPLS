/**
 * Script pour supprimer TOUS les anniversaires de Firestore
 * 
 * ⚠️ ATTENTION : Ce script supprime TOUTES les données de la collection birthdays
 * 
 * Usage: npx tsx scripts/clean-birthdays.ts
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Configuration Firebase Admin
if (!getApps().length) {
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

async function cleanBirthdays() {
  try {
    console.log('🗑️  === NETTOYAGE DES ANNIVERSAIRES ===\n');
    console.log('⚠️  ATTENTION : Vous êtes sur le point de supprimer TOUS les anniversaires!');
    console.log('');

    // Compter les documents à supprimer
    const snapshot = await db.collection('birthdays').get();
    const count = snapshot.size;

    if (count === 0) {
      console.log('✅ La collection est déjà vide. Rien à supprimer.');
      return;
    }

    console.log(`📊 ${count} anniversaire(s) trouvé(s) dans la collection`);
    console.log('');
    console.log('🔄 Suppression en cours...\n');

    // Supprimer tous les documents
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    console.log('✅ === NETTOYAGE TERMINÉ ===\n');
    console.log(`🗑️  ${count} anniversaire(s) supprimé(s) avec succès`);
    console.log('');
    console.log('💡 Vous pouvez maintenant relancer l\'import avec :');
    console.log('   npx tsx scripts/import-birthdays.ts');
    console.log('');

  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
    process.exit(1);
  }
}

// Exécuter le nettoyage
cleanBirthdays()
  .then(() => {
    console.log('✓ Script terminé avec succès');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Le script a échoué:', error);
    process.exit(1);
  });
