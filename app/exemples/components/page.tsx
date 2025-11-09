import Link from "next/link";
import { ArrowLeft, InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const metadata = {
  title: "Composants UI | EPLS",
  description: "Démonstration des composants d'interface utilisateur basés sur Shadcn/UI",
};

export default function ComponentsExamplePage() {
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
          <span>Composants UI</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Composants d'Interface</h1>
        <p className="text-xl text-muted-foreground mt-2">
          Présentation des composants UI basés sur Shadcn/UI et Radix
        </p>
      </div>

      <div className="prose mb-8">
        <p>
          Ce site utilise une collection de composants d'interface utilisateur réutilisables 
          basés sur <a href="https://ui.shadcn.com/" target="_blank" rel="noopener noreferrer">Shadcn/UI</a>.
          Ces composants sont construits avec <a href="https://react.dev/" target="_blank" rel="noopener noreferrer">React</a>, 
          <a href="https://www.radix-ui.com/" target="_blank" rel="noopener noreferrer">Radix UI</a> et 
          <a href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer">Tailwind CSS</a>.
        </p>
        <p>
          Ils sont entièrement accessibles, personnalisables et s'adaptent automatiquement au thème clair/sombre.
        </p>
      </div>

      <Tabs defaultValue="basic" className="mb-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basiques</TabsTrigger>
          <TabsTrigger value="form">Formulaires</TabsTrigger>
          <TabsTrigger value="layout">Mise en page</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="mt-6 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Boutons</CardTitle>
              <CardDescription>
                Différentes variantes de boutons pour diverses actions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon">
                  <InfoIcon className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Badges</CardTitle>
              <CardDescription>
                Étiquettes compactes pour afficher un statut ou catégorie
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Alertes</CardTitle>
              <CardDescription>
                Affichage de messages d'information, succès, avertissement ou erreur
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Information</AlertTitle>
                <AlertDescription>
                  Ceci est une alerte d'information standard.
                </AlertDescription>
              </Alert>
              
              <Alert variant="destructive">
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Erreur</AlertTitle>
                <AlertDescription>
                  Une erreur s'est produite lors du traitement de votre demande.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Avatars</CardTitle>
              <CardDescription>
                Représentation visuelle d'un utilisateur ou entité
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-4">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback>EP</AvatarFallback>
              </Avatar>
              
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback>LS</AvatarFallback>
              </Avatar>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="form" className="mt-6 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Champs de texte</CardTitle>
              <CardDescription>
                Champs de saisie pour texte et autres données
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input type="email" id="email" placeholder="Email" />
              </div>
              
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="password">Mot de passe</Label>
                <Input type="password" id="password" placeholder="Mot de passe" />
              </div>
              
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Votre message ici..." />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Sélecteurs</CardTitle>
              <CardDescription>
                Menus déroulants et cases à cocher
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="role">Rôle</Label>
                <Select>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrateur</SelectItem>
                    <SelectItem value="member">Membre</SelectItem>
                    <SelectItem value="visitor">Visiteur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <Label>Options</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" />
                    <Label htmlFor="terms">Accepter les conditions</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="newsletter" />
                    <Label htmlFor="newsletter">S'abonner à la newsletter</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="notifications" defaultChecked />
                    <Label htmlFor="notifications">Activer les notifications</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="layout" className="mt-6 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Cartes</CardTitle>
              <CardDescription>
                Conteneurs pour afficher du contenu et des actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Exemple de carte</CardTitle>
                    <CardDescription>Carte imbriquée pour démonstration</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Contenu de la carte</p>
                  </CardContent>
                  <CardFooter>
                    <Button size="sm">Action</Button>
                  </CardFooter>
                </Card>
                
                <div className="grid gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Carte simple</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Variation compacte</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Carte simple</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Variation compacte</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Mise en page</CardTitle>
              <CardDescription>
                Exemples de mise en page avec Tailwind CSS
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border p-4 rounded-md">
                  <h4 className="text-sm font-medium mb-2">Grille responsive</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-muted rounded-md p-4 text-center">1</div>
                    <div className="bg-muted rounded-md p-4 text-center">2</div>
                    <div className="bg-muted rounded-md p-4 text-center">3</div>
                  </div>
                </div>
                
                <div className="border p-4 rounded-md">
                  <h4 className="text-sm font-medium mb-2">Flexbox</h4>
                  <div className="flex flex-wrap gap-4 justify-between">
                    <div className="bg-muted rounded-md p-4">Élément 1</div>
                    <div className="bg-muted rounded-md p-4">Élément 2</div>
                    <div className="bg-muted rounded-md p-4">Élément 3</div>
                  </div>
                </div>
                
                <div className="border p-4 rounded-md">
                  <h4 className="text-sm font-medium mb-2">Espacement</h4>
                  <div className="space-y-4">
                    <div className="bg-muted rounded-md p-4">Section 1</div>
                    <div className="bg-muted rounded-md p-4">Section 2</div>
                    <div className="bg-muted rounded-md p-4">Section 3</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Onglets</CardTitle>
              <CardDescription>
                Basculer entre différentes vues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="tab1">
                <TabsList>
                  <TabsTrigger value="tab1">Premier</TabsTrigger>
                  <TabsTrigger value="tab2">Deuxième</TabsTrigger>
                  <TabsTrigger value="tab3">Troisième</TabsTrigger>
                </TabsList>
                <TabsContent value="tab1" className="p-4">
                  Contenu du premier onglet.
                </TabsContent>
                <TabsContent value="tab2" className="p-4">
                  Contenu du deuxième onglet.
                </TabsContent>
                <TabsContent value="tab3" className="p-4">
                  Contenu du troisième onglet.
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="prose">
        <h2>Utilisation des composants</h2>
        <p>
          Ces composants sont conçus pour être facilement intégrés dans n'importe quelle partie du site.
          Ils sont entièrement typés avec TypeScript et suivent les meilleures pratiques en matière d'accessibilité.
        </p>
        <p>
          Pour utiliser un composant, importez-le simplement depuis le dossier correspondant :
        </p>
        <pre><code>{`import { Button } from "@/components/ui/button";

export default function MonComposant() {
  return (
    <Button variant="outline">Mon Bouton</Button>
  );
}`}</code></pre>
      </div>

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