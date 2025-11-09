import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, FileText, Palette, PenTool, Lightbulb, Lock, Component, Image } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Exemples et Démos | EPLS",
  description: "Démonstrations et exemples de composants pour le site de l'Église Protestante Libre de Strasbourg",
};

// Tableau des exemples disponibles
const examples = [
  {
    id: "prose",
    title: "Styles Typographiques (Prose)",
    description: "Démonstration des styles pour le contenu riche avec la classe .prose",
    icon: <FileText className="h-12 w-12 text-primary/70" />,
    href: "/exemples/prose",
  },
  {
    id: "theme",
    title: "Thème Jour/Nuit",
    description: "Présentation des modes clair et sombre et de la palette de couleurs",
    icon: <Palette className="h-12 w-12 text-primary/70" />,
    href: "/theme-demo",
  },
  {
    id: "auth",
    title: "Authentification",
    description: "Présentation du système d'authentification et gestion des utilisateurs",
    icon: <Lock className="h-12 w-12 text-primary/70" />,
    href: "/exemples/auth",
  },
  {
    id: "components",
    title: "Composants UI",
    description: "Éléments d'interface utilisateur basés sur Shadcn/UI et Radix",
    icon: <Component className="h-12 w-12 text-primary/70" />,
    href: "/exemples/components",
  },
  {
    id: "images",
    title: "Système d'images",
    description: "Gestion des images optimisées et responsives dans le site",
    icon: <Image className="h-12 w-12 text-primary/70" />,
    href: "/exemples/images",
  }
];

export default function ExamplesIndexPage() {
  return (
    <div className="container max-w-4xl py-12">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link href="/" className="hover:text-foreground">
            Accueil
          </Link>
          <span>/</span>
          <span>Exemples</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Exemples et Démonstrations</h1>
        <p className="text-xl text-muted-foreground mt-2">
          Découvrez les différents composants et fonctionnalités disponibles sur le site
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {examples.map((example) => (
          <Card key={example.id} className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{example.title}</CardTitle>
                {example.icon}
              </div>
              <CardDescription>{example.description}</CardDescription>
            </CardHeader>
            <CardFooter className="bg-muted/30 p-4">
              <Button asChild variant="default" size="sm" className="w-full">
                <Link href={example.href} className="inline-flex items-center justify-center gap-2">
                  Voir l'exemple
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}

        {/* Carte pour un exemple à venir */}
        <Card className="overflow-hidden bg-muted/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl text-muted-foreground">Bientôt disponible</CardTitle>
              <Lightbulb className="h-12 w-12 text-muted-foreground/40" />
            </div>
            <CardDescription>Plus d'exemples seront ajoutés prochainement...</CardDescription>
          </CardHeader>
          <CardFooter className="bg-muted/20 p-4">
            <Button disabled variant="outline" size="sm" className="w-full opacity-60">
              <span className="inline-flex items-center justify-center gap-2">
                En développement
                <PenTool className="h-4 w-4" />
              </span>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-12 border-t pt-8">
        <div className="prose">
          <h2>À propos des exemples</h2>
          <p>
            Ces pages de démonstration vous permettent d'explorer les composants et fonctionnalités
            disponibles sur le site de l'EPLS. Elles servent à la fois de documentation technique 
            pour les développeurs et d'aperçu des possibilités offertes aux contributeurs du site.
          </p>
          <p>
            Les exemples présentent les meilleures pratiques pour la mise en page, la typographie,
            les couleurs et l'interface utilisateur, tout en respectant l'identité visuelle de l'église.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <Button asChild variant="outline" size="sm">
          <Link href="/" className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>
        </Button>
      </div>
    </div>
  );
} 