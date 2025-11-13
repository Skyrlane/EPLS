import { Suspense } from 'react';
import { Metadata } from 'next';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import type { MessageItem } from '@/types';
import { MessageYouTubeCard } from '@/components/messages/MessageYouTubeCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Messages et Prédications | EPLS',
  description: 'Retrouvez tous les messages et prédications de l\'église EPLS en vidéo',
};

async function getMessages(): Promise<MessageItem[]> {
  try {
    const messagesQuery = query(
      collection(firestore, 'messages'),
      where('status', '==', 'published'),
      where('isActive', '==', true),
      orderBy('date', 'desc'),
      limit(50)
    );

    const querySnapshot = await getDocs(messagesQuery);
    const messages: MessageItem[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
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

    return messages;
  } catch (error) {
    console.error('Erreur chargement messages:', error);
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

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Messages et Prédications
        </h1>
        <p className="text-lg text-muted-foreground">
          Retrouvez tous les messages et enseignements de l&apos;église EPLS
        </p>
      </div>

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
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                Aucun message disponible pour le moment.
              </p>
            </CardContent>
          </Card>
        ) : (
          <MessageListClient messages={messages} />
        )}
      </Suspense>
    </div>
  );
}
