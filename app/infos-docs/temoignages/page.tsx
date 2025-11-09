"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Sidebar from "../components/Sidebar";

// Données d'exemple pour les témoignages
const testimonials = [
  {
    id: "1",
    name: "Marie",
    title: "Un nouveau départ après l'épreuve",
    excerpt:
      "Marie nous partage comment sa foi l'a soutenue pendant une période difficile de sa vie, et comment elle a trouvé un nouveau départ grâce à sa confiance en Dieu et au soutien de la communauté chrétienne.",
    category: "Guérison",
    date: "12 juin 2023",
    link: "/blog/un-nouveau-depart-apres-epreuve",
    content: true,
  },
  {
    id: "2",
    name: "Paul",
    title: "De l'athéisme à la foi",
    excerpt:
      "Paul raconte son parcours spirituel, de l'athéisme convaincu à la découverte de la foi chrétienne. Un témoignage touchant sur la recherche de sens et la rencontre avec Dieu.",
    category: "Conversion",
    date: "15 mai 2023",
    link: "/blog/atheisme-a-la-foi",
    content: true,
  },
  {
    id: "3",
    name: "Thomas",
    title: "Appelé à servir",
    excerpt:
      "Thomas partage comment il a découvert son appel au service dans l'église, et comment cette mission a transformé sa vie et sa relation avec Dieu et les autres.",
    category: "Vocation",
    date: "7 avril 2023",
    link: "/infos-docs/temoignages/appele-a-servir",
    content: false,
  },
  {
    id: "4",
    name: "Jeanne",
    title: "La prière qui guérit",
    excerpt:
      "Jeanne témoigne d'une guérison qu'elle a vécue suite à la prière de la communauté. Un parcours de foi et d'espérance face à la maladie.",
    category: "Guérison",
    date: "20 mars 2023",
    link: "/infos-docs/temoignages/la-priere-qui-guerit",
    content: false,
  },
  {
    id: "5",
    name: "David",
    title: "Réconciliation familiale",
    excerpt:
      "David raconte comment sa conversion a mené à une réconciliation avec sa famille après des années de conflit. Un témoignage sur le pardon et la grâce.",
    category: "Réconciliation",
    date: "12 février 2023",
    link: "/infos-docs/temoignages/reconciliation-familiale",
    content: false,
  },
  {
    id: "6",
    name: "Sophie",
    title: "Missions en Afrique",
    excerpt:
      "Sophie partage son expérience de mission en Afrique et comment cette aventure a transformé sa vision de la foi et du service chrétien dans le monde.",
    category: "Mission",
    date: "5 janvier 2023",
    link: "/infos-docs/temoignages/missions-en-afrique",
    content: false,
  },
];

// Catégories uniques pour le filtre
const categories = Array.from(new Set(testimonials.map((t) => t.category)));

export default function Temoignages() {
  const searchParams = useSearchParams();
  const [filteredTestimonials, setFilteredTestimonials] = useState(testimonials);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Effet pour filtrer les témoignages quand searchParams change
  useEffect(() => {
    const category = searchParams.get("categorie");
    setActiveCategory(category);
    
    if (category) {
      setFilteredTestimonials(testimonials.filter(t => t.category === category));
    } else {
      setFilteredTestimonials(testimonials);
    }
  }, [searchParams]);

  return (
    <>
      {/* En-tête de la page */}
      <div className="bg-slate-100 dark:bg-slate-800 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Témoignages</h1>

          {/* Fil d'Ariane */}
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
                  <Link href="/infos-docs" className="text-primary hover:text-primary/80">
                    Informations & Documents
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-gray-700 dark:text-gray-300">Témoignages</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Contenu principal */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Introduction */}
            <div className="mb-12 text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">Parcours de foi</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Découvrez les témoignages de membres de notre communauté qui partagent leur parcours de foi,
                leurs expériences spirituelles et comment Dieu a transformé leur vie.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Sidebar */}
              <div className="md:col-span-1">
                <Sidebar />
              </div>
            
              {/* Main Content */}
              <div className="md:col-span-3">
                {/* Filtres par catégorie */}
                <div className="mb-10">
                  <h3 className="text-lg font-medium mb-4">Filtrer par thème :</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant={activeCategory === null ? "default" : "outline"} 
                      className="rounded-full" 
                      asChild
                    >
                      <Link href="/infos-docs/temoignages">Tous</Link>
                    </Button>
                    {categories.map((category) => (
                      <Button 
                        key={category} 
                        variant={activeCategory === category ? "default" : "outline"} 
                        className="rounded-full dark:border-gray-600 dark:text-gray-200 dark:hover:bg-slate-700" 
                        asChild
                      >
                        <Link href={`/infos-docs/temoignages?categorie=${category}`}>{category}</Link>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Message si aucun résultat */}
                {filteredTestimonials.length === 0 && (
                  <div className="text-center py-10">
                    <p className="text-gray-500 dark:text-gray-300">Aucun témoignage trouvé pour cette catégorie.</p>
                    <Button variant="link" asChild className="mt-2">
                      <Link href="/infos-docs/temoignages">Voir tous les témoignages</Link>
                    </Button>
                  </div>
                )}

                {/* Grille de témoignages */}
                {filteredTestimonials.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {filteredTestimonials.map((testimonial) => (
                      <Card key={testimonial.id} className="h-full flex flex-col">
                        <CardHeader>
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs bg-slate-100 dark:bg-slate-700 dark:text-gray-100 px-2 py-1 rounded-full">
                              {testimonial.category}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-300">{testimonial.date}</span>
                          </div>
                          <CardTitle className="text-xl">{testimonial.title}</CardTitle>
                          <p className="text-sm text-gray-500 dark:text-gray-300">Par {testimonial.name}</p>
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col">
                          <p className="text-gray-600 dark:text-gray-300 mb-6 flex-grow">{testimonial.excerpt}</p>
                          <div className="mt-auto">
                            {testimonial.content ? (
                              <Button asChild variant="outline" size="sm">
                                <Link href={testimonial.link}>Lire le témoignage complet</Link>
                              </Button>
                            ) : (
                              <Button variant="outline" size="sm" disabled>
                                Témoignage à venir
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Section partage de témoignage */}
                <div className="mt-16 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 p-8 rounded-lg border border-slate-200">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Partagez votre témoignage</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                      Vous avez une expérience de foi que vous aimeriez partager avec la communauté ? 
                      Votre témoignage pourrait encourager et fortifier la foi d'autres personnes.
                    </p>
                    <Button asChild>
                      <Link href="/contact?sujet=partage-temoignage">
                        Soumettre mon témoignage
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Citation */}
                <div className="mt-12 text-center">
                  <blockquote className="italic text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    "Ils l'ont vaincu par le sang de l'Agneau et par la parole de leur témoignage."
                    <footer className="text-sm mt-2 font-normal text-gray-500 dark:text-gray-400">— Apocalypse 12:11</footer>
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
} 