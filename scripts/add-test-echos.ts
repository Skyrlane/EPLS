/**
 * Script pour ajouter des échos de test dans Firestore
 *
 * Pour exécuter ce script :
 * 1. Dans la console Firebase : https://console.firebase.google.com/
 * 2. Aller dans Firestore Database
 * 3. Créer la collection 'echos' si elle n'existe pas
 * 4. Copier-coller les données ci-dessous dans la console
 *
 * Ou exécuter ce script avec : npx ts-node scripts/add-test-echos.ts
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';

// Configuration Firebase (utiliser les variables d'environnement)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Données de test
const testEchos = [
  {
    title: "L'Écho - Novembre 2025",
    description: "Édition de novembre avec les dernières nouvelles de l'église, les événements à venir et une méditation sur la gratitude.",
    month: 11,
    year: 2025,
    pdfUrl: "/echoes/echo-epls-novembre-2025.pdf",
    coverImageUrl: "/images/echo/echo-novembre.jpg",
    fileSize: 2500000, // 2.5 MB
    publishedAt: new Date('2025-11-01'),
    status: "published" as const
  },
  {
    title: "L'Écho - Octobre 2025",
    description: "Édition d'octobre avec le retour sur la rentrée, les projets de l'année et une méditation sur la foi.",
    month: 10,
    year: 2025,
    pdfUrl: "/echoes/echo-epls-octobre-2025.pdf",
    coverImageUrl: "/images/echo/echo-octobre.jpg",
    fileSize: 3200000, // 3.2 MB
    publishedAt: new Date('2025-10-01'),
    status: "published" as const
  },
  {
    title: "L'Écho - Septembre 2025",
    description: "Édition de septembre avec la préparation de la rentrée et les nouveaux projets de l'église.",
    month: 9,
    year: 2025,
    pdfUrl: "/echoes/echo-epls-septembre-2025.pdf",
    fileSize: 2800000, // 2.8 MB
    publishedAt: new Date('2025-09-01'),
    status: "published" as const
  },
  {
    title: "L'Écho - Janvier 2025",
    description: "Première édition de 2025 avec les vœux du pasteur, les projets pour la nouvelle année et une méditation sur l'espérance.",
    month: 1,
    year: 2025,
    pdfUrl: "/echoes/echo-epls-janvier-2025.pdf",
    coverImageUrl: "/images/echo/echo-janvier.jpg",
    fileSize: 2100000, // 2.1 MB
    publishedAt: new Date('2025-01-01'),
    status: "published" as const
  },
];

async function addTestEchos() {
  console.log('🔥 Ajout des échos de test dans Firestore...\n');

  try {
    const echosRef = collection(db, 'echos');

    for (const echo of testEchos) {
      const docRef = await addDoc(echosRef, {
        ...echo,
        publishedAt: Timestamp.fromDate(echo.publishedAt as Date)
      });
      console.log(`✅ Écho ajouté : ${echo.title} (ID: ${docRef.id})`);
    }

    console.log('\n🎉 Tous les échos ont été ajoutés avec succès !');
    console.log('\nVous pouvez maintenant aller sur http://localhost:3000 pour les voir.');

  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des échos :', error);
  }
}

// Exécuter le script
if (require.main === module) {
  addTestEchos().then(() => process.exit(0));
}

export { addTestEchos };
