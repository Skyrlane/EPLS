'use client';

/**
 * Formulaire complet pour créer/éditer un article de blog
 */

import { useState, useEffect } from 'react';
import { Article } from '@/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';
import { MarkdownEditor } from '@/components/blog/MarkdownEditor';
import { generateSlug, calculateReadingTime, uploadBlogImage, BLOG_TAGS } from '@/lib/blog-utils';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, X, Calendar as CalendarIcon } from 'lucide-react';
import Image from 'next/image';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const articleSchema = z.object({
  title: z.string().min(5, 'Le titre doit contenir au moins 5 caractères'),
  slug: z.string().min(3, 'Le slug doit contenir au moins 3 caractères'),
  author: z.string().min(2, 'Le nom de l\'auteur est requis'),
  tag: z.string().min(1, 'Sélectionnez un tag'),
  biblicalReference: z.string().optional(),
  metaDescription: z.string().max(160, 'Maximum 150 caractères').min(10, 'Minimum 10 caractères'),
  excerpt: z.string().min(20, 'L\'extrait doit contenir au moins 20 caractères'),
  content: z.string().min(100, 'Le contenu doit contenir au moins 100 caractères'),
  status: z.enum(['draft', 'published', 'scheduled']),
});

type ArticleFormData = z.infer<typeof articleSchema>;

interface ArticleFormProps {
  article?: Article;
  onSubmit: (data: Partial<Article>) => Promise<void>;
  onCancel?: () => void;
}

