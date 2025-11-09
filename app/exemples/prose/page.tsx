import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Exemple de Prose | EPLS",
  description: "Démonstration des styles typographiques pour le contenu riche",
};

export default function ProseExamplePage() {
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
          <span>Prose</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Styles Typographiques</h1>
        <p className="text-xl text-muted-foreground mt-2">
          Démonstration des styles pour le contenu riche avec la classe <code>.prose</code>
        </p>
      </div>

      <div className="grid gap-8">
        <div className="p-6 bg-card rounded-lg border">
          <h2 className="text-2xl font-bold mb-4">Qu'est-ce que la classe prose ?</h2>
          <p>
            La classe <code>prose</code> fournit des styles typographiques riches pour le contenu
            généré comme les articles de blog, les messages du forum, ou tout contenu éditorial.
            Elle améliore la lisibilité et la mise en page de votre contenu sans avoir à appliquer
            des classes individuelles à chaque élément.
          </p>
          <p className="mt-2">
            Pour utiliser ces styles, ajoutez simplement la classe <code>prose</code> au conteneur
            parent de votre contenu riche.
          </p>
        </div>

        <div className="prose bg-card rounded-lg border p-6">
          <h1>Exemple de contenu avec styles prose</h1>
          
          <p>
            Bienvenue sur cette page de démonstration des styles typographiques de l'Église Protestante Libre de Strasbourg.
            Ce texte illustre comment les styles <strong>prose</strong> améliorent la présentation du contenu riche.
          </p>
          
          <h2>Une histoire de foi et de communauté</h2>
          
          <p>
            L'Église Protestante Libre de Strasbourg a une longue tradition d'accueil et de partage.
            Fondée sur des principes bibliques solides, notre communauté s'efforce de vivre l'Évangile
            au quotidien dans un esprit de fraternité et d'ouverture.
          </p>
          
          <blockquote>
            "Car là où deux ou trois sont assemblés en mon nom, je suis au milieu d'eux."
            <cite>— Matthieu 18:20</cite>
          </blockquote>
          
          <h3>Nos activités hebdomadaires</h3>
          
          <p>
            Chaque semaine, plusieurs activités sont proposées pour nourrir la foi et renforcer les liens
            communautaires. Voici quelques exemples :
          </p>
          
          <ul>
            <li>Culte dominical à 10h30</li>
            <li>Étude biblique le mercredi soir</li>
            <li>Groupe de prière le vendredi</li>
            <li>Activités pour les enfants et les jeunes</li>
          </ul>
          
          <h3>Programme des événements à venir</h3>
          
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Événement</th>
                <th>Lieu</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>15 juin</td>
                <td>Concert spirituel</td>
                <td>Grande salle</td>
              </tr>
              <tr>
                <td>22 juin</td>
                <td>Journée familiale</td>
                <td>Parc des Contades</td>
              </tr>
              <tr>
                <td>29 juin</td>
                <td>Conférence sur la foi</td>
                <td>Auditorium</td>
              </tr>
            </tbody>
          </table>
          
          <h3>Code d'exemple</h3>
          
          <p>
            Voici un exemple de code pour ajouter la classe prose à votre contenu :
          </p>
          
          <pre><code>{`<div className="prose">
  <h1>Votre titre</h1>
  <p>Votre contenu ici...</p>
</div>`}</code></pre>
          
          <h4>Listes ordonnées</h4>
          
          <p>Les styles prose améliorent également la présentation des listes ordonnées :</p>
          
          <ol>
            <li>Accueil et introduction</li>
            <li>Lecture biblique et méditation</li>
            <li>Temps de prière communautaire</li>
            <li>Partage fraternel</li>
          </ol>
          
          <h5>Notes importantes</h5>
          
          <p>
            Les styles prose sont automatiquement adaptés au <a href="/theme-demo">mode jour/nuit</a>,
            garantissant une excellente lisibilité quelle que soit la préférence de l'utilisateur.
          </p>
          
          <hr />
          
          <p>
            Pour plus d'informations sur notre église et nos activités,
            n'hésitez pas à nous contacter ou à consulter notre calendrier.
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