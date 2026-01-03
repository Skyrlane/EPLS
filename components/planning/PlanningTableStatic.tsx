import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar } from "lucide-react";
import type { Planning } from "@/types";

interface PlanningTableStaticProps {
  planning: Planning | null;
}

/**
 * Composant pour afficher le planning des cultes (version statique avec données pré-fetchées)
 * Optimisé pour Server Components - pas de hooks, données passées en props
 */
export const PlanningTableStatic = memo(function PlanningTableStatic({
  planning
}: PlanningTableStaticProps) {
  if (!planning) {
    return (
      <Alert>
        <Calendar className="h-4 w-4" />
        <AlertDescription>
          Aucun planning disponible pour ce mois-ci.
        </AlertDescription>
      </Alert>
    );
  }

  const planningRows = planning.rows ?? [];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-semibold mb-2">{planning.title}</h3>
        <p className="text-sm text-muted-foreground">
          Organisation des services pour le mois
        </p>
      </div>

      {/* Vue desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-800">
              <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left text-sm font-semibold">
                Date
              </th>
              <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left text-sm font-semibold">
                Présidence
              </th>
              <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left text-sm font-semibold">
                Musique
              </th>
              <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left text-sm font-semibold">
                Prédicateur
              </th>
              <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left text-sm font-semibold">
                Groupe EDD
              </th>
              <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left text-sm font-semibold">
                Accueil
              </th>
              <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left text-sm font-semibold">
                Projection
              </th>
              <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left text-sm font-semibold">
                Zoom
              </th>
              <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left text-sm font-semibold">
                Ménage
              </th>
              <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left text-sm font-semibold">
                Observations
              </th>
            </tr>
          </thead>
          <tbody>
            {planningRows.map((row, index) => (
              <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm font-medium">
                  {row.date}
                </td>
                <td className={`border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm ${!row.presidence ? 'bg-amber-50 dark:bg-amber-900/20' : ''}`}>
                  {row.presidence || '-'}
                </td>
                <td className={`border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm ${!row.musique ? 'bg-amber-50 dark:bg-amber-900/20' : ''}`}>
                  {row.musique || '-'}
                </td>
                <td className={`border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm ${!row.predicateur ? 'bg-amber-50 dark:bg-amber-900/20' : ''}`}>
                  {row.predicateur || '-'}
                </td>
                <td className={`border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm ${!row.groupeEDD ? 'bg-amber-50 dark:bg-amber-900/20' : ''}`}>
                  {row.groupeEDD || '-'}
                </td>
                <td className={`border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm ${!row.accueil ? 'bg-amber-50 dark:bg-amber-900/20' : ''}`}>
                  {row.accueil || '-'}
                </td>
                <td className={`border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm ${!row.projection ? 'bg-amber-50 dark:bg-amber-900/20' : ''}`}>
                  {row.projection || '-'}
                </td>
                <td className={`border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm ${!row.zoom ? 'bg-amber-50 dark:bg-amber-900/20' : ''}`}>
                  {row.zoom || '-'}
                </td>
                <td className={`border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm ${!row.menage ? 'bg-amber-50 dark:bg-amber-900/20' : ''}`}>
                  {row.menage || '-'}
                </td>
                <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm">
                  {row.observations || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vue mobile */}
      <div className="md:hidden space-y-4">
        {planningRows.map((row, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-base">{row.date}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="font-semibold">Présidence:</span>
                  <p className={!row.presidence ? 'text-amber-600' : ''}>
                    {row.presidence || 'Non défini'}
                  </p>
                </div>
                <div>
                  <span className="font-semibold">Musique:</span>
                  <p className={!row.musique ? 'text-amber-600' : ''}>
                    {row.musique || 'Non défini'}
                  </p>
                </div>
                <div>
                  <span className="font-semibold">Prédicateur:</span>
                  <p className={!row.predicateur ? 'text-amber-600' : ''}>
                    {row.predicateur || 'Non défini'}
                  </p>
                </div>
                <div>
                  <span className="font-semibold">Groupe EDD:</span>
                  <p className={!row.groupeEDD ? 'text-amber-600' : ''}>
                    {row.groupeEDD || 'Non défini'}
                  </p>
                </div>
                <div>
                  <span className="font-semibold">Accueil:</span>
                  <p className={!row.accueil ? 'text-amber-600' : ''}>
                    {row.accueil || 'Non défini'}
                  </p>
                </div>
                <div>
                  <span className="font-semibold">Projection:</span>
                  <p className={!row.projection ? 'text-amber-600' : ''}>
                    {row.projection || 'Non défini'}
                  </p>
                </div>
                <div>
                  <span className="font-semibold">Zoom:</span>
                  <p className={!row.zoom ? 'text-amber-600' : ''}>
                    {row.zoom || 'Non défini'}
                  </p>
                </div>
                <div>
                  <span className="font-semibold">Ménage:</span>
                  <p className={!row.menage ? 'text-amber-600' : ''}>
                    {row.menage || 'Non défini'}
                  </p>
                </div>
              </div>
              {row.observations && (
                <div className="col-span-2 pt-2 border-t">
                  <span className="font-semibold">Observations:</span>
                  <p>{row.observations}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
});