export function ArticleForm({ article, onSubmit, onCancel }: ArticleFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(article?.coverImageUrl || '');
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(article?.scheduledFor);
  const [scheduledTime, setScheduledTime] = useState<string>('12:00');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: article?.title || '',
      slug: article?.slug || '',
      author: article?.author || '',
      tag: article?.tag || '',
      biblicalReference: article?.biblicalReference || '',
      metaDescription: article?.metaDescription || '',
      excerpt: article?.excerpt || '',
      content: article?.content || '',
      status: article?.status || 'draft',
    },
  });

  const watchTitle = watch('title');
  const watchContent = watch('content');
  const watchStatus = watch('status');
  const watchMetaDescription = watch('metaDescription');

  // Auto-générer le slug depuis le titre
  useEffect(() => {
    if (watchTitle && !article) {
      const slug = generateSlug(watchTitle);
      setValue('slug', slug);
    }
  }, [watchTitle, setValue, article]);

  // Calculer le temps de lecture
  const readingTime = calculateReadingTime(watchContent || '');

  // Gérer l'upload d'image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (data: ArticleFormData) => {
    try {
      setLoading(true);

      // Upload de l'image si nouvelle
      let imageUrls: { url: string; mobileUrl: string; desktopUrl: string } | undefined;
      if (imageFile) {
        imageUrls = await uploadBlogImage(imageFile, imageFile.name);
      }

      // Préparer les données
      const articleData: Partial<Article> = {
        ...data,
        slug: generateSlug(data.slug), // Re-générer pour être sûr
        readingTime,
        coverImageUrl: imageUrls?.url || article?.coverImageUrl || '',
        coverImageMobile: imageUrls?.mobileUrl || article?.coverImageMobile,
        coverImageDesktop: imageUrls?.desktopUrl || article?.coverImageDesktop,
        isActive: true,
        views: article?.views || 0,
        syncedToAirtable: article?.syncedToAirtable || false,
      };

      // Gérer la date programmée
      if (data.status === 'scheduled' && scheduledDate) {
        const [hours, minutes] = scheduledTime.split(':');
        const scheduled = new Date(scheduledDate);
        scheduled.setHours(parseInt(hours), parseInt(minutes));
        articleData.scheduledFor = scheduled;
      }

      // Gérer la publication immédiate
      if (data.status === 'published' && !article?.publishedAt) {
        articleData.publishedAt = new Date();
      }

      await onSubmit(articleData);

      toast({
        title: 'Succès',
        description: article ? 'Article mis à jour' : 'Article créé',
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder l\'article',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Titre */}
      <div className="space-y-2">
        <Label htmlFor="title">Titre *</Label>
        <Input
          id="title"
          {...register('title')}
          placeholder="Un titre accrocheur pour votre article"
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      {/* Slug */}
      <div className="space-y-2">
        <Label htmlFor="slug">Slug (URL) *</Label>
        <Input
          id="slug"
          {...register('slug')}
          placeholder="slug-de-l-article"
        />
        {errors.slug && (
          <p className="text-sm text-destructive">{errors.slug.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          URL de l&apos;article : /blog/{watch('slug') || 'slug-de-l-article'}
        </p>
      </div>

      {/* Auteur + Tag */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="author">Auteur *</Label>
          <Input
            id="author"
            {...register('author')}
            placeholder="Nom de l'auteur"
          />
          {errors.author && (
            <p className="text-sm text-destructive">{errors.author.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="tag">Tag *</Label>
          <Select
            value={watch('tag')}
            onValueChange={(value) => setValue('tag', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez un tag" />
            </SelectTrigger>
            <SelectContent>
              {BLOG_TAGS.map((tag) => (
                <SelectItem key={tag.label} value={tag.label}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: tag.color }}
                    />
                    {tag.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.tag && (
            <p className="text-sm text-destructive">{errors.tag.message}</p>
          )}
        </div>
      </div>

      {/* Passage biblique */}
      <div className="space-y-2">
        <Label htmlFor="biblicalReference">Passage Biblique (optionnel)</Label>
        <Input
          id="biblicalReference"
          {...register('biblicalReference')}
          placeholder="Jean 3:16"
        />
      </div>

      {/* Méta-description */}
      <div className="space-y-2">
        <Label htmlFor="metaDescription">
          Méta-description * (SEO - {watchMetaDescription?.length || 0}/160)
        </Label>
        <Textarea
          id="metaDescription"
          {...register('metaDescription')}
          placeholder="Description courte pour les moteurs de recherche (max 160 caractères)"
          rows={2}
        />
        {errors.metaDescription && (
          <p className="text-sm text-destructive">{errors.metaDescription.message}</p>
        )}
      </div>

      {/* Extrait */}
      <div className="space-y-2">
        <Label htmlFor="excerpt">Extrait/Résumé *</Label>
        <Textarea
          id="excerpt"
          {...register('excerpt')}
          placeholder="Un résumé court qui sera affiché dans la carte de l'article"
          rows={3}
        />
        {errors.excerpt && (
          <p className="text-sm text-destructive">{errors.excerpt.message}</p>
        )}
      </div>

      {/* Image de couverture */}
      <div className="space-y-2">
        <Label htmlFor="coverImage">Image de couverture *</Label>
        <div className="space-y-4">
          {imagePreview && (
            <Card className="relative p-4">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-6 right-6"
                onClick={() => {
                  setImageFile(null);
                  setImagePreview('');
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </Card>
          )}

          <div>
            <Input
              id="coverImage"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="cursor-pointer"
            />
            <p className="text-xs text-muted-foreground mt-1">
              L&apos;image sera automatiquement optimisée en 3 formats (original, mobile 800px, desktop 1200px)
            </p>
          </div>
        </div>
      </div>

      {/* Contenu Markdown */}
      <div className="space-y-2">
        <Label>
          Contenu * (Temps de lecture: {readingTime} min)
        </Label>
        <MarkdownEditor
          value={watch('content') || ''}
          onChange={(value) => setValue('content', value)}
        />
        {errors.content && (
          <p className="text-sm text-destructive">{errors.content.message}</p>
        )}
      </div>

      {/* Status */}
      <div className="space-y-3">
        <Label>Statut de publication *</Label>
        <RadioGroup
          value={watchStatus}
          onValueChange={(value) => setValue('status', value as 'draft' | 'published' | 'scheduled')}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="draft" id="draft" />
            <Label htmlFor="draft" className="font-normal cursor-pointer">
              Brouillon
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="published" id="published" />
            <Label htmlFor="published" className="font-normal cursor-pointer">
              Publier maintenant
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="scheduled" id="scheduled" />
            <Label htmlFor="scheduled" className="font-normal cursor-pointer">
              Programmer la publication
            </Label>
          </div>
        </RadioGroup>

        {/* Date/heure programmée */}
        {watchStatus === 'scheduled' && (
          <div className="ml-6 space-y-3 p-4 border rounded-lg">
            <div className="space-y-2">
              <Label>Date de publication</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {scheduledDate ? (
                      format(scheduledDate, 'PPP', { locale: fr })
                    ) : (
                      <span>Sélectionnez une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={scheduledDate}
                    onSelect={setScheduledDate}
                    initialFocus
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduledTime">Heure</Label>
              <Input
                id="scheduledTime"
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Boutons d'action */}
      <div className="flex items-center gap-3 pt-4 border-t">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Annuler
          </Button>
        )}

        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {article ? 'Mettre à jour' : 'Créer l\'article'}
        </Button>
      </div>
    </form>
  );
}
