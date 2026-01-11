"use client";

import Link from "next/link";
import { useUserData } from "@/hooks/use-user-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Megaphone,
  FileText,
  MessageSquare,
  Calendar,
  BookOpen,
  Image,
  ImageIcon,
  Images,
  Users,
  Globe,
  Cake,
  BookUser,
} from "lucide-react";
import { UsersRound } from "lucide-react";

const adminLinks = [
  {
    href: "/admin/annonces",
    label: "Annonces",
    description: "Gérer les annonces et événements",
    icon: Megaphone,
  },
  {
    href: "/admin/echos",
    label: "Échos",
    description: "Gérer les bulletins mensuels",
    icon: FileText,
  },
  {
    href: "/admin/messages",
    label: "Messages",
    description: "Gérer les prédications",
    icon: MessageSquare,
  },
  {
    href: "/admin/planning-cultes",
    label: "Planning des cultes",
    description: "Gérer le planning mensuel",
    icon: Calendar,
  },
  {
    href: "/admin/blog",
    label: "Blog",
    description: "Gérer les articles de blog",
    icon: BookOpen,
  },
  {
    href: "/admin/photos",
    label: "Galerie photos",
    description: "Gérer les photos",
    icon: Images,
  },
  {
    href: "/admin/hero-image",
    label: "Image d'accueil",
    description: "Gérer l'image hero",
    icon: Image,
  },
  {
    href: "/admin/images-site",
    label: "Images du site",
    description: "Gérer les images statiques",
    icon: ImageIcon,
  },
  {
    href: "/admin/missionnaires",
    label: "Missionnaires",
    description: "Gérer les missionnaires",
    icon: Users,
  },
  {
    href: "/admin/sites-amis",
    label: "Sites amis",
    description: "Gérer les sites partenaires",
    icon: Globe,
  },
  {
    href: "/admin/anniversaires",
    label: "Anniversaires",
    description: "Gérer les anniversaires",
    icon: Cake,
  },
  {
    href: "/admin/carnet-adresses",
    label: "Carnet d'adresses",
    description: "Gérer les contacts",
    icon: BookUser,
  },
  {
    href: "/admin/membres",
    label: "Liste des membres",
    description: "Gérer les membres de l'église",
    icon: UsersRound,
  },
];

export default function AdminPage() {
  const { userData } = useUserData();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Administration</h1>
        <p className="text-muted-foreground">
          Bienvenue {userData?.displayName || "Administrateur"}. Gérez le contenu du site EPLS.
        </p>
      </div>

      {/* Grid des liens admin */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {adminLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link key={link.href} href={link.href}>
              <Card className="h-full hover:bg-accent/50 transition-colors cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{link.label}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{link.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
