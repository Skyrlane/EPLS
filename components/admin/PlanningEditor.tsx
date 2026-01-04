"use client";

import { useState } from "react";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash2 } from "lucide-react";
import type { Planning, PlanningRow } from "@/types";

interface PlanningEditorProps {
  planning: Planning;
  onUpdate: () => void;
}

export function PlanningEditor({ planning, onUpdate }: PlanningEditorProps) {
  const [editingRow, setEditingRow] = useState<{ index: number; row: PlanningRow } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const handleEdit = (index: number) => {
    setEditingRow({ index, row: { ...planning.rows[index] } });
  };

  const handleSaveRow = async () => {
    if (!editingRow) return;

    try {
      const updatedRows = [...planning.rows];
      updatedRows[editingRow.index] = editingRow.row;

      const planningRef = doc(firestore, "plannings", planning.id);
      await updateDoc(planningRef, {
        rows: updatedRows,
        updatedAt: new Date(),
      });

      toast({
        title: "Succès",
        description: "La ligne a été mise à jour",
      });

      setEditingRow(null);
      onUpdate();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les modifications",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm(
      `Êtes-vous sûr de vouloir supprimer le planning de ${planning.title} ? Cette action est irréversible.`
    );

    if (!confirm) return;

    setDeleting(true);

    try {
      await deleteDoc(doc(firestore, "plannings", planning.id));

      toast({
        title: "Succès",
        description: "Le planning a été supprimé",
      });

      onUpdate();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le planning",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const updateField = (field: keyof PlanningRow, value: string) => {
    if (!editingRow) return;
    setEditingRow({
      ...editingRow,
      row: {
        ...editingRow.row,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">{planning.title}</h3>
          <p className="text-sm text-muted-foreground">{planning.rows.length} lignes</p>
        </div>
        <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
          <Trash2 className="mr-2 h-4 w-4" />
          Supprimer
        </Button>
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-muted">
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
              <th className="px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {planning.rows.map((row, index) => (
              <tr key={index} className="border-t hover:bg-muted/50">
                <td className="px-3 py-2 font-medium">{row.date}</td>
                <td className="px-3 py-2">{row.presidence || "-"}</td>
                <td className="px-3 py-2">{row.musique || "-"}</td>
                <td className="px-3 py-2">{row.predicateur || "-"}</td>
                <td className="px-3 py-2">{row.groupeEDD || "-"}</td>
                <td className="px-3 py-2">{row.accueil || "-"}</td>
                <td className="px-3 py-2">{row.projection || "-"}</td>
                <td className="px-3 py-2">{row.zoom || "-"}</td>
                <td className="px-3 py-2">{row.menage || "-"}</td>
                <td className="px-3 py-2">{row.observations || "-"}</td>
                <td className="px-3 py-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(index)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal d'édition */}
      <Dialog open={!!editingRow} onOpenChange={() => setEditingRow(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier la ligne</DialogTitle>
            <DialogDescription>
              Date : {editingRow?.row.date}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="presidence">Présidence</Label>
              <Input
                id="presidence"
                value={editingRow?.row.presidence || ""}
                onChange={(e) => updateField("presidence", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="musique">Musique</Label>
              <Input
                id="musique"
                value={editingRow?.row.musique || ""}
                onChange={(e) => updateField("musique", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="predicateur">Prédicateur</Label>
              <Input
                id="predicateur"
                value={editingRow?.row.predicateur || ""}
                onChange={(e) => updateField("predicateur", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="groupeEDD">Groupe EDD</Label>
              <Input
                id="groupeEDD"
                value={editingRow?.row.groupeEDD || ""}
                onChange={(e) => updateField("groupeEDD", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accueil">Accueil</Label>
              <Input
                id="accueil"
                value={editingRow?.row.accueil || ""}
                onChange={(e) => updateField("accueil", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projection">Projection</Label>
              <Input
                id="projection"
                value={editingRow?.row.projection || ""}
                onChange={(e) => updateField("projection", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zoom">Zoom</Label>
              <Input
                id="zoom"
                value={editingRow?.row.zoom || ""}
                onChange={(e) => updateField("zoom", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="menage">Ménage</Label>
              <Input
                id="menage"
                value={editingRow?.row.menage || ""}
                onChange={(e) => updateField("menage", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="observations">Observations</Label>
              <Input
                id="observations"
                value={editingRow?.row.observations || ""}
                onChange={(e) => updateField("observations", e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingRow(null)}>
              Annuler
            </Button>
            <Button onClick={handleSaveRow}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
