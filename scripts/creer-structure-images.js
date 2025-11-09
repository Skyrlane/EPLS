const fs = require('fs');
const path = require('path');

// Chemin vers le dossier public
const PUBLIC_DIR = path.join(process.cwd(), 'public');

// Structure de dossiers à créer
const IMAGE_DIRECTORIES = [
  'images/valeurs',
  'images/histoire',
  'images/events',
  'images/messages',
  'images/echo',
  'images/hero',
  'images/qui-sommes-nous'
];

// Liste des chemins d'images communs trouvés dans le code
const COMMON_IMAGE_PATHS = [
  // Page d'accueil
  'images/events/culte.jpg',
  'images/events/etude-biblique.jpg',
  'images/events/priere.jpg',
  'images/messages/grace.jpg',
  'images/echo/echo-avril.jpg',
  
  // Page nos valeurs
  'images/valeurs/communaute.jpg',
  'images/valeurs/enseignement.jpg',
  'images/valeurs/service.jpg',
  'images/valeurs/priere.jpg',
  
  // Page histoire
  'images/histoire/eglise-histoire.jpg',
  
  // Vérifier que ces images existent
  'church-hero.png',
  'placeholder.svg'
];

// Fonction pour créer un répertoire s'il n'existe pas
function createDirectoryIfNotExists(dirPath) {
  const fullPath = path.join(PUBLIC_DIR, dirPath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`Création du répertoire: ${dirPath}`);
    fs.mkdirSync(fullPath, { recursive: true });
    return true;
  }
  
  return false;
}

// Fonction pour copier le placeholder vers un chemin d'image manquant
function createPlaceholderForMissingImage(imagePath) {
  const fullPath = path.join(PUBLIC_DIR, imagePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`Création d'un placeholder pour: ${imagePath}`);
    
    // S'assurer que le répertoire parent existe
    const dirPath = path.dirname(fullPath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    // Copier le placeholder.svg vers ce chemin
    try {
      const placeholderPath = path.join(PUBLIC_DIR, 'placeholder.svg');
      if (fs.existsSync(placeholderPath)) {
        fs.copyFileSync(placeholderPath, fullPath);
        return true;
      } else {
        console.error('Le fichier placeholder.svg est introuvable!');
        return false;
      }
    } catch (error) {
      console.error(`Erreur lors de la création du placeholder pour ${imagePath}:`, error);
      return false;
    }
  }
  
  return false;
}

// Fonction principale
function main() {
  console.log('=== CRÉATION DE LA STRUCTURE D\'IMAGES ===');
  
  let createdDirs = 0;
  let createdPlaceholders = 0;
  
  // Créer les répertoires manquants
  IMAGE_DIRECTORIES.forEach(dir => {
    if (createDirectoryIfNotExists(dir)) {
      createdDirs++;
    }
  });
  
  // Créer des placeholders pour les images manquantes
  COMMON_IMAGE_PATHS.forEach(imagePath => {
    if (createPlaceholderForMissingImage(imagePath)) {
      createdPlaceholders++;
    }
  });
  
  console.log('\n=== RÉSUMÉ ===');
  console.log(`Répertoires créés: ${createdDirs}`);
  console.log(`Placeholders créés: ${createdPlaceholders}`);
  
  if (createdDirs > 0 || createdPlaceholders > 0) {
    console.log('\n✅ Structure d\'images créée avec succès!');
  } else {
    console.log('\n✅ La structure d\'images est déjà complète.');
  }
}

// Exécuter le script
main(); 