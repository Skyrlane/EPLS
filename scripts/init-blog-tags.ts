import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// Configuration Firebase (copie depuis ton .env.local)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDK1in3ALukzfLLxf390N0pSvj2_Xz2BEE",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "epls-production.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "epls-production",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "epls-production.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "431982540009",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:431982540009:web:b25182b490e669781dac78"
};

// Initialisation Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Liste des 16 tags
const BLOG_TAGS = [
  { label: "À la une", color: "#06B6D4" },
  { label: "Témoignages", color: "#10B981" },
  { label: "Foi", color: "#3B82F6" },
  { label: "Grâce", color: "#A855F7" },
  { label: "Évangile", color: "#EF4444" },
  { label: "Prière", color: "#F59E0B" },
  { label: "Étude biblique", color: "#8B5CF6" },
  { label: "Vie d'Église", color: "#EC4899" },
  { label: "Famille", color: "#14B8A6" },
  { label: "Jeunesse", color: "#F97316" },
  { label: "Louange", color: "#84CC16" },
  { label: "Mission", color: "#0EA5E9" },
  { label: "Spiritualité", color: "#6366F1" },
  { label: "Espérance", color: "#22C55E" },
  { label: "Amour", color: "#EF4444" },
  { label: "Réflexion", color: "#64748B" }
];

async function initTags() {
  console.log('🚀 Initialisation des tags de blog...\n');
  
  try {
    for (const tag of BLOG_TAGS) {
      await addDoc(collection(db, 'blogTags'), tag);
      console.log(`✅ Tag créé : ${tag.label} (${tag.color})`);
    }
    
    console.log('\n🎉 Tous les tags ont été créés avec succès !');
    console.log('📊 Total : 16 tags');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la création des tags:', error);
    process.exit(1);
  }
}

// Exécution
initTags();