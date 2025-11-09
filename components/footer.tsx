import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary/10 dark:bg-slate-900 border-t dark:border-slate-800" role="contentinfo" aria-label="Pied de page">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold mb-4 dark:text-white">EPLS</h3>
            <p className="text-muted-foreground dark:text-gray-300">
              Église Protestante Libre de Strasbourg, une communauté chrétienne
              accueillante et vivante.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Liens rapides</h3>
            <ul className="space-y-2" role="list">
              <li>
                <Link
                  href="/notre-eglise"
                  className="text-muted-foreground hover:text-primary dark:text-gray-300 dark:hover:text-primary"
                >
                  Notre église
                </Link>
              </li>
              <li>
                <Link
                  href="/culte/programme"
                  className="text-muted-foreground hover:text-primary dark:text-gray-300 dark:hover:text-primary"
                >
                  Programme des cultes
                </Link>
              </li>
              <li>
                <Link
                  href="/messages"
                  className="text-muted-foreground hover:text-primary dark:text-gray-300 dark:hover:text-primary"
                >
                  Messages
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary dark:text-gray-300 dark:hover:text-primary"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/infos-docs/mentions-legales"
                  className="text-muted-foreground hover:text-primary dark:text-gray-300 dark:hover:text-primary"
                >
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link
                  href="/infos-docs/politique-confidentialite"
                  className="text-muted-foreground hover:text-primary dark:text-gray-300 dark:hover:text-primary"
                >
                  Politique de confidentialité
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Services</h3>
            <ul className="space-y-2" role="list">
              <li>
                <Link
                  href="/culte/calendrier"
                  className="text-muted-foreground hover:text-primary dark:text-gray-300 dark:hover:text-primary"
                >
                  Calendrier
                </Link>
              </li>
              <li>
                <Link
                  href="/echo"
                  className="text-muted-foreground hover:text-primary dark:text-gray-300 dark:hover:text-primary"
                >
                  Echo - Bulletin mensuel
                </Link>
              </li>
              <li>
                <Link
                  href="/membres"
                  className="text-muted-foreground hover:text-primary dark:text-gray-300 dark:hover:text-primary"
                >
                  Espace membres
                </Link>
              </li>
              <li>
                <Link
                  href="/galerie"
                  className="text-muted-foreground hover:text-primary dark:text-gray-300 dark:hover:text-primary"
                >
                  Galerie photos
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Connexion</h3>
            <Link
              href="/connexion"
              className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
            >
              Connexion
            </Link>
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">Nous suivre</h3>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-foreground hover:text-primary dark:text-gray-200"
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
                  className="text-foreground hover:text-primary dark:text-gray-200"
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
        <div className="border-t dark:border-slate-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between">
            <p className="text-sm text-muted-foreground dark:text-gray-400">
              &copy; {currentYear} Église Protestante Libre de Strasbourg - Tous
              droits réservés.
            </p>
            <div className="mt-4 md:mt-0">
              <ul className="flex flex-wrap gap-4 text-sm text-muted-foreground dark:text-gray-400" role="list">
                <li>
                  <Link
                    href="/infos-docs/mentions-legales"
                    className="hover:text-primary dark:hover:text-primary"
                  >
                    Mentions légales
                  </Link>
                </li>
                <li>
                  <Link
                    href="/infos-docs/politique-confidentialite"
                    className="hover:text-primary dark:hover:text-primary"
                  >
                    Politique de confidentialité
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