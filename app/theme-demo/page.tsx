import Link from "next/link"
import { ThemeExample } from "@/components/theme-example"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Démo du Thème | EPLS",
  description: "Démonstration des modes clair et sombre personnalisés pour l'Église Protestante Libre de Strasbourg",
}

export default function ThemeDemoPage() {
  return (
    <>
      {/* Page Header */}
      <div className="bg-slate-100 dark:bg-slate-800 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Démonstration du Mode Jour/Nuit</h1>

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
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-gray-700 dark:text-gray-300">Démo Thème</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <p className="text-lg mb-4">
                Cette page présente la nouvelle palette de couleurs adaptative pour le site web de l'Église Protestante Libre de Strasbourg. 
                Le design s'adapte automatiquement aux préférences de l'utilisateur et offre une expérience visuelle optimale, 
                que ce soit en mode clair ou sombre.
              </p>
              
              <p className="text-lg mb-6">
                Vous pouvez basculer entre les modes en utilisant le sélecteur dans la barre de navigation ou dans l'exemple ci-dessous.
              </p>
              
              <div className="prose dark:prose-invert max-w-none">
                <h2>Caractéristiques du thème</h2>
                <ul>
                  <li>Palette de couleurs harmonieuse adaptée à l'identité de l'église</li>
                  <li>Contraste optimal respectant les normes d'accessibilité WCAG</li>
                  <li>Transitions douces entre les modes clair et sombre</li>
                  <li>Adaptation automatique aux préférences système</li>
                  <li>Amélioration du rendu des images en mode sombre</li>
                </ul>
              </div>
            </div>
            
            <div className="border rounded-xl overflow-hidden">
              <ThemeExample />
            </div>
            
            <div className="mt-8 flex justify-center">
              <Button asChild variant="outline" className="gap-2">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4" />
                  Retour à l'accueil
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 