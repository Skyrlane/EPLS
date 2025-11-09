const { spawn } = require('child_process');
const path = require('path');

// Fonction pour exécuter le script node
function runScript(scriptPath) {
  return new Promise((resolve, reject) => {
    console.log(`Exécution du script: ${scriptPath}`);
    
    const scriptProcess = spawn('node', [scriptPath], {
      stdio: 'inherit',
      shell: true
    });
    
    scriptProcess.on('close', (code) => {
      if (code !== 0) {
        console.log(`Le script ${scriptPath} s'est terminé avec le code: ${code}`);
        reject(new Error(`Le script ${scriptPath} a échoué avec le code ${code}`));
      } else {
        console.log(`Le script ${scriptPath} s'est terminé avec succès`);
        resolve();
      }
    });
  });
}

// Fonction principale
async function main() {
  try {
    // Créer la structure d'images
    await runScript(path.join(__dirname, 'creer-structure-images.js'));
    
    // Démarrer le serveur de développement
    console.log('\n=== DÉMARRAGE DU SERVEUR DE DÉVELOPPEMENT ===');
    const nextProcess = spawn('npm', ['run', 'dev'], {
      stdio: 'inherit',
      shell: true
    });
    
    // Écouter les signaux pour terminer proprement le processus
    process.on('SIGINT', () => {
      console.log('\nArrêt du serveur de développement...');
      nextProcess.kill('SIGINT');
    });
    
    process.on('SIGTERM', () => {
      console.log('\nArrêt du serveur de développement...');
      nextProcess.kill('SIGTERM');
    });
    
    // Attendre la fin du processus Next.js
    nextProcess.on('close', (code) => {
      console.log(`Le serveur Next.js s'est arrêté avec le code: ${code}`);
      process.exit(code);
    });
    
  } catch (error) {
    console.error('Erreur lors de l\'exécution des scripts:', error);
    process.exit(1);
  }
}

// Exécuter le script principal
main(); 