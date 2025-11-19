'use client';

import { useState } from 'react';
import { parseAnnouncementsHTML, type ParsedAnnouncement } from '@/lib/html-parser';
import { categorizeAnnouncements, convertToFirestoreAnnouncement } from '@/lib/announcements-utils';
import type { Announcement } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Upload, CheckCircle2, AlertCircle, Calendar, MapPin, Tag } from 'lucide-react';
import { collection, addDoc, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { formatAnnouncementDate } from '@/lib/announcements-utils';

interface AnnouncementImporterProps {
  existingAnnouncements: Announcement[];
  onImportComplete: () => void;
}

interface ParsedWithSelection extends ParsedAnnouncement {
  selected: boolean;
  status: 'new' | 'duplicate' | 'update';
  existingId?: string;
}

export function AnnouncementImporter({
  existingAnnouncements,
  onImportComplete
}: AnnouncementImporterProps) {
  const { toast } = useToast();
  const [htmlContent, setHtmlContent] = useState('');
  const [parsedAnnouncements, setParsedAnnouncements] = useState<ParsedWithSelection[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  // Parser le HTML
  const handleParse = () => {
    if (!htmlContent.trim()) {
      toast({ title: "Erreur", description: 'Veuillez coller du HTML à parser', variant: "destructive" });
      return;
    }

    setIsParsing(true);

    try {
      const parsed = parseAnnouncementsHTML(htmlContent);

      if (parsed.length === 0) {
        toast({ title: "Erreur", description: 'Aucune annonce trouvée dans le HTML', variant: "destructive" });
        setIsParsing(false);
        return;
      }

      // Catégoriser par rapport aux annonces existantes
      const { toAdd, duplicates, toUpdate } = categorizeAnnouncements(parsed, existingAnnouncements);

      // Créer le tableau avec sélection et statut
      const withSelection: ParsedWithSelection[] = [
        ...toAdd.map(a => ({ ...a, selected: true, status: 'new' as const })),
        ...toUpdate.map(u => ({
          ...u.new,
          selected: true,
          status: 'update' as const,
          existingId: u.existing.id
        })),
        ...duplicates.map(d => ({
          ...d.new,
          selected: false,
          status: 'duplicate' as const,
          existingId: d.existing.id
        }))
      ];

      setParsedAnnouncements(withSelection);
      toast({ title: "Succès", description: `${parsed.length} annonce(s) détectée(s)` });
    } catch (error) {
      console.error('Erreur parsing:', error);
      toast({ title: "Erreur", description: 'Erreur lors du parsing du HTML', variant: "destructive" });
    } finally {
      setIsParsing(false);
    }
  };

  // Toggle sélection d'une annonce
  const toggleSelection = (index: number) => {
    setParsedAnnouncements(prev =>
      prev.map((a, i) => (i === index ? { ...a, selected: !a.selected } : a))
    );
  };

  // Mettre à jour un champ d'une annonce
  const updateAnnouncement = (index: number, updates: Partial<ParsedWithSelection>) => {
    setParsedAnnouncements(prev =>
      prev.map((a, i) => (i === index ? { ...a, ...updates } : a))
    );
  };

  // Formater la date pour input datetime-local
  const formatDateTimeLocal = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Parser datetime-local et mettre à jour date + time
  const handleDateTimeChange = (index: number, dateTimeString: string) => {
    const newDate = new Date(dateTimeString);
    const hours = String(newDate.getHours()).padStart(2, '0');
    const minutes = String(newDate.getMinutes()).padStart(2, '0');
    const newTime = `${hours}h${minutes}`;

    updateAnnouncement(index, { date: newDate, time: newTime });
  };

  // Importer les annonces sélectionnées
  const handleImport = async () => {
    const selected = parsedAnnouncements.filter(a => a.selected);

    if (selected.length === 0) {
      toast({ title: "Erreur", description: 'Veuillez sélectionner au moins une annonce', variant: "destructive" });
      return;
    }

    console.log('🚀 === DÉBUT IMPORT ANNONCES ===');
    console.log('Nombre d\'annonces à importer:', selected.length);

    setIsImporting(true);

    try {
      let addedCount = 0;
      let updatedCount = 0;
      let errorCount = 0;
      const errors: string[] = [];

      for (const announcement of selected) {
        try {
          console.log(`📝 Import annonce: "${announcement.title}"`);

          // Validation
          if (!announcement.title?.trim()) {
            throw new Error('Titre manquant');
          }
          if (!announcement.date) {
            throw new Error('Date manquante');
          }
          if (!announcement.location?.name?.trim()) {
            throw new Error('Lieu manquant');
          }

          if (announcement.status === 'new') {
            // Créer une nouvelle annonce
            console.log('  → Création d\'une nouvelle annonce');
            const docData = {
              ...convertToFirestoreAnnouncement(announcement, addedCount + 1),
              date: Timestamp.fromDate(announcement.date),
              createdAt: Timestamp.now(),
              updatedAt: Timestamp.now()
            };

            console.log('  → Données:', docData);
            await addDoc(collection(firestore, 'announcements'), docData);
            console.log('  ✅ Annonce créée');
            addedCount++;
          } else if (announcement.status === 'update' && announcement.existingId) {
            // Mettre à jour une annonce existante
            console.log('  → Mise à jour d\'une annonce existante');
            const docRef = doc(firestore, 'announcements', announcement.existingId);
            const updateData = {
              title: announcement.title,
              date: Timestamp.fromDate(announcement.date),
              time: announcement.time,
              location: announcement.location,
              details: announcement.details,
              pricing: announcement.pricing,
              type: announcement.type,
              tag: announcement.tag,
              tagColor: announcement.tagColor,
              updatedAt: Timestamp.now()
            };

            console.log('  → Données de mise à jour:', updateData);
            await updateDoc(docRef, updateData);
            console.log('  ✅ Annonce mise à jour');
            updatedCount++;
          }
        } catch (error) {
          console.error(`❌ Erreur pour "${announcement.title}":`, error);
          const errorMessage = error instanceof Error ? error.message : String(error);
          errors.push(`${announcement.title}: ${errorMessage}`);
          errorCount++;
        }
      }

      // Logs de résumé
      console.log('=== RÉSULTAT IMPORT ===');
      console.log(`✅ Ajoutées: ${addedCount}`);
      console.log(`♻️ Mises à jour: ${updatedCount}`);
      console.log(`❌ Erreurs: ${errorCount}`);

      // Feedback
      if (addedCount > 0) {
        toast({ title: "Succès", description: `${addedCount} annonce(s) ajoutée(s)` });
      }
      if (updatedCount > 0) {
        toast({ title: "Succès", description: `${updatedCount} annonce(s) mise(s) à jour` });
      }
      if (errorCount > 0) {
        console.error('Détails des erreurs:', errors);
        toast({ title: "Erreur", description: `${errorCount} erreur(s)`, variant: "destructive" });

        // Afficher les erreurs détaillées
        errors.forEach(err => {
          toast({ title: "Détail erreur", description: err, variant: "destructive", duration: 5000 });
        });
      }

      // Reset seulement si succès total ou partiel
      if (addedCount > 0 || updatedCount > 0) {
        setHtmlContent('');
        setParsedAnnouncements([]);
        onImportComplete();
      }
    } catch (error) {
      console.error('Erreur import:', error);
      toast({ title: "Erreur", description: 'Erreur lors de l\'import', variant: "destructive" });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Section de saisie HTML */}
      <Card>
        <CardHeader>
          <CardTitle>Importer des Annonces depuis HTML</CardTitle>
          <CardDescription>
            Collez le HTML des annonces ci-dessous, puis cliquez sur "Parser" pour prévisualiser
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={htmlContent}
            onChange={(e) => setHtmlContent(e.target.value)}
            placeholder="Collez votre HTML ici..."
            className="min-h-[300px] font-mono text-sm"
          />

          <div className="flex gap-2">
            <Button
              onClick={handleParse}
              disabled={!htmlContent.trim() || isParsing}
            >
              {isParsing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Parser et Prévisualiser
            </Button>

            {parsedAnnouncements.length > 0 && (
              <Button
                onClick={handleImport}
                disabled={isImporting || parsedAnnouncements.filter(a => a.selected).length === 0}
                variant="default"
              >
                {isImporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Upload className="mr-2 h-4 w-4" />
                Importer {parsedAnnouncements.filter(a => a.selected).length} annonce(s)
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Prévisualisation des annonces parsées */}
      {parsedAnnouncements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Annonces Détectées ({parsedAnnouncements.length})</CardTitle>
            <CardDescription>
              Sélectionnez les annonces à importer. Les doublons sont désélectionnés par défaut.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Résumé */}
              <Alert>
                <AlertDescription className="flex items-center gap-4">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <strong>{parsedAnnouncements.filter(a => a.status === 'new').length}</strong> Nouvelles
                  </span>
                  <span className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    <strong>{parsedAnnouncements.filter(a => a.status === 'duplicate').length}</strong> Doublons
                  </span>
                  <span className="flex items-center gap-2">
                    <Upload className="h-4 w-4 text-blue-600" />
                    <strong>{parsedAnnouncements.filter(a => a.status === 'update').length}</strong> À mettre à jour
                  </span>
                </AlertDescription>
              </Alert>

              {/* Liste des annonces */}
              <div className="grid grid-cols-1 gap-4">
                {parsedAnnouncements.map((announcement, index) => (
                  <Card
                    key={index}
                    className={`relative ${
                      announcement.selected ? 'border-primary' : 'opacity-60'
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <Checkbox
                            checked={announcement.selected}
                            onCheckedChange={() => toggleSelection(index)}
                            className="mt-1"
                          />
                          <div className="space-y-3 flex-1">
                            {/* Titre éditable */}
                            <div>
                              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                                Titre *
                              </label>
                              <input
                                type="text"
                                value={announcement.title}
                                onChange={(e) => updateAnnouncement(index, { title: e.target.value })}
                                className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                                placeholder="Titre de l'annonce"
                              />
                            </div>

                            {/* Badges de statut */}
                            <div className="flex items-center gap-2 flex-wrap">
                              {announcement.status === 'new' && (
                                <Badge variant="default" className="bg-green-600">Nouvelle</Badge>
                              )}
                              {announcement.status === 'duplicate' && (
                                <Badge variant="secondary" className="bg-orange-600 text-white">Doublon</Badge>
                              )}
                              {announcement.status === 'update' && (
                                <Badge variant="outline" className="border-blue-600 text-blue-600">Mise à jour</Badge>
                              )}
                            </div>

                            {/* Date et heure éditables */}
                            <div>
                              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                                Date et heure *
                              </label>
                              <input
                                type="datetime-local"
                                value={formatDateTimeLocal(announcement.date)}
                                onChange={(e) => handleDateTimeChange(index, e.target.value)}
                                className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                              />
                            </div>

                            {/* Lieu éditable */}
                            <div>
                              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                                Lieu *
                              </label>
                              <input
                                type="text"
                                value={announcement.location.name}
                                onChange={(e) => updateAnnouncement(index, {
                                  location: { ...announcement.location, name: e.target.value }
                                })}
                                className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                                placeholder="Nom du lieu"
                              />
                            </div>

                            {/* Adresse éditable */}
                            <div>
                              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                                Adresse
                              </label>
                              <input
                                type="text"
                                value={announcement.location.address}
                                onChange={(e) => updateAnnouncement(index, {
                                  location: { ...announcement.location, address: e.target.value }
                                })}
                                className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                                placeholder="Adresse complète (optionnel)"
                              />
                            </div>

                            {/* Tag (lecture seule avec badge) */}
                            <div className="flex items-center gap-2">
                              <Tag className="h-4 w-4" />
                              <Badge
                                style={{ backgroundColor: announcement.tagColor }}
                                className="text-white"
                              >
                                {announcement.tag}
                              </Badge>
                            </div>

                            {/* Détails éditables */}
                            <div>
                              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                                Détails (un par ligne)
                              </label>
                              <textarea
                                value={(announcement.details || []).join('\\n')}
                                onChange={(e) => {
                                  const lines = e.target.value.split('\\n').filter(l => l.trim());
                                  updateAnnouncement(index, { details: lines.length > 0 ? lines : undefined });
                                }}
                                className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                                rows={3}
                                placeholder="Détails supplémentaires (optionnel)&#10;Un détail par ligne"
                              />
                            </div>

                            {announcement.pricing && (
                              <div className="mt-2">
                                <p className="text-xs font-semibold text-muted-foreground mb-1">Tarification :</p>
                                <ul className="text-xs text-muted-foreground space-y-0.5">
                                  {announcement.pricing.free && <li>• {announcement.pricing.free}</li>}
                                  {announcement.pricing.child && <li>• {announcement.pricing.child}</li>}
                                  {announcement.pricing.student && <li>• {announcement.pricing.student}</li>}
                                  {announcement.pricing.adult && <li>• {announcement.pricing.adult}</li>}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
