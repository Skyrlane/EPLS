import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Sidebar from "../components/Sidebar"
import { Metadata } from "next"
import { PageHeader } from "@/components/ui/page-header"
import { BreadcrumbItem } from "@/components/ui/breadcrumbs"

export const metadata: Metadata = {
  title: "Politique de confidentialité | Église Protestante Libre de Strasbourg",
  description: "Notre politique de confidentialité détaille comment nous collectons, utilisons et protégeons vos données personnelles conformément au RGPD"
}

export default function PolitiqueConfidentialitePage() {
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Infos & Docs", href: "/infos-docs" },
    { label: "Politique de confidentialité", href: "/infos-docs/politique-confidentialite", isCurrent: true },
  ];

  return (
    <>
      <PageHeader
        title="Politique de confidentialité"
        description="Comment nous collectons, utilisons et protégeons vos données personnelles"
        breadcrumbs={breadcrumbItems}
      />

      {/* Main Content */}
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
                    <CardTitle>Protection de vos données personnelles</CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-slate max-w-none">
                    <p>
                      L&apos;Église Protestante Libre de Strasbourg s&apos;engage à protéger la vie privée des utilisateurs
                      de son site internet et à assurer la confidentialité des informations personnelles fournies.
                    </p>

                    <h2>Collecte des données personnelles</h2>
                    <p>Nous collectons des informations personnelles lorsque vous :</p>
                    <ul>
                      <li>Remplissez un formulaire de contact</li>
                      <li>Vous inscrivez à notre newsletter</li>
                      <li>Créez un compte sur notre espace membre</li>
                      <li>Faites un don en ligne</li>
                    </ul>
                    <p>Les informations personnelles que nous collectons peuvent inclure :</p>
                    <ul>
                      <li>Nom et prénom</li>
                      <li>Adresse email</li>
                      <li>Numéro de téléphone</li>
                      <li>Adresse postale</li>
                    </ul>

                    <h2>Utilisation des données personnelles</h2>
                    <p>Nous utilisons vos données personnelles pour :</p>
                    <ul>
                      <li>Répondre à vos demandes d&apos;information</li>
                      <li>Vous envoyer notre newsletter si vous vous y êtes inscrit</li>
                      <li>Gérer votre compte membre</li>
                      <li>Traiter vos dons</li>
                      <li>Améliorer notre site web et nos services</li>
                    </ul>

                    <h2>Conservation des données</h2>
                    <p>
                      Nous conservons vos données personnelles aussi longtemps que nécessaire pour atteindre les finalités
                      pour lesquelles elles ont été collectées, sauf si une période de conservation plus longue est requise
                      ou permise par la loi.
                    </p>

                    <h2>Partage des données personnelles</h2>
                    <p>
                      Nous ne vendons, n&apos;échangeons ni ne transférons vos informations personnelles à des tiers, sauf
                      dans les cas suivants :
                    </p>
                    <ul>
                      <li>Lorsque cela est nécessaire pour répondre à votre demande</li>
                      <li>Lorsque nous avons votre consentement pour le faire</li>
                      <li>Lorsque cela est requis par la loi</li>
                    </ul>

                    <h2>Sécurité des données</h2>
                    <p>
                      Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données personnelles
                      contre tout accès non autorisé, altération, divulgation ou destruction.
                    </p>

                    <h2>Cookies</h2>
                    <p>
                      Notre site utilise des cookies pour améliorer votre expérience de navigation. Les cookies sont de
                      petits fichiers texte stockés sur votre ordinateur qui nous aident à :
                    </p>
                    <ul>
                      <li>Comprendre comment vous utilisez notre site</li>
                      <li>Mémoriser vos préférences</li>
                      <li>Améliorer votre expérience utilisateur</li>
                    </ul>
                    <p>
                      Vous pouvez configurer votre navigateur pour refuser tous les cookies ou pour être averti
                      lorsqu&apos;un cookie est envoyé. Cependant, certaines fonctionnalités du site peuvent ne pas
                      fonctionner correctement si les cookies sont désactivés.
                    </p>

                    <h2>Vos droits</h2>
                    <p>
                      Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits
                      suivants concernant vos données personnelles :
                    </p>
                    <ul>
                      <li>Droit d&apos;accès à vos données personnelles</li>
                      <li>Droit de rectification des données inexactes</li>
                      <li>Droit à l&apos;effacement de vos données (droit à l&apos;oubli)</li>
                      <li>Droit à la limitation du traitement</li>
                      <li>Droit à la portabilité des données</li>
                      <li>Droit d&apos;opposition au traitement</li>
                    </ul>
                    <p>
                      Pour exercer ces droits, veuillez nous contacter via notre{" "}
                      <a href="/contact" className="text-primary hover:underline">formulaire de contact</a>.
                    </p>

                    <h2>Modifications de notre politique de confidentialité</h2>
                    <p>
                      Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. Toute
                      modification sera publiée sur cette page avec la date de mise à jour.
                    </p>

                    <h2>Contact</h2>
                    <p>
                      Si vous avez des questions concernant cette politique de confidentialité, vous pouvez nous contacter à
                      :
                    </p>
                    <p>
                      <strong>Église Protestante Libre de Strasbourg</strong>
                      <br />18 rue de Franche-Comté
                      <br />
                      67380 Lingolsheim
                    </p>
                    <p>
                      Contactez-nous via notre{" "}
                      <a href="/contact" className="text-primary hover:underline">formulaire de contact</a>.
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