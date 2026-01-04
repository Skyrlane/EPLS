import Link from "next/link";
import { ArrowLeft, Code2, ChevronRightIcon, BookIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageBlock } from "@/components/ui/image-block";
import { MarkdownContent } from "@/components/ui/markdown-content";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const metadata = {
  title: "Système d'images | EPLS",
  description: "Démonstration du système d'images optimisées et responsives pour le site de l'Église Protestante Libre de Strasbourg",
};

// Contenu exemple en Markdown/HTML
const contenuMarkdown = `
  <h2>Exemple d'intégration d'images dans du contenu</h2>
  
  <p>Voici un exemple de texte avec une image intégrée entre les paragraphes. 
  Les images sont automatiquement optimisées et responsives.</p>
  
  <img 
    src="/images/hero/church-hero.png" 
    alt="Image d'en-tête (hero)"
    title="Image de type hero (en-tête)"
    data-type="hero"
  />
  
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
  exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
  
  <h3>Exemple avec une image de contenu</h3>
  
  <p>Voici un exemple avec une image de type "content" qui utilise un ratio 16:9, 
  idéal pour les articles et témoignages.</p>
  
  <img 
    src="/images/content/culte-louange.jpg" 
    alt="Image de contenu (content)"
    title="Image de type content (article)"
    data-type="content"
  />
  
  <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat 
  nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia 
  deserunt mollit anim id est laborum.</p>
`;

