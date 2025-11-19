/**
 * Script de test de connexion Airtable
 * Usage: npx tsx scripts/test-airtable.ts
 */

import 'dotenv/config';

const AIRTABLE_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY || process.env.AIRTABLE_API_KEY || '',
  baseId: "appSR5QciyUJsgoht",
  tables: {
    published: {
      id: "tbl5gJPpg0Z6s6By0",
      name: "Articles Publiés",
      columns: {
        titre: "Titre",
        url: "URL",
        contenu: "Contenu Complet",
        theme: "Thème Théologique",
        passage: "Passage Biblique",
        datePublication: "Date de Publication",
        idFirestore: "ID Firestore",
        auteur: "Auteur",
        tempsLecture: "Temps de Lecture"
      }
    }
  }
};

async function testAirtableConnection() {
  const config = AIRTABLE_CONFIG;

  console.log('🧪 Test de connexion Airtable\n');
  console.log('📋 Configuration:');
  console.log('  Base ID:', config.baseId);
  console.log('  Table ID:', config.tables.published.id);
  console.log('  Table Name:', config.tables.published.name);
  console.log('  API Key:', config.apiKey.substring(0, 10) + '...\n');

  if (!config.apiKey || config.apiKey === '') {
    console.error('❌ ERREUR: Clé API Airtable non trouvée!');
    console.error('Vérifiez que NEXT_PUBLIC_AIRTABLE_API_KEY est défini dans .env.local');
    process.exit(1);
  }

  try {
    // Test 1: Lire les records existants
    console.log('🔍 Test 1: Lecture des records existants...');
    const url = `https://api.airtable.com/v0/${config.baseId}/${config.tables.published.id}?maxRecords=1`;
    console.log('  URL:', url);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${config.apiKey}`
      }
    });

    console.log('  Status:', response.status, response.statusText);

    if (!response.ok) {
      console.error('❌ Erreur lors de la lecture de la table');
      const error = await response.json();
      console.error('Détails:', JSON.stringify(error, null, 2));
      process.exit(1);
    }

    const data = await response.json();
    console.log('✅ Connexion réussie!');
    console.log('  Records trouvés:', data.records.length);

    if (data.records.length > 0) {
      const firstRecord = data.records[0];
      console.log('\n📝 Colonnes disponibles dans Airtable:');
      const columnNames = Object.keys(firstRecord.fields).sort();
      columnNames.forEach(col => {
        console.log(`  - "${col}"`);
      });

      console.log('\n🔧 Colonnes configurées dans le code:');
      const configuredColumns = Object.values(config.tables.published.columns).sort();
      configuredColumns.forEach(col => {
        console.log(`  - "${col}"`);
      });

      // Vérifier les différences
      console.log('\n🔍 Vérification des correspondances:');
      const missingInAirtable = configuredColumns.filter(col => !columnNames.includes(col));
      const extraInAirtable = columnNames.filter(col => !configuredColumns.includes(col as string));

      if (missingInAirtable.length > 0) {
        console.log('\n⚠️  Colonnes manquantes dans Airtable (configurées dans le code mais pas dans Airtable):');
        missingInAirtable.forEach(col => {
          console.log(`  ❌ "${col}"`);
        });
      }

      if (extraInAirtable.length > 0) {
        console.log('\n📌 Colonnes supplémentaires dans Airtable (dans Airtable mais pas configurées):');
        extraInAirtable.forEach(col => {
          console.log(`  ℹ️  "${col}"`);
        });
      }

      if (missingInAirtable.length === 0 && extraInAirtable.length === 0) {
        console.log('✅ Toutes les colonnes correspondent parfaitement!');
      }
    } else {
      console.log('\n⚠️  Aucun record trouvé dans la table.');
      console.log('Créez au moins un record manuellement pour voir les colonnes disponibles.');
    }

    // Test 2: Essayer de créer un record minimal
    console.log('\n🧪 Test 2: Création d\'un record de test...');
    const testFields = {
      "Titre": "[TEST] Article de test",
      "Auteur": "Test",
      "URL": "https://epls.fr/blog/test"
    };

    console.log('  Données de test:', testFields);

    const createResponse = await fetch(
      `https://api.airtable.com/v0/${config.baseId}/${config.tables.published.id}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fields: testFields })
      }
    );

    console.log('  Status:', createResponse.status, createResponse.statusText);

    if (createResponse.ok) {
      const result = await createResponse.json();
      console.log('✅ Record de test créé avec succès!');
      console.log('  Record ID:', result.id);

      // Supprimer le record de test
      console.log('\n🧹 Suppression du record de test...');
      const deleteResponse = await fetch(
        `https://api.airtable.com/v0/${config.baseId}/${config.tables.published.id}/${result.id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${config.apiKey}`
          }
        }
      );

      if (deleteResponse.ok) {
        console.log('✅ Record de test supprimé');
      }
    } else {
      const errorData = await createResponse.json();
      console.log('❌ Erreur lors de la création du record de test');
      console.log('Détails:', JSON.stringify(errorData, null, 2));
    }

    console.log('\n✅ Tests terminés!\n');

  } catch (error) {
    console.error('\n❌ Erreur lors du test:', error);
    if (error instanceof Error) {
      console.error('Message:', error.message);
    }
    process.exit(1);
  }
}

testAirtableConnection();
