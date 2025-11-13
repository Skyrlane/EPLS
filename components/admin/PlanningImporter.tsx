"use client";

import { useState } from "react";
import { collection, addDoc, query, where, getDocs, deleteDoc, Timestamp } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Upload, Eye, AlertTriangle } from "lucide-react";
import { parseHTMLPlanning, validatePlanning } from "@/lib/planning-parser";
import type { ParsedPlanning } from "@/lib/planning-parser";

interface PlanningImporterProps {
  onImportComplete?: () => void;
}

export function PlanningImporter({ onImportComplete }: PlanningImporterProps) {
  const [html, setHtml] = useState("");
  const [parsed, setParsed] = useState<ParsedPlanning | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [existingPlanning, setExistingPlanning] = useState(false);
  const [importing, setImporting] = useState(false);
  const { toast } = useToast();

  const handleParse = () => {
    try {
      const result = parseHTMLPlanning(html);
      const validation = validatePlanning(result);

      if (!validation.valid) {
        setErrors(validation.errors);
        setParsed(null);
        toast({
          title: "Erreur de parsing",
          description: validation.errors.join(", "),
          variant: "destructive",
        });
        return;
      }

      setParsed(result);
      setErrors([]);

      // Vérifier si un planning existe déjà pour ce mois
      checkExistingPlanning(result.month, result.year);

      toast({
        title: "Parsing réussi",
        description: `${result.rows.length} lignes trouvées pour ${result.title}`,
      });
    } catch (error: any) {
      console.error("Erreur de parsing:", error);
      setErrors([error.message || "Erreur lors du parsing du HTML"]);
      setParsed(null);
      toast({
        title: "Erreur",
        description: "Impossible de parser le HTML",
        variant: "destructive",
      });
    }
  };

  const checkExistingPlanning = async (month: number, year: number) => {
    try {
      const q = query(
        collection(firestore, "plannings"),
        where("month", "==", month),
        where("year", "==", year)
      );
      const snapshot = await getDocs(q);
      setExistingPlanning(!snapshot.empty);
    } catch (error) {
      console.error("Erreur lors de la vérification:", error);
    }
  };

  const handleImport = async () => {
    if (!parsed) return;

    setImporting(true);

    try {
      // 1. Supprimer l'ancien planning si existant
      if (existingPlanning) {
        const q = query(
          collection(firestore, "plannings"),
          where("month", "==", parsed.month),
          where("year", "==", parsed.year)
        );
        const snapshot = await getDocs(q);

        for (const doc of snapshot.docs) {
          await deleteDoc(doc.ref);
        }
      }

      // 2. Créer le nouveau planning
      await addDoc(collection(firestore, "plannings"), {
        title: parsed.title,
        month: parsed.month,
        year: parsed.year,
        rows: parsed.rows,
        isActive: true,
        status: "published",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      toast({
        title: "Succès",
        description: `Planning de ${parsed.title} importé avec succès`,
      });

      // Reset
      setHtml("");
      setParsed(null);
      setExistingPlanning(false);

      if (onImportComplete) {
        onImportComplete();
      }
    } catch (error: any) {
      console.error("Erreur lors de l'import:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'importer le planning",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Zone de texte HTML */}
      <div className="space-y-2">
        <Label htmlFor="html-input">Code HTML du planning</Label>
        <Textarea
          id="html-input"
          placeholder="Collez le code HTML du planning ici..."
          value={html}
          onChange={(e) => setHtml(e.target.value)}
          rows={10}
          className="font-mono text-sm"
        />
        <p className="text-xs text-muted-foreground">
          Le HTML doit contenir un titre &lt;h1&gt; avec le mois et l&apos;année, et un tableau avec les services.
        </p>
      </div>

      {/* Bouton Parser */}
      <Button onClick={handleParse} disabled={!html.trim() || importing}>
        <Eye className="mr-2 h-4 w-4" />
        Parser et Prévisualiser
      </Button>

      {/* Erreurs */}
      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc list-inside">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Preview */}
      {parsed && (
        <div className="space-y-4">
          <Alert>
            <AlertDescription>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <strong>Titre:</strong> {parsed.title}
                </div>
                <div className="flex items-center gap-2">
                  <strong>Mois:</strong> {parsed.month}
                </div>
                <div className="flex items-center gap-2">
                  <strong>Année:</strong> {parsed.year}
                </div>
                <div className="flex items-center gap-2">
                  <strong>Nombre de lignes:</strong> {parsed.rows.length}
                </div>
                {existingPlanning && (
                  <Badge variant="destructive">
                    Un planning existe déjà pour ce mois. Il sera remplacé.
                  </Badge>
                )}
              </div>
            </AlertDescription>
          </Alert>

          {/* Preview du tableau */}
          <div className="overflow-x-auto max-h-96 border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 dark:bg-slate-800 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left">Date</th>
                  <th className="px-3 py-2 text-left">Présidence</th>
                  <th className="px-3 py-2 text-left">Musique</th>
                  <th className="px-3 py-2 text-left">Prédicateur</th>
                  <th className="px-3 py-2 text-left">Groupe EDD</th>
                  <th className="px-3 py-2 text-left">Accueil</th>
                  <th className="px-3 py-2 text-left">Projection</th>
                  <th className="px-3 py-2 text-left">Zoom</th>
                  <th className="px-3 py-2 text-left">Ménage</th>
                  <th className="px-3 py-2 text-left">Observations</th>
                </tr>
              </thead>
              <tbody>
                {parsed.rows.map((row, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-3 py-2">{row.date}</td>
                    <td className="px-3 py-2">{row.presidence || "-"}</td>
                    <td className="px-3 py-2">{row.musique || "-"}</td>
                    <td className="px-3 py-2">{row.predicateur || "-"}</td>
                    <td className="px-3 py-2">{row.groupeEDD || "-"}</td>
                    <td className="px-3 py-2">{row.accueil || "-"}</td>
                    <td className="px-3 py-2">{row.projection || "-"}</td>
                    <td className="px-3 py-2">{row.zoom || "-"}</td>
                    <td className="px-3 py-2">{row.menage || "-"}</td>
                    <td className="px-3 py-2">{row.observations || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bouton Import */}
          <Button onClick={handleImport} disabled={importing} size="lg" className="w-full">
            {importing ? (
              "Import en cours..."
            ) : existingPlanning ? (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Remplacer le Planning
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Importer le Planning
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
