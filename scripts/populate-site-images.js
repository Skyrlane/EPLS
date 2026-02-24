/**
 * Script pour peupler les zones d'images du site avec de vraies images.
 * - Logos d'organisations : URLs directes depuis les sites officiels
 * - Images décoratives : Unsplash (libres de droits, hotlinkables)
 * - Portraits : NON inclus (nécessitent de vraies photos)
 *
 * Exécuter avec: node scripts/populate-site-images.js
 *
 * Ce script met à jour les documents existants dans site_images avec
 * imageUrl + isActive: true, sans écraser les autres champs.
 */

require('dotenv').config({ path: '.env.local' });

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');

const serviceAccount = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

// ============================================================
// IMAGE DATA
// ============================================================

const imageUpdates = [
  // ===== HERO / DECORATIVE (Unsplash) =====
  {
    zone: 'notre-eglise-hero',
    imageUrl: 'https://images.unsplash.com/photo-nZSTr5RTUd8?w=1920&h=800&fit=crop&q=80',
    source: 'unsplash',
  },
  {
    zone: 'cultes-hero',
    imageUrl: 'https://images.unsplash.com/photo-bJnndmmymW8?w=896&h=384&fit=crop&q=80',
    source: 'unsplash',
  },
  {
    zone: 'histoire-hero',
    imageUrl: 'https://images.unsplash.com/photo-Gvd-ZKXtqZM?w=600&h=400&fit=crop&q=80',
    source: 'unsplash',
  },
  {
    zone: 'histoire-union-hero',
    imageUrl: 'https://images.unsplash.com/photo-Un97RJl6CNg?w=600&h=400&fit=crop&q=80',
    source: 'unsplash',
  },

  // ===== EVE PROJECTS (Unsplash) =====
  {
    zone: 'eve-projet-burkina',
    imageUrl: 'https://images.unsplash.com/photo-nyyCd5M7tnc?w=600&h=400&fit=crop&q=80',
    source: 'unsplash',
  },
  {
    zone: 'eve-projet-togo',
    imageUrl: 'https://images.unsplash.com/photo-jEEYZsaxbH4?w=600&h=400&fit=crop&q=80',
    source: 'unsplash',
  },
  {
    zone: 'eve-projet-local',
    imageUrl: 'https://images.unsplash.com/photo-I9vlikD7RxM?w=600&h=400&fit=crop&q=80',
    source: 'unsplash',
  },

  // ===== UEEL SYNOD (Unsplash) =====
  {
    zone: 'ueel-synod',
    imageUrl: 'https://images.unsplash.com/photo-TcvZEb8cSJI?w=800&h=400&fit=crop&q=80',
    source: 'unsplash',
  },

  // ===== TIMELINE (Unsplash) =====
  {
    zone: 'histoire-1855',
    imageUrl: 'https://images.unsplash.com/photo-GHEKT3aH5kM?w=300&h=200&fit=crop&q=80',
    source: 'unsplash',
  },
  {
    zone: 'histoire-1872',
    imageUrl: 'https://images.unsplash.com/photo-X1exjxxBho4?w=300&h=200&fit=crop&q=80',
    source: 'unsplash',
  },
  {
    zone: 'histoire-1920',
    imageUrl: 'https://images.unsplash.com/photo-THSm4Qud_6k?w=300&h=200&fit=crop&q=80',
    source: 'unsplash',
  },
  {
    zone: 'histoire-1968',
    imageUrl: 'https://images.unsplash.com/photo-waYEa5iRsw4?w=300&h=200&fit=crop&q=80',
    source: 'unsplash',
  },
  {
    zone: 'histoire-1995',
    imageUrl: 'https://images.unsplash.com/photo-q_m-T4W50Z4?w=300&h=200&fit=crop&q=80',
    source: 'unsplash',
  },
  {
    zone: 'histoire-2010',
    imageUrl: 'https://images.unsplash.com/photo-fm4B1xWEIsU?w=300&h=200&fit=crop&q=80',
    source: 'unsplash',
  },
  {
    zone: 'histoire-today',
    imageUrl: 'https://images.unsplash.com/photo-VLIf9G4ZycI?w=300&h=200&fit=crop&q=80',
    source: 'unsplash',
  },
  {
    zone: 'histoire-archives',
    imageUrl: 'https://images.unsplash.com/photo-X1exjxxBho4?w=400&h=200&fit=crop&q=80',
    source: 'unsplash',
  },
  {
    zone: 'histoire-union',
    imageUrl: 'https://images.unsplash.com/photo-GHEKT3aH5kM?w=400&h=200&fit=crop&q=80',
    source: 'unsplash',
  },

  // ===== HISTOIRE UNION (Unsplash) =====
  {
    zone: 'histoire-union-origines',
    imageUrl: 'https://images.unsplash.com/photo-Un97RJl6CNg?w=800&h=500&fit=crop&q=80',
    source: 'unsplash',
  },
  {
    zone: 'histoire-union-principes',
    imageUrl: 'https://images.unsplash.com/photo-aAxn9pYE8L0?w=800&h=500&fit=crop&q=80',
    source: 'unsplash',
  },
  {
    zone: 'histoire-union-evolution',
    imageUrl: 'https://images.unsplash.com/photo-X48hkTT1qQc?w=800&h=500&fit=crop&q=80',
    source: 'unsplash',
  },
  {
    zone: 'histoire-union-aujourdhui',
    imageUrl: 'https://images.unsplash.com/photo-Z8BZx5fq_y8?w=800&h=500&fit=crop&q=80',
    source: 'unsplash',
  },

  // ===== ORGANIZATION LOGOS (official URLs) =====
  {
    zone: 'ueel-logo',
    imageUrl: 'https://www.ueel.org/wp-content/uploads/2024/11/cropped-ueel-logo-2019-white-UEEL.png',
    source: 'official',
  },
  {
    zone: 'sites-amis-protestants',
    imageUrl: 'https://www.protestants.org/wp-content/uploads/2025/01/logo-monochrome-blanc-e1738142504794.png',
    source: 'official',
  },
  {
    zone: 'sites-amis-evangile-liberte',
    imageUrl: 'https://www.evangile-et-liberte.net/wordpress/wp-content/uploads/2015/06/EvEtLib_Logo_RougeVector.png',
    source: 'official',
  },
  {
    zone: 'sites-amis-fondation-diaconat',
    imageUrl: 'https://www.fondation-diaconat.fr/templates/ukoo/img/svg/logo_fondation.svg',
    source: 'official',
  },
  {
    zone: 'sites-amis-flt-strasbourg',
    imageUrl: 'https://theopro.unistra.fr/fileadmin/templates/projects/theopro/images/picto-theopro.svg',
    source: 'official',
  },
  {
    zone: 'sites-amis-defap',
    imageUrl: 'https://www.defap.fr/wp-content/uploads/2024/03/logo_defap_hd-uai-258x170.png',
    source: 'official',
  },
  {
    zone: 'sites-amis-ceeefe',
    imageUrl: 'https://www.cepf.online/wp-content/uploads/2024/05/logo-CEPF-2024.webp',
    source: 'official',
  },
  {
    zone: 'sites-amis-musee-protestant',
    imageUrl: 'https://museeprotestant.org/wp-content/uploads/2014/01/Logo_Bersier-MUSEE-PROTESTANT_web-150x150.jpg',
    source: 'official',
  },
  {
    zone: 'sites-amis-acat',
    imageUrl: 'https://www.acatfrance.fr/app/uploads/2024/07/ID-ACAT-ORANGE.svg',
    source: 'official',
  },

  // ===== PARTNER LOGOS (official URLs) =====
  {
    zone: 'partner-radio-arcenciel',
    imageUrl: 'https://www.radioarcenciel.com/images/cache/files/hooks/Logo-Arc-En-Ciel-fond-blanc.png',
    source: 'official',
  },
  {
    zone: 'partner-radio-iris',
    imageUrl: 'https://www.radioiris.fr/images/cache/files/apps/Radio-Iris-solo-91.3.png',
    source: 'official',
  },
  {
    zone: 'partner-tresor-sonore',
    imageUrl: 'https://tresorsonore.com/logo192.png',
    source: 'official',
  },
  {
    zone: 'partner-zebuzztv',
    imageUrl: 'https://www.zebuzztv.com/Elements/logo_zebuzztv2.jpg',
    source: 'official',
  },
  {
    zone: 'partner-croire-vivre',
    imageUrl: 'https://regardsprotestants.com/wp-content/uploads/2012/12/logo_croirevivre.jpg',
    source: 'official',
  },
  {
    zone: 'partner-christianisme-aujourdhui',
    imageUrl: 'https://www.christianismeaujourdhui.info/wp-content/uploads/sites/3/2020/09/logo-christianisme-small.jpg',
    source: 'official',
  },
  {
    zone: 'partner-clc',
    imageUrl: 'https://www.clcfrance.com/_CLCFrance/images/sections/logo-colour-small-clc2.png',
    source: 'official',
  },
  {
    zone: 'partner-certitude',
    imageUrl: 'https://certitude.fr/img/certitude.png',
    source: 'official',
  },
  {
    zone: 'partner-7ici',
    imageUrl: 'https://librairie-7ici.com/img/logo-1705586931.svg',
    source: 'official',
  },
  {
    zone: 'partner-xl6',
    imageUrl: 'https://www.xl6.com/images/site/excelsis-logotype.png',
    source: 'official',
  },
  {
    zone: 'partner-maison-bible',
    imageUrl: 'https://maisonbible.fr/img/maisondelabible.png',
    source: 'official',
  },
  {
    zone: 'partner-cps',
    imageUrl: 'https://www.protestants-strasbourg.fr/images/cache/files/hooks/logo-cps-0.png',
    source: 'official',
  },
  {
    zone: 'partner-cpdh',
    imageUrl: 'https://cdn.prod.website-files.com/64823be5a2421876ec0bbf0b/648ca3d76ca2aeed02e73b42_logo-cpdh.webp',
    source: 'official',
  },
  {
    zone: 'partner-flte',
    imageUrl: 'https://flte.fr/wp-content/uploads/2020/07/FLTE-LOGO-full-blue.png',
    source: 'official',
  },
  {
    zone: 'partner-fpf',
    imageUrl: 'https://www.protestants.org/wp-content/uploads/2025/01/logo-monochrome-blanc-e1738142504794.png',
    source: 'official',
  },
  {
    zone: 'partner-sel',
    imageUrl: 'https://www.selfrance.org/_assets/67178956c1d7d710cf029b2a4ea20e5f/V3/img/selfrance.svg',
    source: 'official',
  },
  {
    zone: 'partner-sim',
    imageUrl: 'https://www.sim.org/wp-content/uploads/2025/11/Image-Mark_SIM_By-Prayer_Red_Updated.png',
    source: 'official',
  },
  {
    zone: 'partner-entraide-relais',
    imageUrl: 'https://www.entraide-relais.fr/images/cache/specific/templates/entraide/assets/logo-entraide-le-relais.png',
    source: 'official',
  },
  {
    zone: 'partner-acat',
    imageUrl: 'https://www.acatfrance.fr/app/uploads/2024/07/ID-ACAT-ORANGE.svg',
    source: 'official',
  },
  {
    zone: 'partner-actes6',
    imageUrl: 'https://www.actes6.com/images_ok/Logo_Actes6_2.gif',
    source: 'official',
  },
  {
    zone: 'partner-topbible',
    imageUrl: 'https://www.topchretien.com/static/img/uri/logos/logo-top-carre.jpg',
    source: 'official',
  },
  {
    zone: 'partner-bible-mobile',
    imageUrl: 'https://blog.youversion.com/wp-content/uploads/2021/09/app-icon-en-512x512-1.png',
    source: 'official',
  },
];

