'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlanningTableStatic } from "@/components/planning/PlanningTableStatic"
import { ProtectedPlanningWrapper } from "@/components/planning/ProtectedPlanningWrapper"
import Sidebar from '../components/Sidebar'
import { collection, query, where, limit, getDocs } from 'firebase/firestore'
import { firestore } from '@/lib/firebase'
import type { Planning } from '@/types'
import { PageHeader } from "@/components/ui/page-header";
import { BreadcrumbItem } from "@/components/ui/breadcrumbs";

const CACHE_KEY = 'epls_planning_data_cache'
const CACHE_TIMESTAMP_KEY = 'epls_planning_data_timestamp'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

/**
 * Récupérer le planning depuis le cache localStorage
 */
function getCachedPlanning(): Planning | null {
  if (typeof window === 'undefined') return null

  try {
    const cached = localStorage.getItem(CACHE_KEY)
    const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY)

    if (cached && timestamp) {
      const age = Date.now() - parseInt(timestamp)
      if (age < CACHE_DURATION) {
        return JSON.parse(cached)
      }
    }
  } catch (error) {
    console.error('Erreur lecture cache:', error)
  }

  return null
}

/**
 * Sauvegarder le planning dans le cache
 */
function setCachedPlanning(planning: Planning) {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(planning))
    localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString())
  } catch (error) {
    console.error('Erreur sauvegarde cache:', error)
  }
}

export default function PlanningCultesPage() {
  const [planning, setPlanning] = useState<Planning | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPlanning = async () => {
      // D'abord, vérifier le cache
      const cached = getCachedPlanning()
      if (cached) {
        setPlanning(cached)
        setLoading(false)
        return
      }

      // Sinon, fetch depuis Firebase
      try {
        const currentMonth = new Date().getMonth() + 1
        const currentYear = new Date().getFullYear()

        const q = query(
          collection(firestore, 'plannings'),
          where('month', '==', currentMonth),
          where('year', '==', currentYear),
          where('isActive', '==', true),
          limit(1)
        )

        const snapshot = await getDocs(q)

        if (!snapshot.empty) {
          const doc = snapshot.docs[0]
          const planningData = { id: doc.id, ...doc.data() } as Planning
          setPlanning(planningData)
          setCachedPlanning(planningData)
        } else {
          setPlanning(null)
        }
      } catch (error) {
        console.error('Erreur lors du fetch du planning:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPlanning()
  }, [])

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Infos & Docs", href: "/infos-docs" },
    { label: "Planning des Cultes", href: "/infos-docs/planning-cultes", isCurrent: true },
  ];

  return (
    <ProtectedPlanningWrapper planning={planning}>
      <PageHeader
        title="Planning des Cultes"
        breadcrumbs={breadcrumbItems}
      />

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
                    <p className="text-lg text-muted-foreground mb-6">
                      Organisation des services et responsabilités pour les cultes du mois en cours.
                    </p>
                  </CardContent>
                </Card>

                {/* Section du planning */}
                {loading ? (
                  <div className="space-y-4">
                    <div className="h-8 w-48 bg-muted animate-pulse rounded" />
                    <div className="h-64 w-full bg-muted animate-pulse rounded" />
                  </div>
                ) : (
                  <PlanningTableStatic planning={planning} />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </ProtectedPlanningWrapper>
  )
}
