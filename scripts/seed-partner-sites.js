/**
 * Script pour importer automatiquement les 28 sites partenaires dans Firestore
 * Exécuter avec: node scripts/seed-partner-sites.js
 */

require('dotenv').config({ path: '.env.local' });

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');

// Configuration Firebase Admin
const serviceAccount = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

// ========================================
// DONNÉES DES 28 SITES PARTENAIRES
// ========================================

const partnerSites = [
  // CATÉGORIE : Radios chrétiennes
  {
    id: 'radio-arcenciel',
    name: 'Radio Arc-en-Ciel',
    slug: 'radio-arc-en-ciel',
    category: 'Radios chrétiennes',
    description: 'Radio Arc-en-Ciel de Strasbourg',
    url: 'https://www.radioarcenciel.com/',
    logoZone: 'partner-radio-arcenciel',
    sortOrder: 1,
    isActive: true
  },
  {
    id: 'radio-iris',
    name: 'Radio Iris',
    slug: 'radio-iris',
    category: 'Radios chrétiennes',
    description: 'Radio Iris en Centre-Alsace',
    url: 'https://www.radioiris.fr/',
    logoZone: 'partner-radio-iris',
    sortOrder: 2,
    isActive: true
  },

  // CATÉGORIE : Médias chrétiens
  {
    id: 'tresor-sonore',
    name: 'Trésor Sonore',
    slug: 'tresor-sonore',
    category: 'Médias chrétiens',
    description: 'Trésor Sonore',
    url: 'https://www.tresorsonore.com/',
    logoZone: 'partner-tresor-sonore',
    sortOrder: 3,
    isActive: true
  },
  {
    id: 'zebuzztv',
    name: 'Ze Buzz TV',
    slug: 'ze-buzz-tv',
    category: 'Médias chrétiens',
    description: 'Ze Buzz TV : la télévision chrétienne sur Internet',
    url: 'https://www.zebuzztv.com/',
    logoZone: 'partner-zebuzztv',
    sortOrder: 4,
    isActive: true
  },

  // CATÉGORIE : Magazines chrétiens
  {
    id: 'croire-vivre',
    name: 'Croire et Vivre',
    slug: 'croire-et-vivre',
    category: 'Magazines chrétiens',
    description: "Croire et Vivre, un magazine d'évangélisation. Evangile, donne accès à nos rubriques de fichiers (mp3) gratuits.",
    url: 'https://www.croirepublications.com/croire-et-vivre',
    logoZone: 'partner-croire-vivre',
    sortOrder: 5,
    isActive: true
  },
  {
    id: 'christianisme-aujourdhui',
    name: "Christianisme Aujourd'hui",
    slug: 'christianisme-aujourdhui',
    category: 'Magazines chrétiens',
    description: "Christianisme aujourd'hui, un magazine franco-suisse « inspiré par l'actualité »",
    url: 'https://www.christianismeaujourdhui.info/',
    logoZone: 'partner-christianisme-aujourdhui',
    sortOrder: 6,
    isActive: true
  },

  // CATÉGORIE : Librairies chrétiennes
  {
    id: 'clc',
    name: 'Librairie chrétienne CLC',
    slug: 'librairie-clc',
    category: 'Librairies chrétiennes',
    description: 'Librairie chrétienne CLC',
    url: 'https://www.clcfrance.com/site_clc/',
    logoZone: 'partner-clc',
    sortOrder: 7,
    isActive: true
  },
  {
    id: 'certitude',
    name: 'Librairie Certitude',
    slug: 'librairie-certitude',
    category: 'Librairies chrétiennes',
    description: 'Librairie Certitude',
    url: 'https://certitude.fr/',
    logoZone: 'partner-certitude',
    sortOrder: 8,
    isActive: true
  },
  {
    id: '7ici',
    name: 'Librairie protestante 7 ICI',
    slug: 'librairie-7ici',
    category: 'Librairies chrétiennes',
    description: 'Librairie protestante 7 ICI',
    url: 'https://librairie-7ici.com/',
    logoZone: 'partner-7ici',
    sortOrder: 9,
    isActive: true
  },
  {
    id: 'xl6',
    name: 'Librairie Excelsis XL6',
    slug: 'librairie-xl6',
    category: 'Librairies chrétiennes',
    description: 'Librairie Excelsis XL6',
    url: 'https://www.xl6.com/',
    logoZone: 'partner-xl6',
    sortOrder: 10,
    isActive: true
  },
  {
    id: 'maison-bible',
    name: 'Maison de la Bible',
    slug: 'maison-de-la-bible',
    category: 'Librairies chrétiennes',
    description: 'Maison de la Bible',
    url: 'https://maisonbible.fr/fr/',
    logoZone: 'partner-maison-bible',
    sortOrder: 11,
    isActive: true
  },

  // CATÉGORIE : Organisations
  {
    id: 'cps',
    name: 'Le Conseil Protestant de Strasbourg',
    slug: 'conseil-protestant-strasbourg',
    category: 'Organisations',
    description: "Le Conseil Protestant de Strasbourg (CPS). Cet organisme réunit principalement des personnes adhérentes et bénévoles dont quelques Églises d'implantation de Strasbourg et sa banlieue, des œuvres sociales à fonctionnement protestant.",
    url: 'http://www.cps-eu.fr/',
    logoZone: 'partner-cps',
    sortOrder: 12,
    isActive: true
  },
  {
    id: 'flte',
    name: 'Faculté Libre de Théologie Évangélique',
    slug: 'flte',
    category: 'Organisations',
    description: "Faculté libre de Théologie évangélique. Pourquoi étudier la théologie ? Pour les chrétiens qui sont engagés dans l'action et qui connaissent ce qu'enseigne les Écritures, la signification de leur temps, votre un témoignage. La question peut se poser : Pourquoi étudier la théologie ? Et quel est le rapport entre la théologie et l'action chrétienne ?",
    url: 'https://flte.fr/',
    logoZone: 'partner-flte',
    sortOrder: 13,
    isActive: true
  },
  {
    id: 'fpf',
    name: 'Fédération Protestante de France',
    slug: 'federation-protestante-france',
    category: 'Organisations',
    description: "Fondée en 1905, la Fédération protestante de France rassemble plus d'une trentaine d'unions d'Églises, et plus de 80 associations, représentant environ 500 Communautés locales ainsi que le mouvement évangélique pour l'enseignement.",
    url: 'https://www.protestants.org/',
    logoZone: 'partner-fpf',
    sortOrder: 14,
    isActive: true
  },
  {
    id: 'cnef',
    name: 'Conseil National des Évangéliques de France',
    slug: 'cnef',
    category: 'Organisations',
    description: "Le CNEF se réclame de l'héritage des Réformes protestantes et des mouvements de réveils. Ses membres partagent tous une même conviction évangélique fondamentale telle qu'elle est exprimée par la Déclaration de foi de l'Alliance Évangélique.",
    url: 'https://www.lecnef.org/page/170867-le-cnef',
    logoZone: 'partner-cnef',
    sortOrder: 15,
    isActive: true
  },
  {
    id: 'cpdh',
    name: 'Comité Protestant Évangélique pour la Dignité Humaine',
    slug: 'cpdh',
    category: 'Organisations',
    description: "Le Comité Protestant Évangélique pour la Dignité Humaine (CPDH) a pour objectif d'encourager et de faciliter votre engagement en tant que citoyen chrétien dans les débats de société. Durant la majeure partie du XXème siècle, les Églises Protestantes Évangéliques ont essentiellement axé leur discours et leur action sur l'appel au salut individuel.",
    url: 'https://www.cpdh.org/',
    logoZone: 'partner-cpdh',
    sortOrder: 16,
    isActive: true
  },
  {
    id: 'acat',
    name: 'ACAT - Action des Chrétiens contre la Torture',
    slug: 'acat',
    category: 'Organisations',
    description: "L'ACAT-Action des Chrétiens contre la torture et autres du 8 décembre 1974 ici association loi 1901, elle est reconnue d'utilité publique et d'éducation populaire. Elle a pour but de combattre partout dans le monde les peines et traitements cruels, inhumains ou dégradants, la torture, les exécutions capitales judiciaires ou extra-judiciaires, les disparitions, les crimes de guerre, les crimes contre l'humanité et les crimes de haine.",
    url: 'https://www.silenceontorture.acatfrance.fr/',
    logoZone: 'partner-acat',
    sortOrder: 17,
    isActive: true
  },
  {
    id: 'entraide-relais',
    name: "L'association Entraide Le Relais",
    slug: 'entraide-relais',
    category: 'Organisations',
    description: "L'association Entraide Le Relais, à Strasbourg, a été fondée par des chrétiens évangéliques. Créée en 1977, Entraide le Relais est une association à but non lucratif, créée en 1999 par plusieurs couples qui avaient à cœur de soutenir les familles dans l'Église chrétienne et plus largement, toute personne qui en a supporte dans son travail auprès des exclus et des familles.",
    url: 'https://www.entraide-relais.fr/',
    logoZone: 'partner-entraide-relais',
    sortOrder: 18,
    isActive: true
  },
  {
    id: 'famille',
    name: 'La Famille',
    slug: 'la-famille',
    category: 'Organisations',
    description: "Famille Je t'Aime est une mission et une association Famille Protestante Évangélique s à but non lucratif, créé en 1999 par plusieurs couples qui avaient à coeur de soutenir les familles dans l'Église chrétienne et plus largement, toute personne qui s'y oppose dans le travail auprès des exclus et dans le soutien qu'elle supporte les familles.",
    url: 'https://www.famillejetaime.com/',
    logoZone: 'partner-famille',
    sortOrder: 19,
    isActive: true
  },
  {
    id: 'mission-vie-famille',
    name: 'Mission Vie et Famille',
    slug: 'mission-vie-famille',
    category: 'Organisations',
    description: "Mission Vie et Famille est une Association Familiale Protestante de soutien d'aide dans le domaine conjugal et familial. Elle est affiliée à la Fédération Nationale des Associations Protestantes Familiales Protestantes d'Aide et des Œuvres Départementales des associations familiales de Moselle",
    url: 'https://www.missionvietfamille.com/',
    logoZone: 'partner-mission-vie-famille',
    sortOrder: 20,
    isActive: true
  },
  {
    id: 'sim',
    name: 'Mission SIM',
    slug: 'mission-sim',
    category: 'Organisations',
    description: "La mission SIM est une organisation missionnaire protestante évangélique internationale et inter-dénominationnelle. Plus de 1800 missionnaires sont engagés avec SIM au niveau international, et au total, plus de 4000 personnes travaillent avec SIM.",
    url: 'https://www.simorg.fr/sim',
    logoZone: 'partner-sim',
    sortOrder: 21,
    isActive: true
  },
  {
    id: 'sel',
    name: "SEL - Service d'Entraide et de Liaison du CNEF",
    slug: 'sel',
    category: 'Organisations',
    description: "Le SEL, une action chrétienne dans un monde en détresse. Il est une association protestante de solidarité internationale qui vise à améliorer les conditions de vie de personnes et de populations en situations de pauvreté dans les pays en développement. Le SEL a été créé en France en 1980 par l'Alliance Évangélique Française (qui rassemble plusieurs protestants), L'Alliance Évangélique Française (AEF) a fusionné avec le Conseil National des Évangéliques en France (CNEF) en 2010.",
    url: 'https://www.selfrance.org/',
    logoZone: 'partner-sel',
    sortOrder: 22,
    isActive: true
  },
  {
    id: 'michee',
    name: 'Michée France',
    slug: 'michee-france',
    category: 'Organisations',
    description: "Michée France (anciennement Défi Michée) est un mouvement mondial de chrétiens qui demandent à leurs gouvernements de tenir la promesse de diminuer l'extrême pauvreté. Il encourage les chrétiens à approfondir leur engagement en faveur des pauvres et à appeler les responsables politiques à agir avec justice.",
    url: 'http://michee-france.org/',
    logoZone: 'partner-michee',
    sortOrder: 23,
    isActive: true
  },
  {
    id: 'actes6',
    name: 'Actes 6 - Au service des Églises',
    slug: 'actes-6',
    category: 'Organisations',
    description: "« Actes 6 » au service des Églises. Notre Église utilise le logiciel CALEB Gestion pour leurs lois comptabilité. Ce produit médite d'être connu. Conforme à la réglementation en vigueur, il nous donne pleine satisfaction.",
    url: 'https://www.calebgestion.com/',
    logoZone: 'partner-actes6',
    sortOrder: 24,
    isActive: true
  },

  // CATÉGORIE : Ressources bibliques
  {
    id: 'guide-lecture',
    name: 'Guide de lecture biblique',
    slug: 'guide-lecture-biblique',
    category: 'Ressources bibliques',
    description: 'Au quotidien en 6 ans avec Le Guide',
    url: 'https://www.leguideenligne.com/',
    logoZone: 'partner-guide-lecture',
    sortOrder: 25,
    isActive: true
  },
  {
    id: 'lire-bible',
    name: 'Lire la Bible',
    slug: 'lire-la-bible',
    category: 'Ressources bibliques',
    description: "Lire la Bible en ligne avec l'Alliance biblique française. Propose plusieurs versions bibliques côte à côte.",
    url: 'https://lire.la-bible.net/',
    logoZone: 'partner-lire-bible',
    sortOrder: 26,
    isActive: true
  },
  {
    id: 'topbible',
    name: 'Top Bible',
    slug: 'top-bible',
    category: 'Ressources bibliques',
    description: "Lire la Bible. Outil puissant de recherche, permet d'afficher plusieurs versions côte à côté.",
    url: 'https://lire.la-bible.net/',
    logoZone: 'partner-topbible',
    sortOrder: 27,
    isActive: true
  },
  {
    id: 'bible-mobile',
    name: 'La Bible sur mobile',
    slug: 'bible-mobile',
    category: 'Ressources bibliques',
    description: 'Bible App (Youversion). La Bible gratuite sur votre mobile. Lisible ou téléchargé. De nombreuses versions disponibles dans diverses langues.',
    url: 'https://www.bible.com/app',
    logoZone: 'partner-bible-mobile',
    sortOrder: 28,
    isActive: true
  }
];

// ========================================
// FONCTION D'IMPORT
// ========================================

async function seedPartnerSites() {
  console.log('🚀 Début de l\'import des sites partenaires...\n');

  let successCount = 0;
  let errorCount = 0;

  for (const site of partnerSites) {
    try {
      await db.collection('partner_sites').doc(site.id).set({
        ...site,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        createdBy: 'seed-script',
        createdByName: 'Seed Script'
      });

      console.log(`✅ ${site.name} (${site.category})`);
      successCount++;
    } catch (error) {
      console.error(`❌ Erreur pour ${site.name}:`, error.message);
      errorCount++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`🎉 Import terminé avec succès !`);
  console.log(`   - Sites créés : ${successCount}/${partnerSites.length}`);
  if (errorCount > 0) {
    console.log(`   - Erreurs : ${errorCount}`);
  }
  console.log('='.repeat(60) + '\n');

  process.exit(0);
}

// Exécuter
seedPartnerSites().catch((error) => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});
