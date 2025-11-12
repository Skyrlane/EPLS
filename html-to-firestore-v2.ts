/**
 * 🔄 Convertisseur HTML → Firestore (Version Corrigée)
 * 
 * Convertit les annonces HTML en documents Firestore pour EPLS
 * 
 * Usage :
 * 1. Copie ton HTML dans HTML_CONTENT
 * 2. Configure Firebase
 * 3. Lance : npx ts-node html-to-firestore-v2.ts
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';

// ========================================
// ⚠️ CONFIGURATION FIREBASE - REMPLACE ICI
// ========================================
const firebaseConfig = {
  apiKey: "AIzaSyDK1n3ALzUkz-fLXf390H0pSvjz_Xz+BE",
  authDomain: "epls-production.firebaseapp.com",
  projectId: "epls-production",
  storageBucket: "epls-production.firebasestorage.app",
  messagingSenderId: "431082540009",
  appId: "1:431982540009:web:b25102b498e609781dac78"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

// ========================================
// 📝 TON HTML ICI
// ========================================
const HTML_CONTENT = `
<p>
  <span class="text-info"><strong>Samedi 15 novembre 2025 à 20h00</strong></span><br />
  - <strong>L'Idégé de Mi : Les trois yeux de Minéloïda</strong> au Centre Culturel de Brumath (29 Rue André Malraux, Brumath)<br />
  <ul>
    <li><strong>Billetterie :</strong></li>
    <li>Gratuit jusqu'à 8 ans</li>
    <li>9-17 ans : 5 €</li>
    <li>Étudiants : 10 €</li>
    <li>Adultes : 15 €</li>
  </ul>
</p>
<hr />
<p>
  <span class="text-info"><strong>Dimanche 16 novembre 2025 à 10h00</strong></span><br />
  - <strong>CULTE</strong> - Église St-Marc, 18 Rue de Franche-Comté, 67380 Lingolsheim
  <ul>
    <li>Chants, Louanges, Prières</li>
    <li>Prédication</li>
    <li>Garderie & École du dimanche</li>
    <li>Communion fraternelle</li>
  </ul>
</p>
<hr />
<p>
  <span class="text-info"><strong>Dimanche 30 novembre 2025 à 17h00</strong></span><br />
  - <strong>CONCERT avec les RAINBOW GOSPEL SINGERS</strong> - Eglise Saint-Marc, 18 rue de Franche-Comté, 67380 Lingolsheim
  <ul>
    <li>Entrée libre - plateau</li>
  </ul>
</p>
`;

// ========================================
// CONFIGURATION
// ========================================
const EVENT_TYPES = {
  concert: { tag: 'Concert', color: '#10B981' },
  culte: { tag: 'Culte', color: '#3B82F6' },
  spectacle: { tag: 'Spectacle', color: '#8B5CF6' },
  reunion: { tag: 'Réunion', color: '#F59E0B' },
  formation: { tag: 'Formation', color: '#6366F1' },
  autre: { tag: 'Événement', color: '#6B7280' }
};

// ========================================
// FONCTIONS DE PARSING
// ========================================

function parseDate(dateString: string): Date | null {
  const months: { [key: string]: number } = {
    'janvier': 0, 'février': 1, 'mars': 2, 'avril': 3,
    'mai': 4, 'juin': 5, 'juillet': 6, 'août': 7,
    'septembre': 8, 'octobre': 9, 'novembre': 10, 'décembre': 11
  };

  // Regex flexible pour "15 novembre 2025 à 20h00"
  const regex = /(\d{1,2})\s+(\w+)\s+(\d{4})\s+à\s+(\d{1,2})h(\d{2})/i;
  const match = dateString.match(regex);

  if (!match) {
    console.log(`   ⚠️ Pattern non reconnu : "${dateString}"`);
    return null;
  }

  const [, day, month, year, hour, minute] = match;
  const monthIndex = months[month.toLowerCase()];

  if (monthIndex === undefined) {
    console.log(`   ⚠️ Mois non reconnu : "${month}"`);
    return null;
  }

  return new Date(parseInt(year), monthIndex, parseInt(day), parseInt(hour), parseInt(minute));
}

function extractTime(dateString: string): string {
  const match = dateString.match(/(\d{1,2})h(\d{2})/);
  return match ? `${match[1]}h${match[2]}` : '';
}

function detectEventType(title: string): keyof typeof EVENT_TYPES {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('concert')) return 'concert';
  if (titleLower.includes('culte')) return 'culte';
  if (titleLower.includes('spectacle') || titleLower.includes('théâtre') || titleLower.includes('idégé')) return 'spectacle';
  if (titleLower.includes('réunion') || titleLower.includes('assemblée')) return 'reunion';
  if (titleLower.includes('formation') || titleLower.includes('étude')) return 'formation';
  
  return 'autre';
}

function parseSimpleHTML(html: string) {
  const announcements = [];
  
  // Séparer par <hr /> ou par paragraphes
  const blocks = html.split(/<hr\s*\/?>/i);
  
  for (const block of blocks) {
    if (!block.trim()) continue;
    
    // Extraire la date (entre <strong> dans <span class="text-info">)
    const dateMatch = block.match(/<span[^>]*class="text-info"[^>]*><strong>([^<]+)<\/strong><\/span>/i);
    if (!dateMatch) continue;
    
    const dateString = dateMatch[1];
    const date = parseDate(dateString);
    if (!date) continue;
    
    const time = extractTime(dateString);
    
    // Extraire le titre (première balise <strong> après le tiret)
    const titleMatch = block.match(/-\s*<strong>([^<]+)<\/strong>/i);
    if (!titleMatch) continue;
    
    const title = titleMatch[1].trim();
    
    // Extraire le texte après le titre
    const afterTitle = block.substring(block.indexOf(titleMatch[0]) + titleMatch[0].length);
    
    // Parser le lieu
    let locationName = '';
    let locationAddress = '';
    
    // Pattern 1: "au Lieu (Adresse)"
    const locationMatch1 = afterTitle.match(/\s+au\s+([^(]+)\s*\(([^)]+)\)/i);
    if (locationMatch1) {
      locationName = locationMatch1[1].trim();
      locationAddress = locationMatch1[2].trim();
    } else {
      // Pattern 2: "- Lieu, Adresse"
      const locationMatch2 = afterTitle.match(/-\s*([^,<]+),\s*([^<]+)/i);
      if (locationMatch2) {
        locationName = locationMatch2[1].trim();
        locationAddress = locationMatch2[2].trim();
      }
    }
    
    // Extraire les items de la liste <ul>
    const ulMatch = block.match(/<ul>[\s\S]*?<\/ul>/i);
    const details = [];
    
    if (ulMatch) {
      const ulContent = ulMatch[0];
      const liRegex = /<li[^>]*>([^<]+)<\/li>/gi;
      let liMatch;
      while ((liMatch = liRegex.exec(ulContent)) !== null) {
        const text = liMatch[1].trim();
        if (text && !text.toLowerCase().includes('billetterie') && text !== ':') {
          details.push(text);
        }
      }
    }
    
    // Parser la tarification
    const pricing: any = {};
    let hasPricing = false;
    const filteredDetails = [];
    
    for (const detail of details) {
      const detailLower = detail.toLowerCase();
      
      if (detailLower.includes('gratuit jusqu')) {
        pricing.free = detail;
        hasPricing = true;
      } else if (detailLower.match(/^\d+-\d+\s*ans/)) {
        pricing.child = detail;
        hasPricing = true;
      } else if (detailLower.includes('étudiant')) {
        pricing.student = detail;
        hasPricing = true;
      } else if (detailLower.includes('adulte')) {
        pricing.adult = detail;
        hasPricing = true;
      } else {
        filteredDetails.push(detail);
      }
    }
    
    // Détecter le type
    const type = detectEventType(title);
    const typeConfig = EVENT_TYPES[type];
    
    announcements.push({
      title,
      date,
      time,
      location: {
        name: locationName || 'À définir',
        address: locationAddress || ''
      },
      details: filteredDetails.length > 0 ? filteredDetails : undefined,
      pricing: hasPricing ? pricing : undefined,
      type,
      tag: typeConfig.tag,
      tagColor: typeConfig.color
    });
  }
  
  return announcements;
}

// ========================================
// UPLOAD VERS FIRESTORE
// ========================================

async function uploadToFirestore(announcements: any[]) {
  console.log(`\n🚀 Upload de ${announcements.length} annonces vers Firestore...\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const announcement of announcements) {
    try {
      // Créer le document en retirant les champs undefined
      const docData: any = {
        title: announcement.title,
        date: Timestamp.fromDate(announcement.date),
        time: announcement.time,
        location: announcement.location,
        type: announcement.type,
        tag: announcement.tag,
        tagColor: announcement.tagColor,
        isPinned: false,
        priority: successCount + 1,
        isActive: true,
        status: 'published',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      
      // Ajouter les champs optionnels seulement s'ils existent
      if (announcement.details) {
        docData.details = announcement.details;
      }
      if (announcement.pricing) {
        docData.pricing = announcement.pricing;
      }

      await addDoc(collection(firestore, 'announcements'), docData);

      console.log(`✅ "${announcement.title}"`);
      console.log(`   📅 ${announcement.date.toLocaleDateString('fr-FR')} à ${announcement.time}`);
      console.log(`   📍 ${announcement.location.name}`);
      if (announcement.pricing) console.log(`   💰 Tarification incluse`);
      console.log();
      
      successCount++;

    } catch (error: any) {
      console.error(`❌ Erreur pour "${announcement.title}":`);
      console.error(`   ${error.message}`);
      console.log();
      errorCount++;
    }
  }

  console.log(`📊 Résultat :`);
  console.log(`   ✅ Succès : ${successCount}`);
  console.log(`   ❌ Erreurs : ${errorCount}`);
}

// ========================================
// MAIN
// ========================================

async function main() {
  console.log('🔄 Conversion HTML → Firestore (v2)\n');
  console.log('📄 Parsing du HTML...\n');

  const announcements = parseSimpleHTML(HTML_CONTENT);

  if (announcements.length === 0) {
    console.log('❌ Aucune annonce trouvée dans le HTML');
    console.log('Vérifie le format de ton HTML.\n');
    return;
  }

  console.log(`✅ ${announcements.length} annonces détectées :\n`);
  
  announcements.forEach((a, i) => {
    console.log(`${i + 1}. ${a.title}`);
    console.log(`   📅 ${a.date.toLocaleDateString('fr-FR')} à ${a.time}`);
    console.log(`   📍 ${a.location.name}`);
    if (a.location.address) console.log(`      ${a.location.address}`);
    console.log(`   🏷️  ${a.tag}`);
    if (a.pricing) console.log(`   💰 Tarification`);
    if (a.details && a.details.length > 0) console.log(`   📝 ${a.details.length} détails`);
    console.log();
  });

  // Mode preview ou upload
  const mode = process.argv[2];

  if (mode === '--preview') {
    console.log('Mode preview - Aucun upload effectué');
    console.log('Pour uploader : npx ts-node html-to-firestore-v2.ts');
  } else {
    await uploadToFirestore(announcements);
  }

  console.log('\n✨ Terminé !\n');
  process.exit(0);
}

// Lancer
main().catch(error => {
  console.error('❌ Erreur fatale :', error);
  process.exit(1);
});
