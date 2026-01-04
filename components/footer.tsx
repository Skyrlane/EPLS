"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { LogIn, User } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { user, loading } = useAuth();

  return (
    <footer className="bg-muted/50 border-t" role="contentinfo" aria-label="Pied de page">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold mb-4">EPLS</h3>
            <p className="text-muted-foreground">
              Eglise Protestante Libre de Strasbourg, une communaute chretienne
              accueillante et vivante.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2" role="list">
              <li>
                <Link
                  href="/notre-eglise"
                  className="text-muted-foreground hover:text-primary"
                >
                  Notre eglise
                </Link>
              </li>
              <li>
                <Link
                  href="/culte/programme"
                  className="text-muted-foreground hover:text-primary"
                >
                  Programme des cultes
                </Link>
              </li>
              <li>
                <Link
                  href="/messages"
                  className="text-muted-foreground hover:text-primary"
                >
                  Messages
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/infos-docs/mentions-legales"
                  className="text-muted-foreground hover:text-primary"
                >
                  Mentions legales
                </Link>
              </li>
              <li>
                <Link
                  href="/infos-docs/politique-confidentialite"
                  className="text-muted-foreground hover:text-primary"
                >
                  Politique de confidentialite
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2" role="list">
              <li>
                <Link
                  href="/culte/calendrier"
                  className="text-muted-foreground hover:text-primary"
                >
                  Calendrier
                </Link>
              </li>
              <li>
                <Link
                  href="/echo"
                  className="text-muted-foreground hover:text-primary"
                >
                  Echo - Bulletin mensuel
                </Link>
              </li>
              <li>
                <Link
                  href="/membres"
                  className="text-muted-foreground hover:text-primary"
                >
                  Espace membres
                </Link>
              </li>
              <li>
                <Link
                  href="/galerie"
                  className="text-muted-foreground hover:text-primary"
                >
                  Galerie photos
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {user ? "Mon compte" : "Connexion"}
            </h3>
            {loading ? (
              <div className="h-10 w-28 bg-muted animate-pulse rounded-md" />
            ) : user ? (
              <Link
                href="/membres"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
              >
                <User className="h-4 w-4" />
                Espace membres
              </Link>
            ) : (
              <Link
                href="/connexion"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
              >
                <LogIn className="h-4 w-4" />
                Connexion
              </Link>
            )}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Nous suivre</h3>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-foreground hover:text-primary"
                  aria-label="Facebook"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                    aria-hidden="true"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-foreground hover:text-primary"
                  aria-label="YouTube"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                    aria-hidden="true"
                  >
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between">
            <p className="text-sm text-muted-foreground">
              &copy; {currentYear} Eglise Protestante Libre de Strasbourg - Tous
              droits reserves.
            </p>
            <div className="mt-4 md:mt-0">
              <ul className="flex flex-wrap gap-4 text-sm text-muted-foreground" role="list">
                <li>
                  <Link
                    href="/infos-docs/mentions-legales"
                    className="hover:text-primary"
                  >
                    Mentions legales
                  </Link>
                </li>
                <li>
                  <Link
                    href="/infos-docs/politique-confidentialite"
                    className="hover:text-primary"
                  >
                    Politique de confidentialite
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
