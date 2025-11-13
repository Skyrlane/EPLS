import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp, query, where, getDocs } from 'firebase/firestore';
import { getStorage, ref, listAll, getDownloadURL, getMetadata } from 'firebase/storage';
import * as dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config({ path: '.env.local' });

// Configuration Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const storage = getStorage(app);

// Noms des mois en français
const MONTH_NAMES = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

// Parser le nom du fichier : "2025-01-echo.pdf" → { year: 2025, month: 1 }
function parseFileName(fileName: string): { year: number; month: number } | null {
  const match = fileName.match(/(\d{4})-(\d{2})-echo\.pdf/);
  if (!match) return null;
  
  return {
    year: parseInt(match[1]),
    month: parseInt(match[2])
  };
}

// Vérifier si un écho existe déjà dans Firestore
async function echoExists(year: number, month: number): Promise<boolean> {
  const q = query(
    collection(firestore, 'echos'),
    where('year', '==', year),
    where('month', '==', month)
  );
  
  const snapshot = await getDocs(q);
  return !snapshot.empty;
}

// Import principal
async function importEchos() {
  console.log('🚀 Import des échos depuis Firebase Storage...\n');
  
  try {
    // 1. Lister tous les fichiers dans /echos
    const echosRef = ref(storage, 'echos');
    const result = await listAll(echosRef);
    
    console.log(`📁 ${result.items.length} fichiers trouvés dans Storage\n`);
    
    let imported = 0;
    let skipped = 0;
    let errors = 0;
    
    // 2. Pour chaque fichier PDF
    for (const itemRef of result.items) {
      const fileName = itemRef.name;
      
      // Ignorer si pas un PDF d'écho
      if (!fileName.endsWith('.pdf') || !fileName.includes('echo')) {
        console.log(`⏭️  Ignoré : ${fileName} (pas un écho)`);
        skipped++;
        continue;
      }
      
      // Parser le nom
      const parsed = parseFileName(fileName);
      if (!parsed) {
        console.log(`⚠️  Ignoré : ${fileName} (format invalide)`);
        skipped++;
        continue;
      }
      
      const { year, month } = parsed;
      
      // Vérifier si existe déjà
      const exists = await echoExists(year, month);
      if (exists) {
        console.log(`✅ ${fileName} → Déjà dans Firestore (ignoré)`);
        skipped++;
        continue;
      }
      
      try {
        // Récupérer l'URL et les métadonnées
        const url = await getDownloadURL(itemRef);
        const metadata = await getMetadata(itemRef);
        
        // Créer le document Firestore
        const monthName = MONTH_NAMES[month - 1];
        const title = `L'Écho - ${monthName} ${year}`;
        
        await addDoc(collection(firestore, 'echos'), {
          title,
          month,
          year,
          pdfUrl: url,
          pdfFileName: fileName,
          fileSize: metadata.size,
          isActive: true,
          status: 'published',
          publishedAt: Timestamp.now(),
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
        
        console.log(`✅ ${fileName} → Importé : "${title}"`);
        imported++;
        
      } catch (error: any) {
        console.error(`❌ Erreur pour ${fileName}:`, error.message);
        errors++;
      }
    }
    
    // Résumé
    console.log('\n📊 Résumé :');
    console.log(`   ✅ Importés : ${imported}`);
    console.log(`   ⏭️  Ignorés  : ${skipped}`);
    console.log(`   ❌ Erreurs  : ${errors}`);
    console.log('\n✨ Import terminé !');
    
  } catch (error: any) {
    console.error('❌ Erreur fatale:', error.message);
    process.exit(1);
  }
}

// Lancer l'import
importEchos()
  .then(() => {
    console.log('\n✅ Script terminé avec succès');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Erreur:', error);
    process.exit(1);
  });
