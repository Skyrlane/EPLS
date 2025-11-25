/**
 * 🌱 Script de seed des tags galerie
 *
 * Crée les 7 tags par défaut pour la galerie photos
 *
 * Usage:
 *   npx tsx scripts/seed-gallery-tags.ts
 */

import { collection, addDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { firestore } from '../lib/firebase';

const DEFAULT_TAGS = [
  { name: 'Cultes', color: '#3B82F6', description: 'Services religieux et cultes dominicaux' },
  { name: 'Événements', color: '#10B981', description: 'Événements spéciaux et activités communautaires' },
  { name: 'Jeunesse', color: '#F59E0B', description: 'Activités pour les jeunes et adolescents' },
  { name: 'Baptêmes', color: '#8B5CF6', description: 'Cérémonies de baptême' },
  { name: 'Mariages', color: '#EC4899', description: 'Cérémonies de mariage' },
  { name: 'Bâtiment', color: '#6B7280', description: 'Infrastructure et locaux de l\'église' },
  { name: 'Équipe', color: '#06B6D4', description: 'Membres de l\'équipe et bénévoles' }
];

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')                    // Décompose les caractères accentués
    .replace(/[\u0300-\u036f]/g, '')    // Supprime les accents
    .replace(/[^a-z0-9]+/g, '-')        // Remplace non-alphanum par tirets
    .replace(/^-+|-+$/g, '');           // Supprime tirets en début/fin
}

async function tagExists(slug: string): Promise<boolean> {
  const q = query(
    collection(firestore, 'gallery_tags'),
    where('slug', '==', slug)
  );
  const snapshot = await getDocs(q);
  return !snapshot.empty;
}

async function seedTags() {
  console.log('🌱 Démarrage du seeding des tags galerie...\n');

  let created = 0;
  let skipped = 0;

  for (const tag of DEFAULT_TAGS) {
    const slug = generateSlug(tag.name);

    // Vérifier si le tag existe déjà
    const exists = await tagExists(slug);

    if (exists) {
      console.log(`⏭️  Tag "${tag.name}" existe déjà (slug: ${slug})`);
      skipped++;
      continue;
    }

    try {
      await addDoc(collection(firestore, 'gallery_tags'), {
        name: tag.name,
        slug,
        color: tag.color,
        description: tag.description,
        count: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      console.log(`✅ Tag créé: ${tag.name} (slug: ${slug}, couleur: ${tag.color})`);
      created++;
    } catch (error) {
      console.error(`❌ Erreur lors de la création du tag "${tag.name}":`, error);
    }
  }

  console.log('\n🎉 Seeding terminé !');
  console.log(`📊 Résumé: ${created} créés, ${skipped} ignorés (déjà existants)`);
}

// Exécution
seedTags()
  .then(() => {
    console.log('\n✨ Script terminé avec succès');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erreur fatale:', error);
    process.exit(1);
  });
