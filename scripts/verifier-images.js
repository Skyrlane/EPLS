const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Chemin vers le dossier public
const PUBLIC_DIR = path.join(process.cwd(), 'public');

// Expression régulière pour trouver les chemins d'images dans les fichiers
const IMAGE_PATH_REGEX = /src\s*=\s*["']([^"']+)["']/g;
const UNSPLASH_ID_REGEX = /unsplashId\s*=\s*["']([^"']+)["']/g;

// Fonction pour vérifier si un fichier existe
function fileExists(filePath) {
  try {
    if (filePath.startsWith('http') || filePath.startsWith('https')) {
      console.log(`  - Externe (à vérifier): ${filePath}`);
      return true; // On ne peut pas vérifier directement les URL externes
    }
    
    // Normaliser le chemin
    const normalizedPath = filePath.startsWith('/') 
      ? filePath.substring(1) // Enlever le / initial pour les chemins relatifs à public
      : filePath;
    
    const fullPath = path.join(PUBLIC_DIR, normalizedPath);
    const exists = fs.existsSync(fullPath);
    
    if (!exists) {
      console.error(`  - MANQUANT: ${filePath} (${fullPath})`);
    } else {
      console.log(`  - OK: ${filePath}`);
    }
    
    return exists;
  } catch (error) {
    console.error(`  - ERREUR lors de la vérification de ${filePath}:`, error);
    return false;
  }
}

// Fonction pour extraire les chemins d'images d'un fichier
function extractImagePaths(fileContent) {
  const paths = [];
  let match;
  
  // Réinitialiser le regex avant de l'utiliser
  IMAGE_PATH_REGEX.lastIndex = 0;
  
  // Rechercher tous les src="..."
  while ((match = IMAGE_PATH_REGEX.exec(fileContent)) !== null) {
    if (match[1] && !match[1].includes('${') && !match[1].includes('$')) {
      // Exclure les chemins dynamiques avec des variables
      paths.push(match[1]);
    }
  }
  
  return paths;
}

// Fonction pour extraire les IDs Unsplash
function extractUnsplashIds(fileContent) {
  const ids = [];
  let match;
  
  // Réinitialiser le regex avant de l'utiliser
  UNSPLASH_ID_REGEX.lastIndex = 0;
  
  // Rechercher tous les unsplashId="..."
  while ((match = UNSPLASH_ID_REGEX.exec(fileContent)) !== null) {
    if (match[1]) {
      ids.push(match[1]);
    }
  }
  
  return ids;
}

// Fonction principale
function main() {
  console.log('=== VÉRIFICATION DES IMAGES ===');
  
  try {
    // Trouver tous les fichiers TSX dans app et components
    const files = glob.sync('app/**/*.tsx');
    const componentFiles = glob.sync('components/**/*.tsx');
    
    const allFiles = [...files, ...componentFiles];
    let totalPaths = 0;
    let missingPaths = 0;
    let unsplashIds = 0;
    
    console.log(`\nAnalyse de ${allFiles.length} fichiers...`);
    
    // Parcourir tous les fichiers
    for (const filePath of allFiles) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const imagePaths = extractImagePaths(fileContent);
      const unsplashIdList = extractUnsplashIds(fileContent);
      
      // Si le fichier contient des images ou des IDs Unsplash
      if (imagePaths.length > 0 || unsplashIdList.length > 0) {
        console.log(`\nFichier: ${filePath}`);
        
        // Vérifier les chemins d'images
        if (imagePaths.length > 0) {
          console.log(`  Images (${imagePaths.length}):`);
          
          for (const imagePath of imagePaths) {
            totalPaths++;
            if (!fileExists(imagePath)) {
              missingPaths++;
            }
          }
        }
        
        // Lister les IDs Unsplash
        if (unsplashIdList.length > 0) {
          console.log(`  IDs Unsplash (${unsplashIdList.length}):`);
          unsplashIds += unsplashIdList.length;
          
          for (const id of unsplashIdList) {
            console.log(`  - ${id}`);
          }
        }
      }
    }
    
    // Afficher un résumé
    console.log('\n=== RÉSUMÉ ===');
    console.log(`Chemins d'images vérifiés: ${totalPaths}`);
    console.log(`Images manquantes: ${missingPaths}`);
    console.log(`IDs Unsplash utilisés: ${unsplashIds}`);
    
    if (missingPaths > 0) {
      console.log('\n⚠️ ATTENTION: Des images sont manquantes. Exécutez node scripts/creer-structure-images.js pour créer des placeholders.');
    } else {
      console.log('\n✅ Toutes les images référencées existent!');
    }
    
  } catch (error) {
    console.error('Erreur lors de l\'exécution du script:', error);
  }
}

// Exécuter le script
main(); 