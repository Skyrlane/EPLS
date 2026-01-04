"use client"

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { MenuIcon, XIcon } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { AuthButton } from "@/components/auth/auth-button";

const navigationLinks = [
  { href: "/notre-eglise", label: "Notre eglise" },
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

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Fermer le menu lorsque la taille de l'ecran change
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

  const isActive = (path: string) => {
    if (path === "/") return pathname === path;
    return pathname?.startsWith(path);
  };

  return (
    <header className="bg-background border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-foreground">
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
                      : "text-foreground hover:text-primary"
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
            <AuthButton variant="desktop" />
          </div>
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Button
              onClick={toggleMenu}
              variant="ghost"
              size="icon"
              className="text-foreground focus:outline-none"
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
        className={`md:hidden bg-background border-t overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0 border-t-0'
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
                    : "text-foreground hover:text-primary"
                }`}
                aria-current={isActive(link.href) ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t">
              <AuthButton variant="mobile" onAction={closeMenu} />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
