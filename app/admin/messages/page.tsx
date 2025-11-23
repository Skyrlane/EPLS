'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { collection, getDocs, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { deleteMessage } from './actions';
import { firestore } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageForm } from '@/components/admin/MessageForm';
import { useToast } from '@/hooks/use-toast';
import type { MessageItem } from '@/types';
import { Loader2, Trash2, Edit, Eye, EyeOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { timestampToDate } from '@/lib/date-helpers';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editMessage, setEditMessage] = useState<MessageItem | null>(null);
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  // Rediriger si non connecté
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/connexion?callbackUrl=/admin/messages');
    }
  }, [user, authLoading, router]);

  // Charger les messages
  useEffect(() => {
    if (user) {
      loadMessages();
    }
  }, [user]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const messagesQuery = query(
        collection(firestore, 'messages'),
        orderBy('date', 'desc')
      );

      const querySnapshot = await getDocs(messagesQuery);
      const loadedMessages: MessageItem[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        loadedMessages.push({
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
          isActive: data.isActive ?? true,
          status: data.status || 'published',
          views: data.views || 0,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(),
        });
      });

      setMessages(loadedMessages);
    } catch (error) {
      console.error('Erreur chargement messages:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les messages',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un message
  const handleDelete = async (id: string) => {
    try {
      const result = await deleteMessage(id);
      
      if (result.success) {
        toast({ title: 'Succès', description: 'Message supprimé avec succès' });
        await loadMessages();
      } else {
        throw new Error(result.error || 'Erreur inconnue');
      }
    } catch (error) {
      console.error('Erreur suppression:', error);
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Erreur lors de la suppression',
        variant: 'destructive',
      });
    } finally {
      setDeleteId(null);
    }
  };

  // Basculer l'état actif
  const toggleActive = async (id: string, currentState: boolean) => {
    try {
      await updateDoc(doc(firestore, 'messages', id), {
        isActive: !currentState,
      });
      toast({
        title: 'Succès',
        description: `Message ${!currentState ? 'activé' : 'désactivé'}`,
      });
      await loadMessages();
    } catch (error) {
      console.error('Erreur activation:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la modification',
        variant: 'destructive',
      });
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Administration des Messages</h1>
          <p className="text-muted-foreground">
            Gérez les prédications et messages vidéo YouTube
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/membres">← Retour à l&apos;espace membres</Link>
        </Button>
      </div>

      <Tabs defaultValue="add" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="add">Ajouter un Message</TabsTrigger>
          <TabsTrigger value="list">
            Messages Existants ({messages.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="add" className="mt-6">
          <MessageForm onSaved={loadMessages} />
        </TabsContent>

        <TabsContent value="list" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Messages existants</CardTitle>
                  <CardDescription>
                    Gérez les messages : modifier, activer/désactiver, supprimer
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  onClick={loadMessages}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Chargement...
                    </>
                  ) : (
                    'Actualiser'
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">Chargement des messages...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Aucun message pour le moment.</p>
                  <p className="text-sm mt-2">
                    Utilisez l&apos;onglet &quot;Ajouter un Message&quot; pour créer le premier.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <Card key={message.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          {/* Thumbnail */}
                          <div className="relative w-32 h-20 flex-shrink-0 rounded overflow-hidden bg-muted">
                            <img
                              src={message.coverImageUrl || message.thumbnailUrl}
                              alt={message.title}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Infos */}
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <Badge
                                    style={{
                                      backgroundColor: message.tagColor,
                                      color: '#ffffff',
                                    }}
                                    className="text-xs"
                                  >
                                    {message.tag}
                                  </Badge>
                                  {!message.isActive && (
                                    <Badge variant="secondary" className="text-xs">
                                      Inactif
                                    </Badge>
                                  )}
                                  {message.status === 'draft' && (
                                    <Badge variant="outline" className="text-xs">
                                      Brouillon
                                    </Badge>
                                  )}
                                </div>
                                <h3 className="font-semibold text-lg leading-tight">
                                  {message.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {message.pastor} •{' '}
                                  {format(timestampToDate(message.date), 'd MMMM yyyy', {
                                    locale: fr,
                                  })}
                                  {message.duration && ` • ${message.duration}`}
                                </p>
                              </div>

                              {/* Actions */}
                              <div className="flex gap-2">
                                <Button
                                  size="icon"
                                  variant="outline"
                                  onClick={() => toggleActive(message.id, message.isActive)}
                                  title={message.isActive ? 'Désactiver' : 'Activer'}
                                >
                                  {message.isActive ? (
                                    <Eye className="h-4 w-4" />
                                  ) : (
                                    <EyeOff className="h-4 w-4" />
                                  )}
                                </Button>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  onClick={() => setEditMessage(message)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="destructive"
                                  onClick={() => setDeleteId(message.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce message ? Cette action est
              irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog d'édition */}
      <Dialog open={!!editMessage} onOpenChange={() => setEditMessage(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le message</DialogTitle>
          </DialogHeader>
          <MessageForm
            message={editMessage}
            onSaved={() => {
              setEditMessage(null);
              loadMessages();
            }}
            onCancel={() => setEditMessage(null)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
