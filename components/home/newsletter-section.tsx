import { useState } from "react";
import { SectionContainer } from "@/components/ui/section-container";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Simulation d'une requête d'API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validation simple côté client
      if (!email.includes('@')) {
        throw new Error("Veuillez entrer une adresse email valide");
      }

      // Réinitialiser le formulaire après succès
      setEmail("");
      setIsSuccess(true);
      
      // Masquer le message de succès après 5 secondes
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SectionContainer background="light">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Restez informés</h2>
        <p className="text-lg text-gray-600 mb-8">
          Inscrivez-vous à notre newsletter pour recevoir nos dernières actualités et annonces.
        </p>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre adresse email"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
                disabled={isSubmitting}
              />
            </div>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="py-3 px-6"
            >
              {isSubmitting ? "Envoi..." : "S'inscrire"}
            </Button>
          </div>
          
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
          
          {isSuccess && (
            <p className="mt-2 text-sm text-green-600">
              Merci pour votre inscription ! Vous recevrez bientôt nos prochaines communications.
            </p>
          )}
        </form>

        <p className="text-sm text-gray-500 mt-4">
          Nous respectons votre vie privée. Vous pouvez vous désinscrire à tout moment.
        </p>
      </div>
    </SectionContainer>
  );
} 