// ============================================================
// ZONES NOT POPULATED (need manual action)
// ============================================================
const skippedZones = [
  // Portraits - need real photos
  'membres-pasteur-1', 'membres-pasteur-2', 'membres-pasteur-3',
  'membres-conseil-1', 'membres-conseil-2', 'membres-conseil-3', 'membres-conseil-4',
  'missionary-gallarello', 'missionary-rolland', 'missionary-minard',
  // Logos not found
  'eve-logo',                  // EVE: too small, no public logo
  'sites-amis-uepal',         // UEPAL: logo behind auth wall
  'partner-cnef',             // CNEF: unreliable CDN URL
  'partner-michee',           // Michée France: site down
  'partner-mission-vie-famille', // Mission Vie et Famille: site blocks access
  'partner-famille',          // La Famille: no info found
  'partner-guide-lecture',    // Guide de lecture biblique: no stable URL
  'partner-lire-bible',       // Lire la Bible: signed/expiring URL
];

// ============================================================
// EXECUTION
// ============================================================

async function populateSiteImages() {
  console.log('🖼️  Peuplement des images du site...\n');
  console.log(`📊 ${imageUpdates.length} zones à mettre à jour`);
  console.log(`⏭️  ${skippedZones.length} zones ignorées (portraits/logos introuvables)\n`);

  let success = 0;
  let errors = 0;

  for (const { zone, imageUrl, source } of imageUpdates) {
    try {
      await db.collection('site_images').doc(zone).set(
        {
          imageUrl,
          isActive: true,
          updatedAt: Timestamp.now(),
          updatedBy: 'populate-script',
          updatedByName: 'Script auto-populate',
        },
        { merge: true }
      );
      const icon = source === 'official' ? '🏢' : '📷';
      console.log(`${icon} ✅ ${zone}`);
      success++;
    } catch (error) {
      console.error(`❌ ${zone}: ${error.message}`);
      errors++;
    }
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`✅ ${success} zones mises à jour`);
  if (errors > 0) console.log(`❌ ${errors} erreurs`);
  console.log(`\n⏭️  Zones à remplir manuellement via /admin/images-site :`);
  skippedZones.forEach(z => console.log(`   - ${z}`));
  console.log();
}

populateSiteImages();
