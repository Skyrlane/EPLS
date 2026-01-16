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

  const tableOfContents = [
    { id: "introduction", label: "Introduction" },
    { id: "responsable", label: "Responsable du traitement" },
    { id: "donnees-collectees", label: "Données collectées" },
    { id: "finalites", label: "Finalités du traitement" },
    { id: "destinataires", label: "Destinataires des données" },
    { id: "transferts", label: "Transferts internationaux" },
    { id: "conservation", label: "Durée de conservation" },
    { id: "securite", label: "Sécurité des données" },
    { id: "cookies", label: "Cookies et traceurs" },
    { id: "droits", label: "Vos droits RGPD" },
    { id: "exercice-droits", label: "Exercice de vos droits" },
    { id: "modifications", label: "Modifications" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <>
      <PageHeader
        title="Politique de confidentialité"
        description="Comment nous collectons, utilisons et protégeons vos données personnelles"
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
                      <nav aria-label="Sommaire de la politique de confidentialité">
                        <ul className="space-y-1.5 text-sm">
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
                    <CardTitle>Protection de vos données personnelles</CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-slate dark:prose-invert max-w-none">
                    
                    {/* A. Introduction */}
                    <section id="introduction">
                      <h2>Introduction et engagement</h2>
                      <p>
                        L&apos;Église Protestante Libre de Strasbourg (EPLS) s&apos;engage à protéger la vie privée 
                        de ses membres et visiteurs. La confiance que vous nous accordez est précieuse, et nous 
                        prenons très au sérieux la protection de vos données personnelles.
                      </p>
                      <p>
                        Cette politique de confidentialité a été rédigée conformément au <strong>Règlement Général 
                        sur la Protection des Données (RGPD)</strong> - Règlement (UE) 2016/679 du 27 avril 2016 - 
                        et à la <strong>Loi Informatique et Libertés</strong> du 6 janvier 1978 modifiée.
                      </p>
                      <p>
                        Elle vous explique de manière transparente quelles données personnelles nous collectons, 
                        pourquoi nous les collectons, comment nous les utilisons et quels sont vos droits.
                      </p>
                    </section>

                    {/* B. Responsable du traitement */}
                    <section id="responsable">
                      <h2>Responsable du traitement</h2>
                      <p>
                        <strong>Église Protestante Libre de Strasbourg (EPLS)</strong>
                        <br />
                        Association inscrite au Registre des Associations, Volume XVIII N° 28
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
                        <strong>Email :</strong>{" "}
                        <a href="mailto:wislerdumay@msn.com" className="text-primary hover:underline">
                          wislerdumay@msn.com
                        </a>
                      </p>
                      
                      <h3>Délégué à la Protection des Données (DPO)</h3>
                      <p>
                        L&apos;EPLS n&apos;a pas désigné de Délégué à la Protection des Données (DPO), cette 
                        désignation n&apos;étant pas obligatoire pour notre association.
                      </p>
                      <p>
                        Pour toute question relative à la protection de vos données personnelles, vous pouvez 
                        contacter directement l&apos;EPLS à l&apos;adresse :{" "}
                        <a href="mailto:wislerdumay@msn.com" className="text-primary hover:underline">
                          wislerdumay@msn.com
                        </a>
                      </p>
                    </section>

                    {/* C. Données collectées */}
                    <section id="donnees-collectees">
                      <h2>Données personnelles collectées</h2>
                      <p>
                        Nous collectons différentes catégories de données personnelles selon les fonctionnalités 
                        du site que vous utilisez. Voici le détail exhaustif de ces données :
                      </p>

                      <h3>1. Annuaire des membres (Carnet d&apos;adresses)</h3>
                      <p><strong>Données collectées :</strong></p>
                      <ul>
                        <li>Nom complet</li>
                        <li>Adresse postale complète</li>
                        <li>Numéro(s) de téléphone (fixe et/ou mobile)</li>
                        <li>Adresse email</li>
                        <li>Statut (membre actif, ancien membre, contact)</li>
                      </ul>
                      <p>
                        <strong>Base légale :</strong> Intérêt légitime (gestion de la communauté paroissiale)
                        <br />
                        <strong>Finalité :</strong> Faciliter la communication et les échanges au sein de la communauté
                        <br />
                        <strong>Personnes concernées :</strong> Environ 104 contacts
                      </p>

                      <h3>2. Anniversaires</h3>
                      <p><strong>Données collectées :</strong></p>
                      <ul>
                        <li>Prénom</li>
                        <li>Nom de famille</li>
                        <li>Date de naissance (jour et mois uniquement, l&apos;année n&apos;est pas affichée publiquement)</li>
                      </ul>
                      <p>
                        <strong>Base légale :</strong> Intérêt légitime (vie communautaire)
                        <br />
                        <strong>Finalité :</strong> Permettre aux membres de célébrer les anniversaires au sein de la communauté
                        <br />
                        <strong>Personnes concernées :</strong> Environ 120 membres
                      </p>

                      <h3>3. Galerie photos</h3>
                      <p><strong>Données collectées :</strong></p>
                      <ul>
                        <li>Photographies prises lors d&apos;événements de l&apos;église (cultes, sorties, camps, etc.)</li>
                        <li>Tags et catégories associés aux photos</li>
                        <li>Métadonnées techniques (date, taille, format)</li>
                      </ul>
                      <p>
                        <strong>Base légale :</strong> Intérêt légitime + Consentement implicite (participation aux événements)
                        <br />
                        <strong>Finalité :</strong> Archivage et partage des moments de vie de la communauté
                        <br />
                        <strong>Note :</strong> Toute personne peut demander la suppression d&apos;une photo où elle apparaît
                      </p>

                      <h3>4. Informations sur les missionnaires</h3>
                      <p><strong>Données collectées :</strong></p>
                      <ul>
                        <li>Nom des familles missionnaires</li>
                        <li>Pays de mission</li>
                        <li>Lettres de nouvelles (PDF)</li>
                        <li>Liens vers vidéos YouTube</li>
                      </ul>
                      <p>
                        <strong>Base légale :</strong> Intérêt légitime (soutien aux missions)
                        <br />
                        <strong>Finalité :</strong> Informer la communauté sur les actions missionnaires soutenues par l&apos;EPLS
                      </p>

                      <h3>5. Formulaire de contact</h3>
                      <p><strong>Données collectées :</strong></p>
                      <ul>
                        <li>Nom</li>
                        <li>Email</li>
                        <li>Message</li>
                      </ul>
                      <p>
                        <strong>Base légale :</strong> Consentement (envoi volontaire du formulaire)
                        <br />
                        <strong>Finalité :</strong> Permettre aux visiteurs de contacter l&apos;église
                        <br />
                        <strong>Conservation :</strong> 3 ans après réception
                        <br />
                        <strong>Traitement :</strong> Envoi par email via Resend (service tiers)
                      </p>

                      <h3>6. Données d&apos;authentification</h3>
                      <p><strong>Données collectées :</strong></p>
                      <ul>
                        <li>Identifiants de connexion (comptes membres partagés de type &quot;membre01@epls.local&quot;)</li>
                        <li>Statut administrateur (booléen dans Firebase)</li>
                      </ul>
                      <p>
                        <strong>Base légale :</strong> Intérêt légitime (sécurisation de l&apos;accès)
                        <br />
                        <strong>Finalité :</strong> Contrôle d&apos;accès aux fonctionnalités réservées aux membres et administrateurs
                        <br />
                        <strong>Note :</strong> Les identifiants de membres sont partagés et non nominatifs
                      </p>
                    </section>

                    {/* D. Finalités */}
                    <section id="finalites">
                      <h2>Finalités du traitement</h2>
                      <p>Vos données personnelles sont traitées pour les finalités suivantes :</p>
                      <ul>
                        <li><strong>Gestion de la vie paroissiale et communautaire</strong> : suivi des membres, organisation des activités</li>
                        <li><strong>Facilitation de la communication</strong> : mise en relation des membres entre eux</li>
                        <li><strong>Archivage des événements</strong> : conservation des photos et souvenirs de la communauté</li>
                        <li><strong>Information sur les missions</strong> : partage des nouvelles des missionnaires soutenus</li>
                        <li><strong>Réponse aux demandes de contact</strong> : traitement des messages reçus via le formulaire</li>
                        <li><strong>Sécurisation de l&apos;accès</strong> : gestion des comptes membres et administrateurs</li>
                      </ul>
                    </section>

                    {/* E. Destinataires */}
                    <section id="destinataires">
                      <h2>Destinataires des données</h2>
                      
                      <h3>Accès interne</h3>
                      <ul>
                        <li>
                          <strong>Membres du conseil de l&apos;EPLS</strong> (moins de 5 personnes) : accès complet aux 
                          données via l&apos;espace administrateur
                        </li>
                        <li>
                          <strong>Membres connectés</strong> : accès en consultation aux annuaires et anniversaires 
                          (données partagées au sein de la communauté)
                        </li>
                        <li>
                          <strong>Public</strong> : accès aux informations générales (pages publiques, informations missionnaires)
                        </li>
                      </ul>
                      <p>
                        <strong>Note :</strong> Les comptes administrateurs utilisent des identifiants communs (non nominatifs) 
                        pour faciliter la gestion collaborative.
                      </p>

                      <h3>Sous-traitants techniques</h3>
                      <p>Nous faisons appel aux prestataires suivants pour le fonctionnement du site :</p>
                      <ul>
                        <li><strong>Vercel Inc.</strong> (États-Unis) : hébergement web</li>
                        <li><strong>Google Firebase / Google LLC</strong> (États-Unis) : base de données et authentification</li>
                        <li><strong>Resend</strong> (États-Unis) : envoi d&apos;emails</li>
                      </ul>
                      <p>
                        Ces prestataires sont conformes au RGPD et ne traitent les données que sur instruction de l&apos;EPLS.
                      </p>

                      <h3>Aucun partage commercial</h3>
                      <p>
                        <strong>Les données ne sont jamais vendues, louées ou partagées avec des tiers à des fins 
                        commerciales ou publicitaires.</strong>
                      </p>
                    </section>

                    {/* F. Transferts internationaux */}
                    <section id="transferts">
                      <h2>Transferts internationaux</h2>
                      <p>
                        Certaines données sont hébergées sur des serveurs situés aux États-Unis via nos prestataires :
                      </p>
                      <ul>
                        <li>Vercel (hébergement web)</li>
                        <li>Google Firebase (base de données)</li>
                        <li>Resend (envoi d&apos;emails)</li>
                      </ul>
                      <p>
                        Ces entreprises sont conformes aux mécanismes de transfert prévus par le RGPD (clauses 
                        contractuelles types, Data Privacy Framework UE-USA) et garantissent un niveau de protection 
                        adéquat pour vos données personnelles.
                      </p>
                    </section>

                    {/* G. Durée de conservation */}
                    <section id="conservation">
                      <h2>Durée de conservation</h2>
                      <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2 pr-4 font-semibold">Type de données</th>
                              <th className="text-left py-2 font-semibold">Durée de conservation</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b">
                              <td className="py-2 pr-4">Membres actifs</td>
                              <td className="py-2">Pendant la durée d&apos;adhésion + 1 an</td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-2 pr-4">Anciens membres</td>
                              <td className="py-2">Suppression sur demande ou 1 an après départ</td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-2 pr-4">Anniversaires</td>
                              <td className="py-2">Pendant la durée d&apos;adhésion + 1 an</td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-2 pr-4">Formulaires de contact</td>
                              <td className="py-2">3 ans après réception</td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-2 pr-4">Photos</td>
                              <td className="py-2">Conservation illimitée (archivage communautaire)<br />Suppression immédiate sur demande pour photos individuelles</td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-2 pr-4">Données d&apos;authentification</td>
                              <td className="py-2">6 mois après inactivité du compte</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <p className="mt-4">
                        <strong>Note :</strong> Les membres ou leurs représentants peuvent demander la suppression 
                        immédiate de leurs données à tout moment.
                      </p>
                    </section>

                    {/* H. Sécurité */}
                    <section id="securite">
                      <h2>Sécurité des données</h2>
                      <p>Nous mettons en œuvre les mesures de sécurité suivantes pour protéger vos données :</p>
                      <ul>
                        <li><strong>Authentification sécurisée</strong> pour l&apos;accès aux données sensibles (Firebase Authentication)</li>
                        <li><strong>Règles de sécurité Firebase</strong> empêchant tout accès non autorisé</li>
                        <li><strong>Hébergement sécurisé</strong> sur des infrastructures professionnelles (Vercel, Firebase)</li>
                        <li><strong>Chiffrement des données en transit</strong> (protocole HTTPS)</li>
                        <li><strong>Accès administrateur limité</strong> et contrôlé (moins de 5 personnes)</li>
                        <li><strong>Sauvegardes régulières</strong> des données</li>
                      </ul>
                      <p>
                        En cas de violation de données, l&apos;EPLS s&apos;engage à notifier les personnes concernées 
                        et la CNIL dans les délais légaux (72 heures).
                      </p>
                    </section>

                    {/* I. Cookies */}
                    <section id="cookies">
                      <h2>Cookies et traceurs</h2>
                      <p>
                        <strong>Le site EPLS n&apos;utilise AUCUN cookie de tracking, publicité ou analyse d&apos;audience.</strong>
                      </p>
                      
                      <h3>Cookies techniques strictement nécessaires</h3>
                      <p>Seuls les cookies suivants sont utilisés :</p>
                      <ul>
                        <li>
                          <strong>Cookies de session Firebase</strong> (authentification) : durée limitée à la session
                        </li>
                      </ul>
                      <p>
                        Ces cookies sont indispensables au fonctionnement du site et ne nécessitent pas de consentement 
                        préalable conformément à la réglementation.
                      </p>
                      <p>
                        <strong>Aucun cookie tiers</strong> (Google Analytics, Facebook Pixel, etc.) n&apos;est utilisé sur ce site.
                      </p>
                    </section>

                    {/* J. Droits RGPD */}
                    <section id="droits">
                      <h2>Vos droits RGPD</h2>
                      <p>
                        Conformément au Règlement Général sur la Protection des Données, vous disposez des droits suivants :
                      </p>

                      <h3>1. Droit d&apos;accès (Article 15 RGPD)</h3>
                      <p>
                        Vous pouvez demander l&apos;accès aux données personnelles vous concernant et obtenir une copie 
                        de ces données.
                      </p>

                      <h3>2. Droit de rectification (Article 16 RGPD)</h3>
                      <p>
                        Vous pouvez demander la correction de données inexactes ou incomplètes vous concernant.
                      </p>

                      <h3>3. Droit à l&apos;effacement - &quot;Droit à l&apos;oubli&quot; (Article 17 RGPD)</h3>
                      <p>
                        Vous pouvez demander la suppression de vos données personnelles dans certaines conditions.
                      </p>

                      <h3>4. Droit à la limitation du traitement (Article 18 RGPD)</h3>
                      <p>
                        Vous pouvez demander de limiter l&apos;utilisation de vos données dans certains cas.
                      </p>

                      <h3>5. Droit à la portabilité (Article 20 RGPD)</h3>
                      <p>
                        Vous pouvez recevoir vos données dans un format structuré, couramment utilisé et lisible 
                        par machine.
                      </p>

                      <h3>6. Droit d&apos;opposition (Article 21 RGPD)</h3>
                      <p>
                        Vous pouvez vous opposer au traitement de vos données pour des motifs légitimes.
                      </p>

                      <h3>7. Droit de retirer votre consentement</h3>
                      <p>
                        Lorsque le traitement est basé sur votre consentement, vous pouvez le retirer à tout moment, 
                        sans que cela ne remette en cause la licéité du traitement effectué avant le retrait.
                      </p>

                      <h3>8. Droit de déposer une plainte</h3>
                      <p>
                        Si vous estimez que vos droits ne sont pas respectés, vous pouvez déposer une réclamation 
                        auprès de la <strong>CNIL</strong> (Commission Nationale de l&apos;Informatique et des Libertés) :
                      </p>
                      <ul>
                        <li>
                          Site web :{" "}
                          <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            https://www.cnil.fr
                          </a>
                        </li>
                        <li>Adresse : 3 Place de Fontenoy - TSA 80715 - 75334 PARIS CEDEX 07</li>
                        <li>Téléphone : 01 53 73 22 22</li>
                      </ul>
                    </section>

                    {/* K. Exercice des droits */}
                    <section id="exercice-droits">
                      <h2>Exercice de vos droits</h2>
                      <p>Pour exercer l&apos;un de vos droits, vous pouvez nous contacter :</p>
                      <ul>
                        <li>
                          <strong>Par email :</strong>{" "}
                          <a href="mailto:wislerdumay@msn.com" className="text-primary hover:underline">
                            wislerdumay@msn.com
                          </a>
                        </li>
                        <li>
                          <strong>Par courrier :</strong>
                          <br />
                          EPLS - Protection des données
                          <br />
                          18 rue de Franche-Comté
                          <br />
                          67380 Lingolsheim
                          <br />
                          France
                        </li>
                      </ul>
                      <p>
                        <strong>Délai de réponse :</strong> Nous nous engageons à répondre dans un délai maximum de 1 mois.
                      </p>
                      <p>
                        <strong>Vérification d&apos;identité :</strong> Pour des raisons de sécurité, une copie de votre 
                        pièce d&apos;identité pourra être demandée pour valider votre identité avant de donner suite 
                        à votre demande.
                      </p>
                    </section>

                    {/* L. Modifications */}
                    <section id="modifications">
                      <h2>Modifications de la politique</h2>
                      <p>
                        L&apos;EPLS se réserve le droit de modifier cette politique de confidentialité à tout moment. 
                        Toute modification sera publiée sur cette page avec la date de mise à jour.
                      </p>
                      <p>
                        En cas de modification majeure affectant vos droits, les membres seront informés par email 
                        ou via une annonce sur le site.
                      </p>
                      <p>
                        Nous vous encourageons à consulter régulièrement cette page pour rester informé de nos 
                        pratiques en matière de protection des données.
                      </p>
                    </section>

                    {/* M. Contact */}
                    <section id="contact">
                      <h2>Contact et questions</h2>
                      <p>
                        Pour toute question concernant cette politique de confidentialité ou le traitement de vos 
                        données personnelles, n&apos;hésitez pas à nous contacter :
                      </p>
                      <p>
                        <strong>Église Protestante Libre de Strasbourg</strong>
                        <br />
                        18 rue de Franche-Comté
                        <br />
                        67380 Lingolsheim
                        <br />
                        France
                      </p>
                      <p>
                        <strong>Email :</strong>{" "}
                        <a href="mailto:wislerdumay@msn.com" className="text-primary hover:underline">
                          wislerdumay@msn.com
                        </a>
                      </p>
                      <p>
                        Vous pouvez également utiliser notre{" "}
                        <a href="/contact" className="text-primary hover:underline">formulaire de contact</a>.
                      </p>
                    </section>

                    {/* N. Date de mise à jour */}
                    <div className="mt-8 pt-4 border-t text-muted-foreground">
                      <p>
                        <strong>Dernière mise à jour :</strong> 16 janvier 2026
                        <br />
                        <strong>Version :</strong> 1.0
                      </p>
                    </div>
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