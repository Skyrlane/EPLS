"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useUserData } from "@/hooks/use-user-data";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Shield, User } from "lucide-react";
import { Auth } from "firebase/auth";

interface AuthButtonProps {
  variant?: "desktop" | "mobile";
  onAction?: () => void;
}

export function AuthButton({ variant = "desktop", onAction }: AuthButtonProps) {
  const { user, userData, loading, isAdmin } = useUserData();
  const { toast } = useToast();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth as Auth);
      toast({
        title: "Déconnexion réussie",
        variant: "default",
      });
      router.push("/");
      onAction?.();
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion.",
        variant: "destructive",
      });
    }
  };

  // État de chargement
  if (loading) {
    return <div className="h-10 w-24 animate-pulse bg-muted rounded" />;
  }

  // Visiteur non connecté
  if (!user) {
    if (variant === "mobile") {
      return (
        <Button asChild className="w-full">
          <Link href="/connexion" onClick={onAction}>
            Connexion
          </Link>
        </Button>
      );
    }

    return (
      <Button asChild>
        <Link href="/connexion">Connexion</Link>
      </Button>
    );
  }

  // Utilisateur connecté
  const displayName = userData?.displayName || user.email?.split("@")[0] || "Utilisateur";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Version mobile
  if (variant === "mobile") {
    return (
      <div className="flex flex-col gap-2">
        {/* Bouton Espace Administrateur pour les admins */}
        {isAdmin && (
          <Button
            asChild
            variant="outline"
            className="w-full justify-start gap-2"
          >
            <Link href="/admin" onClick={onAction}>
              <Shield className="h-4 w-4" />
              Espace Administrateur
            </Link>
          </Button>
        )}

        {/* Bouton Profil */}
        <Button
          asChild
          variant="ghost"
          className="w-full justify-start gap-2"
        >
          <Link href="/profil" onClick={onAction}>
            <User className="h-4 w-4" />
            Mon profil ({displayName})
          </Link>
        </Button>

        {/* Bouton Déconnexion */}
        <Button
          onClick={() => {
            handleLogout();
            onAction?.();
          }}
          variant="outline"
          className="w-full justify-start gap-2 text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </Button>
      </div>
    );
  }

  // Version desktop
  return (
    <div className="flex items-center gap-3">
      {/* Bouton "Espace Administrateur" pour les admins */}
      {isAdmin && (
        <Button asChild variant="outline" className="gap-2">
          <Link href="/admin">
            <Shield className="h-4 w-4" />
            Espace Administrateur
          </Link>
        </Button>
      )}

      {/* Menu utilisateur (dropdown) */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src={userData?.photoURL} alt={displayName} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          {/* En-tête avec infos utilisateur */}
          <div className="flex items-center justify-start gap-2 p-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={userData?.photoURL} alt={displayName} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1 leading-none">
              <p className="font-medium text-sm">{displayName}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
              {isAdmin && (
                <span className="inline-flex items-center gap-1 text-xs text-primary">
                  <Shield className="h-3 w-3" />
                  Administrateur
                </span>
              )}
            </div>
          </div>

          <DropdownMenuSeparator />

          {/* Lien vers le profil */}
          <DropdownMenuItem asChild>
            <Link href="/profil" className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              Mon profil
            </Link>
          </DropdownMenuItem>

          {/* Lien admin (si admin) */}
          {isAdmin && (
            <DropdownMenuItem asChild>
              <Link href="/admin" className="cursor-pointer">
                <Shield className="mr-2 h-4 w-4" />
                Administration
              </Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          {/* Déconnexion */}
          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
