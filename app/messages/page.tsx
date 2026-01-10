import { Suspense } from 'react';
import { Metadata } from 'next';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import type { MessageItem } from '@/types';
import { MessageYouTubeCard } from '@/components/messages/MessageYouTubeCard';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { BreadcrumbItem } from '@/components/ui/breadcrumbs';

export const metadata: Metadata = {
  title: 'Messages et Prédications | EPLS',
  description: 'Retrouvez tous les messages et prédications de l\'église EPLS en vidéo',
};

async function getMessages(): Promise<MessageItem[]> {
  console.log('🎥 === CHARGEMENT DES MESSAGES ===');
  
  try {
    const messagesQuery = query(
      collection(firestore, 'messages'),
      where('status', '==', 'published'),
      where('isActive', '==', true),
      orderBy('date', 'desc'),
      limit(50)
    );

    const querySnapshot = await getDocs(messagesQuery);
    
    console.log(`✅ ${querySnapshot.size} message(s) trouvé(s) dans Firestore`);
    
    const messages: MessageItem[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      console.log(`  📄 ${data.title}:`, {
        id: doc.id,
        isActive: data.isActive,
        status: data.status,
        date: data.date?.toDate ? data.date.toDate().toLocaleDateString('fr-FR') : 'Date invalide',
        pastor: data.pastor,
        tag: data.tag
      });
      
      messages.push({
        id: doc.id,
        title: data.title,
        description: data.description,
        youtubeUrl: data.youtubeUrl,
        youtubeId: data.youtubeId,
        embedUrl: data.embedUrl,
        thumbnailUrl: data.thumbnailUrl,
        coverImageUrl: data.coverImageUrl,
        duration: data.duration,
        date: data.date?.toDate ? data.date.toDate() : new Date(),
        pastor: data.pastor,
        tag: data.tag,
        tagColor: data.tagColor,
        isActive: data.isActive,
        status: data.status,
        views: data.views || 0,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(),
      });
    });
    
    console.log(`✅ Total de ${messages.length} message(s) chargé(s) et filtré(s)`);
    
    return messages;
  } catch (error: any) {
    console.error('Erreur chargement messages:', error);
    
    // Si c'est l'erreur d'index manquant, afficher un message clair
    if (error?.code === 'failed-precondition' || error?.message?.includes('index')) {
      console.error('⚠️ INDEX FIRESTORE MANQUANT - Voir FIREBASE_INDEX_INSTRUCTIONS.md');
    }
    
    // Retourner un tableau vide pour que la page s'affiche quand même
    return [];
  }
}

function MessageListClient({ messages }: { messages: MessageItem[] }) {
  // Extraire les tags uniques
  const uniqueTags = Array.from(new Set(messages.map((m) => m.tag)));

  return (
    <div className="space-y-6">
      {uniqueTags.length > 1 ? (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full flex-wrap h-auto">
            <TabsTrigger value="all">Tous ({messages.length})</TabsTrigger>
            {uniqueTags.map((tag) => {
              const count = messages.filter((m) => m.tag === tag).length;
              return (
                <TabsTrigger key={tag} value={tag}>
                  {tag} ({count})
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {messages.map((message) => (
                <MessageYouTubeCard key={message.id} message={message} />
              ))}
            </div>
          </TabsContent>

          {uniqueTags.map((tag) => {
            const filteredMessages = messages.filter((m) => m.tag === tag);
            return (
              <TabsContent key={tag} value={tag} className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMessages.map((message) => (
                    <MessageYouTubeCard key={message.id} message={message} />
                  ))}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {messages.map((message) => (
            <MessageYouTubeCard key={message.id} message={message} />
          ))}
        </div>
      )}
    </div>
  );
}

export default async function MessagesPage() {
  const messages = await getMessages();

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Messages", href: "/messages", isCurrent: true },
  ];

  return (
    <>
      <PageHeader
        title="Messages et Prédications"
        description="Retrouvez tous les messages et enseignements de l'église EPLS"
        breadcrumbs={breadcrumbItems}
      />

      <div className="container mx-auto px-4 py-8 md:py-12">

      {/* Contenu */}
      <Suspense
        fallback={
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        }
      >
        {messages.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center space-y-4">
              <p className="text-muted-foreground text-lg">
                Aucun message disponible pour le moment.
              </p>
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 max-w-2xl mx-auto text-left">
                <p className="text-sm text-foreground font-semibold mb-2">
                  ℹ️ Configuration requise
                </p>
                <p className="text-sm text-foreground">
                  Si vous venez de déployer le site, vous devez créer un index Firestore.
                  Consultez le fichier <code className="bg-primary/20 px-1 rounded">FIREBASE_INDEX_INSTRUCTIONS.md</code> dans le code source.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <MessageListClient messages={messages} />
        )}
      </Suspense>
      </div>
    </>
  );
}
