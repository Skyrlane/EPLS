import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const routes = [
  {
    href: "/",
    label: "Accueil",
  },
  {
    href: "/a-propos",
    label: "À propos",
  },
  {
    href: "/contact",
    label: "Contact",
  },
];

export function NavBar() {
  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 font-bold">
          <span className="text-lg md:text-xl">EPLS</span>
        </Link>
        
        <div className="hidden md:flex md:items-center md:gap-6">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {route.label}
            </Link>
          ))}
          <Button variant="outline" size="sm" asChild>
            <Link href="/connexion">Connexion</Link>
          </Button>
        </div>
        
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Menu de navigation">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col space-y-4 mt-8">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className="text-base font-medium transition-colors hover:text-primary"
                >
                  {route.label}
                </Link>
              ))}
              <Button variant="outline" size="sm" asChild className="mt-4">
                <Link href="/connexion">Connexion</Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
} 