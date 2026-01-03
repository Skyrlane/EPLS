import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlanningTableStatic } from "@/components/planning/PlanningTableStatic"
import { ProtectedPlanningWrapper } from "@/components/planning/ProtectedPlanningWrapper"
import Sidebar from '../components/Sidebar'
import { adminDb } from '@/lib/firebase-admin'
import type { Planning } from '@/types'

// ISR : Revalider toutes les 5 minutes (300 secondes)
export const revalidate = 300

/**
 * Fetch le planning côté serveur avec Firebase Admin
 * Optimisé : données pré-chargées, pas d'attente client
 */
async function getCurrentPlanning(): Promise<Planning | null> {
  try {
    if (!adminDb) {
      console.error('Firebase Admin DB not initialized')
      return null
    }

    const currentMonth = new Date().getMonth() + 1
    const currentYear = new Date().getFullYear()

    const snapshot = await adminDb
      .collection('plannings')
      .where('month', '==', currentMonth)
      .where('year', '==', currentYear)
      .where('isActive', '==', true)
      .limit(1)
      .get()

    if (snapshot.empty) {
      return null
    }

    const doc = snapshot.docs[0]
    return { id: doc.id, ...doc.data() } as Planning
  } catch (error) {
    console.error('Erreur lors du fetch du planning:', error)
    return null
  }
}

export default async function PlanningCultesPage() {
  // Fetch côté serveur - données disponibles immédiatement
  const planning = await getCurrentPlanning()

  return (
    <ProtectedPlanningWrapper planning={planning}>
      {/* Page Header */}
      <div className="bg-slate-100 dark:bg-slate-800 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Planning des Cultes</h1>

          {/* Breadcrumbs */}
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link href="/" className="text-primary hover:text-primary/80">
                  Accueil
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400 dark:text-gray-500">/</span>
                  <Link href="/infos-docs" className="text-primary hover:text-primary/80">
                    Infos/Docs
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400 dark:text-gray-500">/</span>
                  <span className="text-gray-700 dark:text-gray-300">Planning des Cultes</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Sidebar */}
              <div className="md:col-span-1">
                <Sidebar />
              </div>

              {/* Main Content */}
              <div className="md:col-span-3">
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>📅 Planning des Cultes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                      Organisation des services et responsabilités pour les cultes du mois en cours.
                    </p>
                  </CardContent>
                </Card>

                {/* Section du planning - données pré-fetchées */}
                <PlanningTableStatic planning={planning} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </ProtectedPlanningWrapper>
  )
}
