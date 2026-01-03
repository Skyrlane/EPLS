"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, LogOut } from "lucide-react";
import { AdminGuard } from "@/components/auth/admin-guard";
import { useUserData } from "@/hooks/use-user-data";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Auth } from "firebase/auth";

interface AdminLayoutClientProps {
  children: React.ReactNode;
}

export function AdminLayoutClient({ children }: AdminLayoutClientProps) {
  const { userData } = useUserData();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut(auth as Auth);
      toast({
        title: "Déconnexion réussie",
        variant: "default",
      });
      router.push("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  return (
    <AdminGuard>
      {/* Header admin */}
      <header className="border-b bg-white dark:bg-slate-900 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-xl font-bold">
              EPLS Admin
            </Link>
            {userData && (
              <span className="text-sm text-muted-foreground hidden sm:inline">
                Connecté en tant que {userData.displayName}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Accueil
              </Link>
            </Button>
            <Button onClick={handleLogout} variant="ghost" size="sm" className="text-red-600">
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Déconnexion</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="min-h-[calc(100vh-120px)]">
        {children}
      </main>

      {/* Footer simple */}
      <footer className="border-t bg-gray-50 dark:bg-slate-900 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} EPLS - Interface d'administration
        </div>
      </footer>
    </AdminGuard>
  );
}
