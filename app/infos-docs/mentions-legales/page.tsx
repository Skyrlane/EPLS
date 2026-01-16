import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Sidebar from "../components/Sidebar"
import { Metadata } from "next"
import { PageHeader } from "@/components/ui/page-header"
import { BreadcrumbItem } from "@/components/ui/breadcrumbs"

export const metadata: Metadata = {
  title: "Mentions légales | Église Protestante Libre de Strasbourg",
  description: "Informations légales, protection des données personnelles et conditions d'utilisation du site de l'Église Protestante Libre de Strasbourg"
}

export default function MentionsLegalesPage() {
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Infos & Docs", href: "/infos-docs" },
    { label: "Mentions légales", href: "/infos-docs/mentions-legales", isCurrent: true },
  ];

  const tableOfContents = [
    { id: "editeur", label: "Éditeur du site" },
    { id: "hebergement", label: "Hébergement" },
    { id: "propriete-intellectuelle", label: "Propriété intellectuelle" },
    { id: "liens-hypertextes", label: "Liens hypertextes" },
    { id: "limitation-responsabilite", label: "Limitation de responsabilité" },
    { id: "droit-applicable", label: "Droit applicable" },
  ];

  return (
    <>
      <PageHeader
        title="Mentions légales"
        description="Informations légales, protection des données personnelles et conditions d'utilisation du site"
        breadcrumbs={breadcrumbItems}
      />

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Sidebar avec sommaire interne */}
              <div className="md:col-span-1">
                <div className="sticky top-24 space-y-6">
                  {/* Sommaire de la page */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Sur cette page</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <nav aria-label="Sommaire des mentions légales">
                        <ul className="space-y-2 text-sm">
                          {tableOfContents.map((item) => (
                            <li key={item.id}>
                              <a
                                href={`#${item.id}`}
                                className="text-muted-foreground hover:text-primary transition-colors"
                              >
                                {item.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </nav>
                    </CardContent>
                  </Card>

                  {/* Sidebar général */}
                  <Sidebar />
                </div>
              </div>
              
              {/* Main Content */}
              <div className="md:col-span-3">
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Informations légales</CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-slate dark:prose-invert max-w-none">
                    {/* Section Éditeur */}
                    <section id="editeur">
                      <h2>Éditeur du site</h2>
                      <p>
                        <strong>Église Protestante Libre de Strasbourg (EPLS)</strong>
                        <br />
                        Association inscrite au Registre des Associations
                        <br />
                        Volume XVIII N° 28
                      </p>
                      <p>
                        <strong>Siège social :</strong>
                        <br />
                        18 rue de Franche-Comté
                        <br />
                        67380 Lingolsheim
                        <br />
                        France
                      </p>
                      <p>
                        <strong>Représentante légale :</strong> Miriam SIEGRIST, Présidente du Conseil
                      </p>
                      <p>
                        <strong>Contact :</strong>{" "}
                        <a href="mailto:wislerdumay@msn.com" className="text-primary hover:underline">
                          wislerdumay@msn.com
                        </a>
                      </p>
                    </section>

                    {/* Section Hébergement */}
                    <section id="hebergement">
                      <h2>Hébergement</h2>
                      
                      <h3>Hébergement web</h3>
                      <p>
                        <strong>Vercel Inc.</strong>
                        <br />
                        340 S Lemon Ave #4133
                        <br />
                        Walnut, CA 91789
                        <br />
                        États-Unis
                        <br />
                        <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          https://vercel.com
                        </a>
                      </p>

                      <h3>Hébergement des données</h3>
                      <p>
                        <strong>Google Firebase (Google LLC)</strong>
                        <br />
                        1600 Amphitheatre Parkway
                        <br />
                        Mountain View, CA 94043
                        <br />
                        États-Unis
                        <br />
                        <a href="https://firebase.google.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          https://firebase.google.com
                        </a>
                      </p>

                      <h3>Nom de domaine</h3>
                      <p>
                        <strong>Infomaniak SA</strong>
                        <br />
                        Avenue de la Praille 26
                        <br />
                        1227 Carouge
                        <br />
                        Suisse
                        <br />
                        <a href="https://www.infomaniak.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          https://www.infomaniak.com
                        </a>
                      </p>
                    </section>

                    {/* Section Propriété intellectuelle */}
                    <section id="propriete-intellectuelle">
                      <h2>Propriété intellectuelle</h2>
                      <p>
                        L&apos;ensemble du contenu de ce site (textes, images, logos, photographies, vidéos, etc.) 
                        est la propriété exclusive de l&apos;Église Protestante Libre de Strasbourg ou de ses 
                        partenaires.
                      </p>
                      <p>
                        Toute reproduction, représentation, modification, publication, adaptation ou transmission 
                        de tout ou partie des éléments du site, par quelque moyen que ce soit, est interdite 
                        sans l&apos;autorisation écrite préalable de l&apos;Église Protestante Libre de Strasbourg.
                      </p>
                      <p>
                        <strong>Exception :</strong> l&apos;utilisation à des fins personnelles et non commerciales 
                        dans un cadre strictement privé est autorisée.
                      </p>
                      <p>
                        Le logo de l&apos;EPLS et les éléments de charte graphique sont des marques déposées. 
                        Toute utilisation non autorisée de ces éléments engage la responsabilité de l&apos;utilisateur.
                      </p>
                    </section>

                    {/* Section Liens hypertextes */}
                    <section id="liens-hypertextes">
                      <h2>Liens hypertextes</h2>
                      <p>
                        Ce site peut contenir des liens vers d&apos;autres sites internet, notamment ceux 
                        d&apos;organisations missionnaires, de fédérations protestantes ou d&apos;autres 
                        partenaires. L&apos;Église Protestante Libre de Strasbourg n&apos;exerce aucun contrôle 
                        sur le contenu de ces sites externes et décline toute responsabilité quant à leur contenu, 
                        leur disponibilité ou leur politique de confidentialité.
                      </p>
                      <p>
                        La création de liens hypertextes vers le site de l&apos;EPLS nécessite une autorisation 
                        préalable. Pour toute demande, veuillez nous contacter via notre{" "}
                        <a href="/contact" className="text-primary hover:underline">formulaire de contact</a>.
                      </p>
                    </section>

                    {/* Section Limitation de responsabilité */}
                    <section id="limitation-responsabilite">
                      <h2>Limitation de responsabilité</h2>
                      <p>
                        L&apos;Église Protestante Libre de Strasbourg s&apos;efforce d&apos;assurer au mieux 
                        l&apos;exactitude et la mise à jour des informations diffusées sur ce site. Toutefois, 
                        elle ne peut garantir l&apos;exactitude, la précision ou l&apos;exhaustivité des 
                        informations mises à disposition.
                      </p>
                      <p>
                        L&apos;EPLS ne saurait être tenue responsable :
                      </p>
                      <ul>
                        <li>Des erreurs ou omissions dans les informations diffusées</li>
                        <li>De l&apos;indisponibilité temporaire ou permanente du site</li>
                        <li>Des dommages directs ou indirects résultant de l&apos;utilisation du site</li>
                        <li>De l&apos;utilisation frauduleuse des informations par des tiers</li>
                      </ul>
                      <p>
                        Les utilisateurs utilisent ce site à leurs propres risques. L&apos;EPLS se réserve 
                        le droit de modifier, corriger ou supprimer le contenu du site à tout moment et sans préavis.
                      </p>
                    </section>

                    {/* Section Droit applicable */}
                    <section id="droit-applicable">
                      <h2>Droit applicable et juridiction compétente</h2>
                      <p>
                        Les présentes mentions légales sont régies par le droit français.
                      </p>
                      <p>
                        En cas de litige relatif à l&apos;interprétation ou à l&apos;exécution des présentes, 
                        et à défaut de résolution amiable, les tribunaux français seront seuls compétents.
                      </p>
                    </section>

                    {/* Date de mise à jour */}
                    <p className="mt-8 pt-4 border-t text-muted-foreground">
                      <em>Dernière mise à jour : 16 janvier 2026</em>
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
} 