'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { usePathname } from 'next/navigation'

export default function EgliseSidebar() {
  const pathname = usePathname()

  // Détermine si le lien est actif
  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notre Église</CardTitle>
      </CardHeader>
      <CardContent>
        <nav className="space-y-2">
          <Link
            href="/notre-eglise/qui-sommes-nous"
            className={`block p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 ${
              isActive('/notre-eglise/qui-sommes-nous') ? 'text-primary font-medium bg-slate-50 dark:bg-slate-800/50' : ''
            }`}
          >
            Qui sommes-nous
          </Link>
          <Link 
            href="/notre-eglise/nos-valeurs" 
            className={`block p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 ${
              isActive('/notre-eglise/nos-valeurs') ? 'text-primary font-medium bg-slate-50 dark:bg-slate-800/50' : ''
            }`}
          >
            Nos valeurs
          </Link>
          <Link 
            href="/notre-eglise/ou-sommes-nous" 
            className={`block p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 ${
              isActive('/notre-eglise/ou-sommes-nous') ? 'text-primary font-medium bg-slate-50 dark:bg-slate-800/50' : ''
            }`}
          >
            Où sommes-nous
          </Link>
        </nav>
      </CardContent>
    </Card>
  )
} 