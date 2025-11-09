import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] py-20">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Page non trouvée</h2>
      <p className="text-center text-gray-600 mb-8 max-w-md">
        Désolé, la page que vous recherchez n&apos;existe pas ou a été déplacée.
      </p>
      <div className="space-y-4">
        <Button asChild size="lg">
          <Link href="/">Retour à l&apos;accueil</Link>
        </Button>
        <div className="pt-4 text-center">
          <p className="text-sm text-gray-500">
            Vous pouvez également consulter notre{" "}
            <Link href="/blog" className="text-primary hover:underline">
              blog
            </Link>{" "}
            ou{" "}
            <Link href="/contact" className="text-primary hover:underline">
              nous contacter
            </Link>{" "}
            si vous avez besoin d&apos;aide.
          </p>
        </div>
      </div>
    </div>
  );
} 