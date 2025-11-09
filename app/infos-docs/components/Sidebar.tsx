import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Sidebar() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sommaire</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          <li>
            <Link href="/infos-docs/offrandes" className="text-primary hover:underline">
              Offrandes
            </Link>
          </li>
          <li>
            <Link href="/infos-docs/temoignages" className="text-primary hover:underline">
              Témoignages
            </Link>
          </li>
          <li>
            <Link href="/infos-docs/membres" className="text-primary hover:underline">
              Liste des membres
            </Link>
          </li>
          <li>
            <Link href="/infos-docs/carnet-adresse" className="text-primary hover:underline">
              Carnet d&apos;adresses
            </Link>
          </li>
          <li>
            <Link href="/infos-docs/eve" className="text-primary hover:underline">
              Eau Vive Espoir - EVE
            </Link>
          </li>
          <li>
            <Link href="/infos-docs/union-eglise" className="text-primary hover:underline">
              L&apos;Union des Églises évangéliques libres
            </Link>
          </li>
          <li>
            <Link href="/infos-docs/histoire-union" className="text-primary hover:underline">
              L&apos;histoire de l&apos;Union
            </Link>
          </li>
          <li>
            <Link href="/infos-docs/confession-foi" className="text-primary hover:underline">
              Confession de Foi
            </Link>
          </li>
          <li>
            <Link href="/infos-docs/sites-amis" className="text-primary hover:underline">
              Sites amis
            </Link>
          </li>
          <li>
            <Link href="/infos-docs/politique-confidentialite" className="text-primary hover:underline">
              Politique de confidentialité
            </Link>
          </li>
          <li>
            <Link href="/infos-docs/mentions-legales" className="text-primary hover:underline">
              Mentions légales
            </Link>
          </li>
        </ul>
      </CardContent>
    </Card>
  )
} 