export default function ImagesExamplePage() {
  return (
    <div className="container max-w-4xl py-12">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link href="/" className="hover:text-foreground">
            Accueil
          </Link>
          <span>/</span>
          <Link href="/exemples" className="hover:text-foreground">
            Exemples
          </Link>
          <span>/</span>
          <span>Système d'images</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Système d'images</h1>
        <p className="text-xl text-muted-foreground mt-2">
          Démonstration du système d'images optimisées et responsives
        </p>
      </div>

      <Alert className="mb-8">
        <BookIcon className="h-5 w-5" />
        <AlertTitle>Documentation complète</AlertTitle>
        <AlertDescription>
          Pour une documentation complète sur le système d'images, consultez le fichier <code>public/images/README.md</code>.
        </AlertDescription>
      </Alert>

      <div className="prose mb-8">
        <p>
          Ce site utilise un système d'images optimisées avec Next.js Image qui permet:
        </p>
        <ul>
          <li>Optimisation automatique (formats WebP, dimensions adaptatives)</li>
          <li>Chargement paresseux (lazy loading) pour améliorer les performances</li>
          <li>Gestion des ratios d'aspect et des placeholders</li>
          <li>Intégration facile dans du contenu Markdown ou HTML</li>
          <li>Support pour les légendes et crédits photo</li>
          <li>Organisation structurée par type d'image</li>
        </ul>
      </div>

      <Tabs defaultValue="composants" className="mb-8">
        <TabsList>
          <TabsTrigger value="composants">Composants d'image</TabsTrigger>
          <TabsTrigger value="markdown">Intégration Markdown</TabsTrigger>
          <TabsTrigger value="structure">Structure</TabsTrigger>
          <TabsTrigger value="implementation">Implémentation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="composants" className="mt-4 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>ImageBlock - Type Hero</CardTitle>
              <CardDescription>
                Pour les en-têtes et bannières (ratio 5:2, grande taille)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageBlock 
                type="hero"
                src="/images/hero/church-hero.png"
                alt="Exemple d'image hero"
              />
              
              <div className="flex items-center justify-center mt-2 text-sm text-muted-foreground">
                <span>Image de type hero avec ratio 5:2 (1920×768px recommandé) - Crédit: John Mark Arnold sur Unsplash</span>
              </div>
              
              <div className="mt-4 p-4 bg-muted rounded-md">
                <pre className="text-xs overflow-auto p-2">
{`<ImageBlock 
  type="hero"
  src="/images/hero/church-hero.png"
  alt="Exemple d'image hero"
/>`}
                </pre>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>ImageBlock - Type Content</CardTitle>
              <CardDescription>
                Pour les articles et contenus (ratio 16:9, taille moyenne)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageBlock 
                type="content"
                src="/images/content/culte-louange.jpg" 
                alt="Exemple d'image content"
              />
              
              <div className="flex items-center justify-center mt-2 text-sm text-muted-foreground">
                <span>Image de type content avec ratio 16:9 (1200×675px recommandé) - Crédit: Olivia Snow sur Unsplash</span>
              </div>
              
              <div className="mt-4 p-4 bg-muted rounded-md">
                <pre className="text-xs overflow-auto p-2">
{`<ImageBlock 
  type="content"
  src="/images/content/culte-louange.jpg"
  alt="Exemple d'image content"
/>`}
                </pre>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>ImageBlock - Type Section</CardTitle>
              <CardDescription>
                Pour les sections du site (ratio 16:9, taille moyenne)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageBlock 
                type="section"
                src="/images/sections/communaute.jpg" 
                alt="Exemple d'image section"
              />
              
              <div className="flex items-center justify-center mt-2 text-sm text-muted-foreground">
                <span>Image de type section avec ratio 16:9 (1280×720px recommandé) - Crédit: Rémi Walle sur Unsplash</span>
              </div>
              
              <div className="mt-4 p-4 bg-muted rounded-md">
                <pre className="text-xs overflow-auto p-2">
{`<ImageBlock 
  type="section"
  src="/images/sections/communaute.jpg"
  alt="Exemple d'image section"
/>`}
                </pre>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Composant ImageBlock - Pour les images spécifiques</CardTitle>
              <CardDescription>
                Supporte différents types d'images avec préréglages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-w-sm mx-auto">
                <ImageBlock 
                  src="/placeholder.svg?height=400&width=600&text=Bible"
                  alt="Exemple d'ImageBlock"
                  type="card"
                  className="rounded-lg"
                />
              </div>
              
              <div className="mt-4 p-4 bg-muted rounded-md">
                <pre className="text-xs overflow-auto p-2">
{`<ImageBlock 
  src="/placeholder.svg?height=400&width=600&text=Bible"
  alt="Exemple d'ImageBlock"
  type="card"
  className="rounded-lg"
/>`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="markdown" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Intégration dans du contenu Markdown/HTML</CardTitle>
              <CardDescription>
                Utilisez le composant MarkdownContent pour intégrer des images dans du texte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-6">
                <MarkdownContent content={contenuMarkdown} />
              </div>
              
              <div className="mt-8 p-4 bg-muted rounded-md">
                <h4 className="text-sm font-medium mb-2">Exemple de code</h4>
                <pre className="text-xs overflow-auto p-2">
{`import { MarkdownContent } from "@/components/ui/markdown-content";

// Contenu en HTML ou Markdown parsé
const contenuHtml = \`
  <h2>Titre de section</h2>
  <p>Texte avant l'image...</p>
  
  <img 
    src="/images/content/mon-image.webp" 
    alt="Description de l'image" 
    title="Légende optionnelle"
    data-type="content"
  />
  
  <p>Texte après l'image...</p>
\`;

// Dans votre composant React
<MarkdownContent content={contenuHtml} isArticle={true} />`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="structure" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Structure des dossiers d'images</CardTitle>
              <CardDescription>
                Organisation par type d'image pour une meilleure maintenabilité
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="text-xs overflow-auto p-4 bg-muted rounded-md">
{`public/images/
├── hero/             # Images d'en-tête (ratio 5:2, 1920×768px)
├── content/          # Images pour articles (ratio 16:9, 1200×675px)
├── sections/         # Images pour sections (ratio 16:9, 1280×720px)
├── cards/            # Vignettes et cartes (ratio 3:2, 600×400px)
├── team/             # Photos de l'équipe (ratio carré 1:1, 400×400px)
├── messages/         # Images pour les messages/prédications (ratio 16:9)
├── events/           # Images pour les événements (ratio 16:9 ou 3:2)
├── echo/             # Images pour les bulletins (ratio 16:9 ou 3:2)
├── blog/             # Images pour les articles de blog (ratio 16:9)
├── valeurs/          # Images pour la page des valeurs (ratio 16:9)
├── histoire/         # Images pour la page d'histoire (ratio 16:9 ou 3:2)
└── qui-sommes-nous/  # Images pour la section "Qui sommes-nous" (ratio 16:9)`}
              </pre>
              
              <Alert className="mt-6" title="Bonnes pratiques">
                <AlertDescription>
                  <ul className="mt-2 space-y-2 text-sm">
                    <li>Utilisez le format WebP quand c'est possible pour des images plus légères</li>
                    <li>Respectez les ratios recommandés pour une cohérence visuelle</li>
                    <li>Optimisez vos images avant de les ajouter au site (compression)</li>
                    <li>Nommez vos fichiers de façon descriptive (ex: culte-louange.webp)</li>
                    <li>Ajoutez toujours un attribut alt descriptif pour l'accessibilité</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="implementation" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Implémentation sur votre site</CardTitle>
              <CardDescription>
                Comment mettre en œuvre ce système d'images
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">1. Importer le composant</h3>
                <pre className="text-xs overflow-auto p-4 bg-muted rounded-md">
{`import { ImageBlock } from "@/components/ui/image-block"`}
                </pre>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">2. Utiliser le composant dans votre page</h3>
                <pre className="text-xs overflow-auto p-4 bg-muted rounded-md">
{`export default function MaPage() {
  return (
    <div className="container">
      <h1>Titre de ma page</h1>
      
      {/* Image en-tête */}
      <ImageBlock
        type="hero"
        src="/images/hero/mon-image.webp"
        alt="Description de l'image"
        caption="Légende de l'image"
        credit="Crédit: Photographe"
        priority={true}
      />
      
      <p>Contenu de la page...</p>
      
      {/* Image dans le contenu */}
      <ImageBlock
        type="content"
        src="/images/content/autre-image.webp"
        alt="Description de l'autre image"
        caption="Légende de l'image"
      />
    </div>
  )
}`}
                </pre>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">3. Options disponibles</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm font-medium mb-1">Types d'image:</p>
                    <ul className="text-xs space-y-1">
                      <li><code>type="hero"</code> - Ratio 5:2, bannières</li>
                      <li><code>type="content"</code> - Ratio 16:9, articles</li>
                      <li><code>type="section"</code> - Ratio 16:9, sections</li>
                      <li><code>type="card"</code> - Ratio 3:2, vignettes</li>
                    </ul>
                  </div>
                  
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm font-medium mb-1">Autres options:</p>
                    <ul className="text-xs space-y-1">
                      <li><code>priority</code> - Charger en priorité</li>
                      <li><code>rounded</code> - Niveau d'arrondi</li>
                      <li><code>showPlaceholder</code> - Afficher un placeholder</li>
                      <li><code>showCredits</code> - Afficher les crédits</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href="/public/images/README.md" target="_blank" className="inline-flex items-center justify-center gap-2">
                  <Code2 className="h-4 w-4" />
                  Voir la documentation complète
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <Button asChild variant="outline" size="sm">
          <Link href="/exemples" className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour aux exemples
          </Link>
        </Button>
      </div>
    </div>
  );
} 