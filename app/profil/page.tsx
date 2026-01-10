"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserData } from "@/hooks/use-user-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, Shield, Mail, Calendar } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProfilPage() {
  const { user, userData, loading, isAdmin } = useUserData();
  const router = useRouter();

  useEffect(() => {
    // Si pas connecté et chargement terminé, rediriger vers connexion
    if (!loading && !user) {
      router.replace("/connexion?callbackUrl=/profil");
    }
  }, [user, loading, router]);

  // État de chargement
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  // Si pas connecté (en attente de redirection)
  if (!user) {
    return null;
  }

  const displayName = userData?.displayName || user.email?.split("@")[0] || "Utilisateur";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Mon Profil", href: "/profil", isCurrent: true },
  ];

  return (
    <>
      <PageHeader
        title="Mon Profil"
        breadcrumbs={breadcrumbItems}
      />

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Informations du compte</CardTitle>
                <CardDescription>
                  Détails de votre compte membre EPLS
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar et nom */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={userData?.photoURL} alt={displayName} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold">{displayName}</h2>
                    {isAdmin && (
                      <Badge variant="default" className="mt-2 gap-1">
                        <Shield className="h-3 w-3" />
                        Administrateur
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Informations détaillées */}
                <div className="border-t pt-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Adresse email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>

                  {userData?.createdAt && (
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Membre depuis</p>
                        <p className="font-medium">
                          {new Date(userData.createdAt).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  )}

                  {userData?.lastLogin && (
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Dernière connexion</p>
                        <p className="font-medium">
                          {new Date(userData.lastLogin).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions admin */}
                {isAdmin && (
                  <div className="border-t pt-6">
                    <h3 className="font-semibold mb-3">Accès administrateur</h3>
                    <Button asChild variant="outline" className="gap-2">
                      <Link href="/admin">
                        <Shield className="h-4 w-4" />
                        Accéder à l'administration
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
