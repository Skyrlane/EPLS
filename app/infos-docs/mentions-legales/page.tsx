import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Sidebar from "../components/Sidebar"
import { Metadata } from "next"
import { Breadcrumb, BreadcrumbLink } from "@/components/ui/breadcrumb"
import { PageHeader } from "@/components/ui/page-header"

export const metadata: Metadata = {
  title: "Mentions légales | Église Protestante Libre de Strasbourg",
  description: "Informations légales, protection des données personnelles et conditions d'utilisation du site de l'Église Protestante Libre de Strasbourg"
}

export default function MentionsLegalesPage() {
  return (
    <>
      <PageHeader
        title="Mentions légales"
        description="Informations légales, protection des données personnelles et conditions d'utilisation du site"
      >
        <Breadcrumb
          segments={[
            { href: "/infos-docs", label: "Infos & Documents" }
          ]}
          currentPage="Mentions légales"
        />
      </PageHeader>

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
                    <CardTitle>Informations légales</CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-slate max-w-none">
                    <h2>Éditeur du site</h2>
                    <p>
                      <strong>Église Protestante Libre de Strasbourg</strong>
                      <br />
                      Association cultuelle loi 1905
                      <br />7 rue des Écrivains
                      <br />
                      67000 Strasbourg
                      <br />
                      France
                    </p>
                    <p>
                      <strong>Représentant légal :</strong> Samuel Dupont, Pasteur
                      <br />
                      <strong>Téléphone :</strong> 03 XX XX XX XX
                      <br />
                      <strong>Email :</strong> contact@epls.fr
                    </p>

                    <h2>Hébergement</h2>
                    <p>
                      <strong>Vercel Inc.</strong>
                      <br />
                      340 S Lemon Ave #4133
                      <br />
                      Walnut, CA 91789
                      <br />
                      États-Unis
                    </p>

                    <h2>Propriété intellectuelle</h2>
                    <p>
                      L&apos;ensemble du contenu de ce site (textes, images, photographies, logo, etc.) est la propriété
                      exclusive de l&apos;Église Protestante Libre de Strasbourg ou de ses partenaires. Toute reproduction,
                      représentation, modification, publication, transmission, dénaturation, totale ou partielle du site ou
                      de son contenu, par quelque procédé que ce soit, et sur quelque support que ce soit est interdite sans
                      l&apos;autorisation écrite préalable de l&apos;Église Protestante Libre de Strasbourg.
                    </p>

                    <h2>Protection des données personnelles</h2>
                    <p>
                      Conformément à la loi Informatique et Libertés du 6 janvier 1978 modifiée, et au Règlement Général sur
                      la Protection des Données (RGPD) 2016/679 du Parlement européen et du Conseil du 27 avril 2016, vous
                      disposez d&apos;un droit d&apos;accès, de rectification, de suppression et d&apos;opposition aux
                      données personnelles vous concernant.
                    </p>
                    <p>
                      Pour exercer ces droits, vous pouvez nous contacter à l&apos;adresse email suivante : contact@epls.fr
                      ou par courrier à l&apos;adresse postale indiquée ci-dessus.
                    </p>

                    <h2>Cookies</h2>
                    <p>
                      Ce site utilise des cookies pour améliorer l&apos;expérience utilisateur. En naviguant sur ce site,
                      vous acceptez l&apos;utilisation de cookies conformément à notre politique de confidentialité.
                    </p>

                    <h2>Liens hypertextes</h2>
                    <p>
                      Ce site peut contenir des liens vers d&apos;autres sites internet ou d&apos;autres ressources
                      disponibles sur Internet. L&apos;Église Protestante Libre de Strasbourg ne dispose d&apos;aucun moyen
                      pour contrôler les sites en connexion avec son site internet et ne répond pas de la disponibilité de
                      tels sites et sources externes, ni ne la garantit.
                    </p>

                    <h2>Limitation de responsabilité</h2>
                    <p>
                      L&apos;Église Protestante Libre de Strasbourg s&apos;efforce d&apos;assurer au mieux de ses
                      possibilités l&apos;exactitude et la mise à jour des informations diffusées sur ce site, dont elle se
                      réserve le droit de corriger, à tout moment et sans préavis, le contenu. Toutefois, elle ne peut
                      garantir l&apos;exactitude, la précision ou l&apos;exhaustivité des informations mises à disposition
                      sur ce site.
                    </p>

                    <h2>Droit applicable et juridiction compétente</h2>
                    <p>
                      Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux
                      français seront seuls compétents.
                    </p>

                    <p>
                      <em>Dernière mise à jour : 16 avril 2024</em>
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