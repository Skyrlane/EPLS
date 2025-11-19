'use server';

interface PublishArticleData {
  articleId: string;
  title: string;
  author: string;
  readingTime: number;
  slug: string;
  content: string;
  tag: string;
  biblicalReference?: string;
  airtablePublishedId?: string; // ID du record Airtable existant (si republication)
}

interface PublishArticleResult {
  success: boolean;
  message: string;
  airtableRecordId?: string;
  warning?: string;
  error?: string;
}

export async function publishArticleAction(data: PublishArticleData): Promise<PublishArticleResult> {
  console.log('🚀 === SERVER ACTION: publishArticleAction ===');
  console.log('Article ID:', data.articleId);
  console.log('Title:', data.title);
  console.log('Airtable Record ID existant:', data.airtablePublishedId || 'Aucun (nouveau)');
  
  try {
    // Push vers Airtable (côté serveur uniquement)
    if (data.airtablePublishedId) {
      console.log('♻️ Mise à jour du record Airtable existant...');
      await updateAirtableRecord(data.airtablePublishedId, data);
      console.log('✅ Record Airtable mis à jour');
      return {
        success: true,
        message: 'Article mis à jour dans Airtable !',
        airtableRecordId: data.airtablePublishedId
      };
    } else {
      console.log('🆕 Création d\'un nouveau record Airtable...');
      const airtableRecordId = await pushToAirtableServer(data);
      
      console.log('✅ Article synchronisé avec Airtable, Record ID:', airtableRecordId);
      
      return {
        success: true,
        message: 'Article créé dans Airtable !',
        airtableRecordId
      };
    }
    
  } catch (airtableError) {
    console.error('⚠️ Erreur synchronisation Airtable:', airtableError);
    
    return {
      success: false,
      message: 'Erreur de synchronisation Airtable',
      error: airtableError instanceof Error ? airtableError.message : String(airtableError)
    };
  }
}

/**
 * Met à jour un record Airtable existant
 */
async function updateAirtableRecord(recordId: string, data: PublishArticleData): Promise<void> {
  console.log('🚀 === MISE À JOUR RECORD AIRTABLE ===');
  console.log('  Record ID:', recordId);
  
  const apiKey = process.env.NEXT_PUBLIC_AIRTABLE_API_KEY;
  const baseId = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;
  
  if (!apiKey || !baseId) {
    throw new Error('Variables Airtable manquantes (NEXT_PUBLIC_AIRTABLE_API_KEY ou NEXT_PUBLIC_AIRTABLE_BASE_ID)');
  }
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const articleUrl = `${siteUrl}/blog/${data.slug}`;
  
  const fields: Record<string, any> = {
    "Titre": data.title,
    "URL": articleUrl,
    "Auteur": data.author,
    "Temps de Lecture": data.readingTime,
    "Contenu Complet": data.content.substring(0, 500) + '...',
    "Thème Théologique": data.tag,
    "Passage Biblique": data.biblicalReference || '',
    "Date de Publication": new Date().toISOString(),
    "ID Firestore": data.articleId
  };
  
  console.log('  Champs à mettre à jour:', Object.keys(fields));
  
  const url = `https://api.airtable.com/v0/${baseId}/Articles%20Publi%C3%A9s/${recordId}`;
  
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ fields })
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    console.error('❌ Erreur lors de la mise à jour Airtable:', errorData);
    throw new Error(`Airtable ${response.status}: ${errorData.error?.message || 'Erreur inconnue'}`);
  }
  
  console.log('✅ Record mis à jour avec succès');
}

/**
 * Crée un nouveau record Airtable
 */
