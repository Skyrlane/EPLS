"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ThemeSwitch } from "@/components/theme-switch"
import { useTheme } from "@/hooks/use-theme"
import { darkMode, themeClasses } from "@/lib/theme-utils"
import { ChevronRight, Sun, Moon, Info, Check, AlertCircle } from "lucide-react"

export function ThemeExample() {
  const { isDark, isLight, mounted } = useTheme()
  
  if (!mounted) return null

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Exemple des deux thèmes</h2>
          <p className="text-muted-foreground">
            Découvrez comment le site s'adapte en mode {isDark ? "sombre" : "clair"}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-8 max-w-4xl mx-auto">
          {/* Carte principale */}
          <Card className="flex-1 card-hover">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Mode actuel: {isDark ? "Sombre" : "Clair"}</CardTitle>
                <ThemeSwitch />
              </div>
              <CardDescription>
                Ce mode utilise la palette de couleurs {isDark ? "sombre" : "claire"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3 p-3 bg-accent rounded-md">
                  {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  <div>
                    <p className="font-medium">Couleur d'accent</p>
                    <p className="text-sm text-muted-foreground">Utilisée pour les fonds subtils</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-muted rounded-md">
                  <Info className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Couleur atténuée</p>
                    <p className="text-sm text-muted-foreground">Utilisée pour les fonds secondaires</p>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <div className="w-10 h-10 rounded-full bg-primary"></div>
                  <div className="w-10 h-10 rounded-full bg-secondary"></div>
                  <div className="w-10 h-10 rounded-full bg-destructive"></div>
                  <div className="w-10 h-10 rounded-full bg-accent"></div>
                  <div className="w-10 h-10 rounded-full bg-muted"></div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Annuler</Button>
              <Button>
                Confirmer
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
          
          {/* Tableau d'exemples de styles */}
          <div className="flex-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Exemples de styles</CardTitle>
                <CardDescription>
                  Différents éléments avec les styles du thème
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold mb-2">Typographie</h3>
                  <p className="mb-1">Texte normal avec <a href="#">lien d'exemple</a> intégré.</p>
                  <p className="text-muted-foreground">Texte atténué pour information secondaire.</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-2">Boutons</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="default">Principal</Button>
                    <Button variant="secondary">Secondaire</Button>
                    <Button variant="outline">Contour</Button>
                    <Button variant="ghost">Fantôme</Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-2">Tableau</h3>
                  <div className="overflow-x-auto">
                    <table>
                      <thead>
                        <tr>
                          <th>Nom</th>
                          <th>Valeur</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Primary</td>
                          <td>217 91% {isDark ? "65%" : "48%"}</td>
                        </tr>
                        <tr>
                          <td>Secondary</td>
                          <td>39 70% {isDark ? "50%" : "75%"}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Nouvelle section démonstrative pour l'accessibilité */}
                <div>
                  <h3 className="text-xl font-bold mb-2">Accessibilité & Contraste</h3>
                  <div className="space-y-2 p-3 bg-accent/50 rounded-md">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <p className="text-foreground">Texte principal - Contraste optimal (WCAG AAA)</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <p className="text-muted-foreground">Texte secondaire - Contraste amélioré (WCAG AA)</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <a href="#" className="text-primary hover:underline">Liens - Contraste distinctif (WCAG AA)</a>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-destructive" />
                      <p className="text-destructive">Messages d'alerte - Visibilité optimisée</p>
                    </div>
                    <div className="mt-3 p-3 border-l-4 border-primary/40 bg-muted/30">
                      <p className="text-foreground/90 italic">Les citations et blocs de texte préservent leur lisibilité même en mode sombre.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 