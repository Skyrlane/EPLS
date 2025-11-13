import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { collection, doc, getDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import type { MessageItem } from '@/types';
import { MessageYouTubePlayer } from '@/components/messages/MessageYouTubePlayer';
import { MessageYouTubeCard } from '@/components/messages/MessageYouTubeCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface MessagePageProps {
  params: {
    id: string;
  };
}

async function getMessage(id: string): Promise<MessageItem | null> {
  try {
    const docRef = doc(firestore, 'messages', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();

    // Vérifier que le message est publié et actif
    if (data.status !== 'published' || !data.isActive) {
      return null;
    }

    return {
      id: docSnap.id,
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
    };
  } catch (error) {
    console.error('Erreur chargement message:', error);
    return null;
  }
}

async function getRelatedMessages(
  currentId: string,
  tag: string
): Promise<MessageItem[]> {
  try {
    const messagesQuery = query(
      collection(firestore, 'messages'),
      where('status', '==', 'published'),
      where('isActive', '==', true),
      where('tag', '==', tag),
      orderBy('date', 'desc'),
      limit(4)
    );

    const querySnapshot = await getDocs(messagesQuery);
    const messages: MessageItem[] = [];

    querySnapshot.forEach((doc) => {
      if (doc.id === currentId) return; // Exclure le message actuel

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

    return messages.slice(0, 3); // Maximum 3 messages similaires
  } catch (error) {
    console.error('Erreur chargement messages similaires:', error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: MessagePageProps): Promise<Metadata> {
  const message = await getMessage(params.id);

  if (!message) {
    return {
      title: 'Message introuvable | EPLS',
    };
  }

  return {
    title: `${message.title} | Messages EPLS`,
    description: message.description,
    openGraph: {
      title: message.title,
      description: message.description,
      images: [message.coverImageUrl || message.thumbnailUrl],
      type: 'video.other',
    },
  };
}

export default async function MessagePage({ params }: MessagePageProps) {
  const message = await getMessage(params.id);

  if (!message) {
    notFound();
  }

  const relatedMessages = await getRelatedMessages(message.id, message.tag);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Bouton retour */}
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/messages">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux messages
          </Link>
        </Button>
      </div>

      {/* Lecteur et informations */}
      <div className="max-w-5xl mx-auto mb-12">
        <MessageYouTubePlayer message={message} />
      </div>

      {/* Messages similaires */}
      {relatedMessages.length > 0 && (
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Messages similaires</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedMessages.map((relatedMessage) => (
              <MessageYouTubeCard
                key={relatedMessage.id}
                message={relatedMessage}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