async function pushToAirtableServer(data: PublishArticleData): Promise<string> {
  console.log('🚀 === DÉBUT PUSH VERS AIRTABLE (SERVER) ===');
  
  const apiKey = process.env.NEXT_PUBLIC_AIRTABLE_API_KEY;
  const baseId = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;
  
  console.log('📋 Configuration:');
  console.log('  - API Key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'MANQUANTE');
  console.log('  - Base ID:', baseId || 'MANQUANT');
  
  if (!apiKey || !baseId) {
    throw new Error('Variables Airtable manquantes (NEXT_PUBLIC_AIRTABLE_API_KEY ou NEXT_PUBLIC_AIRTABLE_BASE_ID)');
  }
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const articleUrl = `${siteUrl}/blog/${data.slug}`;
  
  console.log('📋 === CONSTRUCTION DES CHAMPS ===');
  
  const fields: Record<string, any> = {};
  
  fields["Titre"] = data.title;
  console.log(`  ✓ [Titre] = "${data.title}"`);
  
  fields["URL"] = articleUrl;
  console.log(`  ✓ [URL] = "${articleUrl}"`);
  
  fields["Auteur"] = data.author;
  console.log(`  ✓ [Auteur] = "${data.author}"`);
  
  fields["Temps de Lecture"] = data.readingTime;
  console.log(`  ✓ [Temps de Lecture] = ${data.readingTime}`);
  
  fields["Contenu Complet"] = data.content.substring(0, 500) + '...';
  console.log(`  ✓ [Contenu Complet] = "${fields["Contenu Complet"].substring(0, 50)}..." (${data.content.length} caractères)`);
  
  fields["Thème Théologique"] = data.tag;
  console.log(`  ✓ [Thème Théologique] = "${data.tag}"`);
  
  fields["Passage Biblique"] = data.biblicalReference || '';
  console.log(`  ✓ [Passage Biblique] = "${data.biblicalReference || '(vide)'}"`);
  
    const datePublication = new Date().toISOString();
  fields["Date de Publication"] = datePublication;
  console.log(`  ✓ [Date de Publication] = "${datePublication}"`);
  
    fields["ID Firestore"] = data.articleId;
  console.log(`  ✓ [ID Firestore] = "${data.articleId}"`);
  
    console.log('📦 === PAYLOAD COMPLET ===');
  console.log('  Nombre de champs:', Object.keys(fields).length);
  console.log('  Noms des champs:', Object.keys(fields));
  console.log('  Payload JSON:', JSON.stringify({ fields }, null, 2));
  
  const url = `https://api.airtable.com/v0/${baseId}/Articles%20Publi%C3%A9s`;
  
  console.log('🌐 === REQUÊTE HTTP ===');
  console.log('  Method: POST');
  console.log('  URL:', url);
  console.log('  Headers: Authorization, Content-Type');
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ fields })
  });
  
  console.log('📡 === RÉPONSE HTTP ===');
  console.log('  Status:', response.status, response.statusText);
  console.log('  OK:', response.ok);
  
  if (!response.ok) {
    const errorData = await response.json();
    console.error('❌ === ERREUR AIRTABLE DÉTAILLÉE ===');
    console.error('Status Code:', response.status);
    console.error('Status Text:', response.statusText);
    console.error('Error Data:', JSON.stringify(errorData, null, 2));
    console.error('Error Type:', errorData.error?.type);
    console.error('Error Message:', errorData.error?.message);
    
    console.error('\n⚠️  ERREUR', response.status, '- BAD REQUEST');
    console.error('Cela signifie généralement:');
    console.error('  1. Un nom de colonne est incorrect dans Airtable');
    console.error('  2. Un type de données est incompatible');
    console.error('  3. Un champ requis est manquant');
    console.error('\nVérifiez que ces colonnes existent dans Airtable:');
    Object.keys(fields).forEach(col => {
      console.error(`  - "${col}"`);
    });
    
    throw new Error(`Airtable ${response.status}: ${errorData.error?.message || 'Erreur inconnue'}`);
  }
  
  const result = await response.json();
  console.log('✅ === SUCCÈS ===');
  console.log('  Record créé avec succès!');
  console.log('  Record ID:', result.id);
  console.log('  Created Time:', result.createdTime);
  
  return result.id;
}
