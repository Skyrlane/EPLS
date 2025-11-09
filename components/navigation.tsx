"use client"

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Button } from "./ui/button";
import { signOut } from "firebase/auth";
import { LogOutIcon, MenuIcon, XIcon, UserIcon } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const navigationLinks = [
  { href: "/notre-eglise", label: "Notre église" },
  { href: "/culte", label: "Cultes" },
  { href: "/culte/calendrier", label: "Calendrier" },
  { href: "/messages", label: "Messages" },
  { href: "/blog", label: "Blog" },
  { href: "/echo", label: "Echo" },
  { href: "/galerie", label: "Galerie" },
  { href: "/infos-docs", label: "Infos & Docs" },
  { href: "/contact", label: "Contact" },
];

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Fermer le menu lorsque la taille de l'écran change
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fermer le menu lors du changement de page
  useEffect(() => {
    closeMenu();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      // La redirection sera gérée par le middleware ou la fonction logout
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  const isActive = (path: string) => {
    if (path === "/") return pathname === path;
    return pathname?.startsWith(path);
  };

  return (
    <header className="bg-background border-b sticky top-0 z-50 dark:bg-slate-900 dark:border-slate-800">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold dark:text-white">
              EPLS
            </Link>
            <nav className="hidden md:ml-10 md:flex md:items-center md:space-x-4" aria-label="Navigation principale">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors duration-200 ${
                    isActive(link.href)
                      ? "text-primary font-medium"
                      : "text-foreground hover:text-primary dark:text-gray-100"
                  }`}
                  aria-current={isActive(link.href) ? "page" : undefined}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-4">
            <ThemeToggle />
            {user ? (
              <>
                <Button asChild variant="ghost" className="gap-2 dark:text-gray-100 dark:hover:bg-slate-800" aria-label="Accéder à l'espace membres">
                  <Link href="/membres">
                    <UserIcon className="h-4 w-4" />
                    Espace membres
                  </Link>
                </Button>
                <Button 
                  onClick={handleLogout} 
                  variant="outline" 
                  className="gap-2 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-slate-800"
                  aria-label="Se déconnecter"
                >
                  <LogOutIcon className="h-4 w-4" />
                  Déconnexion
                </Button>
              </>
            ) : (
              <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground dark:text-white">
                <Link href="/connexion">Connexion</Link>
              </Button>
            )}
          </div>
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Button
              onClick={toggleMenu}
              variant="ghost"
              size="icon"
              className="text-foreground focus:outline-none dark:text-gray-100"
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {isMenuOpen ? (
                <XIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Menu mobile avec transition fluide */}
      <div 
        className={`md:hidden bg-background border-t dark:bg-slate-900 dark:border-slate-800 overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 border-t-0'
        }`}
      >
        <div className={`container mx-auto px-4 py-4 ${isMenuOpen ? 'py-4' : 'py-0'}`}>
          <nav className="flex flex-col space-y-4" aria-label="Navigation mobile">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors duration-200 ${
                  isActive(link.href)
                    ? "text-primary font-medium"
                    : "text-foreground hover:text-primary dark:text-gray-100"
                }`}
                aria-current={isActive(link.href) ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t dark:border-slate-800">
              {user ? (
                <>
                  <Button asChild variant="ghost" className="w-full justify-start mb-2 dark:text-gray-100 dark:hover:bg-slate-800">
                    <Link href="/membres" className="gap-2">
                      <UserIcon className="h-4 w-4" />
                      Espace membres
                    </Link>
                  </Button>
                  <Button 
                    onClick={handleLogout} 
                    variant="outline" 
                    className="w-full justify-start gap-2 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-slate-800"
                  >
                    <LogOutIcon className="h-4 w-4" />
                    Déconnexion
                  </Button>
                </>
              ) : (
                <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground dark:text-white">
                  <Link href="/connexion">Connexion</Link>
                </Button>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
} 